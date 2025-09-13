import dotenv from 'dotenv';

dotenv.config();

// Factory para criar conexões de banco de dados baseado na configuração
export const createDatabaseConnection = async () => {
  const dbType = process.env.DB_TYPE || 'sqlite_memory';
  
  console.log(`🔧 Tipo de banco configurado: ${dbType}`);
  
  switch (dbType.toLowerCase()) {
    case 'sqlite':
    case 'sqlite_file':
      console.log('📁 Usando SQLite com arquivo');
      const { db: sqliteDb } = await import('./connection.sqlite');
      return sqliteDb;
    
    case 'sqlite_memory':
    case 'memory':
      console.log('⚡ Usando SQLite em memória');
      const { db: memoryDb } = await import('./connection.sqlite');
      return memoryDb;
    
    case 'postgresql':
    case 'postgres':
      console.log('🐘 Usando PostgreSQL');
      const { db: postgresDb } = await import('./connection.postgres');
      return postgresDb;
    
    default:
      console.log('⚡ Fallback para SQLite em memória');
      const { db: defaultDb } = await import('./connection.sqlite');
      return defaultDb;
  }
};

// Função para obter a configuração do Drizzle baseada no tipo de banco
export const getDrizzleConfig = () => {
  const dbType = process.env.DB_TYPE || 'sqlite_memory';
  
  switch (dbType.toLowerCase()) {
    case 'sqlite':
    case 'sqlite_file':
    case 'sqlite_memory':
    case 'memory':
      return './drizzle.config.sqlite.ts';
    
    case 'postgresql':
    case 'postgres':
      return './drizzle.config.ts';
    
    default:
      return './drizzle.config.sqlite.ts';
  }
};

// Função para verificar se o banco está configurado corretamente
export const checkDatabaseConnection = async () => {
  try {
    const db = await createDatabaseConnection();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com banco de dados:', error);
    return false;
  }
};

