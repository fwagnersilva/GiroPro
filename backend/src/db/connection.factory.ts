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
    const sqlite = new Database('giropro.db');
    const db = drizzleSqlite(sqlite, { schema });
    console.log('✅ Banco SQLite inicializado');
    return { db, client: null };
  }

  // PostgreSQL connection - SEMPRE com SSL
  console.log('🔌 Conectando ao PostgreSQL...');
  
  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: { rejectUnauthorized: false }, // SSL SEMPRE ativo
  });

  const db = drizzle(client, { schema });

  // Test connection
  try {
    await client`SELECT 1`;
    console.log('✅ Conexão PostgreSQL estabelecida com sucesso');
  } catch (testError) {
    console.error('❌ Erro ao testar conexão PostgreSQL:', testError);
    await client.end();
    throw testError;
  }

  return { db, client };
}

export async function checkDatabaseConnection() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      const sqlite = new Database('giropro.db');
      sqlite.close();
      console.log('✅ Conexão SQLite verificada com sucesso');
      return true;
    }

    const client = postgres(connectionString, {
      max: 1,
      connect_timeout: 5,
      ssl: { rejectUnauthorized: false }, // SSL SEMPRE ativo
    });

    await client`SELECT 1`;
    await client.end();
    console.log('✅ Conexão PostgreSQL verificada com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    return false;
  }
}
