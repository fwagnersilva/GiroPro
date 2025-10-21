import http from 'http';
import { app } from './app';
import { config } from './config/env';
import { initializeDatabase } from './config/database';

const PORT = process.env.PORT || config.port || 3000;

console.log('🔍 Verificando configuração de porta:');
console.log('  - process.env.PORT:', process.env.PORT);
console.log('  - config.port:', config.port);
console.log('  - PORT final:', PORT);
console.log('  - NODE_ENV:', process.env.NODE_ENV);

let server: http.Server;

async function startServer() {
  try {
    // Inicializar banco de dados
    console.log('🔄 Inicializando conexão com o banco de dados...');
    await initializeDatabase();
    
    // Criar servidor HTTP
    server = http.createServer(app);
    
    // Iniciar servidor
    await new Promise<void>((resolve, reject) => {
      server.listen(PORT, () => {
        console.log('\n' + '='.repeat(60));
        console.log(`🚀 Servidor GiroPro iniciado com sucesso!`);
        console.log(`📍 Porta: ${PORT}`);
        console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 URL local: http://localhost:${PORT}`);
        console.log(`🔗 URL externa: http://0.0.0.0:${PORT}`);
        console.log(`🏥 Health check: http://localhost:${PORT}/health`);
        console.log('='.repeat(60) + '\n');
        
        resolve();
      });
      
      server.on('error', reject);
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown(signal: string) {
  console.log(`\n🛑 ${signal} recebido, encerrando servidor...`);
  
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => {
        console.log('✅ Servidor HTTP encerrado');
        resolve();
      });
    });
  }
  
  // Encerrar conexão com banco de dados
  try {
    const { closeDatabase } = await import('./config/database');
    await closeDatabase();
    console.log('✅ Conexão com banco encerrada');
  } catch (error) {
    console.error('❌ Erro ao encerrar conexão com banco:', error);
  }
  
  process.exit(0);
}

// Tratar sinais de encerramento
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Tratar erros não capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  shutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('UNHANDLED_REJECTION');
});

// Iniciar servidor
startServer();