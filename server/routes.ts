import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { speakers, programSessions, programItems, registrations, contacts } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the TEDx website
  const apiPrefix = "/api";

  // Get all speakers
  app.get(`${apiPrefix}/speakers`, async (_req, res) => {
    try {
      const allSpeakers = await db.query.speakers.findMany({
        orderBy: speakers.id,
      });
      res.json(allSpeakers);
    } catch (error) {
      console.error("Error fetching speakers:", error);
      res.status(500).json({ message: "Error fetching speakers" });
    }
  });

  // Get program sessions
  app.get(`${apiPrefix}/program/sessions`, async (_req, res) => {
    try {
      const sessions = await db.query.programSessions.findMany({
        orderBy: programSessions.order,
      });
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching program sessions:", error);
      res.status(500).json({ message: "Error fetching program sessions" });
    }
  });

  // Get program items
  app.get(`${apiPrefix}/program/items`, async (_req, res) => {
    try {
      const items = await db.query.programItems.findMany({
        orderBy: programItems.time,
        with: {
          speaker: true,
        },
      });
      res.json(items);
    } catch (error) {
      console.error("Error fetching program items:", error);
      res.status(500).json({ message: "Error fetching program items" });
    }
  });

  // Register for the event
  app.post(`${apiPrefix}/register`, async (req, res) => {
    try {
      const { firstName, lastName, email, phone, occupation, topics, terms } = req.body;

      // Basic validation
      if (!firstName || !lastName || !email || !phone || !terms) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      // Check if email already registered
      const existingUser = await db.query.registrations.findFirst({
        where: eq(registrations.email, email),
      });

      if (existingUser) {
        return res.status(400).json({ message: "This email is already registered" });
      }

      // Create registration
      const newRegistration = await db
        .insert(registrations)
        .values({
          firstName,
          lastName,
          email,
          phone,
          occupation: occupation || null,
          topics: topics ? topics.join(",") : null,
        })
        .returning();

      res.status(201).json(newRegistration[0]);
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Error processing registration" });
    }
  });

  // Submit contact form
  app.post(`${apiPrefix}/contact`, async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      // Basic validation
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Create contact message
      const newContact = await db
        .insert(contacts)
        .values({
          name,
          email,
          subject,
          message,
        })
        .returning();

      res.status(201).json(newContact[0]);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Error processing contact form submission" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
