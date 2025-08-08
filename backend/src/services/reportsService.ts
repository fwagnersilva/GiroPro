// services/reportsService.ts
import { db } from '../db';
import { jornadas, abastecimentos, despesas } from '../db/schema';
import { eq, and, isNull, gte, lte, sum, count, desc } from 'drizzle-orm';
import { QueryBuilder } from '../utils/queryBuilder';
import { DateUtils } from '../utils/dateUtils';
import { StatisticsCalculator } from '../utils/statisticsCalculator';
import { Logger } from '../utils/logger';

export interface ReportParams {
  userId: string;
  startDate?: string;
  endDate?: string;
  vehicleId?: string;
  includeDetails?: boolean;
  includeCharts?: boolean;
}

export interface ComparisonParams {
  userId: string;
  numberOfWeeks?: number;
  numberOfMonths?: number;
  vehicleId?: string;
  includeTrends?: boolean;
  includePredictions?: boolean;
}

export class ReportsService {
  private static readonly logger = Logger.getInstance('ReportsService');

  /**
   * Gera relatório semanal otimizado
   */
  static async generateWeeklyReport(params: ReportParams) {
    const { userId, startDate, endDate, vehicleId, includeDetails = true, includeCharts = false } = params;
    
    const { dataInicio, dataFim } = DateUtils.calculateWeeklyPeriod(startDate, endDate);
    
    ReportsService.logger.info('Gerando relatório semanal', { 
      userId, dataInicio, dataFim, vehicleId 
    });

    // Executa consultas em paralelo
    const [
      financialData,
      dailyEvolution,
      expenseCategories,
      topJourneys
    ] = await Promise.all([
      ReportsService.getFinancialSummary(userId, dataInicio, dataFim, vehicleId),
      includeDetails ? ReportsService.getDailyEvolution(userId, dataInicio, dataFim, vehicleId) : null,
      includeDetails ? ReportsService.getExpensesByCategory(userId, dataInicio, dataFim, vehicleId) : null,
      includeDetails ? ReportsService.getTopJourneys(userId, vehicleId, 10, dataInicio, dataFim) : null
    ]);

    const indicators = StatisticsCalculator.calculateIndicators(financialData);
    const benchmarks = await ReportsService.calculateBenchmarks(userId, vehicleId);

    return {
      periodo: {
        tipo: 'semanal' as const,
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString(),
        descricao: DateUtils.formatPeriod(dataInicio, dataFim)
      },
      filtros: { idVeiculo: vehicleId || null },
      resumo_financeiro: financialData,
      indicadores: indicators,
      benchmarks,
      ...(includeDetails && {
        evolucao_diaria: dailyEvolution,
        detalhamento_despesas: expenseCategories,
        top_jornadas: topJourneys
      }),
      ...(includeCharts && {
        graficos: await ReportsService.generateChartData(financialData, dailyEvolution)
      })
    };
  }

  /**
   * Gera relatório mensal otimizado
   */
  static async generateMonthlyReport(params: ReportParams) {
    const { userId, startDate, endDate, vehicleId, includeDetails = true, includeCharts = false } = params;
    
    const { dataInicio, dataFim } = DateUtils.calculateMonthlyPeriod(startDate, endDate);
    
    ReportsService.logger.info('Gerando relatório mensal', { 
      userId, dataInicio, dataFim, vehicleId 
    });

    const [
      financialData,
      weeklyBreakdown,
      expenseCategories,
      performanceMetrics
    ] = await Promise.all([
      ReportsService.getFinancialSummary(userId, dataInicio, dataFim, vehicleId),
      includeDetails ? ReportsService.getWeeklyBreakdown(userId, dataInicio, dataFim, vehicleId) : null,
      includeDetails ? ReportsService.getExpensesByCategory(userId, dataInicio, dataFim, vehicleId) : null,
      includeDetails ? ReportsService.getPerformanceMetrics(userId, dataInicio, dataFim, vehicleId) : null
    ]);

    const indicators = StatisticsCalculator.calculateIndicators(financialData);
    const trends = includeDetails ? StatisticsCalculator.calculateTrends(weeklyBreakdown || []) : null;

    return {
      periodo: {
        tipo: 'mensal' as const,
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString(),
        descricao: DateUtils.formatPeriod(dataInicio, dataFim)
      },
      filtros: { idVeiculo: vehicleId || null },
      resumo_financeiro: financialData,
      indicadores: indicators,
      tendencias: trends,
      ...(includeDetails && {
        breakdown_semanal: weeklyBreakdown,
        detalhamento_despesas: expenseCategories,
        metricas_performance: performanceMetrics
      }),
      ...(includeCharts && {
        graficos: await ReportsService.generateChartData(financialData, weeklyBreakdown)
      })
    };
  }

  /**
   * Gera comparativo semanal com análise avançada
   */
  static async generateWeeklyComparison(params: ComparisonParams) {
    const { userId, numberOfWeeks = 4, vehicleId, includeTrends = true, includePredictions = false } = params;
    
    const periods = [];
    const now = new Date();

    // Gera dados para cada semana em paralelo
    const weekPromises = [];
    for (let i = 0; i < numberOfWeeks; i++) {
      const { startDate, endDate } = DateUtils.calculateWeekOffset(now, i);
      
      weekPromises.push(
        ReportsService.getFinancialSummary(userId, startDate, endDate, vehicleId)
          .then(data => ({
            numero_semana: i + 1,
            periodo: DateUtils.formatPeriod(startDate, endDate),
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            ...data
          }))
      );
    }

    const weeklyData = await Promise.all(weekPromises);
    periods.push(...weeklyData.reverse());

    const statistics = StatisticsCalculator.calculateComparisonStatistics(periods);
    const trends = includeTrends ? StatisticsCalculator.calculateTrends(periods) : null;
    const predictions = includePredictions ? StatisticsCalculator.generatePredictions(periods) : null;
    const insights = StatisticsCalculator.generateInsights(periods, statistics, trends);

    return {
      periods,
      statistics,
      trends,
      predictions,
      insights
    };
  }

  /**
   * Gera comparativo mensal com sazonalidade
   */
  static async generateMonthlyComparison(params: ComparisonParams) {
    const { userId, numberOfMonths = 6, vehicleId, includeTrends = true, includePredictions = false } = params;
    
    const periods = [];
    const now = new Date();

    const monthPromises = [];
    for (let i = 0; i < numberOfMonths; i++) {
      const { startDate, endDate } = DateUtils.calculateMonthOffset(now, i);
      
      monthPromises.push(
        ReportsService.getFinancialSummary(userId, startDate, endDate, vehicleId)
          .then(data => ({
            mes_ano: DateUtils.formatMonthYear(startDate),
            periodo: DateUtils.formatPeriod(startDate, endDate),
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            ...data
          }))
      );
    }

    const monthlyData = await Promise.all(monthPromises);
    periods.push(...monthlyData.reverse());

    const statistics = StatisticsCalculator.calculateComparisonStatistics(periods);
    const trends = includeTrends ? StatisticsCalculator.calculateTrends(periods) : null;
    const seasonality = StatisticsCalculator.analyzeSeasonality(periods);
    const predictions = includePredictions ? StatisticsCalculator.generatePredictions(periods) : null;
    const insights = StatisticsCalculator.generateInsights(periods, statistics, trends);

    return {
      periods,
      statistics,
      trends,
      seasonality,
      predictions,
      insights
    };
  }

  /**
   * Resumo financeiro otimizado com consulta única
   */
  private static async getFinancialSummary(
    userId: string, 
    startDate: Date, 
    endDate: Date, 
    vehicleId?: string
  ) {
    const queryBuilder = new QueryBuilder(userId, startDate, endDate, vehicleId);
    
    // Executa todas as consultas em paralelo
    const [
      revenueResult,
      fuelResult,
      expensesResult,
      kmResult,
      journeysResult
    ] = await Promise.all([
      queryBuilder.getTotalRevenue(),
      queryBuilder.getFuelExpenses(),
      queryBuilder.getOtherExpenses(),
      queryBuilder.getTotalKm(),
      queryBuilder.getJourneyCount()
    ]);

    const faturamentoBruto = Number(revenueResult || 0);
    const gastoCombustivel = Number(fuelResult || 0);
    const outrasDespesas = Number(expensesResult || 0);
    const totalDespesas = gastoCombustivel + outrasDespesas;
    const lucroLiquido = faturamentoBruto - totalDespesas;
    const kmTotal = Number(kmResult || 0);
    const numeroJornadas = Number(journeysResult || 0);

    return StatisticsCalculator.calculateFinancialMetrics({
      faturamentoBruto,
      gastoCombustivel,
      outrasDespesas,
      totalDespesas,
      lucroLiquido,
      kmTotal,
      numeroJornadas
    });
  }

  /**
   * Evolução diária otimizada
   */
  private static async getDailyEvolution(
    userId: string,
    startDate: Date,
    endDate: Date,
    vehicleId?: string
  ) {
    const days = DateUtils.getDaysBetween(startDate, endDate);
    
    // Processa todos os dias em paralelo em lotes
    const batchSize = 7;
    const batches = [];
    
    for (let i = 0; i < days.length; i += batchSize) {
      const batch = days.slice(i, i + batchSize);
      batches.push(
        Promise.all(
          batch.map(async day => {
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);
            
            const summary = await ReportsService.getFinancialSummary(userId, day, dayEnd, vehicleId);
            return {
              data: day.toISOString().split('T')[0],
              ...summary
            };
          })
        )
      );
    }

    const results = await Promise.all(batches);
    return results.flat();
  }

  /**
   * Detalhamento semanal otimizado
   */
  private static async getWeeklyBreakdown(
    userId: string,
    startDate: Date,
    endDate: Date,
    vehicleId?: string
  ) {
    const weeks = DateUtils.getWeeksBetween(startDate, endDate);
    const weeklyData = await Promise.all(
      weeks.map(async (week) => {
        const summary = await ReportsService.getFinancialSummary(userId, week.startDate, week.endDate, vehicleId);
        return {
          semana: week.weekNumber,
          dataInicio: week.startDate.toISOString(),
          dataFim: week.endDate.toISOString(),
          ...summary,
        };
      })
    );
    return weeklyData;
  }

  /**
   * Despesas por categoria otimizadas
   */
  private static async getExpensesByCategory(
    userId: string,
    startDate: Date,
    endDate: Date,
    vehicleId?: string
  ) {
    const conditions = [
      eq(despesas.idUsuario, userId),
      gte(despesas.dataDespesa, startDate.toISOString()),
      lte(despesas.dataDespesa, endDate.toISOString()),
      isNull(despesas.deletedAt),
    ];

    if (vehicleId) {
      conditions.push(eq(despesas.idVeiculo, vehicleId));
    }

    const expenses = await db
      .select({
        tipoDespesa: despesas.tipoDespesa,
        valorDespesa: despesas.valorDespesa,
      })
      .from(despesas)
      .where(and(...conditions));

    const groupedExpenses = expenses.reduce((acc, expense) => {
      const category = expense.tipoDespesa;
      acc[category] = (acc[category] || 0) + (Number(expense.valorDespesa) || 0);
      return acc;
    }, {} as Record<string, number>);

    const totalExpenses = Object.values(groupedExpenses).reduce((sum, val) => sum + val, 0);

    return Object.entries(groupedExpenses).map(([category, total]) => ({
      categoria: category,
      total_gasto: Math.round(total),
      percentual: totalExpenses > 0 ? Math.round((total / totalExpenses) * 10000) / 100 : 0,
    }));
  }

  /**
   * Top jornadas por ganho
   */
  private static async getTopJourneys(
    userId: string,
    vehicleId?: string,
    limit: number = 5,
    startDate?: Date,
    endDate?: Date
  ) {
    const conditions = [
      eq(jornadas.idUsuario, userId),
      isNull(jornadas.deletedAt),
    ];

    if (vehicleId) {
      conditions.push(eq(jornadas.idVeiculo, vehicleId));
    }

    if (startDate) {
      conditions.push(gte(jornadas.dataInicio, startDate.toISOString()));
    }
    if (endDate) {
      conditions.push(lte(jornadas.dataInicio, endDate.toISOString()));
    }

    const topJourneys = await db
      .select({
        id: jornadas.id,
        dataInicio: jornadas.dataInicio,
        ganho_bruto: jornadas.ganho_bruto,
        km_total: jornadas.km_total,
        observacoes: jornadas.observacoes,
      })
      .from(jornadas)
      .where(and(...conditions))
      .orderBy(desc(jornadas.ganho_bruto))
      .limit(limit);

    return topJourneys.map(j => ({
      ...j,
      ganho_bruto: Math.round(Number(j.ganho_bruto) || 0),
      km_total: Math.round(Number(j.km_total) || 0),
    }));
  }

  /**
   * Métricas de performance de jornadas
   */
  private static async getPerformanceMetrics(
    userId: string,
    startDate: Date,
    endDate: Date,
    vehicleId?: string
  ) {
    const conditions = [
      eq(jornadas.idUsuario, userId),
      gte(jornadas.dataInicio, startDate.toISOString()),
      lte(jornadas.dataInicio, endDate.toISOString()),
      isNull(jornadas.deletedAt),
    ];

    if (vehicleId) {
      conditions.push(eq(jornadas.idVeiculo, vehicleId));
    }

    const result = await db
      .select({
        totalGanhoBruto: sum(jornadas.ganho_bruto),
        totalKm: sum(jornadas.km_total),
        totalTempo: sum(jornadas.tempo_total),
        countJornadas: count(jornadas.id),
      })
      .from(jornadas)
      .where(and(...conditions));

    const metrics = result[0];

    const totalGanhoBruto = Number(metrics.totalGanhoBruto) || 0;
    const totalKm = Number(metrics.totalKm) || 0;
    const totalTempo = Number(metrics.totalTempo) || 0;
    const countJornadas = Number(metrics.countJornadas) || 0;

    return {
      total_ganho_bruto: Math.round(totalGanhoBruto),
      total_km: Math.round(totalKm),
      total_tempo_minutos: Math.round(totalTempo),
      numero_jornadas: countJornadas,
      ganho_medio_por_jornada: countJornadas > 0 ? Math.round(totalGanhoBruto / countJornadas) : 0,
      ganho_medio_por_km: totalKm > 0 ? Math.round(totalGanhoBruto / totalKm) : 0,
      velocidade_media_kmh: totalTempo > 0 ? Math.round((totalKm / totalTempo) * 60) : 0,
    };
  }

  /**
   * Calcula benchmarks de performance
   */
  private static async calculateBenchmarks(userId: string, vehicleId?: string) {
    // Exemplo: buscar média de todos os usuários ou de um grupo similar
    // Por simplicidade, vamos usar dados fictícios ou uma média global do usuário
    const conditions = [
      eq(jornadas.idUsuario, userId),
      isNull(jornadas.deletedAt),
    ];

    if (vehicleId) {
      conditions.push(eq(jornadas.idVeiculo, vehicleId));
    }

    const result = await db
      .select({
        avgGanhoBruto: avg(jornadas.ganho_bruto),
        avgKm: avg(jornadas.km_total),
        avgTempo: avg(jornadas.tempo_total),
      })
      .from(jornadas)
      .where(and(...conditions));

    const avgMetrics = result[0];

    return {
      media_ganho_bruto_jornada: Math.round(Number(avgMetrics.avgGanhoBruto) || 0),
      media_km_jornada: Math.round(Number(avgMetrics.avgKm) || 0),
      media_tempo_jornada_minutos: Math.round(Number(avgMetrics.avgTempo) || 0),
      // Adicionar benchmarks de consumo de combustível, despesas, etc.
    };
  }

  /**
   * Gera dados para gráficos
   */
  private static async generateChartData(financialSummary: any, dailyEvolution: any) {
    // Exemplo de dados para gráfico de linha (faturamento diário)
    const dailyRevenueChart = dailyEvolution ? dailyEvolution.map((day: any) => ({
      x: day.data,
      y: day.faturamentoBruto,
    })) : [];

    // Exemplo de dados para gráfico de pizza (despesas por categoria)
    const expenseCategoryChart = financialSummary.detalhamento_despesas ? financialSummary.detalhamento_despesas.map((exp: any) => ({
      label: exp.categoria,
      value: exp.total_gasto,
    })) : [];

    return {
      dailyRevenue: {
        type: 'line',
        title: 'Faturamento Diário',
        data: dailyRevenueChart,
        labels: dailyRevenueChart.map((d: any) => d.x),
      },
      expenseCategories: {
        type: 'pie',
        title: 'Despesas por Categoria',
        data: expenseCategoryChart,
        labels: expenseCategoryChart.map((d: any) => d.label),
      },
    };
  }

  /**
   * Gera relatório de auditoria de dados
   */
  static async generateDataAuditReport(userId: string) {
    const issues = [];

    // 1. Jornadas sem KM final ou com KM final menor que inicial
    const incompleteJourneys = await db
      .select()
      .from(jornadas)
      .where(and(
        eq(jornadas.idUsuario, userId),
        isNull(jornadas.deletedAt),
        ne(jornadas.dataFim, null), // Considerar apenas jornadas finalizadas
        sql`${jornadas.km_fim} < ${jornadas.km_inicio}`
      ));

    if (incompleteJourneys.length > 0) {
      issues.push({
        type: 'Jornada Incompleta/Inválida',
        description: 'Jornadas com KM final ausente ou menor que o KM inicial.',
        count: incompleteJourneys.length,
        details: incompleteJourneys.map(j => ({
          id: j.id,
          dataInicio: j.dataInicio,
          km_inicio: j.km_inicio,
          km_fim: j.km_fim,
        })),
      });
    }

    // 2. Abastecimentos com valor total inconsistente (valorLitro * quantidadeLitros)
    const inconsistentFuelings = await db
      .select()
      .from(abastecimentos)
      .where(and(
        eq(abastecimentos.idUsuario, userId),
        isNull(abastecimentos.deletedAt),
        sql`${abastecimentos.valorTotal} <> ${abastecimentos.valorLitro} * ${abastecimentos.quantidadeLitros}`
      ));

    if (inconsistentFuelings.length > 0) {
      issues.push({
        type: 'Abastecimento Inconsistente',
        description: 'Abastecimentos com valor total que não corresponde ao cálculo de preço por litro x quantidade.',
        count: inconsistentFuelings.length,
        details: inconsistentFuelings.map(f => ({
          id: f.id,
          dataAbastecimento: f.dataAbastecimento,
          valorTotal: f.valorTotal,
          valorLitro: f.valorLitro,
          quantidadeLitros: f.quantidadeLitros,
        })),
      });
    }

    // 3. Despesas sem categoria definida (se aplicável)
    // Exemplo: se tipoDespesa for opcional ou puder ser nulo
    const uncategorizedExpenses = await db
      .select()
      .from(despesas)
      .where(and(
        eq(despesas.idUsuario, userId),
        isNull(despesas.deletedAt),
        isNull(despesas.tipoDespesa) // Ou eq(despesas.tipoDespesa, 'outros') se for um default
      ));

    if (uncategorizedExpenses.length > 0) {
      issues.push({
        type: 'Despesa Não Categorizada',
        description: 'Despesas sem uma categoria definida.',
        count: uncategorizedExpenses.length,
        details: uncategorizedExpenses.map(e => ({
          id: e.id,
          dataDespesa: e.dataDespesa,
          valorDespesa: e.valorDespesa,
          descricao: e.descricao,
        })),
      });
    }

    // 4. Veículos sem jornadas ou abastecimentos registrados em um longo período
    // Esta é mais complexa e pode exigir uma análise de datas de último registro
    // Por exemplo, buscar veículos que não têm jornadas ou abastecimentos nos últimos 90 dias
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const inactiveVehicles = await db.execute(sql`
      SELECT v.id, v.marca, v.modelo
      FROM veiculos v
      WHERE v.idUsuario = ${userId}
        AND v.deletedAt IS NULL
        AND NOT EXISTS (
          SELECT 1 FROM jornadas j
          WHERE j.idVeiculo = v.id
            AND j.idUsuario = ${userId}
            AND j.deletedAt IS NULL
            AND j.dataInicio >= ${ninetyDaysAgo.toISOString()}
        )
        AND NOT EXISTS (
          SELECT 1 FROM abastecimentos a
          WHERE a.idVeiculo = v.id
            AND a.idUsuario = ${userId}
            AND a.deletedAt IS NULL
            AND a.dataAbastecimento >= ${ninetyDaysAgo.toISOString()}
        );
    `);

    if (inactiveVehicles.rows.length > 0) {
      issues.push({
        type: 'Veículo Inativo',
        description: 'Veículos sem registros de jornadas ou abastecimentos nos últimos 90 dias.',
        count: inactiveVehicles.rows.length,
        details: inactiveVehicles.rows.map((v: any) => ({
          id: v.id,
          marca: v.marca,
          modelo: v.modelo,
        })),
      });
    }

    return {
      userId,
      data_geracao: new Date().toISOString(),
      total_issues: issues.length,
      issues,
      recomendacoes: [
        'Revisar jornadas com KM inconsistente e corrigir os dados.',
        'Verificar cálculos de abastecimento e garantir a precisão dos valores.',
        'Categorizar todas as despesas para uma análise financeira mais precisa.',
        'Avaliar a necessidade de manter veículos inativos ou arquivá-los.',
      ],
    };
  }
}


