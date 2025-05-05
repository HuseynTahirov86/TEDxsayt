import mysql from 'mysql2/promise';

async function createTables() {
  if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE) {
    throw new Error(
      "MySQL environment variables must be set (MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE)",
    );
  }

  // Create a MySQL connection pool
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  });

  try {
    console.log("Creating MySQL tables...");

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);
    console.log("Users table created");

    // Create speakers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS speakers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        bio TEXT NOT NULL,
        topic VARCHAR(255) NOT NULL,
        image VARCHAR(2000) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("Speakers table created");

    // Create program_sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS program_sessions (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        \`order\` INT NOT NULL
      )
    `);
    console.log("Program sessions table created");

    // Create program_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS program_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        time VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        session VARCHAR(50) NOT NULL,
        speaker_id INT,
        \`order\` INT NOT NULL,
        FOREIGN KEY (session) REFERENCES program_sessions(id),
        FOREIGN KEY (speaker_id) REFERENCES speakers(id)
      )
    `);
    console.log("Program items table created");

    // Create registrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(50) NOT NULL,
        occupation VARCHAR(255),
        topics TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("Registrations table created");

    // Create contacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        is_read BOOLEAN DEFAULT FALSE NOT NULL
      )
    `);
    console.log("Contacts table created");

    console.log("All tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await pool.end();
  }
}

createTables();