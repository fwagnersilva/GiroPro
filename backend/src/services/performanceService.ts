const logger = new Logger();
import { Logger } from "../utils/logger";
import { cacheService } from './cacheService';

interface PerformanceMetrics {
  timestamp: number;
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage?: NodeJS.CpuUsage;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cache: {
    connected: boolean;
    status: string;
  };
  database: {
    connected: boolean;
    status: string;
  };
  metrics: {
    avgResponseTime: number;
    requestsPerMinute: number;
    errorRate: number;
  };
}

class PerformanceService {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000; // Manter apenas as últimas 1000 métricas
  private startTime = Date.now();

  // Adicionar métrica de performance
  addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Manter apenas as métricas mais recentes
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log de requests lentos
    if (metric.duration > 2000) {
    logger.warn('Slow request detected', {       endpoint: metric.endpoint,
        method: metric.method,
        duration: metric.duration,
        statusCode: metric.statusCode
      });
    }

    // Salvar métricas agregadas no cache a cada 100 requests
    if (this.metrics.length % 100 === 0) {
      this.saveAggregatedMetrics();
    }
  }

  // Obter métricas dos últimos N minutos
  getMetrics(minutes: number = 60): PerformanceMetrics[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.metrics.filter(metric => metric.timestamp > cutoff);
  }

  // Obter estatísticas agregadas
  getAggregatedStats(minutes: number = 60) {
    const recentMetrics = this.getMetrics(minutes);
    
    if (recentMetrics.length === 0) {
      return {
        totalRequests: 0,
        avgResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        errorRate: 0,
        requestsPerMinute: 0,
        statusCodes: {},
        endpoints: {}
      };
    }

    const durations = recentMetrics.map(m => m.duration);
    const errors = recentMetrics.filter(m => m.statusCode >= 400);
    
    // Agrupar por status code
    const statusCodes: Record<number, number> = {};
    recentMetrics.forEach(metric => {
      statusCodes[metric.statusCode] = (statusCodes[metric.statusCode] || 0) + 1;
    });

    // Agrupar por endpoint
    const endpoints: Record<string, { count: number; avgDuration: number }> = {};
    recentMetrics.forEach(metric => {
      const key = `${metric.method} ${metric.endpoint}`;
      if (!endpoints[key]) {
        endpoints[key] = { count: 0, avgDuration: 0 };
      }
      endpoints[key].count++;
      endpoints[key].avgDuration = (endpoints[key].avgDuration + metric.duration) / 2;
    });

    return {
      totalRequests: recentMetrics.length,
      avgResponseTime: durations.reduce((a, b) => a + b, 0) / durations.length,
      minResponseTime: Math.min(...durations),
      maxResponseTime: Math.max(...durations),
      errorRate: (errors.length / recentMetrics.length) * 100,
      requestsPerMinute: recentMetrics.length / minutes,
      statusCodes,
      endpoints
    };
  }

  // Verificar saúde do sistema
  async getSystemHealth(): Promise<SystemHealth> {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    const stats = this.getAggregatedStats(5); // Últimos 5 minutos

    // Verificar status do cache
    const cacheHealthy = cacheService.isHealthy();
    
    // Calcular porcentagem de uso de memória (aproximado)
    const memoryPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

    // Determinar status geral
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (memoryPercentage > 90 || stats.avgResponseTime > 3000 || stats.errorRate > 10) {
      status = 'critical';
    } else if (memoryPercentage > 70 || stats.avgResponseTime > 1000 || stats.errorRate > 5) {
      status = 'warning';
    }

    return {
      status,
      uptime,
      memory: {
        used: memoryUsage.heapUsed,
        total: memoryUsage.heapTotal,
        percentage: memoryPercentage
      },
      cache: {
        connected: cacheHealthy,
        status: cacheHealthy ? 'connected' : 'disconnected'
      },
      database: {
        connected: true, // TODO: Implementar verificação real do banco
        status: 'connected'
      },
      metrics: {
        avgResponseTime: stats.avgResponseTime,
        requestsPerMinute: stats.requestsPerMinute,
        errorRate: stats.errorRate
      }
    };
  }

  // Salvar métricas agregadas no cache
  private async saveAggregatedMetrics() {
    try {
      const stats = this.getAggregatedStats(60);
      await cacheService.set('performance:stats:hourly', stats, 3600);
      
      const dailyStats = this.getAggregatedStats(1440); // 24 horas
      await cacheService.set('performance:stats:daily', dailyStats, 86400);
    } catch (error) {
      logger.error('Failed to save aggregated metrics:', error);
    }
  }

  // Obter métricas salvas do cache
  async getCachedStats(period: 'hourly' | 'daily') {
    try {
      return await cacheService.get(`performance:stats:${period}`);
    } catch (error) {
      logger.error("Failed to get cached stats:", error);     return null;
    }
  }

  // Limpar métricas antigas
  clearOldMetrics() {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 horas
    this.metrics = this.metrics.filter(metric => metric.timestamp > cutoff);
    logger.info(`Cleared old metrics, ${this.metrics.length} metrics remaining`);
  }

  // Obter top endpoints mais lentos
  getSlowestEndpoints(limit: number = 10) {
    const recentMetrics = this.getMetrics(60);
    const endpointStats: Record<string, { count: number; totalDuration: number; avgDuration: number }> = {};

    recentMetrics.forEach(metric => {
      const key = `${metric.method} ${metric.endpoint}`;
      if (!endpointStats[key]) {
        endpointStats[key] = { count: 0, totalDuration: 0, avgDuration: 0 };
      }
      endpointStats[key].count++;
      endpointStats[key].totalDuration += metric.duration;
      endpointStats[key].avgDuration = endpointStats[key].totalDuration / endpointStats[key].count;
    });

    return Object.entries(endpointStats)
      .sort(([, a], [, b]) => b.avgDuration - a.avgDuration)
      .slice(0, limit)
      .map(([endpoint, stats]) => ({ endpoint, ...stats }));
  }

  // Obter alertas de performance
  getPerformanceAlerts() {
    const alerts = [];
    const stats = this.getAggregatedStats(5);
    const memoryUsage = process.memoryUsage();
    const memoryPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

    if (stats.avgResponseTime > 2000) {
      alerts.push({
        type: 'warning',
        message: `Tempo de resposta médio alto: ${stats.avgResponseTime.toFixed(0)}ms`,
        metric: 'response_time',
        value: stats.avgResponseTime
      });
    }

    if (stats.errorRate > 5) {
      alerts.push({
        type: 'error',
        message: `Taxa de erro alta: ${stats.errorRate.toFixed(1)}%`,
        metric: 'error_rate',
        value: stats.errorRate
      });
    }

    if (memoryPercentage > 80) {
      alerts.push({
        type: 'warning',
        message: `Uso de memória alto: ${memoryPercentage.toFixed(1)}%`,
        metric: 'memory_usage',
        value: memoryPercentage
      });
    }

    if (!cacheService.isHealthy()) {
      alerts.push({
        type: 'error',
        message: 'Cache Redis desconectado',
        metric: 'cache_status',
        value: 'disconnected'
      });
    }

    return alerts;
  }
}

export const performanceService = new PerformanceService();

// Limpar métricas antigas a cada hora
setInterval(() => {
  performanceService.clearOldMetrics();
}, 60 * 60 * 1000);



