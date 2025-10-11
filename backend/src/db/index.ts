import dotenv from 'dotenv';
dotenv.config();

import { createDatabaseConnection, checkDatabaseConnection } from './connection.factory';
import * as schema from './schema.postgres';

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

// Proxy para acessar db de forma lazy
export const db = new Proxy({} as any, {
  get(target, prop) {
    if (!dbInstance) {
      throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return dbInstance[prop];
  }
});

// Exportar pool (alias para client) usando Proxy
export const pool = new Proxy({} as any, {
  get(target, prop) {
    if (!clientInstance) {
      throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return clientInstance[prop];
  }
});

export { checkDatabaseConnection, schema };

// Exportar funções de inicialização
export { initTables } from './initTables';
