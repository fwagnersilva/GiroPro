import dotenv from 'dotenv';

// Only load .env in development/local, not in production (Qoddi provides env vars)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import { createDatabaseConnection, checkDatabaseConnection } from './connection.factory';

let dbInstance: any;
let clientInstance: any;

export async function initializeDatabase() {
  const { db, client } = await createDatabaseConnection();
  dbInstance = db;
  clientInstance = client;
  return { db, client };
}

export function getDb() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dbInstance;
}

export function getClient() {
  return clientInstance;
}

export async function closeConnection() {
  if (clientInstance) {
    await clientInstance.end();
  }
}

// Proxy para acessar db de forma lazy
export const db = new Proxy({} as any, {
  get(target, prop) {
    if (!dbInstance) {
      throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return dbInstance[prop];
  }
});

// Exportar pool (alias para client)
export const pool = new Proxy({} as any, {
  get(target, prop) {
    if (!clientInstance) {
      throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return clientInstance[prop];
  }
});

export { checkDatabaseConnection };

// Exportar todas as tabelas do schema
export * from './schema';

// Exportar funções de inicialização
export { initTables } from './initTables';
