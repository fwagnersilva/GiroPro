import { Request, Response } from 'express';
import { db } from '../db';
import { veiculos, jornadas, abastecimentos, despesas } from '../db/schema';
import { eq, and, sql, desc, asc, isNull, gte, lte, sum, avg, count } from 'drizzle-orm';
import { z } from 'zod';

// Schema de validação para seleção de veículo
const vehicleSelectionSchema = z.object({
  idVeiculo: z.string().uuid('ID do veículo deve ser um UUID válido'),
});

// Schema de validação para múltiplos veículos
const multiVehicleQuerySchema = z.object({
  ids_veiculos: z.array(z.string().uuid()).optional(),
  incluir_inativos: z.boolean().default(false),
  ordenar_por: z.enum(['marca', 'modelo', 'ano', 'data_cadastro']).default('data_cadastro'),
  ordem: z.enum(['asc', 'desc']).default('desc'),
});

interface DailyUsageData {
  data: string;
  jornadas: number;
  faturamento: number;
  km: number;
  tempo: number;
  abastecimentos: number;
  quantidadeLitros: number;
  gasto_combustivel: number;
}

export class MultiVehicleController {
  /**
   * Listar todos os veículos do usuário com estatísticas básicas
   */
  static async getVehiclesWithStats(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const validation = multiVehicleQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'Parâmetros inválidos', details: validation.error.errors } 
        });
      }

      const { ids_veiculos, incluir_inativos, ordenar_por, ordem } = validation.data;

      // Construir filtros
      let vehicleFilter = and(
        eq(veiculos.idUsuario, req.user?.id),
        incluir_inativos ? sql`true` : isNull(veiculos.deletedAt)
      );

      if (ids_veiculos && ids_veiculos.length > 0) {
        vehicleFilter = and(vehicleFilter, sql`${veiculos.id} = ANY(${ids_veiculos})`);
      }

      // Buscar veículos
      const orderColumn = veiculos[ordenar_por as keyof typeof veiculos];
      const orderDirection = ordem === 'asc' ? asc(orderColumn as any) : desc(orderColumn as any);

      const userVehicles = await db
        .select()
        .from(veiculos)
        .where(vehicleFilter)
        .orderBy(orderDirection);

      if (userVehicles.length === 0) {
        return res.json({
          success: true,
          data: {
            veiculos: [],
            total_veiculos: 0,
            resumo_geral: null
          }
        });
      }

      // Calcular estatísticas para cada veículo
      const vehiclesWithStats = [];
      let totalFaturamentoGeral = 0;
      let totalKmGeral = 0;
      let totalGastoCombustivelGeral = 0;

      for (const vehicle of userVehicles) {
        // Estatísticas dos últimos 30 dias
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Métricas de jornadas
        const journeyStats = await db
          .select({
            total_faturamento: sum(jornadas.ganhoBruto),
            total_km: sum(jornadas.kmTotal),
            numero_jornadas: count(jornadas.id),
            ultima_jornada: sql<Date>`MAX(${jornadas.dataInicio})`,
          })
          .from(jornadas)
          .where(
            and(
              eq(jornadas.idVeiculo, vehicle.id),
              eq(jornadas.idUsuario, req.user?.id),
              gte(jornadas.dataInicio, thirtyDaysAgo.toISOString()),
              isNull(jornadas.deletedAt)
            )
          );

        // Métricas de abastecimentos
        const fuelingStats = await db
          .select({
            total_litros: sum(abastecimentos.quantidadeLitros),
            total_gasto: sum(abastecimentos.valorTotal),
            numero_abastecimentos: count(abastecimentos.id),
            ultimo_abastecimento: sql<Date>`MAX(${abastecimentos.dataAbastecimento})`,
          })
          .from(abastecimentos)
          .where(
            and(
              eq(abastecimentos.idVeiculo, vehicle.id),
              eq(abastecimentos.idUsuario, req.user?.id),
              gte(abastecimentos.dataAbastecimento, thirtyDaysAgo.toISOString()),
              isNull(abastecimentos.deletedAt)
            )
          );

        // Métricas de despesas
        const expenseStats = await db
          .select({
            total_despesas: sum(despesas.valorDespesa),
            numero_despesas: count(despesas.id),
          })
          .from(despesas)
          .where(
            and(
              eq(despesas.idVeiculo, vehicle.id),
              eq(despesas.idUsuario, req.user?.id),
              gte(despesas.dataDespesa, thirtyDaysAgo.toISOString()),
              isNull(despesas.deletedAt)
            )
          );

        const journey = journeyStats[0];
        const fueling = fuelingStats[0];
        const expense = expenseStats[0];

        const faturamento = Number(journey.total_faturamento) || 0;
        const km = Number(journey.total_km) || 0;
        const gastoCombustivel = Number(fueling.total_gasto) || 0;
        const despesasTotal = Number(expense.total_despesas) || 0;
        const quantidadeLitros = Number(fueling.total_litros) || 0;

        // Calcular métricas derivadas
        const consumoMedio = km > 0 && quantidadeLitros > 0 ? km / quantidadeLitros : 0;
        const lucroLiquido = faturamento - gastoCombustivel - despesasTotal;
        const margemLucro = faturamento > 0 ? (lucroLiquido / faturamento) * 100 : 0;
        const ganhoPorKm = km > 0 ? faturamento / km : 0;

        // Status do veículo
        const ultimaJornada = journey.ultima_jornada ? new Date(journey.ultima_jornada) : null;
        const ultimoAbastecimento = fueling.ultimo_abastecimento ? new Date(fueling.ultimo_abastecimento) : null;
        
        let statusVeiculo = 'Inativo';
        if (ultimaJornada) {
          const diasSemJornada = Math.floor((Date.now() - ultimaJornada.getTime()) / (1000 * 60 * 60 * 24));
          if (diasSemJornada <= 1) statusVeiculo = 'Ativo';
          else if (diasSemJornada <= 7) statusVeiculo = 'Pouco Ativo';
          else statusVeiculo = 'Inativo';
        }

        // Acumular totais gerais
        totalFaturamentoGeral += faturamento;
        totalKmGeral += km;
        totalGastoCombustivelGeral += gastoCombustivel;

        vehiclesWithStats.push({
          veiculo: {
            id: vehicle.id,
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            ano: vehicle.ano,
            placa: vehicle.placa,
            tipoCombustivel: vehicle.tipoCombustivel,
            tipo_uso: vehicle.tipo_uso,
            data_cadastro: vehicle.data_cadastro,
            status: statusVeiculo,
          },
          estatisticas_30_dias: {
            faturamento_total: faturamento,
            kmTotal: km,
            gasto_combustivel: gastoCombustivel,
            outras_despesas: despesasTotal,
            lucro_liquido: lucroLiquido,
            margem_lucro: Math.round(margemLucro * 100) / 100,
            numero_jornadas: Number(journey.numero_jornadas) || 0,
            numero_abastecimentos: Number(fueling.numero_abastecimentos) || 0,
            numero_despesas: Number(expense.numero_despesas) || 0,
            consumo_medio: Math.round(consumoMedio * 100) / 100,
            ganho_por_km: Math.round(ganhoPorKm),
            ultima_jornada: ultimaJornada?.toISOString() || null,
            ultimo_abastecimento: ultimoAbastecimento?.toISOString() || null,
          }
        });
      }

      // Resumo geral
      const resumoGeral = {
        total_veiculos: userVehicles.length,
        veiculos_ativos: vehiclesWithStats.filter(v => v.veiculo.status === 'Ativo').length,
        veiculos_pouco_ativos: vehiclesWithStats.filter(v => v.veiculo.status === 'Pouco Ativo').length,
        veiculos_inativos: vehiclesWithStats.filter(v => v.veiculo.status === 'Inativo').length,
        faturamento_total_geral: totalFaturamentoGeral,
        kmTotal_geral: totalKmGeral,
        gasto_combustivel_geral: totalGastoCombustivelGeral,
        veiculo_mais_produtivo: vehiclesWithStats.reduce((best, current) => 
          current.estatisticas_30_dias.faturamento_total > best.estatisticas_30_dias.faturamento_total ? current : best
        ).veiculo,
        veiculo_mais_eficiente: vehiclesWithStats.reduce((best, current) => 
          current.estatisticas_30_dias.consumo_medio > best.estatisticas_30_dias.consumo_medio ? current : best
        ).veiculo,
      };

      return res.json({
        success: true,
        data: {
          veiculos: vehiclesWithStats,
          total_veiculos: userVehicles.length,
          resumo_geral: resumoGeral,
          periodo_analise: '30 dias'
        }
      });

    } catch (error: any) {
      console.error('Erro ao buscar veículos com estatísticas:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Definir veículo ativo/padrão para jornadas
   */
  static async setActiveVehicle(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const validation = vehicleSelectionSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'Dados inválidos', details: validation.error.errors } 
        });
      }

      const { idVeiculo } = validation.data;

      // Verificar se o veículo pertence ao usuário
      const vehicle = await db
        .select()
        .from(veiculos)
        .where(
          and(
            eq(veiculos.id, idVeiculo),
            eq(veiculos.idUsuario, req.user?.id),
            isNull(veiculos.deletedAt)
          )
        );

      if (vehicle.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: { message: 'Veículo não encontrado ou não pertence ao usuário' } 
        });
      }

      // Aqui você pode implementar a lógica para salvar a preferência do usuário
      // Por exemplo, em uma tabela de configurações do usuário ou em cache
      // Por enquanto, retornamos sucesso com os dados do veículo

      return res.json({
        success: true,
        data: {
          veiculo_ativo: {
            id: vehicle[0].id,
            marca: vehicle[0].marca,
            modelo: vehicle[0].modelo,
            placa: vehicle[0].placa,
          },
          message: 'Veículo definido como ativo com sucesso'
        }
      });

    } catch (error: any) {
      console.error('Erro ao definir veículo ativo:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Obter resumo rápido de todos os veículos
   */
  static async getQuickSummary(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      // Buscar contagem de veículos
      const vehicleCount = await db
        .select({ count: count() })
        .from(veiculos)
        .where(
          and(
            eq(veiculos.idUsuario, req.user?.id),
            isNull(veiculos.deletedAt)
          )
        );

      const totalVeiculos = vehicleCount[0]?.count || 0;

      if (totalVeiculos === 0) {
        return res.json({
          success: true,
          data: {
            total_veiculos: 0,
            veiculos_com_jornadas_hoje: 0,
            faturamento_total_hoje: 0,
            kmTotal_hoje: 0,
            message: 'Nenhum veículo cadastrado'
          }
        });
      }

      // Data de hoje
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const amanha = new Date(hoje);
      amanha.setDate(amanha.getDate() + 1);

      // Estatísticas do dia atual
      const statsHoje = await db
        .select({
          veiculos_ativos: sql<number>`COUNT(DISTINCT ${jornadas.idVeiculo})`,
          faturamento_total: sum(jornadas.ganhoBruto),
          kmTotal: sum(jornadas.kmTotal),
          numero_jornadas: count(jornadas.id),
        })
        .from(jornadas)
        .innerJoin(veiculos, eq(jornadas.idVeiculo, veiculos.id))
        .where(
          and(
            eq(veiculos.idUsuario, req.user?.id),
            gte(jornadas.dataInicio, hoje.toISOString()),
            sql`${jornadas.dataInicio} < ${amanha}`,
            isNull(jornadas.deletedAt),
            isNull(veiculos.deletedAt)
          )
        );

      const stats = statsHoje[0];

      return res.json({
        success: true,
        data: {
          total_veiculos: totalVeiculos,
          veiculos_com_jornadas_hoje: Number(stats.veiculos_ativos) || 0,
          faturamento_total_hoje: Number(stats.faturamento_total) || 0,
          kmTotal_hoje: Number(stats.kmTotal) || 0,
          numero_jornadas_hoje: Number(stats.numero_jornadas) || 0,
          data_referencia: hoje.toISOString().split('T')[0]
        }
      });

    } catch (error: any) {
      console.error('Erro ao obter resumo rápido:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Obter histórico de uso por veículo
   */
  static async getVehicleUsageHistory(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const { idVeiculo } = req.params;

      if (!idVeiculo) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'ID do veículo é obrigatório' } 
        });
      }

      // Verificar se o veículo pertence ao usuário
      const vehicle = await db
        .select()
        .from(veiculos)
        .where(
          and(
            eq(veiculos.id, idVeiculo),
            eq(veiculos.idUsuario, req.user?.id),
            isNull(veiculos.deletedAt)
          )
        );

      if (vehicle.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: { message: 'Veículo não encontrado' } 
        });
      }

      // Buscar histórico dos últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Histórico de jornadas
      const journeyHistory = await db
        .select({
          data: jornadas.dataInicio,
          faturamento: jornadas.ganhoBruto,
          km: jornadas.kmTotal,
          tempo: jornadas.tempo_total,
        })
        .from(jornadas)
        .where(
          and(
            eq(jornadas.idVeiculo, idVeiculo),
            eq(jornadas.idUsuario, req.user?.id),
            gte(jornadas.dataInicio, thirtyDaysAgo.toISOString()),
            isNull(jornadas.deletedAt)
          )
        )
        .orderBy(desc(jornadas.dataInicio));

      // Histórico de abastecimentos
      const fuelingHistory = await db
        .select({
          data: abastecimentos.dataAbastecimento,
          quantidadeLitros: abastecimentos.quantidadeLitros,
          valorLitro: abastecimentos.valorLitro,
        })
        .from(abastecimentos)
        .where(
          and(
            eq(abastecimentos.idVeiculo, idVeiculo),
            eq(abastecimentos.idUsuario, req.user?.id),
            gte(abastecimentos.dataAbastecimento, thirtyDaysAgo.toISOString()),
            isNull(abastecimentos.deletedAt)
          )
        )
        .orderBy(desc(abastecimentos.dataAbastecimento));

      // Agrupar por dia
      const dailyUsage: { [key: string]: DailyUsageData } = {};

journeyHistory.forEach(journey => {
        const date = journey.data.split("T")[0];
        if (!dailyUsage[date]) {
          dailyUsage[date] = {
            data: date,
            jornadas: 0,
            faturamento: 0,
            km: 0,
            tempo: 0,
            abastecimentos: 0,
            quantidadeLitros: 0,
            gasto_combustivel: 0,
          };
        }
        dailyUsage[date].jornadas++;
        dailyUsage[date].faturamento += Number(journey.faturamento) || 0;
        dailyUsage[date].km += Number(journey.km) || 0;
        dailyUsage[date].tempo += Number(journey.tempo) || 0;
      });

fuelingHistory.forEach(fueling => {
        const date = fueling.data.split("T")[0];
        if (!dailyUsage[date]) {
          dailyUsage[date] = {
            data: date,
            jornadas: 0,
            faturamento: 0,
            km: 0,
            tempo: 0,
            abastecimentos: 0,
            quantidadeLitros: 0,
            gasto_combustivel: 0,
          };
        }
        dailyUsage[date].abastecimentos++;
        dailyUsage[date].quantidadeLitros += Number(fueling.quantidadeLitros) || 0;
        dailyUsage[date].gasto_combustivel += Number(fueling.valorLitro) || 0;
      });

      // Converter para array e ordenar por data
      const dailyUsageArray = Object.values(dailyUsage).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

      return res.json({
        success: true,
        data: {
          veiculo: {
            id: vehicle[0].id,
            marca: vehicle[0].marca,
            modelo: vehicle[0].modelo,
            placa: vehicle[0].placa,
          },
          historico_uso_diario: dailyUsageArray,
          periodo_analise: {
            dataInicio: thirtyDaysAgo.toISOString().split('T')[0],
            dataFim: new Date().toISOString().split('T')[0],
            total_dias: 30,
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao obter histórico de uso do veículo:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }
}


