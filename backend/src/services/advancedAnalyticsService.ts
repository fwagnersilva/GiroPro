import { db } from '../db/connection';
import { veiculos, jornadas, abastecimentos, despesas } from '../db/schema.postgres';
import { eq, and, sql, desc, asc, isNull, gte, lte, sum, avg, count } from 'drizzle-orm';

// Preços médios de combustível (em centavos)
const FUEL_PRICES = {
  gasolina: 550, // R$ 5,50
  etanol: 400,   // R$ 4,00
  diesel: 520,   // R$ 5,20
  gnv: 350,      // R$ 3,50
  flex: 550      // R$ 5,50 (padrão gasolina)
};

export class AdvancedAnalyticsService {
  /**
   * Calcular métricas de eficiência operacional
   */
  static async calculateOperationalEfficiency(
    userId: string,
    vehicleId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const thirtyDaysAgo = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const today = endDate || new Date();

    // Filtros base
    let vehicleFilter = and(
      eq(veiculos.idUsuario, userId),
      isNull(veiculos.deletedAt)
    );

    if (vehicleId) {
      vehicleFilter = and(vehicleFilter, eq(veiculos.id, vehicleId));
    }

    // Buscar veículos
    const vehicles = await db.select().from(veiculos).where(vehicleFilter);

    const efficiencyMetrics = [];

    for (const vehicle of vehicles) {
      // Métricas de jornadas
      const journeyMetrics = await db
        .select({
          totalJornadas: count(jornadas.id),
          totalFaturamento: sum(jornadas.ganhoBruto),
          totalKm: sum(jornadas.kmTotal),
          totalTempo: sum(jornadas.tempoTotal),
          mediaGanho: avg(jornadas.ganhoBruto),
          mediaKm: avg(jornadas.kmTotal),
          mediaTempo: avg(jornadas.tempoTotal),
        })
        .from(jornadas)
        .where(
          and(
            eq(jornadas.idVeiculo, vehicle.id),
            eq(jornadas.idUsuario, userId),
            gte(jornadas.dataInicio, thirtyDaysAgo),
            lte(jornadas.dataInicio, today),
            isNull(jornadas.deletedAt)
          )
        );

      // Métricas de combustível
      const fuelMetrics = await db
        .select({
          totalAbastecimentos: count(abastecimentos.id),
          totalLitros: sum(abastecimentos.litros),
          totalGastoCombustivel: sum(abastecimentos.valorTotal),
          mediaValorLitro: avg(abastecimentos.valorLitro),
        })
        .from(abastecimentos)
        .where(
          and(
            eq(abastecimentos.idVeiculo, vehicle.id),
            eq(abastecimentos.idUsuario, userId),
            gte(abastecimentos.dataAbastecimento, thirtyDaysAgo),
            lte(abastecimentos.dataAbastecimento, today),
            isNull(abastecimentos.deletedAt)
          )
        );

      // Métricas de despesas
      const expenseMetrics = await db
        .select({
          totalDespesas: count(despesas.id),
          totalValorDespesas: sum(despesas.valorDespesa),
          mediaDespesa: avg(despesas.valorDespesa),
        })
        .from(despesas)
        .where(
          and(
            eq(despesas.idVeiculo, vehicle.id),
            eq(despesas.idUsuario, userId),
            gte(despesas.dataDespesa, thirtyDaysAgo),
            lte(despesas.dataDespesa, today),
            isNull(despesas.deletedAt)
          )
        );

      const journey = journeyMetrics[0];
      const fuel = fuelMetrics[0];
      const expense = expenseMetrics[0];

      // Calcular métricas derivadas
      const totalFaturamento = Number(journey.totalFaturamento) || 0;
      const totalKm = Number(journey.totalKm) || 0;
      const totalTempo = Number(journey.totalTempo) || 0;
      const totalLitros = Number(fuel.totalLitros) || 0;
      const totalGastoCombustivel = Number(fuel.totalGastoCombustivel) || 0;
      const totalDespesas = Number(expense.totalValorDespesas) || 0;

      // Eficiência operacional
      const consumoMedio = totalKm > 0 && totalLitros > 0 ? totalKm / totalLitros : 0;
      const ganhoPorKm = totalKm > 0 ? totalFaturamento / totalKm : 0;
      const ganhoPorHora = totalTempo > 0 ? (totalFaturamento / totalTempo) * 60 : 0;
      const custoPorKm = totalKm > 0 ? (totalGastoCombustivel + totalDespesas) / totalKm : 0;
      const lucroLiquido = totalFaturamento - totalGastoCombustivel - totalDespesas;
      const margemLucro = totalFaturamento > 0 ? (lucroLiquido / totalFaturamento) * 100 : 0;
      const eficienciaEnergetica = totalLitros > 0 ? totalFaturamento / totalLitros : 0;

      // Classificações
      let classificacaoEficiencia = 'Baixa';
      if (ganhoPorKm >= 100) classificacaoEficiencia = 'Alta';
      else if (ganhoPorKm >= 50) classificacaoEficiencia = 'Média';

      let classificacaoConsumo = 'Ruim';
      if (consumoMedio >= 12) classificacaoConsumo = 'Excelente';
      else if (consumoMedio >= 10) classificacaoConsumo = 'Bom';
      else if (consumoMedio >= 8) classificacaoConsumo = 'Regular';

      efficiencyMetrics.push({
        veiculo: {
          id: vehicle.id,
          marca: vehicle.marca,
          modelo: vehicle.modelo,
          placa: vehicle.placa,
          tipoCombustivel: vehicle.tipoCombustivel,
        },
        metricasOperacionais: {
          totalJornadas: Number(journey.totalJornadas) || 0,
          totalKm: totalKm,
          totalTempoHoras: Math.round((totalTempo / 60) * 100) / 100,
          totalAbastecimentos: Number(fuel.totalAbastecimentos) || 0,
          totalDespesas: Number(expense.totalDespesas) || 0,
        },
        metricasFinanceiras: {
          faturamentoTotal: totalFaturamento,
          gastoCombustivel: totalGastoCombustivel,
          outrasDespesas: totalDespesas,
          lucroLiquido: lucroLiquido,
          margemLucro: Math.round(margemLucro * 100) / 100,
        },
        metricasEficiencia: {
          consumoMedio: Math.round(consumoMedio * 100) / 100,
          ganhoPorKm: Math.round(ganhoPorKm),
          ganhoPorHora: Math.round(ganhoPorHora),
          custoPorKm: Math.round(custoPorKm),
          eficienciaEnergetica: Math.round(eficienciaEnergetica),
          classificacaoEficiencia: classificacaoEficiencia,
          classificacaoConsumo: classificacaoConsumo,
        },
        indicadoresPerformance: {
          jornadasPorDia: totalKm > 0 ? Math.round((Number(journey.totalJornadas) / 30) * 100) / 100 : 0,
          kmPorDia: Math.round((totalKm / 30) * 100) / 100,
          faturamentoPorDia: Math.round((totalFaturamento / 30)),
          tempoMedioJornada: Number(journey.totalJornadas) > 0 ? Math.round((totalTempo / Number(journey.totalJornadas))) : 0,
        }
      });
    }

    return efficiencyMetrics;
  }

  /**
   * Análise de tendências temporais
   */
  static async analyzeTrends(
    userId: string,
    vehicleId?: string,
    days: number = 90
  ) {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    // Filtros
    let vehicleFilter = and(
      eq(veiculos.idUsuario, userId),
      isNull(veiculos.deletedAt)
    );

    if (vehicleId) {
      vehicleFilter = and(vehicleFilter, eq(veiculos.id, vehicleId));
    }

    // Análise semanal
    const weeklyTrends = await db
      .select({
        semana: sql<string>`strftime('%Y-%W', ${jornadas.dataInicio} / 1000, 'unixepoch')`,
        totalFaturamento: sum(jornadas.ganhoBruto),
        totalKm: sum(jornadas.kmTotal),
        numeroJornadas: count(jornadas.id),
        tempoTotal: sum(jornadas.tempoTotal),
      })
      .from(jornadas)
      .innerJoin(veiculos, eq(jornadas.idVeiculo, veiculos.id))
      .where(
        and(
          vehicleFilter,
          gte(jornadas.dataInicio, startDate),
          lte(jornadas.dataInicio, endDate),
          isNull(jornadas.deletedAt)
        )
      )
      .groupBy(sql`DATE_TRUNC('week', ${jornadas.dataInicio})`)
      .orderBy(sql`DATE_TRUNC('week', ${jornadas.dataInicio})`);

    // Análise mensal
    const monthlyTrends = await db
      .select({
        mes: sql<string>`strftime("%Y-%m", ${jornadas.dataInicio} / 1000, "unixepoch")`,
        totalFaturamento: sum(jornadas.ganhoBruto),
        totalKm: sum(jornadas.kmTotal),
        numeroJornadas: count(jornadas.id),
        tempoTotal: sum(jornadas.tempoTotal),
      })
      .from(jornadas)
      .innerJoin(veiculos, eq(jornadas.idVeiculo, veiculos.id))
      .where(
        and(
          vehicleFilter,
          gte(jornadas.dataInicio, startDate),
          lte(jornadas.dataInicio, endDate),
          isNull(jornadas.deletedAt)
        )
      )
      .groupBy(sql`DATE_TRUNC('month', ${jornadas.dataInicio})`)
      .orderBy(sql`DATE_TRUNC('month', ${jornadas.dataInicio})`);

    // Calcular tendências
    const calculateTrend = (data: any[], valueField: string) => {
      if (data.length < 2) return { tendencia: 'Estável', variacao: 0 };

      const values = data.map(item => Number(item[valueField]) || 0);
      const first = values[0];
      const last = values[values.length - 1];
      
      if (first === 0) return { tendencia: 'Estável', variacao: 0 };
      
      const variacao = ((last - first) / first) * 100;
      
      let tendencia = 'Estável';
      if (variacao > 5) tendencia = 'Crescente';
      else if (variacao < -5) tendencia = 'Decrescente';
      
      return { tendencia, variacao: Math.round(variacao * 100) / 100 };
    };

    return {
      tendenciasSemanais: {
        dados: weeklyTrends.map(week => ({
          periodo: week.semana,
          faturamento: Number(week.totalFaturamento) || 0,
          km: Number(week.totalKm) || 0,
          jornadas: Number(week.numeroJornadas) || 0,
          tempoHoras: Math.round((Number(week.tempoTotal) / 60) * 100) / 100,
        })),
        analiseFaturamento: calculateTrend(weeklyTrends, 'totalFaturamento'),
        analiseKm: calculateTrend(weeklyTrends, 'totalKm'),
        analiseJornadas: calculateTrend(weeklyTrends, 'numeroJornadas'),
      },
      tendenciasMensais: {
        dados: monthlyTrends.map(month => ({
          periodo: month.mes,
          faturamento: Number(month.totalFaturamento) || 0,
          km: Number(month.totalKm) || 0,
          jornadas: Number(month.numeroJornadas) || 0,
          tempoHoras: Math.round((Number(month.tempoTotal) / 60) * 100) / 100,
        })),
        analiseFaturamento: calculateTrend(monthlyTrends, 'totalFaturamento'),
        analiseKm: calculateTrend(monthlyTrends, 'totalKm'),
        analiseJornadas: calculateTrend(monthlyTrends, 'numeroJornadas'),
      },
      periodoAnalise: {
        dataInicio: startDate.toISOString(),
        dataFim: endDate.toISOString(),
        totalDias: days,
      }
    };
  }

  /**
   * Análise de sazonalidade
   */
  static async analyzeSeasonality(
    userId: string,
    vehicleId?: string
  ) {
    // Filtros
    let vehicleFilter = and(
      eq(veiculos.idUsuario, userId),
      isNull(veiculos.deletedAt)
    );

    if (vehicleId) {
      vehicleFilter = and(vehicleFilter, eq(veiculos.id, vehicleId));
    }

    // Análise por dia da semana
    const dayOfWeekAnalysis = await db
      .select({
        diaSemana: sql<number>`strftime("%w", ${jornadas.dataInicio} / 1000, "unixepoch")`,
        totalFaturamento: sum(jornadas.ganhoBruto),
        totalKm: sum(jornadas.kmTotal),
        numeroJornadas: count(jornadas.id),
        tempoTotal: sum(jornadas.tempoTotal),
      })
      .from(jornadas)
      .innerJoin(veiculos, eq(jornadas.idVeiculo, veiculos.id))
      .where(
        and(
          vehicleFilter,
          isNull(jornadas.deletedAt)
        )
      )
      .groupBy(sql`EXTRACT(DOW FROM ${jornadas.dataInicio})`)
      .orderBy(sql`EXTRACT(DOW FROM ${jornadas.dataInicio})`);

    // Análise por hora do dia
    const hourAnalysis = await db
      .select({
        hora: sql<number>`strftime("%H", ${jornadas.dataInicio} / 1000, "unixepoch")`,
        totalFaturamento: sum(jornadas.ganhoBruto),
        totalKm: sum(jornadas.kmTotal),
        numeroJornadas: count(jornadas.id),
        tempoTotal: sum(jornadas.tempoTotal),
      })
      .from(jornadas)
      .innerJoin(veiculos, eq(jornadas.idVeiculo, veiculos.id))
      .where(
        and(
          vehicleFilter,
          isNull(jornadas.deletedAt)
        )
      )
      .groupBy(sql`EXTRACT(HOUR FROM ${jornadas.dataInicio})`)
      .orderBy(sql`EXTRACT(HOUR FROM ${jornadas.dataInicio})`);

    // Análise por mês
    const monthAnalysis = await db
      .select({
        mes: sql<number>`strftime("%m", ${jornadas.dataInicio} / 1000, "unixepoch")`,
        totalFaturamento: sum(jornadas.ganhoBruto),
        totalKm: sum(jornadas.kmTotal),
        numeroJornadas: count(jornadas.id),
        tempoTotal: sum(jornadas.tempoTotal),
      })
      .from(jornadas)
      .innerJoin(veiculos, eq(jornadas.idVeiculo, veiculos.id))
      .where(
        and(
          vehicleFilter,
          isNull(jornadas.deletedAt)
        )
      )
      .groupBy(sql`EXTRACT(MONTH FROM ${jornadas.dataInicio})`)
      .orderBy(sql`EXTRACT(MONTH FROM ${jornadas.dataInicio})`);

    const getDayName = (dayNum: number) => {
      const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      return days[dayNum] || 'Desconhecido';
    };

    const getMonthName = (monthNum: number) => {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return months[monthNum - 1] || 'Desconhecido';
    };

    // Identificar padrões
    const bestDayOfWeek = dayOfWeekAnalysis.reduce((best, current) => 
      (Number(current.totalFaturamento) || 0) > (Number(best.totalFaturamento) || 0) ? current : best
    );

    const bestHour = hourAnalysis.reduce((best, current) => 
      (Number(current.totalFaturamento) || 0) > (Number(best.totalFaturamento) || 0) ? current : best
    );

    const bestMonth = monthAnalysis.reduce((best, current) => 
      (Number(current.totalFaturamento) || 0) > (Number(best.totalFaturamento) || 0) ? current : best
    );

    return {
      analiseDiaSemana: dayOfWeekAnalysis.map(day => ({
        diaSemana: getDayName(day.diaSemana),
        diaNumero: day.diaSemana,
        faturamentoTotal: Number(day.totalFaturamento) || 0,
        kmTotal: Number(day.totalKm) || 0,
        numeroJornadas: Number(day.numeroJornadas) || 0,
        faturamentoMedio: Number(day.numeroJornadas) > 0 ? Math.round((Number(day.totalFaturamento) || 0) / Number(day.numeroJornadas)) : 0,
      })),
      analiseHorario: hourAnalysis.map(hour => ({
        hora: hour.hora,
        faturamentoTotal: Number(hour.totalFaturamento) || 0,
        kmTotal: Number(hour.totalKm) || 0,
        numeroJornadas: Number(hour.numeroJornadas) || 0,
        faturamentoMedio: Number(hour.numeroJornadas) > 0 ? Math.round((Number(hour.totalFaturamento) || 0) / Number(hour.numeroJornadas)) : 0,
      })),
      analiseMensal: monthAnalysis.map(month => ({
        mes: getMonthName(month.mes),
        mesNumero: month.mes,
        faturamentoTotal: Number(month.totalFaturamento) || 0,
        kmTotal: Number(month.totalKm) || 0,
        numeroJornadas: Number(month.numeroJornadas) || 0,
        faturamentoMedio: Number(month.numeroJornadas) > 0 ? Math.round((Number(month.totalFaturamento) || 0) / Number(month.numeroJornadas)) : 0,
      })),
      padroesIdentificados: {
        melhorDiaSemana: {
          dia: getDayName(bestDayOfWeek.diaSemana),
          faturamentoTotal: Number(bestDayOfWeek.totalFaturamento) || 0,
          numeroJornadas: Number(bestDayOfWeek.numeroJornadas) || 0,
        },
        melhorHorario: {
          hora: bestHour.hora,
          faturamentoTotal: Number(bestHour.totalFaturamento) || 0,
          numeroJornadas: Number(bestHour.numeroJornadas) || 0,
        },
        melhorMes: {
          mes: getMonthName(bestMonth.mes),
          faturamentoTotal: Number(bestMonth.totalFaturamento) || 0,
          numeroJornadas: Number(bestMonth.numeroJornadas) || 0,
        },
      }
    };
  }

  /**
   * Análise de custos detalhada
   */
  static async analyzeCosts(
    userId: string,
    vehicleId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const thirtyDaysAgo = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const today = endDate || new Date();

    // Filtros
    let vehicleFilter = and(
      eq(veiculos.idUsuario, userId),
      isNull(veiculos.deletedAt)
    );

    if (vehicleId) {
      vehicleFilter = and(vehicleFilter, eq(veiculos.id, vehicleId));
    }

    const costAnalysis = await db
      .select({
        tipoDespesa: despesas.tipoDespesa,
        totalValor: sum(despesas.valorDespesa),
        quantidade: count(despesas.id),
      })
      .from(despesas)
      .innerJoin(veiculos, eq(despesas.idVeiculo, veiculos.id))
      .where(
        and(
          vehicleFilter,
          gte(despesas.dataDespesa, thirtyDaysAgo),
          lte(despesas.dataDespesa, today),
          isNull(despesas.deletedAt)
        )
      )
      .groupBy(despesas.tipoDespesa);

    const totalGasto = costAnalysis.reduce((sum, item) => sum + (Number(item.totalValor) || 0), 0);

    return {
      custosPorCategoria: costAnalysis.map(item => ({
        categoria: item.tipoDespesa,
        totalGasto: Number(item.totalValor) || 0,
        quantidade: Number(item.quantidade) || 0,
        percentual: totalGasto > 0 ? Math.round(((Number(item.totalValor) || 0) / totalGasto) * 10000) / 100 : 0,
      })),
      totalGasto,
    };
  }

  /**
   * Análise de rentabilidade por jornada
   */
  static async analyzeJourneyProfitability(
    userId: string,
    vehicleId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const thirtyDaysAgo = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const today = endDate || new Date();

    // Filtros
    let journeyFilter = and(
      eq(jornadas.idUsuario, userId),
      isNull(jornadas.deletedAt),
      gte(jornadas.dataInicio, thirtyDaysAgo),
      lte(jornadas.dataInicio, today),
    );

    if (vehicleId) {
      journeyFilter = and(journeyFilter, eq(jornadas.idVeiculo, vehicleId));
    }

    const journeysData = await db
      .select({
        id: jornadas.id,
        ganhoBruto: jornadas.ganhoBruto,
        kmTotal: jornadas.kmTotal,
        dataInicio: jornadas.dataInicio,
        idVeiculo: jornadas.idVeiculo,
      })
      .from(jornadas)
      .where(journeyFilter);

    const profitabilityMetrics = [];

    for (const journey of journeysData) {
      // Estimativa de custo de combustível (simplificada, idealmente viria de abastecimentos)
      const veiculoInfo = await db.select().from(veiculos).where(eq(veiculos.id, journey.idVeiculo)).limit(1);
      const tipoCombustivel = veiculoInfo[0]?.tipoCombustivel || 'Gasolina'; // Default
      const precoLitro = FUEL_PRICES[tipoCombustivel] || 0;
      const consumoEstimadoLitros = (Number(journey.kmTotal) || 0) / 12; // Assumindo 12 km/l
      const custoCombustivelEstimado = consumoEstimadoLitros * precoLitro;

      // Outras despesas relacionadas à jornada (simplificado, idealmente buscaria despesas por período da jornada)
      const outrasDespesas = await db
        .select({ total: sum(despesas.valorDespesa) })
        .from(despesas)
        .where(
          and(
            eq(despesas.idVeiculo, journey.idVeiculo),
            gte(despesas.dataDespesa, journey.dataInicio),
            lte(despesas.dataDespesa, new Date(journey.dataInicio.getTime() + (journey.kmTotal || 0) * 1000 * 60 * 60 / 60)), // Estimativa de duração
            isNull(despesas.deletedAt)
          )
        );
      const totalOutrasDespesas = Number(outrasDespesas[0]?.total) || 0;

      const lucroLiquido = (Number(journey.ganhoBruto) || 0) - custoCombustivelEstimado - totalOutrasDespesas;
      const margemLucro = (Number(journey.ganhoBruto) || 0) > 0 ? (lucroLiquido / (Number(journey.ganhoBruto) || 0)) * 100 : 0;

      profitabilityMetrics.push({
        idJornada: journey.id,
        dataInicio: new Date(journey.dataInicio).toISOString(),
        ganhoBruto: Number(journey.ganhoBruto) || 0,
        kmTotal: Number(journey.kmTotal) || 0,
        custoCombustivelEstimado: Math.round(custoCombustivelEstimado),
        outrasDespesas: totalOutrasDespesas,
        lucroLiquido: Math.round(lucroLiquido),
        margemLucro: Math.round(margemLucro * 100) / 100,
      });
    }

    return profitabilityMetrics;
  }

  /**
   * Previsão de faturamento (simplificada)
   */
  static async predictRevenue(
    userId: string,
    vehicleId?: string,
    daysToPredict: number = 30
  ) {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    let journeyFilter = and(
      eq(jornadas.idUsuario, userId),
      isNull(jornadas.deletedAt),
      gte(jornadas.dataInicio, thirtyDaysAgo),
      lte(jornadas.dataInicio, today),
    );

    if (vehicleId) {
      journeyFilter = and(journeyFilter, eq(jornadas.idVeiculo, vehicleId));
    }

    const recentJourneys = await db
      .select({
        ganhoBruto: jornadas.ganhoBruto,
      })
      .from(jornadas)
      .where(journeyFilter);

    const totalGanhoBrutoRecente = recentJourneys.reduce((sum, j) => sum + (Number(j.ganhoBruto) || 0), 0);
    const mediaDiaria = recentJourneys.length > 0 ? totalGanhoBrutoRecente / 30 : 0;

    const predictedRevenue = mediaDiaria * daysToPredict;

    return {
      mediaDiariaRecente: Math.round(mediaDiaria),
      diasPrevistos: daysToPredict,
      faturamentoPrevisto: Math.round(predictedRevenue),
    };
  }

  /**
   * Gerar insights e recomendações baseados nos dados fornecidos
   */
  static generateInsights(
    efficiencyMetrics: any,
    trends: any,
    seasonality: any,
    costs: any
  ) {
    const insights = [];
    const recommendations = [];

    // Análise de eficiência
    if (efficiencyMetrics && efficiencyMetrics.length > 0) {
      const avgEfficiency = efficiencyMetrics.reduce((sum: number, metric: any) => 
        sum + (metric.eficienciaOperacional || 0), 0) / efficiencyMetrics.length;
      
      if (avgEfficiency < 70) {
        insights.push({
          type: 'warning',
          title: 'Eficiência Operacional Baixa',
          description: `Sua eficiência operacional média está em ${avgEfficiency.toFixed(1)}%`
        });
        recommendations.push({
          priority: 'high',
          action: 'Revisar rotas e horários para otimizar a eficiência operacional'
        });
      }
    }

    // Análise de tendências
    if (trends && trends.faturamento) {
      if (trends.faturamento.tendencia === 'decrescente') {
        insights.push({
          type: 'alert',
          title: 'Tendência de Queda no Faturamento',
          description: 'Faturamento apresenta tendência de queda nos últimos períodos'
        });
        recommendations.push({
          priority: 'high',
          action: 'Implementar estratégias para aumentar o faturamento'
        });
      }
    }

    // Análise de custos
    if (costs && costs.custoTotal) {
      const margem = ((costs.faturamentoTotal - costs.custoTotal) / costs.faturamentoTotal) * 100;
      if (margem < 20) {
        insights.push({
          type: 'warning',
          title: 'Margem de Lucro Baixa',
          description: `Margem de lucro atual: ${margem.toFixed(1)}%`
        });
        recommendations.push({
          priority: 'medium',
          action: 'Revisar custos operacionais para melhorar a margem de lucro'
        });
      }
    }

    return {
      insights,
      recommendations,
      summary: {
        totalInsights: insights.length,
        highPriorityRecommendations: recommendations.filter(r => r.priority === 'high').length
      }
    };
  }
}


