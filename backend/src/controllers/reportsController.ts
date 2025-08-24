import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { jornadas, abastecimentos, despesas, veiculos } from '../db/schema';
import { eq, and, isNull, isNotNull, sql, gte, lte, sum, count, avg, desc, ne } from 'drizzle-orm';
import { AuthenticatedRequest } from '../types/auth';

// ====================== INTERFACES ======================

interface PeriodRange {
  dataInicio: Date;
  dataFim: Date;
}

interface JourneyStats {
  totalGanhoBruto: number;
  totalCustoEstimado: number;
  totalLucroLiquido: number;
  mediaGanhoPorJornada: number;
  mediaLucroPorJornada: number;
  margemLucroMedia: number;
  totalKm: number;
  mediaKmPorJornada: number;
  totalJornadas: number;
}

interface JourneyReport {
  idJornada: string;
  dataInicio: string | null;
  dataFim: string | null;
  duracaoMinutos: number | null;
  veiculo: {
    id: string | null;
    marca: string | null;
    modelo: string | null;
    placa: string | null;
    tipoCombustivel: string | null;
  };
  quilometragem: {
    inicio: number | null;
    fim: number | null;
    total: number | null;
  };
  financeiro: {
    ganhoBruto: number;
    custoCombustivelEstimado: number;
    outrasDespesas: number;
    lucroLiquidoEstimado: number;
    margemLucro: number;
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
  idVeiculo: string;
  veiculo: string;
  totalDespesas: number;
  custoPorKm: number;
  kmTotal: number;
}

interface FuelAnalysisData {
  consumoMedio: number;
  custoTotal: number;
  litrosTotal: number;
  precoMedioLitro: number;
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
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  idVeiculo: z.string().uuid().optional(),
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
      return {
        userId: null,
        error: 'Usuário não autenticado'
      };
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
      const { periodo, dataInicio, dataFim, idVeiculo, formato } = queryData!;
      const { dataInicio: parsedDataInicio, dataFim: parsedDataFim } = DateHelper.calcularPeriodo(periodo, dataInicio, dataFim);

      console.log(`[ReportsController] Gerando relatório de jornadas - Usuário: ${userId}, Período: ${periodo}`);

      // Construir condições de filtro
      const whereConditions = and(
        eq(jornadas.idUsuario, userId!),
        gte(jornadas.dataInicio, parsedDataInicio),
        lte(jornadas.dataFim, parsedDataFim),
        idVeiculo ? eq(jornadas.idVeiculo, idVeiculo) : undefined
      );

      // Buscar jornadas com informações do veículo
      const jornadasDetalhadas = await db
        .select({
          id: jornadas.id,
          dataInicio: jornadas.dataInicio,
          dataFim: jornadas.dataFim,
          kmInicio: jornadas.kmInicio,
          kmFim: jornadas.kmFim,
          kmTotal: jornadas.kmTotal,
          ganhoBruto: jornadas.ganhoBruto,
          tempoTotal: jornadas.tempoTotal,
          observacoes: jornadas.observacoes,
          idVeiculo: jornadas.idVeiculo,
          veiculoMarca: veiculos.marca,
          veiculoModelo: veiculos.modelo,
          veiculoPlaca: veiculos.placa,
          veiculoTipoCombustivel: veiculos.tipoCombustivel
        })
        .from(jornadas)
        .leftJoin(veiculos, eq(jornadas.idVeiculo, veiculos.id))
        .where(whereConditions)
        .orderBy(desc(jornadas.dataInicio));

      // Processar jornadas e calcular dados financeiros
      const relatorioJornadas = await JourneyProcessor.processJourneys(jornadasDetalhadas, userId!);

      // Calcular estatísticas do relatório
      const estatisticas = StatisticsCalculator.calcularEstatisticasJornadas(relatorioJornadas);

      const relatorio = {
        periodo: {
          tipo: periodo,
          dataInicio: parsedDataInicio.toISOString(),
          dataFim: parsedDataFim.toISOString()
        },
        filtros: {
          idVeiculo: idVeiculo || null
        },
        estatisticas,
        jornadas: relatorioJornadas,
        totalJornadas: relatorioJornadas.length,
        geradoEm: new Date().toISOString()
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
      const { periodo, dataInicio, dataFim, idVeiculo, formato } = queryData!;
      const { dataInicio: parsedDataInicio, dataFim: parsedDataFim } = DateHelper.calcularPeriodo(periodo, dataInicio, dataFim);

      console.log(`[ReportsController] Gerando relatório de despesas - Usuário: ${userId}, Período: ${periodo}`);

      // Executar análises de despesas em paralelo para melhor performance
      const [
        despesasPorCategoria,
        evolucaoDespesas,
        comparacaoVeiculos,
        analiseCombustivel,
        resumoGeral
      ] = await Promise.all([
        ExpenseAnalyzer.analisarDespesasPorCategoria(userId!, parsedDataInicio, parsedDataFim, idVeiculo),
        ExpenseAnalyzer.analisarEvolucaoDespesas(userId!, parsedDataInicio, parsedDataFim, idVeiculo),
        idVeiculo ? Promise.resolve(null) : ExpenseAnalyzer.compararDespesasVeiculos(userId!, parsedDataInicio, parsedDataFim),
        ExpenseAnalyzer.analisarGastosCombustivel(userId!, parsedDataInicio, parsedDataFim, idVeiculo),
        ExpenseAnalyzer.obterResumoGeral(userId!, parsedDataInicio, parsedDataFim, idVeiculo)
      ]);

      const relatorio = {
        periodo: {
          tipo: periodo,
          dataInicio: parsedDataInicio.toISOString(),
          dataFim: parsedDataFim.toISOString()
        },
        filtros: {
          idVeiculo: idVeiculo || null
        },
        resumoGeral: resumoGeral,
        despesasPorCategoria: despesasPorCategoria,
        evolucaoDespesas: evolucaoDespesas,
        comparacaoVeiculos: comparacaoVeiculos,
        analiseCombustivel: analiseCombustivel,
        geradoEm: new Date().toISOString()
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
      const { periodo, dataInicio, dataFim, idVeiculo, formato } = queryData!;
      const { dataInicio: parsedDataInicio, dataFim: parsedDataFim } = DateHelper.calcularPeriodo(periodo, dataInicio, dataFim);

      console.log(`[ReportsController] Gerando relatório de combustível - Usuário: ${userId}, Período: ${periodo}`);

      // Executar análises de combustível em paralelo
      const [
        consumoPorVeiculo,
        evolucaoPrecos,
        comparacaoCombustiveis,
        analiseEficiencia,
        resumoAbastecimentos
      ] = await Promise.all([
        FuelAnalyzer.analisarConsumoPorVeiculo(userId!, parsedDataInicio, parsedDataFim, idVeiculo),
        FuelAnalyzer.analisarEvolucaoPrecos(userId!, parsedDataInicio, parsedDataFim, idVeiculo),
        FuelAnalyzer.compararTiposCombustivel(userId!, parsedDataInicio, parsedDataFim),
        FuelAnalyzer.analisarEficienciaCombustivel(userId!, parsedDataInicio, parsedDataFim, idVeiculo),
        FuelAnalyzer.obterResumoAbastecimentos(userId!, parsedDataInicio, parsedDataFim, idVeiculo)
      ]);

      const relatorio = {
        periodo: {
          tipo: periodo,
          dataInicio: parsedDataInicio.toISOString(),
          dataFim: parsedDataFim.toISOString()
        },
        filtros: {
          idVeiculo: idVeiculo || null
        },
        resumoAbastecimentos: resumoAbastecimentos,
        consumoPorVeiculo: consumoPorVeiculo,
        evolucaoPrecos: evolucaoPrecos,
        comparacaoCombustiveis: comparacaoCombustiveis,
        analiseEficiencia: analiseEficiencia,
        geradoEm: new Date().toISOString()
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
      const { periodo, dataInicio, dataFim, idVeiculo } = queryData!;
      const { dataInicio: parsedDataInicio, dataFim: parsedDataFim } = DateHelper.calcularPeriodo(periodo, dataInicio, dataFim);

      console.log(`[ReportsController] Gerando dashboard - Usuário: ${userId}, Período: ${periodo}`);

      // Executar todas as consultas em paralelo para melhor performance
      const [
        estatisticasJornadas,
        totalDespesas,
        totalAbastecimentos,
        veiculoMaisUtilizado,
        melhorDesempenho
      ] = await Promise.all([
        DashboardAnalyzer.obterEstatisticasJornadas(userId!, parsedDataInicio, parsedDataFim, idVeiculo),
        DashboardAnalyzer.obterTotalDespesas(userId!, parsedDataInicio, parsedDataFim, idVeiculo),
        DashboardAnalyzer.obterTotalAbastecimentos(userId!, parsedDataInicio, parsedDataFim, idVeiculo),
        idVeiculo ? Promise.resolve(null) : DashboardAnalyzer.obterVeiculoMaisUtilizado(userId!, parsedDataInicio, parsedDataFim),
        DashboardAnalyzer.obterMelhorDesempenho(userId!, parsedDataInicio, parsedDataFim, idVeiculo)
      ]);

      const dashboard = {
        periodo: {
          tipo: periodo,
          dataInicio: parsedDataInicio.toISOString(),
          dataFim: parsedDataFim.toISOString()
        },
        filtros: {
          idVeiculo: idVeiculo || null
        },
        resumo: {
          jornadas: estatisticasJornadas,
          despesas: totalDespesas,
          abastecimentos: totalAbastecimentos,
          veiculoMaisUtilizado: veiculoMaisUtilizado,
          melhorDesempenho: melhorDesempenho
        },
        geradoEm: new Date().toISOString()
      };

      return ReportsController.successResponse(res, dashboard);

    } catch (error: any) {
      return ReportsController.errorResponse(res, 500, "Erro ao gerar dashboard", error.message);
    }
  }
}

// ====================== HELPER CLASSES ======================

class DateHelper {
  static calcularPeriodo(periodo: string, dataInicio?: string, dataFim?: string): PeriodRange {
    const agora = new Date();
    let dataInicioObj: Date;
    let dataFimObj: Date = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 23, 59, 59, 999);

    if (periodo === 'personalizado' && dataInicio && dataFim) {
      dataInicioObj = new Date(dataInicio);
      dataFimObj = new Date(dataFim);
    } else {
      switch (periodo) {
        case 'hoje':
          dataInicioObj = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0, 0);
          break;
        case 'semana':
          dataInicioObj = new Date(agora);
          dataInicioObj.setDate(agora.getDate() - 7);
          dataInicioObj.setHours(0, 0, 0, 0);
          break;
        case 'mes':
          dataInicioObj = new Date(agora.getFullYear(), agora.getMonth(), 1, 0, 0, 0, 0);
          break;
        case 'ano':
          dataInicioObj = new Date(agora.getFullYear(), 0, 1, 0, 0, 0, 0);
          break;
        default:
          dataInicioObj = new Date(agora.getFullYear(), agora.getMonth(), 1, 0, 0, 0, 0);
      }
    }

    return { dataInicio: dataInicioObj, dataFim: dataFimObj };
  }

  static formatDateForSQL(date: Date): number {
    return date.getTime();
  }
}

class JourneyProcessor {
  static async processJourneys(jornadasDetalhadas: any[], userId: string): Promise<JourneyReport[]> {
    const relatorioJornadas: JourneyReport[] = [];

    for (const jornada of jornadasDetalhadas) {
      const custoCombustivelEstimado = await this.calcularCustoCombustivelEstimado(jornada);
      const outrasDespesas = await this.calcularOutrasDespesas(userId, jornada.idVeiculo, new Date(jornada.dataInicio), new Date(jornada.dataFim));

      const lucroLiquidoEstimado = (jornada.ganhoBruto || 0) - custoCombustivelEstimado - outrasDespesas;
      const margemLucro = jornada.ganhoBruto ? (lucroLiquidoEstimado / jornada.ganhoBruto) * 100 : 0;

      relatorioJornadas.push({
        idJornada: jornada.id,
        dataInicio: new Date(jornada.dataInicio).toISOString(),
        dataFim: jornada.dataFim ? new Date(jornada.dataFim).toISOString() : null,
        duracaoMinutos: jornada.tempoTotal,
        veiculo: {
          id: jornada.idVeiculo,
          marca: jornada.veiculoMarca,
          modelo: jornada.veiculoModelo,
          placa: jornada.veiculoPlaca,
          tipoCombustivel: jornada.veiculoTipoCombustivel,
        },
        quilometragem: {
          inicio: jornada.kmInicio,
          fim: jornada.kmFim,
          total: jornada.kmTotal,
        },
        financeiro: {
          ganhoBruto: jornada.ganhoBruto || 0,
          custoCombustivelEstimado,
          outrasDespesas,
          lucroLiquidoEstimado,
          margemLucro,
        },
        observacoes: jornada.observacoes,
      });
    }
    return relatorioJornadas;
  }

  static async calcularCustoCombustivelEstimado(jornada: any): Promise<number> {
    if (!jornada.kmTotal || !jornada.veiculoTipoCombustivel) return 0;

    const consumoEstimadoLitros = jornada.kmTotal / DEFAULT_CONSUMPTION;
    const precoLitro = FUEL_PRICES[jornada.veiculoTipoCombustivel] || 0;
    return consumoEstimadoLitros * precoLitro;
  }

  static async calcularOutrasDespesas(userId: string, idVeiculo: string, dataInicio: Date, dataFim: Date): Promise<number> {
    const despesasRelacionadas = await db
      .select({ valorDespesa: sum(despesas.valorDespesa) })
      .from(despesas)
      .where(
        and(
          eq(despesas.idUsuario, userId),
          eq(despesas.idVeiculo, idVeiculo),
          gte(despesas.dataDespesa, dataInicio),
          lte(despesas.dataDespesa, dataFim),
          ne(despesas.tipoDespesa, 'combustivel') // Excluir despesas de combustível
        )
      );
    return Number(despesasRelacionadas[0]?.valorDespesa) || 0;
  }
}

class StatisticsCalculator {
  static calcularEstatisticasJornadas(jornadas: JourneyReport[]): JourneyStats {
    const totalGanhoBruto = jornadas.reduce((sum, j) => sum + j.financeiro.ganhoBruto, 0);
    const totalCustoEstimado = jornadas.reduce((sum, j) => sum + j.financeiro.custoCombustivelEstimado + j.financeiro.outrasDespesas, 0);
    const totalLucroLiquido = jornadas.reduce((sum, j) => sum + j.financeiro.lucroLiquidoEstimado, 0);
    const totalKm = jornadas.reduce((sum, j) => sum + (j.quilometragem.total || 0), 0);
    const totalJornadas = jornadas.length;

    return {
      totalGanhoBruto,
      totalCustoEstimado,
      totalLucroLiquido,
      mediaGanhoPorJornada: totalJornadas ? totalGanhoBruto / totalJornadas : 0,
      mediaLucroPorJornada: totalJornadas ? totalLucroLiquido / totalJornadas : 0,
      margemLucroMedia: totalGanhoBruto ? (totalLucroLiquido / totalGanhoBruto) * 100 : 0,
      totalKm,
      mediaKmPorJornada: totalJornadas ? totalKm / totalJornadas : 0,
      totalJornadas,
    };
  }
}

class ExpenseAnalyzer {
  static async analisarDespesasPorCategoria(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string): Promise<ExpenseByCategory[]> {
    const whereConditions = and(
      eq(despesas.idUsuario, userId),
      gte(despesas.dataDespesa, dataInicio),
      lte(despesas.dataDespesa, dataFim),
      idVeiculo ? eq(despesas.idVeiculo, idVeiculo) : undefined
    );

    const results = await db
      .select({
        tipoDespesa: despesas.tipoDespesa,
        total: sum(despesas.valorDespesa),
        quantidade: count(despesas.id),
      })
      .from(despesas)
      .where(whereConditions)
      .groupBy(despesas.tipoDespesa);

    const totalGeral = results.reduce((sum, r) => sum + Number(r.total), 0);

    return results.map(r => ({
      categoria: EXPENSE_CATEGORIES[r.tipoDespesa as keyof typeof EXPENSE_CATEGORIES] || r.tipoDespesa,
      total: Number(r.total),
      percentual: totalGeral ? (Number(r.total) / totalGeral) * 100 : 0,
      quantidade: Number(r.quantidade),
    }));
  }

  static async analisarEvolucaoDespesas(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string): Promise<ExpenseEvolution[]> {
    const whereConditions = and(
      eq(despesas.idUsuario, userId),
      gte(despesas.dataDespesa, dataInicio),
      lte(despesas.dataDespesa, dataFim),
      idVeiculo ? eq(despesas.idVeiculo, idVeiculo) : undefined
    );

    const results = await db
      .select({
        data: sql<string>`strftime('%Y-%m-%d', ${despesas.dataDespesa} / 1000, 'unixepoch')`,
        total: sum(despesas.valorDespesa),
        categoria: despesas.tipoDespesa,
      })
      .from(despesas)
      .where(whereConditions)
      .groupBy(sql`strftime('%Y-%m-%d', ${despesas.dataDespesa} / 1000, 'unixepoch')`, despesas.tipoDespesa)
      .orderBy(sql`strftime('%Y-%m-%d', ${despesas.dataDespesa} / 1000, 'unixepoch')`, despesas.tipoDespesa);

    return results.map(r => ({
      data: r.data,
      total: Number(r.total),
      categoria: EXPENSE_CATEGORIES[r.categoria as keyof typeof EXPENSE_CATEGORIES] || r.categoria,
    }));
  }

  static async compararDespesasVeiculos(userId: string, dataInicio: Date, dataFim: Date): Promise<VehicleComparison[]> {
    const results = await db
      .select({
        idVeiculo: despesas.idVeiculo,
        totalDespesas: sum(despesas.valorDespesa),
        kmTotal: sum(jornadas.kmTotal), // Assumindo que jornadas e despesas podem ser relacionadas por veículo e período
      })
      .from(despesas)
      .leftJoin(jornadas, and(
        eq(despesas.idVeiculo, jornadas.idVeiculo),
        eq(despesas.idUsuario, jornadas.idUsuario),
        gte(despesas.dataDespesa, jornadas.dataInicio),
        lte(despesas.dataDespesa, jornadas.dataFim)
      ))
      .where(
        and(
          eq(despesas.idUsuario, userId),
          gte(despesas.dataDespesa, dataInicio),
          lte(despesas.dataDespesa, dataFim)
        )
      )
      .groupBy(despesas.idVeiculo);

    const veiculosInfo = await db.select().from(veiculos).where(eq(veiculos.idUsuario, userId));
    const veiculosMap = new Map(veiculosInfo.map(v => [v.id, v.marca + ' ' + v.modelo]));

    return results.map(r => ({
      idVeiculo: r.idVeiculo || 'N/A',
      veiculo: veiculosMap.get(r.idVeiculo || '') || 'Veículo Desconhecido',
      totalDespesas: Number(r.totalDespesas) || 0,
      kmTotal: Number(r.kmTotal) || 0,
      custoPorKm: (Number(r.kmTotal) || 0) > 0 ? (Number(r.totalDespesas) || 0) / (Number(r.kmTotal) || 0) : 0,
    }));
  }

  static async analisarGastosCombustivel(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string): Promise<FuelAnalysisData> {
    const whereConditions = and(
      eq(abastecimentos.idUsuario, userId),
      gte(abastecimentos.dataAbastecimento, dataInicio),
      lte(abastecimentos.dataAbastecimento, dataFim),
      idVeiculo ? eq(abastecimentos.idVeiculo, idVeiculo) : undefined
    );

    const results = await db
      .select({
        totalLitros: sum(abastecimentos.quantidadeLitros),
        totalValor: sum(abastecimentos.valorTotal),
      })
      .from(abastecimentos)
      .where(whereConditions);

    const totalLitros = Number(results[0]?.totalLitros) || 0;
    const totalValor = Number(results[0]?.totalValor) || 0;
    const precoMedioLitro = totalLitros > 0 ? totalValor / totalLitros : 0;

    // Consumo médio (km/l) requer dados de km rodados, que não estão diretamente nos abastecimentos
    // Seria necessário correlacionar com jornadas ou ter um campo de odômetro nos abastecimentos
    const consumoMedio = DEFAULT_CONSUMPTION; // Placeholder

    return {
      consumoMedio,
      custoTotal: totalValor,
      litrosTotal: totalLitros,
      precoMedioLitro,
    };
  }

  static async obterResumoGeral(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string): Promise<any> {
    const totalJornadas = await db
      .select({ count: count(jornadas.id) })
      .from(jornadas)
      .where(
        and(
          eq(jornadas.idUsuario, userId),
          gte(jornadas.dataInicio, dataInicio),
          lte(jornadas.dataFim, dataFim),
          idVeiculo ? eq(jornadas.idVeiculo, idVeiculo) : undefined
        )
      );

    const totalGanhoBruto = await db
      .select({ total: sum(jornadas.ganhoBruto) })
      .from(jornadas)
      .where(
        and(
          eq(jornadas.idUsuario, userId),
          gte(jornadas.dataInicio, dataInicio),
          lte(jornadas.dataFim, dataFim),
          idVeiculo ? eq(jornadas.idVeiculo, idVeiculo) : undefined
        )
      );

    const totalDespesas = await db
      .select({ total: sum(despesas.valorDespesa) })
      .from(despesas)
      .where(
        and(
          eq(despesas.idUsuario, userId),
          gte(despesas.dataDespesa, dataInicio),
          lte(despesas.dataDespesa, dataFim),
          idVeiculo ? eq(despesas.idVeiculo, idVeiculo) : undefined
        )
      );

    return {
      totalJornadas: Number(totalJornadas[0]?.count) || 0,
      totalGanhoBruto: Number(totalGanhoBruto[0]?.total) || 0,
      totalDespesas: Number(totalDespesas[0]?.total) || 0,
    };
  }
}

class FuelAnalyzer {
  static async analisarConsumoPorVeiculo(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string): Promise<any[]> {
    const whereConditions = and(
      eq(abastecimentos.idUsuario, userId),
      gte(abastecimentos.dataAbastecimento, dataInicio),
      lte(abastecimentos.dataAbastecimento, dataFim),
      idVeiculo ? eq(abastecimentos.idVeiculo, idVeiculo) : undefined
    );

    const results = await db
      .select({
        idVeiculo: abastecimentos.idVeiculo,
        totalLitros: sum(abastecimentos.quantidadeLitros),
        totalValor: sum(abastecimentos.valorTotal),
      })
      .from(abastecimentos)
      .where(whereConditions)
      .groupBy(abastecimentos.idVeiculo);

    const veiculosInfo = await db.select().from(veiculos).where(eq(veiculos.idUsuario, userId));
    const veiculosMap = new Map(veiculosInfo.map(v => [v.id, v.marca + ' ' + v.modelo]));

    return results.map(r => ({
      idVeiculo: r.idVeiculo,
      veiculo: veiculosMap.get(r.idVeiculo || '') || 'Veículo Desconhecido',
      totalLitros: Number(r.totalLitros) || 0,
      totalValor: Number(r.totalValor) || 0,
      // Consumo médio (km/l) e custo por km exigiriam dados de km rodados por veículo no período
    }));
  }

  static async analisarEvolucaoPrecos(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string): Promise<any[]> {
    const whereConditions = and(
      eq(abastecimentos.idUsuario, userId),
      gte(abastecimentos.dataAbastecimento, dataInicio),
      lte(abastecimentos.dataAbastecimento, dataFim),
      idVeiculo ? eq(abastecimentos.idVeiculo, idVeiculo) : undefined
    );

    const results = await db
      .select({
        data: sql<string>`strftime('%Y-%m-%d', ${abastecimentos.dataAbastecimento} / 1000, 'unixepoch')`,
        tipoCombustivel: abastecimentos.tipoCombustivel,
        precoMedio: avg(abastecimentos.valorLitro),
      })
      .from(abastecimentos)
      .where(whereConditions)
      .groupBy(sql`strftime('%Y-%m-%d', ${abastecimentos.dataAbastecimento} / 1000, 'unixepoch')`, abastecimentos.tipoCombustivel)
      .orderBy(sql`strftime('%Y-%m-%d', ${abastecimentos.dataAbastecimento} / 1000, 'unixepoch')`, abastecimentos.tipoCombustivel);

    return results.map(r => ({
      data: r.data,
      tipoCombustivel: r.tipoCombustivel,
      precoMedio: Number(r.precoMedio) || 0,
    }));
  }

  static async compararTiposCombustivel(userId: string, dataInicio: Date, dataFim: Date): Promise<any[]> {
    const whereConditions = and(
      eq(abastecimentos.idUsuario, userId),
      gte(abastecimentos.dataAbastecimento, dataInicio),
      lte(abastecimentos.dataAbastecimento, dataFim)
    );

    const results = await db
      .select({
        tipoCombustivel: abastecimentos.tipoCombustivel,
        totalLitros: sum(abastecimentos.quantidadeLitros),
        totalValor: sum(abastecimentos.valorTotal),
      })
      .from(abastecimentos)
      .where(whereConditions)
      .groupBy(abastecimentos.tipoCombustivel);

    return results.map(r => ({
      tipoCombustivel: r.tipoCombustivel,
      totalLitros: Number(r.totalLitros) || 0,
      totalValor: Number(r.totalValor) || 0,
    }));
  }

  static async analisarEficienciaCombustivel(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string): Promise<any[]> {
    // Esta análise exige dados de km rodados por abastecimento ou por período de abastecimento
    // Por enquanto, retorna um mock ou dados limitados
    return [];
  }

  static async obterResumoAbastecimentos(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string): Promise<any> {
    const totalAbastecimentos = await db
      .select({ count: count(abastecimentos.id) })
      .from(abastecimentos)
      .where(
        and(
          eq(abastecimentos.idUsuario, userId),
          gte(abastecimentos.dataAbastecimento, dataInicio),
          lte(abastecimentos.dataAbastecimento, dataFim),
          idVeiculo ? eq(abastecimentos.idVeiculo, idVeiculo) : undefined
        )
      );

    const totalLitros = await db
      .select({ total: sum(abastecimentos.quantidadeLitros) })
      .from(abastecimentos)
      .where(
        and(
          eq(abastecimentos.idUsuario, userId),
          gte(abastecimentos.dataAbastecimento, dataInicio),
          lte(abastecimentos.dataAbastecimento, dataFim),
          idVeiculo ? eq(abastecimentos.idVeiculo, idVeiculo) : undefined
        )
      );

    const totalGasto = await db
      .select({ total: sum(abastecimentos.valorTotal) })
      .from(abastecimentos)
      .where(
        and(
          eq(abastecimentos.idUsuario, userId),
          gte(abastecimentos.dataAbastecimento, dataInicio),
          lte(abastecimentos.dataAbastecimento, dataFim),
          idVeiculo ? eq(abastecimentos.idVeiculo, idVeiculo) : undefined
        )
      );

    return {
      totalAbastecimentos: Number(totalAbastecimentos[0]?.count) || 0,
      totalLitros: Number(totalLitros[0]?.total) || 0,
      totalGasto: Number(totalGasto[0]?.total) || 0,
    };
  }
}

class DashboardAnalyzer {
  static async obterEstatisticasJornadas(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string): Promise<JourneyStats> {
    const whereConditions = and(
      eq(jornadas.idUsuario, userId),
      gte(jornadas.dataInicio, dataInicio),
      lte(jornadas.dataFim, dataFim),
      idVeiculo ? eq(jornadas.idVeiculo, idVeiculo) : undefined
    );

    const results = await db
      .select({
        totalGanhoBruto: sum(jornadas.ganhoBruto),
        totalKm: sum(jornadas.kmTotal),
        totalJornadas: count(jornadas.id),
      })
      .from(jornadas)
      .where(whereConditions);

    const totalGanhoBruto = Number(results[0]?.totalGanhoBruto) || 0;
    const totalKm = Number(results[0]?.totalKm) || 0;
    const totalJornadas = Number(results[0]?.totalJornadas) || 0;

    // Estimativas simplificadas de custo e lucro
    const totalCustoEstimado = (totalKm / DEFAULT_CONSUMPTION) * FUEL_PRICES['Gasolina']; // Estimativa
    const totalLucroLiquido = totalGanhoBruto - totalCustoEstimado;

    return {
      totalGanhoBruto,
      totalCustoEstimado,
      totalLucroLiquido,
      mediaGanhoPorJornada: totalJornadas ? totalGanhoBruto / totalJornadas : 0,
      mediaLucroPorJornada: totalJornadas ? totalLucroLiquido / totalJornadas : 0,
      margemLucroMedia: totalGanhoBruto ? (totalLucroLiquido / totalGanhoBruto) * 100 : 0,
      totalKm,
      mediaKmPorJornada: totalJornadas ? totalKm / totalJornadas : 0,
      totalJornadas,
    };
  }

  static async obterTotalDespesas(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string): Promise<number> {
    const whereConditions = and(
      eq(despesas.idUsuario, userId),
      gte(despesas.dataDespesa, dataInicio),
      lte(despesas.dataDespesa, dataFim),
      idVeiculo ? eq(despesas.idVeiculo, idVeiculo) : undefined
    );

    const result = await db
      .select({ total: sum(despesas.valorDespesa) })
      .from(despesas)
      .where(whereConditions);

    return Number(result[0]?.total) || 0;
  }

  static async obterTotalAbastecimentos(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string): Promise<number> {
    const whereConditions = and(
      eq(abastecimentos.idUsuario, userId),
      gte(abastecimentos.dataAbastecimento, dataInicio),
      lte(abastecimentos.dataAbastecimento, dataFim),
      idVeiculo ? eq(abastecimentos.idVeiculo, idVeiculo) : undefined
    );

    const result = await db
      .select({ total: sum(abastecimentos.valorTotal) })
      .from(abastecimentos)
      .where(whereConditions);

    return Number(result[0]?.total) || 0;
  }

  static async obterVeiculoMaisUtilizado(userId: string, dataInicio: Date, dataFim: Date): Promise<any> {
    const results = await db
      .select({
        idVeiculo: jornadas.idVeiculo,
        totalKm: sum(jornadas.kmTotal),
      })
      .from(jornadas)
      .where(
        and(
          eq(jornadas.idUsuario, userId),
          gte(jornadas.dataInicio, dataInicio),
          lte(jornadas.dataFim, dataFim)
        )
      )
      .groupBy(jornadas.idVeiculo)
      .orderBy(desc(sql`totalKm`))
      .limit(1);

    if (results.length === 0) return null;

    const veiculoInfo = await db.select().from(veiculos).where(eq(veiculos.id, results[0].idVeiculo)).limit(1);

    return {
      idVeiculo: results[0].idVeiculo,
      nome: veiculoInfo[0]?.marca + ' ' + veiculoInfo[0]?.modelo,
      totalKm: Number(results[0].totalKm),
    };
  }

  static async obterMelhorDesempenho(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string): Promise<any> {
    const whereConditions = and(
      eq(jornadas.idUsuario, userId),
      gte(jornadas.dataInicio, dataInicio),
      lte(jornadas.dataFim, dataFim),
      idVeiculo ? eq(jornadas.idVeiculo, idVeiculo) : undefined
    );

    const results = await db
      .select({
        idJornada: jornadas.id,
        ganhoBruto: jornadas.ganhoBruto,
        kmTotal: jornadas.kmTotal,
        dataInicio: jornadas.dataInicio,
        dataFim: jornadas.dataFim,
        idVeiculo: jornadas.idVeiculo,
      })
      .from(jornadas)
      .where(whereConditions)
      .orderBy(desc(jornadas.ganhoBruto))
      .limit(1);

    if (results.length === 0) return null;

    const melhorJornada = results[0];

    // Para calcular o lucro líquido, precisamos do custo de combustível e outras despesas daquela jornada
    const custoCombustivelEstimado = await JourneyProcessor.calcularCustoCombustivelEstimado(melhorJornada);
    const outrasDespesas = await JourneyProcessor.calcularOutrasDespesas(userId, melhorJornada.idVeiculo, new Date(melhorJornada.dataInicio), new Date(melhorJornada.dataFim));

    const lucroLiquido = (melhorJornada.ganhoBruto || 0) - custoCombustivelEstimado - outrasDespesas;

    return {
      idJornada: melhorJornada.idJornada,
      ganhoBruto: melhorJornada.ganhoBruto,
      kmTotal: melhorJornada.kmTotal,
      lucroLiquido,
      data: new Date(melhorJornada.dataInicio).toISOString().split('T')[0],
    };
  }
}

class CSVGenerator {
  static gerarCSVJornadas(jornadas: JourneyReport[]): string {
    const headers = [
      'ID Jornada',
      'Data Início',
      'Data Fim',
      'Duração (minutos)',
      'Marca Veículo',
      'Modelo Veículo',
      'Placa Veículo',
      'Tipo Combustível Veículo',
      'KM Início',
      'KM Fim',
      'KM Total',
      'Ganho Bruto',
      'Custo Combustível Estimado',
      'Outras Despesas',
      'Lucro Líquido Estimado',
      'Margem Lucro (%)',
      'Observações',
    ];

    const rows = jornadas.map(j => [
      j.idJornada,
      j.dataInicio || '',
      j.dataFim || '',
      j.duracaoMinutos || '',
      j.veiculo.marca || '',
      j.veiculo.modelo || '',
      j.veiculo.placa || '',
      j.veiculo.tipoCombustivel || '',
      j.quilometragem.inicio || '',
      j.quilometragem.fim || '',
      j.quilometragem.total || '',
      (j.financeiro.ganhoBruto / 100).toFixed(2), // Converter centavos para reais
      (j.financeiro.custoCombustivelEstimado / 100).toFixed(2),
      (j.financeiro.outrasDespesas / 100).toFixed(2),
      (j.financeiro.lucroLiquidoEstimado / 100).toFixed(2),
      j.financeiro.margemLucro.toFixed(2),
      j.observacoes || '',
    ].map(item => `"${String(item).replace(/"/g, '""')}"`)); // Escapar aspas duplas

    return [headers.join(';'), ...rows.map(row => row.join(';'))].join('\n');
  }

  static gerarCSVDespesas(despesasPorCategoria: ExpenseByCategory[], evolucaoDespesas: ExpenseEvolution[]): string {
    let csvContent = 'Despesas por Categoria\n';
    csvContent += 'Categoria;Total;Percentual;Quantidade\n';
    despesasPorCategoria.forEach(d => {
      csvContent += `"${d.categoria}";"${(d.total / 100).toFixed(2)}";"${d.percentual.toFixed(2)}";"${d.quantidade}"\n`;
    });

    csvContent += '\nEvolução das Despesas\n';
    csvContent += 'Data;Total;Categoria\n';
    evolucaoDespesas.forEach(e => {
      csvContent += `"${e.data}";"${(e.total / 100).toFixed(2)}";"${e.categoria}"\n`;
    });

    return csvContent;
  }

  static gerarCSVCombustivel(consumoPorVeiculo: any[], evolucaoPrecos: any[]): string {
    let csvContent = 'Consumo por Veículo\n';
    csvContent += 'ID Veículo;Veículo;Total Litros;Total Gasto\n';
    consumoPorVeiculo.forEach(c => {
      csvContent += `"${c.idVeiculo}";"${c.veiculo}";"${c.totalLitros.toFixed(2)}";"${(c.totalValor / 100).toFixed(2)}"\n`;
    });

    csvContent += '\nEvolução de Preços de Combustível\n';
    csvContent += 'Data;Tipo Combustível;Preço Médio Litro\n';
    evolucaoPrecos.forEach(e => {
      csvContent += `"${e.data}";"${e.tipoCombustivel}";"${(e.precoMedio / 100).toFixed(2)}"\n`;
    });

    return csvContent;
  }
}


