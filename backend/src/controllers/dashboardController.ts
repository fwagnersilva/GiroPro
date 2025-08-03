import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { jornadas, abastecimentos, despesas, veiculos } from '../db/schema';
import { eq, and, isNull, isNotNull, sql, gte, lte, sum, count } from 'drizzle-orm';
import { AuthenticatedRequest } from '../types';

// Schema para validação dos parâmetros de consulta do dashboard
const dashboardQuerySchema = z.object({
  periodo: z.enum(['hoje', 'semana', 'mes', 'ano', 'personalizado']).default('mes'),
  data_inicio: z.string().datetime().optional(),
  data_fim: z.string().datetime().optional(),
  id_veiculo: z.string().uuid().optional()
});

export class DashboardController {
  /**
   * Obtém o resumo de lucratividade do usuário
   */
  static async getSummary(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }
      const userId = req.user.id;

      const queryValidation = dashboardQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Parâmetros de consulta inválidos",
            details: queryValidation.error.errors
          }
        });
      }

      const { periodo, data_inicio, data_fim, id_veiculo } = queryValidation.data;

      // Calcular datas do período se não fornecidas
      const { dataInicio, dataFim } = calcularPeriodo(periodo, data_inicio, data_fim);

      // Verificar se o veículo pertence ao usuário (se fornecido)
      if (id_veiculo) {
        const veiculo = await db
          .select()
          .from(veiculos)
          .where(
            and(
              eq(veiculos.id, id_veiculo),
              eq(veiculos.id_usuario, req.user?.id),
              isNull(veiculos.deleted_at)
            )
          )
          .limit(1);

        if (veiculo.length === 0) {
          return res.status(404).json({
            success: false,
            error: { message: "Veículo não encontrado" }
          });
        }
      }

      // 1. Calcular Faturamento Bruto (FB)
      const faturamentoBruto = await calcularFaturamentoBruto(req.user?.id, dataInicio, dataFim, id_veiculo);

      // 2. Calcular Total de Despesas (TD)
      const totalDespesas = await calcularTotalDespesas(req.user?.id, dataInicio, dataFim, id_veiculo);

      // 3. Calcular Lucro Líquido (LL = FB - TD)
      const lucroLiquido = faturamentoBruto - totalDespesas;

      // 4. Calcular KM Total Rodado (KMT)
      const kmTotal = await calcularKmTotal(req.user?.id, dataInicio, dataFim, id_veiculo);

      // 5. Calcular Custo por KM (CKM = TD / KMT)
      const custoPorKm = kmTotal > 0 ? Math.round((totalDespesas / kmTotal) * 100) / 100 : 0;

      // 6. Calcular Ganho Médio por Jornada (GMJ)
      const ganhoMedioPorJornada = await calcularGanhoMedioPorJornada(req.user?.id, dataInicio, dataFim, id_veiculo);

      // 7. Calcular métricas adicionais
      const numeroJornadas = await calcularNumeroJornadas(req.user?.id, dataInicio, dataFim, id_veiculo);
      const tempoTotalTrabalhado = await calcularTempoTotalTrabalhado(req.user?.id, dataInicio, dataFim, id_veiculo);
      const ganhoPorHora = tempoTotalTrabalhado > 0 ? Math.round((faturamentoBruto / (tempoTotalTrabalhado / 60)) * 100) / 100 : 0;

      // 8. Calcular distribuição de despesas por categoria
      const distribuicaoDespesas = await calcularDistribuicaoDespesas(req.user?.id, dataInicio, dataFim, id_veiculo);

      return res.json({
        success: true,
        data: {
          periodo: {
            tipo: periodo,
            data_inicio: dataInicio.toISOString(),
            data_fim: dataFim.toISOString()
          },
          metricas_principais: {
            faturamento_bruto: faturamentoBruto,
            total_despesas: totalDespesas,
            lucro_liquido: lucroLiquido,
            margem_lucro: faturamentoBruto > 0 ? Math.round((lucroLiquido / faturamentoBruto) * 10000) / 100 : 0
          },
          metricas_operacionais: {
            km_total: kmTotal,
            custo_por_km: custoPorKm,
            numero_jornadas: numeroJornadas,
            ganho_medio_por_jornada: ganhoMedioPorJornada,
            tempo_total_trabalhado_minutos: tempoTotalTrabalhado,
            ganho_por_hora: ganhoPorHora
          },
          distribuicao_despesas: distribuicaoDespesas,
          id_veiculo: id_veiculo || null
        }
      });

    } catch (error: any) {
      console.error("Erro ao obter resumo do dashboard:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }

  /**
   * Obtém dados para gráficos de evolução temporal
   */
  static async getEvolutionData(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }
      const userId = req.user?.id as string;

      const queryValidation = z.object({
        periodo: z.enum(['semana', 'mes', 'ano']).default('mes'),
        id_veiculo: z.string().uuid().optional()
      }).safeParse(req.query);

      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          error: { message: "Parâmetros de consulta inválidos" }
        });
      }

      const { periodo, id_veiculo } = queryValidation.data;

      // Calcular dados de evolução baseados no período
      const dadosEvolucao = await calcularDadosEvolucao(req.user?.id, periodo, id_veiculo);

      return res.json({
        success: true,
        data: {
          periodo,
          evolucao: dadosEvolucao,
          id_veiculo: id_veiculo || null
        }
      });

    } catch (error: any) {
      console.error("Erro ao obter dados de evolução:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }

  /**
   * Obtém comparativo entre veículos
   */
  static async getVehicleComparison(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }
      const userId = req.user?.id as string;

      const queryValidation = z.object({
        periodo: z.enum(['hoje', 'semana', 'mes', 'ano']).default('mes'),
        data_inicio: z.string().datetime().optional(),
        data_fim: z.string().datetime().optional()
      }).safeParse(req.query);

      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          error: { message: "Parâmetros de consulta inválidos" }
        });
      }

      const { periodo, data_inicio, data_fim } = queryValidation.data;
      const { dataInicio, dataFim } = calcularPeriodo(periodo, data_inicio, data_fim);

      // Obter todos os veículos do usuário
      const veiculosUsuario = await db
        .select()
        .from(veiculos)
        .where(
          and(
            eq(veiculos.id_usuario, req.user?.id),
            isNull(veiculos.deleted_at)
          )
        );

      // Calcular métricas para cada veículo
      const comparativo = await Promise.all(
        veiculosUsuario.map(async (veiculo) => {
          const faturamentoBruto = await calcularFaturamentoBruto(userId, dataInicio, dataFim, veiculo.id);
          const totalDespesas = await calcularTotalDespesas(userId, dataInicio, dataFim, veiculo.id);
          const lucroLiquido = faturamentoBruto - totalDespesas;
          const kmTotal = await calcularKmTotal(userId, dataInicio, dataFim, veiculo.id);
          const numeroJornadas = await calcularNumeroJornadas(userId, dataInicio, dataFim, veiculo.id);

          return {
            veiculo: {
              id: veiculo.id,
              marca: veiculo.marca,
              modelo: veiculo.modelo,
              placa: veiculo.placa,
              ano: veiculo.ano
            },
            metricas: {
              faturamento_bruto: faturamentoBruto,
              total_despesas: totalDespesas,
              lucro_liquido: lucroLiquido,
              km_total: kmTotal,
              numero_jornadas: numeroJornadas,
              custo_por_km: kmTotal > 0 ? Math.round((totalDespesas / kmTotal) * 100) / 100 : 0,
              ganho_medio_por_jornada: numeroJornadas > 0 ? Math.round((faturamentoBruto / numeroJornadas) * 100) / 100 : 0
            }
          };
        })
      );

      return res.json({
        success: true,
        data: {
          periodo: {
            tipo: periodo,
            data_inicio: dataInicio.toISOString(),
            data_fim: dataFim.toISOString()
          },
          comparativo
        }
      });

    } catch (error: any) {
      console.error("Erro ao obter comparativo de veículos:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }
}

// Funções auxiliares para cálculos

function calcularPeriodo(periodo: string, data_inicio?: string, data_fim?: string) {
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

async function calcularFaturamentoBruto(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string) {
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

  const result = await db
    .select({ total: sum(jornadas.ganho_bruto) })
    .from(jornadas)
    .where(whereConditions);

  return Number(result[0]?.total || 0);
}

async function calcularTotalDespesas(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string) {
  // Calcular gastos com combustível
  let whereAbastecimentos = and(
    eq(abastecimentos.id_usuario, userId),
    gte(abastecimentos.data_abastecimento, dataInicio.toISOString()),
    lte(abastecimentos.data_abastecimento, dataFim.toISOString()),
    isNull(abastecimentos.deleted_at)
  );

  if (idVeiculo) {
    whereAbastecimentos = and(whereAbastecimentos, eq(abastecimentos.id_veiculo, idVeiculo));
  }

  const gastoCombustivel = await db
    .select({ total: sum(abastecimentos.valor_total) })
    .from(abastecimentos)
    .where(whereAbastecimentos);

  // Calcular outras despesas
  let whereDespesas = and(
    eq(despesas.id_usuario, userId),
    gte(despesas.data_despesa, dataInicio.toISOString()),
    lte(despesas.data_despesa, dataFim.toISOString()),
    isNull(despesas.deleted_at)
  );

  if (idVeiculo) {
    whereDespesas = and(whereDespesas, eq(despesas.id_veiculo, idVeiculo));
  }

  const outrasDespesas = await db
    .select({ total: sum(despesas.valor_despesa) })
    .from(despesas)
    .where(whereDespesas);

  const totalCombustivel = Number(gastoCombustivel[0]?.total || 0);
  const totalOutrasDespesas = Number(outrasDespesas[0]?.total || 0);

  return totalCombustivel + totalOutrasDespesas;
}

async function calcularKmTotal(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string) {
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

  const result = await db
    .select({ total: sum(jornadas.km_total) })
    .from(jornadas)
    .where(whereConditions);

  return Number(result[0]?.total || 0);
}

async function calcularGanhoMedioPorJornada(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string) {
  const faturamentoBruto = await calcularFaturamentoBruto(userId, dataInicio, dataFim, idVeiculo);
  const numeroJornadas = await calcularNumeroJornadas(userId, dataInicio, dataFim, idVeiculo);

  return numeroJornadas > 0 ? Math.round((faturamentoBruto / numeroJornadas) * 100) / 100 : 0;
}

async function calcularNumeroJornadas(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string) {
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

  const result = await db
    .select({ total: count() })
    .from(jornadas)
    .where(whereConditions);

  return Number(result[0]?.total || 0);
}

async function calcularTempoTotalTrabalhado(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string) {
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

  const result = await db
    .select({
      data_inicio: jornadas.data_inicio,
      data_fim: jornadas.data_fim
    })
    .from(jornadas)
    .where(whereConditions);

  let tempoTotalMinutos = 0;
  result.forEach(jornada => {
    if (jornada.data_inicio && jornada.data_fim) {
      const diffMs = new Date(jornada.data_fim).getTime() - new Date(jornada.data_inicio).getTime();
      tempoTotalMinutos += Math.round(diffMs / (1000 * 60));
    }
  });

  return tempoTotalMinutos;
}

async function calcularDistribuicaoDespesas(userId: string, dataInicio: Date, dataFim: Date, idVeiculo?: string) {
  // Calcular gastos com combustível
  let whereAbastecimentos = and(
    eq(abastecimentos.id_usuario, userId),
    gte(abastecimentos.data_abastecimento, dataInicio.toISOString()),
    lte(abastecimentos.data_abastecimento, dataFim.toISOString()),
    isNull(abastecimentos.deleted_at)
  );

  if (idVeiculo) {
    whereAbastecimentos = and(whereAbastecimentos, eq(abastecimentos.id_veiculo, idVeiculo));
  }

  const gastoCombustivel = await db
    .select({ total: sum(abastecimentos.valor_total) })
    .from(abastecimentos)
    .where(whereAbastecimentos);

  // Calcular despesas por categoria
  let whereDespesas = and(
    eq(despesas.id_usuario, userId),
    gte(despesas.data_despesa, dataInicio.toISOString()),
    lte(despesas.data_despesa, dataFim.toISOString()),
    isNull(despesas.deleted_at)
  );

  if (idVeiculo) {
    whereDespesas = and(whereDespesas, eq(despesas.id_veiculo, idVeiculo));
  }

  const despesasPorCategoria = await db
    .select({
      tipo_despesa: despesas.tipo_despesa,
      total: sum(despesas.valor_despesa)
    })
    .from(despesas)
    .where(whereDespesas)
    .groupBy(despesas.tipo_despesa);

  const distribuicao = [
    {
      categoria: 'Combustível',
      valor: Number(gastoCombustivel[0]?.total || 0)
    }
  ];

  despesasPorCategoria.forEach(categoria => {
    distribuicao.push({
      categoria: categoria.tipo_despesa,
      valor: Number(categoria.total || 0)
    });
  });

  return distribuicao;
}

async function calcularDadosEvolucao(userId: string, periodo: string, idVeiculo?: string) {
  const agora = new Date();
  const dadosEvolucao = [];

  // Definir número de períodos e intervalo baseado no tipo
  let numeroPeriodos: number;
  let intervaloDias: number;

  switch (periodo) {
    case 'semana':
      numeroPeriodos = 7;
      intervaloDias = 1;
      break;
    case 'mes':
      numeroPeriodos = 30;
      intervaloDias = 1;
      break;
    case 'ano':
      numeroPeriodos = 12;
      intervaloDias = 30;
      break;
    default:
      numeroPeriodos = 30;
      intervaloDias = 1;
  }

  // Calcular dados para cada período
  for (let i = numeroPeriodos - 1; i >= 0; i--) {
    const dataFim = new Date(agora);
    dataFim.setDate(agora.getDate() - (i * intervaloDias));
    
    const dataInicio = new Date(dataFim);
    dataInicio.setDate(dataFim.getDate() - intervaloDias + 1);

    const faturamentoBruto = await calcularFaturamentoBruto(userId, dataInicio, dataFim, idVeiculo);
    const totalDespesas = await calcularTotalDespesas(userId, dataInicio, dataFim, idVeiculo);
    const lucroLiquido = faturamentoBruto - totalDespesas;

    dadosEvolucao.push({
      data: dataFim.toISOString().split('T')[0],
      faturamento_bruto: faturamentoBruto,
      total_despesas: totalDespesas,
      lucro_liquido: lucroLiquido
    });
  }

  return dadosEvolucao;
}

