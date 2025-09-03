import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { backupService } from '../services/backupService';
import { performanceService } from '../services/performanceService';
import { cacheService } from '../services/cacheService';
import { Logger } from "../utils/logger";

const router = Router();

// Middleware de autenticação para todas as rotas admin
router.use(authMiddleware);

// Middleware para verificar se o usuário é admin
const adminOnly = (req: any, res: any, next: any) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      error: 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.',
      code: 'ADMIN_REQUIRED'
    });
  }
  next();
};

router.use(adminOnly);

// GET /api/v1/admin/health - Status detalhado do sistema
router.get('/health', async (req, res) => {
  try {
    const health = await performanceService.getSystemHealth();
    const alerts = performanceService.getPerformanceAlerts();
    const lastBackup = await backupService.getLastBackup();
    
    res.json({
      system: health,
      alerts,
      backup: {
        enabled: backupService.isEnabled(),
        running: backupService.isBackupRunning(),
        last: lastBackup
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    Logger.error('Erro ao obter status do sistema:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/v1/admin/metrics - Métricas detalhadas de performance
router.get('/metrics', async (req, res) => {
  try {
    const period = parseInt(req.query.period as string) || 60;
    const stats = performanceService.getAggregatedStats(period);
    const slowestEndpoints = performanceService.getSlowestEndpoints(10);
    const cachedStats = await performanceService.getCachedStats('hourly');
    
    res.json({
      current: stats,
      slowestEndpoints,
      cached: cachedStats,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      period
    });
  } catch (error) {
    Logger.error('Erro ao obter métricas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/v1/admin/backup - Executar backup manual
router.post('/backup', async (req, res) => {
  try {
    if (backupService.isBackupRunning()) {
      return res.status(409).json({
        error: 'Backup já está em execução',
        code: 'BACKUP_IN_PROGRESS'
      });
    }

    // Executar backup em background
    await backupService.performBackup();

    return res.json({
      message: 'Backup iniciado com sucesso',
      status: 'started'
    });
  } catch (error) {
    Logger.error('Erro ao iniciar backup:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/v1/admin/backup/history - Histórico de backups
router.get('/backup/history', async (req, res) => {
  try {
    const history = await backupService.getBackupHistory();
    const config = backupService.getConfig();
    
    res.json({
      history,
      config: {
        enabled: config.enabled,
        schedule: config.schedule,
        retention: config.retention,
        compression: config.compression,
        encryption: config.encryption
      }
    });
  } catch (error) {
    Logger.error('Erro ao obter histórico de backups:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/v1/admin/backup/status - Status do backup
router.get('/backup/status', async (req, res) => {
  try {
    const lastBackup = await backupService.getLastBackup();
    
    res.json({
      enabled: backupService.isEnabled(),
      running: backupService.isBackupRunning(),
      last: lastBackup,
      config: backupService.getConfig()
    });
  } catch (error) {
    Logger.error('Erro ao obter status do backup:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/v1/admin/cache/clear - Limpar cache
router.post('/cache/clear', async (req, res) => {
  try {
    const pattern = req.body.pattern || '*';
    
    if (pattern === '*') {
      await cacheService.flushAll();
      Logger.info('Cache completamente limpo por admin', { userId: req.user.id });
    } else {
      await cacheService.delPattern(pattern);
      Logger.info('Cache limpo por padrão', { pattern, userId: req.user.id });
    }
    
    res.json({
      message: 'Cache limpo com sucesso',
      pattern
    });
  } catch (error) {
    Logger.error('Erro ao limpar cache:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/v1/admin/cache/stats - Estatísticas do cache
router.get('/cache/stats', async (req, res) => {
  try {
    const isHealthy = cacheService.isHealthy();
    
    res.json({
      connected: isHealthy,
      status: isHealthy ? 'connected' : 'disconnected',
      // Aqui poderiam ser adicionadas mais estatísticas do Redis
      // como uso de memória, número de chaves, etc.
    });
  } catch (error) {
    Logger.error('Erro ao obter estatísticas do cache:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/v1/admin/logs - Logs recentes do sistema
router.get('/logs', async (req, res) => {
  try {
    const level = req.query.level as string || 'info';
    const limit = parseInt(req.query.limit as string) || 100;
    
    // Aqui seria implementada a lógica para buscar logs
    // Por simplicidade, retornamos uma resposta mock
    res.json({
      message: 'Funcionalidade de logs seria implementada aqui',
      level,
      limit
    });
  } catch (error) {
    Logger.error('Erro ao obter logs:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/v1/admin/maintenance - Ativar/desativar modo de manutenção
router.post('/maintenance', async (req, res) => {
  try {
    const { enabled, message } = req.body;
    
    if (enabled) {
      await cacheService.set('maintenance:enabled', true, 86400);
      await cacheService.set('maintenance:message', message || 'Sistema em manutenção', 86400);
      Logger.warn('Modo de manutenção ativado', { userId: req.user.id, message });
    } else {
      await cacheService.del('maintenance:enabled');
      await cacheService.del('maintenance:message');
      Logger.info('Modo de manutenção desativado', { userId: req.user.id });
    }
    
    res.json({
      message: enabled ? 'Modo de manutenção ativado' : 'Modo de manutenção desativado',
      enabled
    });
  } catch (error) {
    Logger.error('Erro ao alterar modo de manutenção:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/v1/admin/users/stats - Estatísticas de usuários
router.get('/users/stats', async (req, res) => {
  try {
    // Aqui seria implementada a lógica para obter estatísticas de usuários
    // Por simplicidade, retornamos uma resposta mock
    res.json({
      message: 'Estatísticas de usuários seriam implementadas aqui'
    });
  } catch (error) {
    Logger.error('Erro ao obter estatísticas de usuários:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;

