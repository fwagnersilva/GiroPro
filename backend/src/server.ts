import { config } from './config';
import app from './app';
import logger from './utils/logger';
import { initTables, initializeDatabase, getClient } from './db';

const PORT = Number(config.port);

// Função assíncrona para inicializar servidor
async function startServer() {
  try {
    // Primeiro inicializa o banco de dados
    console.log('🔄 Inicializando conexão com o banco de dados...');
    await initializeDatabase();

    // Em seguida, inicializa as tabelas
    // console.log('🔄 Inicializando tabelas do banco de dados...');
    // await initTables();
    
    // Depois inicia o servidor
    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Servidor GiroPro rodando na porta ${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🌐 Acessível externamente em: http://0.0.0.0:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`🛑 ${signal} recebido, encerrando servidor...`);
      
      server.close(async () => {
        logger.info('✅ Servidor HTTP encerrado');
        
        try {
          const client = getClient();
          if (client && typeof client.end === 'function') {
            await client.end();
            logger.info('✅ Conexão com banco encerrada');
          } else {
            logger.info('✅ Nenhuma conexão de banco de dados para encerrar (SQLite ou cliente não disponível).');
          }
          process.exit(0);
        } catch (error) {
          logger.error('❌ Erro ao encerrar conexão:', error);
          process.exit(1);
        }
      });

      // Força encerramento após 10 segundos
      setTimeout(() => {
        logger.error('⏰ Tempo limite excedido, forçando encerramento...');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();

