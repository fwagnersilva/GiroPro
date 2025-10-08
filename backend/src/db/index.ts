// Exportar o factory e schema
export { createDatabaseConnection, checkDatabaseConnection } from './connection.factory';
export * from './schema';

// Criar instância do banco de forma lazy
import { createDatabaseConnection } from './connection.factory';

let dbInstance: any = null;

export const getDb = async () => {
  if (!dbInstance) {
    dbInstance = await createDatabaseConnection();
  }
  return dbInstance;
};

// Inicializar o banco imediatamente (mas sem await no top-level)
let dbPromise: Promise<any> | null = null;

const initDb = () => {
  if (!dbPromise) {
    dbPromise = createDatabaseConnection();
  }
  return dbPromise;
};

// Exportar uma promise que resolve para o db
export const db = initDb();
