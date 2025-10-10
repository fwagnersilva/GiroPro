import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.postgres';

export async function createDatabaseConnection() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('❌ DATABASE_URL não configurada');
  }

  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  const db = drizzle(client, { schema });
  
  return { db, client };
}

export async function checkDatabaseConnection() {
  try {
    const { client } = await createDatabaseConnection();
    await client`SELECT 1`;
    await client.end();
    console.log('✅ Conexão PostgreSQL verificada com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', error);
    return false;
  }
}
