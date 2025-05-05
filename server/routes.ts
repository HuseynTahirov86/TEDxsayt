import type { Express } from "express";
import { createServer, type Server } from "http";
import { db, pool } from "@db";
import { speakers, programSessions, programItems, registrations, contacts } from "@shared/schema";
import { eq } from "drizzle-orm";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication middleware and routes
  setupAuth(app);
  
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

  // ===== ADMIN API ROUTES =====

  // Get all registrations (Admin only)
  app.get(`${apiPrefix}/admin/registrations`, async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT id, first_name as firstName, last_name as lastName, email, phone, occupation, topics, created_at as createdAt 
        FROM registrations 
        ORDER BY created_at DESC
      `);
      
      res.json(rows);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      res.status(500).json({ message: "Qeydiyyatları əldə etmək mümkün olmadı" });
    }
  });

  // Delete a registration (Admin only)
  app.delete(`${apiPrefix}/admin/registrations/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      
      const [result] = await pool.query(
        'DELETE FROM registrations WHERE id = ?',
        [id]
      );
      
      const deletedRows = (result as any).affectedRows;
      
      if (deletedRows === 0) {
        return res.status(404).json({ message: "Qeydiyyat tapılmadı" });
      }
      
      res.json({ message: "Qeydiyyat uğurla silindi" });
    } catch (error) {
      console.error("Error deleting registration:", error);
      res.status(500).json({ message: "Qeydiyyatı silmək mümkün olmadı" });
    }
  });

  // Get all contacts (Admin only)
  app.get(`${apiPrefix}/admin/contacts`, async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT id, name, email, subject, message, created_at as createdAt, is_read as isRead 
        FROM contacts 
        ORDER BY created_at DESC
      `);
      
      res.json(rows);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Əlaqə mesajlarını əldə etmək mümkün olmadı" });
    }
  });

  // Delete a contact (Admin only)
  app.delete(`${apiPrefix}/admin/contacts/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      
      const [result] = await pool.query(
        'DELETE FROM contacts WHERE id = ?',
        [id]
      );
      
      const deletedRows = (result as any).affectedRows;
      
      if (deletedRows === 0) {
        return res.status(404).json({ message: "Əlaqə mesajı tapılmadı" });
      }
      
      res.json({ message: "Əlaqə mesajı uğurla silindi" });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ message: "Əlaqə mesajını silmək mümkün olmadı" });
    }
  });

  // Mark a contact as read (Admin only)
  app.patch(`${apiPrefix}/admin/contacts/:id/read`, async (req, res) => {
    try {
      const { id } = req.params;
      
      const [result] = await pool.query(
        'UPDATE contacts SET is_read = TRUE WHERE id = ?',
        [id]
      );
      
      const updatedRows = (result as any).affectedRows;
      
      if (updatedRows === 0) {
        return res.status(404).json({ message: "Əlaqə mesajı tapılmadı" });
      }
      
      res.json({ message: "Əlaqə mesajı oxunmuş kimi qeyd edildi" });
    } catch (error) {
      console.error("Error marking contact as read:", error);
      res.status(500).json({ message: "Əlaqə mesajını oxunmuş kimi qeyd etmək mümkün olmadı" });
    }
  });

  // ===== ADMIN SPEAKER MANAGEMENT =====
  
  // Get all speakers (Admin only)
  app.get(`${apiPrefix}/admin/speakers`, async (req, res) => {
    try {
      // Import speakers using fs instead of require
      const fs = await import('fs/promises');
      const path = await import('path');
      const speakersPath = path.join(process.cwd(), 'client/src/data/speakers.json');
      
      const speakersData = await fs.readFile(speakersPath, 'utf-8');
      const speakers = JSON.parse(speakersData);
      
      res.json(speakers);
    } catch (error) {
      console.error("Error fetching speakers:", error);
      res.status(500).json({ message: "Natiqləri əldə etmək mümkün olmadı" });
    }
  });
  
  // Add a new speaker (Admin only)
  app.post(`${apiPrefix}/admin/speakers`, async (req, res) => {
    try {
      const { name, title, bio, topic, image } = req.body;
      
      // Basic validation
      if (!name || !title || !bio || !topic) {
        return res.status(400).json({ message: "Bütün məlumatlar tələb olunur" });
      }
      
      // Import speakers and update
      const fs = await import('fs/promises');
      const path = await import('path');
      const speakersPath = path.join(process.cwd(), 'client/src/data/speakers.json');
      
      const speakersData = await fs.readFile(speakersPath, 'utf-8');
      const speakers = JSON.parse(speakersData);
      
      // Create new speaker with the next ID
      const newId = speakers.length > 0 ? Math.max(...speakers.map((s: any) => s.id)) + 1 : 1;
      
      const newSpeaker = {
        id: newId,
        name,
        title,
        bio,
        topic,
        image: image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      };
      
      // Add the new speaker
      speakers.push(newSpeaker);
      
      // Save back to file
      await fs.writeFile(speakersPath, JSON.stringify(speakers, null, 2), 'utf-8');
      
      res.status(201).json(newSpeaker);
    } catch (error) {
      console.error("Error adding speaker:", error);
      res.status(500).json({ message: "Natiq əlavə etmək mümkün olmadı" });
    }
  });
  
  // Update a speaker (Admin only)
  app.put(`${apiPrefix}/admin/speakers/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, title, bio, topic, image } = req.body;
      
      // Basic validation
      if (!name || !title || !bio || !topic) {
        return res.status(400).json({ message: "Bütün məlumatlar tələb olunur" });
      }
      
      // Import speakers and update
      const fs = await import('fs/promises');
      const path = await import('path');
      const speakersPath = path.join(process.cwd(), 'client/src/data/speakers.json');
      
      const speakersData = await fs.readFile(speakersPath, 'utf-8');
      const speakers = JSON.parse(speakersData);
      
      // Find the speaker
      const speakerIndex = speakers.findIndex((s: any) => s.id === parseInt(id));
      
      if (speakerIndex === -1) {
        return res.status(404).json({ message: "Natiq tapılmadı" });
      }
      
      // Update speaker
      speakers[speakerIndex] = {
        ...speakers[speakerIndex],
        name,
        title,
        bio,
        topic,
        image: image || speakers[speakerIndex].image
      };
      
      // Save back to file
      await fs.writeFile(speakersPath, JSON.stringify(speakers, null, 2), 'utf-8');
      
      res.json(speakers[speakerIndex]);
    } catch (error) {
      console.error("Error updating speaker:", error);
      res.status(500).json({ message: "Natiq məlumatlarını yeniləmək mümkün olmadı" });
    }
  });
  
  // Delete a speaker (Admin only)
  app.delete(`${apiPrefix}/admin/speakers/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Import speakers
      const fs = await import('fs/promises');
      const path = await import('path');
      const speakersPath = path.join(process.cwd(), 'client/src/data/speakers.json');
      
      const speakersData = await fs.readFile(speakersPath, 'utf-8');
      const speakers = JSON.parse(speakersData);
      
      // Find the speaker
      const speakerIndex = speakers.findIndex((s: any) => s.id === parseInt(id));
      
      if (speakerIndex === -1) {
        return res.status(404).json({ message: "Natiq tapılmadı" });
      }
      
      // Remove the speaker
      speakers.splice(speakerIndex, 1);
      
      // Save back to file
      await fs.writeFile(speakersPath, JSON.stringify(speakers, null, 2), 'utf-8');
      
      res.json({ message: "Natiq uğurla silindi" });
    } catch (error) {
      console.error("Error deleting speaker:", error);
      res.status(500).json({ message: "Natiqi silmək mümkün olmadı" });
    }
  });
  
  // ===== ADMIN PROGRAM MANAGEMENT =====
  
  // Get all program sessions (Admin only)
  app.get(`${apiPrefix}/admin/program/sessions`, async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const sessionsPath = path.join(process.cwd(), 'client/src/data/sessions.json');
      
      const sessionsData = await fs.readFile(sessionsPath, 'utf-8');
      const sessions = JSON.parse(sessionsData);
      
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching program sessions:", error);
      res.status(500).json({ message: "Proqram sessiyalarını əldə etmək mümkün olmadı" });
    }
  });
  
  // Add a new program session (Admin only)
  app.post(`${apiPrefix}/admin/program/sessions`, async (req, res) => {
    try {
      const { id, name } = req.body;
      
      // Validation
      if (!id || !name) {
        return res.status(400).json({ message: "ID və ad tələb olunur" });
      }
      
      // Import sessions
      const fs = await import('fs/promises');
      const path = await import('path');
      const sessionsPath = path.join(process.cwd(), 'client/src/data/sessions.json');
      
      const sessionsData = await fs.readFile(sessionsPath, 'utf-8');
      const sessions = JSON.parse(sessionsData);
      
      // Check if session ID already exists
      if (sessions.some((s: any) => s.id === id)) {
        return res.status(400).json({ message: "Bu ID ilə sessiya artıq mövcuddur" });
      }
      
      // Add the new session
      const newSession = { id, name };
      sessions.push(newSession);
      
      // Save back to file
      await fs.writeFile(sessionsPath, JSON.stringify(sessions, null, 2), 'utf-8');
      
      res.status(201).json(newSession);
    } catch (error) {
      console.error("Error adding program session:", error);
      res.status(500).json({ message: "Sessiya əlavə etmək mümkün olmadı" });
    }
  });
  
  // Update a program session (Admin only)
  app.put(`${apiPrefix}/admin/program/sessions/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      // Validation
      if (!name) {
        return res.status(400).json({ message: "Sessiya adı tələb olunur" });
      }
      
      // Import sessions
      const fs = await import('fs/promises');
      const path = await import('path');
      const sessionsPath = path.join(process.cwd(), 'client/src/data/sessions.json');
      
      const sessionsData = await fs.readFile(sessionsPath, 'utf-8');
      const sessions = JSON.parse(sessionsData);
      
      // Find the session
      const sessionIndex = sessions.findIndex((s: any) => s.id === id);
      
      if (sessionIndex === -1) {
        return res.status(404).json({ message: "Sessiya tapılmadı" });
      }
      
      // Update session
      sessions[sessionIndex] = { id, name };
      
      // Save back to file
      await fs.writeFile(sessionsPath, JSON.stringify(sessions, null, 2), 'utf-8');
      
      res.json(sessions[sessionIndex]);
    } catch (error) {
      console.error("Error updating program session:", error);
      res.status(500).json({ message: "Sessiyanı yeniləmək mümkün olmadı" });
    }
  });
  
  // Delete a program session (Admin only)
  app.delete(`${apiPrefix}/admin/program/sessions/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Import sessions
      const fs = await import('fs/promises');
      const path = await import('path');
      const sessionsPath = path.join(process.cwd(), 'client/src/data/sessions.json');
      
      const sessionsData = await fs.readFile(sessionsPath, 'utf-8');
      const sessions = JSON.parse(sessionsData);
      
      // Find the session
      const sessionIndex = sessions.findIndex((s: any) => s.id === id);
      
      if (sessionIndex === -1) {
        return res.status(404).json({ message: "Sessiya tapılmadı" });
      }
      
      // Remove the session
      sessions.splice(sessionIndex, 1);
      
      // Save back to file
      await fs.writeFile(sessionsPath, JSON.stringify(sessions, null, 2), 'utf-8');
      
      res.json({ message: "Sessiya uğurla silindi" });
    } catch (error) {
      console.error("Error deleting program session:", error);
      res.status(500).json({ message: "Sessiyanı silmək mümkün olmadı" });
    }
  });
  
  // Get all program items (Admin only)
  app.get(`${apiPrefix}/admin/program/items`, async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const itemsPath = path.join(process.cwd(), 'client/src/data/programItems.json');
      
      const itemsData = await fs.readFile(itemsPath, 'utf-8');
      const items = JSON.parse(itemsData);
      
      res.json(items);
    } catch (error) {
      console.error("Error fetching program items:", error);
      res.status(500).json({ message: "Proqram elementlərini əldə etmək mümkün olmadı" });
    }
  });
  
  // Add a new program item (Admin only)
  app.post(`${apiPrefix}/admin/program/items`, async (req, res) => {
    try {
      const { time, title, description, speakerId, session } = req.body;
      
      // Validation
      if (!time || !title || !session) {
        return res.status(400).json({ message: "Vaxt, başlıq və sessiya tələb olunur" });
      }
      
      // Import program items
      const fs = await import('fs/promises');
      const path = await import('path');
      const itemsPath = path.join(process.cwd(), 'client/src/data/programItems.json');
      
      const itemsData = await fs.readFile(itemsPath, 'utf-8');
      const items = JSON.parse(itemsData);
      
      // Create new item with the next ID
      const newId = items.length > 0 ? Math.max(...items.map((i: any) => i.id)) + 1 : 1;
      
      // Create new item
      const newItem = {
        id: newId,
        time,
        title,
        description: description || "",
        speakerId: speakerId || null,
        session
      };
      
      // Add the new item
      items.push(newItem);
      
      // Save back to file
      await fs.writeFile(itemsPath, JSON.stringify(items, null, 2), 'utf-8');
      
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error adding program item:", error);
      res.status(500).json({ message: "Proqram elementi əlavə etmək mümkün olmadı" });
    }
  });
  
  // Update a program item (Admin only)
  app.put(`${apiPrefix}/admin/program/items/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const { time, title, description, speakerId, session } = req.body;
      
      // Validation
      if (!time || !title || !session) {
        return res.status(400).json({ message: "Vaxt, başlıq və sessiya tələb olunur" });
      }
      
      // Import program items
      const fs = await import('fs/promises');
      const path = await import('path');
      const itemsPath = path.join(process.cwd(), 'client/src/data/programItems.json');
      
      const itemsData = await fs.readFile(itemsPath, 'utf-8');
      const items = JSON.parse(itemsData);
      
      // Find the item
      const itemIndex = items.findIndex((i: any) => i.id === parseInt(id));
      
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Proqram elementi tapılmadı" });
      }
      
      // Update item
      items[itemIndex] = {
        ...items[itemIndex],
        time,
        title,
        description: description || "",
        speakerId: speakerId || null,
        session
      };
      
      // Save back to file
      await fs.writeFile(itemsPath, JSON.stringify(items, null, 2), 'utf-8');
      
      res.json(items[itemIndex]);
    } catch (error) {
      console.error("Error updating program item:", error);
      res.status(500).json({ message: "Proqram elementi yeniləmək mümkün olmadı" });
    }
  });
  
  // Delete a program item (Admin only)
  app.delete(`${apiPrefix}/admin/program/items/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Import program items
      const fs = await import('fs/promises');
      const path = await import('path');
      const itemsPath = path.join(process.cwd(), 'client/src/data/programItems.json');
      
      const itemsData = await fs.readFile(itemsPath, 'utf-8');
      const items = JSON.parse(itemsData);
      
      // Find the item
      const itemIndex = items.findIndex((i: any) => i.id === parseInt(id));
      
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Proqram elementi tapılmadı" });
      }
      
      // Remove the item
      items.splice(itemIndex, 1);
      
      // Save back to file
      await fs.writeFile(itemsPath, JSON.stringify(items, null, 2), 'utf-8');
      
      res.json({ message: "Proqram elementi uğurla silindi" });
    } catch (error) {
      console.error("Error deleting program item:", error);
      res.status(500).json({ message: "Proqram elementi silmək mümkün olmadı" });
    }
  });
  
  // ===== ADMIN STATISTICS =====
  
  // Get dashboard statistics (Admin only)
  app.get(`${apiPrefix}/admin/statistics`, async (req, res) => {
    try {
      // Get registrations count
      const [registrationsResult] = await pool.query('SELECT COUNT(*) as count FROM registrations');
      const registrationsCount = (registrationsResult as any[])[0].count;
      
      // Get contacts count and unread count
      const [contactsResult] = await pool.query('SELECT COUNT(*) as count FROM contacts');
      const contactsCount = (contactsResult as any[])[0].count;
      
      const [unreadResult] = await pool.query('SELECT COUNT(*) as count FROM contacts WHERE is_read = FALSE');
      const unreadCount = (unreadResult as any[])[0].count;
      
      // Get recent registrations by date (last 7 days)
      const [recentRegistrations] = await pool.query(`
        SELECT 
          DATE(created_at) as date, 
          COUNT(*) as count 
        FROM registrations 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);
      
      // Get registrations by topic
      const [topicsRegistrations] = await pool.query(`
        SELECT topics FROM registrations WHERE topics IS NOT NULL
      `);
      
      // Process topics data
      const topicsMap = new Map<string, number>();
      
      (topicsRegistrations as any[]).forEach(row => {
        if (row.topics) {
          const topicsList = row.topics.split(',');
          topicsList.forEach((topic: string) => {
            const trimmedTopic = topic.trim();
            if (trimmedTopic) {
              topicsMap.set(trimmedTopic, (topicsMap.get(trimmedTopic) || 0) + 1);
            }
          });
        }
      });
      
      const topicStats = Array.from(topicsMap.entries()).map(([topic, count]) => ({ topic, count }));
      
      // Get speakers count
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const speakersData = await fs.readFile(path.join(process.cwd(), 'client/src/data/speakers.json'), 'utf-8');
      const speakers = JSON.parse(speakersData);
      const speakersCount = speakers.length;
      
      // Get program items count
      const programItemsData = await fs.readFile(path.join(process.cwd(), 'client/src/data/programItems.json'), 'utf-8');
      const programItems = JSON.parse(programItemsData);
      const programItemsCount = programItems.length;
      
      res.json({
        registrationsCount,
        contactsCount,
        unreadCount,
        speakersCount,
        programItemsCount,
        recentRegistrations,
        topicStats
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Statistik məlumatları əldə etmək mümkün olmadı" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
