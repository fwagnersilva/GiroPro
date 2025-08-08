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
        data_inicio: dataInicio.toISOString(),
        data_fim: dataFim.toISOString(),
        descricao: DateUtils.formatPeriod(dataInicio, dataFim)
      },
      filtros: { id_veiculo: vehicleId || null },
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
        data_inicio: dataInicio.toISOString(),
        data_fim: dataFim.toISOString(),
        descricao: DateUtils.formatPeriod(dataInicio, dataFim)
      },
      filtros: { id_veiculo: vehicleId || null },
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
            data_inicio: startDate.toISOString(),
            data_fim: endDate.toISOString(),
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
            data_inicio: startDate.toISOString(),
            data_fim: endDate.toISOString(),
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
