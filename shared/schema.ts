import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (required for basic auth if needed)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Speakers table
export const speakers = pgTable("speakers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  topic: text("topic").notNull(),
  image: text("image").notNull(),
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
export const programSessions = pgTable("program_sessions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  order: integer("order").notNull(),
});

export const programSessionsRelations = relations(programSessions, ({ many }) => ({
  programItems: many(programItems),
}));

export const insertProgramSessionSchema = createInsertSchema(programSessions);
export type InsertProgramSession = z.infer<typeof insertProgramSessionSchema>;
export type ProgramSession = typeof programSessions.$inferSelect;

// Program Items table
export const programItems = pgTable("program_items", {
  id: serial("id").primaryKey(),
  time: text("time").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  session: text("session").notNull().references(() => programSessions.id),
  speakerId: integer("speaker_id").references(() => speakers.id),
  order: integer("order").notNull(),
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
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  occupation: text("occupation"),
  topics: text("topics"),
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
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
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
