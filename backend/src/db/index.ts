// Exportar a conexão correta baseada no ambiente
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const dbType = process.env.DB_TYPE || 'sqlite_memory';
const hasPostgresUrl = !!process.env.DATABASE_URL;

// Determinar qual banco usar
const usePostgres = isProduction || dbType === 'postgres' || dbType === 'postgresql' || hasPostgresUrl;

if (usePostgres) {
  console.log('🐘 Usando PostgreSQL');
  // Exportar tudo do PostgreSQL
  export * from './connection.postgres';
} else {
  console.log('📦 Usando SQLite');
  // Exportar tudo do SQLite
  export * from './connection.sqlite';
}

// Re-exportar o schema
export * from './schema';
export { createDatabaseConnection, checkDatabaseConnection } from './connection.factory';
