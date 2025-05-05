import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

// Create a MySQL connection pool with direct credentials
export const pool = mysql.createPool({
  host: 'bioscript.shop',
  user: 'bio1criptshop_tedx',
  password: 'huseyn2009',
  database: 'bio1criptshop_tedx',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
});

// Setup Drizzle ORM with MySQL client 
// (Note: We'll keep this for schema definitions, but will primarily use raw queries)
export const db = drizzle(pool, { schema, mode: 'default' });