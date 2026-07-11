import { pgTable, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: varchar("phone", { length: 15 }),
    email: varchar("email", { length: 255 }),
    fullName: varchar("full_name", { length: 120 }),
    displayName: varchar("display_name", { length: 60 }),
    username: varchar("username", { length: 30 }).notNull(),
    passwordHash: text("password_hash"),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  }
);
