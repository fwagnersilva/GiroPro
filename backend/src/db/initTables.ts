import { db } from './index';
import { sql } from 'drizzle-orm';

export async function initTables() {
  console.log('🔄 Inicializando tabelas (PostgreSQL)...');
  
  try {
    // Verificar conexão
    await db.execute(sql`SELECT 1`);
    console.log('✅ Conexão PostgreSQL ativa');
    
    // As tabelas serão criadas via migrations do Drizzle
    console.log('📊 Use "npx drizzle-kit push:pg" para criar/atualizar tabelas');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar PostgreSQL:', error);
    throw error;
  }
}
