import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.postgres';

// Verificar se DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL não está definida nas variáveis de ambiente');
}

console.log('🔌 Configurando conexão PostgreSQL...');

// Criar pool de conexão com SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Criar instância do drizzle
const db = drizzle(pool, { schema });

// Log de eventos do pool
pool.on('connect', () => {
  console.log('✅ Nova conexão ao PostgreSQL estabelecida');
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no cliente PostgreSQL:', err);
});

const maskedUrl = process.env.DATABASE_URL?.replace(/\/\/.*:.*@/, '//***:***@');
console.log(`🔗 Pool PostgreSQL configurado: ${maskedUrl}`);

// Função para fechar conexão
async function closeConnection() {
  try {
    await pool.end();
    console.log('✅ Pool PostgreSQL encerrado');
  } catch (error) {
    console.error('❌ Erro ao fechar pool PostgreSQL:', error);
    throw error;
  }
}

// Exportar usando CommonJS
module.exports = {
  db,
  pool,
  closeConnection
};

// Exportar para ES6
export { db, pool, closeConnection };
