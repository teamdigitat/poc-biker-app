# 11 — Database Schema (PostgreSQL, Drizzle ORM)

Given the scale (180+ tables), this document uses two layers:

- **Section A:** Full detailed schema (all attributes) for 15 foundational tables as the authoritative template.
- **Section B:** Complete table inventory (180+ tables) grouped by module with core columns, keys, and relationships — sufficient for engineers to generate full Drizzle schema definitions following the Section A template.

**Global conventions applied to every table:**
- Primary key: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- Audit columns: `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` (auto-updated via trigger)
- Soft delete: `deleted_at TIMESTAMPTZ NULL` on all user-generated-content and business-entity tables (excluded for pure log/event tables like `gps_points`, `analytics_events`)
- All foreign keys indexed automatically; additional composite indexes noted per table.

---

## Section A — Full Detail Template Tables

### A1. `users`
**Purpose:** Core rider/user identity record.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| phone | VARCHAR(15) | Yes | — | E.164 format, unique |
| email | VARCHAR(255) | Yes | — | unique, nullable (phone-only users) |
| full_name | VARCHAR(120) | Yes | — | |
| display_name | VARCHAR(60) | Yes | — | |
| username | VARCHAR(30) | No | — | unique, indexed |
| bio | TEXT | Yes | — | max 300 chars enforced at app layer |
| avatar_url | TEXT | Yes | — | S3/MinIO object URL |
| cover_photo_url | TEXT | Yes | — | |
| gender | VARCHAR(20) | Yes | — | enum: male/female/other/undisclosed |
| dob | DATE | Yes | — | used for age-gating |
| blood_group | VARCHAR(5) | Yes | — | for medical/emergency info |
| languages | TEXT[] | Yes | '{}' | array of locale codes |
| city | VARCHAR(80) | Yes | — | |
| state | VARCHAR(80) | Yes | — | |
| country | VARCHAR(80) | Yes | 'India' | |
| latitude | DOUBLE PRECISION | Yes | — | last known/home location |
| longitude | DOUBLE PRECISION | Yes | — | |
| home_location | GEOGRAPHY(POINT) | Yes | — | PostGIS |
| work_location | GEOGRAPHY(POINT) | Yes | — | PostGIS |
| verified | BOOLEAN | No | false | |
| premium | BOOLEAN | No | false | denormalized from subscriptions for fast reads |
| subscription_id | UUID | Yes | — | FK -> subscriptions.id |
| status | VARCHAR(20) | No | 'active' | enum: active/suspended/banned/deactivated |
| last_seen | TIMESTAMPTZ | Yes | — | |
| created_at | TIMESTAMPTZ | No | now() | |
| updated_at | TIMESTAMPTZ | No | now() | |
| deleted_at | TIMESTAMPTZ | Yes | — | soft delete |

- **Indexes:** unique(phone), unique(email), unique(username), btree(city, state), gist(home_location)
- **FKs:** subscription_id -> subscriptions.id (ON DELETE SET NULL)
- **Validation:** phone E.164; username 3-30 chars alphanumeric+underscore; dob must imply age >= 13
- **Lifecycle:** created on registration; soft-deleted on account deletion request (DPDP compliance — hard-delete PII columns via scheduled job after 30-day grace period)
- **Example:** `{id: "uuid", phone: "+919876543210", username: "rahul_rides", city: "Pune", verified: true}`

### A2. `motorcycles`
**Purpose:** A specific rider-owned motorcycle instance in the garage.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| user_id | UUID | No | — | FK -> users.id |
| manufacturer_id | UUID | No | — | FK -> manufacturers.id |
| model_id | UUID | No | — | FK -> models.id |
| variant_id | UUID | Yes | — | FK -> variants.id |
| nickname | VARCHAR(60) | Yes | — | e.g. "Black Beauty" |
| registration_number | VARCHAR(20) | Yes | — | encrypted at rest |
| year | SMALLINT | Yes | — | |
| color | VARCHAR(40) | Yes | — | |
| odometer_km | INTEGER | Yes | 0 | |
| purchase_date | DATE | Yes | — | |
| is_primary | BOOLEAN | No | false | |
| status | VARCHAR(20) | No | 'active' | active/sold/scrapped |
| created_at | TIMESTAMPTZ | No | now() | |
| updated_at | TIMESTAMPTZ | No | now() | |
| deleted_at | TIMESTAMPTZ | Yes | — | |

- **Indexes:** btree(user_id), btree(manufacturer_id, model_id)
- **FKs:** user_id -> users.id (CASCADE), manufacturer_id -> manufacturers.id, model_id -> models.id, variant_id -> variants.id
- **Relationships:** 1 user : many motorcycles; 1 motorcycle : many maintenance_records, garage_documents, fuel_logs

### A3. `rides`
**Purpose:** A single recorded ride (planned or completed).

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| user_id | UUID | No | — | FK -> users.id (ride owner/creator) |
| motorcycle_id | UUID | Yes | — | FK -> motorcycles.id |
| title | VARCHAR(120) | Yes | — | |
| route_id | UUID | Yes | — | FK -> routes.id, if pre-planned |
| status | VARCHAR(20) | No | 'planned' | planned/active/paused/completed/cancelled |
| is_group_ride | BOOLEAN | No | false | |
| start_time | TIMESTAMPTZ | Yes | — | |
| end_time | TIMESTAMPTZ | Yes | — | |
| distance_km | NUMERIC(8,2) | Yes | — | computed on completion |
| duration_seconds | INTEGER | Yes | — | |
| avg_speed_kmh | NUMERIC(6,2) | Yes | — | |
| max_speed_kmh | NUMERIC(6,2) | Yes | — | |
| start_location | GEOGRAPHY(POINT) | Yes | — | |
| end_location | GEOGRAPHY(POINT) | Yes | — | |
| visibility | VARCHAR(20) | No | 'public' | public/followers/private |
| created_at | TIMESTAMPTZ | No | now() | |
| updated_at | TIMESTAMPTZ | No | now() | |
| deleted_at | TIMESTAMPTZ | Yes | — | |

- **Indexes:** btree(user_id, created_at desc), gist(start_location), btree(status)
- **Partitioning:** consider range-partition by `created_at` (monthly) at >50M rows scale
- **Relationships:** 1 ride : many gps_points, ride_participants, ride_photos; many-to-1 route

### A4. `gps_points`
**Purpose:** High-volume raw GPS trace points for a ride (append-only).

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | BIGSERIAL | No | — | PK (bigint for volume) |
| ride_id | UUID | No | — | FK -> rides.id |
| location | GEOGRAPHY(POINT) | No | — | PostGIS point |
| altitude_m | NUMERIC(7,2) | Yes | — | |
| speed_kmh | NUMERIC(6,2) | Yes | — | |
| heading_deg | NUMERIC(5,2) | Yes | — | |
| accuracy_m | NUMERIC(6,2) | Yes | — | |
| recorded_at | TIMESTAMPTZ | No | — | device-side timestamp |
| created_at | TIMESTAMPTZ | No | now() | server ingestion time |

- **Indexes:** btree(ride_id, recorded_at)
- **No soft delete** (append-only log); partition by `ride_id` hash or `created_at` range for scale.
- **Lifecycle:** batched inserts (client buffers ~5-10s of points, POSTs in batches); downsampled for long-term storage after 90 days (keep 1 point/10s instead of 1/sec).

### A5. `live_sessions`
**Purpose:** Active live-tracking session metadata (who can view, expiry).

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| ride_id | UUID | No | — | FK -> rides.id |
| share_token | VARCHAR(64) | No | — | unique, unguessable, for public link |
| viewer_user_ids | UUID[] | Yes | '{}' | in-app viewers (followers/contacts) |
| expires_at | TIMESTAMPTZ | No | — | auto-expire after ride completion + buffer |
| last_location | GEOGRAPHY(POINT) | Yes | — | latest cached position for fast reads |
| last_updated_at | TIMESTAMPTZ | Yes | — | |
| created_at | TIMESTAMPTZ | No | now() | |

- **Indexes:** unique(share_token), btree(ride_id)
- **Note:** backed by Redis for hot read path; Postgres is source of truth/durability.

### A6. `sos_logs`
**Purpose:** Record of every SOS event triggered.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| user_id | UUID | No | — | FK -> users.id |
| ride_id | UUID | Yes | — | FK -> rides.id, if triggered during a ride |
| trigger_type | VARCHAR(20) | No | — | manual/crash_detected |
| location | GEOGRAPHY(POINT) | No | — | |
| status | VARCHAR(20) | No | 'triggered' | triggered/cancelled/notifying/resolved |
| contacts_notified | JSONB | Yes | '[]' | array of {contact_id, channel, status, timestamp} |
| resolved_at | TIMESTAMPTZ | Yes | — | |
| created_at | TIMESTAMPTZ | No | now() | |

- **Indexes:** btree(user_id, created_at desc)
- **Priority:** writes to this table go through a dedicated high-priority queue (BullMQ, priority lane).

### A7. `crash_events`
**Purpose:** ML-detected potential crash events with sensor signal snapshot.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| ride_id | UUID | No | — | FK -> rides.id |
| user_id | UUID | No | — | FK -> users.id |
| detected_at | TIMESTAMPTZ | No | now() | |
| confidence_score | NUMERIC(4,3) | No | — | 0.000–1.000 |
| sensor_snapshot | JSONB | No | — | accel/gyro/speed-drop window data |
| outcome | VARCHAR(20) | No | 'pending' | pending/confirmed_false_alarm/confirmed_crash/no_response_escalated |
| sos_log_id | UUID | Yes | — | FK -> sos_logs.id, if escalated |
| created_at | TIMESTAMPTZ | No | now() | |

- **Indexes:** btree(ride_id), btree(user_id, detected_at desc)

### A8. `clubs`
**Purpose:** Riding club entity.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| name | VARCHAR(100) | No | — | unique per city (app-layer check) |
| slug | VARCHAR(120) | No | — | unique, URL-safe |
| description | TEXT | Yes | — | |
| logo_url | TEXT | Yes | — | |
| banner_url | TEXT | Yes | — | |
| city | VARCHAR(80) | Yes | — | |
| is_private | BOOLEAN | No | false | |
| is_verified | BOOLEAN | No | false | |
| owner_user_id | UUID | No | — | FK -> users.id |
| member_count | INTEGER | No | 0 | denormalized counter |
| created_at | TIMESTAMPTZ | No | now() | |
| updated_at | TIMESTAMPTZ | No | now() | |
| deleted_at | TIMESTAMPTZ | Yes | — | |

- **Indexes:** unique(slug), btree(city)
- **Relationships:** 1 club : many club_members, events, posts (via group_id)

### A9. `subscriptions`
**Purpose:** User/club subscription record.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| user_id | UUID | Yes | — | FK -> users.id (nullable if club subscription) |
| club_id | UUID | Yes | — | FK -> clubs.id |
| plan_id | UUID | No | — | FK -> plans.id |
| status | VARCHAR(20) | No | 'active' | active/cancelled/expired/past_due |
| provider | VARCHAR(20) | No | — | razorpay/stripe/google_play/apple_iap |
| provider_subscription_id | VARCHAR(120) | Yes | — | |
| current_period_start | TIMESTAMPTZ | No | — | |
| current_period_end | TIMESTAMPTZ | No | — | |
| cancel_at_period_end | BOOLEAN | No | false | |
| created_at | TIMESTAMPTZ | No | now() | |
| updated_at | TIMESTAMPTZ | No | now() | |

- **Indexes:** btree(user_id), btree(club_id), unique(provider, provider_subscription_id)

### A10. `listings` (Marketplace)
**Purpose:** A marketplace listing (accessory/used bike/service).

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| seller_id | UUID | No | — | FK -> users.id |
| category | VARCHAR(30) | No | — | accessory/used_bike/service |
| title | VARCHAR(150) | No | — | |
| description | TEXT | Yes | — | |
| price | NUMERIC(10,2) | No | — | |
| currency | VARCHAR(3) | No | 'INR' | |
| condition | VARCHAR(20) | Yes | — | new/used/refurbished |
| location | GEOGRAPHY(POINT) | Yes | — | |
| status | VARCHAR(20) | No | 'active' | active/sold/reserved/removed |
| view_count | INTEGER | No | 0 | |
| created_at | TIMESTAMPTZ | No | now() | |
| updated_at | TIMESTAMPTZ | No | now() | |
| deleted_at | TIMESTAMPTZ | Yes | — | |

- **Indexes:** btree(seller_id), btree(category, status), gist(location)

### A11. `notifications`
**Purpose:** Per-user notification record (in-app + delivery tracking).

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| user_id | UUID | No | — | FK -> users.id |
| type | VARCHAR(40) | No | — | e.g. sos_alert, ride_invite, comment, club_event |
| title | VARCHAR(150) | No | — | |
| body | TEXT | Yes | — | |
| data | JSONB | Yes | '{}' | deep-link payload |
| read_at | TIMESTAMPTZ | Yes | — | |
| channels_sent | TEXT[] | Yes | '{}' | push/sms/email/whatsapp |
| created_at | TIMESTAMPTZ | No | now() | |

- **Indexes:** btree(user_id, created_at desc), btree(user_id, read_at)
- **Partitioning:** range-partition by created_at (monthly) recommended at scale.

### A12. `career_roadmap_milestones`
**Purpose:** MotoGP career roadmap milestone definitions + user progress.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| stage | VARCHAR(30) | No | — | beginner/national/asian/moto3/moto2/motogp |
| title | VARCHAR(150) | No | — | |
| description | TEXT | Yes | — | |
| min_age | SMALLINT | Yes | — | |
| max_age | SMALLINT | Yes | — | |
| country | VARCHAR(80) | Yes | 'India' | |
| estimated_cost_min | NUMERIC(12,2) | Yes | — | |
| estimated_cost_max | NUMERIC(12,2) | Yes | — | |
| sort_order | SMALLINT | No | 0 | |
| created_at | TIMESTAMPTZ | No | now() | |

- **Indexes:** btree(stage, sort_order)

### A13. `academies`
**Purpose:** Racing/riding academy directory entries.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| name | VARCHAR(150) | No | — | |
| type | VARCHAR(30) | No | — | riding_school/racing_academy |
| city | VARCHAR(80) | Yes | — | |
| description | TEXT | Yes | — | |
| is_verified | BOOLEAN | No | false | |
| contact_phone | VARCHAR(15) | Yes | — | |
| contact_email | VARCHAR(255) | Yes | — | |
| affiliated_body | VARCHAR(120) | Yes | — | e.g. MMSC-affiliated |
| created_at | TIMESTAMPTZ | No | now() | |
| updated_at | TIMESTAMPTZ | No | now() | |
| deleted_at | TIMESTAMPTZ | Yes | — | |

- **Indexes:** btree(city, type)

### A14. `devices`
**Purpose:** Registered user devices (for push + session management).

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| user_id | UUID | No | — | FK -> users.id |
| push_token | TEXT | Yes | — | Firebase token |
| platform | VARCHAR(10) | No | — | ios/android |
| device_model | VARCHAR(80) | Yes | — | |
| app_version | VARCHAR(20) | Yes | — | |
| last_active_at | TIMESTAMPTZ | Yes | — | |
| is_trusted | BOOLEAN | No | true | |
| created_at | TIMESTAMPTZ | No | now() | |

- **Indexes:** btree(user_id), unique(push_token)

### A15. `refresh_tokens`
**Purpose:** Rotating refresh token store for JWT auth.

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | UUID | No | gen_random_uuid() | PK |
| user_id | UUID | No | — | FK -> users.id |
| device_id | UUID | Yes | — | FK -> devices.id |
| token_hash | VARCHAR(255) | No | — | hashed, never store raw |
| expires_at | TIMESTAMPTZ | No | — | |
| revoked_at | TIMESTAMPTZ | Yes | — | |
| created_at | TIMESTAMPTZ | No | now() | |

- **Indexes:** btree(user_id), unique(token_hash)

---

## Section B — Full Table Inventory (180+ Tables by Module)

Format: `Table | Purpose | Key Columns | Relationships`

### Identity & Access (12)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| users | Core identity | phone, email, username | 1:many everything |
| roles | Named roles (admin, moderator, club_admin) | name, permissions | many:many via user_roles |
| permissions | Granular permission definitions | key, description | many:many via role_permissions |
| user_roles | User-role assignment | user_id, role_id | users, roles |
| role_permissions | Role-permission mapping | role_id, permission_id | roles, permissions |
| devices | Registered devices | push_token, platform | users |
| sessions | Active login sessions | device_id, ip_address | users, devices |
| refresh_tokens | Rotating JWT refresh tokens | token_hash, expires_at | users, devices |
| otp_requests | OTP request log/rate-limit | phone, code_hash, attempts | — |
| passkeys | WebAuthn credentials | credential_id, public_key | users |
| user_interests | Rider interest tags | user_id, tag | users |
| user_languages | Preferred languages | user_id, locale | users |

### Garage & Vehicles (14)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| manufacturers | Bike manufacturer master | name, country | models |
| models | Bike model master | manufacturer_id, name, category | manufacturers, variants |
| variants | Model year/variant specs | model_id, year, specs (JSONB) | models |
| motorcycles | User-owned bike instance | user_id, model_id, reg_number | users, manufacturers |
| garage_documents | RC/insurance/PUC/license docs | motorcycle_id, doc_type, file_url, expiry_date | motorcycles |
| maintenance_records | Service history entries | motorcycle_id, service_type, odometer, cost | motorcycles |
| service_reminders | Upcoming maintenance reminders | motorcycle_id, due_date, due_km, type | motorcycles |
| expenses | Bike-related expense log | motorcycle_id, category, amount, date | motorcycles |
| fuel_logs | Fuel fill-up records | motorcycle_id, liters, cost, odometer | motorcycles |
| tyre_records | Tyre replacement history | motorcycle_id, position, replaced_at | motorcycles |
| oil_change_records | Oil change history | motorcycle_id, changed_at, odometer | motorcycles |
| bike_specs_cache | Cached spec-sheet data per variant | variant_id, spec_json | variants |
| insurance_policies | Bike insurance policy records | motorcycle_id, provider, policy_number, expiry | motorcycles |
| claims | Insurance claim records | policy_id, incident_date, status | insurance_policies |

### Ride Planning & Navigation (16)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| routes | Planned route definitions | user_id, name, distance_km, polyline | users |
| waypoints | Route stop points | route_id, sequence, location | routes |
| gpx_files | Uploaded/exported GPX file metadata | route_id, file_url | routes |
| scenic_routes | Curated scenic route catalog | region, difficulty, polyline | — |
| adventure_routes | Off-road/adventure route catalog | terrain_type, difficulty | — |
| road_hazards | Crowd-sourced hazard reports | location, type, severity, reported_by | users |
| road_reports | General road condition reports | location, condition, notes | users |
| road_quality_segments | Aggregated road-quality score per segment | segment_id, avg_score | — |
| weather_cache | Cached weather data per region/time | location, forecast_json, cached_at | — |
| offline_map_regions | Downloadable offline map pack metadata | region_name, bounds, size_mb | — |
| user_offline_downloads | Which users downloaded which region | user_id, region_id, downloaded_at | users, offline_map_regions |
| ride_checklists | Packing/ride checklist templates & instances | user_id, items (JSONB) | users |
| fuel_stops_suggested | Cached fuel stop suggestions per route | route_id, station_id, sequence | routes, fuel_stations |
| hotel_stops_suggested | Cached hotel/camp suggestions per route | route_id, hotel_id, sequence | routes, hotels |
| ride_invitations | Invites to join a planned/live ride | ride_id, invited_user_id, status | rides, users |
| ride_join_requests | Requests to join an open group ride | ride_id, requester_id, status | rides, users |

### Rides & Tracking (13)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| rides | Ride record (planned/completed) | user_id, status, distance_km | users, routes, motorcycles |
| ride_participants | Riders in a group ride | ride_id, user_id, role | rides, users |
| gps_points | Raw GPS trace (append-only, high volume) | ride_id, location, recorded_at | rides |
| ride_photos | Photos attached to a ride | ride_id, url | rides |
| ride_videos | Videos attached to a ride | ride_id, url | rides |
| ride_reviews | Post-ride reviews (route/organizer) | ride_id, reviewer_id, rating | rides, users |
| live_sessions | Active live-tracking session metadata | ride_id, share_token, expires_at | rides |
| location_shares | Contact-specific location share grants | ride_id, contact_id, permission | rides |
| ride_stats_cache | Denormalized computed stats per ride | ride_id, avg_speed, elevation_gain | rides |
| ride_summaries_ai | AI-generated ride narrative | ride_id, summary_text, model_used | rides |
| geofences | User-defined geofence zones | user_id, polygon, name | users |
| geofence_events | Geofence entry/exit events | geofence_id, ride_id, event_type | geofences, rides |
| eta_shares | ETA sharing configuration per ride | ride_id, contact_id, eta | rides |

### Safety (9)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| emergency_contacts | User's SOS contact list | user_id, name, phone, relation | users |
| sos_logs | SOS event records | user_id, trigger_type, status | users, rides |
| crash_events | ML-detected crash signals | ride_id, confidence_score, outcome | rides |
| assistance_requests | Roadside assistance requests | user_id, location, status | users |
| assistance_partners | Verified roadside partner directory | name, services, location | — |
| assistance_partner_assignments | Assigned partner per request | request_id, partner_id, status | assistance_requests, assistance_partners |
| speed_alert_settings | Per-user speed threshold config | user_id, threshold_kmh | users |
| battery_alert_settings | Low-battery alert config | user_id, threshold_pct | users |
| weather_warnings_sent | Log of weather warnings delivered | user_id, region, severity | users |

### Community — Content (15)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| posts | Feed posts | user_id, content, media_urls | users |
| comments | Comments on posts | post_id, user_id, content, parent_comment_id | posts, users |
| likes | Likes/reactions | user_id, likeable_type, likeable_id | polymorphic |
| bookmarks | Saved posts | user_id, post_id | users, posts |
| hashtags | Hashtag master | tag, usage_count | — |
| post_hashtags | Post-hashtag mapping | post_id, hashtag_id | posts, hashtags |
| shares | Post share log | user_id, post_id, shared_to | users, posts |
| reports | Content/user report queue | reporter_id, target_type, target_id, reason | users |
| stories | 24h ephemeral stories | user_id, media_url, expires_at | users |
| story_views | Story view tracking | story_id, viewer_id, viewed_at | stories, users |
| reels | Short-form video content | user_id, video_url, caption | users |
| reel_views | Reel view tracking | reel_id, viewer_id | reels, users |
| polls | Poll posts | post_id, question | posts |
| poll_options | Poll answer options | poll_id, option_text, vote_count | polls |
| poll_votes | User poll votes | poll_id, option_id, user_id | polls, poll_options, users |

### Groups, Clubs & Events (16)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| groups | General interest groups | name, is_private | — |
| group_members | Group membership | group_id, user_id, role | groups, users |
| clubs | Riding club entity | name, city, is_verified | users (owner) |
| club_members | Club membership | club_id, user_id, role, joined_at | clubs, users |
| club_roles | Custom club role definitions | club_id, name, permissions | clubs |
| club_dues | Membership fee configuration | club_id, amount, frequency | clubs |
| club_due_payments | Dues payment records | club_due_id, user_id, paid_at | club_dues, users |
| events | Event entity | organizer_id, title, start_time, location | users, clubs |
| event_rsvps | RSVP records | event_id, user_id, status | events, users |
| event_tickets | Ticket tier definitions | event_id, name, price, quantity | events |
| event_ticket_purchases | Ticket purchase records | ticket_id, user_id, order_id | event_tickets, users |
| event_checkins | QR check-in log | event_id, user_id, checked_in_at | events, users |
| event_photos | Event gallery media | event_id, url, uploaded_by | events |
| meetups | Lightweight casual meetups | organizer_id, title, location, time | users |
| meetup_attendees | Meetup attendance | meetup_id, user_id | meetups, users |
| forum_threads | Long-form discussion threads | user_id, title, body | users |

### Messaging (6)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| conversations | Chat conversation metadata | type (1:1/group), name | — |
| conversation_participants | Members in a conversation | conversation_id, user_id | conversations, users |
| messages | Chat messages | conversation_id, sender_id, content, type | conversations, users |
| message_media | Media attachments in messages | message_id, url, media_type | messages |
| message_reads | Read receipt tracking | message_id, user_id, read_at | messages, users |
| forum_replies | Replies to forum threads | thread_id, user_id, body | forum_threads, users |

### Marketplace (14)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| listings | Marketplace listing | seller_id, category, price, status | users |
| listing_photos | Listing images | listing_id, url | listings |
| wishlists | Saved/wishlisted listings | user_id, listing_id | users, listings |
| orders | Marketplace order | buyer_id, listing_id, status, amount | users, listings |
| order_status_history | Order status change log | order_id, status, changed_at | orders |
| reviews | Seller/service reviews | reviewer_id, target_type, target_id, rating | users |
| seller_verifications | Seller verification records | user_id, doc_type, status | users |
| fuel_stations | Fuel station directory | name, location, brand | — |
| ev_stations | EV charging station directory | name, location, connector_type | — |
| hotels | Rider-friendly hotel directory | name, location, amenities | — |
| campsites | Camping spot directory | name, location, facilities | — |
| mechanics | Mechanic/service provider directory | name, location, specialties | — |
| mechanic_reviews | Reviews specific to mechanics | mechanic_id, reviewer_id, rating | mechanics, users |
| businesses | General business entity (dealer/brand) | name, type, owner_user_id | users |

### Gamification (7)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| challenges | Challenge definitions | title, criteria (JSONB), start/end | — |
| challenge_participants | User progress in a challenge | challenge_id, user_id, progress | challenges, users |
| achievements | Achievement definitions | title, criteria | — |
| user_achievements | Unlocked achievements per user | user_id, achievement_id, unlocked_at | users, achievements |
| badges | Badge definitions | name, icon_url | — |
| user_badges | User's earned badges | user_id, badge_id, earned_at | users, badges |
| leaderboard_entries | Cached leaderboard rankings | scope (city/club/global), user_id, score, period | users |

### Payments, Wallet & Subscriptions (10)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| wallets | User wallet balance | user_id, balance, currency | users |
| wallet_transactions | Wallet debit/credit log | wallet_id, amount, type, reference | wallets |
| payment_methods | Saved payment methods | user_id, provider, token | users |
| transactions | Master payment transaction log | user_id, amount, provider, status | users |
| plans | Subscription plan definitions | name, price, features (JSONB), tier | — |
| subscriptions | User/club subscription | user_id, club_id, plan_id, status | users, clubs, plans |
| coupons | Discount/promo codes | code, discount_type, value, expiry | — |
| coupon_redemptions | Coupon usage log | coupon_id, user_id, redeemed_at | coupons, users |
| invoices | Generated invoices/receipts | transaction_id, invoice_number, pdf_url | transactions |
| refund_requests | Refund request tracking | transaction_id, reason, status | transactions |

### Learning & Motorsport (14)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| courses | Course catalog | title, level, description | — |
| lessons | Lessons within a course | course_id, title, content_url, sequence | courses |
| quizzes | Quiz definitions per lesson | lesson_id, questions (JSONB) | lessons |
| quiz_attempts | User quiz attempt records | quiz_id, user_id, score | quizzes, users |
| certificates | Issued certificates | user_id, course_id, issued_at, cert_url | users, courses |
| course_enrollments | User course enrollment | course_id, user_id, progress_pct | courses, users |
| career_roadmap_milestones | Career pathway milestone definitions | stage, min_age, country | — |
| user_career_progress | User progress on roadmap | user_id, milestone_id, completed_at | users, career_roadmap_milestones |
| academies | Racing/riding academy directory | name, type, city | — |
| training_institutes | Formal training institute records | name, affiliated_body | — |
| race_events | Competitive race event records | name, date, location, level | — |
| race_results | User race results | race_event_id, user_id, position, time | race_events, users |
| mentors | Mentor/coach directory | user_id or external_name, specialties | users |
| mentor_connections | Mentee-mentor connection requests | mentor_id, requester_id, status | mentors, users |

### Devices & Integrations (7)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| connected_devices | Paired third-party devices | user_id, device_type, provider | users |
| obd_readings | OBD-II diagnostic readings | device_id, code, value, recorded_at | connected_devices |
| helmet_device_data | Smart helmet telemetry | device_id, data_json | connected_devices |
| intercom_pairings | Intercom pairing status | device_id, paired_at | connected_devices |
| gopro_imports | Imported GoPro footage metadata | user_id, ride_id, file_url | users, rides |
| garmin_syncs | Garmin data sync log | user_id, sync_type, synced_at | users |
| smartwatch_data | Smartwatch companion data | user_id, ride_id, heart_rate_avg | users, rides |

### AI Services (4)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| ai_requests | AI feature request/response log | user_id, feature, prompt, response, model | users |
| ai_ride_summaries | Cached AI ride summaries (also A) | ride_id, summary_text | rides |
| ai_trip_plans | AI-generated trip plan drafts | user_id, criteria_json, plan_json | users |
| ai_mechanical_diagnoses | AI mechanical assistant sessions | user_id, symptoms, diagnosis | users |

### Admin, CMS, Moderation & Business (13)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| admin_users | Internal admin/staff accounts | email, role | — |
| moderation_reports | Moderation queue items | target_type, target_id, status, reason | — |
| moderation_actions | Actions taken by moderators | report_id, moderator_id, action, notes | moderation_reports, admin_users |
| cms_content | Managed content blocks (banners, articles) | key, content_json, published | — |
| brand_pages | Brand portal pages | business_id, name, logo_url | businesses |
| ad_campaigns | Ad campaign definitions | business_id, budget, target_criteria | businesses |
| ad_impressions | Ad impression log | campaign_id, user_id, shown_at | ad_campaigns, users |
| ad_clicks | Ad click log | campaign_id, user_id, clicked_at | ad_campaigns, users |
| support_tickets | Customer support tickets | user_id, subject, status | users |
| support_ticket_messages | Support ticket thread messages | ticket_id, sender_type, body | support_tickets |
| crm_leads | Business CRM lead records | business_id, name, contact, status | businesses |
| feature_flags | Feature flag definitions | key, enabled, rollout_pct | — |
| app_config | Global app configuration key-values | key, value_json | — |

### Analytics, Search & Localization (10)
| Table | Purpose | Key Columns | Relationships |
|---|---|---|---|
| analytics_events | Raw event tracking log | user_id, event_name, properties_json | users |
| aggregated_stats | Precomputed daily/weekly aggregates | metric_key, period, value | — |
| search_index_meta | Search index sync status tracking | entity_type, last_synced_at | — |
| translations | Localized string translations | key, locale, value | — |
| locales | Supported locale definitions | code, name, is_active | — |
| countries | Country reference data | name, iso_code | — |
| states | State reference data | country_id, name | countries |
| cities | City reference data | state_id, name, lat, lng | states |
| api_keys | Developer API keys (Phase 3) | business_id, key_hash, scopes | businesses |
| webhooks | Registered webhook endpoints | business_id, url, events | businesses |

**Section B running total: ~166 tables.** Combined with Section A's 15 fully-detailed tables (all included in the module counts above, e.g. `users`, `motorcycles`, `rides`, etc. are the same tables — Section A is a deep-dive of specific Section B rows, not additive) plus additional straightforward join/reference tables not itemized individually (e.g. `user_follows`, `user_blocks`, `post_media`, `club_invites`, `event_reminders`, `notification_preferences`, `push_notification_log`, `sms_log`, `email_log`, `audit_logs`, `session_activity_log`, `currency_rates`, `unit_preferences`) brings the **total schema to 180+ tables**, consistent with the API modules in `12-api-modules.md`.
