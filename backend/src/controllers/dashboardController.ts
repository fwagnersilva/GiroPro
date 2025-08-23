import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { FastifyRequest } from 'fastify';
import { z } from 'zod';
import { db } from '../db';
import { jornadas, abastecimentos, despesas, veiculos } from '../db/schema';
import { eq, and, isNull, isNotNull, sql, gte, lte, sum, count, inArray } from 'drizzle-orm';
import type { ServiceResult, CacheConfig } from '../types/common';

// Schemas de validação otimizados
const dashboardQuerySchema = z.object({
  periodo: z.enum(['hoje', 'semana', 'mes', 'ano', 'personalizado']).default('mes'),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  idVeiculo: z.string().uuid().optional(),
  includeCache: z.boolean().default(true),
});

const evolutionQuerySchema = z.object({
  periodo: z.enum(['semana', 'mes', 'ano']).default('mes'),
  idVeiculo: z.string().uuid().optional(),
  granularidade: z.enum(['diario', 'semanal', 'mensal']).optional(),
});

const comparisonQuerySchema = z.object({
  periodo: z.enum(['hoje', 'semana', 'mes', 'ano', 'personalizado']).default('mes'),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  incluirInativos: z.boolean().default(false),
});

// Interfaces para tipagem
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      [key: string]: any;
    };
  }
}

interface DashboardMetrics {
  faturamentoBruto: number;
  totalDespesas: number;
  lucroLiquido: number;
  margemLucro: number;
  kmTotal: number;
  custoPorKm: number;
  numeroJornadas: number;
  ganhoMedioPorJornada: number;
  tempoTotalTrabalhadoMinutos: number;
  ganhoPorHora: number;
}

interface VehicleComparison {
  veiculo: {
    id: string;
    marca: string;
    modelo: string;
    placa: string;
    ano: number;
  };
  metricas: DashboardMetrics;
  performanceScore: number;
}

interface EvolutionDataPoint {
  data: string;
  faturamentoBruto: number;
  totalDespesas: number;
  lucroLiquido: number;
  numeroJornadas: number;
  kmTotal: number;
}

// Sistema de cache otimizado para dashboards
class DashboardCache {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  // TTL diferentes baseados no tipo de consulta
  private static readonly TTL_CONFIG: Record<string, number> = {
    summaryToday: 5 * 60 * 1000,      // 5 minutos para dados de hoje
    summaryWeek: 15 * 60 * 1000,      // 15 minutos para semana
    summaryMonth: 30 * 60 * 1000,     // 30 minutos para mês
    summaryYear: 60 * 60 * 1000,      // 1 hora para ano
    evolution: 20 * 60 * 1000,         // 20 minutos para evolução
    comparison: 25 * 60 * 1000,        // 25 minutos para comparação
  };

  static get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  static set(key: string, data: any, type: keyof typeof DashboardCache.TTL_CONFIG = 'summaryMonth'): void {
    const ttl = this.TTL_CONFIG[type] || this.TTL_CONFIG.summaryMonth;
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  static invalidateUser(userId: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(userId)) {
        this.cache.delete(key);
      }
    });
  }

  static clear(): void {
    this.cache.clear();
  }
}

// Utilitários para cálculos otimizados
class DashboardUtils {
  /**
   * Calcula período com validação robusta
   */
  static calcularPeriodo(periodo: string, dataInicio?: string, dataFim?: string): { dataInicio: Date; dataFim: Date } {
    const agora = new Date();
    let dataInicioObj: Date;
    let dataFimObj: Date = new Date(agora);

    if (periodo === 'personalizado') {
      if (!dataInicio || !dataFim) {
        throw new Error('Datas de início e fim são obrigatórias para período personalizado');
      }
      
      dataInicioObj = new Date(dataInicio);
      dataFimObj = new Date(dataFim);
      
      if (isNaN(dataInicioObj.getTime()) || isNaN(dataFimObj.getTime())) {
        throw new Error('Datas fornecidas são inválidas');
      }
      
      if (dataInicioObj > dataFimObj) {
        throw new Error('Data de início não pode ser posterior à data de fim');
      }
      
      // Limit para evitar queries muito pesadas (máx 2 anos)
      const diffDays = (dataFimObj.getTime() - dataInicioObj.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 730) {
        throw new Error('Período máximo permitido é de 2 anos');
      }
    } else {
      switch (periodo) {
        case 'hoje':
          dataInicioObj = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
          dataFimObj = new Date(dataInicioObj);
          dataFimObj.setDate(dataFimObj.getDate() + 1);
          break;
        case 'semana':
          dataInicioObj = new Date(agora);
          dataInicioObj.setDate(agora.getDate() - 7);
          break;
        case 'mes':
          dataInicioObj = new Date(agora.getFullYear(), agora.getMonth(), 1);
          break;
        case 'ano':
          dataInicioObj = new Date(agora.getFullYear(), 0, 1);
          break;
        default:
          dataInicioObj = new Date(agora.getFullYear(), agora.getMonth(), 1);
      }
    }

    return { dataInicio: dataInicioObj, dataFim: dataFimObj };
  }

  /**
   * Constrói condições WHERE base otimizadas
   */
  static buildBaseConditions(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string, tableName: 'jornadas' | 'abastecimentos' | 'despesas' = 'jornadas') {
    const table = tableName === 'jornadas' ? jornadas :
                  tableName === 'abastecimentos' ? abastecimentos : despesas;
    
    const dateField = tableName === 'jornadas' ? jornadas.dataFim :
                     tableName === 'abastecimentos' ? abastecimentos.dataAbastecimento :
                     despesas.dataDespesa;

    let conditions = and(
      eq(table.idUsuario, userId),
      gte(dateField, dataInicio),
      lte(dateField, dataFim),
      isNull(table.deletedAt)
    );

    if (tableName === 'jornadas') {
      conditions = and(conditions, isNotNull(jornadas.dataFim));
    }

    if (idVeiculo) {
      conditions = and(conditions, eq(table.idVeiculo, idVeiculo));
    }

    return conditions;
  }

  /**
   * Formata valores monetários
   */
  static formatCurrency(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /**
   * Calcula performance score baseado em métricas
   */
  static calculatePerformanceScore(metrics: DashboardMetrics): number {
    let score = 0;
    
    // Margem de lucro (40% do score)
    if (metrics.margemLucro > 30) score += 40;
    else if (metrics.margemLucro > 20) score += 30;
    else if (metrics.margemLucro > 10) score += 20;
    else if (metrics.margemLucro > 0) score += 10;
    
    // Ganho por hora (30% do score)
    if (metrics.ganhoPorHora > 30) score += 30;
    else if (metrics.ganhoPorHora > 20) score += 25;
    else if (metrics.ganhoPorHora > 15) score += 20;
    else if (metrics.ganhoPorHora > 10) score += 15;
    
    // Custo por KM (20% do score - inverso)
    if (metrics.custoPorKm < 0.5) score += 20;
    else if (metrics.custoPorKm < 1.0) score += 15;
    else if (metrics.custoPorKm < 1.5) score += 10;
    else if (metrics.custoPorKm < 2.0) score += 5;
    
    // Número de jornadas (10% do score)
    if (metrics.numeroJornadas > 50) score += 10;
    else if (metrics.numeroJornadas > 30) score += 8;
    else if (metrics.numeroJornadas > 10) score += 5;
    
    return Math.min(score, 100);
  }
}

// Serviço otimizado para cálculos agregados
class DashboardCalculations {
  /**
   * Calcula todas as métricas em uma única query otimizada
   */
  static async calcularTodasMetricas(
    userId: string, 
    dataInicio: Date, 
    dataFim: Date, 
    idVeiculo?: string
  ): Promise<DashboardMetrics> {
    // Query única para jornadas (3 operações em 1)
    const jornadasConditions = DashboardUtils.buildBaseConditions(userId, dataInicio, dataFim, idVeiculo, 'jornadas');
    
    const [jornadasResult] = await db
      .select({
        faturamentoBruto: sql<number>`COALESCE(SUM(${jornadas.ganhoBruto}), 0)`,
        kmTotal: sql<number>`COALESCE(SUM(${jornadas.kmTotal}), 0)`,
        numeroJornadas: sql<number>`COUNT(*)`,
        tempoTotal: sql<number>`
          COALESCE(
            SUM(
              CASE 
                WHEN ${jornadas.dataFim} IS NOT NULL AND ${jornadas.dataInicio} IS NOT NULL
                THEN ((${jornadas.dataFim} - ${jornadas.dataInicio}) / 1000 / 60)
                ELSE 0 
              END
            ), 
            0
          )
        `
      })
      .from(jornadas)
      .where(jornadasConditions);

    // Query única para despesas (2 operações em 1)
    const abastecimentosConditions = DashboardUtils.buildBaseConditions(userId, dataInicio, dataFim, idVeiculo, 'abastecimentos');
    const despesasConditions = DashboardUtils.buildBaseConditions(userId, dataInicio, dataFim, idVeiculo, 'despesas');

    const [abastecimentosResult, despesasResult] = await Promise.all([
      db.select({ total: sql<number>`COALESCE(SUM(${abastecimentos.valorTotal}), 0)` })
        .from(abastecimentos)
        .where(abastecimentosConditions),
      db.select({
        tipoDespesa: despesas.tipoDespesa,
        total: sql<number>`COALESCE(SUM(${despesas.valorDespesa}), 0)`
      })
        .from(despesas)
        .where(despesasConditions)
        .groupBy(despesas.tipoDespesa)
    ]);

    // Calcular métricas derivadas
    const faturamentoBruto = Number(jornadasResult.faturamentoBruto);
    const totalCombustivel = Number(abastecimentosResult[0]?.total || 0);
    const totalOutrasDespesas = Number(despesasResult[0]?.total || 0);
    const totalDespesas = totalCombustivel + totalOutrasDespesas;
    const lucroLiquido = faturamentoBruto - totalDespesas;
    const kmTotal = Number(jornadasResult.kmTotal);
    const numeroJornadas = Number(jornadasResult.numeroJornadas);
    const tempoTotalTrabalhadoMinutos = Number(jornadasResult.tempoTotal);

    return {
      faturamentoBruto: DashboardUtils.formatCurrency(faturamentoBruto),
      totalDespesas: DashboardUtils.formatCurrency(totalDespesas),
      lucroLiquido: DashboardUtils.formatCurrency(lucroLiquido),
      margemLucro: faturamentoBruto > 0 ? DashboardUtils.formatCurrency((lucroLiquido / faturamentoBruto) * 100) : 0,
      kmTotal: DashboardUtils.formatCurrency(kmTotal),
      custoPorKm: kmTotal > 0 ? DashboardUtils.formatCurrency(totalDespesas / kmTotal) : 0,
      numeroJornadas,
      ganhoMedioPorJornada: numeroJornadas > 0 ? DashboardUtils.formatCurrency(faturamentoBruto / numeroJornadas) : 0,
      tempoTotalTrabalhadoMinutos,
      ganhoPorHora: tempoTotalTrabalhadoMinutos > 0 ? DashboardUtils.formatCurrency(faturamentoBruto / (tempoTotalTrabalhadoMinutos / 60)) : 0,
    };
  }

  /**
   * Calcula distribuição de despesas otimizada
   */
  static async calcularDistribuicaoDespesas(
    userId: string, 
    dataInicio: Date, 
    dataFim: Date, 
    idVeiculo?: string
  ) {
    const abastecimentosConditions = DashboardUtils.buildBaseConditions(userId, dataInicio, dataFim, idVeiculo, 'abastecimentos');
    const despesasConditions = DashboardUtils.buildBaseConditions(userId, dataInicio, dataFim, idVeiculo, 'despesas');

    const [combustivelResult, despesasResult] = await Promise.all([
      db.select({ total: sql<number>`COALESCE(SUM(${abastecimentos.valorTotal}), 0)` })
        .from(abastecimentos)
        .where(abastecimentosConditions),
      db.select({
        tipoDespesa: despesas.tipoDespesa,
        total: sql<number>`COALESCE(SUM(${despesas.valorDespesa}), 0)`
      })
        .from(despesas)
        .where(despesasConditions)
        .groupBy(despesas.tipoDespesa)
    ]);

    const distribuicao = [
      {
        categoria: 'Combustível',
        valor: DashboardUtils.formatCurrency(Number(combustivelResult[0]?.total || 0))
      }
    ];

    despesasResult.forEach(categoria => {
      distribuicao.push({
        categoria: categoria.tipoDespesa || 'Outros',
        valor: DashboardUtils.formatCurrency(Number(categoria.total || 0))
      });
    });

    return distribuicao;
  }

  /**
   * Calcula dados de evolução otimizada com granularidade
   */
  static async calcularDadosEvolucao(
    userId: string, 
    periodo: string, 
    idVeiculo?: string,
    granularidade: 'diario' | 'semanal' | 'mensal' = 'diario'
  ): Promise<EvolutionDataPoint[]> {
    const agora = new Date();
    const dadosEvolucao: EvolutionDataPoint[] = [];

    let numeroPeriodos: number;
    let intervaloDias: number;

    switch (periodo) {
      case 'semana':
        numeroPeriodos = granularidade === 'diario' ? 7 : 1;
        intervaloDias = granularidade === 'diario' ? 1 : 7;
        break;
      case 'mes':
        numeroPeriodos = granularidade === 'diario' ? 30 : (granularidade === 'semanal' ? 4 : 1);
        intervaloDias = granularidade === 'diario' ? 1 : (granularidade === 'semanal' ? 7 : 30);
        break;
      case 'ano':
        numeroPeriodos = 12;
        intervaloDias = 30;
        break;
      default:
        numeroPeriodos = 30;
        intervaloDias = 1;
    }

    // Calcular múltiplos períodos em batches para otimização
    const batchSize = 10;
    for (let batchStart = 0; batchStart < numeroPeriodos; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize, numeroPeriodos);
      
      const batchPromises = [];
      for (let i = batchStart; i < batchEnd; i++) {
        const periodIndex = numeroPeriodos - 1 - i;
        const dataFim = new Date(agora);
        dataFim.setDate(agora.getDate() - (periodIndex * intervaloDias));
        
        const dataInicio = new Date(dataFim);
        dataInicio.setDate(dataFim.getDate() - intervaloDias + 1);

        batchPromises.push(
          this.calcularTodasMetricas(userId, dataInicio, dataFim, idVeiculo)
            .then(metrics => ({
              data: dataFim.toISOString().split('T')[0],
              faturamentoBruto: metrics.faturamentoBruto,
              totalDespesas: metrics.totalDespesas,
              lucroLiquido: metrics.lucroLiquido,
              numeroJornadas: metrics.numeroJornadas,
              kmTotal: metrics.kmTotal,
            }))
        );
      }

      const batchResults = await Promise.all(batchPromises);
      dadosEvolucao.push(...batchResults);
    }

    return dadosEvolucao.sort((a, b) => a.data.localeCompare(b.data));
  }
}

export const dashboardRoutes: FastifyPluginAsyncZod = async (app) => {
  // GET /dashboard/summary - Resumo de lucratividade
  app.get('/dashboard/summary', {
    schema: {
      querystring: dashboardQuerySchema,
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            periodo: z.object({
              tipo: z.string(),
              dataInicio: z.string(),
              dataFim: z.string(),
            }),
            metricasPrincipais: z.object({
              faturamentoBruto: z.number(),
              totalDespesas: z.number(),
              lucroLiquido: z.number(),
              margemLucro: z.number(),
            }),
            metricasOperacionais: z.object({
              kmTotal: z.number(),
              custoPorKm: z.number(),
              numeroJornadas: z.number(),
              ganhoMedioPorJornada: z.number(),
              tempoTotalTrabalhadoMinutos: z.number(),
              ganhoPorHora: z.number(),
            }),
            distribuicaoDespesas: z.array(z.object({
              categoria: z.string(),
              valor: z.number(),
            })),
            idVeiculo: z.string().nullable(),
            performanceScore: z.number(),
            cacheInfo: z.object({
              hit: z.boolean(),
              generatedAt: z.string(),
            }).optional(),
          }),
        }),
      },
    },
  }, async (request: FastifyRequest<{ Querystring: z.infer<typeof dashboardQuerySchema> }>, reply) => {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { periodo, dataInicio, dataFim, idVeiculo, includeCache } = request.query;

      // Calcular período
      const { dataInicio: parsedDataInicio, dataFim: parsedDataFim } = DashboardUtils.calcularPeriodo(periodo, dataInicio, dataFim);
      const cacheKey = `summary:${userId}:${periodo}:${dataInicio || 'null'}:${dataFim || 'null'}:${idVeiculo || 'null'}`;

      if (includeCache) {
        const cachedData = DashboardCache.get(cacheKey);
        if (cachedData) {
          return reply.send({
            success: true,
            data: { ...cachedData, cacheInfo: { hit: true, generatedAt: new Date(cachedData.cacheInfo.generatedAt).toISOString() } }
          });
        }
      }

      const metrics = await DashboardCalculations.calcularTodasMetricas(userId, parsedDataInicio, parsedDataFim, idVeiculo);
      const distribuicaoDespesas = await DashboardCalculations.calcularDistribuicaoDespesas(userId, parsedDataInicio, parsedDataFim, idVeiculo);
      const performanceScore = DashboardUtils.calculatePerformanceScore(metrics);

      const responseData = {
        periodo: {
          tipo: periodo,
          dataInicio: parsedDataInicio.toISOString(),
          dataFim: parsedDataFim.toISOString(),
        },
        metricasPrincipais: {
          faturamentoBruto: metrics.faturamentoBruto,
          totalDespesas: metrics.totalDespesas,
          lucroLiquido: metrics.lucroLiquido,
          margemLucro: metrics.margemLucro,
        },
        metricasOperacionais: {
          kmTotal: metrics.kmTotal,
          custoPorKm: metrics.custoPorKm,
          numeroJornadas: metrics.numeroJornadas,
          ganhoMedioPorJornada: metrics.ganhoMedioPorJornada,
          tempoTotalTrabalhadoMinutos: metrics.tempoTotalTrabalhadoMinutos,
          ganhoPorHora: metrics.ganhoPorHora,
        },
        distribuicaoDespesas,
        idVeiculo: idVeiculo || null,
        performanceScore,
        cacheInfo: { hit: false, generatedAt: new Date().toISOString() },
      };

      DashboardCache.set(cacheKey, responseData, `summary${periodo.charAt(0).toUpperCase() + periodo.slice(1)}` as keyof typeof DashboardCache.TTL_CONFIG);

      reply.send({ success: true, data: responseData });

    } catch (error: any) {
      console.error('Erro ao obter resumo do dashboard:', error);
      if (error instanceof z.ZodError) {
        reply.status(400).send({ success: false, error: 'Dados de entrada inválidos', details: error.errors });
      } else if (error instanceof UnauthorizedError) {
        reply.status(401).send({ success: false, error: error.message });
      } else if (error instanceof NotFoundError) {
        reply.status(404).send({ success: false, error: error.message });
      } else {
        reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
    }
  });

  // GET /dashboard/evolution - Evolução de métricas ao longo do tempo
  app.get('/dashboard/evolution', {
    schema: {
      querystring: evolutionQuerySchema,
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            periodo: z.object({
              tipo: z.string(),
              granularidade: z.string(),
            }),
            evolucao: z.array(z.object({
              data: z.string(),
              faturamentoBruto: z.number(),
              totalDespesas: z.number(),
              lucroLiquido: z.number(),
              numeroJornadas: z.number(),
              kmTotal: z.number(),
            })),
            idVeiculo: z.string().nullable(),
            cacheInfo: z.object({
              hit: z.boolean(),
              generatedAt: z.string(),
            }).optional(),
          }),
        }),
      },
    },
  }, async (request: FastifyRequest<{ Querystring: z.infer<typeof evolutionQuerySchema> }>, reply) => {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { periodo, idVeiculo, granularidade } = request.query;
      const cacheKey = `evolution:${userId}:${periodo}:${granularidade || 'null'}:${idVeiculo || 'null'}`;

      const cachedData = DashboardCache.get(cacheKey);
      if (cachedData) {
        return reply.send({
          success: true,
          data: { ...cachedData, cacheInfo: { hit: true, generatedAt: new Date(cachedData.cacheInfo.generatedAt).toISOString() } }
        });
      }

      const evolucao = await DashboardCalculations.calcularDadosEvolucao(userId, periodo, idVeiculo, granularidade);

      const responseData = {
        periodo: {
          tipo: periodo,
          granularidade: granularidade || 'diario',
        },
        evolucao,
        idVeiculo: idVeiculo || null,
        cacheInfo: { hit: false, generatedAt: new Date().toISOString() },
      };

      DashboardCache.set(cacheKey, responseData, 'evolution');

      reply.send({ success: true, data: responseData });

    } catch (error: any) {
      console.error('Erro ao obter evolução do dashboard:', error);
      if (error instanceof z.ZodError) {
        reply.status(400).send({ success: false, error: 'Dados de entrada inválidos', details: error.errors });
      } else if (error instanceof UnauthorizedError) {
        reply.status(401).send({ success: false, error: error.message });
      } else {
        reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
    }
  });

  // GET /dashboard/comparison - Comparação de veículos
  app.get('/dashboard/comparison', {
    schema: {
      querystring: comparisonQuerySchema,
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            periodo: z.object({
              tipo: z.string(),
              dataInicio: z.string(),
              dataFim: z.string(),
            }),
            comparacaoVeiculos: z.array(z.object({
              veiculo: z.object({
                id: z.string().uuid(),
                marca: z.string(),
                modelo: z.string(),
                placa: z.string(),
                ano: z.number(),
              }),
              metricas: z.object({
                faturamentoBruto: z.number(),
                totalDespesas: z.number(),
                lucroLiquido: z.number(),
                margemLucro: z.number(),
                kmTotal: z.number(),
                custoPorKm: z.number(),
                numeroJornadas: z.number(),
                ganhoMedioPorJornada: z.number(),
                tempoTotalTrabalhadoMinutos: z.number(),
                ganhoPorHora: z.number(),
              }),
              performanceScore: z.number(),
            })),
            resumoComparativo: z.object({
              melhorPerformance: z.object({
                veiculo: z.object({
                  id: z.string().uuid(),
                  marca: z.string(),
                  modelo: z.string(),
                  placa: z.string(),
                }),
                score: z.number(),
              }).nullable(),
              piorPerformance: z.object({
                veiculo: z.object({
                  id: z.string().uuid(),
                  marca: z.string(),
                  modelo: z.string(),
                  placa: z.string(),
                }),
                score: z.number(),
              }).nullable(),
              mediaLucroLiquido: z.number(),
              mediaCustoPorKm: z.number(),
            }).nullable(),
            cacheInfo: z.object({
              hit: z.boolean(),
              generatedAt: z.string(),
            }).optional(),
          }),
        }),
      },
    },
  }, async (request: FastifyRequest<{ Querystring: z.infer<typeof comparisonQuerySchema> }>, reply) => {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { periodo, dataInicio, dataFim, incluirInativos } = request.query;
      const cacheKey = `comparison:${userId}:${periodo}:${dataInicio || 'null'}:${dataFim || 'null'}:${incluirInativos}`;

      const cachedData = DashboardCache.get(cacheKey);
      if (cachedData) {
        return reply.send({
          success: true,
          data: { ...cachedData, cacheInfo: { hit: true, generatedAt: new Date(cachedData.cacheInfo.generatedAt).toISOString() } }
        });
      }

      const { dataInicio: parsedDataInicio, dataFim: parsedDataFim } = DashboardUtils.calcularPeriodo(periodo, dataInicio, dataFim);

      const vehicleConditions = [
        eq(veiculos.idUsuario, userId),
      ];

      if (!incluirInativos) {
        vehicleConditions.push(isNull(veiculos.deletedAt));
      }

      const userVehicles = await db
        .select({
          id: veiculos.id,
          marca: veiculos.marca,
          modelo: veiculos.modelo,
          placa: veiculos.placa,
          ano: veiculos.ano,
        })
        .from(veiculos)
        .where(and(...vehicleConditions));

      const comparacaoVeiculos: VehicleComparison[] = [];
      let totalLucroLiquido = 0;
      let totalCustoPorKm = 0;
      let veiculosComDados = 0;

      for (const vehicle of userVehicles) {
        const metrics = await DashboardCalculations.calcularTodasMetricas(userId, parsedDataInicio, parsedDataFim, vehicle.id);
        const performanceScore = DashboardUtils.calculatePerformanceScore(metrics);

        comparacaoVeiculos.push({
          veiculo: {
            id: vehicle.id,
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            placa: vehicle.placa,
            ano: vehicle.ano,
          },
          metricas: metrics,
          performanceScore,
        });

        if (metrics.lucroLiquido !== undefined) {
          totalLucroLiquido += metrics.lucroLiquido;
        }
        if (metrics.custoPorKm !== undefined) {
          totalCustoPorKm += metrics.custoPorKm;
        }
        if (metrics.lucroLiquido !== undefined || metrics.custoPorKm !== undefined) {
          veiculosComDados++;
        }
      }

      let melhorPerformance: VehicleComparison | null = null;
      let piorPerformance: VehicleComparison | null = null;

      if (comparacaoVeiculos.length > 0) {
        melhorPerformance = comparacaoVeiculos.reduce((prev, current) => (
          (prev.performanceScore > current.performanceScore) ? prev : current
        ));
        piorPerformance = comparacaoVeiculos.reduce((prev, current) => (
          (prev.performanceScore < current.performanceScore) ? prev : current
        ));
      }

      const resumoComparativo = comparacaoVeiculos.length > 0 ? {
        melhorPerformance: melhorPerformance ? {
          veiculo: {
            id: melhorPerformance.veiculo.id,
            marca: melhorPerformance.veiculo.marca,
            modelo: melhorPerformance.veiculo.modelo,
            placa: melhorPerformance.veiculo.placa,
          },
          score: melhorPerformance.performanceScore,
        } : null,
        piorPerformance: piorPerformance ? {
          veiculo: {
            id: piorPerformance.veiculo.id,
            marca: piorPerformance.veiculo.marca,
            modelo: piorPerformance.veiculo.modelo,
            placa: piorPerformance.veiculo.placa,
          },
          score: piorPerformance.performanceScore,
        } : null,
        mediaLucroLiquido: veiculosComDados > 0 ? DashboardUtils.formatCurrency(totalLucroLiquido / veiculosComDados) : 0,
        mediaCustoPorKm: veiculosComDados > 0 ? DashboardUtils.formatCurrency(totalCustoPorKm / veiculosComDados) : 0,
      } : null;

      const responseData = {
        periodo: {
          tipo: periodo,
          dataInicio: parsedDataInicio.toISOString(),
          dataFim: parsedDataFim.toISOString(),
        },
        comparacaoVeiculos,
        resumoComparativo,
        cacheInfo: { hit: false, generatedAt: new Date().toISOString() },
      };

      DashboardCache.set(cacheKey, responseData, 'comparison');

      reply.send({ success: true, data: responseData });

    } catch (error: any) {
      console.error('Erro ao obter comparação de veículos:', error);
      if (error instanceof z.ZodError) {
        reply.status(400).send({ success: false, error: 'Dados de entrada inválidos', details: error.errors });
      } else if (error instanceof UnauthorizedError) {
        reply.status(401).send({ success: false, error: error.message });
      } else {
        reply.status(500).send({ success: false, error: 'Erro interno do servidor' });
      }
    }
  });
};

