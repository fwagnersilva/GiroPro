import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { jornadas, abastecimentos, despesas, veiculos } from '../db/schema';
import { eq, and, isNull, isNotNull, sql, gte, lte, sum, count, avg } from 'drizzle-orm';
import { AuthenticatedRequest } from '../types';

// Interfaces
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
}

interface JourneyReport {
  id_jornada: string;
  data_inicio: string | null;
  data_fim: string | null;
  duracao_minutos: number | null;
  veiculo: {
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

interface ReportResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
}

// Constants
const FUEL_PRICES: Record<string, number> = {
  'Gasolina': 550, // R$ 5,50 em centavos
  'Etanol': 350,   // R$ 3,50 em centavos
  'Diesel': 480,   // R$ 4,80 em centavos
  'GNV': 280,      // R$ 2,80 em centavos
  'Flex': 450      // R$ 4,50 em centavos
};

const DEFAULT_CONSUMPTION = 12; // km/l

// Schemas de validação
const reportsQuerySchema = z.object({
  periodo: z.enum(['hoje', 'semana', 'mes', 'ano', 'personalizado']).default('mes'),
  data_inicio: z.string().datetime().optional(),
  data_fim: z.string().datetime().optional(),
  id_veiculo: z.string().uuid().optional(),
  formato: z.enum(['json', 'csv']).default('json')
});

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
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(content);
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

      // Construir condições de filtro
      const whereConditions = QueryBuilder.buildJourneyWhereConditions(
        userId!,
        dataInicio,
        dataFim,
        id_veiculo
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
          veiculo_marca: veiculos.marca,
          veiculo_modelo: veiculos.modelo,
          veiculo_placa: veiculos.placa,
          veiculo_tipo_combustivel: veiculos.tipo_combustivel
        })
        .from(jornadas)
        .leftJoin(veiculos, eq(jornadas.id_veiculo, veiculos.id))
        .where(whereConditions)
        .orderBy(jornadas.data_inicio);

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
        total_jornadas: relatorioJornadas.length
      };

      if (formato === 'csv') {
        const csv = CSVGenerator.gerarCSVJornadas(relatorioJornadas);
        return ReportsController.setupCSVResponse(res, 'relatorio_jornadas.csv', csv);
      }

      return ReportsController.successResponse(res, relatorio);

    } catch (error: any) {
      console.error("Erro ao gerar relatório de jornadas:", error);
      return ReportsController.errorResponse(res, 500, "Erro interno do servidor");
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

      // Executar análises de despesas em paralelo para melhor performance
      const [
        despesasPorCategoria,
        evolucaoDespesas,
        comparacaoVeiculos,
        analiseCombustivel
      ] = await Promise.all([
        ExpenseAnalyzer.analisarDespesasPorCategoria(userId!, dataInicio, dataFim, id_veiculo),
        ExpenseAnalyzer.analisarEvolucaoDespesas(userId!, dataInicio, dataFim, id_veiculo),
        id_veiculo ? Promise.resolve(null) : ExpenseAnalyzer.compararDespesasVeiculos(userId!, dataInicio, dataFim),
        ExpenseAnalyzer.analisarGastosCombustivel(userId!, dataInicio, dataFim, id_veiculo)
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
        despesas_por_categoria: despesasPorCategoria,
        evolucao_despesas: evolucaoDespesas,
        comparacao_veiculos: comparacaoVeiculos,
        analise_combustivel: analiseCombustivel
      };

      if (formato === 'csv') {
        const csv = CSVGenerator.gerarCSVDespesas(despesasPorCategoria, evolucaoDespesas);
        return ReportsController.setupCSVResponse(res, 'relatorio_despesas.csv', csv);
      }

      return ReportsController.successResponse(res, relatorio);

    } catch (error: any) {
      console.error("Erro ao gerar relatório de despesas:", error);
      return ReportsController.errorResponse(res, 500, "Erro interno do servidor");
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

      // Executar análises de combustível em paralelo
      const [
        consumoPorVeiculo,
        evolucaoPrecos,
        comparacaoCombustiveis,
        analiseEficiencia
      ] = await Promise.all([
        FuelAnalyzer.analisarConsumoPorVeiculo(userId!, dataInicio, dataFim, id_veiculo),
        FuelAnalyzer.analisarEvolucaoPrecos(userId!, dataInicio, dataFim, id_veiculo),
        FuelAnalyzer.compararTiposCombustivel(userId!, dataInicio, dataFim),
        FuelAnalyzer.analisarEficienciaCombustivel(userId!, dataInicio, dataFim, id_veiculo)
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
        consumo_por_veiculo: consumoPorVeiculo,
        evolucao_precos: evolucaoPrecos,
        comparacao_combustiveis: comparacaoCombustiveis,
        analise_eficiencia: analiseEficiencia
      };

      if (formato === 'csv') {
        const csv = CSVGenerator.gerarCSVCombustivel(consumoPorVeiculo, evolucaoPrecos);
        return ReportsController.setupCSVResponse(res, 'relatorio_combustivel.csv', csv);
      }

      return ReportsController.successResponse(res, relatorio);

    } catch (error: any) {
      console.error("Erro ao gerar relatório de combustível:", error);
      return ReportsController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }
}

// Classes auxiliares para organização do código

class DateHelper {
  static calcularPeriodo(periodo: string, data_inicio?: string, data_fim?: string): PeriodRange {
    const agora = new Date();
    let dataInicio: Date;
    let dataFim: Date = new Date(agora);

    if (periodo === 'personalizado' && data_inicio && data_fim) {
      dataInicio = new Date(data_inicio);
      dataFim = new Date(data_fim);
    } else {
      switch (periodo) {
        case 'hoje':
          dataInicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
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
      gte(jornadas.data_fim, dataInicio.toISOString()),
      lte(jornadas.data_fim, dataFim.toISOString()),
      isNull(jornadas.deleted_at)
    );

    if (idVeiculo) {
      whereConditions = and(whereConditions, eq(jornadas.id_veiculo, idVeiculo));
    }

    return whereConditions;
  }
}

class JourneyProcessor {
  static async processJourneys(jornadasDetalhadas: any[], userId: string): Promise<JourneyReport[]> {
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

        const lucroLiquidoEstimado = (jornada.ganho_bruto || 0) - custoCombustivelEstimado - despesasJornada;

        return {
          id_jornada: jornada.id,
          data_inicio: jornada.data_inicio,
          data_fim: jornada.data_fim,
          duracao_minutos: jornada.tempo_total,
          veiculo: {
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
            ganho_bruto: jornada.ganho_bruto || 0,
            custo_combustivel_estimado: custoCombustivelEstimado,
            outras_despesas: despesasJornada,
            lucro_liquido_estimado: lucroLiquidoEstimado,
            margem_lucro: jornada.ganho_bruto ? 
              Math.round((lucroLiquidoEstimado / jornada.ganho_bruto) * 10000) / 100 : 0
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

    const precoMedio = this.buscarPrecoMedioCombustivel(tipoCombustivel, dataJornada);
    const litrosConsumidos = kmTotal / DEFAULT_CONSUMPTION;
    
    return Math.round(litrosConsumidos * precoMedio);
  }

  private static buscarPrecoMedioCombustivel(tipoCombustivel: string, data: Date): number {
    return FUEL_PRICES[tipoCombustivel] || 500;
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

    const result = await db
      .select({ total: sum(despesas.valor_despesa) })
      .from(despesas)
      .where(
        and(
          eq(despesas.id_usuario, userId),
          gte(despesas.data_despesa, dataInicio.toISOString()),
          lte(despesas.data_despesa, dataFim.toISOString()),
          isNull(despesas.deleted_at)
        )
      );

    return Number(result[0]?.total || 0);
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
        media_km_por_jornada: 0
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
      media_km_por_jornada: Math.round(totals.km / jornadas.length)
    };
  }
}

class ExpenseAnalyzer {
  static async analisarDespesasPorCategoria(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    // TODO: Implementar análise detalhada de despesas por categoria
    // Consultar banco de dados e agrupar por categoria
    return {
      combustivel: 0,
      manutencao: 0,
      seguro: 0,
      outros: 0
    };
  }

  static async analisarEvolucaoDespesas(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    // TODO: Implementar análise de evolução temporal das despesas
    return [];
  }

  static async compararDespesasVeiculos(
    userId: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<any> {
    // TODO: Implementar comparação de despesas entre veículos
    return {};
  }

  static async analisarGastosCombustivel(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    // TODO: Implementar análise específica de gastos com combustível
    return {};
  }
}

class FuelAnalyzer {
  static async analisarConsumoPorVeiculo(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    // TODO: Implementar análise de consumo por veículo
    return {};
  }

  static async analisarEvolucaoPrecos(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    // TODO: Implementar análise de evolução de preços
    return [];
  }

  static async compararTiposCombustivel(
    userId: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<any> {
    // TODO: Implementar comparação entre tipos de combustível
    return {};
  }

  static async analisarEficienciaCombustivel(
    userId: string,
    dataInicio: Date,
    dataFim: Date,
    idVeiculo?: string
  ): Promise<any> {
    // TODO: Implementar análise de eficiência de combustível
    return {};
  }
}

class CSVGenerator {
  static gerarCSVJornadas(jornadas: JourneyReport[]): string {
    const headers = [
      'ID Jornada',
      'Data Início',
      'Data Fim',
      'Veículo',
      'KM Total',
      'Ganho Bruto',
      'Custo Combustível',
      'Outras Despesas',
      'Lucro Líquido',
      'Margem Lucro (%)'
    ].join(',');

    const rows = jornadas.map(j => [
      j.id_jornada,
      j.data_inicio || '',
      j.data_fim || '',
      `${j.veiculo.marca || ''} ${j.veiculo.modelo || ''}`,
      j.quilometragem.total || 0,
      j.financeiro.ganho_bruto,
      j.financeiro.custo_combustivel_estimado,
      j.financeiro.outras_despesas,
      j.financeiro.lucro_liquido_estimado,
      j.financeiro.margem_lucro
    ].join(','));

    return [headers, ...rows].join('\n');
  }

  static gerarCSVDespesas(despesasPorCategoria: any, evolucaoDespesas: any): string {
    const headers = ['Categoria', 'Total'].join(',');
    const rows = Object.entries(despesasPorCategoria).map(([categoria, total]) => 
      `${categoria},${total}`
    );
    return [headers, ...rows].join('\n');
  }

  static gerarCSVCombustivel(consumoPorVeiculo: any, evolucaoPrecos: any): string {
    const headers = ['Veículo', 'Consumo'].join(',');
    const rows = Object.entries(consumoPorVeiculo).map(([veiculo, consumo]) => 
      `${veiculo},${consumo}`
    );
    return [headers, ...rows].join('\n');
  }
}
