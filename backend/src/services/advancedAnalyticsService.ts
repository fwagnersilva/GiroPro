import { db } from '../db';
import { veiculos, jornadas, abastecimentos, despesas } from '../db/schema';
import { eq, and, sql, desc, asc, isNull, gte, lte, sum, avg, count } from 'drizzle-orm';

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
          total_jornadas: count(jornadas.id),
          total_faturamento: sum(jornadas.ganho_bruto),
          total_km: sum(jornadas.km_total),
          total_tempo: sum(jornadas.tempo_total),
          media_ganho: avg(jornadas.ganho_bruto),
          media_km: avg(jornadas.km_total),
          media_tempo: avg(jornadas.tempo_total),
        })
        .from(jornadas)
        .where(
          and(
            eq(jornadas.idVeiculo, vehicle.id),
            eq(jornadas.idUsuario, userId),
            gte(jornadas.dataInicio, thirtyDaysAgo.toISOString()),
            lte(jornadas.dataInicio, today.toISOString()),
            isNull(jornadas.deletedAt)
          )
        );

      // Métricas de combustível
      const fuelMetrics = await db
        .select({
          total_abastecimentos: count(abastecimentos.id),
          total_litros: sum(abastecimentos.quantidadeLitros),
          total_gasto_combustivel: sum(abastecimentos.valorTotal),
          media_valorLitro: avg(abastecimentos.valorLitro),
        })
        .from(abastecimentos)
        .where(
          and(
            eq(abastecimentos.idVeiculo, vehicle.id),
            eq(abastecimentos.idUsuario, userId),
            gte(abastecimentos.dataAbastecimento, thirtyDaysAgo.toISOString()),
            lte(abastecimentos.dataAbastecimento, today.toISOString()),
            isNull(abastecimentos.deletedAt)
          )
        );

      // Métricas de despesas
      const expenseMetrics = await db
        .select({
          total_despesas: count(despesas.id),
          total_valorDespesas: sum(despesas.valorDespesa),
          media_despesa: avg(despesas.valorDespesa),
        })
        .from(despesas)
        .where(
          and(
            eq(despesas.idVeiculo, vehicle.id),
            eq(despesas.idUsuario, userId),
            gte(despesas.dataDespesa, thirtyDaysAgo.toISOString()),
            lte(despesas.dataDespesa, today.toISOString()),
            isNull(despesas.deletedAt)
          )
        );

      const journey = journeyMetrics[0];
      const fuel = fuelMetrics[0];
      const expense = expenseMetrics[0];

      // Calcular métricas derivadas
      const totalFaturamento = Number(journey.total_faturamento) || 0;
      const totalKm = Number(journey.total_km) || 0;
      const totalTempo = Number(journey.total_tempo) || 0;
      const totalLitros = Number(fuel.total_litros) || 0;
      const totalGastoCombustivel = Number(fuel.total_gasto_combustivel) || 0;
      const totalDespesas = Number(expense.total_valorDespesas) || 0;

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
        metricas_operacionais: {
          total_jornadas: Number(journey.total_jornadas) || 0,
          total_km: totalKm,
          total_tempo_horas: Math.round((totalTempo / 60) * 100) / 100,
          total_abastecimentos: Number(fuel.total_abastecimentos) || 0,
          total_despesas: Number(expense.total_despesas) || 0,
        },
        metricas_financeiras: {
          faturamento_total: totalFaturamento,
          gasto_combustivel: totalGastoCombustivel,
          outras_despesas: totalDespesas,
          lucro_liquido: lucroLiquido,
          margem_lucro: Math.round(margemLucro * 100) / 100,
        },
        metricas_eficiencia: {
          consumo_medio: Math.round(consumoMedio * 100) / 100,
          ganho_por_km: Math.round(ganhoPorKm),
          ganho_por_hora: Math.round(ganhoPorHora),
          custo_por_km: Math.round(custoPorKm),
          eficiencia_energetica: Math.round(eficienciaEnergetica),
          classificacao_eficiencia: classificacaoEficiencia,
          classificacao_consumo: classificacaoConsumo,
        },
        indicadores_performance: {
          jornadas_por_dia: totalKm > 0 ? Math.round((Number(journey.total_jornadas) / 30) * 100) / 100 : 0,
          km_por_dia: Math.round((totalKm / 30) * 100) / 100,
          faturamento_por_dia: Math.round((totalFaturamento / 30)),
          tempo_medio_jornada: Number(journey.total_jornadas) > 0 ? Math.round((totalTempo / Number(journey.total_jornadas))) : 0,
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
        semana: sql<string>`DATE_TRUNC('week', ${jornadas.dataInicio})`,
        total_faturamento: sum(jornadas.ganho_bruto),
        total_km: sum(jornadas.km_total),
        numero_jornadas: count(jornadas.id),
        tempo_total: sum(jornadas.tempo_total),
      })
      .from(jornadas)
      .innerJoin(veiculos, eq(jornadas.idVeiculo, veiculos.id))
      .where(
        and(
          vehicleFilter,
          gte(jornadas.dataInicio, startDate.toISOString()),
          lte(jornadas.dataInicio, endDate.toISOString()),
          isNull(jornadas.deletedAt)
        )
      )
      .groupBy(sql`DATE_TRUNC('week', ${jornadas.dataInicio})`)
      .orderBy(sql`DATE_TRUNC('week', ${jornadas.dataInicio})`);

    // Análise mensal
    const monthlyTrends = await db
      .select({
        mes: sql<string>`DATE_TRUNC('month', ${jornadas.dataInicio})`,
        total_faturamento: sum(jornadas.ganho_bruto),
        total_km: sum(jornadas.km_total),
        numero_jornadas: count(jornadas.id),
        tempo_total: sum(jornadas.tempo_total),
      })
      .from(jornadas)
      .innerJoin(veiculos, eq(jornadas.idVeiculo, veiculos.id))
      .where(
        and(
          vehicleFilter,
          gte(jornadas.dataInicio, startDate.toISOString()),
          lte(jornadas.dataInicio, endDate.toISOString()),
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
      tendencias_semanais: {
        dados: weeklyTrends.map(week => ({
          periodo: week.semana,
          faturamento: Number(week.total_faturamento) || 0,
          km: Number(week.total_km) || 0,
          jornadas: Number(week.numero_jornadas) || 0,
          tempo_horas: Math.round((Number(week.tempo_total) / 60) * 100) / 100,
        })),
        analise_faturamento: calculateTrend(weeklyTrends, 'total_faturamento'),
        analise_km: calculateTrend(weeklyTrends, 'total_km'),
        analise_jornadas: calculateTrend(weeklyTrends, 'numero_jornadas'),
      },
      tendencias_mensais: {
        dados: monthlyTrends.map(month => ({
          periodo: month.mes,
          faturamento: Number(month.total_faturamento) || 0,
          km: Number(month.total_km) || 0,
          jornadas: Number(month.numero_jornadas) || 0,
          tempo_horas: Math.round((Number(month.tempo_total) / 60) * 100) / 100,
        })),
        analise_faturamento: calculateTrend(monthlyTrends, 'total_faturamento'),
        analise_km: calculateTrend(monthlyTrends, 'total_km'),
        analise_jornadas: calculateTrend(monthlyTrends, 'numero_jornadas'),
      },
      periodo_analise: {
        dataInicio: startDate.toISOString(),
        dataFim: endDate.toISOString(),
        total_dias: days,
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
        dia_semana: sql<number>`EXTRACT(DOW FROM ${jornadas.dataInicio})`,
        total_faturamento: sum(jornadas.ganho_bruto),
        total_km: sum(jornadas.km_total),
        numero_jornadas: count(jornadas.id),
        tempo_total: sum(jornadas.tempo_total),
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
        hora: sql<number>`EXTRACT(HOUR FROM ${jornadas.dataInicio})`,
        total_faturamento: sum(jornadas.ganho_bruto),
        total_km: sum(jornadas.km_total),
        numero_jornadas: count(jornadas.id),
        tempo_total: sum(jornadas.tempo_total),
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
        mes: sql<number>`EXTRACT(MONTH FROM ${jornadas.dataInicio})`,
        total_faturamento: sum(jornadas.ganho_bruto),
        total_km: sum(jornadas.km_total),
        numero_jornadas: count(jornadas.id),
        tempo_total: sum(jornadas.tempo_total),
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
      (Number(current.total_faturamento) || 0) > (Number(best.total_faturamento) || 0) ? current : best
    );

    const bestHour = hourAnalysis.reduce((best, current) => 
      (Number(current.total_faturamento) || 0) > (Number(best.total_faturamento) || 0) ? current : best
    );

    const bestMonth = monthAnalysis.reduce((best, current) => 
      (Number(current.total_faturamento) || 0) > (Number(best.total_faturamento) || 0) ? current : best
    );

    return {
      analise_dia_semana: dayOfWeekAnalysis.map(day => ({
        dia_semana: getDayName(day.dia_semana),
        dia_numero: day.dia_semana,
        faturamento_total: Number(day.total_faturamento) || 0,
        km_total: Number(day.total_km) || 0,
        numero_jornadas: Number(day.numero_jornadas) || 0,
        faturamento_medio: Number(day.numero_jornadas) > 0 ? Math.round((Number(day.total_faturamento) || 0) / Number(day.numero_jornadas)) : 0,
      })),
      analise_horario: hourAnalysis.map(hour => ({
        hora: hour.hora,
        faturamento_total: Number(hour.total_faturamento) || 0,
        km_total: Number(hour.total_km) || 0,
        numero_jornadas: Number(hour.numero_jornadas) || 0,
        faturamento_medio: Number(hour.numero_jornadas) > 0 ? Math.round((Number(hour.total_faturamento) || 0) / Number(hour.numero_jornadas)) : 0,
      })),
      analise_mensal: monthAnalysis.map(month => ({
        mes: getMonthName(month.mes),
        mes_numero: month.mes,
        faturamento_total: Number(month.total_faturamento) || 0,
        km_total: Number(month.total_km) || 0,
        numero_jornadas: Number(month.numero_jornadas) || 0,
        faturamento_medio: Number(month.numero_jornadas) > 0 ? Math.round((Number(month.total_faturamento) || 0) / Number(month.numero_jornadas)) : 0,
      })),
      padroes_identificados: {
        melhor_dia_semana: {
          dia: getDayName(bestDayOfWeek.dia_semana),
          faturamento_total: Number(bestDayOfWeek.total_faturamento) || 0,
          numero_jornadas: Number(bestDayOfWeek.numero_jornadas) || 0,
        },
        melhor_horario: {
          hora: bestHour.hora,
          faturamento_total: Number(bestHour.total_faturamento) || 0,
          numero_jornadas: Number(bestHour.numero_jornadas) || 0,
        },
        melhor_mes: {
          mes: getMonthName(bestMonth.mes),
          faturamento_total: Number(bestMonth.total_faturamento) || 0,
          numero_jornadas: Number(bestMonth.numero_jornadas) || 0,
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

    const vehicles = await db.select().from(veiculos).where(vehicleFilter);

    const costAnalysis = [];

    for (const vehicle of vehicles) {
      const expenseMetrics = await db
        .select({
          tipoDespesa: despesas.tipoDespesa,
          total_valor: sum(despesas.valorDespesa),
          numero_despesas: count(despesas.id),
        })
        .from(despesas)
        .where(
          and(
            eq(despesas.idVeiculo, vehicle.id),
            eq(despesas.idUsuario, userId),
            gte(despesas.dataDespesa, thirtyDaysAgo.toISOString()),
            lte(despesas.dataDespesa, today.toISOString()),
            isNull(despesas.deletedAt)
          )
        )
        .groupBy(despesas.tipoDespesa);

      const totalGasto = expenseMetrics.reduce((sum, item) => sum + (Number(item.total_valor) || 0), 0);

      costAnalysis.push({
        veiculo: {
          id: vehicle.id,
          marca: vehicle.marca,
          modelo: vehicle.modelo,
          placa: vehicle.placa,
        },
        despesas_por_categoria: expenseMetrics.map(item => ({
          tipoDespesa: item.tipoDespesa,
          total_gasto: Number(item.total_valor) || 0,
          numero_despesas: Number(item.numero_despesas) || 0,
          percentual: totalGasto > 0 ? ((Number(item.total_valor) || 0) / totalGasto) * 100 : 0,
        })),
        total_gasto_periodo: totalGasto,
      });
    }

    return costAnalysis;
  }

  /**
   * Gerar insights e recomendações com base nas análises
   */
  static generateInsights(
    efficiencyMetrics: any[],
    trends: any,
    seasonality: any,
    costs: any
  ) {
    const insights = [];
    const recommendations = [];
    let resumo_geral = {};

    // Exemplo de insights e recomendações (simplificado)
    if (efficiencyMetrics.length > 0) {
      const overallEfficiency = efficiencyMetrics.reduce((acc, curr) => acc + curr.metricas_eficiencia.ganho_por_km, 0) / efficiencyMetrics.length;
      if (overallEfficiency < 70) {
        insights.push({
          titulo: 'Baixa Eficiência Geral',
          descricao: 'Seu ganho médio por KM está abaixo do ideal. Considere otimizar suas rotas e horários.',
          tipo: 'warning',
        });
        recommendations.push({
          titulo: 'Otimizar Rotas',
          descricao: 'Utilize aplicativos de navegação que sugiram rotas mais lucrativas.',
          prioridade: 'alta',
        });
      }
    }

    if (trends && trends.tendencias_mensais.analise_faturamento.tendencia === 'Decrescente') {
      insights.push({
        titulo: 'Faturamento em Queda',
        descricao: 'Seu faturamento mensal tem apresentado queda. Analise os períodos de maior demanda.',
        tipo: 'error',
      });
      recommendations.push({
        titulo: 'Analisar Sazonalidade',
        descricao: 'Verifique os padrões de sazonalidade para identificar os melhores meses para trabalhar.',
        prioridade: 'media',
      });
    }

    if (costs && costs.length > 0) {
      const totalCosts = costs.reduce((acc: number, curr: { total_gasto_periodo: number; }) => acc + curr.total_gasto_periodo, 0);
      if (totalCosts > 100000) { // Exemplo: mais de R$1000 em despesas
        insights.push({
          titulo: 'Altos Custos Operacionais',
          descricao: 'Suas despesas estão elevadas. Identifique as categorias de maior gasto.',
          tipo: 'warning',
        });
        recommendations.push({
          titulo: 'Revisar Despesas',
          descricao: 'Categorize e analise suas despesas para encontrar oportunidades de economia.',
          prioridade: 'alta',
        });
      }
    }

    resumo_geral = {
      total_insights: insights.length,
      total_recommendations: recommendations.length,
      // Adicione mais resumos conforme necessário
    };

    return { insights, recommendations, resumo_geral };
  }
}

