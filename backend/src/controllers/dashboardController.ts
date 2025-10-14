import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { jornadas, abastecimentos, despesas, veiculos } from '../db/schema.postgres';
import { eq, and, isNull, isNotNull, sql, gte, lte, sum, count, inArray } from 'drizzle-orm';
import type { ServiceResult, CacheConfig } from '../types';
import { AuthenticatedRequest } from '../types';

// Classes de erro
class UnauthorizedError extends Error {
  constructor(message: string = 'Não autorizado') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

class NotFoundError extends Error {
  constructor(message: string = 'Não encontrado') {
    super(message);
    this.name = 'NotFoundError';
  }
}

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
    const ttl = DashboardCache.TTL_CONFIG[type] || DashboardCache.TTL_CONFIG.summaryMonth;
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
                THEN (CAST(strftime('%s', ${jornadas.dataFim}) AS INTEGER) - CAST(strftime('%s', ${jornadas.dataInicio}) AS INTEGER)) / 60
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
