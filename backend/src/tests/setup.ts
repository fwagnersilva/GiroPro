// Carregar variáveis de ambiente de teste PRIMEIRO
import { config } from 'dotenv';
config({ path: '.env.test' });

// Configurar variáveis de ambiente para testes ANTES de qualquer importação de DB
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.SQLITE_DB_PATH = ':memory:';
process.env.REDIS_URL = process.env.TEST_REDIS_URL || 'redis://localhost:6379/1';

// Desabilitar cache e backup durante testes
process.env.CACHE_ENABLED = 'false';
process.env.BACKUP_ENABLED = 'false';

// Configurar rate limiting mais permissivo para testes
process.env.RATE_LIMIT_WINDOW_MS = '1000';
process.env.RATE_LIMIT_MAX_REQUESTS = '1000';

// AGORA importar as dependências do banco
import { db, closeConnection } from "../db";

// Configurar timeout global para testes
jest.setTimeout(30000);

// Mock do console para reduzir ruído nos testes
const originalConsole = console;

beforeAll(async () => {
  // NÃO silenciar logs durante setup para debug
  console.log("=== INICIANDO SETUP DE TESTES ===");
  
  try {
    console.log("Initializing tables for tests...");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("SQLITE_DB_PATH:", process.env.SQLITE_DB_PATH);
    
    // Usar initTables do PostgreSQL
    const { initTables } = await import("../db");
    await initTables();
    console.log("Tables initialized successfully.");
    
    // Manter logs visíveis para debug
    // console.log = jest.fn();
    // console.info = jest.fn();
    // console.warn = jest.fn();
    console.error = originalConsole.error; // Manter erros visíveis
  } catch (error) {
    console.error("Error in test setup:", error);
    throw error;
  }
});

afterAll(async () => {
  // Restaurar console original
  console.log = originalConsole.log;
  console.info = originalConsole.info;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  closeConnection();
});





// Configurar timeout para operações assíncronas


// Limpar timers após cada teste
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

// Handler para promises rejeitadas não capturadas
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handler para exceções não capturadas
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

