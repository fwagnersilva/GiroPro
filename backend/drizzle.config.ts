import type { Config } from "drizzle-kit";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL não está definida no arquivo .env');
}

const config: Config = {
  schema: "./src/db/schema.postgres.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
};

export default config;
