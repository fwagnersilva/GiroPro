import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { jornadas, abastecimentos, despesas, veiculos } from '../db/schema';
import { eq, and, isNull, isNotNull, sql, gte, lte, sum, count, avg, desc } from 'drizzle-orm';
import { AuthenticatedRequest } from '../middlewares/auth';

// ====================== INTERFACES ======================

interface PeriodRange {
  dataInicio: Date;
  dataFim: Date;
}

interface JourneyStats {
  total_ganho_bruto: number;
  total_custo_estimado: number;
  total_lucro_liquido: number;
  media_ganho_por_jornada: number;
  media_lucro_por_jornada: number;
  margem_lucro_media: number;
  total_km: number;
  media_km_por_jornada: number;
  total_jornadas: number;
}

interface JourneyReport {
  id_jornada: string;
  data_inicio: string | null;
  data_fim: string | null;
  duracao_minutos: number | null;
  veiculo: {
    id: string | null;
    marca: string | null;
    modelo: string | null;
    placa: string | null;
    tipo_combustivel: string | null;
  };
  quilometragem: {
    inicio: number | null;
    fim: number | null;
    total: number | null;
  };
  financeiro: {
    ganho_bruto: number;
    custo_combustivel_estimado: number;
    outras_despesas: number;
    lucro_liquido_estimado: number;
    margem_lucro: number;
  };
  observacoes: string | null;
}

interface ExpenseByCategory {
  categoria: string;
  total: number;
  percentual: number;
  quantidade: number;
}

interface ExpenseEvolution {
  data: string;
  total: number;
  categoria: string;
}

interface VehicleComparison {
  id_veiculo: string;
  veiculo: string;
  total_despesas: number;
  custo_por_km: number;
  km_total: number;
}

interface FuelAnalysisData {
  consumo_medio: number;
  custo_total: number;
  litros_total: number;
  preco_medio_litro: number;
}

interface ReportResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
}

// ====================== CONSTANTS ======================

const FUEL_PRICES: Record<string, number> = {
  'Gasolina': 550, // R$ 5,50 em centavos
  'Etanol': 350,   // R$ 3,50 em centavos
  'Diesel': 480,   // R$ 4,80 em centavos
  'GNV': 280,      // R$ 2,80 em centavos
  'Flex': 450      // R$ 4,50 em centavos
};

const DEFAULT_CONSUMPTION = 12; // km/l

const EXPENSE_CATEGORIES = {
  'combustivel': 'Combustível',
  'manutencao': 'Manutenção',
  'seguro': 'Seguro',
  'pedagio': 'Pedágio',
  'estacionamento': 'Estacionamento',
  'multa': 'Multa',
  'outros': 'Outros'
} as const;

// ====================== SCHEMAS ======================

const reportsQuerySchema = z.object({
  periodo: z.enum(['hoje', 'semana', 'mes', 'ano', 'personalizado']).default('mes'),
  data_inicio: z.string().datetime().optional(),
  data_fim: z.string().datetime().optional(),
  id_veiculo: z.string().uuid().optional(),
  formato: z.enum(['json', 'csv']).default('json')
});


// ====================== MAIN CONTROLLER ======================

export class ReportsController {
  /**
   * Valida se o usuário está autenticado
   */
  private static validateAuth(req: AuthenticatedRequest): string | null {
    return req.user?.id || null;
  }

  /**
   * Retorna resposta de erro padronizada
   */
  private static errorResponse(res: Response, status: number, message: string, details?: any): Response {
    console.error(`[ReportsController] Error ${status}: ${message}`, details);
    return res.status(status).json({
      success: false,
      error: { message, details }
    });
  }

  /**
   * Retorna resposta de sucesso padronizada
   */
  private static successResponse<T>(res: Response, data: T, status: number = 200): Response {
    return res.status(status).json({
      success: true,
      data
    });
  }

  /**
   * Valida parâmetros de consulta comuns
   */
  private static validateQueryParams(req: AuthenticatedRequest) {
    const userId = this.validateAuth(req);
    if (!userId) {
      return { userId: null, error: 'Usuário não autenticado' };
    }

    const queryValidation = reportsQuerySchema.safeParse(req.query);
    if (!queryValidation.success) {
      return { 
        userId: null, 
        error: 'Parâmetros de consulta inválidos',
        details: queryValidation.error.errors
      };
    }

    return { userId, queryData: queryValidation.data, error: null };
  }

  /**
   * Configura resposta CSV
   */
  private static setupCSVResponse(res: Response, filename: string, content: string): Response {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.send('\uFEFF' + content); // BOM para UTF-8
  }

  /**
   * Relatório Detalhado de Ganhos por Jornada
   */
  static async getJourneyEarningsReport(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const validation = ReportsController.validateQueryParams(req);
      if (validation.error) {
        return ReportsController.errorResponse(res, 401, validation.error, validation.details);
      }

      const { userId, queryData } = validation;
      const { periodo, data_inicio, data_fim, id_veiculo, formato } = queryData!;
      const { dataInicio, dataFim } = DateHelper.calcularPeriodo(periodo, data_inicio, data_fim);

      console.log(`[ReportsController] Gerando relatório de jornadas - Usuário: ${userId}, Período: ${periodo}`);

      // Construir condições de filtro
      const whereConditions = and(
        eq(jornadas.id_usuario, userId!),
        gte(jornadas.data_inicio, DateHelper.formatDateForSQL(dataInicio)),
        lte(jornadas.data_fim, DateHelper.formatDateForSQL(dataFim)),
        id_veiculo ? eq(jornadas.id_veiculo, id_veiculo) : undefined
      );

      // Buscar jornadas com informações do veículo
      const jornadasDetalhadas = await db
        .select({
          id: jornadas.id,
          data_inicio: jornadas.data_inicio,
          data_fim: jornadas.data_fim,
          km_inicio: jornadas.km_inicio,
          km_fim: jornadas.km_fim,
          km_total: jornadas.km_total,
          ganho_bruto: jornadas.ganho_bruto,
          tempo_total: jornadas.tempo_total,
          observacoes: jornadas.observacoes,
          id_veiculo: jornadas.id_veiculo,
          veiculo_marca: veiculos.marca,
          veiculo_modelo: veiculos.modelo,
          veiculo_placa: veiculos.placa,
          veiculo_tipo_combustivel: veiculos.tipo_combustivel
        })
        .from(jornadas)
        .leftJoin(veiculos, eq(jornadas.id_veiculo, veiculos.id))
        .where(whereConditions)
        .orderBy(desc(jornadas.data_inicio));

      // Processar jornadas e calcular dados financeiros
      const relatorioJornadas = await JourneyProcessor.processJourneys(jornadasDetalhadas, userId!);

      // Calcular estatísticas do relatório
      const estatisticas = StatisticsCalculator.calcularEstatisticasJornadas(relatorioJornadas);

      const relatorio = {
        periodo: {
          tipo: periodo,
          data_inicio: dataInicio.toISOString(),
          data_fim: dataFim.toISOString()
        },
        filtros: {
          id_veiculo: id_veiculo || null
        },
        estatisticas,
        jornadas: relatorioJornadas,
        total_jornadas: relatorioJornadas.length,
        gerado_em: new Date().toISOString()
      };

      if (formato === 'csv') {
        const csv = CSVGenerator.gerarCSVJornadas(relatorioJornadas);
        const filename = `relatorio_jornadas_${periodo}_${new Date().toISOString().split('T')[0]}.csv`;
        return ReportsController.setupCSVResponse(res, filename, csv);
      }

      return ReportsController.successResponse(res, relatorio);

    } catch (error: any) {
      return ReportsController.errorResponse(res, 500, "Erro ao gerar relatório de jornadas", error.message);
    }
  }

  /**
   * Relatório de Análise de Despesas
   */
  static async getExpenseAnalysisReport(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const validation = ReportsController.validateQueryParams(req);
      if (validation.error) {
        return ReportsController.errorResponse(res, 401, validation.error, validation.details);
      }

      const { userId, queryData } = validation;
      const { periodo, data_inicio, data_fim, id_veiculo, formato } = queryData!;
      const { dataInicio, dataFim } = DateHelper.calcularPeriodo(periodo, data_inicio, data_fim);

      console.log(`[ReportsController] Gerando relatório de despesas - Usuário: ${userId}, Período: ${periodo}`);

      // Executar análises de despesas em paralelo para melhor performance
      const [
        despesasPorCategoria,
        evolucaoDespesas,
        comparacaoVeiculos,
        analiseCombustivel,
        resumoGeral
      ] = await Promise.all([
        ExpenseAnalyzer.analisarDespesasPorCategoria(userId!, dataInicio, dataFim, id_veiculo),
        ExpenseAnalyzer.analisarEvolucaoDespesas(userId!, dataInicio, dataFim, id_veiculo),
        id_veiculo ? Promise.resolve(null) : ExpenseAnalyzer.compararDespesasVeiculos(userId!, dataInicio, dataFim),
        ExpenseAnalyzer.analisarGastosCombustivel(userId!, dataInicio, dataFim, id_veiculo),
        ExpenseAnalyzer.obterResumoGeral(userId!, dataInicio, dataFim, id_veiculo)
      ]);

      const relatorio = {
        periodo: {
          tipo: periodo,
          data_inicio: dataInicio.toISOString(),
          data_fim: dataFim.toISOString()
        },
        filtros: {
          id_veiculo: id_veiculo || null
        },
        resumo_geral: resumoGeral,
        despesas_por_categoria: despesasPorCategoria,
        evolucao_despesas: evolucaoDespesas,
        comparacao_veiculos: comparacaoVeiculos,
        analise_combustivel: analiseCombustivel,
        gerado_em: new Date().toISOString()
      };

      if (formato === 'csv') {
        const csv = CSVGenerator.gerarCSVDespesas(despesasPorCategoria, evolucaoDespesas);
        const filename = `relatorio_despesas_${periodo}_${new Date().toISOString().split('T')[0]}.csv`;
        return ReportsController.setupCSVResponse(res, filename, csv);
      }

      return ReportsController.successResponse(res, relatorio);

    } catch (error: any) {
      return ReportsController.errorResponse(res, 500, "Erro ao gerar relatório de despesas", error.message);
    }
  }

  /**
   * Relatório de Consumo de Combustível
   */
  static async getFuelConsumptionReport(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const validation = ReportsController.validateQueryParams(req);
      if (validation.error) {
        return ReportsController.errorResponse(res, 401, validation.error, validation.details);
      }

      const { userId, queryData } = validation;
      const { periodo, data_inicio, data_fim, id_veiculo, formato } = queryData!;
      const { dataInicio, dataFim } = DateHelper.calcularPeriodo(periodo, data_inicio, data_fim);

      console.log(`[ReportsController] Gerando relatório de combustível - Usuário: ${userId}, Período: ${periodo}`);

      // Executar análises de combustível em paralelo
      const [
        consumoPorVeiculo,
        evolucaoPrecos,
        comparacaoCombustiveis,
        analiseEficiencia,
        resumoAbastecimentos
      ] = await Promise.all([
        FuelAnalyzer.analisarConsumoPorVeiculo(userId!, dataInicio, dataFim, id_veiculo),
        FuelAnalyzer.analisarEvolucaoPrecos(userId!, dataInicio, dataFim, id_veiculo),
        FuelAnalyzer.compararTiposCombustivel(userId!, dataInicio, dataFim),
        FuelAnalyzer.analisarEficienciaCombustivel(userId!, dataInicio, dataFim, id_veiculo),
        FuelAnalyzer.obterResumoAbastecimentos(userId!, dataInicio, dataFim, id_veiculo)
      ]);

      const relatorio = {
        periodo: {
          tipo: periodo,
          data_inicio: dataInicio.toISOString(),
          data_fim: dataFim.toISOString()
        },
        filtros: {
          id_veiculo: id_veiculo || null
        },
        resumo_abastecimentos: resumoAbastecimentos,
        consumo_por_veiculo: consumoPorVeiculo,
        evolucao_precos: evolucaoPrecos,
        comparacao_combustiveis: comparacaoCombustiveis,
        analise_eficiencia: analiseEficiencia,
        gerado_em: new Date().toISOString()
      };

      if (formato === 'csv') {
        const csv = CSVGenerator.gerarCSVCombustivel(consumoPorVeiculo, evolucaoPrecos);
        const filename = `relatorio_combustivel_${periodo}_${new Date().toISOString().split('T')[0]}.csv`;
        return ReportsController.setupCSVResponse(res, filename, csv);
      }

      return ReportsController.successResponse(res, relatorio);

    } catch (error: any) {
      return ReportsController.errorResponse(res, 500, "Erro ao gerar relatório de combustível", error.message);
    }
  }

  /**
   * Relatório Resumido (Dashboard)
   */
  static async getDashboardSummary(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const validation = ReportsController.validateQueryParams(req);
      if (validation.error) {
        return ReportsController.errorResponse(res, 401, validation.error, validation.details);
      }

      const { userId, queryData } = validation;
      const { periodo, data_inicio, data_fim, id_veiculo } = queryData!;
      const { dataInicio, dataFim } = DateHelper.calcularPeriodo(periodo, data_inicio, data_fim);

      console.log(`[ReportsController] Gerando dashboard - Usuário: ${userId}, Período: ${periodo}`);

      // Executar todas as consultas em paralelo para melhor performance
      const [
        estatisticasJornadas,
        totalDespesas,
        totalAbastecimentos,
        veiculoMaisUtilizado,
        melhorDesempenho
      ] = await Promise.all([
        DashboardAnalyzer.obterEstatisticasJornadas(userId!, dataInicio, dataFim, id_veiculo),
        DashboardAnalyzer.obterTotalDespesas(userId!, dataInicio, dataFim, id_veiculo),
        DashboardAnalyzer.obterTotalAbastecimentos(userId!, dataInicio, dataFim, id_veiculo),
        id_veiculo ? Promise.resolve(null) : DashboardAnalyzer.obterVeiculoMaisUtilizado(userId!, dataInicio, dataFim),
        DashboardAnalyzer.obterMelhorDesempenho(userId!, dataInicio, dataFim, id_veiculo)
      ]);

      const dashboard = {
        periodo: {
          tipo: periodo,
          data_inicio: dataInicio.toISOString(),
          data_fim: dataFim.toISOString()
        },
        filtros: {
          id_veiculo: id_veiculo || null
        },
        resumo: {
          jornadas: estatisticasJornadas,
          despesas: totalDespesas,
          abastecimentos: totalAbastecimentos,
          veiculo_mais_utilizado: veiculoMaisUtilizado,
          melhor_desempenho: melhorDesempenho
        },
        gerado_em: new Date().toISOString()
      };

      return ReportsController.successResponse(res, dashboard);

    } catch (error: any) {
      return ReportsController.errorResponse(res, 500, "Erro ao gerar dashboard", error.message);
    }
  }
}

// ====================== HELPER CLASSES ======================

class DateHelper {
  static calcularPeriodo(periodo: string, data_inicio?: string, data_fim?: string): PeriodRange {
    const agora = new Date();
    let dataInicio: Date;
    let dataFim: Date = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);

    if (periodo === 'personalizado' && data_inicio && data_fim) {
      dataInicio = new Date(data_inicio);
      dataFim = new Date(data_fim);
    } else {
      switch (periodo) {
        case 'hoje':
          dataInicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0, 0);
          break;
        case 'semana':
          dataInicio = new Date(agora);
          dataInicio.setDate(agora.getDate() - 7);
          dataInicio.setHours(0, 0, 0, 0);
          break;
        case 'mes':
          dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1, 0, 0, 0, 0);
          break;
        case 'ano':
          dataInicio = new Date(agora.getFullYear(), 0, 1, 0, 0, 0, 0);
          break;
        default:
          dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1, 0, 0, 0, 0);
      }
    }

    return { dataInicio, dataFim };
  }

  static formatDateForSQL(date: Date): string {
    return date.toISOString();
  }
}

class QueryBuilder {
  static buildJourneyWhereConditions(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ) {
    let whereConditions = and(
      eq(jornadas.id_usuario, userId),
      isNotNull(jornadas.data_fim),
      gte(jornadas.data_fim, DateHelper.formatDateForSQL(dataInicio)),
      lte(jornadas.data_fim, DateHelper.formatDateForSQL(dataFim)),
      isNull(jornadas.deleted_at)
    );

    if (idVeiculo) {
      whereConditions = and(whereConditions, eq(jornadas.id_veiculo, idVeiculo));
    }

    return whereConditions;
  }

  static buildExpenseWhereConditions(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ) {
    let whereConditions = and(
      eq(despesas.id_usuario, userId),
      gte(despesas.data_despesa, DateHelper.formatDateForSQL(dataInicio)),
      lte(despesas.data_despesa, DateHelper.formatDateForSQL(dataFim)),
      isNull(despesas.deleted_at)
    );

    if (idVeiculo) {
      whereConditions = and(whereConditions, eq(despesas.id_veiculo, idVeiculo));
    }

    return whereConditions;
  }

  static buildFuelWhereConditions(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ) {
    let whereConditions = and(
      eq(abastecimentos.id_usuario, userId),
      gte(abastecimentos.data_abastecimento, DateHelper.formatDateForSQL(dataInicio)),
      lte(abastecimentos.data_abastecimento, DateHelper.formatDateForSQL(dataFim)),
      isNull(abastecimentos.deleted_at)
    );

    if (idVeiculo) {
      whereConditions = and(whereConditions, eq(abastecimentos.id_veiculo, idVeiculo));
    }

    return whereConditions;
  }
}

class JourneyProcessor {
  static async processJourneys(jornadasDetalhadas: any[], userId: string): Promise<JourneyReport[]> {
    if (jornadasDetalhadas.length === 0) {
      return [];
    }

    return Promise.all(
      jornadasDetalhadas.map(async (jornada) => {
        const custoCombustivelEstimado = await FuelCalculator.estimarCustoCombustivel(
          jornada.km_total || 0,
          jornada.veiculo_tipo_combustivel,
          jornada.data_fim ? new Date(jornada.data_fim) : null
        );

        const despesasJornada = await ExpenseCalculator.buscarDespesasJornada(
          userId,
          jornada.data_inicio ? new Date(jornada.data_inicio) : null,
          jornada.data_fim ? new Date(jornada.data_fim) : null,
          jornada.id
        );

        const ganhoBruto = jornada.ganho_bruto || 0;
        const lucroLiquidoEstimado = ganhoBruto - custoCombustivelEstimado - despesasJornada;

        return {
          id_jornada: jornada.id,
          data_inicio: jornada.data_inicio,
          data_fim: jornada.data_fim,
          duracao_minutos: jornada.tempo_total,
          veiculo: {
            id: jornada.id_veiculo,
            marca: jornada.veiculo_marca,
            modelo: jornada.veiculo_modelo,
            placa: jornada.veiculo_placa,
            tipo_combustivel: jornada.veiculo_tipo_combustivel
          },
          quilometragem: {
            inicio: jornada.km_inicio,
            fim: jornada.km_fim,
            total: jornada.km_total
          },
          financeiro: {
            ganho_bruto: ganhoBruto,
            custo_combustivel_estimado: custoCombustivelEstimado,
            outras_despesas: despesasJornada,
            lucro_liquido_estimado: lucroLiquidoEstimado,
            margem_lucro: ganhoBruto > 0 ? 
              Math.round((lucroLiquidoEstimado / ganhoBruto) * 10000) / 100 : 0
          },
          observacoes: jornada.observacoes
        };
      })
    );
  }
}

class FuelCalculator {
  static async estimarCustoCombustivel(
    kmTotal: number,
    tipoCombustivel: string | null,
    dataJornada: Date | null
  ): Promise<number> {
    if (!kmTotal || !tipoCombustivel || !dataJornada) return 0;

    try {
      // Tentar buscar preço real primeiro
      const precoReal = await this.buscarPrecoRealCombustivel(tipoCombustivel, dataJornada);
      const precoFinal = precoReal || this.buscarPrecoMedioCombustivel(tipoCombustivel);
      
      const litrosConsumidos = kmTotal / DEFAULT_CONSUMPTION;
      
      return Math.round(litrosConsumidos * precoFinal);
    } catch (error) {
      console.warn('Erro ao calcular custo combustível, usando preço médio:', error);
      const precoMedio = this.buscarPrecoMedioCombustivel(tipoCombustivel);
      const litrosConsumidos = kmTotal / DEFAULT_CONSUMPTION;
      return Math.round(litrosConsumidos * precoMedio);
    }
  }

  private static async buscarPrecoRealCombustivel(tipoCombustivel: string, data: Date): Promise<number | null> {
    try {
      // Buscar abastecimentos próximos à data da jornada para obter preço real
      const dataInicio = new Date(data);
      dataInicio.setDate(data.getDate() - 7); // 7 dias antes
      const dataFim = new Date(data);
      dataFim.setDate(data.getDate() + 7); // 7 dias depois

      const result = await db
        .select({ 
          preco_medio: sql<number>`CAST(AVG(${abastecimentos.preco_litro}) AS DECIMAL(10,2))` 
        })
        .from(abastecimentos)
        .leftJoin(veiculos, eq(abastecimentos.id_veiculo, veiculos.id))
        .where(
          and(
            eq(veiculos.tipo_combustivel, tipoCombustivel),
            gte(abastecimentos.data_abastecimento, dataInicio.toISOString()),
            lte(abastecimentos.data_abastecimento, dataFim.toISOString()),
            isNull(abastecimentos.deleted_at)
          )
        );

      return result[0]?.preco_medio || null;
    } catch (error) {
      console.warn('Erro ao buscar preço real:', error);
      return null;
    }
  }

  private static buscarPrecoMedioCombustivel(tipoCombustivel: string): number {
    return FUEL_PRICES[tipoCombustivel] || FUEL_PRICES['Gasolina'];
  }
}

class ExpenseCalculator {
  static async buscarDespesasJornada(
    userId: string,
    dataInicio: Date | null,
    dataFim: Date | null,
    idJornada: string
  ): Promise<number> {
    if (!dataInicio || !dataFim) return 0;

    try {
      const result = await db
        .select({ total: sql<number>`CAST(COALESCE(SUM(${despesas.valor_despesa}), 0) AS DECIMAL(10,2))` })
        .from(despesas)
        .where(
          and(
            eq(despesas.id_usuario, userId),
            gte(despesas.data_despesa, DateHelper.formatDateForSQL(dataInicio)),
            lte(despesas.data_despesa, DateHelper.formatDateForSQL(dataFim)),
            isNull(despesas.deleted_at)
          )
        );

      return Math.round(Number(result[0]?.total || 0));
    } catch (error) {
      console.warn('Erro ao buscar despesas da jornada:', error);
      return 0;
    }
  }
}

class StatisticsCalculator {
  static calcularEstatisticasJornadas(jornadas: JourneyReport[]): JourneyStats {
    if (jornadas.length === 0) {
      return {
        total_ganho_bruto: 0,
        total_custo_estimado: 0,
        total_lucro_liquido: 0,
        media_ganho_por_jornada: 0,
        media_lucro_por_jornada: 0,
        margem_lucro_media: 0,
        total_km: 0,
        media_km_por_jornada: 0,
        total_jornadas: 0
      };
    }

    const totals = jornadas.reduce((acc, jornada) => ({
      ganhoBruto: acc.ganhoBruto + jornada.financeiro.ganho_bruto,
      custoEstimado: acc.custoEstimado + jornada.financeiro.custo_combustivel_estimado + jornada.financeiro.outras_despesas,
      lucroLiquido: acc.lucroLiquido + jornada.financeiro.lucro_liquido_estimado,
      km: acc.km + (jornada.quilometragem.total || 0)
    }), { ganhoBruto: 0, custoEstimado: 0, lucroLiquido: 0, km: 0 });

    return {
      total_ganho_bruto: totals.ganhoBruto,
      total_custo_estimado: totals.custoEstimado,
      total_lucro_liquido: totals.lucroLiquido,
      media_ganho_por_jornada: Math.round(totals.ganhoBruto / jornadas.length),
      media_lucro_por_jornada: Math.round(totals.lucroLiquido / jornadas.length),
      margem_lucro_media: totals.ganhoBruto > 0 ? 
        Math.round((totals.lucroLiquido / totals.ganhoBruto) * 10000) / 100 : 0,
      total_km: totals.km,
      media_km_por_jornada: Math.round(totals.km / jornadas.length),
      total_jornadas: jornadas.length
    };
  }
}

// ====================== EXPENSE ANALYZER ======================

class ExpenseAnalyzer {
  static async analisarDespesasPorCategoria(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<ExpenseByCategory[]> {
    try {
      const whereConditions = QueryBuilder.buildExpenseWhereConditions(userId, dataInicio, dataFim, idVeiculo);

      const result = await db
        .select({
          categoria: despesas.categoria,
          total: sql<number>`CAST(COALESCE(SUM(${despesas.valor_despesa}), 0) AS DECIMAL(10,2))`,
          quantidade: sql<number>`CAST(COUNT(*) AS INTEGER)`
        })
        .from(despesas)
        .where(whereConditions)
        .groupBy(despesas.categoria)
        .orderBy(sql`SUM(${despesas.valor_despesa}) DESC`);

      const totalGeral = result.reduce((acc, item) => acc + Number(item.total), 0);

      return result.map(item => ({
        categoria: EXPENSE_CATEGORIES[item.categoria as keyof typeof EXPENSE_CATEGORIES] || item.categoria,
        total: Math.round(Number(item.total)),
        percentual: totalGeral > 0 ? Math.round((Number(item.total) / totalGeral) * 10000) / 100 : 0,
        quantidade: Number(item.quantidade)
      }));

    } catch (error) {
      console.error('Erro ao analisar despesas por categoria:', error);
      return [];
    }
  }

  static async analisarEvolucaoDespesas(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<ExpenseEvolution[]> {
    try {
      const whereConditions = QueryBuilder.buildExpenseWhereConditions(userId, dataInicio, dataFim, idVeiculo);

      const result = await db
        .select({
          data: sql<string>`DATE(${despesas.data_despesa})`,
          categoria: despesas.categoria,
          total: sql<number>`CAST(COALESCE(SUM(${despesas.valor_despesa}), 0) AS DECIMAL(10,2))`
        })
        .from(despesas)
        .where(whereConditions)
        .groupBy(sql`DATE(${despesas.data_despesa})`, despesas.categoria)
        .orderBy(sql`DATE(${despesas.data_despesa})`, despesas.categoria);

      return result.map(item => ({
        data: item.data,
        categoria: EXPENSE_CATEGORIES[item.categoria as keyof typeof EXPENSE_CATEGORIES] || item.categoria,
        total: Math.round(Number(item.total))
      }));

    } catch (error) {
      console.error('Erro ao analisar evolução de despesas:', error);
      return [];
    }
  }

  static async compararDespesasVeiculos(
    userId: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<VehicleComparison[]> {
    try {
      const result = await db
        .select({
          id_veiculo: despesas.id_veiculo,
          veiculo_marca: veiculos.marca,
          veiculo_modelo: veiculos.modelo,
          veiculo_placa: veiculos.placa,
          total_despesas: sql<number>`CAST(COALESCE(SUM(${despesas.valor_despesa}), 0) AS DECIMAL(10,2))`,
          km_total: sql<number>`CAST(COALESCE(SUM(${jornadas.km_total}), 0) AS DECIMAL(10,2))`
        })
        .from(despesas)
        .leftJoin(veiculos, eq(despesas.id_veiculo, veiculos.id))
        .leftJoin(jornadas, and(
          eq(jornadas.id_veiculo, despesas.id_veiculo),
          eq(jornadas.id_usuario, userId),
          gte(jornadas.data_fim, DateHelper.formatDateForSQL(dataInicio)),
          lte(jornadas.data_fim, DateHelper.formatDateForSQL(dataFim)),
          isNull(jornadas.deleted_at)
        ))
        .where(
          and(
            eq(despesas.id_usuario, userId),
            gte(despesas.data_despesa, DateHelper.formatDateForSQL(dataInicio)),
            lte(despesas.data_despesa, DateHelper.formatDateForSQL(dataFim)),
            isNull(despesas.deleted_at),
            isNotNull(despesas.id_veiculo)
          )
        )
        .groupBy(despesas.id_veiculo, veiculos.marca, veiculos.modelo, veiculos.placa)
        .orderBy(sql`SUM(${despesas.valor_despesa}) DESC`);

      return result.map(item => ({
        id_veiculo: item.id_veiculo || '',
        veiculo: `${item.veiculo_marca || 'N/A'} ${item.veiculo_modelo || 'N/A'} (${item.veiculo_placa || 'N/A'})`,
        total_despesas: Math.round(Number(item.total_despesas)),
        km_total: Number(item.km_total),
        custo_por_km: Number(item.km_total) > 0 ? 
          Math.round((Number(item.total_despesas) / Number(item.km_total)) * 100) / 100 : 0
      }));

    } catch (error) {
      console.error('Erro ao comparar despesas por veículo:', error);
      return [];
    }
  }

  static async analisarGastosCombustivel(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<FuelAnalysisData> {
    try {
      const whereConditions = QueryBuilder.buildFuelWhereConditions(userId, dataInicio, dataFim, idVeiculo);

      const result = await db
        .select({
          custo_total: sql<number>`CAST(COALESCE(SUM(${abastecimentos.valor_total}), 0) AS DECIMAL(10,2))`,
          litros_total: sql<number>`CAST(COALESCE(SUM(${abastecimentos.litros}), 0) AS DECIMAL(10,2))`,
          preco_medio: sql<number>`CAST(COALESCE(AVG(${abastecimentos.preco_litro}), 0) AS DECIMAL(10,2))`,
          km_total: sql<number>`CAST(COALESCE(SUM(${abastecimentos.km_atual} - ${abastecimentos.km_anterior}), 0) AS DECIMAL(10,2))`
        })
        .from(abastecimentos)
        .where(whereConditions);

      const data = result[0];
      const litrosTotal = Number(data?.litros_total || 0);
      const kmTotal = Number(data?.km_total || 0);

      return {
        consumo_medio: kmTotal > 0 && litrosTotal > 0 ? 
          Math.round((kmTotal / litrosTotal) * 100) / 100 : 0,
        custo_total: Math.round(Number(data?.custo_total || 0)),
        litros_total: Math.round(litrosTotal * 100) / 100,
        preco_medio_litro: Math.round(Number(data?.preco_medio || 0))
      };

    } catch (error) {
      console.error('Erro ao analisar gastos com combustível:', error);
      return {
        consumo_medio: 0,
        custo_total: 0,
        litros_total: 0,
        preco_medio_litro: 0
      };
    }
  }

  static async obterResumoGeral(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    try {
      const whereConditions = QueryBuilder.buildExpenseWhereConditions(userId, dataInicio, dataFim, idVeiculo);

      const result = await db
        .select({
          total_despesas: sql<number>`CAST(COALESCE(SUM(${despesas.valor_despesa}), 0) AS DECIMAL(10,2))`,
          quantidade_despesas: sql<number>`CAST(COUNT(*) AS INTEGER)`,
          maior_despesa: sql<number>`CAST(COALESCE(MAX(${despesas.valor_despesa}), 0) AS DECIMAL(10,2))`,
          menor_despesa: sql<number>`CAST(COALESCE(MIN(${despesas.valor_despesa}), 0) AS DECIMAL(10,2))`,
          media_despesa: sql<number>`CAST(COALESCE(AVG(${despesas.valor_despesa}), 0) AS DECIMAL(10,2))`
        })
        .from(despesas)
        .where(whereConditions);

      const data = result[0];

      return {
        total_despesas: Math.round(Number(data?.total_despesas || 0)),
        quantidade_despesas: Number(data?.quantidade_despesas || 0),
        maior_despesa: Math.round(Number(data?.maior_despesa || 0)),
        menor_despesa: Math.round(Number(data?.menor_despesa || 0)),
        media_despesa: Math.round(Number(data?.media_despesa || 0))
      };

    } catch (error) {
      console.error('Erro ao obter resumo geral de despesas:', error);
      return {
        total_despesas: 0,
        quantidade_despesas: 0,
        maior_despesa: 0,
        menor_despesa: 0,
        media_despesa: 0
      };
    }
  }
}

// ====================== FUEL ANALYZER ======================

class FuelAnalyzer {
  static async analisarConsumoPorVeiculo(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    try {
      const whereConditions = QueryBuilder.buildFuelWhereConditions(userId, dataInicio, dataFim, idVeiculo);

      const result = await db
        .select({
          id_veiculo: abastecimentos.id_veiculo,
          veiculo_marca: veiculos.marca,
          veiculo_modelo: veiculos.modelo,
          veiculo_placa: veiculos.placa,
          tipo_combustivel: veiculos.tipo_combustivel,
          total_litros: sql<number>`CAST(COALESCE(SUM(${abastecimentos.litros}), 0) AS DECIMAL(10,2))`,
          total_valor: sql<number>`CAST(COALESCE(SUM(${abastecimentos.valor_total}), 0) AS DECIMAL(10,2))`,
          km_percorridos: sql<number>`CAST(COALESCE(SUM(${abastecimentos.km_atual} - ${abastecimentos.km_anterior}), 0) AS DECIMAL(10,2))`,
          quantidade_abastecimentos: sql<number>`CAST(COUNT(*) AS INTEGER)`
        })
        .from(abastecimentos)
        .leftJoin(veiculos, eq(abastecimentos.id_veiculo, veiculos.id))
        .where(whereConditions)
        .groupBy(
          abastecimentos.id_veiculo,
          veiculos.marca,
          veiculos.modelo,
          veiculos.placa,
          veiculos.tipo_combustivel
        )
        .orderBy(sql`SUM(${abastecimentos.valor_total}) DESC`);

      return result.map(item => {
        const kmPercorridos = Number(item.km_percorridos);
        const litrosConsumidos = Number(item.total_litros);
        
        return {
          id_veiculo: item.id_veiculo,
          veiculo: `${item.veiculo_marca || 'N/A'} ${item.veiculo_modelo || 'N/A'}`,
          placa: item.veiculo_placa,
          tipo_combustivel: item.tipo_combustivel,
          consumo_medio: kmPercorridos > 0 && litrosConsumidos > 0 ? 
            Math.round((kmPercorridos / litrosConsumidos) * 100) / 100 : 0,
          total_litros: Math.round(litrosConsumidos * 100) / 100,
          total_valor: Math.round(Number(item.total_valor)),
          km_percorridos: kmPercorridos,
          quantidade_abastecimentos: Number(item.quantidade_abastecimentos)
        };
      });

    } catch (error) {
      console.error('Erro ao analisar consumo por veículo:', error);
      return [];
    }
  }

  static async analisarEvolucaoPrecos(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any[]> {
    try {
      const whereConditions = QueryBuilder.buildFuelWhereConditions(userId, dataInicio, dataFim, idVeiculo);

      const result = await db
        .select({
          data: sql<string>`DATE(${abastecimentos.data_abastecimento})`,
          tipo_combustivel: veiculos.tipo_combustivel,
          preco_medio: sql<number>`CAST(AVG(${abastecimentos.preco_litro}) AS DECIMAL(10,2))`,
          quantidade_abastecimentos: sql<number>`CAST(COUNT(*) AS INTEGER)`
        })
        .from(abastecimentos)
        .leftJoin(veiculos, eq(abastecimentos.id_veiculo, veiculos.id))
        .where(whereConditions)
        .groupBy(sql`DATE(${abastecimentos.data_abastecimento})`, veiculos.tipo_combustivel)
        .orderBy(sql`DATE(${abastecimentos.data_abastecimento})`);

      return result.map(item => ({
        data: item.data,
        tipo_combustivel: item.tipo_combustivel,
        preco_medio: Math.round(Number(item.preco_medio)),
        quantidade_abastecimentos: Number(item.quantidade_abastecimentos)
      }));

    } catch (error) {
      console.error('Erro ao analisar evolução de preços:', error);
      return [];
    }
  }

  static async compararTiposCombustivel(
    userId: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<any> {
    try {
      const whereConditions = QueryBuilder.buildFuelWhereConditions(userId, dataInicio, dataFim);

      const result = await db
        .select({
          tipo_combustivel: veiculos.tipo_combustivel,
          preco_medio: sql<number>`CAST(AVG(${abastecimentos.preco_litro}) AS DECIMAL(10,2))`,
          consumo_medio: sql<number>`CAST(AVG((${abastecimentos.km_atual} - ${abastecimentos.km_anterior}) / ${abastecimentos.litros}) AS DECIMAL(10,2))`,
          total_gasto: sql<number>`CAST(SUM(${abastecimentos.valor_total}) AS DECIMAL(10,2))`,
          total_litros: sql<number>`CAST(SUM(${abastecimentos.litros}) AS DECIMAL(10,2))`,
          quantidade_abastecimentos: sql<number>`CAST(COUNT(*) AS INTEGER)`
        })
        .from(abastecimentos)
        .leftJoin(veiculos, eq(abastecimentos.id_veiculo, veiculos.id))
        .where(and(whereConditions, isNotNull(veiculos.tipo_combustivel)))
        .groupBy(veiculos.tipo_combustivel)
        .orderBy(sql`AVG(${abastecimentos.preco_litro})`);

      const comparacao: any = {};
      
      result.forEach(item => {
        if (item.tipo_combustivel) {
          comparacao[item.tipo_combustivel] = {
            preco_medio: Math.round(Number(item.preco_medio)),
            consumo_medio: Math.round(Number(item.consumo_medio || 0) * 100) / 100,
            total_gasto: Math.round(Number(item.total_gasto)),
            total_litros: Math.round(Number(item.total_litros) * 100) / 100,
            quantidade_abastecimentos: Number(item.quantidade_abastecimentos)
          };
        }
      });

      return comparacao;

    } catch (error) {
      console.error('Erro ao comparar tipos de combustível:', error);
      return {};
    }
  }

  static async analisarEficienciaCombustivel(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    try {
      const whereConditions = QueryBuilder.buildFuelWhereConditions(userId, dataInicio, dataFim, idVeiculo);

      const result = await db
        .select({
          melhor_consumo: sql<number>`CAST(MAX((${abastecimentos.km_atual} - ${abastecimentos.km_anterior}) / ${abastecimentos.litros}) AS DECIMAL(10,2))`,
          pior_consumo: sql<number>`CAST(MIN((${abastecimentos.km_atual} - ${abastecimentos.km_anterior}) / ${abastecimentos.litros}) AS DECIMAL(10,2))`,
          consumo_medio: sql<number>`CAST(AVG((${abastecimentos.km_atual} - ${abastecimentos.km_anterior}) / ${abastecimentos.litros}) AS DECIMAL(10,2))`,
          desvio_padrao: sql<number>`CAST(SQRT(AVG(POWER(((${abastecimentos.km_atual} - ${abastecimentos.km_anterior}) / ${abastecimentos.litros}) - (SELECT AVG((${abastecimentos.km_atual} - ${abastecimentos.km_anterior}) / ${abastecimentos.litros}) FROM ${abastecimentos} WHERE ${whereConditions}), 2))) AS DECIMAL(10,2))`
        })
        .from(abastecimentos)
        .leftJoin(veiculos, eq(abastecimentos.id_veiculo, veiculos.id))
        .where(
          and(
            whereConditions,
            sql`(${abastecimentos.km_atual} - ${abastecimentos.km_anterior}) > 0`,
            sql`${abastecimentos.litros} > 0`
          )
        );

      const data = result[0];

      return {
        melhor_consumo: Math.round(Number(data?.melhor_consumo || 0) * 100) / 100,
        pior_consumo: Math.round(Number(data?.pior_consumo || 0) * 100) / 100,
        consumo_medio: Math.round(Number(data?.consumo_medio || 0) * 100) / 100,
        variabilidade: Math.round(Number(data?.desvio_padrao || 0) * 100) / 100
      };

    } catch (error) {
      console.error('Erro ao analisar eficiência de combustível:', error);
      return {
        melhor_consumo: 0,
        pior_consumo: 0,
        consumo_medio: 0,
        variabilidade: 0
      };
    }
  }

  static async obterResumoAbastecimentos(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    try {
      const whereConditions = QueryBuilder.buildFuelWhereConditions(userId, dataInicio, dataFim, idVeiculo);

      const result = await db
        .select({
          total_abastecimentos: sql<number>`CAST(COUNT(*) AS INTEGER)`,
          total_litros: sql<number>`CAST(COALESCE(SUM(${abastecimentos.litros}), 0) AS DECIMAL(10,2))`,
          total_valor: sql<number>`CAST(COALESCE(SUM(${abastecimentos.valor_total}), 0) AS DECIMAL(10,2))`,
          preco_medio: sql<number>`CAST(COALESCE(AVG(${abastecimentos.preco_litro}), 0) AS DECIMAL(10,2))`,
          maior_abastecimento: sql<number>`CAST(COALESCE(MAX(${abastecimentos.valor_total}), 0) AS DECIMAL(10,2))`,
          menor_abastecimento: sql<number>`CAST(COALESCE(MIN(${abastecimentos.valor_total}), 0) AS DECIMAL(10,2))`
        })
        .from(abastecimentos)
        .where(whereConditions);

      const data = result[0];

      return {
        total_abastecimentos: Number(data?.total_abastecimentos || 0),
        total_litros: Math.round(Number(data?.total_litros || 0) * 100) / 100,
        total_valor: Math.round(Number(data?.total_valor || 0)),
        preco_medio: Math.round(Number(data?.preco_medio || 0)),
        maior_abastecimento: Math.round(Number(data?.maior_abastecimento || 0)),
        menor_abastecimento: Math.round(Number(data?.menor_abastecimento || 0))
      };

    } catch (error) {
      console.error('Erro ao obter resumo de abastecimentos:', error);
      return {
        total_abastecimentos: 0,
        total_litros: 0,
        total_valor: 0,
        preco_medio: 0,
        maior_abastecimento: 0,
        menor_abastecimento: 0
      };
    }
  }
}

// ====================== DASHBOARD ANALYZER ======================

class DashboardAnalyzer {
  static async obterEstatisticasJornadas(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    try {
      const whereConditions = QueryBuilder.buildJourneyWhereConditions(userId, dataInicio, dataFim, idVeiculo);

      const result = await db
        .select({
          total_jornadas: sql<number>`CAST(COUNT(*) AS INTEGER)`,
          total_km: sql<number>`CAST(COALESCE(SUM(${jornadas.km_total}), 0) AS DECIMAL(10,2))`,
          total_ganho: sql<number>`CAST(COALESCE(SUM(${jornadas.ganho_bruto}), 0) AS DECIMAL(10,2))`,
          tempo_total: sql<number>`CAST(COALESCE(SUM(${jornadas.tempo_total}), 0) AS INTEGER)`,
          media_ganho: sql<number>`CAST(COALESCE(AVG(${jornadas.ganho_bruto}), 0) AS DECIMAL(10,2))`,
          media_km: sql<number>`CAST(COALESCE(AVG(${jornadas.km_total}), 0) AS DECIMAL(10,2))`
        })
        .from(jornadas)
        .where(whereConditions);

      const data = result[0];

      return {
        total_jornadas: Number(data?.total_jornadas || 0),
        total_km: Math.round(Number(data?.total_km || 0)),
        total_ganho: Math.round(Number(data?.total_ganho || 0)),
        tempo_total_minutos: Number(data?.tempo_total || 0),
        tempo_total_horas: Math.round((Number(data?.tempo_total || 0) / 60) * 100) / 100,
        media_ganho: Math.round(Number(data?.media_ganho || 0)),
        media_km: Math.round(Number(data?.media_km || 0))
      };

    } catch (error) {
      console.error('Erro ao obter estatísticas de jornadas:', error);
      return {
        total_jornadas: 0,
        total_km: 0,
        total_ganho: 0,
        tempo_total_minutos: 0,
        tempo_total_horas: 0,
        media_ganho: 0,
        media_km: 0
      };
    }
  }

  static async obterTotalDespesas(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    try {
      const whereConditions = QueryBuilder.buildExpenseWhereConditions(userId, dataInicio, dataFim, idVeiculo);

      const result = await db
        .select({
          total_despesas: sql<number>`CAST(COALESCE(SUM(${despesas.valor_despesa}), 0) AS DECIMAL(10,2))`,
          quantidade_despesas: sql<number>`CAST(COUNT(*) AS INTEGER)`
        })
        .from(despesas)
        .where(whereConditions);

      const data = result[0];

      return {
        total_despesas: Math.round(Number(data?.total_despesas || 0)),
        quantidade_despesas: Number(data?.quantidade_despesas || 0)
      };

    } catch (error) {
      console.error('Erro ao obter total de despesas:', error);
      return {
        total_despesas: 0,
        quantidade_despesas: 0
      };
    }
  }

  static async obterTotalAbastecimentos(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    try {
      const whereConditions = QueryBuilder.buildFuelWhereConditions(userId, dataInicio, dataFim, idVeiculo);

      const result = await db
        .select({
          total_abastecimentos: sql<number>`CAST(COUNT(*) AS INTEGER)`,
          total_valor: sql<number>`CAST(COALESCE(SUM(${abastecimentos.valor_total}), 0) AS DECIMAL(10,2))`,
          total_litros: sql<number>`CAST(COALESCE(SUM(${abastecimentos.litros}), 0) AS DECIMAL(10,2))`
        })
        .from(abastecimentos)
        .where(whereConditions);

      const data = result[0];

      return {
        total_abastecimentos: Number(data?.total_abastecimentos || 0),
        total_valor: Math.round(Number(data?.total_valor || 0)),
        total_litros: Math.round(Number(data?.total_litros || 0) * 100) / 100
      };

    } catch (error) {
      console.error('Erro ao obter total de abastecimentos:', error);
      return {
        total_abastecimentos: 0,
        total_valor: 0,
        total_litros: 0
      };
    }
  }

  static async obterVeiculoMaisUtilizado(
    userId: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<any> {
    try {
      const whereConditions = QueryBuilder.buildJourneyWhereConditions(userId, dataInicio, dataFim);

      const result = await db
        .select({
          id_veiculo: jornadas.id_veiculo,
          veiculo_marca: veiculos.marca,
          veiculo_modelo: veiculos.modelo,
          veiculo_placa: veiculos.placa,
          total_jornadas: sql<number>`CAST(COUNT(*) AS INTEGER)`,
          total_km: sql<number>`CAST(COALESCE(SUM(${jornadas.km_total}), 0) AS DECIMAL(10,2))`
        })
        .from(jornadas)
        .leftJoin(veiculos, eq(jornadas.id_veiculo, veiculos.id))
        .where(and(whereConditions, isNotNull(jornadas.id_veiculo)))
        .groupBy(jornadas.id_veiculo, veiculos.marca, veiculos.modelo, veiculos.placa)
        .orderBy(sql`COUNT(*) DESC`)
        .limit(1);

      const data = result[0];
      
      if (!data) return null;

      return {
        id_veiculo: data.id_veiculo,
        veiculo: `${data.veiculo_marca || 'N/A'} ${data.veiculo_modelo || 'N/A'}`,
        placa: data.veiculo_placa,
        total_jornadas: Number(data.total_jornadas),
        total_km: Math.round(Number(data.total_km))
      };

    } catch (error) {
      console.error('Erro ao obter veículo mais utilizado:', error);
      return null;
    }
  }

  static async obterMelhorDesempenho(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    try {
      const whereConditions = QueryBuilder.buildJourneyWhereConditions(userId, dataInicio, dataFim, idVeiculo);

      const result = await db
        .select({
          melhor_ganho: sql<number>`CAST(MAX(${jornadas.ganho_bruto}) AS DECIMAL(10,2))`,
          maior_km: sql<number>`CAST(MAX(${jornadas.km_total}) AS DECIMAL(10,2))`,
          melhor_tempo: sql<number>`CAST(MIN(${jornadas.tempo_total}) AS INTEGER)`,
          data_melhor_ganho: sql<string>`(SELECT ${jornadas.data_inicio} FROM ${jornadas} WHERE ${whereConditions} AND ${jornadas.ganho_bruto} = MAX(${jornadas.ganho_bruto}) LIMIT 1)`
        })
        .from(jornadas)
        .where(whereConditions);

      const data = result[0];

      return {
        melhor_ganho: Math.round(Number(data?.melhor_ganho || 0)),
        maior_km: Math.round(Number(data?.maior_km || 0)),
        melhor_tempo: Number(data?.melhor_tempo || 0),
        data_melhor_ganho: data?.data_melhor_ganho
      };

    } catch (error) {
      console.error('Erro ao obter melhor desempenho:', error);
      return {
        melhor_ganho: 0,
        maior_km: 0,
        melhor_tempo: 0,
        data_melhor_ganho: null
      };
    }
  }
}

// ====================== CSV GENERATOR ======================

class CSVGenerator {
  static gerarCSVJornadas(jornadas: JourneyReport[]): string {
    const headers = [
      'ID Jornada',
      'Data Início',
      'Data Fim',
      'Duração (min)',
      'Veículo Marca',
      'Veículo Modelo',
      'Placa',
      'Tipo Combustível',
      'KM Início',
      'KM Fim',
      'KM Total',
      'Ganho Bruto (R$)',
      'Custo Combustível (R$)',
      'Outras Despesas (R$)',
      'Lucro Líquido (R$)',
      'Margem Lucro (%)',
      'Observações'
    ].join(';');

    const rows = jornadas.map(j => [
      j.id_jornada,
      j.data_inicio || '',
      j.data_fim || '',
      j.duracao_minutos || 0,
      j.veiculo.marca || '',
      j.veiculo.modelo || '',
      j.veiculo.placa || '',
      j.veiculo.tipo_combustivel || '',
      j.quilometragem.inicio || 0,
      j.quilometragem.fim || 0,
      j.quilometragem.total || 0,
      (j.financeiro.ganho_bruto / 100).toFixed(2).replace('.', ','),
      (j.financeiro.custo_combustivel_estimado / 100).toFixed(2).replace('.', ','),
      (j.financeiro.outras_despesas / 100).toFixed(2).replace('.', ','),
      (j.financeiro.lucro_liquido_estimado / 100).toFixed(2).replace('.', ','),
      j.financeiro.margem_lucro.toString().replace('.', ','),
      (j.observacoes || '').replace(/[;\n\r]/g, ' ')
    ].join(';'));

    return [headers, ...rows].join('\n');
  }

  static gerarCSVDespesas(
    despesasPorCategoria: ExpenseByCategory[], 
    evolucaoDespesas: ExpenseEvolution[]
  ): string {
    const headersCategorias = ['Categoria', 'Total (R$)', 'Percentual (%)', 'Quantidade'].join(';');
    const rowsCategorias = despesasPorCategoria.map(d => [
      d.categoria,
      (d.total / 100).toFixed(2).replace('.', ','),
      d.percentual.toString().replace('.', ','),
      d.quantidade
    ].join(';'));

    const csvCategorias = [
      'DESPESAS POR CATEGORIA',
      headersCategorias,
      ...rowsCategorias,
      '',
      'EVOLUÇÃO TEMPORAL',
      'Data;Categoria;Total (R$)'
    ];

    const rowsEvolucao = evolucaoDespesas.map(e => [
      e.data,
      e.categoria,
      (e.total / 100).toFixed(2).replace('.', ',')
    ].join(';'));

    return [...csvCategorias, ...rowsEvolucao].join('\n');
  }

  static gerarCSVCombustivel(consumoPorVeiculo: any[], evolucaoPrecos: any[]): string {
    const headersConsumo = [
      'Veículo',
      'Placa',
      'Tipo Combustível',
      'Consumo Médio (km/l)',
      'Total Litros',
      'Total Valor (R$)',
      'KM Percorridos',
      'Abastecimentos'
    ].join(';');

    const rowsConsumo = consumoPorVeiculo.map(c => [
      c.veiculo || '',
      c.placa || '',
      c.tipo_combustivel || '',
      c.consumo_medio.toString().replace('.', ','),
      c.total_litros.toString().replace('.', ','),
      (c.total_valor / 100).toFixed(2).replace('.', ','),
      c.km_percorridos,
      c.quantidade_abastecimentos
    ].join(';'));

    const csvConsumo = [
      'CONSUMO POR VEÍCULO',
      headersConsumo,
      ...rowsConsumo,
      '',
      'EVOLUÇÃO DE PREÇOS',
      'Data;Tipo Combustível;Preço Médio (R$);Abastecimentos'
    ];

    const rowsPrecos = evolucaoPrecos.map(p => [
      p.data,
      p.tipo_combustivel || '',
      (p.preco_medio / 100).toFixed(2).replace('.', ','),
      p.quantidade_abastecimentos
    ].join(';'));

    return [...csvConsumo, ...rowsPrecos].join('\n');
  }

  static gerarCSVCompleto(
    jornadas: JourneyReport[],
    despesas: ExpenseByCategory[],
    combustivel: any[]
  ): string {
    const csvJornadas = this.gerarCSVJornadas(jornadas);
    const csvDespesas = this.gerarCSVDespesas(despesas, []);
    const csvCombustivel = this.gerarCSVCombustivel(combustivel, []);

    return [
      '=== RELATÓRIO COMPLETO ===',
      '',
      '=== JORNADAS ===',
      csvJornadas,
      '',
      '=== DESPESAS ===',
      csvDespesas,
      '',
      '=== COMBUSTÍVEL ===',
      csvCombustivel
    ].join('\n');
  }
}

// ====================== UTILITY FUNCTIONS ======================

/**
 * Utilitário para formatar valores monetários
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value / 100);
};

/**
 * Utilitário para formatar datas
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

/**
 * Utilitário para validar UUID
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Utilitário para calcular diferença de tempo em minutos
 */
export const calculateTimeDifference = (start: Date, end: Date): number => {
  return Math.abs(end.getTime() - start.getTime()) / (1000 * 60);
};

/**
 * Utilitário para validar período de datas
 */
export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate <= endDate && startDate <= new Date();
};
