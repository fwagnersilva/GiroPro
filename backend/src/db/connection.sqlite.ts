import { drizzle } from 'drizzle-orm/better-sqlite3';
const Database = require('better-sqlite3');
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

// Configuração para SQLite
// Use ':memory:' para banco em memória (ideal para testes)
// Use um caminho de arquivo para persistência local
const dbPath = process.env.SQLITE_DB_PATH || ":memory:";
console.log("DB Path:", dbPath);

const sqlite = new Database(dbPath);

// Habilitar foreign keys no SQLite
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite as any, { schema });

// Função para fechar a conexão (útil para testes)
export const closeConnection = () => {
  sqlite.close();
};


