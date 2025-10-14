"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsCalculator = void 0;
var calculations_1 = require("./calculations");
var StatisticsCalculator = /** @class */ (function () {
    function StatisticsCalculator() {
    }
    /**
     * Calcula métricas financeiras a partir dos dados brutos.
     * @param data - Objeto com faturamentoBruto, gastoCombustivel, outrasDespesas, totalDespesas, lucroLiquido, kmTotal, numeroJornadas.
     * @returns Objeto com métricas financeiras calculadas.
     */
    StatisticsCalculator.calculateFinancialMetrics = function (data) {
        var faturamentoBruto = data.faturamentoBruto, gastoCombustivel = data.gastoCombustivel, outrasDespesas = data.outrasDespesas, totalDespesas = data.totalDespesas, lucroLiquido = data.lucroLiquido, kmTotal = data.kmTotal, numeroJornadas = data.numeroJornadas;
        var custoPorKm = kmTotal > 0 ? totalDespesas / kmTotal : 0;
        var ganhoPorKm = kmTotal > 0 ? faturamentoBruto / kmTotal : 0;
        var lucroPorKm = kmTotal > 0 ? lucroLiquido / kmTotal : 0;
        var mediaGanhoPorJornada = numeroJornadas > 0 ? faturamentoBruto / numeroJornadas : 0;
        var mediaKmPorJornada = numeroJornadas > 0 ? kmTotal / numeroJornadas : 0;
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
    };
    /**
     * Calcula indicadores chave a partir do resumo financeiro.
     * @param financialSummary - Resumo financeiro calculado.
     * @returns Objeto com indicadores.
     */
    StatisticsCalculator.calculateIndicators = function (financialSummary) {
        var faturamento_bruto = financialSummary.faturamento_bruto, total_despesas = financialSummary.total_despesas, lucro_liquido = financialSummary.lucro_liquido, km_total = financialSummary.km_total, numero_jornadas = financialSummary.numero_jornadas;
        var margemLucro = (0, calculations_1.calcularPercentual)(lucro_liquido, faturamento_bruto);
        var custoOperacionalPorKm = km_total > 0 ? (0, calculations_1.calcularMedia)([total_despesas / km_total]) : 0;
        var ganhoMedioPorJornada = numero_jornadas > 0 ? (0, calculations_1.calcularMedia)([faturamento_bruto / numero_jornadas]) : 0;
        return {
            margem_lucro: margemLucro,
            custo_operacional_por_km: custoOperacionalPorKm,
            ganho_medio_por_jornada: ganhoMedioPorJornada,
        };
    };
    /**
     * Calcula estatísticas de comparação para uma lista de períodos.
     * @param periods - Array de dados de períodos.
     * @returns Objeto com estatísticas de comparação.
     */
    StatisticsCalculator.calculateComparisonStatistics = function (periods) {
        if (periods.length === 0)
            return {};
        var faturamentoBrutoValues = periods.map(function (p) { return p.faturamento_bruto; });
        var lucroLiquidoValues = periods.map(function (p) { return p.lucro_liquido; });
        var kmTotalValues = periods.map(function (p) { return p.km_total; });
        return {
            faturamento_bruto_medio: (0, calculations_1.calcularMedia)(faturamentoBrutoValues),
            lucro_liquido_medio: (0, calculations_1.calcularMedia)(lucroLiquidoValues),
            km_total_medio: (0, calculations_1.calcularMedia)(kmTotalValues),
        };
    };
    /**
     * Calcula tendências para uma lista de períodos.
     * @param periods - Array de dados de períodos.
     * @returns Objeto com tendências.
     */
    StatisticsCalculator.calculateTrends = function (periods) {
        if (periods.length < 2)
            return {};
        var latest = periods[periods.length - 1];
        var previous = periods[periods.length - 2];
        var trendFaturamentoBruto = (0, calculations_1.calcularPercentual)(latest.faturamento_bruto - previous.faturamento_bruto, previous.faturamento_bruto);
        var trendLucroLiquido = (0, calculations_1.calcularPercentual)(latest.lucro_liquido - previous.lucro_liquido, previous.lucro_liquido);
        var trendKmTotal = (0, calculations_1.calcularPercentual)(latest.km_total - previous.km_total, previous.km_total);
        return {
            trend_faturamento_bruto: trendFaturamentoBruto,
            trend_lucro_liquido: trendLucroLiquido,
            trend_km_total: trendKmTotal,
        };
    };
    /**
     * Gera previsões futuras (exemplo simples).
     * @param periods - Array de dados de períodos.
     * @returns Objeto com previsões.
     */
    StatisticsCalculator.generatePredictions = function (periods) {
        if (periods.length === 0)
            return {};
        var lastFaturamento = periods[periods.length - 1].faturamento_bruto;
        var lastLucro = periods[periods.length - 1].lucro_liquido;
        var lastKm = periods[periods.length - 1].km_total;
        // Exemplo de previsão simples: crescimento de 5%
        return {
            proximo_periodo_faturamento_bruto: Math.round(lastFaturamento * 1.05),
            proximo_periodo_lucro_liquido: Math.round(lastLucro * 1.05),
            proximo_periodo_km_total: Math.round(lastKm * 1.05),
        };
    };
    /**
     * Analisa sazonalidade (exemplo simples).
     * @param periods - Array de dados de períodos.
     * @returns Objeto com análise de sazonalidade.
     */
    StatisticsCalculator.analyzeSeasonality = function (periods) {
        if (periods.length < 12)
            return {}; // Necessário pelo menos 12 meses para análise de sazonalidade
        // Implementação mais complexa de análise de sazonalidade seria aqui
        return {
            sazonalidade_detectada: false,
            padrao_mensal: null,
        };
    };
    /**
     * Gera insights a partir dos dados e estatísticas.
     * @param periods - Array de dados de períodos.
     * @param statistics - Estatísticas calculadas.
     * @param trends - Tendências calculadas.
     * @returns Array de insights.
     */
    StatisticsCalculator.generateInsights = function (periods, statistics, trends) {
        var insights = [];
        if (periods.length > 0) {
            var latest = periods[periods.length - 1];
            if (latest.lucro_liquido > 0) {
                insights.push("Seu lucro l\u00EDquido mais recente foi de R$ ".concat(latest.lucro_liquido.toFixed(2), ". Continue assim!"));
            }
            else {
                insights.push("Seu lucro l\u00EDquido mais recente foi de R$ ".concat(latest.lucro_liquido.toFixed(2), ". Analise suas despesas e receitas."));
            }
            if (trends && trends.trend_lucro_liquido > 0) {
                insights.push("Seu lucro l\u00EDquido aumentou em ".concat(trends.trend_lucro_liquido, "% em rela\u00E7\u00E3o ao per\u00EDodo anterior."));
            }
            else if (trends && trends.trend_lucro_liquido < 0) {
                insights.push("Seu lucro l\u00EDquido diminuiu em ".concat(Math.abs(trends.trend_lucro_liquido), "% em rela\u00E7\u00E3o ao per\u00EDodo anterior. Identifique as causas."));
            }
            if (latest.km_total > statistics.km_total_medio) {
                insights.push("Voc\u00EA percorreu mais quil\u00F4metros (".concat(latest.km_total, " km) do que a m\u00E9dia (").concat(statistics.km_total_medio, " km)."));
            }
        }
        return insights;
    };
    return StatisticsCalculator;
}());
exports.StatisticsCalculator = StatisticsCalculator;
