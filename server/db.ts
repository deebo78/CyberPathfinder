import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use HTTP fetch mode for better compatibility with serverless/deployment environments
// This avoids WebSocket connection issues in restricted environments
console.log("Initializing Neon database connection with HTTP mode...");
export const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });