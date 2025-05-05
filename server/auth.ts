import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@db";

// Types for user authentication
interface CustomUser {
  id: number;
  username: string;
}

declare global {
  namespace Express {
    interface User extends CustomUser {}
  }
}

// Password hashing utilities
const scryptAsync = promisify(scrypt);

// Hash password
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Compare passwords
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Set up authentication
export function setupAuth(app: Express) {
  // Session store setup
  const MySQLStore = connectPgSimple(session);
  const sessionStore = new MySQLStore({
    pool: pool as any, // Type casting for MySQL pool
    createTableIfMissing: true,
    tableName: "session" // Default is "session"
  });

  // Session configuration
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "tedx-ndu-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  };

  // Configure Express session and passport
  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Get user by username
        const [rows] = await pool.query(
          "SELECT * FROM users WHERE username = ?",
          [username]
        );

        const users = rows as any[];
        if (!users || users.length === 0) {
          return done(null, false, { message: "İstifadəçi adı və ya şifrə yanlışdır" });
        }

        const user = users[0];
        
        // Check password
        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "İstifadəçi adı və ya şifrə yanlışdır" });
        }

        // Return authenticated user
        return done(null, {
          id: user.id,
          username: user.username
        });
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const [rows] = await pool.query(
        "SELECT id, username FROM users WHERE id = ?",
        [id]
      );

      const users = rows as any[];
      if (!users || users.length === 0) {
        return done(null, false);
      }

      done(null, {
        id: users[0].id,
        username: users[0].username
      });
    } catch (error) {
      done(error, false);
    }
  });

  // Handle registration
  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "İstifadəçi adı və şifrə tələb olunur" });
      }

      // Check if username already exists
      const [existingUsers] = await pool.query(
        "SELECT id FROM users WHERE username = ?",
        [username]
      );

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return res.status(400).json({ message: "Bu istifadəçi adı artıq mövcuddur" });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const [result] = await pool.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword]
      );

      const insertId = (result as any).insertId;

      // Auto login after registration
      req.login({ id: insertId, username }, (err) => {
        if (err) return next(err);
        return res.status(201).json({ id: insertId, username });
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Qeydiyyat zamanı xəta baş verdi" });
    }
  });

  // Handle login
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Giriş uğursuz oldu" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.json(user);
      });
    })(req, res, next);
  });

  // Handle logout
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Uğurla çıxış edildi" });
    });
  });

  // Get current user
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Giriş edilməyib" });
    }
    res.json(req.user);
  });

  // Admin middleware for protected routes
  app.use("/api/admin/*", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Bu əməliyyat üçün giriş etməlisiniz" });
    }
    next();
  });
}