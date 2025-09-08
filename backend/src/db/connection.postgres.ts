import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/giropro_db';

// Configuração do cliente PostgreSQL
const client = postgres(connectionString, {
  max: 10, // Máximo de conexões
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

console.log(`🐘 Conectado ao PostgreSQL: ${connectionString.replace(/:[^:@]*@/, ':***@')}`);

// Função para fechar a conexão
export const closeConnection = async () => {
  await client.end();
};

