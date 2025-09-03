import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

dotenv.config();

const dbPath = process.env.SQLITE_DB_PATH || ':memory:';

const sqlite = new Database(dbPath);

sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite as any, { schema });

// Executar migrações se estiver usando banco em memória
if (dbPath === ':memory:') {
  console.log('🔧 Executando migrações para banco em memória...');
  migrate(db, { migrationsFolder: './drizzle' });
  console.log('✅ Migrações concluídas para banco em memória.');
}

export const closeConnection = () => {
  sqlite.close();
};

