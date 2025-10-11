import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.postgres';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

export async function createDatabaseConnection() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // Use SQLite for local development if DATABASE_URL is not set
    console.log('⚠️ DATABASE_URL não definida, usando SQLite para desenvolvimento local.');
    const sqlite = new Database('sqlite.db');
    const db = drizzleSqlite(sqlite, { schema });
    return { db, client: null }; // client is not applicable for SQLite
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
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      // For SQLite, just check if the file can be opened
      const sqlite = new Database('sqlite.db');
      sqlite.close();
      console.log('✅ Conexão SQLite verificada com sucesso');
      return true;
    }
    const { client } = await createDatabaseConnection();
    await client`SELECT 1`;
    await client.end();
    console.log('✅ Conexão PostgreSQL verificada com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    return false;
  }
}

