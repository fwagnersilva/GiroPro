import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { db } from '../db';
import { jornadas, abastecimentos, despesas, veiculos } from '../db/schema';
import { eq, and, isNull, isNotNull, sql, gte, lte, sum, count, inArray } from 'drizzle-orm';
import type { ServiceResult, CacheConfig } from '../types/common';

// 📝 Schemas de validação otimizados
const dashboardQuerySchema = z.object({
  periodo: z.enum(['hoje', 'semana', 'mes', 'ano', 'personalizado']).default('mes'),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  idVeiculo: z.string().uuid().optional(),
  include_cache: z.boolean().default(true),
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
  incluir_inativos: z.boolean().default(false),
});

// 🎯 Interfaces para tipagem
interface DashboardMetrics {
  faturamento_bruto: number;
  total_despesas: number;
  lucro_liquido: number;
  margem_lucro: number;
  km_total: number;
  custo_por_km: number;
  numero_jornadas: number;
  ganho_medio_por_jornada: number;
  tempo_total_trabalhado_minutos: number;
  ganho_por_hora: number;
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
  performance_score: number;
}

interface EvolutionDataPoint {
  data: string;
  faturamento_bruto: number;
  total_despesas: number;
  lucro_liquido: number;
  numero_jornadas: number;
  km_total: number;
}

// 🔧 Sistema de cache otimizado para dashboards
class DashboardCache {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  // TTL diferentes baseados no tipo de consulta
  private static readonly TTL_CONFIG: Record<string, number> = {
    summary_today: 5 * 60 * 1000,      // 5 minutos para dados de hoje
    summary_week: 15 * 60 * 1000,      // 15 minutos para semana
    summary_month: 30 * 60 * 1000,     // 30 minutos para mês
    summary_year: 60 * 60 * 1000,      // 1 hora para ano
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

  static set(key: string, data: any, type: keyof typeof DashboardCache.TTL_CONFIG = 'summary_month'): void {
    const ttl = this.TTL_CONFIG[type] || this.TTL_CONFIG.summary_month;
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

// 🛠️ Utilitários para cálculos otimizados
class DashboardUtils {
  /**
   * Calcula período com validação robusta
   */
  static calcularPeriodo(periodo: string, dataInicio?: string, dataFim?: string): { dataInicio: Date; dataFim: Date } {
    const agora = new Date();
    let dataInicio: Date;
    let dataFim: Date = new Date(agora);

    if (periodo === 'personalizado') {
      if (!dataInicio || !dataFim) {
        throw new Error('Datas de início e fim são obrigatórias para período personalizado');
      }
      
      dataInicio = new Date(dataInicio);
      dataFim = new Date(dataFim);
      
      if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
        throw new Error('Datas fornecidas são inválidas');
      }
      
      if (dataInicio > dataFim) {
        throw new Error('Data de início não pode ser posterior à data de fim');
      }
      
      // Limit para evitar queries muito pesadas (máx 2 anos)
      const diffDays = (dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 730) {
        throw new Error('Período máximo permitido é de 2 anos');
      }
    } else {
      switch (periodo) {
        case 'hoje':
          dataInicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
          dataFim = new Date(dataInicio);
          dataFim.setDate(dataFim.getDate() + 1);
          break;
        case 'semana':
          dataInicio = new Date(agora);
          dataInicio.setDate(agora.getDate() - 7);
          break;
        case 'mes':
          dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
          break;
        case 'ano':
          dataInicio = new Date(agora.getFullYear(), 0, 1);
          break;
        default:
          dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
      }
    }

    return { dataInicio, dataFim };
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
      gte(dateField, dataInicio.toISOString()),
      lte(dateField, dataFim.toISOString()),
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
    if (metrics.margem_lucro > 30) score += 40;
    else if (metrics.margem_lucro > 20) score += 30;
    else if (metrics.margem_lucro > 10) score += 20;
    else if (metrics.margem_lucro > 0) score += 10;
    
    // Ganho por hora (30% do score)
    if (metrics.ganho_por_hora > 30) score += 30;
    else if (metrics.ganho_por_hora > 20) score += 25;
    else if (metrics.ganho_por_hora > 15) score += 20;
    else if (metrics.ganho_por_hora > 10) score += 15;
    
    // Custo por KM (20% do score - inverso)
    if (metrics.custo_por_km < 0.5) score += 20;
    else if (metrics.custo_por_km < 1.0) score += 15;
    else if (metrics.custo_por_km < 1.5) score += 10;
    else if (metrics.custo_por_km < 2.0) score += 5;
    
    // Número de jornadas (10% do score)
    if (metrics.numero_jornadas > 50) score += 10;
    else if (metrics.numero_jornadas > 30) score += 8;
    else if (metrics.numero_jornadas > 10) score += 5;
    
    return Math.min(score, 100);
  }
}

// 🚀 Serviço otimizado para cálculos agregados
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
        faturamento_bruto: sql<number>`COALESCE(SUM(${jornadas.ganho_bruto}), 0)`,
        km_total: sql<number>`COALESCE(SUM(${jornadas.km_total}), 0)`,
        numero_jornadas: sql<number>`COUNT(*)`,
        tempo_total: sql<number>`
          COALESCE(
            SUM(
              CASE 
                WHEN ${jornadas.dataFim} IS NOT NULL AND ${jornadas.dataInicio} IS NOT NULL
                THEN (strftime('%s', ${jornadas.dataFim}) - strftime('%s', ${jornadas.dataInicio})) / 60
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
      db.select({ total: sql<number>`COALESCE(SUM(${despesas.valorDespesa}), 0)` })
        .from(despesas)
        .where(despesasConditions)
    ]);

    // Calcular métricas derivadas
    const faturamento_bruto = Number(jornadasResult.faturamento_bruto);
    const total_combustivel = Number(abastecimentosResult[0]?.total || 0);
    const total_outras_despesas = Number(despesasResult[0]?.total || 0);
    const total_despesas = total_combustivel + total_outras_despesas;
    const lucro_liquido = faturamento_bruto - total_despesas;
    const km_total = Number(jornadasResult.km_total);
    const numero_jornadas = Number(jornadasResult.numero_jornadas);
    const tempo_total_trabalhado_minutos = Number(jornadasResult.tempo_total);

    return {
      faturamento_bruto: DashboardUtils.formatCurrency(faturamento_bruto),
      total_despesas: DashboardUtils.formatCurrency(total_despesas),
      lucro_liquido: DashboardUtils.formatCurrency(lucro_liquido),
      margem_lucro: faturamento_bruto > 0 ? DashboardUtils.formatCurrency((lucro_liquido / faturamento_bruto) * 100) : 0,
      km_total: DashboardUtils.formatCurrency(km_total),
      custo_por_km: km_total > 0 ? DashboardUtils.formatCurrency(total_despesas / km_total) : 0,
      numero_jornadas,
      ganho_medio_por_jornada: numero_jornadas > 0 ? DashboardUtils.formatCurrency(faturamento_bruto / numero_jornadas) : 0,
      tempo_total_trabalhado_minutos,
      ganho_por_hora: tempo_total_trabalhado_minutos > 0 ? DashboardUtils.formatCurrency(faturamento_bruto / (tempo_total_trabalhado_minutos / 60)) : 0,
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
              faturamento_bruto: metrics.faturamento_bruto,
              total_despesas: metrics.total_despesas,
              lucro_liquido: metrics.lucro_liquido,
              numero_jornadas: metrics.numero_jornadas,
              km_total: metrics.km_total,
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
  // 📊 GET /dashboard/summary - Resumo de lucratividade
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
            metricas_principais: z.object({
              faturamento_bruto: z.number(),
              total_despesas: z.number(),
              lucro_liquido: z.number(),
              margem_lucro: z.number(),
            }),
            metricas_operacionais: z.object({
              km_total: z.number(),
              custo_por_km: z.number(),
              numero_jornadas: z.number(),
              ganho_medio_por_jornada: z.number(),
              tempo_total_trabalhado_minutos: z.number(),
              ganho_por_hora: z.number(),
            }),
            distribuicao_despesas: z.array(z.object({
              categoria: z.string(),
              valor: z.number(),
            })),
            idVeiculo: z.string().nullable(),
            performance_score: z.number(),
            cache_info: z.object({
              hit: z.boolean(),
              generated_at: z.string(),
            }).optional(),
          }),
        }),
      },
    },
  }, async (request, reply) => {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { periodo, dataInicio, dataFim, idVeiculo, include_cache } = request.query;

      // Calcular período
      const { dataInicio, dataFim } = DashboardUtils.calcularPeriodo(periodo, dataInicio, dataFim);

      // Verificar cache
      const cacheKey = `summary:${userId}:${periodo}:${idVeiculo || 'all'}:${dataInicio.getTime()}:${dataFim.getTime()}`;
      let cacheHit = false;
      let result;

      if (include_cache) {
        result = DashboardCache.get(cacheKey);
        if (result) {
          cacheHit = true;
          return reply.send({
            success: true,
            data: {
              ...result,
              cache_info: {
                hit: true,
                generated_at: new Date().toISOString(),
              }
            }
          });
        }
      }

      // Verificar se o veículo pertence ao usuário
      if (idVeiculo) {
        const [veiculo] = await db
          .select({ id: veiculos.id })
          .from(veiculos)
          .where(and(
            eq(veiculos.id, idVeiculo),
            eq(veiculos.idUsuario, userId),
            isNull(veiculos.deletedAt)
          ))
          .limit(1);

        if (!veiculo) {
          return reply.status(404).send({
            success: false,
            error: 'Veículo não encontrado'
          });
        }
      }

      // Calcular métricas (paralelo)
      const [metricas, distribuicaoDespesas] = await Promise.all([
        DashboardCalculations.calcularTodasMetricas(userId, dataInicio, dataFim, idVeiculo),
        DashboardCalculations.calcularDistribuicaoDespesas(userId, dataInicio, dataFim, idVeiculo)
      ]);

      const performanceScore = DashboardUtils.calculatePerformanceScore(metricas);

      result = {
        periodo: {
          tipo: periodo,
          dataInicio: dataInicio.toISOString(),
          dataFim: dataFim.toISOString()
        },
        metricas_principais: {
          faturamento_bruto: metricas.faturamento_bruto,
          total_despesas: metricas.total_despesas,
          lucro_liquido: metricas.lucro_liquido,
          margem_lucro: metricas.margem_lucro
        },
        metricas_operacionais: {
          km_total: metricas.km_total,
          custo_por_km: metricas.custo_por_km,
          numero_jornadas: metricas.numero_jornadas,
          ganho_medio_por_jornada: metricas.ganho_medio_por_jornada,
          tempo_total_trabalhado_minutos: metricas.tempo_total_trabalhado_minutos,
          ganho_por_hora: metricas.ganho_por_hora
        },
        distribuicao_despesas: distribuicaoDespesas,
        idVeiculo: idVeiculo || null,
        performance_score: performanceScore
      };

      // Salvar no cache
      if (include_cache) {
        const cacheType = periodo === 'hoje' ? 'summary_today' :
                         periodo === 'semana' ? 'summary_week' :
                         periodo === 'mes' ? 'summary_month' : 'summary_year';
        DashboardCache.set(cacheKey, result, cacheType as any);
      }

      return reply.send({
        success: true,
        data: {
          ...result,
          cache_info: {
            hit: false,
            generated_at: new Date().toISOString(),
          }
        }
      });

    } catch (error: any) {
      console.error('[Dashboard.getSummary]', error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  })

  // 📈 GET /dashboard/evolution - Dados de evolução temporal
  app.get('/dashboard/evolution', {
    schema: {
      querystring: evolutionQuerySchema,
    },
  }, async (request, reply) => {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { periodo, idVeiculo, granularidade = 'diario' } = request.query;

      // Verificar cache
      const cacheKey = `evolution:${userId}:${periodo}:${idVeiculo || 'all'}:${granularidade}`;
      let result = DashboardCache.get(cacheKey);

      if (!result) {
        const dadosEvolucao = await DashboardCalculations.calcularDadosEvolucao(
          userId, periodo, idVeiculo, granularidade
        );

        result = {
          periodo,
          granularidade,
          evolucao: dadosEvolucao,
          idVeiculo: idVeiculo || null
        };

        DashboardCache.set(cacheKey, result, 'evolution');
      }

      return reply.send({
        success: true,
        data: result
      });

    } catch (error: any) {
      console.error('[Dashboard.getEvolution]', error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  })

  // 🔄 GET /dashboard/comparison - Comparativo entre veículos
  app.get('/dashboard/comparison', {
    schema: {
      querystring: comparisonQuerySchema,
    },
  }, async (request, reply) => {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { periodo, dataInicio, dataFim, incluir_inativos } = request.query;
      const { dataInicio, dataFim } = DashboardUtils.calcularPeriodo(periodo, dataInicio, dataFim);

      // Verificar cache
      const cacheKey = `comparison:${userId}:${periodo}:${dataInicio.getTime()}:${dataFim.getTime()}:${incluir_inativos}`;
      let result = DashboardCache.get<any>(cacheKey);

      if (!result) {
        // Obter veículos (com filtro de ativos/inativos)
        let veiculosConditions = and(
          eq(veiculos.idUsuario, userId),
          isNull(veiculos.deletedAt)
        );

        if (!incluir_inativos) {
          // Adicionar condição para veículos que tiveram atividade no período
          veiculosConditions = and(
            veiculosConditions,
            // Esta lógica pode ser refinada baseada em sua regra de negócio
          );
        }

        const veiculosUsuario = await db
          .select()
          .from(veiculos)
          .where(veiculosConditions)
          .limit(50); // Limite para evitar overload

        // Calcular métricas para todos os veículos em batches
        const batchSize = 5;
        const comparativo: VehicleComparison[] = [];

        for (let i = 0; i < veiculosUsuario.length; i += batchSize) {
          const batch = veiculosUsuario.slice(i, i + batchSize);
          
          const batchMetrics = await Promise.all(
            batch.map(async (veiculo) => {
              const metricas = await DashboardCalculations.calcularTodasMetricas(
                userId, dataInicio, dataFim, veiculo.id
              );
              
              const performanceScore = DashboardUtils.calculatePerformanceScore(metricas);

              return {
                veiculo: {
                  id: veiculo.id,
                  marca: veiculo.marca,
                  modelo: veiculo.modelo,
                  placa: veiculo.placa,
                  ano: veiculo.ano
                },
                metricas,
                performance_score: performanceScore
              };
            })
          );

          comparativo.push(...batchMetrics);
        }

        // Ordenar por performance score
        comparativo.sort((a, b) => b.performance_score - a.performance_score);

        result = {
          periodo: {
            tipo: periodo,
            dataInicio: dataInicio.toISOString(),
            dataFim: dataFim.toISOString()
          },
          comparativo,
          estatisticas_gerais: {
            total_veiculos: comparativo.length,
            melhor_performance: comparativo[0]?.performance_score || 0,
            performance_media: comparativo.length > 0 
              ? DashboardUtils.formatCurrency(
                  comparativo.reduce((sum, item) => sum + item.performance_score, 0) / comparativo.length
                )
              : 0,
            total_faturamento: DashboardUtils.formatCurrency(
              comparativo.reduce((sum, item) => sum + item.metricas.faturamento_bruto, 0)
            ),
            total_despesas: DashboardUtils.formatCurrency(
              comparativo.reduce((sum, item) => sum + item.metricas.total_despesas, 0)
            )
          }
        };

        DashboardCache.set(cacheKey, result, 'comparison');
      }

      return reply.send({
        success: true,
        data: result
      });

    } catch (error: any) {
      console.error('[Dashboard.getComparison]', error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  })

  // 🔄 POST /dashboard/cache/invalidate - Invalidar cache
  app.post('/dashboard/cache/invalidate', {
    schema: {
      body: z.object({
        type: z.enum(['user', 'all']).default('user'),
      }),
    },
  }, async (request, reply) => {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { type } = request.body;

      if (type === 'all') {
        DashboardCache.clear();
      } else {
        DashboardCache.invalidateUser(userId);
      }

      return reply.send({
        success: true,
        data: {
          message: `Cache ${type === 'all' ? 'geral' : 'do usuário'} invalidado com sucesso`,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error: any) {
      console.error('[Dashboard.invalidateCache]', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro ao invalidar cache'
      });
    }
  })

  // 📊 GET /dashboard/metrics - Métricas resumidas para widgets
  app.get('/dashboard/metrics', {
    schema: {
      querystring: z.object({
        periodo: z.enum(['hoje', 'semana', 'mes']).default('mes'),
        idVeiculo: z.string().uuid().optional(),
        metrics: z.array(z.enum([
          'faturamento', 'despesas', 'lucro', 'jornadas', 'km', 'tempo'
        ])).default(['faturamento', 'despesas', 'lucro']),
      }),
    },
  }, async (request, reply) => {
    try {
      const userId = request.user?.id;
      if (!userId) {
        return reply.status(401).send({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { periodo, idVeiculo, metrics } = request.query;
      const { dataInicio, dataFim } = DashboardUtils.calcularPeriodo(periodo);

      // Verificar cache específico para widgets
      const cacheKey = `metrics:${userId}:${periodo}:${idVeiculo || 'all'}:${metrics.join(',')}`;
      let result = DashboardCache.get(cacheKey);

      if (!result) {
        const allMetrics = await DashboardCalculations.calcularTodasMetricas(
          userId, dataInicio, dataFim, idVeiculo
        );

        // Filtrar apenas as métricas solicitadas
        result = {};
        if (metrics.includes('faturamento')) result.faturamento_bruto = allMetrics.faturamento_bruto;
        if (metrics.includes('despesas')) result.total_despesas = allMetrics.total_despesas;
        if (metrics.includes('lucro')) result.lucro_liquido = allMetrics.lucro_liquido;
        if (metrics.includes('jornadas')) result.numero_jornadas = allMetrics.numero_jornadas;
        if (metrics.includes('km')) result.km_total = allMetrics.km_total;
        if (metrics.includes('tempo')) result.tempo_total_trabalhado_minutos = allMetrics.tempo_total_trabalhado_minutos;

        // Cache com TTL menor para widgets (dados mais frescos)
        const cacheType = periodo === 'hoje' ? 'summary_today' : 'summary_week';
        DashboardCache.set(cacheKey, result, cacheType);
      }

      return reply.send({
        success: true,
        data: {
          periodo,
          metricas: result,
          idVeiculo: idVeiculo || null,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error: any) {
      console.error('[Dashboard.getMetrics]', error);
      return reply.status(500).send({
        success: false,
        error: 'Erro ao obter métricas'
      });
    }
  })

  // 🔍 GET /dashboard/health - Health check específico
  app.get('/dashboard/health', async (request, reply) => {
    try {
      const cacheSize = DashboardCache['cache'].size;
      const memoryUsage = process.memoryUsage();
      
      return reply.send({
        status: 'healthy',
        service: 'dashboard-controller',
        timestamp: new Date().toISOString(),
        cache: {
          entries: cacheSize,
          memory_mb: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100
        },
        endpoints: [
          'GET /dashboard/summary',
          'GET /dashboard/evolution',
          'GET /dashboard/comparison',
          'GET /dashboard/metrics',
          'POST /dashboard/cache/invalidate',
        ],
        performance_tips: [
          'Use cache=true para melhor performance',
          'Prefira períodos pré-definidos vs personalizado',
          'Limite comparações a poucos veículos por vez'
        ]
      });
    } catch (error: any) {
      return reply.status(500).send({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  })
}
