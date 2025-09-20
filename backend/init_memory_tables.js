const { drizzle } = require('drizzle-orm/better-sqlite3');
const Database = require('better-sqlite3');
const { migrate } = require('drizzle-orm/better-sqlite3/migrator');

// Criar banco em memória
const sqlite = new Database(':memory:');
const db = drizzle(sqlite);

// SQL para criar tabela usuarios
const createUsuariosTable = `
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senhaHash TEXT NOT NULL,
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
);
`;

try {
  sqlite.exec(createUsuariosTable);
  console.log('✅ Tabela usuarios criada com sucesso');
  
  // Testar inserção
  const insertUser = sqlite.prepare(`
    INSERT INTO usuarios (id, nome, email, senhaHash) 
    VALUES (?, ?, ?, ?)
  `);
  
  insertUser.run('test-id', 'Teste', 'teste@teste.com', 'hash123');
  console.log('✅ Usuário de teste inserido');
  
  // Verificar se existe
  const users = sqlite.prepare('SELECT * FROM usuarios').all();
  console.log('📊 Usuários no banco:', users.length);
  
} catch (error) {
  console.error('❌ Erro:', error);
} finally {
  sqlite.close();
}
