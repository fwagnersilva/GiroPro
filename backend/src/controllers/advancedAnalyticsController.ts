import { Request, Response } from 'express';
import { db } from '../db';
import { veiculos, jornadas, abastecimentos, despesas } from '../db/schema.postgres';
import { eq, and, sql, desc, asc, isNull, gte, lte, sum, avg, count, ne } from 'drizzle-orm';
import { z } from 'zod';
import { ValidationError, NotFoundError, UnauthorizedError } from '../utils/customErrors';

// Interfaces para tipagem
interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; nome: string; role: string; };
}

interface Period {
  startDate: Date;
  endDate: Date;
}

interface VehicleMetrics {
  totalLitros: number;
  totalKm: number;
  totalGastoCombustivel: number;
  consumoMedio: number;
  custoMedioPorKm: number;
  custoMedioPorLitro: number;
  numeroAbastecimentos: number;
  numeroJornadas: number;
}

// Schema de validação aprimorado
const analyticsQuerySchema = z.object({
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  idVeiculo: z.string().uuid().optional(),
  periodo: z.enum(['7d', '30d', '90d', '6m', '1y']).default('30d'),
  incluirComparacao: z.boolean().default(false),
  timezone: z.string().default('America/Sao_Paulo'),
});

const vehicleIdsSchema = z.object({
  vehicleIds: z.array(z.string().uuid()).min(2).max(5),
});

export class AdvancedAnalyticsController {
  /**
   * Função auxiliar para calcular o período de datas com timezone
   */
  private static calculatePeriod(
    periodo: string, 
    dataInicio?: string, 
    dataFim?: string,
    timezone: string = 'America/Sao_Paulo'
  ): Period {
    let startDate: Date;
    let endDate: Date = new Date();

    if (dataInicio && dataFim) {
      startDate = new Date(dataInicio);
      endDate = new Date(dataFim);
    } else {
      const now = new Date();
      switch (periodo) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '6m':
          startDate = new Date();
          startDate.setMonth(now.getMonth() - 6);
          break;
        case '1y':
          startDate = new Date();
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
    }

    // Validar se o período não é muito longo (máximo 2 anos)
    const maxPeriod = 2 * 365 * 24 * 60 * 60 * 1000; // 2 anos em ms
    if (endDate.getTime() - startDate.getTime() > maxPeriod) {
      throw new ValidationError('Período muito longo. Máximo permitido: 2 anos');
    }

    return { startDate, endDate };
  }

  /**
   * Função auxiliar para obter a descrição do período
   */
  private static getPeriodDescription(startDate: Date, endDate: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'America/Sao_Paulo'
    };
    return `${startDate.toLocaleDateString('pt-BR', options)} - ${endDate.toLocaleDateString('pt-BR', options)}`;
  }

  /**
   * Função auxiliar para calcular o resumo geral com validação
   */
  private static calculateGeneralSummary(analysisData: any[]): VehicleMetrics {
    if (!analysisData || analysisData.length === 0) {
      return {
        totalLitros: 0,
        totalKm: 0,
        totalGastoCombustivel: 0,
        consumoMedio: 0,
        custoMedioPorKm: 0,
        custoMedioPorLitro: 0,
        numeroAbastecimentos: 0,
        numeroJornadas: 0,
      };
    }

    let totalLitros = 0;
    let totalKm = 0;
    let totalGastoCombustivel = 0;
    let numeroAbastecimentos = 0;
    let numeroJornadas = 0;

    analysisData.forEach(analysis => {
      const metricas = analysis.metricasPeriodo || {};
      totalLitros += Number(metricas.totalLitros) || 0;
      totalKm += Number(metricas.totalKm) || 0;
      totalGastoCombustivel += Number(metricas.totalGastoCombustivel) || 0;
      numeroAbastecimentos += Number(metricas.numeroAbastecimentos) || 0;
      numeroJornadas += Number(metricas.numeroJornadas) || 0;
    });

    const consumoMedio = totalKm > 0 && totalLitros > 0 ? totalKm / totalLitros : 0;
    const custoMedioPorKm = totalKm > 0 ? totalGastoCombustivel / totalKm : 0;
    const custoMedioPorLitro = totalLitros > 0 ? totalGastoCombustivel / totalLitros : 0;

    return {
      totalLitros: Math.round(totalLitros * 100) / 100,
      totalKm: Math.round(totalKm * 100) / 100,
      totalGastoCombustivel: Math.round(totalGastoCombustivel),
      consumoMedio: Math.round(consumoMedio * 100) / 100,
      custoMedioPorKm: Math.round(custoMedioPorKm),
      custoMedioPorLitro: Math.round(custoMedioPorLitro),
      numeroAbastecimentos: numeroAbastecimentos,
      numeroJornadas: numeroJornadas,
    };
  }

  /**
   * Função auxiliar para obter o nome do dia da semana
   */
  private static getDayOfWeekName(dayIndex: number): string {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return days[dayIndex] || 'Desconhecido';
  }

  /**
   * Validar se o usuário tem acesso ao veículo
   */
  private static async validateVehicleAccess(userId: string, vehicleId: string): Promise<boolean> {
    const [vehicle] = await db
      .select({ id: veiculos.id })
      .from(veiculos)
      .where(and(
        eq(veiculos.id, vehicleId),
        eq(veiculos.idUsuario, userId),
        isNull(veiculos.deletedAt)
      ))
      .limit(1);
    
    return !!vehicle;
  }

  private static async fetchVehicleData(userId: string, vehicleId: string, startDate: Date, endDate: Date) {
    return Promise.all([
      db
        .select({
          dataAbastecimento: abastecimentos.dataAbastecimento,
          litros: abastecimentos.litros,
          valorTotal: abastecimentos.valorTotal,
          kmAtual: abastecimentos.kmAtual,
        })
        .from(abastecimentos)
        .where(
          and(
            eq(abastecimentos.idVeiculo, vehicleId),
            eq(abastecimentos.idUsuario, userId),
            gte(abastecimentos.dataAbastecimento, startDate),
            lte(abastecimentos.dataAbastecimento, endDate),
            isNull(abastecimentos.deletedAt)
          )
        )
        .orderBy(asc(abastecimentos.dataAbastecimento)),

      db
        .select({
          kmTotal: jornadas.kmTotal,
          dataInicio: jornadas.dataInicio,
          dataFim: jornadas.dataFim,
          ganhoBruto: jornadas.ganhoBruto,
        })
        .from(jornadas)
        .where(
          and(
            eq(jornadas.idVeiculo, vehicleId),
            eq(jornadas.idUsuario, userId),
            gte(jornadas.dataInicio, startDate),
            lte(jornadas.dataInicio, endDate),
            isNull(jornadas.deletedAt)
          )
        ),
    ]);
  }

  private static calculateVehicleMetrics(fuelings: any[], journeys: any[]): VehicleMetrics {
    const totalLitros = fuelings.reduce((sum, f) => sum + (Number(f.quantidadeLitros) || 0), 0);
    const totalGastoCombustivel = fuelings.reduce((sum, f) => sum + (Number(f.valorTotal) || 0), 0);
    const totalKm = journeys.reduce((sum, j) => sum + (Number(j.kmTotal) || 0), 0);
    const totalFaturamento = journeys.reduce((sum, j) => sum + (Number(j.ganhoBruto) || 0), 0);

    const consumoMedio = totalKm > 0 && totalLitros > 0 ? totalKm / totalLitros : 0;
    const custoMedioPorKm = totalKm > 0 ? totalGastoCombustivel / totalKm : 0;
    const custoMedioPorLitro = totalLitros > 0 ? totalGastoCombustivel / totalLitros : 0;

    return {
      totalLitros: Math.round(totalLitros * 100) / 100,
      totalKm: Math.round(totalKm * 100) / 100,
      totalGastoCombustivel: Math.round(totalGastoCombustivel),
      consumoMedio: Math.round(consumoMedio * 100) / 100,
      custoMedioPorKm: Math.round(custoMedioPorKm),
      custoMedioPorLitro: Math.round(custoMedioPorLitro),
      numeroAbastecimentos: fuelings.length,
      numeroJornadas: journeys.length,
    };
  }

  private static calculateEfficiencyHistory(fuelings: any[], consumoMedio: number) {
    return fuelings.map((fueling, index) => {
      if (index === 0 || !fueling.kmAtual) {
        return { ...fueling, consumoPeriodo: null, eficiencia: null, kmPercorridos: null };
      }

      const prevFueling = fuelings[index - 1];
      if (!prevFueling.kmAtual) {
        return { ...fueling, consumoPeriodo: null, eficiencia: null, kmPercorridos: null };
      }

      const kmPercorridos = Number(fueling.kmAtual) - Number(prevFueling.kmAtual);
      const litrosConsumidos = Number(fueling.quantidadeLitros) || 0;
      const consumoPeriodo = litrosConsumidos > 0 && kmPercorridos > 0 ? kmPercorridos / litrosConsumidos : 0;

      let eficiencia = 'Sem dados';
      if (consumoPeriodo > 0 && consumoMedio > 0) {
        const percentualEficiencia = (consumoPeriodo / consumoMedio) * 100;
        if (percentualEficiencia >= 110) eficiencia = 'Excelente';
        else if (percentualEficiencia >= 100) eficiencia = 'Boa';
        else if (percentualEficiencia >= 90) eficiencia = 'Regular';
        else eficiencia = 'Baixa';
      }

      return {
        ...fueling,
        consumoPeriodo: Math.round(consumoPeriodo * 100) / 100,
        kmPercorridos: kmPercorridos,
        eficiencia,
        percentualEficiencia: consumoPeriodo > 0 && consumoMedio > 0 ? Math.round((consumoPeriodo / consumoMedio) * 100) : null,
      };
    });
  }

  /**
   * Análise de consumo por veículo
   */
  static async getConsumptionAnalysis(req: Request, res: Response) {
    try {
      if (!(req as any).user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const validation = analyticsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        throw new ValidationError('Parâmetros inválidos', validation.error.errors);
      }

      const { dataInicio, dataFim, idVeiculo, periodo, timezone } = validation.data;

      if (idVeiculo && !(await this.validateVehicleAccess((req as any).user.id, idVeiculo))) {
        throw new NotFoundError('Veículo não encontrado ou sem acesso');
      }

      const { startDate, endDate } = this.calculatePeriod(periodo, dataInicio, dataFim, timezone);

      const userVehicles = await db.select().from(veiculos).where(and(eq(veiculos.idUsuario, (req as any).user.id), isNull(veiculos.deletedAt)));

      if (userVehicles.length === 0) {
        throw new NotFoundError('Nenhum veículo encontrado');
      }

      const consumptionAnalysis = [];

      for (const vehicle of userVehicles) {
        const [fuelings, journeys] = await this.fetchVehicleData((req as any).user.id, vehicle.id, startDate, endDate);
        const metricasPeriodo = this.calculateVehicleMetrics(fuelings, journeys);
        const historicoEficiencia = this.calculateEfficiencyHistory(fuelings, metricasPeriodo.consumoMedio);
        const tendenciaConsumo = this.calculateConsumptionTrend(historicoEficiencia);

        consumptionAnalysis.push({
          veiculo: vehicle,
          metricasPeriodo: metricasPeriodo,
          historicoEficiencia: historicoEficiencia.slice(1),
          tendenciaConsumo: tendenciaConsumo,
          periodo: {
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            descricao: this.getPeriodDescription(startDate, endDate),
            diasAnalisados: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
          },
        });
      }

      const estatisticasComparativas = consumptionAnalysis.length > 1 ? this.calculateComparativeStats(consumptionAnalysis) : null;

      return res.json({
        success: true,
        data: {
          analiseConsumo: consumptionAnalysis,
          resumoGeral: this.calculateGeneralSummary(consumptionAnalysis),
          estatisticasComparativas: estatisticasComparativas,
          periodo: {
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            descricao: this.getPeriodDescription(startDate, endDate),
            timezone: timezone,
          },
          metadata: {
            totalVeiculosAnalisados: consumptionAnalysis.length,
            periodoDias: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
            dataProcessamento: new Date().toISOString(),
          },
        },
      });
    } catch (error: any) {
      console.error('Erro ao gerar análise de consumo:', error);

      if (error instanceof ValidationError || error instanceof UnauthorizedError || error instanceof NotFoundError) {
        throw error;
      }

      throw new Error('Erro interno do servidor ao processar análise de consumo');
    }
  }

  /**
   * Calcular tendência de consumo
   */
  private static calculateConsumptionTrend(fuelingsWithEfficiency: any[]) {
    const validConsumptions = fuelingsWithEfficiency
      .filter(f => f.consumoPeriodo && f.consumoPeriodo > 0)
      .map(f => f.consumoPeriodo);

    if (validConsumptions.length < 2) {
      return { tendencia: 'Dados insuficientes', variacaoPercentual: 0 };
    }

    const firstHalf = validConsumptions.slice(0, Math.ceil(validConsumptions.length / 2));
    const secondHalf = validConsumptions.slice(Math.floor(validConsumptions.length / 2));

    const avgFirst = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const variacao = ((avgSecond - avgFirst) / avgFirst) * 100;
    
    let tendencia = 'Estável';
    if (variacao > 5) tendencia = 'Melhorando';
    else if (variacao < -5) tendencia = 'Piorando';

    return {
      tendencia,
      variacaoPercentual: Math.round(variacao * 100) / 100,
      consumoMedioInicial: Math.round(avgFirst * 100) / 100,
      consumoMedioRecente: Math.round(avgSecond * 100) / 100
    };
  }

  /**
   * Calcular estatísticas comparativas
   */
  private static calculateComparativeStats(analysisData: any[]) {
    const metricas = analysisData.map(item => item.metricasPeriodo);
    
    const consumoMedios = metricas.map(m => m.consumoMedio).filter(c => c > 0);
    const custosPorKm = metricas.map(m => m.custoMedioPorKm).filter(c => c > 0);
    const rois = metricas.map(m => m.roiCombustivel).filter(r => r !== null);

    return {
      consumo: {
        melhor: Math.max(...consumoMedios),
        pior: Math.min(...consumoMedios),
        media: Math.round((consumoMedios.reduce((sum, val) => sum + val, 0) / consumoMedios.length) * 100) / 100
      },
      custoPorKm: {
        menor: Math.min(...custosPorKm),
        maior: Math.max(...custosPorKm),
        media: Math.round(custosPorKm.reduce((sum, val) => sum + val, 0) / custosPorKm.length)
      },
      roi: {
        maior: Math.max(...rois),
        menor: Math.min(...rois),
        media: Math.round(rois.reduce((sum, val) => sum + val, 0) / rois.length)
      }
    };
  }

  /**
   * Análise de produtividade - NOVO MÉTODO
   */
  static async getProductivityAnalysis(req: Request, res: Response) {
    try {
      if (!(req as any).user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const validation = analyticsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        throw new ValidationError('Parâmetros inválidos', validation.error.errors);
      }

      const { dataInicio, dataFim, idVeiculo, periodo, timezone } = validation.data;
      const { startDate, endDate } = this.calculatePeriod(periodo, dataInicio, dataFim, timezone);

      // Buscar dados de produtividade
      const vehicleConditions = [
        eq(veiculos.idUsuario, (req as any).user.id),
        isNull(veiculos.deletedAt)
      ];

      if (idVeiculo) {
        vehicleConditions.push(eq(veiculos.id, idVeiculo));
      }

      const productivityData = await db
        .select({
          vehicleId: veiculos.id,
          marca: veiculos.marca,
          modelo: veiculos.modelo,
          totalJornadas: count(jornadas.id),
          totalKm: sum(jornadas.kmTotal),
          totalFaturamento: sum(jornadas.ganhoBruto),
          mediaKmPorJornada: avg(jornadas.kmTotal),
          mediaFaturamentoPorJornada: avg(jornadas.ganhoBruto)
        })
        .from(veiculos)
        .leftJoin(jornadas, and(
          eq(jornadas.idVeiculo, veiculos.id),
          gte(jornadas.dataInicio, startDate),
          lte(jornadas.dataInicio, endDate),
          isNull(jornadas.deletedAt)
        ))
        .where(and(...vehicleConditions))
        .groupBy(veiculos.id, veiculos.marca, veiculos.modelo);

      if (productivityData.length === 0) {
        throw new NotFoundError('Nenhum dado de produtividade encontrado para os filtros selecionados');
      }

      return res.json({
        success: true,
        data: {
          produtividade: productivityData,
          periodo: {
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            descricao: this.getPeriodDescription(startDate, endDate),
            timezone: timezone
          }
        }
      });

    } catch (error: any) {
      console.error('Erro na análise de produtividade:', error);
      if (error instanceof ValidationError || error instanceof UnauthorizedError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Erro interno do servidor ao processar análise de produtividade');
    }
  }

   /**
   * Comparativo entre veículos - NOVO MÉTODO
   */
  static async compareVehicles(req: Request, res: Response) {
    try {
      if (!(req as any).user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const validation = vehicleIdsSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ValidationError('Parâmetros inválidos', validation.error.errors);
      }

      const { vehicleIds } = validation.data;
      const { id: userId } = (req as any).user;

      const comparisonData = [];

      for (const vehicleId of vehicleIds) {
        if (!(await this.validateVehicleAccess(userId, vehicleId))) {
          throw new NotFoundError(`Veículo com ID ${vehicleId} não encontrado ou sem acesso`);
        }

        const [fuelings, journeys] = await this.fetchVehicleData(userId, vehicleId, new Date(0), new Date());
        const metrics = this.calculateVehicleMetrics(fuelings, journeys);
        const vehicle = await db.select().from(veiculos).where(eq(veiculos.id, vehicleId));
        comparisonData.push({ ...vehicle[0], ...metrics });
      }

      return res.json({
        success: true,
        data: comparisonData,
      });
    } catch (error: any) {
      console.error('Erro ao comparar veículos:', error);
      if (error instanceof ValidationError || error instanceof UnauthorizedError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Erro interno do servidor ao comparar veículos');
    }
  }











}

















