export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || 'giropro.db',
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey',
  environment: process.env.NODE_ENV || 'development',
  
  // Configurações específicas do SQLite para otimização
  sqlite: {
    // Configurações de performance
    pragmas: {
      journal_mode: 'WAL',        // Write-Ahead Logging para melhor concorrência
      synchronous: 'NORMAL',      // Balanceamento entre performance e segurança
      cache_size: 2000,           // Cache de 2MB (2000 páginas de 1KB)
      temp_store: 'MEMORY',       // Armazenar tabelas temporárias em memória
      mmap_size: 268435456,       // Memory-mapped I/O de 256MB
      optimize: true,             // Otimização automática
      foreign_keys: 'ON',         // Habilitar foreign keys
      busy_timeout: 30000,        // Timeout de 30 segundos para operações bloqueadas
    },
    
    // Configurações de conexão
    connection: {
      readonly: false,
      fileMustExist: false,
      timeout: 5000,
      verbose: process.env.NODE_ENV === 'development' ? console.log : null,
    }
  }
};

