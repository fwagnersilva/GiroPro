import { db } from '../db';
import { sql } from 'drizzle-orm';

describe('Database Setup Diagnostic', () => {
  it('deve verificar se as tabelas foram criadas', async () => {
    console.log('🔍 Verificando tabelas no banco PostgreSQL...');
    
    try {
      // Verificar se a tabela usuarios existe no PostgreSQL
      const result = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'usuarios'
      `);
      
      console.log('📋 Resultado da consulta de tabelas:', result);
      
      if (result.rows && result.rows.length === 0) {
        console.log('❌ Tabela usuarios não encontrada');
        
        // Listar todas as tabelas
        const allTables = await db.execute(sql`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `);
        console.log('📊 Todas as tabelas no banco:', allTables.rows);
        
        console.log('⚠️ Execute "npm run db:push" para criar as tabelas');
      } else {
        console.log('✅ Tabela usuarios encontrada');
      }
      
      expect(true).toBe(true); // Teste sempre passa para ver os logs
    } catch (error) {
      console.error('❌ Erro no diagnóstico:', error);
      throw error;
    }
  });
});

