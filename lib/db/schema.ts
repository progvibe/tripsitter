import { pgTable, text, timestamp, uuid, boolean, integer } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Trips table
export const trips = pgTable("trips", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  destination: text("destination"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  inviteCode: text("invite_code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Trip members table (join table for users and trips)
export const tripMembers = pgTable("trip_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"), // 'owner' or 'member'
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
})

// Activities table (itinerary items)
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  day: integer("day"), // Day number in the trip
  order: integer("order").notNull().default(0), // For ordering activities within a day
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Messages table (chat)
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  content: text("content").notNull(),
  isAi: boolean("is_ai").notNull().default(false), // True if message is from AI co-planner
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const presence = pgTable("presence", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lastSeenAt: timestamp("last_seen_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tripMembers: many(tripMembers),
  createdTrips: many(trips),
  activities: many(activities),
  messages: many(messages),
  presence: many(presence),
}))

export const tripsRelations = relations(trips, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [trips.createdById],
    references: [users.id],
  }),
  members: many(tripMembers),
  activities: many(activities),
  messages: many(messages),
  presence: many(presence),
}))

export const tripMembersRelations = relations(tripMembers, ({ one }) => ({
  trip: one(trips, {
    fields: [tripMembers.tripId],
    references: [trips.id],
  }),
  user: one(users, {
    fields: [tripMembers.userId],
    references: [users.id],
  }),
}))

export const activitiesRelations = relations(activities, ({ one }) => ({
  trip: one(trips, {
    fields: [activities.tripId],
    references: [trips.id],
  }),
  createdBy: one(users, {
    fields: [activities.createdById],
    references: [users.id],
  }),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  trip: one(trips, {
    fields: [messages.tripId],
    references: [trips.id],
  }),
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}))

export const presenceRelations = relations(presence, ({ one }) => ({
  trip: one(trips, {
    fields: [presence.tripId],
    references: [trips.id],
  }),
  user: one(users, {
    fields: [presence.userId],
    references: [users.id],
  }),
}))
