import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('❌ DATABASE_URL não configurada para PostgreSQL');
}

// Configuração do cliente PostgreSQL
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

const sanitizedUrl = connectionString.replace(/:[^:@]*@/, ':***@');
console.log(`✅ Conectado ao PostgreSQL: ${sanitizedUrl}`);

export const closeConnection = async () => {
  await client.end();
  console.log('🔌 Conexão PostgreSQL encerrada');
};