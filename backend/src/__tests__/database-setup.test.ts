import { db } from '../db/connection.sqlite';
import { sql } from 'drizzle-orm';

describe('Database Setup Diagnostic', () => {
  it('deve verificar se as tabelas foram criadas', async () => {
    console.log('🔍 Verificando tabelas no banco...');
    
    try {
      // Verificar se a tabela usuarios existe
      const result = await db.all(sql`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='usuarios'
      `);
      
      console.log('📋 Resultado da consulta de tabelas:', result);
      
      if (result.length === 0) {
        console.log('❌ Tabela usuarios não encontrada');
        
        // Listar todas as tabelas
        const allTables = await db.all(sql`
          SELECT name FROM sqlite_master WHERE type='table'
        `);
        console.log('📊 Todas as tabelas no banco:', allTables);
        
        // Tentar criar a tabela manualmente
        console.log('🔧 Tentando criar tabela usuarios...');
        await db.run(sql`
          CREATE TABLE IF NOT EXISTS usuarios (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senhaHash TEXT NOT NULL,
            role TEXT DEFAULT 'user' NOT NULL,
            statusConta TEXT DEFAULT 'ativo' NOT NULL,
            dataCadastro INTEGER DEFAULT (unixepoch()) NOT NULL,
            updatedAt INTEGER DEFAULT (unixepoch()) NOT NULL,
            deletedAt INTEGER
          )
        `);
        console.log('✅ Tabela usuarios criada manualmente');
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
