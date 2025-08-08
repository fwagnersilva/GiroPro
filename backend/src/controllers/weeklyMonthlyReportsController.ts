import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../types/auth';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { ReportsService } from '../services/reportsService';
import { CacheService } from '../services/cacheService';
import { Logger } from '../utils/logger';

// Schemas de validação aprimorados
const baseReportSchema = z.object({
  data_inicio: z.string().datetime().optional(),
  data_fim: z.string().datetime().optional(),
  id_veiculo: z.string().uuid().optional(),
  formato: z.enum(['json', 'csv', 'xlsx', 'pdf']).default('json'),
  incluir_detalhes: z.boolean().default(true),
  incluir_graficos: z.boolean().default(false)
});

const comparisonSchema = z.object({
  id_veiculo: z.string().uuid().optional(),
  numero_periodos: z.coerce.number().int().min(1).max(24).default(4),
  incluir_tendencias: z.boolean().default(true),
  incluir_previsoes: z.boolean().default(false)
});

const weeklyReportSchema = baseReportSchema.extend({
  tipo_periodo: z.literal('semanal').default('semanal')
});

const monthlyReportSchema = baseReportSchema.extend({
  tipo_periodo: z.literal('mensal').default('mensal')
});

export class WeeklyMonthlyReportsController {
  private static readonly CACHE_TTL = 300; // 5 minutos
  private static readonly logger = Logger.getInstance('ReportsController');

  /**
   * Relatório Semanal com cache e otimizações
   */
  static getWeeklyReport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = WeeklyMonthlyReportsController.extractUserId(req);
    const params = WeeklyMonthlyReportsController.validateQuery(req.query, weeklyReportSchema);
    
    // Gerar chave de cache única
    const cacheKey = `weekly_report:${userId}:${JSON.stringify(params)}`;
    
    // Tentar buscar do cache primeiro
    let relatorio = await CacheService.get(cacheKey);
    
    if (!relatorio) {
      WeeklyMonthlyReportsController.logger.info('Gerando relatório semanal', { userId, params });
      
      relatorio = await ReportsService.generateWeeklyReport({
        userId,
        startDate: params.data_inicio,
        endDate: params.data_fim,
        vehicleId: params.id_veiculo,
        includeDetails: params.incluir_detalhes,
        includeCharts: params.incluir_graficos
      });

      // Cache por 5 minutos
      await CacheService.set(cacheKey, relatorio, WeeklyMonthlyReportsController.CACHE_TTL);
    }

    if (params.formato !== 'json') {
      return WeeklyMonthlyReportsController.handleFileExport(
        res, 
        relatorio, 
        params.formato, 
        'relatorio_semanal'
      );
    }

    res.json({
      success: true,
      data: relatorio,
      cached: !!await CacheService.get(cacheKey),
      generated_at: new Date().toISOString(),
      message: 'Relatório semanal gerado com sucesso'
    });
  });

  /**
   * Relatório Mensal com cache e otimizações
   */
  static getMonthlyReport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = WeeklyMonthlyReportsController.extractUserId(req);
    const params = WeeklyMonthlyReportsController.validateQuery(req.query, monthlyReportSchema);
    
    const cacheKey = `monthly_report:${userId}:${JSON.stringify(params)}`;
    let relatorio = await CacheService.get(cacheKey);
    
    if (!relatorio) {
      WeeklyMonthlyReportsController.logger.info('Gerando relatório mensal', { userId, params });
      
      relatorio = await ReportsService.generateMonthlyReport({
        userId,
        startDate: params.data_inicio,
        endDate: params.data_fim,
        vehicleId: params.id_veiculo,
        includeDetails: params.incluir_detalhes,
        includeCharts: params.incluir_graficos
      });

      await CacheService.set(cacheKey, relatorio, WeeklyMonthlyReportsController.CACHE_TTL);
    }

    if (params.formato !== 'json') {
      return WeeklyMonthlyReportsController.handleFileExport(
        res, 
        relatorio, 
        params.formato, 
        'relatorio_mensal'
      );
    }

    res.json({
      success: true,
      data: relatorio,
      cached: !!await CacheService.get(cacheKey),
      generated_at: new Date().toISOString(),
      message: 'Relatório mensal gerado com sucesso'
    });
  });

  /**
   * Comparativo Semanal com análise avançada
   */
  static getWeeklyComparison = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = WeeklyMonthlyReportsController.extractUserId(req);
    const params = WeeklyMonthlyReportsController.validateQuery(req.query, comparisonSchema);
    
    const cacheKey = `weekly_comparison:${userId}:${JSON.stringify(params)}`;
    let comparativo = await CacheService.get(cacheKey);

    if (!comparativo) {
      WeeklyMonthlyReportsController.logger.info('Gerando comparativo semanal', { userId, params });

      comparativo = await ReportsService.generateWeeklyComparison({
        userId,
        numberOfWeeks: params.numero_periodos,
        vehicleId: params.id_veiculo,
        includeTrends: params.incluir_tendencias,
        includePredictions: params.incluir_previsoes
      });

      await CacheService.set(cacheKey, comparativo, WeeklyMonthlyReportsController.CACHE_TTL);
    }

    res.json({
      success: true,
      data: {
        comparativo_semanas: comparativo.periods,
        estatisticas: comparativo.statistics,
        tendencias: comparativo.trends,
        insights: comparativo.insights,
        filtros: {
          id_veiculo: params.id_veiculo || null,
          numero_semanas: params.numero_periodos
        }
      },
      message: 'Comparativo semanal gerado com sucesso'
    });
  });

  /**
   * Comparativo Mensal com análise avançada
   */
  static getMonthlyComparison = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = WeeklyMonthlyReportsController.extractUserId(req);
    const params = WeeklyMonthlyReportsController.validateQuery(req.query, comparisonSchema);
    
    const cacheKey = `monthly_comparison:${userId}:${JSON.stringify(params)}`;
    let comparativo = await CacheService.get(cacheKey);

    if (!comparativo) {
      WeeklyMonthlyReportsController.logger.info('Gerando comparativo mensal', { userId, params });

      comparativo = await ReportsService.generateMonthlyComparison({
        userId,
        numberOfMonths: params.numero_periodos,
        vehicleId: params.id_veiculo,
        includeTrends: params.incluir_tendencias,
        includePredictions: params.incluir_previsoes
      });

      await CacheService.set(cacheKey, comparativo, WeeklyMonthlyReportsController.CACHE_TTL);
    }

    res.json({
      success: true,
      data: {
        comparativo_meses: comparativo.periods,
        estatisticas: comparativo.statistics,
        tendencias: comparativo.trends,
        sazonalidade: comparativo.seasonality,
        previsoes: comparativo.predictions,
        insights: comparativo.insights,
        filtros: {
          id_veiculo: params.id_veiculo || null,
          numero_meses: params.numero_periodos
        }
      },
      message: 'Comparativo mensal gerado com sucesso'
    });
  });

  /**
   * Dashboard consolidado com KPIs e alertas
   */
  static getDashboard = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = WeeklyMonthlyReportsController.extractUserId(req);
    const params = WeeklyMonthlyReportsController.validateQuery(req.query, z.object({
      id_veiculo: z.string().uuid().optional(),
      incluir_alertas: z.boolean().default(true),
      incluir_metas: z.boolean().default(true)
    }));

    const cacheKey = `dashboard:${userId}:${JSON.stringify(params)}`;
    let dashboard = await CacheService.get(cacheKey);

    if (!dashboard) {
      WeeklyMonthlyReportsController.logger.info('Gerando dashboard', { userId, params });

      // Executa consultas em paralelo para melhor performance
      const [currentWeek, currentMonth, comparison, alerts, goals] = await Promise.all([
        ReportsService.getCurrentWeekSummary(userId, params.id_veiculo),
        ReportsService.getCurrentMonthSummary(userId, params.id_veiculo),
        ReportsService.getShortTermComparison(userId, params.id_veiculo),
        params.incluir_alertas ? ReportsService.generateAlerts(userId, params.id_veiculo) : null,
        params.incluir_metas ? ReportsService.getGoalsProgress(userId, params.id_veiculo) : null
      ]);

      dashboard = {
        kpis_principais: {
          semana_atual: currentWeek,
          mes_atual: currentMonth,
          comparacoes: comparison
        },
        alertas: alerts,
        metas: goals,
        resumo_visual: {
          grafico_evolucao: currentMonth.evolucao_diaria,
          distribuicao_despesas: currentMonth.detalhamento_despesas,
          top_jornadas: await ReportsService.getTopJourneys(userId, params.id_veiculo, 5)
        }
      };

      // Cache por 2 minutos (dashboard precisa de dados mais frescos)
      await CacheService.set(cacheKey, dashboard, 120);
    }

    res.json({
      success: true,
      data: dashboard,
      last_updated: new Date().toISOString(),
      message: 'Dashboard gerado com sucesso'
    });
  });

  /**
   * Análise de performance e eficiência
   */
  static getPerformanceAnalysis = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = WeeklyMonthlyReportsController.extractUserId(req);
    const params = WeeklyMonthlyReportsController.validateQuery(req.query, z.object({
      id_veiculo: z.string().uuid().optional(),
      periodo_analise: z.enum(['trimestre', 'semestre', 'ano']).default('trimestre'),
      incluir_benchmarks: z.boolean().default(true)
    }));

    const cacheKey = `performance:${userId}:${JSON.stringify(params)}`;
    let analise = await CacheService.get(cacheKey);

    if (!analise) {
      WeeklyMonthlyReportsController.logger.info('Gerando análise de performance', { userId, params });

      analise = await ReportsService.generatePerformanceAnalysis({
        userId,
        vehicleId: params.id_veiculo,
        analysisPeriod: params.periodo_analise,
        includeBenchmarks: params.incluir_benchmarks
      });

      // Cache por 1 hora (análise de performance muda menos frequentemente)
      await CacheService.set(cacheKey, analise, 3600);
    }

    res.json({
      success: true,
      data: analise,
      message: 'Análise de performance gerada com sucesso'
    });
  });

  /**
   * Exportação em lote otimizada
   */
  static exportBatchReports = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = WeeklyMonthlyReportsController.extractUserId(req);
    const params = WeeklyMonthlyReportsController.validateQuery(req.body, z.object({
      tipos_relatorio: z.array(z.enum(['semanal', 'mensal', 'comparativo_semanal', 'comparativo_mensal', 'dashboard'])).min(1),
      data_inicio: z.string().datetime().optional(),
      data_fim: z.string().datetime().optional(),
      id_veiculo: z.string().uuid().optional(),
      formato: z.enum(['xlsx', 'pdf', 'zip']).default('xlsx'),
      incluir_graficos: z.boolean().default(true)
    }));

    WeeklyMonthlyReportsController.logger.info('Iniciando exportação em lote', { userId, params });

    // Processa em background para relatórios grandes
    const jobId = await ReportsService.createBatchExportJob({
      userId,
      reportTypes: params.tipos_relatorio,
      startDate: params.data_inicio,
      endDate: params.data_fim,
      vehicleId: params.id_veiculo,
      format: params.formato,
      includeCharts: params.incluir_graficos
    });

    res.json({
      success: true,
      data: {
        job_id: jobId,
        status: 'processing',
        estimated_completion: new Date(Date.now() + 30000).toISOString() // 30 segundos
      },
      message: 'Exportação iniciada. Use o job_id para verificar o status.'
    });
  });

  /**
   * Verificar status de exportação em lote
   */
  static getBatchExportStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = WeeklyMonthlyReportsController.extractUserId(req);
    const { jobId } = req.params;

    if (!jobId) {
      throw new AppError('Job ID é obrigatório', 400);
    }

    const status = await ReportsService.getBatchExportStatus(jobId, userId);

    if (!status) {
      throw new AppError('Job não encontrado', 404);
    }

    if (status.status === 'completed' && status.downloadUrl) {
      res.json({
        success: true,
        data: {
          status: status.status,
          download_url: status.downloadUrl,
          expires_at: status.expiresAt
        },
        message: 'Exportação concluída'
      });
    } else {
      res.json({
        success: true,
        data: {
          status: status.status,
          progress: status.progress,
          estimated_completion: status.estimatedCompletion
        },
        message: `Status: ${status.status}`
      });
    }
  });

  /**
   * Limpar cache de relatórios
   */
  static clearReportsCache = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = WeeklyMonthlyReportsController.extractUserId(req);
    
    // Apenas admins ou o próprio usuário podem limpar cache
    const patterns = [
      `weekly_report:${userId}:*`,
      `monthly_report:${userId}:*`,
      `weekly_comparison:${userId}:*`,
      `monthly_comparison:${userId}:*`,
      `dashboard:${userId}:*`,
      `performance:${userId}:*`
    ];

    let clearedCount = 0;
    for (const pattern of patterns) {
      const count = await CacheService.clearByPattern(pattern);
      clearedCount += count;
    }

    WeeklyMonthlyReportsController.logger.info('Cache limpo', { userId, clearedCount });

    res.json({
      success: true,
      data: { cleared_entries: clearedCount },
      message: 'Cache de relatórios limpo com sucesso'
    });
  });

  // Métodos auxiliares privados
  private static extractUserId(req: AuthenticatedRequest): string {
    if (!req.user?.id) {
      throw new AppError('Usuário não autenticado', 401);
    }
    return req.user.id;
  }

  private static validateQuery<T extends z.ZodType>(query: any, schema: T): z.infer<T> {
    const result = schema.safeParse(query);
    
    if (!result.success) {
      WeeklyMonthlyReportsController.logger.warn('Validação falhou', { 
        errors: result.error.errors,
        query 
      });
      
      throw new AppError(
        'Parâmetros inválidos',
        400,
        result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          received: err.received
        }))
      );
    }
    
    return result.data;
  }

  private static async handleFileExport(
    res: Response, 
    data: any, 
    format: string, 
    filename: string
  ): Promise<void> {
    try {
      const exportData = await ReportsService.exportToFormat(data, format);
      
      const contentTypes = {
        csv: 'text/csv; charset=utf-8',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        pdf: 'application/pdf'
      };

      const extensions = { csv: 'csv', xlsx: 'xlsx', pdf: 'pdf' };
      
      res.setHeader('Content-Type', contentTypes[format as keyof typeof contentTypes]);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.${extensions[format as keyof typeof extensions]}"`);
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', exportData.length);
      
      if (format === 'csv') {
        // BOM para UTF-8 no Excel
        res.send('\uFEFF' + exportData);
      } else {
        res.send(exportData);
      }
    } catch (error) {
      WeeklyMonthlyReportsController.logger.error('Erro na exportação', { format, filename, error });
      throw new AppError('Erro ao gerar arquivo de exportação', 500);
    }
  }
}
