import type { Config } from "drizzle-kit";
import dotenv from 'dotenv';

dotenv.config();

// APENAS PostgreSQL - sem SQLite
const config: Config = {
  schema: "./src/db/schema.postgres.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://giropro:giropro123@localhost:5432/giropro_dev",
  },
};

export default config;
