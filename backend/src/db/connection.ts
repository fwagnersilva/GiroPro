import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.SQLITE_DB_PATH || './giropro.db';

const sqlite = new Database(dbPath);

sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite as any, { schema });

console.log(`🔗 Conectado ao banco: ${dbPath}`);

export const closeConnection = () => {
  sqlite.close();
};

