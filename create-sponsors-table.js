// Script to create sponsors table
const mysql = require('mysql2/promise');

async function createSponsorsTable() {
  // Verify required environment variables
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
    console.log("Creating sponsors table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sponsors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo VARCHAR(2000) NOT NULL,
        website VARCHAR(1000),
        level VARCHAR(100) NOT NULL,
        \`order\` INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Sponsors table created successfully!");
  } catch (error) {
    console.error("Error creating sponsors table:", error);
  } finally {
    await pool.end();
  }
}

createSponsorsTable().catch(console.error);