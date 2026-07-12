# 08 — Screen Documentation

This document covers **220 screens** across all modules. Given the scale, screens are documented in two layers:

1. **Full Template Screens** (Section A) — 8 representative screens documented with every required attribute (Purpose, Components, API Used, Buttons, Navigation, Validation, States, Permissions, Deep Links, Analytics Events, Complexity, Time, Screen ID, Route). Engineers should replicate this exact template per screen during sprint planning/ticket creation.
2. **Full Screen Inventory** (Section B) — all 220 screens listed with Screen ID, Route, Module, Purpose, Complexity, and Estimated Time, sufficient for backlog creation and estimation. Each row expands to the Section A template at ticket-creation time.

---

## Section A — Full Template Screens (Reference Examples)

### A1. Splash Screen

- **Screen ID:** SCR-001
- **Route Name:** `/splash`
- **Purpose:** App entry point; check auth state, fetch remote config/feature flags, route to onboarding/login/home.
- **Components:** Logo animation, version label, background gradient.
- **API Used:** `GET /config/remote`, `GET /auth/session/validate`
- **Buttons:** None (auto-advance)
- **Navigation:** → Onboarding (first launch) / → Login (logged out) / → Home (logged in, valid session)
- **Validation:** N/A
- **States:** Loading (default), Error (config fetch fail → proceed with cached/defaults)
- **Loading:** Full-screen animated logo, max 2s before fallback route
- **Empty:** N/A
- **Offline:** Proceed with cached config and last known auth state
- **Errors:** Silent fallback to Login on any failure
- **Success:** Route determined and navigated within 2.5s (P90)
- **Permissions:** None requested here
- **Deep Links:** N/A (entry point only)
- **Analytics Events:** `app_opened`, `splash_route_decided`
- **Estimated Development Complexity:** Low
- **Estimated Time:** 1 day

### A2. Phone OTP Screen

- **Screen ID:** SCR-006
- **Route Name:** `/auth/otp`
- **Purpose:** Verify phone number via 6-digit OTP.
- **Components:** OTP input (6 boxes), resend timer, phone number display, edit-number link.
- **API Used:** `POST /auth/otp/verify`, `POST /auth/otp/resend`
- **Buttons:** Verify, Resend OTP (disabled with countdown), Edit Number
- **Navigation:** → Register (new user) / → Home (existing user) / ← back to Login
- **Validation:** 6-digit numeric, auto-submit on complete entry, max 5 attempts before lockout
- **States:** Default, Loading (verifying), Error (invalid/expired OTP), Locked (too many attempts)
- **Loading:** Inline spinner on Verify button
- **Empty:** N/A
- **Offline:** Show offline banner, disable Verify until connection restored
- **Errors:** "Invalid OTP", "OTP expired, resend", "Too many attempts, try after 15 min"
- **Success:** Haptic + auto-navigate on verification
- **Permissions:** SMS autofill permission (Android) for auto-read OTP
- **Deep Links:** `ridingverse://auth/otp?phone=...` (from SMS link, rare)
- **Analytics Events:** `otp_requested`, `otp_verified`, `otp_failed`, `otp_resent`
- **Estimated Development Complexity:** Medium
- **Estimated Time:** 2 days

### A3. Live Ride Recording Screen

- **Screen ID:** SCR-085
- **Route Name:** `/ride/live/:rideId`
- **Purpose:** Core ride recording UI — shown while actively riding; large glove-friendly controls.
- **Components:** Map view with live position, speed dial, distance/time counters, pause/stop buttons, SOS quick-access button, group rider avatars (if group ride).
- **API Used:** `POST /rides/:id/points` (batched), `WS /rides/:id/live`, `POST /rides/:id/pause`, `POST /rides/:id/stop`
- **Buttons:** Pause, Resume, Stop & Save, SOS (floating, always visible)
- **Navigation:** → Ride Summary (on stop) / → SOS Flow (on SOS tap)
- **Validation:** GPS permission must be granted; min GPS accuracy threshold for point acceptance
- **States:** Recording (active), Paused, Reconnecting (GPS/network lost), Ended
- **Loading:** Map tiles lazy-load; GPS lock spinner before recording starts
- **Empty:** N/A
- **Offline:** Buffer GPS points locally (SQLite), sync on reconnect; show "Offline — recording locally" banner
- **Errors:** GPS signal lost warning, low battery warning
- **Success:** Ride saved confirmation, transitions to summary
- **Permissions:** Location (Always/While Using), Motion & Fitness (for crash detection sensors), Notifications
- **Deep Links:** `ridingverse://ride/live/{rideId}`
- **Analytics Events:** `ride_started`, `ride_paused`, `ride_resumed`, `ride_stopped`, `sos_triggered_from_ride`
- **Estimated Development Complexity:** High
- **Estimated Time:** 10 days

### A4. SOS Trigger & Confirmation Screen

- **Screen ID:** SCR-092
- **Route Name:** `/safety/sos`
- **Purpose:** Emergency alert trigger with cancel window before notifying contacts.
- **Components:** Large SOS button, countdown timer (15–30s), cancel button, medical info preview.
- **API Used:** `POST /safety/sos/trigger`, `POST /safety/sos/cancel`
- **Buttons:** Cancel (prominent), Call Emergency Services (tel: link)
- **Navigation:** → SOS Active screen (contacts notified) / dismiss on cancel
- **Validation:** Requires at least one emergency contact configured (else prompts setup first)
- **States:** Countdown, Cancelled, Triggered/Notifying, Resolved
- **Loading:** N/A (instant local countdown)
- **Empty:** No emergency contacts → redirect to setup with warning
- **Offline:** Falls back to SMS-based contact alert if data connection unavailable
- **Errors:** "Failed to notify contact X — retrying via SMS"
- **Success:** "Contacts notified" confirmation with delivery status per contact
- **Permissions:** Location, SMS (Android, for fallback), Contacts (to select emergency contacts)
- **Deep Links:** `ridingverse://safety/sos` (also triggerable from crash detection)
- **Analytics Events:** `sos_triggered`, `sos_cancelled`, `sos_contacts_notified`, `sos_resolved`
- **Estimated Development Complexity:** High
- **Estimated Time:** 8 days

### A5. Club Home Screen

- **Screen ID:** SCR-121
- **Route Name:** `/clubs/:clubId`
- **Purpose:** Public/member view of a riding club's profile, activity, and membership.
- **Components:** Club banner/logo, member count, verified badge, tabs (Feed/Events/Members/About), join/request button.
- **API Used:** `GET /clubs/:id`, `GET /clubs/:id/feed`, `POST /clubs/:id/join`
- **Buttons:** Join Club, Message Admins, Share Club, Create Event (admin only)
- **Navigation:** → Club Feed / → Event Detail / → Member List / → Club Settings (admin)
- **Validation:** Join requires profile completion; private clubs require approval
- **States:** Public (browsing), Member (joined), Pending (request sent), Admin (management view)
- **Loading:** Skeleton loaders for banner/feed
- **Empty:** "No posts yet — be the first to post" empty state
- **Offline:** Show cached club data with "last updated" timestamp
- **Errors:** "Club not found", "Unable to join — try again"
- **Success:** "You've joined {ClubName}" toast
- **Permissions:** None additional
- **Deep Links:** `ridingverse://clubs/{clubId}`
- **Analytics Events:** `club_viewed`, `club_join_requested`, `club_joined`, `club_event_created`
- **Estimated Development Complexity:** Medium
- **Estimated Time:** 6 days

### A6. Marketplace Listing Detail Screen

- **Screen ID:** SCR-160
- **Route Name:** `/marketplace/listing/:id`
- **Purpose:** View details of an accessory/used bike/service listing, contact seller, purchase.
- **Components:** Image carousel, price, seller card (with verified badge/rating), description, "similar listings" carousel.
- **API Used:** `GET /marketplace/listings/:id`, `POST /marketplace/listings/:id/wishlist`, `POST /orders`
- **Buttons:** Buy Now / Add to Cart, Chat with Seller, Add to Wishlist, Report Listing
- **Navigation:** → Chat Screen / → Checkout / → Seller Profile
- **Validation:** Buy Now requires verified payment method
- **States:** Available, Sold, Reserved, Removed
- **Loading:** Skeleton image/text loaders
- **Empty:** N/A
- **Offline:** Cached view with "may be outdated" banner; purchase disabled offline
- **Errors:** "Listing no longer available"
- **Success:** Order placed confirmation
- **Permissions:** None additional
- **Deep Links:** `ridingverse://marketplace/listing/{id}`
- **Analytics Events:** `listing_viewed`, `listing_wishlisted`, `listing_purchased`, `listing_reported`
- **Estimated Development Complexity:** Medium
- **Estimated Time:** 5 days

### A7. MotoGP Career Roadmap Screen

- **Screen ID:** SCR-205
- **Route Name:** `/career/roadmap`
- **Purpose:** Interactive age/country-wise pathway from beginner to professional racing.
- **Components:** Stepper/timeline UI, milestone cards (license, academy, championship level), cost estimator widget, "Talk to an academy" CTA.
- **API Used:** `GET /career/roadmap?age=&country=`, `GET /career/academies`
- **Buttons:** View Academy, Estimate Costs, Connect with Mentor, Mark Milestone Complete
- **Navigation:** → Academy Directory / → Academy Detail / → Mentor Directory
- **Validation:** Age/experience inputs required to personalize roadmap
- **States:** Default (generic roadmap), Personalized (after inputs), Milestone-tracked (logged-in progress)
- **Loading:** Skeleton timeline
- **Empty:** "No academies found in your state yet" with nearest alternatives
- **Offline:** Cached last-fetched roadmap
- **Errors:** Standard retry banner
- **Success:** Milestone marked complete with celebratory animation
- **Permissions:** None additional
- **Deep Links:** `ridingverse://career/roadmap`
- **Analytics Events:** `career_roadmap_viewed`, `career_milestone_completed`, `academy_contacted`
- **Estimated Development Complexity:** High
- **Estimated Time:** 12 days

### A8. Admin Moderation Queue Screen (Web Admin Panel)

- **Screen ID:** SCR-ADM-010
- **Route Name:** `/admin/moderation`
- **Purpose:** Review flagged posts/comments/listings/users for policy violations.
- **Components:** Filterable queue table, content preview pane, action buttons, moderator notes field.
- **API Used:** `GET /admin/moderation/queue`, `POST /admin/moderation/:id/action`
- **Buttons:** Approve, Remove, Warn User, Ban User, Escalate
- **Navigation:** → User Detail / → Content Detail
- **Validation:** Action requires a reason code selection
- **States:** Queue (pending items), Empty (queue cleared), Filtered
- **Loading:** Table skeleton
- **Empty:** "Moderation queue is clear 🎉"
- **Offline:** N/A (admin web tool, assumes connectivity)
- **Errors:** "Action failed — retry"
- **Success:** Row removed from queue with audit log entry created
- **Permissions:** Admin/moderator role required (RBAC)
- **Deep Links:** N/A (internal admin tool)
- **Analytics Events:** `moderation_action_taken`, `moderation_queue_viewed`
- **Estimated Development Complexity:** Medium
- **Estimated Time:** 6 days

---

## Section B — Full Screen Inventory (220 Screens)

Format: `Screen ID | Route | Module | Purpose | Complexity | Est. Time`

### Onboarding & Authentication (SCR-001 to SCR-018)

| ID      | Route                               | Purpose                         | Complexity | Est. Time |
| ------- | ----------------------------------- | ------------------------------- | ---------- | --------- |
| SCR-001 | /splash                             | App entry/session check         | Low        | 1d        |
| SCR-002 | /onboarding/1                       | Value prop slide 1 (Community)  | Low        | 1d        |
| SCR-003 | /onboarding/2                       | Value prop slide 2 (Safety)     | Low        | 1d        |
| SCR-004 | /onboarding/3                       | Value prop slide 3 (Navigation) | Low        | 1d        |
| SCR-005 | /onboarding/permissions             | Request core permissions        | Medium     | 2d        |
| SCR-006 | /auth/otp                           | Phone OTP verification          | Medium     | 2d        |
| SCR-007 | /auth/login                         | Login method selection          | Low        | 2d        |
| SCR-008 | /auth/phone-entry                   | Phone number entry              | Low        | 1d        |
| SCR-009 | /auth/email-login                   | Email/password login            | Low        | 2d        |
| SCR-010 | /auth/register                      | New user registration           | Medium     | 3d        |
| SCR-011 | /auth/passkey-setup                 | Passkey enrollment              | Medium     | 3d        |
| SCR-012 | /onboarding/profile-setup           | Name/avatar/username setup      | Medium     | 3d        |
| SCR-013 | /onboarding/select-motorcycle       | Select first bike               | Medium     | 3d        |
| SCR-014 | /onboarding/select-interests        | Riding style/interest tags      | Low        | 2d        |
| SCR-015 | /onboarding/emergency-contact-setup | First emergency contact setup   | Medium     | 2d        |
| SCR-016 | /auth/forgot-password               | Password recovery               | Low        | 1d        |
| SCR-017 | /auth/parental-consent              | Consent flow for minors         | Medium     | 3d        |
| SCR-018 | /auth/session-expired               | Re-auth prompt modal            | Low        | 1d        |

### Profile (SCR-019 to SCR-032)

| ID      | Route                       | Purpose                           | Complexity | Est. Time |
| ------- | --------------------------- | --------------------------------- | ---------- | --------- |
| SCR-019 | /profile/me                 | Own profile view                  | Medium     | 4d        |
| SCR-020 | /profile/:userId            | Public profile view (other users) | Medium     | 3d        |
| SCR-021 | /profile/edit               | Edit profile fields               | Medium     | 3d        |
| SCR-022 | /profile/edit/avatar        | Avatar upload/crop                | Low        | 2d        |
| SCR-023 | /profile/edit/cover-photo   | Cover photo upload                | Low        | 1d        |
| SCR-024 | /profile/privacy-settings   | Visibility controls               | Medium     | 2d        |
| SCR-025 | /profile/medical-info       | Blood group/medical fields        | Low        | 1d        |
| SCR-026 | /profile/emergency-contacts | Manage SOS contacts               | High       | 4d        |
| SCR-027 | /profile/language           | Language preference               | Low        | 1d        |
| SCR-028 | /profile/verification       | Identity verification flow        | High       | 5d        |
| SCR-029 | /profile/stats              | Rider stats summary               | Medium     | 3d        |
| SCR-030 | /profile/badges             | Badge collection view             | Low        | 2d        |
| SCR-031 | /profile/followers          | Followers list                    | Low        | 2d        |
| SCR-032 | /profile/following          | Following list                    | Low        | 2d        |

### Garage & Motorcycles (SCR-033 to SCR-050)

| ID      | Route                            | Purpose                     | Complexity | Est. Time |
| ------- | -------------------------------- | --------------------------- | ---------- | --------- |
| SCR-033 | /garage                          | Garage home (bike list)     | Medium     | 3d        |
| SCR-034 | /garage/add                      | Add motorcycle flow         | Medium     | 4d        |
| SCR-035 | /garage/add/select-manufacturer  | Manufacturer picker         | Low        | 2d        |
| SCR-036 | /garage/add/select-model         | Model picker                | Low        | 2d        |
| SCR-037 | /garage/add/select-variant       | Variant/year picker         | Low        | 2d        |
| SCR-038 | /garage/:bikeId                  | Bike detail view            | Medium     | 4d        |
| SCR-039 | /garage/:bikeId/edit             | Edit bike details           | Medium     | 2d        |
| SCR-040 | /garage/:bikeId/documents        | RC/insurance/PUC documents  | High       | 4d        |
| SCR-041 | /garage/:bikeId/documents/upload | Document upload flow        | Medium     | 3d        |
| SCR-042 | /garage/:bikeId/maintenance      | Maintenance/service history | High       | 5d        |
| SCR-043 | /garage/:bikeId/maintenance/add  | Log a service record        | Medium     | 3d        |
| SCR-044 | /garage/:bikeId/reminders        | Set maintenance reminders   | Medium     | 3d        |
| SCR-045 | /garage/:bikeId/expenses         | Expense log                 | Medium     | 3d        |
| SCR-046 | /garage/:bikeId/expenses/add     | Add expense entry           | Low        | 2d        |
| SCR-047 | /garage/:bikeId/fuel-log         | Fuel/mileage log            | Medium     | 3d        |
| SCR-048 | /garage/:bikeId/sell             | List bike for sale          | Medium     | 3d        |
| SCR-049 | /garage/compare                  | Bike comparison tool        | Medium     | 4d        |
| SCR-050 | /garage/:bikeId/odometer-sync    | OBD/manual odometer sync    | Medium     | 3d        |

### Ride Planning & Navigation (SCR-051 to SCR-084)

| ID      | Route                                     | Purpose                             | Complexity | Est. Time |
| ------- | ----------------------------------------- | ----------------------------------- | ---------- | --------- |
| SCR-051 | /rides/plan                               | Route planner home                  | High       | 6d        |
| SCR-052 | /rides/plan/start-end                     | Set start/end points                | Medium     | 3d        |
| SCR-053 | /rides/plan/waypoints                     | Add waypoints                       | Medium     | 4d        |
| SCR-054 | /rides/plan/preview                       | Route preview map                   | High       | 5d        |
| SCR-055 | /rides/plan/elevation                     | Elevation profile view              | Medium     | 3d        |
| SCR-056 | /rides/plan/multi-day                     | Multi-day tour builder              | High       | 8d        |
| SCR-057 | /rides/plan/multi-day/day/:n              | Per-day itinerary editor            | Medium     | 4d        |
| SCR-058 | /rides/plan/fuel-stops                    | Fuel stop suggestions               | Medium     | 3d        |
| SCR-059 | /rides/plan/hotel-stops                   | Hotel/camping stop suggestions      | Medium     | 3d        |
| SCR-060 | /rides/plan/gpx-import                    | GPX file import                     | Medium     | 3d        |
| SCR-061 | /rides/plan/gpx-export                    | GPX export options                  | Low        | 2d        |
| SCR-062 | /rides/scenic-routes                      | Curated scenic routes browse        | Medium     | 4d        |
| SCR-063 | /rides/adventure-routes                   | Off-road/adventure route browse     | Medium     | 4d        |
| SCR-064 | /rides/road-quality/report                | Report road condition/hazard        | Medium     | 3d        |
| SCR-065 | /rides/road-quality/map                   | Road quality overlay map            | High       | 5d        |
| SCR-066 | /rides/weather                            | Weather forecast on route           | Medium     | 3d        |
| SCR-067 | /navigation                               | Turn-by-turn navigation view        | High       | 10d       |
| SCR-068 | /navigation/offline-maps                  | Offline map region list             | Medium     | 4d        |
| SCR-069 | /navigation/offline-maps/download/:region | Download region map pack            | Medium     | 3d        |
| SCR-070 | /navigation/group-ride                    | Group ride shared navigation        | High       | 6d        |
| SCR-071 | /navigation/hazard-alert                  | In-navigation hazard alert modal    | Medium     | 2d        |
| SCR-072 | /rides/saved-routes                       | Saved/favorite routes list          | Low        | 2d        |
| SCR-073 | /rides/plan/checklist                     | Packing/ride checklist              | Low        | 2d        |
| SCR-074 | /rides/invite                             | Invite riders to planned ride       | Medium     | 3d        |
| SCR-075 | /rides/requests                           | Ride join requests inbox            | Medium     | 3d        |
| SCR-076 | /rides/:rideId/reviews                    | Post-ride reviews (route/organizer) | Medium     | 3d        |
| SCR-077 | /rides/history                            | Past rides list                     | Medium     | 3d        |
| SCR-078 | /rides/:rideId/detail                     | Completed ride detail view          | High       | 5d        |
| SCR-079 | /rides/:rideId/replay                     | Ride replay animation               | High       | 6d        |
| SCR-080 | /rides/:rideId/photos                     | Ride photo gallery                  | Low        | 2d        |
| SCR-081 | /rides/:rideId/videos                     | Ride video gallery                  | Medium     | 3d        |
| SCR-082 | /rides/:rideId/stats                      | Detailed ride stats breakdown       | Medium     | 3d        |
| SCR-083 | /rides/:rideId/edit                       | Edit ride metadata post-hoc         | Low        | 2d        |
| SCR-084 | /rides/:rideId/share                      | Share ride summary                  | Low        | 2d        |

### Live Ride, Live Tracking & Safety (SCR-085 to SCR-105)

| ID      | Route                                | Purpose                                  | Complexity | Est. Time |
| ------- | ------------------------------------ | ---------------------------------------- | ---------- | --------- |
| SCR-085 | /ride/live/:rideId                   | Live ride recording (see A3)             | High       | 10d       |
| SCR-086 | /ride/live/:rideId/group             | Group ride live view w/ avatars          | High       | 6d        |
| SCR-087 | /ride/live/:rideId/pause             | Pause overlay                            | Low        | 1d        |
| SCR-088 | /ride/live/:rideId/summary           | Post-ride summary screen                 | High       | 6d        |
| SCR-089 | /tracking/share/:token               | Public live-tracking web view (non-user) | High       | 6d        |
| SCR-090 | /tracking/settings                   | Live tracking sharing preferences        | Medium     | 2d        |
| SCR-091 | /tracking/nearby-riders              | Nearby riders (opt-in) map               | Medium     | 4d        |
| SCR-092 | /safety/sos                          | SOS trigger/confirmation (see A4)        | High       | 8d        |
| SCR-093 | /safety/sos/active                   | SOS active — contacts notified view      | High       | 4d        |
| SCR-094 | /safety/sos/history                  | Past SOS logs                            | Medium     | 2d        |
| SCR-095 | /safety/crash-detected               | Crash detected countdown modal           | High       | 6d        |
| SCR-096 | /safety/crash/confirmed              | Crash confirmed — help dispatched        | High       | 4d        |
| SCR-097 | /safety/geofence/setup               | Geofence configuration                   | Medium     | 3d        |
| SCR-098 | /safety/geofence/alert               | Geofence breach alert modal              | Low        | 2d        |
| SCR-099 | /safety/speed-alert-settings         | Speed alert threshold settings           | Low        | 1d        |
| SCR-100 | /safety/battery-alert-settings       | Low battery alert settings               | Low        | 1d        |
| SCR-101 | /safety/roadside-assistance          | Request roadside assistance              | Medium     | 4d        |
| SCR-102 | /safety/roadside-assistance/status   | Assistance request status tracker        | Medium     | 3d        |
| SCR-103 | /safety/roadside-assistance/partners | Nearby partner list                      | Medium     | 3d        |
| SCR-104 | /safety/eta-share                    | ETA sharing configuration                | Medium     | 2d        |
| SCR-105 | /safety/weather-warning              | Severe weather warning modal             | Low        | 2d        |

### Community — Feed, Stories, Reels (SCR-106 to SCR-120)

| ID      | Route                       | Purpose                           | Complexity | Est. Time |
| ------- | --------------------------- | --------------------------------- | ---------- | --------- |
| SCR-106 | /feed                       | Main feed                         | High       | 8d        |
| SCR-107 | /feed/create-post           | Create post composer              | Medium     | 5d        |
| SCR-108 | /feed/post/:id              | Post detail w/ comments           | Medium     | 5d        |
| SCR-109 | /feed/post/:id/comments     | Full comments thread              | Medium     | 4d        |
| SCR-110 | /feed/post/:id/likes        | Likes list                        | Low        | 1d        |
| SCR-111 | /feed/hashtag/:tag          | Hashtag discovery feed            | Medium     | 3d        |
| SCR-112 | /feed/bookmarks             | Saved/bookmarked posts            | Low        | 2d        |
| SCR-113 | /feed/report/:postId        | Report post flow                  | Low        | 2d        |
| SCR-114 | /stories                    | Stories tray/viewer               | High       | 6d        |
| SCR-115 | /stories/create             | Create story                      | Medium     | 4d        |
| SCR-116 | /stories/ride-story/:rideId | Auto-generated ride story         | Medium     | 4d        |
| SCR-117 | /reels                      | Reels feed                        | High       | 6d        |
| SCR-118 | /reels/create               | Create reel/short video           | High       | 6d        |
| SCR-119 | /feed/polls/create          | Create poll                       | Low        | 2d        |
| SCR-120 | /feed/live-rides            | Live ride activity feed (friends) | Medium     | 4d        |

### Groups, Clubs & Events (SCR-121 to SCR-140)

| ID      | Route                         | Purpose                         | Complexity | Est. Time |
| ------- | ----------------------------- | ------------------------------- | ---------- | --------- |
| SCR-121 | /clubs/:clubId                | Club home (see A5)              | Medium     | 6d        |
| SCR-122 | /clubs/discover               | Club discovery/search           | Medium     | 4d        |
| SCR-123 | /clubs/create                 | Create club flow                | Medium     | 5d        |
| SCR-124 | /clubs/:clubId/members        | Member list                     | Medium     | 3d        |
| SCR-125 | /clubs/:clubId/members/manage | Member management (admin)       | High       | 5d        |
| SCR-126 | /clubs/:clubId/roles          | Role/moderator assignment       | Medium     | 3d        |
| SCR-127 | /clubs/:clubId/settings       | Club settings                   | Medium     | 3d        |
| SCR-128 | /clubs/:clubId/dues           | Membership dues management      | Medium     | 4d        |
| SCR-129 | /groups/discover              | General groups discovery        | Medium     | 3d        |
| SCR-130 | /groups/:groupId              | Group home                      | Medium     | 4d        |
| SCR-131 | /events/discover              | Event discovery/browse          | Medium     | 4d        |
| SCR-132 | /events/create                | Create event flow               | Medium     | 5d        |
| SCR-133 | /events/:eventId              | Event detail                    | Medium     | 4d        |
| SCR-134 | /events/:eventId/rsvp         | RSVP flow                       | Low        | 2d        |
| SCR-135 | /events/:eventId/tickets      | Ticket tiers/purchase           | High       | 5d        |
| SCR-136 | /events/:eventId/checkin      | QR check-in scanner (organizer) | Medium     | 3d        |
| SCR-137 | /events/:eventId/gallery      | Event photo gallery             | Low        | 2d        |
| SCR-138 | /meetups/discover             | Casual meetup discovery         | Medium     | 3d        |
| SCR-139 | /meetups/create               | Create meetup                   | Low        | 2d        |
| SCR-140 | /events/my-events             | My hosted/attending events      | Medium     | 3d        |

### Messaging (SCR-141 to SCR-150)

| ID      | Route                                | Purpose                            | Complexity | Est. Time |
| ------- | ------------------------------------ | ---------------------------------- | ---------- | --------- |
| SCR-141 | /chat                                | Chat list (conversations)          | Medium     | 5d        |
| SCR-142 | /chat/:conversationId                | 1:1 chat room                      | High       | 8d        |
| SCR-143 | /chat/group/:groupId                 | Group chat room                    | High       | 6d        |
| SCR-144 | /chat/new                            | Start new conversation             | Low        | 2d        |
| SCR-145 | /chat/:conversationId/media          | Shared media gallery               | Low        | 2d        |
| SCR-146 | /chat/:conversationId/location-share | Share location in chat             | Medium     | 3d        |
| SCR-147 | /forum                               | Forum home                         | Medium     | 4d        |
| SCR-148 | /forum/thread/:id                    | Forum thread detail                | Medium     | 3d        |
| SCR-149 | /forum/create-thread                 | Create forum thread                | Low        | 2d        |
| SCR-150 | /chat/settings                       | Chat notification/privacy settings | Low        | 2d        |

### Marketplace (SCR-151 to SCR-175)

| ID      | Route                                | Purpose                                      | Complexity | Est. Time |
| ------- | ------------------------------------ | -------------------------------------------- | ---------- | --------- |
| SCR-151 | /marketplace                         | Marketplace home                             | High       | 6d        |
| SCR-152 | /marketplace/category/:cat           | Category browse (accessories/bikes/services) | Medium     | 4d        |
| SCR-153 | /marketplace/search                  | Marketplace search/filter                    | Medium     | 4d        |
| SCR-154 | /marketplace/create-listing          | Create listing flow                          | High       | 6d        |
| SCR-155 | /marketplace/create-listing/photos   | Listing photo upload                         | Medium     | 2d        |
| SCR-156 | /marketplace/create-listing/details  | Listing details form                         | Medium     | 3d        |
| SCR-157 | /marketplace/create-listing/price    | Pricing/negotiation settings                 | Low        | 2d        |
| SCR-158 | /marketplace/my-listings             | My active listings                           | Medium     | 3d        |
| SCR-159 | /marketplace/listing/:id/edit        | Edit listing                                 | Low        | 2d        |
| SCR-160 | /marketplace/listing/:id             | Listing detail (see A6)                      | Medium     | 5d        |
| SCR-161 | /marketplace/wishlist                | Wishlist                                     | Low        | 2d        |
| SCR-162 | /marketplace/orders                  | Order history                                | Medium     | 3d        |
| SCR-163 | /marketplace/orders/:id              | Order detail/tracking                        | Medium     | 3d        |
| SCR-164 | /marketplace/checkout                | Checkout flow                                | High       | 5d        |
| SCR-165 | /marketplace/seller/:sellerId        | Seller profile                               | Medium     | 3d        |
| SCR-166 | /marketplace/seller/:sellerId/verify | Seller verification flow                     | High       | 4d        |
| SCR-167 | /marketplace/reviews/:listingId      | Reviews for a listing                        | Low        | 2d        |
| SCR-168 | /marketplace/reviews/create          | Submit review                                | Low        | 2d        |
| SCR-169 | /marketplace/used-bikes              | Used bikes dedicated browse                  | Medium     | 4d        |
| SCR-170 | /marketplace/services                | Services/mechanics directory                 | Medium     | 4d        |
| SCR-171 | /marketplace/services/:id            | Mechanic/service provider detail             | Medium     | 3d        |
| SCR-172 | /directory/fuel-stations             | Fuel station directory/map                   | Medium     | 4d        |
| SCR-173 | /directory/ev-charging               | EV charging directory/map                    | Medium     | 4d        |
| SCR-174 | /directory/hotels                    | Rider-friendly hotels directory              | Medium     | 4d        |
| SCR-175 | /directory/camping                   | Camping spots directory                      | Medium     | 3d        |

### Gamification (SCR-176 to SCR-183)

| ID      | Route               | Purpose                          | Complexity | Est. Time |
| ------- | ------------------- | -------------------------------- | ---------- | --------- |
| SCR-176 | /challenges         | Challenges list                  | Medium     | 4d        |
| SCR-177 | /challenges/:id     | Challenge detail/progress        | Medium     | 3d        |
| SCR-178 | /achievements       | Achievements list                | Low        | 2d        |
| SCR-179 | /badges             | Badge collection view            | Low        | 2d        |
| SCR-180 | /leaderboards       | Leaderboards (city/club/friends) | Medium     | 4d        |
| SCR-181 | /rewards            | Rewards redemption center        | Medium     | 3d        |
| SCR-182 | /rewards/:id/redeem | Redeem reward flow               | Low        | 2d        |
| SCR-183 | /challenges/create  | Club/organizer creates challenge | Medium     | 3d        |

### Subscriptions, Wallet & Payments (SCR-184 to SCR-195)

| ID      | Route                    | Purpose                           | Complexity | Est. Time |
| ------- | ------------------------ | --------------------------------- | ---------- | --------- |
| SCR-184 | /subscription/plans      | Plan comparison/upgrade           | High       | 5d        |
| SCR-185 | /subscription/checkout   | Subscription checkout             | High       | 4d        |
| SCR-186 | /subscription/manage     | Manage current subscription       | Medium     | 3d        |
| SCR-187 | /subscription/family     | Family plan management            | Medium     | 4d        |
| SCR-188 | /wallet                  | Wallet home/balance               | Medium     | 3d        |
| SCR-189 | /wallet/add-money        | Add money to wallet               | Medium     | 3d        |
| SCR-190 | /wallet/transactions     | Transaction history               | Medium     | 3d        |
| SCR-191 | /payments/methods        | Manage payment methods            | Medium     | 3d        |
| SCR-192 | /payments/coupon         | Apply coupon/promo code           | Low        | 1d        |
| SCR-193 | /payments/invoice/:id    | Invoice/receipt view              | Low        | 2d        |
| SCR-194 | /subscription/club       | Club subscription tier management | Medium     | 3d        |
| SCR-195 | /payments/refund-request | Refund request flow               | Medium     | 3d        |

### Learning & MotoGP Career (SCR-196 to SCR-212)

| ID      | Route                                 | Purpose                        | Complexity | Est. Time |
| ------- | ------------------------------------- | ------------------------------ | ---------- | --------- |
| SCR-196 | /learning                             | Learning platform home         | Medium     | 5d        |
| SCR-197 | /learning/courses/:level              | Course catalog by level        | Medium     | 4d        |
| SCR-198 | /learning/course/:id                  | Course detail                  | Medium     | 3d        |
| SCR-199 | /learning/course/:id/lesson/:lessonId | Lesson player                  | High       | 6d        |
| SCR-200 | /learning/course/:id/quiz             | Quiz/assessment                | Medium     | 4d        |
| SCR-201 | /learning/certificates                | My certificates                | Medium     | 3d        |
| SCR-202 | /learning/certificates/:id            | Certificate detail/share       | Low        | 2d        |
| SCR-203 | /learning/track-riding                | Track riding modules           | Medium     | 4d        |
| SCR-204 | /learning/maintenance-guides          | Bike maintenance guides        | Medium     | 3d        |
| SCR-205 | /career/roadmap                       | MotoGP career roadmap (see A7) | High       | 12d       |
| SCR-206 | /career/academies                     | Academy directory              | Medium     | 5d        |
| SCR-207 | /career/academies/:id                 | Academy detail                 | Medium     | 4d        |
| SCR-208 | /career/race-results                  | Race results log               | Medium     | 4d        |
| SCR-209 | /career/race-results/add              | Log a race result              | Medium     | 3d        |
| SCR-210 | /career/mentors                       | Mentor/coach directory         | Medium     | 4d        |
| SCR-211 | /career/mentors/:id                   | Mentor profile                 | Medium     | 3d        |
| SCR-212 | /career/cost-estimator                | Career cost estimator tool     | Medium     | 4d        |

### Insurance, Devices & AI (SCR-213 to SCR-220)

| ID      | Route                    | Purpose                        | Complexity | Est. Time |
| ------- | ------------------------ | ------------------------------ | ---------- | --------- |
| SCR-213 | /insurance               | Insurance comparison hub       | Medium     | 4d        |
| SCR-214 | /insurance/claims/file   | File a claim                   | High       | 5d        |
| SCR-215 | /devices/pair            | Pair device (OBD/helmet/etc.)  | High       | 6d        |
| SCR-216 | /devices/:deviceId       | Device data dashboard          | Medium     | 4d        |
| SCR-217 | /ai/assistant            | AI assistant chat home         | High       | 6d        |
| SCR-218 | /ai/trip-planner         | AI trip planner conversation   | High       | 5d        |
| SCR-219 | /ai/mechanical-assistant | AI mechanical diagnosis chat   | High       | 5d        |
| SCR-220 | /ai/ride-summary/:rideId | AI-generated ride summary view | Medium     | 3d        |

### Settings, Search, Notifications (referenced, counted within above ranges where applicable)

Additional utility screens (Search results, Notification center, Settings home, Localization picker, Offline manager) are documented in `09-navigation.md` and `14-notifications.md` respectively to avoid duplication.

### Admin Panel (Web) — see `16-admin-panel.md` for the complete 25-screen admin inventory (dashboard, moderation, CMS, CRM, business management, analytics).
