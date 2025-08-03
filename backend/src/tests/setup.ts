import { config } from 'dotenv';

// Carregar variáveis de ambiente de teste
config({ path: '.env.test' });

// Configurar timeout global para testes
jest.setTimeout(30000);

// Mock do console para reduzir ruído nos testes
const originalConsole = console;

beforeAll(() => {
  // Silenciar logs durante os testes, exceto erros
  console.log = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
  console.error = originalConsole.error; // Manter erros visíveis
});

afterAll(() => {
  // Restaurar console original
  console.log = originalConsole.log;
  console.info = originalConsole.info;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/giropro_test';
process.env.REDIS_URL = process.env.TEST_REDIS_URL || 'redis://localhost:6379/1';

// Desabilitar cache e backup durante testes
process.env.CACHE_ENABLED = 'false';
process.env.BACKUP_ENABLED = 'false';

// Configurar rate limiting mais permissivo para testes
process.env.RATE_LIMIT_WINDOW_MS = '1000';
process.env.RATE_LIMIT_MAX_REQUESTS = '1000';



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

