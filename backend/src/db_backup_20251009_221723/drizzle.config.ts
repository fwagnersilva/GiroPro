import type { Config } from "drizzle-kit";
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const hasPostgresUrl = !!process.env.DATABASE_URL;
const usePostgres = isProduction || hasPostgresUrl;

// Configuração para PostgreSQL (Produção)
const postgresConfig: Config = {
  schema: "./src/db/schema.postgres.ts",
  out: "./drizzle/postgres",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};

// Configuração para SQLite (Desenvolvimento)
const sqliteConfig: Config = {
  schema: "./src/db/schema.ts",
  out: "./drizzle/sqlite",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.SQLITE_DB_PATH || ":memory:",
  },
};

// Exportar a configuração apropriada
export default usePostgres ? postgresConfig : sqliteConfig;