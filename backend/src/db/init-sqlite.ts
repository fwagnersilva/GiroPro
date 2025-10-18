import Database from 'better-sqlite3';

export function initSqliteTables(db: any) {
  console.log('🔧 Criando tabelas SQLite...');
  
  const sqlite = db as any;
  
  // Tabela de usuários
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user' NOT NULL,
      status_conta TEXT DEFAULT 'ativo' NOT NULL,
      data_nascimento INTEGER,
      cidade TEXT,
      data_cadastro INTEGER NOT NULL,
      pontos_total INTEGER DEFAULT 0 NOT NULL,
      nivel_usuario TEXT DEFAULT 'iniciante' NOT NULL,
      conquistas_desbloqueadas INTEGER DEFAULT 0 NOT NULL,
      updated_at INTEGER NOT NULL,
      deleted_at INTEGER,
      tentativas_login INTEGER DEFAULT 0 NOT NULL,
      ultimo_login_falhado INTEGER,
      ultima_atividade INTEGER NOT NULL
    )
  `);

  // Tabela de veículos
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS veiculos (
      id TEXT PRIMARY KEY,
      id_usuario TEXT NOT NULL,
      marca TEXT NOT NULL,
      modelo TEXT NOT NULL,
      ano INTEGER NOT NULL,
      placa TEXT NOT NULL UNIQUE,
      tipo_combustivel TEXT NOT NULL,
      tipo_uso TEXT NOT NULL,
      valor_aluguel INTEGER,
      valor_prestacao INTEGER,
      media_consumo REAL,
      data_cadastro INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      deleted_at INTEGER,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `);

  // Tabela de jornadas
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS jornadas (
      id TEXT PRIMARY KEY,
      id_usuario TEXT NOT NULL,
      id_veiculo TEXT NOT NULL,
      data_inicio INTEGER NOT NULL,
      km_inicio INTEGER NOT NULL,
      data_fim INTEGER,
      km_fim INTEGER,
      ganho_bruto INTEGER,
      lucro_liquido_estimado INTEGER DEFAULT 0 NOT NULL,
      margem_lucro REAL DEFAULT 0 NOT NULL,
      km_total INTEGER,
      duracao_minutos INTEGER,
      custo_combustivel_estimado INTEGER DEFAULT 0 NOT NULL,
      outras_despesas INTEGER DEFAULT 0 NOT NULL,
      observacoes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      deleted_at INTEGER,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (id_veiculo) REFERENCES veiculos(id) ON DELETE CASCADE
    )
  `);

  // Tabela de abastecimentos
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS abastecimentos (
      id TEXT PRIMARY KEY,
      id_usuario TEXT NOT NULL,
      id_veiculo TEXT NOT NULL,
      data_abastecimento INTEGER NOT NULL,
      tipo_combustivel TEXT NOT NULL,
      litros REAL NOT NULL,
      valor_litro INTEGER NOT NULL,
      valor_total INTEGER NOT NULL,
      km_atual INTEGER,
      nome_posto TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      deleted_at INTEGER,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (id_veiculo) REFERENCES veiculos(id) ON DELETE CASCADE
    )
  `);

  // Tabela de despesas
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS despesas (
      id TEXT PRIMARY KEY,
      id_usuario TEXT NOT NULL,
      id_veiculo TEXT,
      data_despesa INTEGER NOT NULL,
      tipo_despesa TEXT NOT NULL,
      valor_despesa INTEGER NOT NULL,
      descricao TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      deleted_at INTEGER,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (id_veiculo) REFERENCES veiculos(id) ON DELETE CASCADE
    )
  `);

  // Tabela de plataformas
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS plataformas (
      id TEXT PRIMARY KEY,
      id_usuario TEXT NOT NULL,
      nome TEXT NOT NULL,
      is_padrao INTEGER DEFAULT 0 NOT NULL,
      ativa INTEGER DEFAULT 1 NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      deleted_at INTEGER,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `);

  // Tabela de jornadas faturamento por plataforma
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS jornadas_faturamento_por_plataforma (
      id TEXT PRIMARY KEY,
      id_jornada TEXT NOT NULL,
      id_plataforma TEXT NOT NULL,
      valor INTEGER NOT NULL,
      valor_antes_corte INTEGER,
      valor_depois_corte INTEGER,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (id_jornada) REFERENCES jornadas(id) ON DELETE CASCADE,
      FOREIGN KEY (id_plataforma) REFERENCES plataformas(id) ON DELETE CASCADE,
      UNIQUE(id_jornada, id_plataforma)
    )
  `);

  console.log('✅ Tabelas SQLite criadas com sucesso!');
}