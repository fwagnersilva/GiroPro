import { getDb, getClient } from './index';
import { sql } from 'drizzle-orm';

export async function initTables() {
  try {
    const db = getDb();
    const client = getClient();

    if (!db) {
      throw new Error('❌ Database instance (db) não está definido');
    }

    // Se client é null, estamos usando SQLite
    if (!client) {
      console.log('✅ SQLite inicializado - tabelas prontas para uso');
      console.log('💡 Use migrations para criar/atualizar tabelas do SQLite');
      return true;
    }

    // PostgreSQL - validar conexão
    console.log('🔄 Inicializando tabelas (PostgreSQL)...');

    // Teste de conexão com postgres-js
    if (typeof client === 'function') {
      await client`SELECT 1`;
      console.log('✅ Conexão PostgreSQL ativa (postgres-js)');
    }
    // Teste de conexão com node-postgres (Pool)
    else if (client.connect) {
      const poolClient = await client.connect();
      await poolClient.query('SELECT 1');
      poolClient.release();
      console.log('✅ Conexão PostgreSQL ativa (node-postgres)');
    }

    // Verificar banco atual
    const result = await db.execute(sql`SELECT current_database() as db_name`);
    console.log('✅ Banco PostgreSQL verificado');

    // Criar extensão UUID
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    console.log('✅ Extensão uuid-ossp verificada');

    console.log('📊 Use "npm run db:push" para criar/atualizar tabelas');
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar tabelas:', error);
    throw error;
  }
}
