import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { speakers, programSessions, programItems, registrations, contacts } from "@shared/schema";
import { eq } from "drizzle-orm";
import mysql from 'mysql2/promise';

// Create a MySQL connection pool for raw queries
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
});

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
      // MySQL can have issues with complex joins in Drizzle, so use a simpler approach
      const items = await db.select({
        id: programItems.id,
        time: programItems.time,
        title: programItems.title,
        description: programItems.description,
        session: programItems.session,
        speakerId: programItems.speakerId,
        order: programItems.order
      }).from(programItems)
        .orderBy(programItems.time);
      
      // If there are items with speakers, fetch speakers separately
      const speakerIds = items.filter(item => item.speakerId !== null)
        .map(item => item.speakerId);
      
      if (speakerIds.length > 0) {
        // For MySQL, use a more compatible approach with the IN operator
        const [speakersData] = await pool.query(
          `SELECT * FROM speakers WHERE id IN (${speakerIds.join(',')})`
        );
        
        // Manually join speakers to program items
        const itemsWithSpeakers = items.map(item => {
          const speaker = Array.isArray(speakersData) 
            ? speakersData.find((s: any) => s.id === item.speakerId)
            : null;
          return {
            ...item,
            speaker: speaker || null
          };
        });
        
        res.json(itemsWithSpeakers);
      } else {
        res.json(items);
      }
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
      const [existingUsers] = await db.select({id: registrations.id})
        .from(registrations)
        .where(eq(registrations.email, email));

      if (existingUsers && existingUsers.length > 0) {
        return res.status(400).json({ message: "This email is already registered" });
      }

      // Create registration
      const [newRegistration] = await db
        .insert(registrations)
        .values({
          firstName,
          lastName,
          email,
          phone,
          occupation: occupation || null,
          topics: topics ? topics.join(",") : null,
        }); // MySQL doesn't support .returning()

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
