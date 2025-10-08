// Usar o factory pattern para conexão dinâmica
export { createDatabaseConnection, checkDatabaseConnection } from './connection.factory';
export * from './schema';

// Criar e exportar a conexão do banco
import { createDatabaseConnection } from './connection.factory';

let dbInstance: any = null;

export const getDb = async () => {
  if (!dbInstance) {
    dbInstance = await createDatabaseConnection();
  }
  return dbInstance;
};

// Para compatibilidade com código existente que importa { db }
export const db = await createDatabaseConnection();
