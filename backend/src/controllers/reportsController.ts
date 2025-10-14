import { Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { jornadas, abastecimentos, despesas, veiculos } from '../db/schema.postgres';
import { eq, and, isNull, isNotNull, sql, gte, lte, sum, count, avg, desc, ne } from 'drizzle-orm';
import { generateJourneysCsv } from '../utils/csv_utils';
import { generateExpensesPdf } from "../utils/pdf_utils";

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

interface ExpenseReport {
  idDespesa: string;
  data: string;
  descricao: string;
  valor: number;
  categoria: string;
  veiculo: {
    id: string | null;
    marca: string | null;
    modelo: string | null;
    placa: string | null;
  };
}

interface FuelReport {
  idAbastecimento: string;
  data: string;
  litros: number;
  valorTotal: number;
  precoLitro: number;
  tipoCombustivel: string;
  posto: string | null;
  quilometragem: number | null;
  veiculo: {
    id: string | null;
    marca: string | null;
    modelo: string | null;
    placa: string | null;
  };
}

interface DashboardData {
  resumoFinanceiro: {
    totalGanhoBruto: number;
    totalDespesas: number;
    totalLucroLiquido: number;
    margemLucroMedia: number;
  };
  estatisticasJornadas: {
    totalJornadas: number;
    totalKm: number;
    mediaKmPorJornada: number;
    duracaoMediaMinutos: number;
  };
  estatisticasCombustivel: {
    totalLitros: number;
    totalGasto: number;
    precoMedioLitro: number;
    consumoMedio: number;
  };
  melhorJornada: any;
  evolucaoMensal: any[];
  evolucaoPrecos: any[];
}

// ====================== SCHEMAS ======================

const reportsQuerySchema = z.object({
  periodo: z.enum(['hoje', 'semana', 'mes', 'trimestre', 'semestre', 'ano', 'personalizado']).default('mes'),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  idVeiculo: z.string().optional()
});

// ====================== HELPERS ======================

class DateHelper {
  static calcularPeriodo(periodo: string, dataInicio?: string, dataFim?: string): PeriodRange {
    const hoje = new Date();
    let inicio: Date;
    let fim: Date = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);

    switch (periodo) {
      case 'hoje':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0);
        break;
      case 'semana':
        const diaSemana = hoje.getDay();
        inicio = new Date(hoje);
        inicio.setDate(hoje.getDate() - diaSemana);
        inicio.setHours(0, 0, 0, 0);
        break;
      case 'mes':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1, 0, 0, 0);
        break;
      case 'trimestre':
        const mesAtual = hoje.getMonth();
        const inicioTrimestre = Math.floor(mesAtual / 3) * 3;
        inicio = new Date(hoje.getFullYear(), inicioTrimestre, 1, 0, 0, 0);
        break;
      case 'semestre':
        const inicioSemestre = hoje.getMonth() < 6 ? 0 : 6;
        inicio = new Date(hoje.getFullYear(), inicioSemestre, 1, 0, 0, 0);
        break;
      case 'ano':
        inicio = new Date(hoje.getFullYear(), 0, 1, 0, 0, 0);
        break;
      case 'personalizado':
        if (!dataInicio || !dataFim) {
          throw new Error('Para período personalizado, dataInicio e dataFim são obrigatórios');
        }
        inicio = new Date(dataInicio + 'T00:00:00');
        fim = new Date(dataFim + 'T23:59:59');
        break;
      default:
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1, 0, 0, 0);
    }

    return { dataInicio: inicio, dataFim: fim };
  }
}

// ====================== CONTROLLER ======================

export class ReportsController {
  /**
   * Valida autenticação do usuário
   */
  private static validateAuth(req: Request): string | null {
    return (req as any).user?.id || null;
  }

  /**
   * Resposta de erro padronizada
   */
  public static errorResponse(res: Response, status: number, message: string, details?: any): Response {
    console.error(`[ReportsController] Error ${status}: ${message}`, details);
    return res.status(status).json({
      success: false,
      message,
      details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Resposta de sucesso padronizada
   */
  private static successResponse(res: Response, message: string, data: any): Response {
    return res.status(200).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Valida parâmetros de consulta comuns
   */
  public static validateQueryParams(req: Request) {
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

    return {
      userId,
      queryData: queryValidation.data,
      error: null
    };
  }

  /**
   * Exportar relatório de jornadas em CSV
   */
  static async getJourneysCsvReport(req: Request, res: Response): Promise<Response> {
    try {
      const validation = ReportsController.validateQueryParams(req);
      if (validation.error) {
        return ReportsController.errorResponse(res, 401, validation.error, validation.details);
      }

      const { userId, queryData } = validation;
      const { periodo, dataInicio, dataFim, idVeiculo } = queryData!;
      const { dataInicio: parsedDataInicio, dataFim: parsedDataFim } = DateHelper.calcularPeriodo(periodo, dataInicio, dataFim);

      console.log(`[ReportsController] Gerando CSV de jornadas - Usuário: ${userId}, Período: ${periodo}`);

      const jornadasDetalhadas = await db
        .select({
          id: jornadas.id,
          dataInicio: jornadas.dataInicio,
          dataFim: jornadas.dataFim,
          duracaoMinutos: jornadas.duracaoMinutos,
          kmInicio: jornadas.kmInicio,
          kmFim: jornadas.kmFim,
          ganhoBruto: jornadas.ganhoBruto,
          custoCombustivelEstimado: jornadas.custoCombustivelEstimado,
          outrasDespesas: jornadas.outrasDespesas,
          lucroLiquidoEstimado: jornadas.lucroLiquidoEstimado,
          margemLucro: jornadas.margemLucro,
          veiculo: {
            id: veiculos.id,
            marca: veiculos.marca,
            modelo: veiculos.modelo,
            placa: veiculos.placa,
            tipoCombustivel: veiculos.tipoCombustivel
          }
        })
        .from(jornadas)
        .leftJoin(veiculos, eq(jornadas.idVeiculo, veiculos.id))
        .where(and(
          eq(jornadas.idUsuario, userId),
          isNull(jornadas.deletedAt),
          gte(jornadas.dataInicio, parsedDataInicio),
          lte(jornadas.dataInicio, parsedDataFim),
          idVeiculo ? eq(jornadas.idVeiculo, idVeiculo) : undefined
        ))
        .orderBy(desc(jornadas.dataInicio));

      const csvContent = generateJourneysCsv(jornadasDetalhadas);

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="jornadas.csv"');
      
      return res.status(200).send(csvContent);

    } catch (error: any) {
      return ReportsController.errorResponse(res, 500, "Erro ao gerar CSV de jornadas", error.message);
    }
  }

  /**
   * Exportar relatório de despesas em PDF
   */
  static async getExpensesPdfReport(req: Request, res: Response): Promise<Response> {
    try {
      const validation = ReportsController.validateQueryParams(req);
      if (validation.error) {
        return ReportsController.errorResponse(res, 401, validation.error, validation.details);
      }

      const { userId, queryData } = validation;
      const { periodo, dataInicio, dataFim, idVeiculo } = queryData!;
      const { dataInicio: parsedDataInicio, dataFim: parsedDataFim } = DateHelper.calcularPeriodo(periodo, dataInicio, dataFim);

      console.log(`[ReportsController] Gerando PDF de despesas - Usuário: ${userId}, Período: ${periodo}`);

      const despesasDetalhadas = await db
        .select({
          id: despesas.id,
          dataDespesa: despesas.dataDespesa,
          descricao: despesas.descricao,
          valorDespesa: despesas.valorDespesa,
          tipoDespesa: despesas.tipoDespesa,
          veiculo: {
            id: veiculos.id,
            marca: veiculos.marca,
            modelo: veiculos.modelo,
            placa: veiculos.placa
          }
        })
        .from(despesas)
        .leftJoin(veiculos, eq(despesas.idVeiculo, veiculos.id))
        .where(and(
          eq(despesas.idUsuario, userId),
          isNull(despesas.deletedAt),
          gte(despesas.dataDespesa, parsedDataInicio),
          lte(despesas.dataDespesa, parsedDataFim),
          idVeiculo ? eq(despesas.idVeiculo, idVeiculo) : undefined
        ))
        .orderBy(desc(despesas.dataDespesa));

      const pdfBuffer = await generateExpensesPdf(despesasDetalhadas);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="despesas.pdf"');
      
      return res.status(200).send(pdfBuffer);

    } catch (error: any) {
      return ReportsController.errorResponse(res, 500, "Erro ao gerar PDF de despesas", error.message);
    }
  }

  // ====================== MÉTODOS FALTANTES ======================

  static async getJourneyEarningsReport(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return ReportsController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const { dataInicio, dataFim, idVeiculo } = req.query;

      // Validação de parâmetros
      if (!dataInicio || !dataFim) {
        return ReportsController.errorResponse(res, 400, "Parâmetros dataInicio e dataFim são obrigatórios");
      }

      const parsedDataInicio = new Date(dataInicio as string);
      const parsedDataFim = new Date(dataFim as string);

      if (isNaN(parsedDataInicio.getTime()) || isNaN(parsedDataFim.getTime())) {
        return ReportsController.errorResponse(res, 400, "Formato de data inválido");
      }

      // Buscar jornadas com ganhos detalhados
      const jornadasGanhos = await db
        .select({
          id: jornadas.id,
          dataInicio: jornadas.dataInicio,
          dataFim: jornadas.dataFim,
          ganhoBruto: jornadas.ganhoBruto,
          lucroLiquidoEstimado: jornadas.lucroLiquidoEstimado,
          margemLucro: jornadas.margemLucro,
          veiculo: {
            marca: veiculos.marca,
            modelo: veiculos.modelo,
            placa: veiculos.placa
          }
        })
        .from(jornadas)
        .leftJoin(veiculos, eq(jornadas.idVeiculo, veiculos.id))
        .where(and(
          eq(jornadas.idUsuario, userId),
          isNull(jornadas.deletedAt),
          gte(jornadas.dataInicio, parsedDataInicio),
          lte(jornadas.dataFim, parsedDataFim),
          idVeiculo ? eq(jornadas.idVeiculo, idVeiculo as string) : undefined
        ))
        .orderBy(desc(jornadas.dataInicio));

      return res.status(200).json({
        success: true,
        data: jornadasGanhos,
        message: "Relatório de ganhos por jornada gerado com sucesso"
      });

    } catch (error: any) {
      return ReportsController.errorResponse(res, 500, "Erro ao gerar relatório de ganhos", error.message);
    }
  }

  static async getExpenseAnalysisReport(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return ReportsController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const { dataInicio, dataFim, idVeiculo } = req.query;

      // Validação de parâmetros
      if (!dataInicio || !dataFim) {
        return ReportsController.errorResponse(res, 400, "Parâmetros dataInicio e dataFim são obrigatórios");
      }

      const parsedDataInicio = new Date(dataInicio as string);
      const parsedDataFim = new Date(dataFim as string);

      if (isNaN(parsedDataInicio.getTime()) || isNaN(parsedDataFim.getTime())) {
        return ReportsController.errorResponse(res, 400, "Formato de data inválido");
      }

      // Análise de despesas por categoria
      const analiseDesp = await db
        .select({
          categoria: despesas.tipoDespesa,
          totalGasto: sum(despesas.valorDespesa),
          quantidadeTransacoes: count(despesas.id),
          mediaGasto: avg(despesas.valorDespesa)
        })
        .from(despesas)
        .where(and(
          eq(despesas.idUsuario, userId),
          isNull(despesas.deletedAt),
          gte(despesas.dataDespesa, parsedDataInicio),
          lte(despesas.dataDespesa, parsedDataFim),
          idVeiculo ? eq(despesas.idVeiculo, idVeiculo as string) : undefined
        ))
        .groupBy(despesas.tipoDespesa);

      return res.status(200).json({
        success: true,
        data: analiseDesp,
        message: "Análise de despesas gerada com sucesso"
      });

    } catch (error: any) {
      return ReportsController.errorResponse(res, 500, "Erro ao gerar análise de despesas", error.message);
    }
  }

  static async getFuelConsumptionReport(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return ReportsController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const { dataInicio, dataFim, idVeiculo } = req.query;

      // Validação de parâmetros
      if (!dataInicio || !dataFim) {
        return ReportsController.errorResponse(res, 400, "Parâmetros dataInicio e dataFim são obrigatórios");
      }

      const parsedDataInicio = new Date(dataInicio as string);
      const parsedDataFim = new Date(dataFim as string);

      if (isNaN(parsedDataInicio.getTime()) || isNaN(parsedDataFim.getTime())) {
        return ReportsController.errorResponse(res, 400, "Formato de data inválido");
      }

      // Relatório de consumo de combustível
      const consumoCombustivel = await db
        .select({
          id: abastecimentos.id,
          dataAbastecimento: abastecimentos.dataAbastecimento,
          litros: abastecimentos.litros,
          valorTotal: abastecimentos.valorTotal,
          // precoPorLitro: abastecimentos.precoPorLitro, // Campo não encontrado na tabela
          kmAtual: abastecimentos.kmAtual,
          veiculo: {
            marca: veiculos.marca,
            modelo: veiculos.modelo,
            placa: veiculos.placa
          }
        })
        .from(abastecimentos)
        .leftJoin(veiculos, eq(abastecimentos.idVeiculo, veiculos.id))
        .where(and(
          eq(abastecimentos.idUsuario, userId),
          isNull(abastecimentos.deletedAt),
          gte(abastecimentos.dataAbastecimento, parsedDataInicio),
          lte(abastecimentos.dataAbastecimento, parsedDataFim),
          idVeiculo ? eq(abastecimentos.idVeiculo, idVeiculo as string) : undefined
        ))
        .orderBy(desc(abastecimentos.dataAbastecimento));

      return res.status(200).json({
        success: true,
        data: consumoCombustivel,
        message: "Relatório de consumo de combustível gerado com sucesso"
      });

    } catch (error: any) {
      return ReportsController.errorResponse(res, 500, "Erro ao gerar relatório de consumo", error.message);
    }
  }
}

