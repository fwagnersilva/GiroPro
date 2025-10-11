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

export { checkDatabaseConnection, schema };

// Exportar funções de inicialização
export { initTables } from './initTables';

