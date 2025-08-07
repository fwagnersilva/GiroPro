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
  data_inicio: z.string().datetime().optional(),
  data_fim: z.string().datetime().optional(),
  id_veiculo: z.string().uuid().optional(),
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
    data_inicio?: string, 
    data_fim?: string,
    timezone: string = 'America/Sao_Paulo'
  ): Period {
    let startDate: Date;
    let endDate: Date = new Date();

    if (data_inicio && data_fim) {
      startDate = new Date(data_inicio);
      endDate = new Date(data_fim);
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
        eq(veiculos.id_usuario, userId),
        isNull(veiculos.deleted_at)
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

      const { data_inicio, data_fim, id_veiculo, periodo, timezone } = validation.data;
      
      // Validar acesso ao veículo se especificado
      if (id_veiculo && !(await this.validateVehicleAccess(req.user.id, id_veiculo))) {
        throw new NotFoundError('Veículo não encontrado ou sem acesso');
      }

      const { startDate, endDate } = this.calculatePeriod(periodo, data_inicio, data_fim, timezone);

      // Buscar veículos do usuário com query otimizada
      const vehicleConditions = [
        eq(veiculos.id_usuario, req.user.id),
        isNull(veiculos.deleted_at)
      ];

      if (id_veiculo) {
        vehicleConditions.push(eq(veiculos.id, id_veiculo));
      }

      const userVehicles = await db
        .select({
          id: veiculos.id,
          marca: veiculos.marca,
          modelo: veiculos.modelo,
          ano: veiculos.ano,
          placa: veiculos.placa,
          tipo_combustivel: veiculos.tipo_combustivel,
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
              data_abastecimento: abastecimentos.data_abastecimento,
              quantidade_litros: abastecimentos.quantidade_litros,
              valor_total: abastecimentos.valor_total,
              km_atual: abastecimentos.km_atual,
            })
            .from(abastecimentos)
            .where(
              and(
                eq(abastecimentos.id_veiculo, vehicle.id),
                eq(abastecimentos.id_usuario, req.user.id),
                gte(abastecimentos.data_abastecimento, startDate.toISOString()),
                lte(abastecimentos.data_abastecimento, endDate.toISOString()),
                isNull(abastecimentos.deleted_at)
              )
            )
            .orderBy(asc(abastecimentos.data_abastecimento)),

          // Buscar jornadas otimizado
          db
            .select({
              km_total: jornadas.km_total,
              data_inicio: jornadas.data_inicio,
              data_fim: jornadas.data_fim,
              ganho_bruto: jornadas.ganho_bruto,
            })
            .from(jornadas)
            .where(
              and(
                eq(jornadas.id_veiculo, vehicle.id),
                eq(jornadas.id_usuario, req.user.id),
                gte(jornadas.data_inicio, startDate.toISOString()),
                lte(jornadas.data_inicio, endDate.toISOString()),
                isNull(jornadas.deleted_at)
              )
            )
        ]);

        // Calcular métricas com validação
        const totalLitros = fuelings.reduce((sum, f) => sum + (Number(f.quantidade_litros) || 0), 0);
        const totalGastoCombustivel = fuelings.reduce((sum, f) => sum + (Number(f.valor_total) || 0), 0);
        const totalKm = journeys.reduce((sum, j) => sum + (Number(j.km_total) || 0), 0);
        const totalFaturamento = journeys.reduce((sum, j) => sum + (Number(j.ganho_bruto) || 0), 0);
        
        const consumoMedio = totalKm > 0 && totalLitros > 0 ? totalKm / totalLitros : 0;
        const custoMedioPorKm = totalKm > 0 ? totalGastoCombustivel / totalKm : 0;
        const custoMedioPorLitro = totalLitros > 0 ? totalGastoCombustivel / totalLitros : 0;

        // Análise de eficiência temporal melhorada
        const fuelingsWithEfficiency = fuelings.map((fueling, index) => {
          if (index === 0 || !fueling.km_atual) {
            return { 
              ...fueling, 
              consumo_periodo: null, 
              eficiencia: null,
              km_percorridos: null
            };
          }
          
          const prevFueling = fuelings[index - 1];
          if (!prevFueling.km_atual) {
            return { 
              ...fueling, 
              consumo_periodo: null, 
              eficiencia: null,
              km_percorridos: null
            };
          }

          const kmPercorridos = Number(fueling.km_atual) - Number(prevFueling.km_atual);
          const litrosConsumidos = Number(fueling.quantidade_litros) || 0;
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
            data_inicio: startDate.toISOString(),
            data_fim: endDate.toISOString(),
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
            data_inicio: startDate.toISOString(),
            data_fim: endDate.toISOString(),
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
      roi_combustivel: {
        melhor: Math.max(...rois),
        pior: Math.min(...rois),
        media: Math.round(rois.reduce((sum, val) => sum + val, 0) / rois.length)
      }
    };
  }

  /**
   * Análise de produtividade por veículo - MELHORADA
   */
  static async getProductivityAnalysis(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const validation = analyticsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        throw new ValidationError('Parâmetros inválidos', validation.error.errors);
      }

      const { data_inicio, data_fim, id_veiculo, periodo, timezone } = validation.data;
      
      // Validar acesso ao veículo se especificado
      if (id_veiculo && !(await this.validateVehicleAccess(req.user.id, id_veiculo))) {
        throw new NotFoundError('Veículo não encontrado ou sem acesso');
      }

      const { startDate, endDate } = this.calculatePeriod(periodo, data_inicio, data_fim, timezone);

      // Query otimizada para análise de produtividade
      const productivityQuery = db
        .select({
          veiculo_id: veiculos.id,
          veiculo_marca: veiculos.marca,
          veiculo_modelo: veiculos.modelo,
          veiculo_placa: veiculos.placa,
          veiculo_ano: veiculos.ano,
          total_faturamento: sql<number>`COALESCE(SUM(${jornadas.ganho_bruto}), 0)`,
          total_km: sql<number>`COALESCE(SUM(${jornadas.km_total}), 0)`,
          total_tempo: sql<number>`COALESCE(SUM(${jornadas.tempo_total}), 0)`,
          numero_jornadas: sql<number>`COUNT(${jornadas.id})`,
          ganho_medio_jornada: sql<number>`COALESCE(AVG(${jornadas.ganho_bruto}), 0)`,
          km_medio_jornada: sql<number>`COALESCE(AVG(${jornadas.km_total}), 0)`,
          tempo_medio_jornada: sql<number>`COALESCE(AVG(${jornadas.tempo_total}), 0)`,
          maior_ganho_jornada: sql<number>`COALESCE(MAX(${jornadas.ganho_bruto}), 0)`,
          menor_ganho_jornada: sql<number>`COALESCE(MIN(${jornadas.ganho_bruto}), 0)`,
        })
        .from(veiculos)
        .leftJoin(jornadas, and(
          eq(veiculos.id, jornadas.id_veiculo),
          eq(jornadas.id_usuario, req.user.id),
          gte(jornadas.data_inicio, startDate.toISOString()),
          lte(jornadas.data_inicio, endDate.toISOString()),
          isNull(jornadas.deleted_at)
        ))
        .where(and(
          eq(veiculos.id_usuario, req.user.id),
          isNull(veiculos.deleted_at),
          id_veiculo ? eq(veiculos.id, id_veiculo) : sql`true`
        ))
        .groupBy(veiculos.id, veiculos.marca, veiculos.modelo, veiculos.placa, veiculos.ano)
        .having(sql`COUNT(${jornadas.id}) > 0`); // Apenas veículos com jornadas

      const productivityData = await productivityQuery;

      if (productivityData.length === 0) {
        throw new NotFoundError('Nenhuma jornada encontrada no período especificado');
      }

      // Calcular despesas por veículo no mesmo período
      const expensesQuery = await db
        .select({
          veiculo_id: despesas.id_veiculo,
          total_despesas: sql<number>`COALESCE(SUM(${despesas.valor_despesa}), 0)`,
          numero_despesas: sql<number>`COUNT(${despesas.id})`,
        })
        .from(despesas)
        .where(and(
          eq(despesas.id_usuario, req.user.id),
          gte(despesas.data_despesa, startDate.toISOString()),
          lte(despesas.data_despesa, endDate.toISOString()),
          isNull(despesas.deleted_at)
        ))
        .groupBy(despesas.id_veiculo);

      const expensesMap = new Map(
        expensesQuery.map(exp => [exp.veiculo_id, exp])
      );

      // Calcular métricas derivadas melhoradas
      const productivityAnalysis = productivityData.map(vehicle => {
        const totalFaturamento = Number(vehicle.total_faturamento) || 0;
        const totalKm = Number(vehicle.total_km) || 0;
        const totalTempo = Number(vehicle.total_tempo) || 0; // em minutos
        const numeroJornadas = Number(vehicle.numero_jornadas) || 0;

        const expenses = expensesMap.get(vehicle.veiculo_id);
        const totalDespesas = Number(expenses?.total_despesas) || 0;
        const numeroDespesas = Number(expenses?.numero_despesas) || 0;

        const lucroLiquido = totalFaturamento - totalDespesas;
        const margemLucro = totalFaturamento > 0 ? (lucroLiquido / totalFaturamento) * 100 : 0;

        // Calcular produtividade
        const ganhoPorKm = totalKm > 0 ? totalFaturamento / totalKm : 0;
        const ganhoPorHora = totalTempo > 0 ? (totalFaturamento / totalTempo) * 60 : 0;
        const kmPorHora = totalTempo > 0 ? (totalKm / totalTempo) * 60 : 0;
        const despesaPorKm = totalKm > 0 ? totalDespesas / totalKm : 0;

        // Classificações melhoradas
        let classificacaoEficiencia = 'Baixa';
        if (ganhoPorKm >= 200) classificacaoEficiencia = 'Excelente';
        else if (ganhoPorKm >= 150) classificacaoEficiencia = 'Boa';
        else if (ganhoPorKm >= 100) classificacaoEficiencia = 'Regular';

        let classificacaoLucro = 'Baixa';
        if (margemLucro >= 30) classificacaoLucro = 'Excelente';
        else if (margemLucro >= 20) classificacaoLucro = 'Boa';
        else if (margemLucro >= 10) classificacaoLucro = 'Regular';

        return {
          veiculo: {
            id: vehicle.veiculo_id,
            marca: vehicle.veiculo_marca,
            modelo: vehicle.veiculo_modelo,
            placa: vehicle.veiculo_placa,
            ano: vehicle.veiculo_ano,
          },
          metricas_totais: {
            faturamento_total: Math.round(totalFaturamento),
            despesas_total: Math.round(totalDespesas),
            lucro_liquido: Math.round(lucroLiquido),
            margem_lucro: Math.round(margemLucro * 100) / 100,
            km_total: Math.round(totalKm * 100) / 100,
            tempo_total_minutos: totalTempo,
            tempo_total_horas: Math.round((totalTempo / 60) * 100) / 100,
            numero_jornadas: numeroJornadas,
            numero_despesas: numeroDespesas,
          },
          metricas_medias: {
            ganho_medio_jornada: Math.round(Number(vehicle.ganho_medio_jornada)),
            km_medio_jornada: Math.round(Number(vehicle.km_medio_jornada) * 100) / 100,
            tempo_medio_jornada_minutos: Math.round(Number(vehicle.tempo_medio_jornada)),
            tempo_medio_jornada_horas: Math.round((Number(vehicle.tempo_medio_jornada) / 60) * 100) / 100,
            despesa_media: numeroDespesas > 0 ? Math.round(totalDespesas / numeroDespesas) : 0,
          },
          metricas_extremas: {
            maior_ganho_jornada: Math.round(Number(vehicle.maior_ganho_jornada)),
            menor_ganho_jornada: Math.round(Number(vehicle.menor_ganho_jornada)),
          },
          produtividade: {
            ganho_por_km: Math.round(ganhoPorKm),
            ganho_por_hora: Math.round(ganhoPorHora),
            km_por_hora: Math.round(kmPorHora * 100) / 100,
            despesa_por_km: Math.round(despesaPorKm),
            lucro_por_km: Math.round((ganhoPorKm - despesaPorKm)),
            classificacao_eficiencia: classificacaoEficiencia,
            classificacao_lucro: classificacaoLucro,
            roi: totalDespesas > 0 ? Math.round(((lucroLiquido / totalDespesas) * 100) * 100) / 100 : 0,
          }
        };
      });

      // Rankings melhorados
      const rankings = {
        ganho_por_km: [...productivityAnalysis]
          .sort((a, b) => b.produtividade.ganho_por_km - a.produtividade.ganho_por_km)
          .map((item, index) => ({
            posicao: index + 1,
            veiculo: item.veiculo,
            ganho_por_km: item.produtividade.ganho_por_km,
            classificacao: item.produtividade.classificacao_eficiencia
          })),
        ganho_por_hora: [...productivityAnalysis]
          .sort((a, b) => b.produtividade.ganho_por_hora - a.produtividade.ganho_por_hora)
          .map((item, index) => ({
            posicao: index + 1,
            veiculo: item.veiculo,
            ganho_por_hora: item.produtividade.ganho_por_hora
          })),
        lucro_liquido: [...productivityAnalysis]
          .sort((a, b) => b.metricas_totais.lucro_liquido - a.metricas_totais.lucro_liquido)
          .map((item, index) => ({
            posicao: index + 1,
            veiculo: item.veiculo,
            lucro_liquido: item.metricas_totais.lucro_liquido,
            margem_lucro: item.metricas_totais.margem_lucro
          })),
        roi: [...productivityAnalysis]
          .sort((a, b) => b.produtividade.roi - a.produtividade.roi)
          .map((item, index) => ({
            posicao: index + 1,
            veiculo: item.veiculo,
            roi: item.produtividade.roi
          }))
      };

      // Estatísticas gerais
      const estatisticasGerais = {
        total_faturamento: productivityAnalysis.reduce((sum, item) => sum + item.metricas_totais.faturamento_total, 0),
        total_despesas: productivityAnalysis.reduce((sum, item) => sum + item.metricas_totais.despesas_total, 0),
        total_lucro: productivityAnalysis.reduce((sum, item) => sum + item.metricas_totais.lucro_liquido, 0),
        total_km: productivityAnalysis.reduce((sum, item) => sum + item.metricas_totais.km_total, 0),
        total_jornadas: productivityAnalysis.reduce((sum, item) => sum + item.metricas_totais.numero_jornadas, 0),
        veiculo_mais_produtivo: rankings.ganho_por_km[0]?.veiculo || null,
        veiculo_mais_lucrativo: rankings.lucro_liquido[0]?.veiculo || null,
      };

      return res.json({
        success: true,
        data: {
          analise_produtividade: productivityAnalysis,
          rankings,
          estatisticas_gerais: estatisticasGerais,
          periodo: {
            data_inicio: startDate.toISOString(),
            data_fim: endDate.toISOString(),
            descricao: this.getPeriodDescription(startDate, endDate),
            timezone: timezone
          },
          metadata: {
            total_veiculos_analisados: productivityAnalysis.length,
            criterios_classificacao: {
              eficiencia: {
                excelente: '>= R$ 2,00/km',
                boa: '>= R$ 1,50/km',
                regular: '>= R$ 1,00/km',
                baixa: '< R$ 1,00/km'
              },
              lucro: {
                excelente: '>= 30%',
                boa: '>= 20%',
                regular: '>= 10%',
                baixa: '< 10%'
              }
            }
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao gerar análise de produtividade:', error);
      
      if (error instanceof ValidationError || error instanceof UnauthorizedError || error instanceof NotFoundError) {
        throw error;
      }
      
      throw new Error('Erro interno do servidor ao processar análise de produtividade');
    }
  }

  /**
   * Identificação de padrões temporais - MELHORADA
   */
  static async getTemporalPatterns(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const validation = analyticsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        throw new ValidationError('Parâmetros inválidos', validation.error.errors);
      }

      const { data_inicio, data_fim, id_veiculo, periodo, timezone } = validation.data;
      
      if (id_veiculo && !(await this.validateVehicleAccess(req.user.id, id_veiculo))) {
        throw new NotFoundError('Veículo não encontrado ou sem acesso');
      }

      const { startDate, endDate } = this.calculatePeriod(periodo, data_inicio, data_fim, timezone);

      // Query otimizada para análise temporal
      const temporalQuery = await db
        .select({
          veiculo_id: veiculos.id,
          veiculo_marca: veiculos.marca,
          veiculo_modelo: veiculos.modelo,
          data_inicio: jornadas.data_inicio,
          ganho_bruto: jornadas.ganho_bruto,
          km_total: jornadas.km_total,
          tempo_total: jornadas.tempo_total,
        })
        .from(jornadas)
        .innerJoin(veiculos, eq(jornadas.id_veiculo, veiculos.id))
        .where(
          and(
            eq(veiculos.id_usuario, req.user.id),
            isNull(veiculos.deleted_at),
            id_veiculo ? eq(veiculos.id, id_veiculo) : sql`true`,
            gte(jornadas.data_inicio, startDate.toISOString()),
            lte(jornadas.data_inicio, endDate.toISOString()),
            isNull(jornadas.deleted_at)
          )
        )
        .orderBy(asc(jornadas.data_inicio));

      if (temporalQuery.length === 0) {
        throw new NotFoundError('Nenhuma jornada encontrada no período especificado');
      }

      // Agrupar por dia da semana com métricas avançadas
      const dailyPatterns = temporalQuery.reduce((acc: any, curr) => {
        const date = new Date(curr.data_inicio);
        const dayOfWeek = date.getDay();
        
        if (!acc[dayOfWeek]) {
          acc[dayOfWeek] = {
            faturamento_total: 0,
            km_total: 0,
            numero_jornadas: 0,
            tempo_total: 0,
            jornadas: []
          };
        }
        
        const ganho = Number(curr.ganho_bruto) || 0;
        const km = Number(curr.km_total) || 0;
        const tempo = Number(curr.tempo_total) || 0;
        
        acc[dayOfWeek].faturamento_total += ganho;
        acc[dayOfWeek].km_total += km;
        acc[dayOfWeek].numero_jornadas++;
        acc[dayOfWeek].tempo_total += tempo;
        acc[dayOfWeek].jornadas.push({ ganho, km, tempo });
        
        return acc;
      }, {});

      // Converter para array e calcular métricas adicionais
      const dailyPatternsArray = Object.keys(dailyPatterns).map(dayIndex => {
        const dayData = dailyPatterns[dayIndex];
        const jornadas = dayData.jornadas;
        
        // Calcular métricas estatísticas
        const ganhos = jornadas.map((j: any) => j.ganho);
        const kms = jornadas.map((j: any) => j.km);
        
        ganhos.sort((a, b) => a - b);
        kms.sort((a, b) => a - b);
        
        const medianGanho = ganhos.length % 2 === 0 
          ? (ganhos[ganhos.length/2 - 1] + ganhos[ganhos.length/2]) / 2
          : ganhos[Math.floor(ganhos.length/2)];
          
        const medianKm = kms.length % 2 === 0 
          ? (kms[kms.length/2 - 1] + kms[kms.length/2]) / 2
          : kms[Math.floor(kms.length/2)];

        return {
          dia_semana: this.getDayOfWeekName(Number(dayIndex)),
          dia_index: Number(dayIndex),
          faturamento_total: Math.round(dayData.faturamento_total),
          faturamento_medio: Math.round(dayData.faturamento_total / dayData.numero_jornadas),
          faturamento_mediano: Math.round(medianGanho),
          km_total: Math.round(dayData.km_total * 100) / 100,
          km_medio: Math.round((dayData.km_total / dayData.numero_jornadas) * 100) / 100,
          km_mediano: Math.round(medianKm * 100) / 100,
          numero_jornadas: dayData.numero_jornadas,
          tempo_total_horas: Math.round((dayData.tempo_total / 60) * 100) / 100,
          tempo_medio_horas: Math.round(((dayData.tempo_total / dayData.numero_jornadas) / 60) * 100) / 100,
          produtividade_por_hora: dayData.tempo_total > 0 
            ? Math.round((dayData.faturamento_total / dayData.tempo_total) * 60) 
            : 0,
          produtividade_por_km: dayData.km_total > 0 
            ? Math.round(dayData.faturamento_total / dayData.km_total) 
            : 0
        };
      }).sort((a, b) => a.dia_index - b.dia_index);

      // Agrupar por hora do dia com análise mais detalhada
      const hourlyPatterns = temporalQuery.reduce((acc: any, curr) => {
        const hourOfDay = new Date(curr.data_inicio).getHours();
        
        if (!acc[hourOfDay]) {
          acc[hourOfDay] = {
            faturamento_total: 0,
            km_total: 0,
            numero_jornadas: 0,
            tempo_total: 0,
          };
        }
        
        acc[hourOfDay].faturamento_total += Number(curr.ganho_bruto) || 0;
        acc[hourOfDay].km_total += Number(curr.km_total) || 0;
        acc[hourOfDay].numero_jornadas++;
        acc[hourOfDay].tempo_total += Number(curr.tempo_total) || 0;
        
        return acc;
      }, {});

      const hourlyPatternsArray = Object.keys(hourlyPatterns).map(hour => {
        const hourData = hourlyPatterns[hour];
        
        // Classificar período do dia
        let periodo_dia = 'Madrugada';
        const h = Number(hour);
        if (h >= 6 && h < 12) periodo_dia = 'Manhã';
        else if (h >= 12 && h < 18) periodo_dia = 'Tarde';
        else if (h >= 18 && h < 24) periodo_dia = 'Noite';

        return {
          hora: h,
          periodo_dia,
          faturamento_total: Math.round(hourData.faturamento_total),
          faturamento_medio: Math.round(hourData.faturamento_total / hourData.numero_jornadas),
          km_total: Math.round(hourData.km_total * 100) / 100,
          numero_jornadas: hourData.numero_jornadas,
          tempo_total_horas: Math.round((hourData.tempo_total / 60) * 100) / 100,
          produtividade_por_hora: hourData.tempo_total > 0 
            ? Math.round((hourData.faturamento_total / hourData.tempo_total) * 60) 
            : 0
        };
      }).sort((a, b) => a.hora - b.hora);

      // Análise de padrões por período do dia
      const periodosPadrao = hourlyPatternsArray.reduce((acc: any, curr) => {
        if (!acc[curr.periodo_dia]) {
          acc[curr.periodo_dia] = {
            faturamento_total: 0,
            numero_jornadas: 0,
            km_total: 0,
            tempo_total: 0
          };
        }
        
        acc[curr.periodo_dia].faturamento_total += curr.faturamento_total;
        acc[curr.periodo_dia].numero_jornadas += curr.numero_jornadas;
        acc[curr.periodo_dia].km_total += curr.km_total;
        acc[curr.periodo_dia].tempo_total += curr.tempo_total_horas;
        
        return acc;
      }, {});

      // Converter para array e calcular métricas
      const periodosArray = Object.keys(periodosPadrao).map(periodo => {
        const data = periodosPadrao[periodo];
        return {
          periodo,
          faturamento_total: Math.round(data.faturamento_total),
          faturamento_medio: data.numero_jornadas > 0 ? Math.round(data.faturamento_total / data.numero_jornadas) : 0,
          numero_jornadas: data.numero_jornadas,
          participacao_faturamento: Math.round((data.faturamento_total / temporalQuery.reduce((sum, j) => sum + (Number(j.ganho_bruto) || 0), 0)) * 100 * 100) / 100,
          produtividade_media: data.tempo_total > 0 ? Math.round(data.faturamento_total / data.tempo_total) : 0
        };
      });

      // Identificar melhor dia e melhor horário
      const melhorDia = dailyPatternsArray.reduce((max, curr) => 
        curr.faturamento_total > max.faturamento_total ? curr : max
      );
      
      const melhorHora = hourlyPatternsArray.reduce((max, curr) => 
        curr.faturamento_total > max.faturamento_total ? curr : max
      );

      // Análise de sazonalidade (se período > 30 dias)
      const diasPeriodo = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      let analise_sazonalidade = null;
      
      if (diasPeriodo >= 30) {
        const jornadasPorData = temporalQuery.reduce((acc: any, curr) => {
          const data = new Date(curr.data_inicio).toDateString();
          if (!acc[data]) acc[data] = { faturamento: 0, jornadas: 0 };
          acc[data].faturamento += Number(curr.ganho_bruto) || 0;
          acc[data].jornadas++;
          return acc;
        }, {});

        const faturamentosDiarios = Object.values(jornadasPorData).map((d: any) => d.faturamento);
        const media = faturamentosDiarios.reduce((sum: number, val: number) => sum + val, 0) / faturamentosDiarios.length;
        const variancia = faturamentosDiarios.reduce((sum: number, val: number) => sum + Math.pow(val - media, 2), 0) / faturamentosDiarios.length;
        const desvioPadrao = Math.sqrt(variancia);
        const coeficienteVariacao = media > 0 ? (desvioPadrao / media) * 100 : 0;

        analise_sazonalidade = {
          faturamento_medio_diario: Math.round(media),
          desvio_padrao: Math.round(desvioPadrao),
          coeficiente_variacao: Math.round(coeficienteVariacao * 100) / 100,
          interpretacao: coeficienteVariacao < 20 ? 'Baixa variabilidade' :
                        coeficienteVariacao < 40 ? 'Variabilidade moderada' : 'Alta variabilidade'
        };
      }

      return res.json({
        success: true,
        data: {
          padroes_diarios: dailyPatternsArray,
          padroes_por_hora: hourlyPatternsArray,
          padroes_por_periodo: periodosArray,
          insights: {
            melhor_dia_semana: melhorDia,
            melhor_horario: melhorHora,
            total_jornadas_analisadas: temporalQuery.length,
            dias_com_atividade: [...new Set(temporalQuery.map(j => new Date(j.data_inicio).toDateString()))].length
          },
          analise_sazonalidade,
          periodo: {
            data_inicio: startDate.toISOString(),
            data_fim: endDate.toISOString(),
            descricao: this.getPeriodDescription(startDate, endDate),
            timezone: timezone,
            dias_analisados: diasPeriodo
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao gerar análise de padrões temporais:', error);
      
      if (error instanceof ValidationError || error instanceof UnauthorizedError || error instanceof NotFoundError) {
        throw error;
      }
      
      throw new Error('Erro interno do servidor ao processar análise temporal');
    }
  }

  /**
   * Comparação entre veículos - MELHORADA
   */
  static async getVehicleComparison(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      const validation = analyticsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        throw new ValidationError('Parâmetros inválidos', validation.error.errors);
      }

      const { data_inicio, data_fim, periodo, timezone } = validation.data;
      
      const { startDate, endDate } = this.calculatePeriod(periodo, data_inicio, data_fim, timezone);

      // Query otimizada para comparação de veículos
      const vehicleComparisonData = await db
        .select({
          veiculo_id: veiculos.id,
          marca: veiculos.marca,
          modelo: veiculos.modelo,
          placa: veiculos.placa,
          ano: veiculos.ano,
          tipo_combustivel: veiculos.tipo_combustivel,
          total_faturamento: sql<number>`COALESCE(SUM(${jornadas.ganho_bruto}), 0)`,
          total_km: sql<number>`COALESCE(SUM(${jornadas.km_total}), 0)`,
          numero_jornadas: sql<number>`COUNT(${jornadas.id})`,
          tempo_total: sql<number>`COALESCE(SUM(${jornadas.tempo_total}), 0)`,
        })
        .from(veiculos)
        .leftJoin(jornadas, and(
          eq(veiculos.id, jornadas.id_veiculo),
          eq(jornadas.id_usuario, req.user.id),
          gte(jornadas.data_inicio, startDate.toISOString()),
          lte(jornadas.data_inicio, endDate.toISOString()),
          isNull(jornadas.deleted_at)
        ))
        .where(and(
          eq(veiculos.id_usuario, req.user.id),
          isNull(veiculos.deleted_at)
        ))
        .groupBy(veiculos.id, veiculos.marca, veiculos.modelo, veiculos.placa, veiculos.ano, veiculos.tipo_combustivel)
        .having(sql`COUNT(${jornadas.id}) > 0`);

      if (vehicleComparisonData.length === 0) {
        throw new NotFoundError('Nenhum veículo com jornadas encontrado no período especificado');
      }

      // Buscar despesas de cada veículo
      const expensesData = await db
        .select({
          veiculo_id: despesas.id_veiculo,
          total_despesas: sql<number>`COALESCE(SUM(${despesas.valor_despesa}), 0)`,
          numero_despesas: sql<number>`COUNT(${despesas.id})`,
        })
        .from(despesas)
        .where(and(
          eq(despesas.id_usuario, req.user.id),
          gte(despesas.data_despesa, startDate.toISOString()),
          lte(despesas.data_despesa, endDate.toISOString()),
          isNull(despesas.deleted_at)
        ))
        .groupBy(despesas.id_veiculo);

      const expensesMap = new Map(expensesData.map(exp => [exp.veiculo_id, exp]));

      // Buscar dados de combustível
      const fuelData = await db
        .select({
          veiculo_id: abastecimentos.id_veiculo,
          total_litros: sql<number>`COALESCE(SUM(${abastecimentos.quantidade_litros}), 0)`,
          total_gasto_combustivel: sql<number>`COALESCE(SUM(${abastecimentos.valor_total}), 0)`,
          numero_abastecimentos: sql<number>`COUNT(${abastecimentos.id})`,
        })
        .from(abastecimentos)
        .where(and(
          eq(abastecimentos.id_usuario, req.user.id),
          gte(abastecimentos.data_abastecimento, startDate.toISOString()),
          lte(abastecimentos.data_abastecimento, endDate.toISOString()),
          isNull(abastecimentos.deleted_at)
        ))
        .groupBy(abastecimentos.id_veiculo);

      const fuelMap = new Map(fuelData.map(fuel => [fuel.veiculo_id, fuel]));

      // Processar dados e calcular métricas comparativas
      const comparacaoCompleta = vehicleComparisonData.map(vehicle => {
        const expenses = expensesMap.get(vehicle.veiculo_id) || { total_despesas: 0, numero_despesas: 0 };
        const fuel = fuelMap.get(vehicle.veiculo_id) || { total_litros: 0, total_gasto_combustivel: 0, numero_abastecimentos: 0 };

        const faturamentoTotal = Number(vehicle.total_faturamento);
        const despesasTotal = Number(expenses.total_despesas);
        const combustivelTotal = Number(fuel.total_gasto_combustivel);
        const kmTotal = Number(vehicle.total_km);
        const tempoTotal = Number(vehicle.tempo_total);
        const litrosTotal = Number(fuel.total_litros);

        const lucroLiquido = faturamentoTotal - despesasTotal - combustivelTotal;
        const lucroOperacional = faturamentoTotal - combustivelTotal; // Sem contar outras despesas
        
        return {
          veiculo: {
            id: vehicle.veiculo_id,
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            placa: vehicle.placa,
            ano: vehicle.ano,
            tipo_combustivel: vehicle.tipo_combustivel
          },
          metricas_financeiras: {
            faturamento_total: Math.round(faturamentoTotal),
            despesas_total: Math.round(despesasTotal),
            combustivel_total: Math.round(combustivelTotal),
            lucro_liquido: Math.round(lucroLiquido),
            lucro_operacional: Math.round(lucroOperacional),
            margem_liquida: faturamentoTotal > 0 ? Math.round((lucroLiquido / faturamentoTotal) * 100 * 100) / 100 : 0,
            margem_operacional: faturamentoTotal > 0 ? Math.round((lucroOperacional / faturamentoTotal) * 100 * 100) / 100 : 0,
            roi: (despesasTotal + combustivelTotal) > 0 ? Math.round(((lucroLiquido / (despesasTotal + combustivelTotal)) * 100) * 100) / 100 : 0,
          },
          metricas_operacionais: {
            km_total: Math.round(kmTotal * 100) / 100,
            numero_jornadas: Number(vehicle.numero_jornadas),
            tempo_total_horas: Math.round((tempoTotal / 60) * 100) / 100,
            km_medio_jornada: vehicle.numero_jornadas > 0 ? Math.round((kmTotal / Number(vehicle.numero_jornadas)) * 100) / 100 : 0,
            tempo_medio_jornada: vehicle.numero_jornadas > 0 ? Math.round((tempoTotal / Number(vehicle.numero_jornadas)) * 100) / 100 : 0,
            jornadas_por_dia: Math.round((Number(vehicle.numero_jornadas) / Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))) * 100) / 100,
          },
          metricas_eficiencia: {
            faturamento_por_km: kmTotal > 0 ? Math.round(faturamentoTotal / kmTotal) : 0,
            faturamento_por_hora: tempoTotal > 0 ? Math.round((faturamentoTotal / tempoTotal) * 60) : 0,
            lucro_por_km: kmTotal > 0 ? Math.round(lucroLiquido / kmTotal) : 0,
            lucro_por_hora: tempoTotal > 0 ? Math.round((lucroLiquido / tempoTotal) * 60) : 0,
            km_por_hora: tempoTotal > 0 ? Math.round((kmTotal / tempoTotal) * 60 * 100) / 100 : 0,
          },
          metricas_combustivel: {
            litros_total: Math.round(litrosTotal * 100) / 100,
            consumo_medio: litrosTotal > 0 && kmTotal > 0 ? Math.round((kmTotal / litrosTotal) * 100) / 100 : 0,
            custo_por_km: kmTotal > 0 ? Math.round(combustivelTotal / kmTotal) : 0,
            custo_por_litro: litrosTotal > 0 ? Math.round(combustivelTotal / litrosTotal) : 0,
            numero_abastecimentos: Number(fuel.numero_abastecimentos),
          }
        };
      });

      // Ordenar por lucro líquido
      comparacaoCompleta.sort((a, b) => b.metricas_financeiras.lucro_liquido - a.metricas_financeiras.lucro_liquido);

      // Calcular rankings
      const rankings = {
        mais_lucrativo: comparacaoCompleta[0]?.veiculo || null,
        maior_faturamento: [...comparacaoCompleta].sort((a, b) => b.metricas_financeiras.faturamento_total - a.metricas_financeiras.faturamento_total)[0]?.veiculo || null,
        mais_eficiente_combustivel: [...comparacaoCompleta].sort((a, b) => b.metricas_combustivel.consumo_medio - a.metricas_combustivel.consumo_medio)[0]?.veiculo || null,
        melhor_produtividade: [...comparacaoCompleta].sort((a, b) => b.metricas_eficiencia.faturamento_por_hora - a.metricas_eficiencia.faturamento_por_hora)[0]?.veiculo || null,
        maior_roi: [...comparacaoCompleta].sort((a, b) => b.metricas_financeiras.roi - a.metricas_financeiras.roi)[0]?.veiculo || null,
      };

      // Estatísticas consolidadas
      const estatisticas_consolidadas = {
        faturamento_total_frota: comparacaoCompleta.reduce((sum, v) => sum + v.metricas_financeiras.faturamento_total, 0),
        lucro_total_frota: comparacaoCompleta.reduce((sum, v) => sum + v.metricas_financeiras.lucro_liquido, 0),
        km_total_frota: comparacaoCompleta.reduce((sum, v) => sum + v.metricas_operacionais.km_total, 0),
        jornadas_total_frota: comparacaoCompleta.reduce((sum, v) => sum + v.metricas_operacionais.numero_jornadas, 0),
        combustivel_total_frota: comparacaoCompleta.reduce((sum, v) => sum + v.metricas_combustivel.litros_total, 0),
        veiculo_mais_ativo: [...comparacaoCompleta].sort((a, b) => b.metricas_operacionais.numero_jornadas - a.metricas_operacionais.numero_jornadas)[0]?.veiculo || null,
        melhor_margem_lucro: Math.max(...comparacaoCompleta.map(v => v.metricas_financeiras.margem_liquida)),
        pior_margem_lucro: Math.min(...comparacaoCompleta.map(v => v.metricas_financeiras.margem_liquida)),
      };

      return res.json({
        success: true,
        data: {
          comparacao_veiculos: comparacaoCompleta,
          rankings,
          estatisticas_consolidadas,
          periodo: {
            data_inicio: startDate.to
