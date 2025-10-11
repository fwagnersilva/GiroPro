import { getDb, getClient } from './index';
import { sql } from 'drizzle-orm';

export async function initTables() {
  console.log('🔄 Inicializando tabelas (PostgreSQL)...');
  
  try {
    const db = getDb();
    const client = getClient();

    if (!db) {
      throw new Error('❌ Database instance (db) não está definido');
    }

    if (!client) {
      throw new Error('❌ Client não está definido');
    }

    if (client.connect) {
      const poolClient = await client.connect();
      await poolClient.query('SELECT 1 as test');
      poolClient.release();
      console.log('✅ Conexão PostgreSQL ativa (pool)');
    }

    const result = await db.execute(sql`SELECT current_database() as db_name`);
    console.log('✅ Conexão PostgreSQL ativa (drizzle)');
    
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    console.log('✅ Extensão uuid-ossp verificada');
    
    console.log('📊 Use "pnpm run db:push" para criar/atualizar tabelas');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar PostgreSQL:', error);
    throw error;
  }
}
