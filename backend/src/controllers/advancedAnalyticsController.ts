import { Request, Response } from 'express';
import { db } from '../db';
import { veiculos, jornadas, abastecimentos, despesas } from '../db/schema';
import { eq, and, sql, desc, asc, isNull, gte, lte, sum, avg, count } from 'drizzle-orm';
import { z } from 'zod';

// Schema de validação para parâmetros de consulta
const analyticsQuerySchema = z.object({
  data_inicio: z.string().datetime().optional(),
  data_fim: z.string().datetime().optional(),
  id_veiculo: z.string().uuid().optional(),
  periodo: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  incluir_comparacao: z.boolean().default(false),
});

export class AdvancedAnalyticsController {
  /**
   * Função auxiliar para calcular o período de datas
   */
  static calculatePeriod(periodo: string, data_inicio?: string, data_fim?: string) {
    let startDate: Date;
    let endDate: Date = new Date();

    if (data_inicio && data_fim) {
      startDate = new Date(data_inicio);
      endDate = new Date(data_fim);
    } else {
      switch (periodo) {
        case '7d':
          startDate = new Date();
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate = new Date();
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate = new Date();
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate = new Date();
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate = new Date();
          startDate.setDate(endDate.getDate() - 30);
          break;
      }
    }
    return { startDate, endDate };
  }

  /**
   * Função auxiliar para obter a descrição do período
   */
  static getPeriodDescription(startDate: Date, endDate: Date): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return `${startDate.toLocaleDateString('pt-BR', options)} - ${endDate.toLocaleDateString('pt-BR', options)}`;
  }

  /**
   * Função auxiliar para calcular o resumo geral
   */
  static calculateGeneralSummary(analysisData: any[]): any {
    let totalLitros = 0;
    let totalKm = 0;
    let totalGastoCombustivel = 0;
    let numeroAbastecimentos = 0;
    let numeroJornadas = 0;

    analysisData.forEach(analysis => {
      totalLitros += analysis.metricas_periodo.total_litros;
      totalKm += analysis.metricas_periodo.total_km;
      totalGastoCombustivel += analysis.metricas_periodo.total_gasto_combustivel;
      numeroAbastecimentos += analysis.metricas_periodo.numero_abastecimentos;
      numeroJornadas += analysis.metricas_periodo.numero_jornadas;
    });

    const consumoMedio = totalKm > 0 && totalLitros > 0 ? totalKm / totalLitros : 0;
    const custoMedioPorKm = totalKm > 0 ? totalGastoCombustivel / totalKm : 0;
    const custoMedioPorLitro = totalLitros > 0 ? totalGastoCombustivel / totalLitros : 0;

    return {
      total_litros: totalLitros,
      total_km: totalKm,
      total_gasto_combustivel: totalGastoCombustivel,
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
  static getDayOfWeekName(dayIndex: number): string {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return days[dayIndex];
  }

  /**
   * Análise de consumo por veículo
   */
  static async getConsumptionAnalysis(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const validation = analyticsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'Parâmetros inválidos', details: validation.error.errors } 
        });
      }

      const { data_inicio, data_fim, id_veiculo, periodo } = validation.data;
      
      // Calcular período se não fornecido
      const { startDate, endDate } = AdvancedAnalyticsController.calculatePeriod(periodo, data_inicio, data_fim);

      // Buscar veículos do usuário
      let vehicleFilter = and(
        eq(veiculos.id_usuario, req.user?.id),
        isNull(veiculos.deleted_at)
      );

      if (id_veiculo) {
        vehicleFilter = and(vehicleFilter, eq(veiculos.id, id_veiculo));
      }

      const userVehicles = await db.select().from(veiculos).where(vehicleFilter);

      if (userVehicles.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: { message: 'Nenhum veículo encontrado' } 
        });
      }

      const consumptionAnalysis = [];

      for (const vehicle of userVehicles) {
        // Buscar abastecimentos do período
        const fuelings = await db
          .select({
            data_abastecimento: abastecimentos.data_abastecimento,
            quantidade_litros: abastecimentos.litros,
            valor_total: abastecimentos.valor_total,
            km_atual: abastecimentos.km_atual,
          })
          .from(abastecimentos)
          .where(
            and(
              eq(abastecimentos.id_veiculo, vehicle.id),
              eq(abastecimentos.id_usuario, req.user?.id),
              gte(abastecimentos.data_abastecimento, startDate.toISOString()),
              lte(abastecimentos.data_abastecimento, endDate.toISOString()),
              isNull(abastecimentos.deleted_at)
            )
          )
          .orderBy(asc(abastecimentos.data_abastecimento));

        // Buscar jornadas do período
        const journeys = await db
          .select({
            km_total: jornadas.km_total,
            data_inicio: jornadas.data_inicio,
            data_fim: jornadas.data_fim,
          })
          .from(jornadas)
          .where(
            and(
              eq(jornadas.id_veiculo, vehicle.id),
              eq(jornadas.id_usuario, req.user?.id),
              gte(jornadas.data_inicio, startDate.toISOString()),
              lte(jornadas.data_inicio, endDate.toISOString()),
              isNull(jornadas.deleted_at)
            )
          );

        // Calcular métricas de consumo
        const totalLitros = fuelings.reduce((sum, f) => sum + (f.quantidade_litros || 0), 0);
        const totalGastoCombustivel = fuelings.reduce((sum, f) => sum + (f.valor_total || 0), 0);
        const totalKm = journeys.reduce((sum, j) => sum + (j.km_total || 0), 0);
        
        const consumoMedio = totalKm > 0 && totalLitros > 0 ? totalKm / totalLitros : 0;
        const custoMedioPorKm = totalKm > 0 ? totalGastoCombustivel / totalKm : 0;
        const custoMedioPorLitro = totalLitros > 0 ? totalGastoCombustivel / totalLitros : 0;

        // Análise de eficiência temporal
        const fuelingsWithEfficiency = fuelings.map((fueling, index) => {
          if (index === 0) return { ...fueling, consumo_periodo: null, eficiencia: null };
          
          const prevFueling = fuelings[index - 1];
          const kmPercorridos = (fueling.km_atual || 0) - (prevFueling.km_atual || 0);
          const litrosConsumidos = fueling.quantidade_litros || 0;
          const consumoPeriodo = litrosConsumidos > 0 ? kmPercorridos / litrosConsumidos : 0;
          
          return {
            ...fueling,
            consumo_periodo: consumoPeriodo,
            km_percorridos: kmPercorridos,
            eficiencia: consumoPeriodo > 0 ? (consumoPeriodo >= consumoMedio ? 'Eficiente' : 'Ineficiente') : null
          };
        });

        consumptionAnalysis.push({
          veiculo: {
            id: vehicle.id,
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            ano: vehicle.ano,
            placa: vehicle.placa,
            tipo_combustivel: vehicle.tipo_combustivel,
          },
          metricas_periodo: {
            total_litros: totalLitros,
            total_km: totalKm,
            total_gasto_combustivel: totalGastoCombustivel,
            consumo_medio: Math.round(consumoMedio * 100) / 100, // km/l
            custo_medio_por_km: Math.round(custoMedioPorKm), // centavos
            custo_medio_por_litro: Math.round(custoMedioPorLitro), // centavos
            numero_abastecimentos: fuelings.length,
            numero_jornadas: journeys.length,
          },
          historico_eficiencia: fuelingsWithEfficiency.slice(1), // Remove primeiro item (sem dados de comparação)
          periodo: {
            data_inicio: startDate.toISOString(),
            data_fim: endDate.toISOString(),
            descricao: AdvancedAnalyticsController.getPeriodDescription(startDate, endDate)
          }
        });
      }

      return res.json({
        success: true,
        data: {
          analise_consumo: consumptionAnalysis,
          resumo_geral: AdvancedAnalyticsController.calculateGeneralSummary(consumptionAnalysis),
          periodo: {
            data_inicio: startDate.toISOString(),
            data_fim: endDate.toISOString(),
            descricao: AdvancedAnalyticsController.getPeriodDescription(startDate, endDate)
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao gerar análise de consumo:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Análise de produtividade por veículo
   */
  static async getProductivityAnalysis(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const validation = analyticsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'Parâmetros inválidos', details: validation.error.errors } 
        });
      }

      const { data_inicio, data_fim, id_veiculo, periodo } = validation.data;
      
      const { startDate, endDate } = AdvancedAnalyticsController.calculatePeriod(periodo, data_inicio, data_fim);

      // Query para análise de produtividade por veículo
      const productivityQuery = db
        .select({
          veiculo_id: veiculos.id,
          veiculo_marca: veiculos.marca,
          veiculo_modelo: veiculos.modelo,
          veiculo_placa: veiculos.placa,
          total_faturamento: sum(jornadas.ganho_bruto),
          total_km: sum(jornadas.km_total),
          total_tempo: sum(jornadas.tempo_total),
          numero_jornadas: count(jornadas.id),
          ganho_medio_jornada: avg(jornadas.ganho_bruto),
          km_medio_jornada: avg(jornadas.km_total),
          tempo_medio_jornada: avg(jornadas.tempo_total),
        })
        .from(veiculos)
        .leftJoin(jornadas, eq(veiculos.id, jornadas.id_veiculo))
        .where(
          and(
            eq(veiculos.id_usuario, req.user?.id),
            isNull(veiculos.deleted_at),
            id_veiculo ? eq(veiculos.id, id_veiculo) : sql`true`,
            gte(jornadas.data_inicio, startDate.toISOString()),
            lte(jornadas.data_inicio, endDate.toISOString()),
            isNull(jornadas.deleted_at)
          )
        )
        .groupBy(veiculos.id, veiculos.marca, veiculos.modelo, veiculos.placa);

      const productivityData = await productivityQuery;

      // Calcular métricas derivadas
      const productivityAnalysis = productivityData.map(vehicle => {
        const totalFaturamento = Number(vehicle.total_faturamento) || 0;
        const totalKm = Number(vehicle.total_km) || 0;
        const totalTempo = Number(vehicle.total_tempo) || 0; // em minutos
        const numeroJornadas = Number(vehicle.numero_jornadas) || 0;

        const ganhoMedioJornada = Number(vehicle.ganho_medio_jornada) || 0;
        const kmMedioJornada = Number(vehicle.km_medio_jornada) || 0;
        const tempoMedioJornada = Number(vehicle.tempo_medio_jornada) || 0;

        // Calcular produtividade
        const ganhoPorKm = totalKm > 0 ? totalFaturamento / totalKm : 0;
        const ganhoPorHora = totalTempo > 0 ? (totalFaturamento / totalTempo) * 60 : 0; // centavos por hora
        const kmPorHora = totalTempo > 0 ? (totalKm / totalTempo) * 60 : 0; // km por hora

        // Classificação de eficiência
        let classificacaoEficiencia = 'Baixa';
        if (ganhoPorKm >= 100) classificacaoEficiencia = 'Alta'; // >= R$ 1,00 por km
        else if (ganhoPorKm >= 50) classificacaoEficiencia = 'Média'; // >= R$ 0,50 por km

        return {
          veiculo: {
            id: vehicle.veiculo_id,
            marca: vehicle.veiculo_marca,
            modelo: vehicle.veiculo_modelo,
            placa: vehicle.veiculo_placa,
          },
          metricas_totais: {
            faturamento_total: totalFaturamento,
            km_total: totalKm,
            tempo_total_minutos: totalTempo,
            tempo_total_horas: Math.round((totalTempo / 60) * 100) / 100,
            numero_jornadas: numeroJornadas,
          },
          metricas_medias: {
            ganho_medio_jornada: Math.round(ganhoMedioJornada),
            km_medio_jornada: Math.round(kmMedioJornada * 100) / 100,
            tempo_medio_jornada_minutos: Math.round(tempoMedioJornada),
            tempo_medio_jornada_horas: Math.round((tempoMedioJornada / 60) * 100) / 100,
          },
          produtividade: {
            ganho_por_km: Math.round(ganhoPorKm), // centavos por km
            ganho_por_hora: Math.round(ganhoPorHora), // centavos por hora
            km_por_hora: Math.round(kmPorHora * 100) / 100, // km por hora
            classificacao_eficiencia: classificacaoEficiencia,
          }
        };
      });

      // Ranking de produtividade
      const rankingGanhoPorKm = [...productivityAnalysis]
        .sort((a, b) => b.produtividade.ganho_por_km - a.produtividade.ganho_por_km)
        .map((item, index) => ({
          posicao: index + 1,
          veiculo: item.veiculo,
          ganho_por_km: item.produtividade.ganho_por_km
        }));

      const rankingGanhoPorHora = [...productivityAnalysis]
        .sort((a, b) => b.produtividade.ganho_por_hora - a.produtividade.ganho_por_hora)
        .map((item, index) => ({
          posicao: index + 1,
          veiculo: item.veiculo,
          ganho_por_hora: item.produtividade.ganho_por_hora
        }));

      return res.json({
        success: true,
        data: {
          analise_produtividade: productivityAnalysis,
          rankings: {
            ganho_por_km: rankingGanhoPorKm,
            ganho_por_hora: rankingGanhoPorHora,
          },
          periodo: {
            data_inicio: startDate.toISOString(),
            data_fim: endDate.toISOString(),
            descricao: AdvancedAnalyticsController.getPeriodDescription(startDate, endDate)
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao gerar análise de produtividade:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Identificação de padrões temporais
   */
  static async getTemporalPatterns(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const validation = analyticsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'Parâmetros inválidos', details: validation.error.errors } 
        });
      }

      const { data_inicio, data_fim, id_veiculo, periodo } = validation.data;
      
      const { startDate, endDate } = AdvancedAnalyticsController.calculatePeriod(periodo, data_inicio, data_fim);

      // Query para análise temporal
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
            eq(veiculos.id_usuario, req.user?.id),
            isNull(veiculos.deleted_at),
            id_veiculo ? eq(veiculos.id, id_veiculo) : sql`true`,
            gte(jornadas.data_inicio, startDate.toISOString()),
            lte(jornadas.data_inicio, endDate.toISOString()),
            isNull(jornadas.deleted_at)
          )
        )
        .orderBy(asc(jornadas.data_inicio));

      // Agrupar por dia da semana
      const dailyPatterns = temporalQuery.reduce((acc: any, curr) => {
        const dayOfWeek = new Date(curr.data_inicio).getDay(); // 0 = Sunday, 6 = Saturday
        if (!acc[dayOfWeek]) {
          acc[dayOfWeek] = {
            faturamento_total: 0,
            km_total: 0,
            numero_jornadas: 0,
            tempo_total: 0,
          };
        }
        acc[dayOfWeek].faturamento_total += Number(curr.ganho_bruto) || 0;
        acc[dayOfWeek].km_total += Number(curr.km_total) || 0;
        acc[dayOfWeek].numero_jornadas++;
        acc[dayOfWeek].tempo_total += Number(curr.tempo_total) || 0;
        return acc;
      }, {});

      // Converter para array e adicionar nomes dos dias
      const dailyPatternsArray = Object.keys(dailyPatterns).map(dayIndex => ({
        dia_semana: AdvancedAnalyticsController.getDayOfWeekName(Number(dayIndex)),
        ...dailyPatterns[dayIndex],
      })).sort((a, b) => a.dia_semana.localeCompare(b.dia_semana)); // Ordenar por nome do dia

      // Agrupar por hora do dia
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

      const hourlyPatternsArray = Object.keys(hourlyPatterns).map(hour => ({
        hora: Number(hour),
        ...hourlyPatterns[hour],
      })).sort((a, b) => a.hora - b.hora);

      return res.json({
        success: true,
        data: {
          padroes_diarios: dailyPatternsArray,
          padroes_por_hora: hourlyPatternsArray,
          periodo: {
            data_inicio: startDate.toISOString(),
            data_fim: endDate.toISOString(),
            descricao: AdvancedAnalyticsController.getPeriodDescription(startDate, endDate)
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao gerar análise de tendências de mercado:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Comparação entre veículos
   */
  static async getVehicleComparison(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const validation = analyticsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'Parâmetros inválidos', details: validation.error.errors } 
        });
      }

      const { data_inicio, data_fim, periodo } = validation.data;
      
      const { startDate, endDate } = AdvancedAnalyticsController.calculatePeriod(periodo, data_inicio, data_fim);

      // Lógica para comparar veículos (exemplo simplificado)
      const vehicleComparisonData = await db
        .select({
          veiculo_id: veiculos.id,
          marca: veiculos.marca,
          modelo: veiculos.modelo,
          total_faturamento: sum(jornadas.ganho_bruto),
          total_km: sum(jornadas.km_total),
          total_despesas: sum(despesas.valor_despesa),
        })
        .from(veiculos)
        .leftJoin(jornadas, eq(veiculos.id, jornadas.id_veiculo))
        .leftJoin(despesas, eq(veiculos.id, despesas.id_veiculo))
        .where(
          and(
            eq(veiculos.id_usuario, req.user?.id),
            isNull(veiculos.deleted_at),
            gte(jornadas.data_inicio, startDate.toISOString()),
            lte(jornadas.data_inicio, endDate.toISOString()),
            isNull(jornadas.deleted_at),
            gte(gte(despesas.data_despesa, startDate.toISOString()), startDate.toISOString()),
            lte(lte(despesas.data_despesa, endDate.toISOString()), endDate.toISOString()),
            isNull(despesas.deleted_at)
          )
        )
        .groupBy(veiculos.id, veiculos.marca, veiculos.modelo)
        .orderBy(desc(sum(jornadas.ganho_bruto)));

      return res.json({
        success: true,
        data: {
          comparacao_veiculos: vehicleComparisonData.map(data => ({
            veiculo: { id: data.veiculo_id, marca: data.marca, modelo: data.modelo },
            faturamento_total: Number(data.total_faturamento) || 0,
            km_total: Number(data.total_km) || 0,
            despesas_total: Number(data.total_despesas) || 0,
            lucro_liquido: (Number(data.total_faturamento) || 0) - (Number(data.total_despesas) || 0),
          })),
          periodo: {
            data_inicio: startDate.toISOString(),
            data_fim: endDate.toISOString(),
            descricao: AdvancedAnalyticsController.getPeriodDescription(startDate, endDate)
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao gerar comparação de veículos:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }
}


