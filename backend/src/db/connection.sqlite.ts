import { drizzle } from 'drizzle-orm/better-sqlite3';
const Database = require('better-sqlite3');
import * as schema from './schema';
import { config } from '../config';

// Configuração otimizada para SQLite
const dbPath = config.databaseUrl;
console.log("DB Path:", dbPath);

// Criar conexão com configurações otimizadas
const sqlite = new Database(dbPath, config.sqlite.connection);

// Aplicar pragmas de otimização
Object.entries(config.sqlite.pragmas).forEach(([pragma, value]) => {
  if (typeof value === 'boolean') {
    sqlite.pragma(`${pragma} = ${value ? 'ON' : 'OFF'}`);
  } else {
    sqlite.pragma(`${pragma} = ${value}`);
  }
});

// Log das configurações aplicadas (apenas em desenvolvimento)
if (config.environment === 'development') {
  console.log('SQLite Pragmas aplicados:');
  Object.keys(config.sqlite.pragmas).forEach(pragma => {
    const result = sqlite.pragma(pragma);
    console.log(`  ${pragma}: ${JSON.stringify(result)}`);
  });
}

export const db = drizzle(sqlite as any, { schema });

// Função para fechar a conexão (útil para testes)
export const closeConnection = () => {
  sqlite.close();
};

// Função para verificar a saúde da conexão
export const checkConnection = () => {
  try {
    const result = sqlite.prepare('SELECT 1 as test').get();
    return result?.test === 1;
  } catch (error) {
    console.error('Erro na verificação da conexão:', error);
    return false;
  }
};

// Função para obter estatísticas do banco
export const getDatabaseStats = () => {
  try {
    const stats = {
      page_count: sqlite.pragma('page_count'),
      page_size: sqlite.pragma('page_size'),
      cache_size: sqlite.pragma('cache_size'),
      journal_mode: sqlite.pragma('journal_mode'),
      synchronous: sqlite.pragma('synchronous'),
      foreign_keys: sqlite.pragma('foreign_keys'),
      temp_store: sqlite.pragma('temp_store'),
      mmap_size: sqlite.pragma('mmap_size'),
    };
    return stats;
  } catch (error) {
    console.error('Erro ao obter estatísticas do banco:', error);
    return null;
  }
};

