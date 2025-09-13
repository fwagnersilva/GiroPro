import { calcularMedia, calcularPercentual } from './calculations';

export class StatisticsCalculator {
  /**
   * Calcula métricas financeiras a partir dos dados brutos.
   * @param data - Objeto com faturamentoBruto, gastoCombustivel, outrasDespesas, totalDespesas, lucroLiquido, kmTotal, numeroJornadas.
   * @returns Objeto com métricas financeiras calculadas.
   */
  static calculateFinancialMetrics(data: {
    faturamentoBruto: number;
    gastoCombustivel: number;
    outrasDespesas: number;
    totalDespesas: number;
    lucroLiquido: number;
    kmTotal: number;
    numeroJornadas: number;
  }) {
    const { faturamentoBruto, gastoCombustivel, outrasDespesas, totalDespesas, lucroLiquido, kmTotal, numeroJornadas } = data;

    const custoPorKm = kmTotal > 0 ? totalDespesas / kmTotal : 0;
    const ganhoPorKm = kmTotal > 0 ? faturamentoBruto / kmTotal : 0;
    const lucroPorKm = kmTotal > 0 ? lucroLiquido / kmTotal : 0;
    const mediaGanhoPorJornada = numeroJornadas > 0 ? faturamentoBruto / numeroJornadas : 0;
    const mediaKmPorJornada = numeroJornadas > 0 ? kmTotal / numeroJornadas : 0;

    return {
      faturamento_bruto: Math.round(faturamentoBruto),
      gasto_combustivel: Math.round(gastoCombustivel),
      outras_despesas: Math.round(outrasDespesas),
      total_despesas: Math.round(totalDespesas),
      lucro_liquido: Math.round(lucroLiquido),
      km_total: Math.round(kmTotal),
      numero_jornadas: Math.round(numeroJornadas),
      custo_por_km: Math.round(custoPorKm * 100) / 100, // Duas casas decimais
      ganho_por_km: Math.round(ganhoPorKm * 100) / 100, // Duas casas decimais
      lucro_por_km: Math.round(lucroPorKm * 100) / 100, // Duas casas decimais
      media_ganho_por_jornada: Math.round(mediaGanhoPorJornada),
      media_km_por_jornada: Math.round(mediaKmPorJornada),
    };
  }

  /**
   * Calcula indicadores chave a partir do resumo financeiro.
   * @param financialSummary - Resumo financeiro calculado.
   * @returns Objeto com indicadores.
   */
  static calculateIndicators(financialSummary: any) {
    const { faturamento_bruto, total_despesas, lucro_liquido, km_total, numero_jornadas } = financialSummary;

    const margemLucro = calcularPercentual(lucro_liquido, faturamento_bruto);
    const custoOperacionalPorKm = km_total > 0 ? calcularMedia([total_despesas / km_total]) : 0;
    const ganhoMedioPorJornada = numero_jornadas > 0 ? calcularMedia([faturamento_bruto / numero_jornadas]) : 0;

    return {
      margem_lucro: margemLucro,
      custo_operacional_por_km: custoOperacionalPorKm,
      ganho_medio_por_jornada: ganhoMedioPorJornada,
    };
  }

  /**
   * Calcula estatísticas de comparação para uma lista de períodos.
   * @param periods - Array de dados de períodos.
   * @returns Objeto com estatísticas de comparação.
   */
  static calculateComparisonStatistics(periods: any[]) {
    if (periods.length === 0) return {};

    const faturamentoBrutoValues = periods.map(p => p.faturamento_bruto);
    const lucroLiquidoValues = periods.map(p => p.lucro_liquido);
    const kmTotalValues = periods.map(p => p.km_total);

    return {
      faturamento_bruto_medio: calcularMedia(faturamentoBrutoValues),
      lucro_liquido_medio: calcularMedia(lucroLiquidoValues),
      km_total_medio: calcularMedia(kmTotalValues),
    };
  }

  /**
   * Calcula tendências para uma lista de períodos.
   * @param periods - Array de dados de períodos.
   * @returns Objeto com tendências.
   */
  static calculateTrends(periods: any[]) {
    if (periods.length < 2) return {};

    const latest = periods[periods.length - 1];
    const previous = periods[periods.length - 2];

    const trendFaturamentoBruto = calcularPercentual(latest.faturamento_bruto - previous.faturamento_bruto, previous.faturamento_bruto);
    const trendLucroLiquido = calcularPercentual(latest.lucro_liquido - previous.lucro_liquido, previous.lucro_liquido);
    const trendKmTotal = calcularPercentual(latest.km_total - previous.km_total, previous.km_total);

    return {
      trend_faturamento_bruto: trendFaturamentoBruto,
      trend_lucro_liquido: trendLucroLiquido,
      trend_km_total: trendKmTotal,
    };
  }

  /**
   * Gera previsões futuras (exemplo simples).
   * @param periods - Array de dados de períodos.
   * @returns Objeto com previsões.
   */
  static generatePredictions(periods: any[]) {
    if (periods.length === 0) return {};

    const lastFaturamento = periods[periods.length - 1].faturamento_bruto;
    const lastLucro = periods[periods.length - 1].lucro_liquido;
    const lastKm = periods[periods.length - 1].km_total;

    // Exemplo de previsão simples: crescimento de 5%
    return {
      proximo_periodo_faturamento_bruto: Math.round(lastFaturamento * 1.05),
      proximo_periodo_lucro_liquido: Math.round(lastLucro * 1.05),
      proximo_periodo_km_total: Math.round(lastKm * 1.05),
    };
  }

  /**
   * Analisa sazonalidade (exemplo simples).
   * @param periods - Array de dados de períodos.
   * @returns Objeto com análise de sazonalidade.
   */
  static analyzeSeasonality(periods: any[]) {
    if (periods.length < 12) return {}; // Necessário pelo menos 12 meses para análise de sazonalidade

    // Implementação mais complexa de análise de sazonalidade seria aqui
    return {
      sazonalidade_detectada: false,
      padrao_mensal: null,
    };
  }

  /**
   * Gera insights a partir dos dados e estatísticas.
   * @param periods - Array de dados de períodos.
   * @param statistics - Estatísticas calculadas.
   * @param trends - Tendências calculadas.
   * @returns Array de insights.
   */
  static generateInsights(periods: any[], statistics: any, trends: any): string[] {
    const insights: string[] = [];

    if (periods.length > 0) {
      const latest = periods[periods.length - 1];

      if (latest.lucro_liquido > 0) {
        insights.push(`Seu lucro líquido mais recente foi de R$ ${latest.lucro_liquido.toFixed(2)}. Continue assim!`);
      } else {
        insights.push(`Seu lucro líquido mais recente foi de R$ ${latest.lucro_liquido.toFixed(2)}. Analise suas despesas e receitas.`);
      }

      if (trends && trends.trend_lucro_liquido > 0) {
        insights.push(`Seu lucro líquido aumentou em ${trends.trend_lucro_liquido}% em relação ao período anterior.`);
      } else if (trends && trends.trend_lucro_liquido < 0) {
        insights.push(`Seu lucro líquido diminuiu em ${Math.abs(trends.trend_lucro_liquido)}% em relação ao período anterior. Identifique as causas.`);
      }

      if (latest.km_total > statistics.km_total_medio) {
        insights.push(`Você percorreu mais quilômetros (${latest.km_total} km) do que a média (${statistics.km_total_medio} km).`);
      }
    }

    return insights;
  }
}


