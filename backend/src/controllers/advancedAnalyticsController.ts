import { Request, Response } from 'express';
import { db } from '../db';
import { veiculos, jornadas, abastecimentos, despesas } from '../db/schema';
import { eq, and, sql, desc, asc, isNull, gte, lte, sum, avg, count, ne } from 'drizzle-orm';
import { z } from 'zod';
import { ValidationError, NotFoundError, UnauthorizedError } from '../utils/customErrors';

// Interfaces para tipagem
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

interface Period {
  startDate: Date;
  endDate: Date;
}

interface VehicleMetrics {
  total_litros: number;
  total_km: number;
  total_gasto_combustivel: number;
  consumo_medio: number;
  custo_medio_por_km: number;
  custo_medio_por_litro: number;
  numero_abastecimentos: number;
  numero_jornadas: number;
}

// Schema de validação aprimorado
const analyticsQuerySchema = z.object({
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  idVeiculo: z.string().uuid().optional(),
  periodo: z.enum(['7d', '30d', '90d', '6m', '1y']).default('30d'),
  incluir_comparacao: z.boolean().default(false),
  timezone: z.string().default('America/Sao_Paulo'),
});

const vehicleIdsSchema = z.object({
  vehicle_ids: z.array(z.string().uuid()).min(2).max(5),
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
        total_litros: 0,
        total_km: 0,
        total_gasto_combustivel: 0,
        consumo_medio: 0,
        custo_medio_por_km: 0,
        custo_medio_por_litro: 0,
        numero_abastecimentos: 0,
        numero_jornadas: 0,
      };
    }

    let totalLitros = 0;
    let totalKm = 0;
    let totalGastoCombustivel = 0;
    let numeroAbastecimentos = 0;
    let numeroJornadas = 0;

    analysisData.forEach(analysis => {
      const metricas = analysis.metricas_periodo || {};
      totalLitros += Number(metricas.total_litros) || 0;
      totalKm += Number(metricas.total_km) || 0;
      totalGastoCombustivel += Number(metricas.total_gasto_combustivel) || 0;
      numeroAbastecimentos += Number(metricas.numero_abastecimentos) || 0;
      numeroJornadas += Number(metricas.numero_jornadas) || 0;
    });

    const consumoMedio = totalKm > 0 && totalLitros > 0 ? totalKm / totalLitros : 0;
    const custoMedioPorKm = totalKm > 0 ? totalGastoCombustivel / totalKm : 0;
    const custoMedioPorLitro = totalLitros > 0 ? totalGastoCombustivel / totalLitros : 0;

    return {
      total_litros: Math.round(totalLitros * 100) / 100,
      total_km: Math.round(totalKm * 100) / 100,
      total_gasto_combustivel: Math.round(totalGastoCombustivel),
      consumo_medio: Math.round(consumoMedio * 100) / 100,
      custo_medio_por_km: Math.round(custoMedioPorKm),
      custo_medio_por_litro: Math.round(custoMedioPorLitro),
      numero_abastecimentos: numeroAbastecimentos,
      numero_jornadas: numeroJornadas,
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

  /**
   * Análise de consumo por veículo - MELHORADA
   */
  static async getConsumptionAnalysis(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const validation = analyticsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        throw new ValidationError('Parâmetros inválidos', validation.error.errors);
      }

      const { dataInicio, dataFim, idVeiculo, periodo, timezone } = validation.data;
      
      // Validar acesso ao veículo se especificado
      if (idVeiculo && !(await this.validateVehicleAccess(req.user.id, idVeiculo))) {
        throw new NotFoundError('Veículo não encontrado ou sem acesso');
      }

      const { startDate, endDate } = this.calculatePeriod(periodo, dataInicio, dataFim, timezone);

      // Buscar veículos do usuário com query otimizada
      const vehicleConditions = [
        eq(veiculos.idUsuario, req.user.id),
        isNull(veiculos.deletedAt)
      ];

      if (idVeiculo) {
        vehicleConditions.push(eq(veiculos.id, idVeiculo));
      }

      const userVehicles = await db
        .select({
          id: veiculos.id,
          marca: veiculos.marca,
          modelo: veiculos.modelo,
          ano: veiculos.ano,
          placa: veiculos.placa,
          tipoCombustivel: veiculos.tipoCombustivel,
        })
        .from(veiculos)
        .where(and(...vehicleConditions));

      if (userVehicles.length === 0) {
        throw new NotFoundError('Nenhum veículo encontrado');
      }

      const consumptionAnalysis = [];

      for (const vehicle of userVehicles) {
        // Usar transação para garantir consistência dos dados
        const [fuelings, journeys] = await Promise.all([
          // Buscar abastecimentos otimizado
          db
            .select({
              dataAbastecimento: abastecimentos.dataAbastecimento,
              quantidadeLitros: abastecimentos.quantidadeLitros,
              valorTotal: abastecimentos.valorTotal,
              kmAtual: abastecimentos.kmAtual,
            })
            .from(abastecimentos)
            .where(
              and(
                eq(abastecimentos.idVeiculo, vehicle.id),
                eq(abastecimentos.idUsuario, req.user.id),
                gte(abastecimentos.dataAbastecimento, startDate.toISOString()),
                lte(abastecimentos.dataAbastecimento, endDate.toISOString()),
                isNull(abastecimentos.deletedAt)
              )
            )
            .orderBy(asc(abastecimentos.dataAbastecimento)),

          // Buscar jornadas otimizado
          db
            .select({
              km_total: jornadas.km_total,
              dataInicio: jornadas.dataInicio,
              dataFim: jornadas.dataFim,
              ganho_bruto: jornadas.ganho_bruto,
            })
            .from(jornadas)
            .where(
              and(
                eq(jornadas.idVeiculo, vehicle.id),
                eq(jornadas.idUsuario, req.user.id),
                gte(jornadas.dataInicio, startDate.toISOString()),
                lte(jornadas.dataInicio, endDate.toISOString()),
                isNull(jornadas.deletedAt)
              )
            )
        ]);

        // Calcular métricas com validação
        const totalLitros = fuelings.reduce((sum, f) => sum + (Number(f.quantidadeLitros) || 0), 0);
        const totalGastoCombustivel = fuelings.reduce((sum, f) => sum + (Number(f.valorTotal) || 0), 0);
        const totalKm = journeys.reduce((sum, j) => sum + (Number(j.km_total) || 0), 0);
        const totalFaturamento = journeys.reduce((sum, j) => sum + (Number(j.ganho_bruto) || 0), 0);
        
        const consumoMedio = totalKm > 0 && totalLitros > 0 ? totalKm / totalLitros : 0;
        const custoMedioPorKm = totalKm > 0 ? totalGastoCombustivel / totalKm : 0;
        const custoMedioPorLitro = totalLitros > 0 ? totalGastoCombustivel / totalLitros : 0;

        // Análise de eficiência temporal melhorada
        const fuelingsWithEfficiency = fuelings.map((fueling, index) => {
          if (index === 0 || !fueling.kmAtual) {
            return { 
              ...fueling, 
              consumo_periodo: null, 
              eficiencia: null,
              km_percorridos: null
            };
          }
          
          const prevFueling = fuelings[index - 1];
          if (!prevFueling.kmAtual) {
            return { 
              ...fueling, 
              consumo_periodo: null, 
              eficiencia: null,
              km_percorridos: null
            };
          }

          const kmPercorridos = Number(fueling.kmAtual) - Number(prevFueling.kmAtual);
          const litrosConsumidos = Number(fueling.quantidadeLitros) || 0;
          const consumoPeriodo = litrosConsumidos > 0 && kmPercorridos > 0 ? kmPercorridos / litrosConsumidos : 0;
          
          // Classificação mais detalhada
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
            consumo_periodo: Math.round(consumoPeriodo * 100) / 100,
            km_percorridos: kmPercorridos,
            eficiencia,
            percentual_eficiencia: consumoPeriodo > 0 && consumoMedio > 0 ? 
              Math.round((consumoPeriodo / consumoMedio) * 100) : null
          };
        });

        // Análise de tendência de consumo
        const consumoTrend = this.calculateConsumptionTrend(fuelingsWithEfficiency);

        consumptionAnalysis.push({
          veiculo: vehicle,
          metricas_periodo: {
            total_litros: Math.round(totalLitros * 100) / 100,
            total_km: Math.round(totalKm * 100) / 100,
            total_gasto_combustivel: Math.round(totalGastoCombustivel),
            total_faturamento: Math.round(totalFaturamento),
            lucro_bruto: Math.round(totalFaturamento - totalGastoCombustivel),
            consumo_medio: Math.round(consumoMedio * 100) / 100,
            custo_medio_por_km: Math.round(custoMedioPorKm),
            custo_medio_por_litro: Math.round(custoMedioPorLitro),
            numero_abastecimentos: fuelings.length,
            numero_jornadas: journeys.length,
            roi_combustivel: totalGastoCombustivel > 0 ? 
              Math.round(((totalFaturamento - totalGastoCombustivel) / totalGastoCombustivel) * 100) : 0,
          },
          historico_eficiencia: fuelingsWithEfficiency.slice(1),
          tendencia_consumo: consumoTrend,
          periodo: {
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            descricao: this.getPeriodDescription(startDate, endDate),
            dias_analisados: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
          }
        });
      }

      // Estatísticas comparativas se mais de um veículo
      const estatisticasComparativas = consumptionAnalysis.length > 1 ? 
        this.calculateComparativeStats(consumptionAnalysis) : null;

      return res.json({
        success: true,
        data: {
          analise_consumo: consumptionAnalysis,
          resumo_geral: this.calculateGeneralSummary(consumptionAnalysis),
          estatisticas_comparativas: estatisticasComparativas,
          periodo: {
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            descricao: this.getPeriodDescription(startDate, endDate),
            timezone: timezone
          },
          metadata: {
            total_veiculos_analisados: consumptionAnalysis.length,
            periodo_dias: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
            data_processamento: new Date().toISOString()
          }
        }
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
      .filter(f => f.consumo_periodo && f.consumo_periodo > 0)
      .map(f => f.consumo_periodo);

    if (validConsumptions.length < 2) {
      return { tendencia: 'Dados insuficientes', variacao_percentual: 0 };
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
      variacao_percentual: Math.round(variacao * 100) / 100,
      consumo_medio_inicial: Math.round(avgFirst * 100) / 100,
      consumo_medio_recente: Math.round(avgSecond * 100) / 100
    };
  }

  /**
   * Calcular estatísticas comparativas
   */
  private static calculateComparativeStats(analysisData: any[]) {
    const metricas = analysisData.map(item => item.metricas_periodo);
    
    const consumoMedios = metricas.map(m => m.consumo_medio).filter(c => c > 0);
    const custosPorKm = metricas.map(m => m.custo_medio_por_km).filter(c => c > 0);
    const rois = metricas.map(m => m.roi_combustivel).filter(r => r !== null);

    return {
      consumo: {
        melhor: Math.max(...consumoMedios),
        pior: Math.min(...consumoMedios),
        media: Math.round((consumoMedios.reduce((sum, val) => sum + val, 0) / consumoMedios.length) * 100) / 100
      },
      custo_por_km: {
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
   * Análise de desempenho de jornadas
   */
  static async getJourneyPerformance(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const validation = analyticsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        throw new ValidationError('Parâmetros inválidos', validation.error.errors);
      }

      const { dataInicio, dataFim, idVeiculo, periodo, timezone } = validation.data;

      if (idVeiculo && !(await this.validateVehicleAccess(req.user.id, idVeiculo))) {
        throw new NotFoundError('Veículo não encontrado ou sem acesso');
      }

      const { startDate, endDate } = this.calculatePeriod(periodo, dataInicio, dataFim, timezone);

      const conditions = [
        eq(jornadas.idUsuario, req.user.id),
        gte(jornadas.dataInicio, startDate.toISOString()),
        lte(jornadas.dataInicio, endDate.toISOString()),
        isNull(jornadas.deletedAt)
      ];

      if (idVeiculo) {
        conditions.push(eq(jornadas.idVeiculo, idVeiculo));
      }

      const allJourneys = await db
        .select({
          id: jornadas.id,
          dataInicio: jornadas.dataInicio,
          dataFim: jornadas.dataFim,
          ganho_bruto: jornadas.ganho_bruto,
          km_total: jornadas.km_total,
          tempo_total: jornadas.tempo_total,
          idVeiculo: jornadas.idVeiculo,
        })
        .from(jornadas)
        .where(and(...conditions));

      if (allJourneys.length === 0) {
        return res.json({
          success: true,
          data: {
            message: 'Nenhuma jornada encontrada para o período e filtros selecionados.',
            analise_jornadas: [],
            resumo_jornadas: {},
            tendencia_jornadas: {},
            periodo: {
              dataInicio: startDate.toISOString(),
              dataFim: endDate.toISOString(),
              descricao: this.getPeriodDescription(startDate, endDate),
              timezone: timezone
            }
          }
        });
      }

      // Agrupar jornadas por veículo para análise individual
      const journeysByVehicle = allJourneys.reduce((acc, journey) => {
        const vehicleId = journey.idVeiculo;
        if (!acc[vehicleId]) {
          acc[vehicleId] = [];
        }
        acc[vehicleId].push(journey);
        return acc;
      }, {} as Record<string, typeof allJourneys>);

      const analysisResults = [];
      for (const vehicleId in journeysByVehicle) {
        const vehicleJourneys = journeysByVehicle[vehicleId];
        const vehicleInfo = await db.select().from(veiculos).where(eq(veiculos.id, vehicleId)).limit(1);

        const totalGanhoBruto = vehicleJourneys.reduce((sum, j) => sum + (Number(j.ganho_bruto) || 0), 0);
        const totalKm = vehicleJourneys.reduce((sum, j) => sum + (Number(j.km_total) || 0), 0);
        const totalTempo = vehicleJourneys.reduce((sum, j) => sum + (Number(j.tempo_total) || 0), 0);

        const ganhoMedioPorKm = totalKm > 0 ? totalGanhoBruto / totalKm : 0;
        const ganhoMedioPorHora = totalTempo > 0 ? (totalGanhoBruto / totalTempo) * 60 : 0; // Converter minutos para horas

        // Análise por dia da semana
        const dailyPerformance = vehicleJourneys.reduce((acc, journey) => {
          const date = new Date(journey.dataInicio);
          const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
          const dayName = this.getDayOfWeekName(dayOfWeek);

          if (!acc[dayName]) {
            acc[dayName] = { totalGanhoBruto: 0, totalKm: 0, totalTempo: 0, count: 0 };
          }
          acc[dayName].totalGanhoBruto += Number(journey.ganho_bruto) || 0;
          acc[dayName].totalKm += Number(journey.km_total) || 0;
          acc[dayName].totalTempo += Number(journey.tempo_total) || 0;
          acc[dayName].count++;
          return acc;
        }, {} as Record<string, { totalGanhoBruto: number; totalKm: number; totalTempo: number; count: number }>);

        const dailyPerformanceFormatted = Object.entries(dailyPerformance).map(([day, data]) => ({
          dia_semana: day,
          ganho_bruto: Math.round(data.totalGanhoBruto),
          km_total: Math.round(data.totalKm),
          tempo_total: Math.round(data.totalTempo),
          jornadas_count: data.count,
          ganho_medio_por_jornada: data.count > 0 ? Math.round(data.totalGanhoBruto / data.count) : 0,
          ganho_medio_por_km: data.totalKm > 0 ? Math.round(data.totalGanhoBruto / data.totalKm) : 0,
        }));

        analysisResults.push({
          veiculo: vehicleInfo[0] || { id: vehicleId, marca: 'Desconhecida', modelo: 'Desconhecido' },
          metricas_periodo: {
            total_ganho_bruto: Math.round(totalGanhoBruto),
            total_km: Math.round(totalKm),
            total_tempo: Math.round(totalTempo),
            numero_jornadas: vehicleJourneys.length,
            ganho_medio_por_km: Math.round(ganhoMedioPorKm),
            ganho_medio_por_hora: Math.round(ganhoMedioPorHora),
          },
          desempenho_diario: dailyPerformanceFormatted,
        });
      }

      // Resumo consolidado de todas as jornadas
      const resumoGeralJornadas = {
        total_ganho_bruto_geral: Math.round(analysisResults.reduce((sum, ar) => sum + ar.metricas_periodo.total_ganho_bruto, 0)),
        total_km_geral: Math.round(analysisResults.reduce((sum, ar) => sum + ar.metricas_periodo.total_km, 0)),
        total_tempo_geral: Math.round(analysisResults.reduce((sum, ar) => sum + ar.metricas_periodo.total_tempo, 0)),
        numero_jornadas_geral: analysisResults.reduce((sum, ar) => sum + ar.metricas_periodo.numero_jornadas, 0),
      };

      return res.json({
        success: true,
        data: {
          analise_jornadas: analysisResults,
          resumo_jornadas: resumoGeralJornadas,
          periodo: {
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            descricao: this.getPeriodDescription(startDate, endDate),
            timezone: timezone
          },
          metadata: {
            total_jornadas_analisadas: allJourneys.length,
            data_processamento: new Date().toISOString()
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao gerar análise de desempenho de jornadas:', error);
      if (error instanceof ValidationError || error instanceof UnauthorizedError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Erro interno do servidor ao processar análise de desempenho de jornadas');
    }
  }

  /**
   * Análise de despesas por categoria e veículo
   */
  static async getExpenseAnalysis(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const validation = analyticsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        throw new ValidationError('Parâmetros inválidos', validation.error.errors);
      }

      const { dataInicio, dataFim, idVeiculo, periodo, timezone } = validation.data;

      if (idVeiculo && !(await this.validateVehicleAccess(req.user.id, idVeiculo))) {
        throw new NotFoundError('Veículo não encontrado ou sem acesso');
      }

      const { startDate, endDate } = this.calculatePeriod(periodo, dataInicio, dataFim, timezone);

      const conditions = [
        eq(despesas.idUsuario, req.user.id),
        gte(despesas.dataDespesa, startDate.toISOString()),
        lte(despesas.dataDespesa, endDate.toISOString()),
        isNull(despesas.deletedAt)
      ];

      if (idVeiculo) {
        conditions.push(eq(despesas.idVeiculo, idVeiculo));
      }

      const allExpenses = await db
        .select({
          id: despesas.id,
          dataDespesa: despesas.dataDespesa,
          valorDespesa: despesas.valorDespesa,
          tipoDespesa: despesas.tipoDespesa,
          idVeiculo: despesas.idVeiculo,
        })
        .from(despesas)
        .where(and(...conditions));

      if (allExpenses.length === 0) {
        return res.json({
          success: true,
          data: {
            message: 'Nenhuma despesa encontrada para o período e filtros selecionados.',
            analise_despesas: [],
            resumo_despesas: {},
            periodo: {
              dataInicio: startDate.toISOString(),
              dataFim: endDate.toISOString(),
              descricao: this.getPeriodDescription(startDate, endDate),
              timezone: timezone
            }
          }
        });
      }

      // Agrupar despesas por categoria e veículo
      const expensesByCategoryAndVehicle = allExpenses.reduce((acc, expense) => {
        const vehicleId = expense.idVeiculo || 'sem_veiculo';
        const category = expense.tipoDespesa;

        if (!acc[vehicleId]) {
          acc[vehicleId] = {};
        }
        if (!acc[vehicleId][category]) {
          acc[vehicleId][category] = { total: 0, count: 0 };
        }
        acc[vehicleId][category].total += Number(expense.valorDespesa) || 0;
        acc[vehicleId][category].count++;
        return acc;
      }, {} as Record<string, Record<string, { total: number; count: number }>>);

      const analysisResults = [];
      for (const vehicleId in expensesByCategoryAndVehicle) {
        const vehicleExpenses = expensesByCategoryAndVehicle[vehicleId];
        const vehicleInfo = vehicleId === 'sem_veiculo' ? 
          { id: 'sem_veiculo', marca: 'N/A', modelo: 'N/A' } : 
          (await db.select().from(veiculos).where(eq(veiculos.id, vehicleId)).limit(1))[0];

        const totalDespesasVeiculo = Object.values(vehicleExpenses).reduce((sum, cat) => sum + cat.total, 0);

        const categoriesFormatted = Object.entries(vehicleExpenses).map(([category, data]) => ({
          categoria: category,
          total_gasto: Math.round(data.total),
          numero_despesas: data.count,
          percentual_total: totalDespesasVeiculo > 0 ? 
            Math.round((data.total / totalDespesasVeiculo) * 10000) / 100 : 0,
        }));

        analysisResults.push({
          veiculo: vehicleInfo,
          total_despesas_veiculo: Math.round(totalDespesasVeiculo),
          despesas_por_categoria: categoriesFormatted,
        });
      }

      // Resumo consolidado de todas as despesas
      const resumoGeralDespesas = {
        total_despesas_geral: Math.round(analysisResults.reduce((sum, ar) => sum + ar.total_despesas_veiculo, 0)),
        despesas_por_categoria_geral: Object.values(allExpenses.reduce((acc, expense) => {
          const category = expense.tipoDespesa;
          if (!acc[category]) {
            acc[category] = { total: 0, count: 0 };
          }
          acc[category].total += Number(expense.valorDespesa) || 0;
          acc[category].count++;
          return acc;
        }, {} as Record<string, { total: number; count: number }>)).map(([category, data]) => ({
          categoria: category,
          total_gasto: Math.round(data.total),
          numero_despesas: data.count,
        })),
      };

      return res.json({
        success: true,
        data: {
          analise_despesas: analysisResults,
          resumo_despesas: resumoGeralDespesas,
          periodo: {
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            descricao: this.getPeriodDescription(startDate, endDate),
            timezone: timezone
          },
          metadata: {
            total_despesas_analisadas: allExpenses.length,
            data_processamento: new Date().toISOString()
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao gerar análise de despesas:', error);
      if (error instanceof ValidationError || error instanceof UnauthorizedError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Erro interno do servidor ao processar análise de despesas');
    }
  }

  /**
   * Análise de Lucratividade (Receita vs Despesa)
   */
  static async getProfitabilityAnalysis(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const validation = analyticsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        throw new ValidationError('Parâmetros inválidos', validation.error.errors);
      }

      const { dataInicio, dataFim, idVeiculo, periodo, timezone } = validation.data;

      if (idVeiculo && !(await this.validateVehicleAccess(req.user.id, idVeiculo))) {
        throw new NotFoundError('Veículo não encontrado ou sem acesso');
      }

      const { startDate, endDate } = this.calculatePeriod(periodo, dataInicio, dataFim, timezone);

      const journeyConditions = [
        eq(jornadas.idUsuario, req.user.id),
        gte(jornadas.dataInicio, startDate.toISOString()),
        lte(jornadas.dataInicio, endDate.toISOString()),
        isNull(jornadas.deletedAt)
      ];

      const expenseConditions = [
        eq(despesas.idUsuario, req.user.id),
        gte(despesas.dataDespesa, startDate.toISOString()),
        lte(despesas.dataDespesa, endDate.toISOString()),
        isNull(despesas.deletedAt)
      ];

      if (idVeiculo) {
        journeyConditions.push(eq(jornadas.idVeiculo, idVeiculo));
        expenseConditions.push(eq(despesas.idVeiculo, idVeiculo));
      }

      const [allJourneys, allExpenses] = await Promise.all([
        db.select({ ganho_bruto: jornadas.ganho_bruto, idVeiculo: jornadas.idVeiculo }).from(jornadas).where(and(...journeyConditions)),
        db.select({ valorDespesa: despesas.valorDespesa, idVeiculo: despesas.idVeiculo }).from(despesas).where(and(...expenseConditions)),
      ]);

      // Agrupar por veículo
      const profitabilityByVehicle = new Map<string, { totalReceita: number; totalDespesa: number }>();

      allJourneys.forEach(j => {
        const vehicleId = j.idVeiculo;
        const current = profitabilityByVehicle.get(vehicleId) || { totalReceita: 0, totalDespesa: 0 };
        current.totalReceita += Number(j.ganho_bruto) || 0;
        profitabilityByVehicle.set(vehicleId, current);
      });

      allExpenses.forEach(e => {
        const vehicleId = e.idVeiculo || 'sem_veiculo'; // Despesas podem não ter veículo associado
        const current = profitabilityByVehicle.get(vehicleId) || { totalReceita: 0, totalDespesa: 0 };
        current.totalDespesa += Number(e.valorDespesa) || 0;
        profitabilityByVehicle.set(vehicleId, current);
      });

      const analysisResults = [];
      let totalReceitaGeral = 0;
      let totalDespesaGeral = 0;

      for (const [vehicleId, data] of profitabilityByVehicle.entries()) {
        const vehicleInfo = vehicleId === 'sem_veiculo' ? 
          { id: 'sem_veiculo', marca: 'N/A', modelo: 'N/A' } : 
          (await db.select().from(veiculos).where(eq(veiculos.id, vehicleId)).limit(1))[0];

        const lucroBruto = data.totalReceita - data.totalDespesa;
        const margemLucro = data.totalReceita > 0 ? (lucroBruto / data.totalReceita) * 100 : 0;

        analysisResults.push({
          veiculo: vehicleInfo,
          total_receita: Math.round(data.totalReceita),
          total_despesa: Math.round(data.totalDespesa),
          lucro_bruto: Math.round(lucroBruto),
          margem_lucro: Math.round(margemLucro * 100) / 100,
        });

        totalReceitaGeral += data.totalReceita;
        totalDespesaGeral += data.totalDespesa;
      }

      const lucroBrutoGeral = totalReceitaGeral - totalDespesaGeral;
      const margemLucroGeral = totalReceitaGeral > 0 ? (lucroBrutoGeral / totalReceitaGeral) * 100 : 0;

      const resumoGeralLucratividade = {
        total_receita_geral: Math.round(totalReceitaGeral),
        total_despesa_geral: Math.round(totalDespesaGeral),
        lucro_bruto_geral: Math.round(lucroBrutoGeral),
        margem_lucro_geral: Math.round(margemLucroGeral * 100) / 100,
      };

      return res.json({
        success: true,
        data: {
          analise_lucratividade: analysisResults,
          resumo_lucratividade: resumoGeralLucratividade,
          periodo: {
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            descricao: this.getPeriodDescription(startDate, endDate),
            timezone: timezone
          },
          metadata: {
            data_processamento: new Date().toISOString()
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao gerar análise de lucratividade:', error);
      if (error instanceof ValidationError || error instanceof UnauthorizedError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Erro interno do servidor ao processar análise de lucratividade');
    }
  }

  /**
   * Análise de Comparação de Veículos
   */
  static async compareVehicles(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const validation = vehicleIdsSchema.safeParse(req.query);
      if (!validation.success) {
        throw new ValidationError('Parâmetros inválidos', validation.error.errors);
      }

      const { vehicle_ids } = validation.data;
      const { dataInicio, dataFim, periodo, timezone } = analyticsQuerySchema.safeParse(req.query).data; // Reutiliza o schema para período

      const { startDate, endDate } = this.calculatePeriod(periodo, dataInicio, dataFim, timezone);

      const comparisonResults = [];
      for (const vehicleId of vehicle_ids) {
        // Validar acesso a cada veículo
        if (!(await this.validateVehicleAccess(req.user.id, vehicleId))) {
          throw new NotFoundError(`Veículo ${vehicleId} não encontrado ou sem acesso`);
        }

        const vehicleInfo = (await db.select().from(veiculos).where(eq(veiculos.id, vehicleId)).limit(1))[0];

        // Buscar dados para o veículo
        const [fuelings, journeys, expenses] = await Promise.all([
          db.select({
            quantidadeLitros: abastecimentos.quantidadeLitros,
            valorTotal: abastecimentos.valorTotal,
            kmAtual: abastecimentos.kmAtual,
            dataAbastecimento: abastecimentos.dataAbastecimento
          }).from(abastecimentos).where(and(
            eq(abastecimentos.idVeiculo, vehicleId),
            eq(abastecimentos.idUsuario, req.user.id),
            gte(abastecimentos.dataAbastecimento, startDate.toISOString()),
            lte(abastecimentos.dataAbastecimento, endDate.toISOString()),
            isNull(abastecimentos.deletedAt)
          )),
          db.select({
            ganho_bruto: jornadas.ganho_bruto,
            km_total: jornadas.km_total,
            tempo_total: jornadas.tempo_total,
            dataInicio: jornadas.dataInicio
          }).from(jornadas).where(and(
            eq(jornadas.idVeiculo, vehicleId),
            eq(jornadas.idUsuario, req.user.id),
            gte(jornadas.dataInicio, startDate.toISOString()),
            lte(jornadas.dataInicio, endDate.toISOString()),
            isNull(jornadas.deletedAt)
          )),
          db.select({
            valorDespesa: despesas.valorDespesa,
            tipoDespesa: despesas.tipoDespesa,
            dataDespesa: despesas.dataDespesa
          }).from(despesas).where(and(
            eq(despesas.idVeiculo, vehicleId),
            eq(despesas.idUsuario, req.user.id),
            gte(despesas.dataDespesa, startDate.toISOString()),
            lte(despesas.dataDespesa, endDate.toISOString()),
            isNull(despesas.deletedAt)
          )),
        ]);

        // Calcular métricas para o veículo
        const totalLitros = fuelings.reduce((sum, f) => sum + (Number(f.quantidadeLitros) || 0), 0);
        const totalGastoCombustivel = fuelings.reduce((sum, f) => sum + (Number(f.valorTotal) || 0), 0);
        const totalKmJornadas = journeys.reduce((sum, j) => sum + (Number(j.km_total) || 0), 0);
        const totalGanhoBrutoJornadas = journeys.reduce((sum, j) => sum + (Number(j.ganho_bruto) || 0), 0);
        const totalDespesas = expenses.reduce((sum, e) => sum + (Number(e.valorDespesa) || 0), 0);

        const consumoMedio = totalKmJornadas > 0 && totalLitros > 0 ? totalKmJornadas / totalLitros : 0;
        const custoPorKm = totalKmJornadas > 0 ? (totalGastoCombustivel + totalDespesas) / totalKmJornadas : 0;
        const lucroPorKm = totalKmJornadas > 0 ? (totalGanhoBrutoJornadas - totalGastoCombustivel - totalDespesas) / totalKmJornadas : 0;
        const roi = totalGastoCombustivel + totalDespesas > 0 ? 
          ((totalGanhoBrutoJornadas - totalGastoCombustivel - totalDespesas) / (totalGastoCombustivel + totalDespesas)) * 100 : 0;

        comparisonResults.push({
          veiculo: vehicleInfo,
          metricas: {
            total_litros: Math.round(totalLitros * 100) / 100,
            total_gasto_combustivel: Math.round(totalGastoCombustivel),
            total_km_jornadas: Math.round(totalKmJornadas),
            total_ganho_bruto_jornadas: Math.round(totalGanhoBrutoJornadas),
            total_despesas: Math.round(totalDespesas),
            lucro_liquido: Math.round(totalGanhoBrutoJornadas - totalGastoCombustivel - totalDespesas),
            consumo_medio: Math.round(consumoMedio * 100) / 100,
            custo_por_km: Math.round(custoPorKm * 100) / 100,
            lucro_por_km: Math.round(lucroPorKm * 100) / 100,
            roi: Math.round(roi * 100) / 100,
            numero_jornadas: journeys.length,
            numero_abastecimentos: fuelings.length,
            numero_despesas: expenses.length,
          },
        });
      }

      // Calcular rankings e estatísticas consolidadas
      const rankings = {
        consumo_medio: [...comparisonResults].sort((a, b) => a.metricas.consumo_medio - b.metricas.consumo_medio)
          .map(v => ({ veiculo: v.veiculo.modelo, valor: v.metricas.consumo_medio })),
        lucro_liquido: [...comparisonResults].sort((a, b) => b.metricas.lucro_liquido - a.metricas.lucro_liquido)
          .map(v => ({ veiculo: v.veiculo.modelo, valor: v.metricas.lucro_liquido })),
        roi: [...comparisonResults].sort((a, b) => b.metricas.roi - a.metricas.roi)
          .map(v => ({ veiculo: v.veiculo.modelo, valor: v.metricas.roi })),
      };

      const estatisticasConsolidadas = {
        total_receita_comparada: Math.round(comparisonResults.reduce((sum, v) => sum + v.metricas.total_ganho_bruto_jornadas, 0)),
        total_despesa_comparada: Math.round(comparisonResults.reduce((sum, v) => sum + v.metricas.total_despesas + v.metricas.total_gasto_combustivel, 0)),
        lucro_liquido_comparado: Math.round(comparisonResults.reduce((sum, v) => sum + v.metricas.lucro_liquido, 0)),
      };

      return res.json({
        success: true,
        data: {
          comparacao_veiculos: comparisonResults,
          rankings: rankings,
          estatisticas_consolidadas: estatisticasConsolidadas,
          periodo: {
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            descricao: this.getPeriodDescription(startDate, endDate),
            timezone: timezone
          },
          metadata: {
            total_veiculos_comparados: comparisonResults.length,
            data_processamento: new Date().toISOString()
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao comparar veículos:', error);
      if (error instanceof ValidationError || error instanceof UnauthorizedError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Erro interno do servidor ao processar comparação de veículos');
    }
  }
}


