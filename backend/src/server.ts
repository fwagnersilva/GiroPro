import { config } from './config';
import app from './app';
import logger from './utils/logger';
import { initializeTables } from './db/initTables';

const PORT = Number(config.port);

// Configurar para escutar em todas as interfaces
app.listen(PORT, '0.0.0.0', async () => {
  logger.info(`🚀 Servidor GiroPro rodando na porta ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`🌐 Acessível externamente em: http://0.0.0.0:${PORT}`);
  
  // Inicializar tabelas no banco em memória
  await initializeTables();
});
