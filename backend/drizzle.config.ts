import type { Config } from "drizzle-kit";
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL não está definida no arquivo .env');
}

export default {
  schema: "./src/db/schema.postgres.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;