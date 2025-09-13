const { drizzle } = require('drizzle-orm/better-sqlite3');
const Database = require('better-sqlite3');
const fs = require('fs');

// Conectar ao banco em memória
const sqlite = new Database(':memory:');
sqlite.pragma('foreign_keys = ON');

// Ler e executar o schema SQL
const schemaSQL = `
CREATE TABLE usuarios (
  id TEXT PRIMARY KEY NOT NULL,
  nome TEXT(100) NOT NULL,
  email TEXT(255) NOT NULL,
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
);

CREATE UNIQUE INDEX usuarios_email_idx ON usuarios (email);
CREATE INDEX usuarios_status_idx ON usuarios (statusConta);
CREATE INDEX usuarios_pontos_idx ON usuarios (pontosTotal);
CREATE INDEX usuarios_nivel_idx ON usuarios (nivelUsuario);

CREATE TABLE veiculos (
  id TEXT PRIMARY KEY NOT NULL,
  idUsuario TEXT NOT NULL,
  marca TEXT(50) NOT NULL,
  modelo TEXT(100) NOT NULL,
  ano INTEGER NOT NULL,
  placa TEXT(8) NOT NULL,
  tipoCombustivel TEXT NOT NULL,
  tipoUso TEXT NOT NULL,
  valorAluguel INTEGER,
  valorPrestacao INTEGER,
  mediaConsumo REAL,
  dataCadastro INTEGER DEFAULT (unixepoch()) NOT NULL,
  updatedAt INTEGER DEFAULT (unixepoch()) NOT NULL,
  deletedAt INTEGER,
  FOREIGN KEY (idUsuario) REFERENCES usuarios(id) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX veiculos_usuario_idx ON veiculos (idUsuario);
CREATE UNIQUE INDEX veiculos_placa_idx ON veiculos (placa);
CREATE INDEX veiculos_ano_idx ON veiculos (ano);
CREATE INDEX veiculos_combustivel_idx ON veiculos (tipoCombustivel);
CREATE INDEX veiculos_usuario_ativo_idx ON veiculos (idUsuario, deletedAt);
`;

// Executar o schema
sqlite.exec(schemaSQL);

console.log('✅ Tabelas criadas no banco em memória');
console.log('📋 Tabelas disponíveis:', sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table'").all());

sqlite.close();
