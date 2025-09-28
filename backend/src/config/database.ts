import Database from 'better-sqlite3';
import type { Database as BetterSqlite3Database } from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from '../db/schema';
import path from 'path';

/**
 * Configurações otimizadas para o banco de dados SQLite
 */
export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private db: BetterSqlite3Database;
  private drizzleDb: ReturnType<typeof drizzle>;

  private constructor() {
    const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../../giropro.db');
    
    // Configurações otimizadas do SQLite
    this.db = new Database(dbPath, {
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
    });

    // Aplicar configurações de performance
    this.optimizeDatabase();

    // Inicializar Drizzle
    this.drizzleDb = drizzle(this.db, { schema });
  }

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  private optimizeDatabase(): void {
    // Configurações de performance do SQLite
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('cache_size = -2000'); // 2MB de cache
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('temp_store = MEMORY');
    this.db.pragma('mmap_size = 67108864'); // 64MB
    this.db.pragma('page_size = 4096');
    this.db.pragma('foreign_keys = ON');

    // Atualizar estatísticas
    this.db.exec('ANALYZE');
  }

  public getDatabase(): BetterSqlite3Database {
    return this.db;
  }

  public getDrizzle(): ReturnType<typeof drizzle> {
    return this.drizzleDb;
  }

  public async runMigrations(): Promise<void> {
    try {
      await migrate(this.drizzleDb, { 
        migrationsFolder: path.join(__dirname, '../../drizzle') 
      });
      console.log('✅ Migrações executadas com sucesso');
    } catch (error) {
      console.error('❌ Erro ao executar migrações:', error);
      throw error;
    }
  }

  public close(): void {
    this.db.close();
  }

  /**
   * Executa VACUUM para otimizar o banco de dados
   */
  public vacuum(): void {
    console.log('🔧 Executando VACUUM no banco de dados...');
    this.db.exec('VACUUM');
    console.log('✅ VACUUM executado com sucesso');
  }

  /**
   * Verifica a integridade do banco de dados
   */
  public checkIntegrity(): boolean {
    const result = this.db.prepare("PRAGMA integrity_check").get() as { [key: string]: string };
    return result["integrity_check"] === 'ok';
  }

  /**
   * Retorna estatísticas do banco de dados
   */
  public getStats(): Record<string, any> {
    const pageCount = this.db.prepare('PRAGMA page_count').get() as { page_count: number };
    const pageSize = this.db.prepare('PRAGMA page_size').get() as { page_size: number };
    const cacheSize = this.db.prepare('PRAGMA cache_size').get() as { cache_size: number };
    const journalMode = this.db.prepare('PRAGMA journal_mode').get() as { journal_mode: string };

    return {
      pageCount: pageCount.page_count,
      pageSize: pageSize.page_size,
      cacheSize: cacheSize.cache_size,
      journalMode: journalMode.journal_mode,
      databaseSize: pageCount.page_count * pageSize.page_size,
    };
  }
}

// Exportar instância singleton
export const dbConfig = DatabaseConfig.getInstance();
export const db = dbConfig.getDrizzle();

