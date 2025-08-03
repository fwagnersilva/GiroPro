import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { jornadas, abastecimentos, despesas, veiculos } from '../db/schema';
import { eq, and, isNull, gte, lte, sum, count, sql } from 'drizzle-orm';
import { AuthenticatedRequest } from '../types';

// Schema para validação dos parâmetros de consulta
const weeklyMonthlyReportSchema = z.object({
  tipo_periodo: z.enum(['semanal', 'mensal']).default('mensal'),
  data_inicio: z.string().datetime().optional(),
  data_fim: z.string().datetime().optional(),
  id_veiculo: z.string().uuid().optional(),
  formato: z.enum(['json', 'csv']).default('json')
});

export class WeeklyMonthlyReportsController {
  /**
   * Relatório Semanal de Faturamento, Despesas e Lucro
   */
  static async getWeeklyReport(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }

      const queryValidation = weeklyMonthlyReportSchema.safeParse(req.query);
      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Parâmetros de consulta inválidos",
            details: queryValidation.error.errors
          }
        });
      }

      const { data_inicio, data_fim, id_veiculo, formato } = queryValidation.data;
      const { dataInicio, dataFim } = calcularPeriodoSemanal(data_inicio, data_fim);

      const relatorio = await gerarRelatorioFinanceiro(
        req.user?.id,
        dataInicio,
        dataFim,
        'semanal',
        id_veiculo
      );

      if (formato === 'csv') {
        const csv = gerarCSVFinanceiro(relatorio, 'semanal');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="relatorio_semanal.csv"');
        return res.send(csv);
      }

      return res.json({
        success: true,
        data: relatorio
      });

    } catch (error: any) {
      console.error("Erro ao gerar relatório semanal:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }

  /**
   * Relatório Mensal de Faturamento, Despesas e Lucro
   */
  static async getMonthlyReport(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }

      const queryValidation = weeklyMonthlyReportSchema.safeParse(req.query);
      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Parâmetros de consulta inválidos",
            details: queryValidation.error.errors
          }
        });
      }

      const { data_inicio, data_fim, id_veiculo, formato } = queryValidation.data;
      const { dataInicio, dataFim } = calcularPeriodoMensal(data_inicio, data_fim);

      const relatorio = await gerarRelatorioFinanceiro(
        req.user?.id,
        dataInicio,
        dataFim,
        'mensal',
        id_veiculo
      );

      if (formato === 'csv') {
        const csv = gerarCSVFinanceiro(relatorio, 'mensal');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="relatorio_mensal.csv"');
        return res.send(csv);
      }

      return res.json({
        success: true,
        data: relatorio
      });

    } catch (error: any) {
      console.error("Erro ao gerar relatório mensal:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }

  /**
   * Comparativo de Múltiplas Semanas
   */
  static async getWeeklyComparison(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }

      const { id_veiculo, numero_semanas = 4 } = req.query;
      const semanas = [];
      const agora = new Date();

      // Gerar relatórios para as últimas N semanas
      for (let i = 0; i < Number(numero_semanas); i++) {
        const fimSemana = new Date(agora);
        fimSemana.setDate(agora.getDate() - (i * 7));
        
        const inicioSemana = new Date(fimSemana);
        inicioSemana.setDate(fimSemana.getDate() - 6);

        const relatorioSemana = await gerarRelatorioFinanceiro(
          req.user?.id,
          inicioSemana,
          fimSemana,
          'semanal',
          id_veiculo as string
        );

        semanas.push({
          numero_semana: i + 1,
          periodo: `${inicioSemana.toLocaleDateString('pt-BR')} - ${fimSemana.toLocaleDateString('pt-BR')}`,
          ...relatorioSemana.resumo_financeiro
        });
      }

      return res.json({
        success: true,
        data: {
          comparativo_semanas: semanas.reverse(),
          filtros: {
            id_veiculo: id_veiculo || null,
            numero_semanas: Number(numero_semanas)
          }
        }
      });

    } catch (error: any) {
      console.error("Erro ao gerar comparativo semanal:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }

  /**
   * Comparativo de Múltiplos Meses
   */
  static async getMonthlyComparison(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }

      const { id_veiculo, numero_meses = 6 } = req.query;
      const meses = [];
      const agora = new Date();

      // Gerar relatórios para os últimos N meses
      for (let i = 0; i < Number(numero_meses); i++) {
        const anoMes = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
        const inicioMes = new Date(anoMes.getFullYear(), anoMes.getMonth(), 1);
        const fimMes = new Date(anoMes.getFullYear(), anoMes.getMonth() + 1, 0);

        const relatorioMes = await gerarRelatorioFinanceiro(
          req.user?.id,
          inicioMes,
          fimMes,
          'mensal',
          id_veiculo as string
        );

        meses.push({
          mes_ano: `${anoMes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
          periodo: `${inicioMes.toLocaleDateString('pt-BR')} - ${fimMes.toLocaleDateString('pt-BR')}`,
          ...relatorioMes.resumo_financeiro
        });
      }

      return res.json({
        success: true,
        data: {
          comparativo_meses: meses.reverse(),
          filtros: {
            id_veiculo: id_veiculo || null,
            numero_meses: Number(numero_meses)
          }
        }
      });

    } catch (error: any) {
      console.error("Erro ao gerar comparativo mensal:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }
}

// Funções auxiliares

function calcularPeriodoSemanal(data_inicio?: string, data_fim?: string) {
  if (data_inicio && data_fim) {
    return {
      dataInicio: new Date(data_inicio),
      dataFim: new Date(data_fim)
    };
  }

  // Última semana completa (segunda a domingo)
  const agora = new Date();
  const diaSemana = agora.getDay(); // 0 = domingo, 1 = segunda, etc.
  
  const dataFim = new Date(agora);
  dataFim.setDate(agora.getDate() - diaSemana); // Último domingo
  
  const dataInicio = new Date(dataFim);
  dataInicio.setDate(dataFim.getDate() - 6); // Segunda da semana anterior

  return { dataInicio, dataFim };
}

function calcularPeriodoMensal(data_inicio?: string, data_fim?: string) {
  if (data_inicio && data_fim) {
    return {
      dataInicio: new Date(data_inicio),
      dataFim: new Date(data_fim)
    };
  }

  // Mês anterior completo
  const agora = new Date();
  const mesAnterior = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);
  
  const dataInicio = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth(), 1);
  const dataFim = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth() + 1, 0);

  return { dataInicio, dataFim };
}

async function gerarRelatorioFinanceiro(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  tipoPeriodo: 'semanal' | 'mensal',
  idVeiculo?: string
) {
  // 1. Calcular Faturamento Bruto (soma de ganho_bruto das jornadas finalizadas)
  const faturamentoBruto = await calcularFaturamentoBruto(userId, dataInicio, dataFim, idVeiculo);

  // 2. Calcular Total de Despesas (abastecimentos + outras despesas)
  const gastoCombustivel = await calcularGastoCombustivel(userId, dataInicio, dataFim, idVeiculo);
  const outrasDespesas = await calcularOutrasDespesas(userId, dataInicio, dataFim, idVeiculo);
  const totalDespesas = gastoCombustivel + outrasDespesas;

  // 3. Calcular Lucro Líquido
  const lucroLiquido = faturamentoBruto - totalDespesas;

  // 4. Calcular métricas adicionais
  const kmTotal = await calcularKmTotal(userId, dataInicio, dataFim, idVeiculo);
  const numeroJornadas = await contarJornadas(userId, dataInicio, dataFim, idVeiculo);
  const custoPorKm = kmTotal > 0 ? totalDespesas / kmTotal : 0;
  const ganhoMedioPorJornada = numeroJornadas > 0 ? faturamentoBruto / numeroJornadas : 0;
  const margemLucro = faturamentoBruto > 0 ? (lucroLiquido / faturamentoBruto) * 100 : 0;

  // 5. Detalhamento por categoria de despesa
  const detalhamentoDespesas = await detalharDespesasPorCategoria(userId, dataInicio, dataFim, idVeiculo);

  // 6. Evolução diária (para análise de tendências)
  const evolucaoDiaria = await calcularEvolucaoDiaria(userId, dataInicio, dataFim, idVeiculo);

  return {
    periodo: {
      tipo: tipoPeriodo,
      data_inicio: dataInicio.toISOString(),
      data_fim: dataFim.toISOString(),
      descricao: `${dataInicio.toLocaleDateString('pt-BR')} - ${dataFim.toLocaleDateString('pt-BR')}`
    },
    filtros: {
      id_veiculo: idVeiculo || null
    },
    resumo_financeiro: {
      faturamento_bruto: faturamentoBruto,
      total_despesas: totalDespesas,
      gasto_combustivel: gastoCombustivel,
      outras_despesas: outrasDespesas,
      lucro_liquido: lucroLiquido,
      margem_lucro: Math.round(margemLucro * 100) / 100, // 2 casas decimais
      km_total: kmTotal,
      numero_jornadas: numeroJornadas,
      custo_por_km: Math.round(custoPorKm * 100) / 100,
      ganho_medio_por_jornada: Math.round(ganhoMedioPorJornada)
    },
    detalhamento_despesas: detalhamentoDespesas,
    evolucao_diaria: evolucaoDiaria,
    indicadores: {
      eficiencia_financeira: margemLucro > 20 ? 'Excelente' : margemLucro > 10 ? 'Boa' : margemLucro > 0 ? 'Regular' : 'Ruim',
      produtividade: numeroJornadas > 0 ? `${Math.round(kmTotal / numeroJornadas)} km/jornada` : '0 km/jornada',
      custo_operacional: custoPorKm > 0 ? `R$ ${(custoPorKm / 100).toFixed(2)}/km` : 'R$ 0,00/km'
    }
  };
}

async function calcularFaturamentoBruto(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  idVeiculo?: string
): Promise<number> {
  let whereConditions = and(
    eq(jornadas.id_usuario, userId),
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

async function calcularGastoCombustivel(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  idVeiculo?: string
): Promise<number> {
  let whereConditions = and(
    eq(abastecimentos.id_usuario, userId),
    gte(abastecimentos.data_abastecimento, dataInicio.toISOString()),
    lte(abastecimentos.data_abastecimento, dataFim.toISOString()),
    isNull(abastecimentos.deleted_at)
  );

  if (idVeiculo) {
    whereConditions = and(whereConditions, eq(abastecimentos.id_veiculo, idVeiculo));
  }

  const result = await db
    .select({ total: sum(abastecimentos.valor_total) })
    .from(abastecimentos)
    .where(whereConditions);

  return Number(result[0]?.total || 0);
}

async function calcularOutrasDespesas(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  idVeiculo?: string
): Promise<number> {
  let whereConditions = and(
    eq(despesas.id_usuario, userId),
    gte(despesas.data_despesa, dataInicio.toISOString()),
    lte(despesas.data_despesa, dataFim.toISOString()),
    isNull(despesas.deleted_at)
  );

  if (idVeiculo) {
    whereConditions = and(whereConditions, eq(despesas.id_veiculo, idVeiculo));
  }

  const result = await db
    .select({ total: sum(despesas.valor_despesa) })
    .from(despesas)
    .where(whereConditions);

  return Number(result[0]?.total || 0);
}

async function calcularKmTotal(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  idVeiculo?: string
): Promise<number> {
  let whereConditions = and(
    eq(jornadas.id_usuario, userId),
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

async function contarJornadas(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  idVeiculo?: string
): Promise<number> {
  let whereConditions = and(
    eq(jornadas.id_usuario, userId),
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

async function detalharDespesasPorCategoria(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  idVeiculo?: string
): Promise<any> {
  // Despesas por categoria
  let whereConditions = and(
    eq(despesas.id_usuario, userId),
    gte(despesas.data_despesa, dataInicio.toISOString()),
    lte(despesas.data_despesa, dataFim.toISOString()),
    isNull(despesas.deleted_at)
  );

  if (idVeiculo) {
    whereConditions = and(whereConditions, eq(despesas.id_veiculo, idVeiculo));
  }

  const despesasPorCategoria = await db
    .select({
      categoria: despesas.tipo_despesa,
      total: sum(despesas.valor_despesa),
      quantidade: count()
    })
    .from(despesas)
    .where(whereConditions)
    .groupBy(despesas.tipo_despesa);

  // Gasto com combustível
  const gastoCombustivel = await calcularGastoCombustivel(userId, dataInicio, dataFim, idVeiculo);

  return {
    combustivel: {
      categoria: 'Combustível',
      total: gastoCombustivel,
      percentual: 0 // Será calculado no frontend
    },
    outras_categorias: despesasPorCategoria.map(item => ({
      categoria: item.categoria,
      total: Number(item.total || 0),
      quantidade: Number(item.quantidade || 0),
      percentual: 0 // Será calculado no frontend
    }))
  };
}

async function calcularEvolucaoDiaria(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  idVeiculo?: string
): Promise<any[]> {
  const evolucao = [];
  const dataAtual = new Date(dataInicio);

  while (dataAtual <= dataFim) {
    const inicioDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate());
    const fimDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate(), 23, 59, 59);

    const faturamentoDia = await calcularFaturamentoBruto(userId, inicioDia, fimDia, idVeiculo);
    const despesasDia = await calcularGastoCombustivel(userId, inicioDia, fimDia, idVeiculo) +
                       await calcularOutrasDespesas(userId, inicioDia, fimDia, idVeiculo);
    const lucroDia = faturamentoDia - despesasDia;
    const jornadasDia = await contarJornadas(userId, inicioDia, fimDia, idVeiculo);

    evolucao.push({
      data: dataAtual.toISOString().split('T')[0],
      data_formatada: dataAtual.toLocaleDateString('pt-BR'),
      faturamento: faturamentoDia,
      despesas: despesasDia,
      lucro: lucroDia,
      jornadas: jornadasDia
    });

    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  return evolucao;
}

function gerarCSVFinanceiro(relatorio: any, tipoPeriodo: string): string {
  const headers = [
    'Período',
    'Faturamento Bruto (R$)',
    'Gasto Combustível (R$)',
    'Outras Despesas (R$)',
    'Total Despesas (R$)',
    'Lucro Líquido (R$)',
    'Margem Lucro (%)',
    'KM Total',
    'Número Jornadas',
    'Custo por KM (R$)',
    'Ganho Médio por Jornada (R$)'
  ];

  const row = [
    relatorio.periodo.descricao,
    (relatorio.resumo_financeiro.faturamento_bruto / 100).toFixed(2),
    (relatorio.resumo_financeiro.gasto_combustivel / 100).toFixed(2),
    (relatorio.resumo_financeiro.outras_despesas / 100).toFixed(2),
    (relatorio.resumo_financeiro.total_despesas / 100).toFixed(2),
    (relatorio.resumo_financeiro.lucro_liquido / 100).toFixed(2),
    relatorio.resumo_financeiro.margem_lucro.toFixed(2),
    relatorio.resumo_financeiro.km_total,
    relatorio.resumo_financeiro.numero_jornadas,
    (relatorio.resumo_financeiro.custo_por_km / 100).toFixed(2),
    (relatorio.resumo_financeiro.ganho_medio_por_jornada / 100).toFixed(2)
  ];

  return [headers, row]
    .map(line => line.map(cell => `"${cell}"`).join(','))
    .join('\n');
}

