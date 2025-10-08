import { db } from './index';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const usePostgres = process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL;

export async function initializeTables() {
  try {
    console.log(`🔄 Inicializando tabelas (${usePostgres ? 'PostgreSQL' : 'SQLite'})...`);

    if (usePostgres) {
      // === PostgreSQL ===
      await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
      
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS usuarios (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          nome TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          "senhaHash" TEXT NOT NULL,
          role TEXT DEFAULT 'user' NOT NULL,
          "statusConta" TEXT DEFAULT 'ativo' NOT NULL,
          "dataNascimento" TIMESTAMP,
          cidade TEXT,
          "dataCadastro" TIMESTAMP DEFAULT NOW() NOT NULL,
          "pontosTotal" INTEGER DEFAULT 0 NOT NULL,
          "nivelUsuario" TEXT DEFAULT 'iniciante' NOT NULL,
          "conquistasDesbloqueadas" INTEGER DEFAULT 0 NOT NULL,
          "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          "deletedAt" TIMESTAMP,
          "tentativasLogin" INTEGER DEFAULT 0 NOT NULL,
          "ultimoLoginFalhado" TIMESTAMP,
          "ultimaAtividade" TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS veiculos (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "idUsuario" TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
          marca TEXT NOT NULL,
          modelo TEXT NOT NULL,
          ano INTEGER NOT NULL,
          placa TEXT NOT NULL UNIQUE,
          "tipoCombustivel" TEXT NOT NULL,
          "tipoUso" TEXT DEFAULT 'proprio' NOT NULL,
          "valorAluguel" INTEGER,
          "valorPrestacao" INTEGER,
          "mediaConsumo" DOUBLE PRECISION,
          "dataCadastro" TIMESTAMP DEFAULT NOW() NOT NULL,
          "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          "deletedAt" TIMESTAMP
        )
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS jornadas (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "idUsuario" TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
          "idVeiculo" TEXT NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
          "dataInicio" TIMESTAMP NOT NULL,
          "dataFim" TIMESTAMP,
          "kmInicio" INTEGER NOT NULL,
          "kmFim" INTEGER,
          "ganhoBruto" INTEGER,
          "lucroLiquidoEstimado" INTEGER DEFAULT 0,
          "margemLucro" DOUBLE PRECISION DEFAULT 0,
          "kmTotal" INTEGER,
          "tempoTotal" INTEGER,
          "duracaoMinutos" INTEGER,
          "custoCombustivelEstimado" INTEGER DEFAULT 0,
          "outrasDespesas" INTEGER DEFAULT 0,
          observacoes TEXT,
          "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          "deletedAt" TIMESTAMP
        )
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS abastecimentos (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "idUsuario" TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
          "idVeiculo" TEXT NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
          "dataAbastecimento" TIMESTAMP NOT NULL,
          "tipoCombustivel" TEXT NOT NULL,
          litros DOUBLE PRECISION NOT NULL,
          "valorLitro" INTEGER NOT NULL,
          "precoPorLitro" DOUBLE PRECISION NOT NULL,
          "valorTotal" INTEGER NOT NULL,
          "kmAtual" INTEGER,
          "nomePosto" TEXT,
          "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          "deletedAt" TIMESTAMP
        )
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS despesas (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "idUsuario" TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
          "idVeiculo" TEXT REFERENCES veiculos(id) ON DELETE CASCADE,
          "dataDespesa" TIMESTAMP NOT NULL,
          "tipoDespesa" TEXT NOT NULL,
          "valorDespesa" INTEGER NOT NULL,
          descricao TEXT,
          "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          "deletedAt" TIMESTAMP
        )
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS plataformas (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "idUsuario" TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
          nome TEXT NOT NULL,
          "isPadrao" BOOLEAN DEFAULT FALSE NOT NULL,
          ativa BOOLEAN DEFAULT TRUE NOT NULL,
          "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          "deletedAt" TIMESTAMP,
          UNIQUE("idUsuario", nome)
        )
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "jornadasFaturamentoPorPlataforma" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "idJornada" TEXT NOT NULL REFERENCES jornadas(id) ON DELETE CASCADE,
          "idPlataforma" TEXT NOT NULL REFERENCES plataformas(id) ON DELETE CASCADE,
          valor INTEGER NOT NULL,
          "valorAntesCorte" INTEGER,
          "valorDepoisCorte" INTEGER,
          "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          UNIQUE("idJornada", "idPlataforma")
        )
      `);

      // Criar índices
      await db.execute(sql`CREATE INDEX IF NOT EXISTS usuarios_email_idx ON usuarios(email)`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS veiculos_usuario_idx ON veiculos("idUsuario")`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS jornadas_usuario_idx ON jornadas("idUsuario")`);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS jornadas_data_idx ON jornadas("dataInicio")`);

    } else {
      // === SQLite (código original) ===
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
    }

    console.log(`✅ Tabelas inicializadas com sucesso (${usePostgres ? 'PostgreSQL' : 'SQLite'})`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar tabelas:', error);
    throw error;
  }
}