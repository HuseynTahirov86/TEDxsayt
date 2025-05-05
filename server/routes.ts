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

  // Get all speakers from static JSON file
  app.get(`${apiPrefix}/speakers`, async (_req, res) => {
    try {
      // Import speakers using fs instead of require
      const fs = await import('fs/promises');
      // Use path.join to handle paths correctly
      const path = await import('path');
      const speakersData = await fs.readFile(path.join(process.cwd(), 'client/src/data/speakers.json'), 'utf-8');
      const speakers = JSON.parse(speakersData);
      res.json(speakers);
    } catch (error) {
      console.error("Error fetching speakers:", error);
      res.status(500).json({ message: "Error fetching speakers" });
    }
  });

  // Get program sessions from static JSON file
  app.get(`${apiPrefix}/program/sessions`, async (_req, res) => {
    try {
      // Import sessions using fs instead of require
      const fs = await import('fs/promises');
      // Use path.join to handle paths correctly
      const path = await import('path');
      const sessionsData = await fs.readFile(path.join(process.cwd(), 'client/src/data/sessions.json'), 'utf-8');
      const sessions = JSON.parse(sessionsData);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching program sessions:", error);
      res.status(500).json({ message: "Error fetching program sessions" });
    }
  });

  // Get program items from static JSON file with speaker references
  app.get(`${apiPrefix}/program/items`, async (_req, res) => {
    try {
      // Import program items and speakers using fs instead of require
      const fs = await import('fs/promises');
      // Use path.join to handle paths correctly
      const path = await import('path');
      const programItemsData = await fs.readFile(path.join(process.cwd(), 'client/src/data/programItems.json'), 'utf-8');
      const speakersData = await fs.readFile(path.join(process.cwd(), 'client/src/data/speakers.json'), 'utf-8');
      
      const programItems = JSON.parse(programItemsData);
      const speakers = JSON.parse(speakersData);
      
      // Add speaker details to program items that have a speakerId
      const itemsWithSpeakers = programItems.map((item: any) => {
        if (item.speakerId) {
          const speaker = speakers.find((s: any) => s.id === item.speakerId);
          return {
            ...item,
            speaker: speaker || null
          };
        }
        return item;
      });
      
      res.json(itemsWithSpeakers);
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

      // Check if email already registered using raw MySQL query
      const [rows] = await pool.query(
        'SELECT id FROM registrations WHERE email = ?',
        [email]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        return res.status(400).json({ message: "This email is already registered" });
      }

      // Create registration using raw MySQL query
      const [result] = await pool.query(
        'INSERT INTO registrations (first_name, last_name, email, phone, occupation, topics) VALUES (?, ?, ?, ?, ?, ?)',
        [
          firstName,
          lastName,
          email,
          phone,
          occupation || null,
          topics ? topics.join(",") : null
        ]
      );

      // Get inserted ID from the query result
      const insertedId = (result as any).insertId;
      
      // Return the newly created registration
      res.status(201).json({
        id: insertedId,
        firstName,
        lastName,
        email,
        phone,
        occupation: occupation || null,
        topics: topics ? topics.join(",") : null
      });
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

      // Create contact message using raw MySQL query
      const [result] = await pool.query(
        'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [name, email, subject, message]
      );

      // Get inserted ID from the query result
      const insertedId = (result as any).insertId;
      
      // Return the newly created contact
      res.status(201).json({
        id: insertedId,
        name,
        email,
        subject,
        message,
        createdAt: new Date(),
        isRead: false
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Error processing contact form submission" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
