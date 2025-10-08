import { db } from './index';
import { sql } from 'drizzle-orm';

export async function initializeTables() {
  try {
    // Criar tabela usuarios
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senhaHash TEXT NOT NULL,
        role TEXT DEFAULT 'user' NOT NULL,
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

    // Criar tabela veiculos
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS veiculos (
        id TEXT PRIMARY KEY,
        idUsuario TEXT NOT NULL,
        marca TEXT NOT NULL,
        modelo TEXT NOT NULL,
        ano INTEGER NOT NULL,
        placa TEXT NOT NULL,
        tipoCombustivel TEXT NOT NULL,
        tipoUso TEXT DEFAULT 'proprio' NOT NULL,
        valorAluguel INTEGER,
        valorPrestacao INTEGER,
        mediaConsumo REAL,
        dataCadastro INTEGER DEFAULT (unixepoch()) NOT NULL,
        updatedAt INTEGER DEFAULT (unixepoch()) NOT NULL,
        deletedAt INTEGER,
        FOREIGN KEY (idUsuario) REFERENCES usuarios(id)
      )
    `);

    // Criar tabela jornadas
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS jornadas (
        id TEXT PRIMARY KEY,
        idUsuario TEXT NOT NULL,
        idVeiculo TEXT NOT NULL,
        dataInicio INTEGER NOT NULL,
        dataFim INTEGER,
        kmInicio REAL NOT NULL,
        kmFim REAL,
        ganhoBruto INTEGER DEFAULT 0,
        createdAt INTEGER DEFAULT (unixepoch()) NOT NULL,
        updatedAt INTEGER DEFAULT (unixepoch()) NOT NULL,
        deletedAt INTEGER,
        FOREIGN KEY (idUsuario) REFERENCES usuarios(id),
        FOREIGN KEY (idVeiculo) REFERENCES veiculos(id)
      )
    `);

    // Criar tabela abastecimentos
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS abastecimentos (
        id TEXT PRIMARY KEY,
        idUsuario TEXT NOT NULL,
        idVeiculo TEXT NOT NULL,
        dataAbastecimento INTEGER NOT NULL,
        litros REAL NOT NULL,
        valorTotal INTEGER NOT NULL,
        valorLitro INTEGER NOT NULL,
        tipoCombustivel TEXT NOT NULL,
        kmAtual REAL,
        createdAt INTEGER DEFAULT (unixepoch()) NOT NULL,
        updatedAt INTEGER DEFAULT (unixepoch()) NOT NULL,
        deletedAt INTEGER,
        FOREIGN KEY (idUsuario) REFERENCES usuarios(id),
        FOREIGN KEY (idVeiculo) REFERENCES veiculos(id)
      )
    `);

    // Criar tabela despesas
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS despesas (
        id TEXT PRIMARY KEY,
        idUsuario TEXT NOT NULL,
        idVeiculo TEXT,
        dataDespesa INTEGER NOT NULL,
        descricao TEXT NOT NULL,
        valorDespesa INTEGER NOT NULL,
        tipoDespesa TEXT NOT NULL,
        createdAt INTEGER DEFAULT (unixepoch()) NOT NULL,
        updatedAt INTEGER DEFAULT (unixepoch()) NOT NULL,
        deletedAt INTEGER,
        FOREIGN KEY (idUsuario) REFERENCES usuarios(id),
        FOREIGN KEY (idVeiculo) REFERENCES veiculos(id)
      )
    `);

    // Criar tabela plataformas
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS plataformas (
        id TEXT PRIMARY KEY,
        idUsuario TEXT NOT NULL,
        nome TEXT NOT NULL,
        isPadrao INTEGER DEFAULT 0 NOT NULL,
        ativa INTEGER DEFAULT 1 NOT NULL,
        createdAt INTEGER DEFAULT (unixepoch()) NOT NULL,
        updatedAt INTEGER DEFAULT (unixepoch()) NOT NULL,
        deletedAt INTEGER,
        FOREIGN KEY (idUsuario) REFERENCES usuarios(id)
      )
    `);

    // Criar tabela jornadasFaturamentoPorPlataforma
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS jornadasFaturamentoPorPlataforma (
        id TEXT PRIMARY KEY,
        idJornada TEXT NOT NULL,
        idPlataforma TEXT NOT NULL,
        valor INTEGER NOT NULL,
        createdAt INTEGER DEFAULT (unixepoch()) NOT NULL,
        updatedAt INTEGER DEFAULT (unixepoch()) NOT NULL,
        FOREIGN KEY (idJornada) REFERENCES jornadas(id),
        FOREIGN KEY (idPlataforma) REFERENCES plataformas(id)
      )
    `);

    console.log('✅ Tabelas inicializadas com sucesso no banco em memória');
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar tabelas:', error);
    return false;
  }
}

