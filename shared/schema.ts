import { mysqlTable, varchar, int, boolean, timestamp, primaryKey } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (required for basic auth if needed)
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Speakers table
export const speakers = mysqlTable("speakers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  bio: varchar("bio", { length: 2000 }).notNull(),
  topic: varchar("topic", { length: 255 }).notNull(),
  image: varchar("image", { length: 2000 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const speakersRelations = relations(speakers, ({ many }) => ({
  programItems: many(programItems),
}));

export const insertSpeakerSchema = createInsertSchema(speakers, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  title: (schema) => schema.min(2, "Title must be at least 2 characters"),
  bio: (schema) => schema.min(10, "Bio must be at least 10 characters"),
  topic: (schema) => schema.min(5, "Topic must be at least 5 characters"),
});

export type InsertSpeaker = z.infer<typeof insertSpeakerSchema>;
export type Speaker = typeof speakers.$inferSelect;

// Program Sessions table
export const programSessions = mysqlTable("program_sessions", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  order: int("order").notNull(),
});

export const programSessionsRelations = relations(programSessions, ({ many }) => ({
  programItems: many(programItems),
}));

export const insertProgramSessionSchema = createInsertSchema(programSessions);
export type InsertProgramSession = z.infer<typeof insertProgramSessionSchema>;
export type ProgramSession = typeof programSessions.$inferSelect;

// Program Items table
export const programItems = mysqlTable("program_items", {
  id: int("id").autoincrement().primaryKey(),
  time: varchar("time", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 2000 }).notNull(),
  session: varchar("session", { length: 50 }).notNull().references(() => programSessions.id),
  speakerId: int("speaker_id").references(() => speakers.id),
  order: int("order").notNull(),
});

export const programItemsRelations = relations(programItems, ({ one }) => ({
  session: one(programSessions, {
    fields: [programItems.session],
    references: [programSessions.id],
  }),
  speaker: one(speakers, {
    fields: [programItems.speakerId],
    references: [speakers.id],
  }),
}));

export const insertProgramItemSchema = createInsertSchema(programItems);
export type InsertProgramItem = z.infer<typeof insertProgramItemSchema>;
export type ProgramItem = typeof programItems.$inferSelect;

// Registrations table
export const registrations = mysqlTable("registrations", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }).notNull(),
  occupation: varchar("occupation", { length: 255 }),
  topics: varchar("topics", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRegistrationSchema = createInsertSchema(registrations, {
  firstName: (schema) => schema.min(2, "First name must be at least 2 characters"),
  lastName: (schema) => schema.min(2, "Last name must be at least 2 characters"),
  email: (schema) => schema.email("Please provide a valid email"),
  phone: (schema) => schema.min(10, "Phone number must be at least 10 characters"),
});

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;

// Contacts table
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: varchar("message", { length: 2000 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

export const insertContactSchema = createInsertSchema(contacts, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  email: (schema) => schema.email("Please provide a valid email"),
  subject: (schema) => schema.min(3, "Subject must be at least 3 characters"),
  message: (schema) => schema.min(10, "Message must be at least 10 characters"),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Sponsors table
export const sponsors = mysqlTable("sponsors", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logo: varchar("logo", { length: 2000 }).notNull(),
  website: varchar("website", { length: 1000 }),
  level: varchar("level", { length: 100 }).notNull(), // platinum, gold, silver, etc.
  order: int("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSponsorSchema = createInsertSchema(sponsors, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  logo: (schema) => schema.min(5, "Logo URL must be at least 5 characters"),
  level: (schema) => schema.min(3, "Sponsor level must be at least 3 characters"),
});

export type InsertSponsor = z.infer<typeof insertSponsorSchema>;
export type Sponsor = typeof sponsors.$inferSelect;
