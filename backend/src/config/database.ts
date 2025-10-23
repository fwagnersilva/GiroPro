import { createDatabaseConnection, checkDatabaseConnection } from '../db/connection.factory';

let dbInstance: any;
let clientInstance: any;
let isSqliteMode = false;

export async function initializeDatabase() {
  try {
    console.log('🔄 Inicializando banco de dados...');
    
    const { db, client, isSqlite } = await createDatabaseConnection();
    
    dbInstance = db;
    clientInstance = client;
    isSqliteMode = isSqlite;

    if (isSqlite) {
      console.log('✅ SQLite inicializado (desenvolvimento local)');
    } else {
      console.log('✅ PostgreSQL conectado (produção)');
    }

    return { db, client, isSqlite };
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

export function getDb() {
  if (!dbInstance) {
    throw new Error('❌ Database não inicializado. Chame initializeDatabase() primeiro.');
  }
  return dbInstance;
}

export function getClient() {
  return clientInstance;
}

export function isSqlite() {
  return isSqliteMode;
}

export async function closeDatabase() {
  if (clientInstance && !isSqliteMode) {
    try {
      await clientInstance.end();
      console.log('✅ Conexão com PostgreSQL encerrada');
    } catch (error) {
      console.error('❌ Erro ao fechar conexão:', error);
    }
  }
}

export { checkDatabaseConnection };
