import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

// Configuração para SQLite
// Use ':memory:' para banco em memória (ideal para testes)
// Use um caminho de arquivo para persistência local
const dbPath = process.env.SQLITE_DB_PATH || './giropro.db';

const sqlite = new Database(dbPath);

// Habilitar foreign keys no SQLite
sqlite.pragma('foreign_keys = ON');

// Se for banco em memória, criar as tabelas automaticamente
if (dbPath === ':memory:') {
  console.log('🔧 Inicializando banco em memória...');
  
  const schemaSQL = `
    CREATE TABLE IF NOT EXISTS usuarios (
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

    CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email_idx ON usuarios (email);
    CREATE INDEX IF NOT EXISTS usuarios_status_idx ON usuarios (statusConta);
    CREATE INDEX IF NOT EXISTS usuarios_pontos_idx ON usuarios (pontosTotal);
    CREATE INDEX IF NOT EXISTS usuarios_nivel_idx ON usuarios (nivelUsuario);

    CREATE TABLE IF NOT EXISTS veiculos (
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

    CREATE INDEX IF NOT EXISTS veiculos_usuario_idx ON veiculos (idUsuario);
    CREATE UNIQUE INDEX IF NOT EXISTS veiculos_placa_idx ON veiculos (placa);
    CREATE INDEX IF NOT EXISTS veiculos_ano_idx ON veiculos (ano);
    CREATE INDEX IF NOT EXISTS veiculos_combustivel_idx ON veiculos (tipoCombustivel);
    CREATE INDEX IF NOT EXISTS veiculos_usuario_ativo_idx ON veiculos (idUsuario, deletedAt);
  `;

  sqlite.exec(schemaSQL);
  console.log('✅ Tabelas criadas no banco em memória');
}

export const db = drizzle(sqlite as any, { schema });

// Função para fechar a conexão (útil para testes)
export const closeConnection = () => {
  sqlite.close();
};

