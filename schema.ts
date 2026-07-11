import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  bigserial,
  smallint,
  numeric,
  timestamp,
  jsonb,
  doublePrecision,
  date,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

/* ============================================================
   CUSTOM TYPES
   ============================================================ */

// PostGIS geography(Point) column — requires the `postgis` extension.
const geographyPoint = customType<{ data: string }>({
  dataType() {
    return "geography(Point,4326)";
  },
});

const geographyPolygon = customType<{ data: string }>({
  dataType() {
    return "geography(Polygon,4326)";
  },
});

/* Common column groups reused across tables */
const auditCols = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};
const softDelete = {
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
};

/* ============================================================
   1. IDENTITY & ACCESS
   ============================================================ */

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: varchar("phone", { length: 15 }),
    email: varchar("email", { length: 255 }),
    fullName: varchar("full_name", { length: 120 }),
    displayName: varchar("display_name", { length: 60 }),
    username: varchar("username", { length: 30 }).notNull(),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    coverPhotoUrl: text("cover_photo_url"),
    gender: varchar("gender", { length: 20 }),
    dob: date("dob"),
    bloodGroup: varchar("blood_group", { length: 5 }),
    languages: text("languages").array().default(sql`'{}'::text[]`),
    city: varchar("city", { length: 80 }),
    state: varchar("state", { length: 80 }),
    country: varchar("country", { length: 80 }).default("India"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    homeLocation: geographyPoint("home_location"),
    workLocation: geographyPoint("work_location"),
    verified: boolean("verified").notNull().default(false),
    premium: boolean("premium").notNull().default(false),
    subscriptionId: uuid("subscription_id"),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    lastSeen: timestamp("last_seen", { withTimezone: true }),
    ...auditCols,
    ...softDelete,
  },
  (t) => ({
    phoneIdx: uniqueIndex("users_phone_idx").on(t.phone),
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
    usernameIdx: uniqueIndex("users_username_idx").on(t.username),
    cityStateIdx: index("users_city_state_idx").on(t.city, t.state),
  })
);

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 60 }).notNull().unique(),
  description: text("description"),
  ...auditCols,
});

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  description: text("description"),
  ...auditCols,
});

export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    ...auditCols,
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.roleId] }) })
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.roleId, t.permissionId] }) })
);

export const devices = pgTable("devices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  pushToken: text("push_token"),
  platform: varchar("platform", { length: 10 }).notNull(),
  deviceModel: varchar("device_model", { length: 80 }),
  appVersion: varchar("app_version", { length: 20 }),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
  isTrusted: boolean("is_trusted").notNull().default(true),
  ...auditCols,
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  deviceId: uuid("device_id").references(() => devices.id, { onDelete: "set null" }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  ...auditCols,
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  deviceId: uuid("device_id").references(() => devices.id, { onDelete: "set null" }),
  tokenHash: varchar("token_hash", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const otpRequests = pgTable("otp_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: varchar("phone", { length: 15 }).notNull(),
  codeHash: varchar("code_hash", { length: 255 }).notNull(),
  attempts: smallint("attempts").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const passkeys = pgTable("passkeys", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  credentialId: text("credential_id").notNull().unique(),
  publicKey: text("public_key").notNull(),
  counter: integer("counter").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userInterests = pgTable("user_interests", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tag: varchar("tag", { length: 40 }).notNull(),
});

export const userLanguages = pgTable("user_languages", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  locale: varchar("locale", { length: 10 }).notNull(),
});

export const userFollows = pgTable(
  "user_follows",
  {
    followerId: uuid("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    followingId: uuid("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.followerId, t.followingId] }) })
);

export const userBlocks = pgTable(
  "user_blocks",
  {
    blockerId: uuid("blocker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    blockedId: uuid("blocked_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.blockerId, t.blockedId] }) })
);

/* ============================================================
   2. GARAGE & VEHICLES
   ============================================================ */

export const manufacturers = pgTable("manufacturers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  country: varchar("country", { length: 80 }),
  logoUrl: text("logo_url"),
  ...auditCols,
});

export const models = pgTable("models", {
  id: uuid("id").primaryKey().defaultRandom(),
  manufacturerId: uuid("manufacturer_id").notNull().references(() => manufacturers.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 40 }), // cruiser/adventure/sport/naked/off-road
  ...auditCols,
});

export const variants = pgTable("variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id").notNull().references(() => models.id, { onDelete: "cascade" }),
  year: smallint("year"),
  specs: jsonb("specs").default(sql`'{}'::jsonb`),
  ...auditCols,
});

export const motorcycles = pgTable(
  "motorcycles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    manufacturerId: uuid("manufacturer_id").notNull().references(() => manufacturers.id),
    modelId: uuid("model_id").notNull().references(() => models.id),
    variantId: uuid("variant_id").references(() => variants.id),
    nickname: varchar("nickname", { length: 60 }),
    registrationNumber: text("registration_number"), // app-layer encrypted
    year: smallint("year"),
    color: varchar("color", { length: 40 }),
    odometerKm: integer("odometer_km").default(0),
    purchaseDate: date("purchase_date"),
    isPrimary: boolean("is_primary").notNull().default(false),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    ...auditCols,
    ...softDelete,
  },
  (t) => ({
    userIdx: index("motorcycles_user_idx").on(t.userId),
    manuModelIdx: index("motorcycles_manu_model_idx").on(t.manufacturerId, t.modelId),
  })
);

export const garageDocuments = pgTable("garage_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  motorcycleId: uuid("motorcycle_id").notNull().references(() => motorcycles.id, { onDelete: "cascade" }),
  docType: varchar("doc_type", { length: 30 }).notNull(), // rc/insurance/puc/license
  fileUrl: text("file_url").notNull(),
  expiryDate: date("expiry_date"),
  ...auditCols,
});

export const maintenanceRecords = pgTable("maintenance_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  motorcycleId: uuid("motorcycle_id").notNull().references(() => motorcycles.id, { onDelete: "cascade" }),
  serviceType: varchar("service_type", { length: 60 }).notNull(),
  odometerKm: integer("odometer_km"),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  notes: text("notes"),
  serviceDate: date("service_date"),
  ...auditCols,
});

export const serviceReminders = pgTable("service_reminders", {
  id: uuid("id").primaryKey().defaultRandom(),
  motorcycleId: uuid("motorcycle_id").notNull().references(() => motorcycles.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 60 }).notNull(),
  dueDate: date("due_date"),
  dueKm: integer("due_km"),
  completed: boolean("completed").notNull().default(false),
  ...auditCols,
});

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  motorcycleId: uuid("motorcycle_id").notNull().references(() => motorcycles.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 40 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  expenseDate: date("expense_date"),
  ...auditCols,
});

export const fuelLogs = pgTable("fuel_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  motorcycleId: uuid("motorcycle_id").notNull().references(() => motorcycles.id, { onDelete: "cascade" }),
  liters: numeric("liters", { precision: 6, scale: 2 }),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  odometerKm: integer("odometer_km"),
  filledAt: timestamp("filled_at", { withTimezone: true }),
  ...auditCols,
});

export const tyreRecords = pgTable("tyre_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  motorcycleId: uuid("motorcycle_id").notNull().references(() => motorcycles.id, { onDelete: "cascade" }),
  position: varchar("position", { length: 10 }).notNull(), // front/rear
  replacedAt: date("replaced_at"),
  odometerKm: integer("odometer_km"),
  ...auditCols,
});

export const oilChangeRecords = pgTable("oil_change_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  motorcycleId: uuid("motorcycle_id").notNull().references(() => motorcycles.id, { onDelete: "cascade" }),
  changedAt: date("changed_at"),
  odometerKm: integer("odometer_km"),
  ...auditCols,
});

export const bikeSpecsCache = pgTable("bike_specs_cache", {
  id: uuid("id").primaryKey().defaultRandom(),
  variantId: uuid("variant_id").notNull().references(() => variants.id, { onDelete: "cascade" }),
  specJson: jsonb("spec_json").default(sql`'{}'::jsonb`),
  ...auditCols,
});

export const insurancePolicies = pgTable("insurance_policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  motorcycleId: uuid("motorcycle_id").notNull().references(() => motorcycles.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 100 }),
  policyNumber: varchar("policy_number", { length: 100 }),
  expiryDate: date("expiry_date"),
  ...auditCols,
});

export const claims = pgTable("claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  policyId: uuid("policy_id").notNull().references(() => insurancePolicies.id, { onDelete: "cascade" }),
  incidentDate: date("incident_date"),
  status: varchar("status", { length: 20 }).notNull().default("filed"),
  description: text("description"),
  ...auditCols,
});

/* ============================================================
   3. RIDE PLANNING & NAVIGATION
   ============================================================ */

export const routes = pgTable("routes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 120 }),
  distanceKm: numeric("distance_km", { precision: 8, scale: 2 }),
  polyline: text("polyline"),
  ...auditCols,
  ...softDelete,
});

export const waypoints = pgTable("waypoints", {
  id: uuid("id").primaryKey().defaultRandom(),
  routeId: uuid("route_id").notNull().references(() => routes.id, { onDelete: "cascade" }),
  sequence: smallint("sequence").notNull(),
  location: geographyPoint("location").notNull(),
  label: varchar("label", { length: 120 }),
});

export const gpxFiles = pgTable("gpx_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  routeId: uuid("route_id").references(() => routes.id, { onDelete: "cascade" }),
  fileUrl: text("file_url").notNull(),
  ...auditCols,
});

export const scenicRoutes = pgTable("scenic_routes", {
  id: uuid("id").primaryKey().defaultRandom(),
  region: varchar("region", { length: 80 }),
  difficulty: varchar("difficulty", { length: 20 }),
  polyline: text("polyline"),
  ...auditCols,
});

export const adventureRoutes = pgTable("adventure_routes", {
  id: uuid("id").primaryKey().defaultRandom(),
  terrainType: varchar("terrain_type", { length: 40 }),
  difficulty: varchar("difficulty", { length: 20 }),
  polyline: text("polyline"),
  ...auditCols,
});

export const roadHazards = pgTable(
  "road_hazards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    location: geographyPoint("location").notNull(),
    type: varchar("type", { length: 40 }).notNull(), // pothole/landslide/waterlogging/construction
    severity: varchar("severity", { length: 20 }).notNull().default("medium"),
    reportedBy: uuid("reported_by").references(() => users.id, { onDelete: "set null" }),
    ...auditCols,
  },
  (t) => ({ locIdx: index("road_hazards_loc_idx").using("gist", t.location) })
);

export const roadReports = pgTable("road_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  location: geographyPoint("location").notNull(),
  condition: varchar("condition", { length: 40 }),
  notes: text("notes"),
  reportedBy: uuid("reported_by").references(() => users.id, { onDelete: "set null" }),
  ...auditCols,
});

export const roadQualitySegments = pgTable("road_quality_segments", {
  id: uuid("id").primaryKey().defaultRandom(),
  segmentRef: varchar("segment_ref", { length: 120 }).notNull(),
  avgScore: numeric("avg_score", { precision: 3, scale: 2 }),
  ...auditCols,
});

export const weatherCache = pgTable("weather_cache", {
  id: uuid("id").primaryKey().defaultRandom(),
  location: geographyPoint("location").notNull(),
  forecastJson: jsonb("forecast_json"),
  cachedAt: timestamp("cached_at", { withTimezone: true }).notNull().defaultNow(),
});

export const offlineMapRegions = pgTable("offline_map_regions", {
  id: uuid("id").primaryKey().defaultRandom(),
  regionName: varchar("region_name", { length: 100 }).notNull(),
  bounds: jsonb("bounds").notNull(),
  sizeMb: numeric("size_mb", { precision: 8, scale: 2 }),
  ...auditCols,
});

export const userOfflineDownloads = pgTable("user_offline_downloads", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  regionId: uuid("region_id").notNull().references(() => offlineMapRegions.id, { onDelete: "cascade" }),
  downloadedAt: timestamp("downloaded_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rideChecklists = pgTable("ride_checklists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  items: jsonb("items").default(sql`'[]'::jsonb`),
  ...auditCols,
});

/* ============================================================
   4. RIDES & TRACKING
   ============================================================ */

export const rides = pgTable(
  "rides",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    motorcycleId: uuid("motorcycle_id").references(() => motorcycles.id, { onDelete: "set null" }),
    title: varchar("title", { length: 120 }),
    routeId: uuid("route_id").references(() => routes.id, { onDelete: "set null" }),
    status: varchar("status", { length: 20 }).notNull().default("planned"),
    isGroupRide: boolean("is_group_ride").notNull().default(false),
    startTime: timestamp("start_time", { withTimezone: true }),
    endTime: timestamp("end_time", { withTimezone: true }),
    distanceKm: numeric("distance_km", { precision: 8, scale: 2 }),
    durationSeconds: integer("duration_seconds"),
    avgSpeedKmh: numeric("avg_speed_kmh", { precision: 6, scale: 2 }),
    maxSpeedKmh: numeric("max_speed_kmh", { precision: 6, scale: 2 }),
    startLocation: geographyPoint("start_location"),
    endLocation: geographyPoint("end_location"),
    visibility: varchar("visibility", { length: 20 }).notNull().default("public"),
    ...auditCols,
    ...softDelete,
  },
  (t) => ({
    userCreatedIdx: index("rides_user_created_idx").on(t.userId, t.createdAt),
    statusIdx: index("rides_status_idx").on(t.status),
  })
);

export const rideParticipants = pgTable("ride_participants", {
  rideId: uuid("ride_id").notNull().references(() => rides.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

export const gpsPoints = pgTable(
  "gps_points",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey(),
    rideId: uuid("ride_id").notNull().references(() => rides.id, { onDelete: "cascade" }),
    location: geographyPoint("location").notNull(),
    altitudeM: numeric("altitude_m", { precision: 7, scale: 2 }),
    speedKmh: numeric("speed_kmh", { precision: 6, scale: 2 }),
    headingDeg: numeric("heading_deg", { precision: 5, scale: 2 }),
    accuracyM: numeric("accuracy_m", { precision: 6, scale: 2 }),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ rideRecordedIdx: index("gps_points_ride_recorded_idx").on(t.rideId, t.recordedAt) })
);

export const ridePhotos = pgTable("ride_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  rideId: uuid("ride_id").notNull().references(() => rides.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  ...auditCols,
});

export const rideVideos = pgTable("ride_videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  rideId: uuid("ride_id").notNull().references(() => rides.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  ...auditCols,
});

export const rideReviews = pgTable("ride_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  rideId: uuid("ride_id").notNull().references(() => rides.id, { onDelete: "cascade" }),
  reviewerId: uuid("reviewer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: smallint("rating").notNull(),
  comment: text("comment"),
  ...auditCols,
});

export const liveSessions = pgTable(
  "live_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    rideId: uuid("ride_id").notNull().references(() => rides.id, { onDelete: "cascade" }),
    shareToken: varchar("share_token", { length: 64 }).notNull(),
    viewerUserIds: uuid("viewer_user_ids").array().default(sql`'{}'::uuid[]`),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    lastLocation: geographyPoint("last_location"),
    lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ tokenIdx: uniqueIndex("live_sessions_token_idx").on(t.shareToken) })
);

export const locationShares = pgTable("location_shares", {
  id: uuid("id").primaryKey().defaultRandom(),
  rideId: uuid("ride_id").notNull().references(() => rides.id, { onDelete: "cascade" }),
  contactId: uuid("contact_id").notNull(),
  permission: varchar("permission", { length: 20 }).notNull().default("view"),
  ...auditCols,
});

export const rideStatsCache = pgTable("ride_stats_cache", {
  rideId: uuid("ride_id").primaryKey().references(() => rides.id, { onDelete: "cascade" }),
  avgSpeed: numeric("avg_speed", { precision: 6, scale: 2 }),
  elevationGainM: numeric("elevation_gain_m", { precision: 8, scale: 2 }),
  ...auditCols,
});

export const aiRideSummaries = pgTable("ai_ride_summaries", {
  id: uuid("id").primaryKey().defaultRandom(),
  rideId: uuid("ride_id").notNull().references(() => rides.id, { onDelete: "cascade" }),
  summaryText: text("summary_text"),
  modelUsed: varchar("model_used", { length: 40 }),
  ...auditCols,
});

export const geofences = pgTable("geofences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }),
  polygon: geographyPolygon("polygon").notNull(),
  ...auditCols,
});

export const geofenceEvents = pgTable("geofence_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  geofenceId: uuid("geofence_id").notNull().references(() => geofences.id, { onDelete: "cascade" }),
  rideId: uuid("ride_id").references(() => rides.id, { onDelete: "cascade" }),
  eventType: varchar("event_type", { length: 20 }).notNull(), // enter/exit
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const etaShares = pgTable("eta_shares", {
  id: uuid("id").primaryKey().defaultRandom(),
  rideId: uuid("ride_id").notNull().references(() => rides.id, { onDelete: "cascade" }),
  contactId: uuid("contact_id").notNull(),
  eta: timestamp("eta", { withTimezone: true }),
  ...auditCols,
});

/* ============================================================
   5. SAFETY
   ============================================================ */

export const emergencyContacts = pgTable("emergency_contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  relation: varchar("relation", { length: 40 }),
  ...auditCols,
});

export const sosLogs = pgTable(
  "sos_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    rideId: uuid("ride_id").references(() => rides.id, { onDelete: "set null" }),
    triggerType: varchar("trigger_type", { length: 20 }).notNull(), // manual/crash_detected
    location: geographyPoint("location").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("triggered"),
    contactsNotified: jsonb("contacts_notified").default(sql`'[]'::jsonb`),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userCreatedIdx: index("sos_logs_user_created_idx").on(t.userId, t.createdAt) })
);

export const crashEvents = pgTable("crash_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  rideId: uuid("ride_id").notNull().references(() => rides.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  detectedAt: timestamp("detected_at", { withTimezone: true }).notNull().defaultNow(),
  confidenceScore: numeric("confidence_score", { precision: 4, scale: 3 }).notNull(),
  sensorSnapshot: jsonb("sensor_snapshot").notNull(),
  outcome: varchar("outcome", { length: 40 }).notNull().default("pending"),
  sosLogId: uuid("sos_log_id").references(() => sosLogs.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const assistancePartners = pgTable("assistance_partners", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 120 }).notNull(),
  services: text("services").array().default(sql`'{}'::text[]`),
  location: geographyPoint("location"),
  ...auditCols,
});

export const assistanceRequests = pgTable("assistance_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  location: geographyPoint("location").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  ...auditCols,
});

export const assistancePartnerAssignments = pgTable("assistance_partner_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestId: uuid("request_id").notNull().references(() => assistanceRequests.id, { onDelete: "cascade" }),
  partnerId: uuid("partner_id").notNull().references(() => assistancePartners.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("assigned"),
  ...auditCols,
});

export const speedAlertSettings = pgTable("speed_alert_settings", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  thresholdKmh: integer("threshold_kmh").notNull().default(100),
});

export const batteryAlertSettings = pgTable("battery_alert_settings", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  thresholdPct: smallint("threshold_pct").notNull().default(15),
});

export const weatherWarningsSent = pgTable("weather_warnings_sent", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  region: varchar("region", { length: 80 }),
  severity: varchar("severity", { length: 20 }),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ============================================================
   6. COMMUNITY — CONTENT
   ============================================================ */

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content"),
  mediaUrls: text("media_urls").array().default(sql`'{}'::text[]`),
  rideId: uuid("ride_id").references(() => rides.id, { onDelete: "set null" }),
  groupId: uuid("group_id"),
  ...auditCols,
  ...softDelete,
});

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  parentCommentId: uuid("parent_comment_id"),
  ...auditCols,
  ...softDelete,
});

export const likes = pgTable("likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  likeableType: varchar("likeable_type", { length: 30 }).notNull(), // post/comment/reel
  likeableId: uuid("likeable_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const hashtags = pgTable("hashtags", {
  id: uuid("id").primaryKey().defaultRandom(),
  tag: varchar("tag", { length: 60 }).notNull().unique(),
  usageCount: integer("usage_count").notNull().default(0),
});

export const postHashtags = pgTable("post_hashtags", {
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  hashtagId: uuid("hashtag_id").notNull().references(() => hashtags.id, { onDelete: "cascade" }),
});

export const shares = pgTable("shares", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  sharedTo: varchar("shared_to", { length: 40 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterId: uuid("reporter_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetType: varchar("target_type", { length: 30 }).notNull(),
  targetId: uuid("target_id").notNull(),
  reason: varchar("reason", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  ...auditCols,
});

export const stories = pgTable("stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  mediaUrl: text("media_url").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const storyViews = pgTable("story_views", {
  storyId: uuid("story_id").notNull().references(() => stories.id, { onDelete: "cascade" }),
  viewerId: uuid("viewer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reels = pgTable("reels", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  videoUrl: text("video_url").notNull(),
  caption: text("caption"),
  ...auditCols,
  ...softDelete,
});

export const reelViews = pgTable("reel_views", {
  reelId: uuid("reel_id").notNull().references(() => reels.id, { onDelete: "cascade" }),
  viewerId: uuid("viewer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const polls = pgTable("polls", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  question: varchar("question", { length: 200 }).notNull(),
});

export const pollOptions = pgTable("poll_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  pollId: uuid("poll_id").notNull().references(() => polls.id, { onDelete: "cascade" }),
  optionText: varchar("option_text", { length: 120 }).notNull(),
  voteCount: integer("vote_count").notNull().default(0),
});

export const pollVotes = pgTable("poll_votes", {
  pollId: uuid("poll_id").notNull().references(() => polls.id, { onDelete: "cascade" }),
  optionId: uuid("option_id").notNull().references(() => pollOptions.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

/* ============================================================
   7. GROUPS, CLUBS & EVENTS
   ============================================================ */

export const groups = pgTable("groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  isPrivate: boolean("is_private").notNull().default(false),
  ...auditCols,
  ...softDelete,
});

export const groupMembers = pgTable("group_members", {
  groupId: uuid("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

export const clubs = pgTable(
  "clubs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    description: text("description"),
    logoUrl: text("logo_url"),
    bannerUrl: text("banner_url"),
    city: varchar("city", { length: 80 }),
    isPrivate: boolean("is_private").notNull().default(false),
    isVerified: boolean("is_verified").notNull().default(false),
    ownerUserId: uuid("owner_user_id").notNull().references(() => users.id),
    memberCount: integer("member_count").notNull().default(0),
    ...auditCols,
    ...softDelete,
  },
  (t) => ({ slugIdx: uniqueIndex("clubs_slug_idx").on(t.slug), cityIdx: index("clubs_city_idx").on(t.city) })
);

export const clubMembers = pgTable("club_members", {
  clubId: uuid("club_id").notNull().references(() => clubs.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

export const clubRoles = pgTable("club_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  clubId: uuid("club_id").notNull().references(() => clubs.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 60 }).notNull(),
  permissions: jsonb("permissions").default(sql`'{}'::jsonb`),
});

export const clubDues = pgTable("club_dues", {
  id: uuid("id").primaryKey().defaultRandom(),
  clubId: uuid("club_id").notNull().references(() => clubs.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  frequency: varchar("frequency", { length: 20 }).notNull().default("monthly"),
  ...auditCols,
});

export const clubDuePayments = pgTable("club_due_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  clubDueId: uuid("club_due_id").notNull().references(() => clubDues.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  paidAt: timestamp("paid_at", { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizerId: uuid("organizer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  clubId: uuid("club_id").references(() => clubs.id, { onDelete: "set null" }),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }),
  location: geographyPoint("location"),
  ...auditCols,
  ...softDelete,
});

export const eventRsvps = pgTable("event_rsvps", {
  eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("going"),
  ...auditCols,
});

export const eventTickets = pgTable("event_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  ...auditCols,
});

export const eventTicketPurchases = pgTable("event_ticket_purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id").notNull().references(() => eventTickets.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderId: uuid("order_id"),
  ...auditCols,
});

export const eventCheckins = pgTable("event_checkins", {
  eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  checkedInAt: timestamp("checked_in_at", { withTimezone: true }).notNull().defaultNow(),
});

export const eventPhotos = pgTable("event_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
});

export const meetups = pgTable("meetups", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizerId: uuid("organizer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 120 }).notNull(),
  location: geographyPoint("location"),
  time: timestamp("time", { withTimezone: true }),
  ...auditCols,
});

export const meetupAttendees = pgTable("meetup_attendees", {
  meetupId: uuid("meetup_id").notNull().references(() => meetups.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const forumThreads = pgTable("forum_threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body"),
  ...auditCols,
  ...softDelete,
});

/* ============================================================
   8. MESSAGING
   ============================================================ */

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 10 }).notNull().default("direct"), // direct/group
  name: varchar("name", { length: 100 }),
  ...auditCols,
});

export const conversationParticipants = pgTable("conversation_participants", {
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    content: text("content"),
    type: varchar("type", { length: 20 }).notNull().default("text"), // text/media/location
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ convCreatedIdx: index("messages_conv_created_idx").on(t.conversationId, t.createdAt) })
);

export const messageMedia = pgTable("message_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  mediaType: varchar("media_type", { length: 20 }),
});

export const messageReads = pgTable("message_reads", {
  messageId: uuid("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  readAt: timestamp("read_at", { withTimezone: true }).notNull().defaultNow(),
});

export const forumReplies = pgTable("forum_replies", {
  id: uuid("id").primaryKey().defaultRandom(),
  threadId: uuid("thread_id").notNull().references(() => forumThreads.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  ...auditCols,
});

/* ============================================================
   9. MARKETPLACE
   ============================================================ */

export const listings = pgTable(
  "listings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    category: varchar("category", { length: 30 }).notNull(), // accessory/used_bike/service
    title: varchar("title", { length: 150 }).notNull(),
    description: text("description"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("INR"),
    condition: varchar("condition", { length: 20 }),
    location: geographyPoint("location"),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    viewCount: integer("view_count").notNull().default(0),
    ...auditCols,
    ...softDelete,
  },
  (t) => ({
    sellerIdx: index("listings_seller_idx").on(t.sellerId),
    categoryStatusIdx: index("listings_category_status_idx").on(t.category, t.status),
  })
);

export const listingPhotos = pgTable("listing_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
});

export const wishlists = pgTable("wishlists", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  buyerId: uuid("buyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id").notNull().references(() => listings.id, { onDelete: "restrict" }),
  status: varchar("status", { length: 20 }).notNull().default("created"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  ...auditCols,
});

export const orderStatusHistory = pgTable("order_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull(),
  changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewerId: uuid("reviewer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetType: varchar("target_type", { length: 30 }).notNull(), // listing/seller/mechanic
  targetId: uuid("target_id").notNull(),
  rating: smallint("rating").notNull(),
  comment: text("comment"),
  ...auditCols,
});

export const sellerVerifications = pgTable("seller_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  docType: varchar("doc_type", { length: 40 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  ...auditCols,
});

export const fuelStations = pgTable("fuel_stations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 120 }).notNull(),
  location: geographyPoint("location").notNull(),
  brand: varchar("brand", { length: 60 }),
});

export const evStations = pgTable("ev_stations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 120 }).notNull(),
  location: geographyPoint("location").notNull(),
  connectorType: varchar("connector_type", { length: 40 }),
});

export const hotels = pgTable("hotels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  location: geographyPoint("location").notNull(),
  amenities: text("amenities").array().default(sql`'{}'::text[]`),
});

export const campsites = pgTable("campsites", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  location: geographyPoint("location").notNull(),
  facilities: text("facilities").array().default(sql`'{}'::text[]`),
});

export const mechanics = pgTable("mechanics", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 120 }).notNull(),
  location: geographyPoint("location"),
  specialties: text("specialties").array().default(sql`'{}'::text[]`),
});

export const mechanicReviews = pgTable("mechanic_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  mechanicId: uuid("mechanic_id").notNull().references(() => mechanics.id, { onDelete: "cascade" }),
  reviewerId: uuid("reviewer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: smallint("rating").notNull(),
  ...auditCols,
});

export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  type: varchar("type", { length: 30 }).notNull(), // dealer/brand
  ownerUserId: uuid("owner_user_id").notNull().references(() => users.id),
  ...auditCols,
});

/* ============================================================
   10. GAMIFICATION
   ============================================================ */

export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 150 }).notNull(),
  criteria: jsonb("criteria").default(sql`'{}'::jsonb`),
  startAt: timestamp("start_at", { withTimezone: true }),
  endAt: timestamp("end_at", { withTimezone: true }),
  ...auditCols,
});

export const challengeParticipants = pgTable("challenge_participants", {
  challengeId: uuid("challenge_id").notNull().references(() => challenges.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  progress: jsonb("progress").default(sql`'{}'::jsonb`),
});

export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 150 }).notNull(),
  criteria: jsonb("criteria").default(sql`'{}'::jsonb`),
});

export const userAchievements = pgTable("user_achievements", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: uuid("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlocked_at", { withTimezone: true }).notNull().defaultNow(),
});

export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  iconUrl: text("icon_url"),
});

export const userBadges = pgTable("user_badges", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeId: uuid("badge_id").notNull().references(() => badges.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  scope: varchar("scope", { length: 20 }).notNull(), // city/club/global
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  score: numeric("score", { precision: 12, scale: 2 }).notNull(),
  period: varchar("period", { length: 20 }).notNull(), // weekly/monthly/all_time
});

/* ============================================================
   11. PAYMENTS, WALLET & SUBSCRIPTIONS
   ============================================================ */

export const wallets = pgTable("wallets", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0"),
  currency: varchar("currency", { length: 3 }).notNull().default("INR"),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletUserId: uuid("wallet_user_id").notNull().references(() => wallets.userId, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  type: varchar("type", { length: 10 }).notNull(), // credit/debit
  reference: varchar("reference", { length: 120 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const paymentMethods = pgTable("payment_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 30 }).notNull(),
  token: text("token").notNull(),
  ...auditCols,
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  provider: varchar("provider", { length: 30 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  ...auditCols,
});

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 60 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  features: jsonb("features").default(sql`'{}'::jsonb`),
  tier: varchar("tier", { length: 20 }).notNull(), // free/premium/premium_plus/family/club
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  clubId: uuid("club_id").references(() => clubs.id, { onDelete: "cascade" }),
  planId: uuid("plan_id").notNull().references(() => plans.id),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  provider: varchar("provider", { length: 20 }).notNull(),
  providerSubscriptionId: varchar("provider_subscription_id", { length: 120 }),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }).notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  ...auditCols,
});

export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  discountType: varchar("discount_type", { length: 20 }).notNull(), // flat/percentage
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  expiry: timestamp("expiry", { withTimezone: true }),
});

export const couponRedemptions = pgTable("coupon_redemptions", {
  couponId: uuid("coupon_id").notNull().references(() => coupons.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  transactionId: uuid("transaction_id").notNull().references(() => transactions.id, { onDelete: "cascade" }),
  invoiceNumber: varchar("invoice_number", { length: 60 }).notNull(),
  pdfUrl: text("pdf_url"),
  ...auditCols,
});

export const refundRequests = pgTable("refund_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  transactionId: uuid("transaction_id").notNull().references(() => transactions.id, { onDelete: "cascade" }),
  reason: text("reason"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  ...auditCols,
});

/* ============================================================
   12. LEARNING & MOTORSPORT
   ============================================================ */

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 150 }).notNull(),
  level: varchar("level", { length: 30 }).notNull(), // beginner/intermediate/advanced/professional
  description: text("description"),
  ...auditCols,
});

export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 150 }).notNull(),
  contentUrl: text("content_url"),
  sequence: smallint("sequence").notNull(),
});

export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  questions: jsonb("questions").notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizId: uuid("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  score: numeric("score", { precision: 5, scale: 2 }),
  attemptedAt: timestamp("attempted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const certificates = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
  certUrl: text("cert_url"),
});

export const courseEnrollments = pgTable("course_enrollments", {
  courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  progressPct: smallint("progress_pct").notNull().default(0),
  enrolledAt: timestamp("enrolled_at", { withTimezone: true }).notNull().defaultNow(),
});

export const careerRoadmapMilestones = pgTable("career_roadmap_milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  stage: varchar("stage", { length: 30 }).notNull(),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),
  minAge: smallint("min_age"),
  maxAge: smallint("max_age"),
  country: varchar("country", { length: 80 }).default("India"),
  estimatedCostMin: numeric("estimated_cost_min", { precision: 12, scale: 2 }),
  estimatedCostMax: numeric("estimated_cost_max", { precision: 12, scale: 2 }),
  sortOrder: smallint("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userCareerProgress = pgTable("user_career_progress", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  milestoneId: uuid("milestone_id").notNull().references(() => careerRoadmapMilestones.id, { onDelete: "cascade" }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const academies = pgTable("academies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  type: varchar("type", { length: 30 }).notNull(), // riding_school/racing_academy
  city: varchar("city", { length: 80 }),
  description: text("description"),
  isVerified: boolean("is_verified").notNull().default(false),
  contactPhone: varchar("contact_phone", { length: 15 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  affiliatedBody: varchar("affiliated_body", { length: 120 }),
  ...auditCols,
  ...softDelete,
});

export const trainingInstitutes = pgTable("training_institutes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  affiliatedBody: varchar("affiliated_body", { length: 120 }),
});

export const raceEvents = pgTable("race_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  raceDate: date("race_date"),
  location: varchar("location", { length: 150 }),
  level: varchar("level", { length: 40 }),
});

export const raceResults = pgTable("race_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  raceEventId: uuid("race_event_id").notNull().references(() => raceEvents.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  position: smallint("position"),
  timeResult: varchar("time_result", { length: 20 }),
});

export const mentors = pgTable("mentors", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  externalName: varchar("external_name", { length: 120 }),
  specialties: text("specialties").array().default(sql`'{}'::text[]`),
});

export const mentorConnections = pgTable("mentor_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  mentorId: uuid("mentor_id").notNull().references(() => mentors.id, { onDelete: "cascade" }),
  requesterId: uuid("requester_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  ...auditCols,
});

/* ============================================================
   13. DEVICES & INTEGRATIONS
   ============================================================ */

export const connectedDevices = pgTable("connected_devices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  deviceType: varchar("device_type", { length: 30 }).notNull(), // obd/helmet/intercom/gopro/garmin/smartwatch
  provider: varchar("provider", { length: 60 }),
  ...auditCols,
});

export const obdReadings = pgTable("obd_readings", {
  id: uuid("id").primaryKey().defaultRandom(),
  deviceId: uuid("device_id").notNull().references(() => connectedDevices.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 20 }),
  value: text("value"),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
});

export const helmetDeviceData = pgTable("helmet_device_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  deviceId: uuid("device_id").notNull().references(() => connectedDevices.id, { onDelete: "cascade" }),
  dataJson: jsonb("data_json"),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
});

export const intercomPairings = pgTable("intercom_pairings", {
  id: uuid("id").primaryKey().defaultRandom(),
  deviceId: uuid("device_id").notNull().references(() => connectedDevices.id, { onDelete: "cascade" }),
  pairedAt: timestamp("paired_at", { withTimezone: true }).notNull().defaultNow(),
});

export const goproImports = pgTable("gopro_imports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rideId: uuid("ride_id").references(() => rides.id, { onDelete: "set null" }),
  fileUrl: text("file_url").notNull(),
  ...auditCols,
});

export const garminSyncs = pgTable("garmin_syncs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  syncType: varchar("sync_type", { length: 30 }),
  syncedAt: timestamp("synced_at", { withTimezone: true }).notNull().defaultNow(),
});

export const smartwatchData = pgTable("smartwatch_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rideId: uuid("ride_id").references(() => rides.id, { onDelete: "set null" }),
  heartRateAvg: smallint("heart_rate_avg"),
  ...auditCols,
});

/* ============================================================
   14. AI SERVICES
   ============================================================ */

export const aiRequests = pgTable("ai_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  feature: varchar("feature", { length: 40 }).notNull(),
  prompt: text("prompt"),
  response: text("response"),
  model: varchar("model", { length: 40 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aiTripPlans = pgTable("ai_trip_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  criteriaJson: jsonb("criteria_json"),
  planJson: jsonb("plan_json"),
  ...auditCols,
});

export const aiMechanicalDiagnoses = pgTable("ai_mechanical_diagnoses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  symptoms: text("symptoms"),
  diagnosis: text("diagnosis"),
  ...auditCols,
});

/* ============================================================
   15. ADMIN, CMS, MODERATION & BUSINESS
   ============================================================ */

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 30 }).notNull(),
  ...auditCols,
});

export const moderationReports = pgTable("moderation_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  targetType: varchar("target_type", { length: 30 }).notNull(),
  targetId: uuid("target_id").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  reason: varchar("reason", { length: 100 }),
  ...auditCols,
});

export const moderationActions = pgTable("moderation_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").notNull().references(() => moderationReports.id, { onDelete: "cascade" }),
  moderatorId: uuid("moderator_id").notNull().references(() => adminUsers.id),
  action: varchar("action", { length: 30 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cmsContent = pgTable("cms_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  contentJson: jsonb("content_json"),
  published: boolean("published").notNull().default(false),
  ...auditCols,
});

export const brandPages = pgTable("brand_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 150 }).notNull(),
  logoUrl: text("logo_url"),
});

export const adCampaigns = pgTable("ad_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  budget: numeric("budget", { precision: 12, scale: 2 }),
  targetCriteria: jsonb("target_criteria"),
  status: varchar("status", { length: 20 }).notNull().default("pending_review"),
  ...auditCols,
});

export const adImpressions = pgTable("ad_impressions", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id").notNull().references(() => adCampaigns.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  shownAt: timestamp("shown_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adClicks = pgTable("ad_clicks", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id").notNull().references(() => adCampaigns.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  clickedAt: timestamp("clicked_at", { withTimezone: true }).notNull().defaultNow(),
});

export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 200 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("open"),
  ...auditCols,
});

export const supportTicketMessages = pgTable("support_ticket_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id").notNull().references(() => supportTickets.id, { onDelete: "cascade" }),
  senderType: varchar("sender_type", { length: 10 }).notNull(), // user/agent
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const crmLeads = pgTable("crm_leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 120 }),
  contact: varchar("contact", { length: 120 }),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  ...auditCols,
});

export const featureFlags = pgTable("feature_flags", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  enabled: boolean("enabled").notNull().default(false),
  rolloutPct: smallint("rollout_pct").notNull().default(0),
});

export const appConfig = pgTable("app_config", {
  key: varchar("key", { length: 100 }).primaryKey(),
  valueJson: jsonb("value_json"),
});

/* ============================================================
   16. ANALYTICS, SEARCH & LOCALIZATION
   ============================================================ */

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    eventName: varchar("event_name", { length: 80 }).notNull(),
    propertiesJson: jsonb("properties_json"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ userEventIdx: index("analytics_events_user_event_idx").on(t.userId, t.eventName, t.createdAt) })
);

export const aggregatedStats = pgTable("aggregated_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  metricKey: varchar("metric_key", { length: 100 }).notNull(),
  period: varchar("period", { length: 20 }).notNull(),
  value: numeric("value", { precision: 16, scale: 4 }),
});

export const searchIndexMeta = pgTable("search_index_meta", {
  entityType: varchar("entity_type", { length: 40 }).primaryKey(),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
});

export const translations = pgTable("translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 150 }).notNull(),
  locale: varchar("locale", { length: 10 }).notNull(),
  value: text("value").notNull(),
});

export const locales = pgTable("locales", {
  code: varchar("code", { length: 10 }).primaryKey(),
  name: varchar("name", { length: 60 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const countries = pgTable("countries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 80 }).notNull(),
  isoCode: varchar("iso_code", { length: 3 }).notNull(),
});

export const states = pgTable("states", {
  id: uuid("id").primaryKey().defaultRandom(),
  countryId: uuid("country_id").notNull().references(() => countries.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 80 }).notNull(),
});

export const cities = pgTable("cities", {
  id: uuid("id").primaryKey().defaultRandom(),
  stateId: uuid("state_id").notNull().references(() => states.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 80 }).notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  keyHash: varchar("key_hash", { length: 255 }).notNull(),
  scopes: text("scopes").array().default(sql`'{}'::text[]`),
  ...auditCols,
});

export const webhooks = pgTable("webhooks", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  events: text("events").array().default(sql`'{}'::text[]`),
  ...auditCols,
});

/* ============================================================
   17. MISC LOGS & PREFERENCES
   ============================================================ */

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 40 }).notNull(),
    title: varchar("title", { length: 150 }).notNull(),
    body: text("body"),
    data: jsonb("data").default(sql`'{}'::jsonb`),
    readAt: timestamp("read_at", { withTimezone: true }),
    channelsSent: text("channels_sent").array().default(sql`'{}'::text[]`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userCreatedIdx: index("notifications_user_created_idx").on(t.userId, t.createdAt),
    userReadIdx: index("notifications_user_read_idx").on(t.userId, t.readAt),
  })
);

export const notificationPreferences = pgTable("notification_preferences", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  preferences: jsonb("preferences").default(sql`'{}'::jsonb`),
});

export const pushNotificationLog = pgTable("push_notification_log", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  payload: jsonb("payload"),
  status: varchar("status", { length: 20 }),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

export const smsLog = pgTable("sms_log", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  phone: varchar("phone", { length: 15 }),
  message: text("message"),
  status: varchar("status", { length: 20 }),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

export const emailLog = pgTable("email_log", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  toEmail: varchar("to_email", { length: 255 }),
  subject: varchar("subject", { length: 200 }),
  status: varchar("status", { length: 20 }),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  actorType: varchar("actor_type", { length: 20 }).notNull(), // user/admin/system
  actorId: uuid("actor_id"),
  action: varchar("action", { length: 60 }).notNull(),
  targetType: varchar("target_type", { length: 40 }),
  targetId: uuid("target_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessionActivityLog = pgTable("session_activity_log", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  sessionId: uuid("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  activity: varchar("activity", { length: 60 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const currencyRates = pgTable("currency_rates", {
  baseCurrency: varchar("base_currency", { length: 3 }).notNull(),
  quoteCurrency: varchar("quote_currency", { length: 3 }).notNull(),
  rate: numeric("rate", { precision: 12, scale: 6 }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const unitPreferences = pgTable("unit_preferences", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  distanceUnit: varchar("distance_unit", { length: 10 }).notNull().default("km"),
  speedUnit: varchar("speed_unit", { length: 10 }).notNull().default("kmh"),
  fuelUnit: varchar("fuel_unit", { length: 10 }).notNull().default("liters"),
});

export const clubInvites = pgTable("club_invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  clubId: uuid("club_id").notNull().references(() => clubs.id, { onDelete: "cascade" }),
  invitedPhone: varchar("invited_phone", { length: 15 }),
  invitedUserId: uuid("invited_user_id").references(() => users.id, { onDelete: "set null" }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  ...auditCols,
});

export const eventReminders = pgTable("event_reminders", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  remindAt: timestamp("remind_at", { withTimezone: true }).notNull(),
});

export const postMedia = pgTable("post_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  mediaType: varchar("media_type", { length: 20 }),
});

/* ============================================================
   RELATIONS (representative — extend per module as needed)
   ============================================================ */

export const usersRelations = relations(users, ({ many }) => ({
  motorcycles: many(motorcycles),
  rides: many(rides),
  posts: many(posts),
  emergencyContacts: many(emergencyContacts),
  clubMembers: many(clubMembers),
}));

export const motorcyclesRelations = relations(motorcycles, ({ one, many }) => ({
  owner: one(users, { fields: [motorcycles.userId], references: [users.id] }),
  manufacturer: one(manufacturers, { fields: [motorcycles.manufacturerId], references: [manufacturers.id] }),
  model: one(models, { fields: [motorcycles.modelId], references: [models.id] }),
  maintenanceRecords: many(maintenanceRecords),
  documents: many(garageDocuments),
}));

export const ridesRelations = relations(rides, ({ one, many }) => ({
  owner: one(users, { fields: [rides.userId], references: [users.id] }),
  motorcycle: one(motorcycles, { fields: [rides.motorcycleId], references: [motorcycles.id] }),
  gpsPoints: many(gpsPoints),
  participants: many(rideParticipants),
  photos: many(ridePhotos),
}));

export const clubsRelations = relations(clubs, ({ one, many }) => ({
  owner: one(users, { fields: [clubs.ownerUserId], references: [users.id] }),
  members: many(clubMembers),
  events: many(events),
}));
