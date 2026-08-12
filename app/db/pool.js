import { Pool } from "pg";

export const db = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      options: "-c timezone=America/Argentina/Buenos_Aires"
    })
  : new Pool({
      user: process.env.DB_USER ?? "postgres",
      password: process.env.DB_PASS ?? "postgres",
      host: process.env.DB_HOST ?? "db",
      port: process.env.DB_PORT ?? 5432,
      database: process.env.DB_NAME ?? "postgres",
      options: "-c timezone=America/Argentina/Buenos_Aires"
    });