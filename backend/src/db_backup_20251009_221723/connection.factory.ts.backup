import dotenv from 'dotenv';

dotenv.config();

// Factory para criar conexões de banco de dados baseado na configuração
export const createDatabaseConnection = async () => {
  const dbType = process.env.DB_TYPE || 'postgresql';
  
  switch (dbType.toLowerCase()) {
    case 'sqlite':
      const { db: sqliteDb } = await import('./connection.sqlite');
      return sqliteDb;
    
    case 'postgresql':
    default:
      const { db: postgresDb } = await import('./connection');
      return postgresDb;
  }
};

// Função para obter a configuração do Drizzle baseada no tipo de banco
export const getDrizzleConfig = () => {
  const dbType = process.env.DB_TYPE || 'postgresql';
  
  switch (dbType.toLowerCase()) {
    case 'sqlite':
      return './drizzle.config.sqlite.ts';
    
    case 'postgresql':
    default:
      return './drizzle.config.ts';
  }
};

