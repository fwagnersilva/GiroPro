import { db } from '../db';
import { jornadas, abastecimentos, despesas } from '../db/schema';
import { eq, and, isNull, gte, lte, sum, count, desc, avg, sql, ne } from 'drizzle-orm';
import { DateUtils } from '../utils/dateUtils';
import { StatisticsCalculator } from '../utils/statisticsCalculator';
import { logger } from '../utils/logger';

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

interface InactiveVehicle {
  id: string;
  marca: string;
  modelo: string;
}

export class ReportsService {
  private static readonly loggerInstance = logger;

  /**
   * Gera relatório semanal otimizado
   */
  static async generateWeeklyReport(params: ReportParams) {
    const { userId, startDate, endDate, vehicleId, includeDetails = true, includeCharts = false } = params;
    
    const { dataInicio, dataFim } = DateUtils.calculateWeeklyPeriod(startDate, endDate);
    
    ReportsService.loggerInstance.info("Gerando relatório semanal", { 
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
        tipo: "semanal" as const,
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
    
    ReportsService.loggerInstance.info("Gerando relatório mensal", { 
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
        tipo: "mensal" as const,
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
            dataInicio: startDate,
            dataFim: endDate,
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
            dataInicio: startDate,
            dataFim: endDate,
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

    
    // Executa todas as consultas em paralelo
    const [
      revenueResult,
      fuelResult,
      expensesResult,
      kmResult,
      journeysResult
    ] = await Promise.all([
      db.select({ total: sum(jornadas.ganhoBruto) }).from(jornadas).where(and(eq(jornadas.idUsuario, userId), gte(jornadas.dataFim, startDate), lte(jornadas.dataFim, endDate), isNull(jornadas.deletedAt))).then(res => res[0]?.total || 0),
      db.select({ total: sum(abastecimentos.valorTotal) }).from(abastecimentos).where(and(eq(abastecimentos.idUsuario, userId), gte(abastecimentos.dataAbastecimento, startDate), lte(abastecimentos.dataAbastecimento, endDate), isNull(abastecimentos.deletedAt))).then(res => res[0]?.total || 0),
      db.select({ total: sum(despesas.valorDespesa) }).from(despesas).where(and(eq(despesas.idUsuario, userId), gte(despesas.dataDespesa, startDate), lte(despesas.dataDespesa, endDate), isNull(despesas.deletedAt))).then(res => res[0]?.total || 0),
      db.select({ total: sum(jornadas.kmTotal) }).from(jornadas).where(and(eq(jornadas.idUsuario, userId), gte(jornadas.dataFim, startDate), lte(jornadas.dataFim, endDate), isNull(jornadas.deletedAt))).then(res => res[0]?.total || 0),
      db.select({ count: count(jornadas.id) }).from(jornadas).where(and(eq(jornadas.idUsuario, userId), gte(jornadas.dataFim, startDate), lte(jornadas.dataFim, endDate), isNull(jornadas.deletedAt))).then(res => res[0]?.count || 0)
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
              data: day.toISOString().split("T")[0],
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
          dataInicio: week.startDate,
          dataFim: week.endDate,
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
      gte(despesas.dataDespesa, startDate),
      lte(despesas.dataDespesa, endDate),
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
  static async getTopJourneys(
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
      conditions.push(gte(jornadas.dataInicio, startDate));
    }
    if (endDate) {
      conditions.push(lte(jornadas.dataInicio, endDate));
    }

    const topJourneys = await db
      .select({
        id: jornadas.id,
        dataInicio: jornadas.dataInicio,
        ganhoBruto: jornadas.ganhoBruto,
        kmTotal: jornadas.kmTotal,
        observacoes: jornadas.observacoes,
      })
      .from(jornadas)
      .where(and(...conditions))
      .orderBy(desc(jornadas.ganhoBruto))
      .limit(limit);

    return topJourneys.map(j => ({
      ...j,
      ganhoBruto: Math.round(Number(j.ganhoBruto) || 0),
      kmTotal: Math.round(Number(j.kmTotal) || 0),
    }));
  }

  /**
   * Métricas de performance de jornadas
   */
  static async getPerformanceMetrics(
    userId: string,
    startDate: Date,
    endDate: Date,
    vehicleId?: string
  ) {
    const conditions = [
      eq(jornadas.idUsuario, userId),
      gte(jornadas.dataInicio, startDate),
      lte(jornadas.dataInicio, endDate),
      isNull(jornadas.deletedAt),
    ];

    if (vehicleId) {
      conditions.push(eq(jornadas.idVeiculo, vehicleId));
    }

    const result = await db
      .select({
        totalGanhoBruto: sum(jornadas.ganhoBruto),
        totalKm: sum(jornadas.kmTotal),
        totalTempo: sum(jornadas.tempoTotal),
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
      total_ganhoBruto: Math.round(totalGanhoBruto),
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
        avgGanhoBruto: avg(jornadas.ganhoBruto),
        avgKm: avg(jornadas.kmTotal),
        avgTempo: avg(jornadas.tempoTotal),
      })
      .from(jornadas)
      .where(and(...conditions));

    const avgMetrics = result[0];

    return {
      media_ganhoBruto_jornada: Math.round(Number(avgMetrics.avgGanhoBruto) || 0),
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
      data: day.data,
      faturamento: day.faturamento_bruto,
    })) : [];

    // Exemplo de dados para gráfico de pizza (despesas por categoria)
    const expenseCategoryChart = financialSummary.detalhamento_despesas || [];

    return {
      dailyRevenue: dailyRevenueChart,
      expenseCategories: expenseCategoryChart,
    };
  }

  /**
   * Validações de dados e consistência para relatórios.
   */
  static async validateReportData(userId: string, vehicleId?: string) {
    const issues = [];

    // 1. Jornadas incompletas (km_fim ou dataFim ausentes)
    const incompleteJourneys = await db
      .select({
        id: jornadas.id,
        dataInicio: jornadas.dataInicio,
        kmInicio: jornadas.kmInicio,
        dataFim: jornadas.dataFim,
        kmFim: jornadas.kmFim,
      })
      .from(jornadas)
      .where(and(
        eq(jornadas.idUsuario, userId),
        isNull(jornadas.deletedAt),
        (isNull(jornadas.dataFim) || isNull(jornadas.kmFim) || sql`${jornadas.kmFim} < ${jornadas.kmInicio}`)
      ));

    if (incompleteJourneys.length > 0) {
      issues.push({
        type: "Jornada Incompleta/Inválida",
        description: "Jornadas com KM final ausente ou menor que o KM inicial.",
        count: incompleteJourneys.length,
        details: incompleteJourneys.map(j => ({
          id: j.id,
          dataInicio: j.dataInicio,
          kmInicio: j.kmInicio,
          kmFim: j.kmFim,
        })),
      });
    }

    // 2. Abastecimentos com valor total inconsistente (valorLitro * quantidadeLitros)
    const inconsistentFuelings = await db
      .select({
        id: abastecimentos.id,
        dataAbastecimento: abastecimentos.dataAbastecimento,
        valorLitro: abastecimentos.valorLitro,
        quantidadeLitros: abastecimentos.quantidadeLitros,
        valorTotal: abastecimentos.valorTotal,
      })
      .from(abastecimentos)
      .where(and(
        eq(abastecimentos.idUsuario, userId),
        isNull(abastecimentos.deletedAt),
        sql`${abastecimentos.valorTotal} <> ${abastecimentos.valorLitro} * ${abastecimentos.quantidadeLitros}`
      ));

    if (inconsistentFuelings.length > 0) {
      issues.push({
        type: "Abastecimento Inconsistente",
        description: "Abastecimentos com valor total diferente do calculado (valorLitro * quantidadeLitros).",
        count: inconsistentFuelings.length,
        details: inconsistentFuelings.map(a => ({
          id: a.id,
          data: a.dataAbastecimento,
          valorCalculado: (Number(a.valorLitro) * Number(a.quantidadeLitros)).toFixed(2),
          valorRegistrado: Number(a.valorTotal).toFixed(2),
        })),
      });
    }

    // 3. Despesas sem tipo definido (se aplicável)
    const undefinedExpenses = await db
      .select({
        id: despesas.id,
        dataDespesa: despesas.dataDespesa,
        valorDespesa: despesas.valorDespesa,
        tipoDespesa: despesas.tipoDespesa,
      })
      .from(despesas)
      .where(and(
        eq(despesas.idUsuario, userId),
        isNull(despesas.deletedAt),
        isNull(despesas.tipoDespesa) // Ou eq(despesas.tipoDespesa, "outros") se for um default
      ));

    if (undefinedExpenses.length > 0) {
      issues.push({
        type: "Despesa sem Tipo",
        description: "Despesas registradas sem um tipo definido.",
        count: undefinedExpenses.length,
        details: undefinedExpenses.map(d => ({
          id: d.id,
          data: d.dataDespesa,
          valor: Number(d.valorDespesa).toFixed(2),
        })),
      });
    }

    // 4. Veículos inativos sem jornadas ou abastecimentos recentes
    // Esta é uma heurística e pode precisar de ajuste fino
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const inactiveVehicles: InactiveVehicle[] = await db.all(sql`
      SELECT v.id, v.marca, v.modelo
      FROM veiculos v
      WHERE v.idUsuario = ${userId}
      AND v.deletedAt IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM jornadas j
        WHERE j.idVeiculo = v.id
        AND j.deletedAt IS NULL
        AND j.dataFim >= ${Math.floor(ninetyDaysAgo.getTime() / 1000)}
      )
      AND NOT EXISTS (
        SELECT 1 FROM abastecimentos a
        WHERE a.idVeiculo = v.id
        AND a.deletedAt IS NULL
        AND a.dataAbastecimento >= ${Math.floor(ninetyDaysAgo.getTime() / 1000)}
      )
    `);

    if (inactiveVehicles.length > 0) {
      issues.push({
        type: "Veículo Inativo",
        description: "Veículos sem jornadas ou abastecimentos registrados nos últimos 90 dias.",
        count: inactiveVehicles.length,
        details: inactiveVehicles.map(v => ({
          id: v.id,
          marca: v.marca,
          modelo: v.modelo,
        })),
      });
    }

    return issues;
  }

  /**
   * Exporta dados para formato específico
   */
  static async exportToFormat(data: any, format: string): Promise<any> {
    ReportsService.loggerInstance.info("Exportando dados", { format });
    
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        // Implementação básica de CSV
        if (Array.isArray(data)) {
          const headers = Object.keys(data[0] || {});
          const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => row[header] || '').join(','))
          ].join('\n');
          return csvContent;
        }
        return JSON.stringify(data);
      case 'xlsx':
        // Para implementação futura com biblioteca específica
        ReportsService.loggerInstance.warn("Formato XLSX não implementado, retornando JSON");
        return JSON.stringify(data, null, 2);
      case 'pdf':
        // Para implementação futura com biblioteca específica
        ReportsService.loggerInstance.warn("Formato PDF não implementado, retornando JSON");
        return JSON.stringify(data, null, 2);
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  /**
   * Obtém status de exportação em lote
   */
  static async getBatchExportStatus(batchId: string): Promise<any> {
    ReportsService.loggerInstance.info("Obtendo status de exportação em lote", { batchId });
    
    // Implementação básica - em produção seria conectado a um sistema de filas
    return {
      batchId,
      status: 'completed',
      progress: 100,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      totalItems: 1,
      processedItems: 1,
      errors: []
    };
  }

  /**
   * Cria um job de exportação em lote
   */
  static async createBatchExportJob(params: any): Promise<string> {
    const jobId = crypto.randomUUID();
    ReportsService.loggerInstance.info("Criando job de exportação em lote", { jobId, params });
    
    // Implementação básica - em produção seria conectado a um sistema de filas
    return jobId;
  }
}  /**
   * Gera dados para gráficos
   *}


