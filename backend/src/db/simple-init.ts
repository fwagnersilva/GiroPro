import { db } from './connection';
import { sql } from 'drizzle-orm';

export async function initializeDatabase() {
  try {
    console.log('🔧 Inicializando banco de dados...');
    
    // Criar tabela usuarios
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        nome TEXT(100) NOT NULL,
        email TEXT(255) NOT NULL UNIQUE,
        senhaHash TEXT(255) NOT NULL,
        statusConta TEXT DEFAULT 'ativo' NOT NULL,
        dataCadastro INTEGER DEFAULT (unixepoch()) NOT NULL,
        pontosTotal INTEGER DEFAULT 0 NOT NULL,
        nivelUsuario TEXT DEFAULT 'iniciante' NOT NULL,
        conquistasDesbloqueadas INTEGER DEFAULT 0 NOT NULL,
        updatedAt INTEGER DEFAULT (unixepoch()) NOT NULL,
        deletedAt INTEGER,
        tentativasLogin INTEGER DEFAULT 0 NOT NULL,
        ultimoLoginFalhado INTEGER,
        ultimaAtividade INTEGER DEFAULT (unixepoch()) NOT NULL
      )
    `);
    
    // Criar índices para usuarios
    await db.run(sql`CREATE INDEX IF NOT EXISTS usuarios_email_idx ON usuarios(email)`);
    await db.run(sql`CREATE INDEX IF NOT EXISTS usuarios_status_idx ON usuarios(statusConta)`);
    
    console.log('✅ Tabela usuarios criada com sucesso!');
    
    // Verificar se a tabela foi criada
    const tables = await db.all(sql`SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'`);
    console.log('📊 Verificação:', tables.length > 0 ? 'Tabela usuarios encontrada' : 'Tabela usuarios não encontrada');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    throw error;
  }
}

