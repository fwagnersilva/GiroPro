// Importar e re-exportar a conexão correta baseada no ambiente
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const dbType = process.env.DB_TYPE || 'sqlite_memory';
const hasPostgresUrl = !!process.env.DATABASE_URL;

// Determinar qual banco usar
const usePostgres = isProduction || dbType === 'postgres' || dbType === 'postgresql' || hasPostgresUrl;

console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔧 DB_TYPE: ${dbType}`);
console.log(`🔧 Usando: ${usePostgres ? 'PostgreSQL' : 'SQLite'}`);

// Importar e exportar a conexão apropriada
let db: any;
let closeConnection: any;

if (usePostgres) {
  const postgres = require('./connection.postgres');
  db = postgres.db;
  closeConnection = postgres.closeConnection;
} else {
  const sqlite = require('./connection.sqlite');
  db = sqlite.db;
}

export { db, closeConnection };
export * from './schema';
export { createDatabaseConnection, checkDatabaseConnection } from './connection.factory';
