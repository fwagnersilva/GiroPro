import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { jornadas, abastecimentos, despesas, veiculos } from '../db/schema';
import { eq, and, isNull, isNotNull, sql, gte, lte, sum, count, avg } from 'drizzle-orm';
import { AuthenticatedRequest } from '../types';

// Schema para validação dos parâmetros de consulta dos relatórios
const reportsQuerySchema = z.object({
  periodo: z.enum(['hoje', 'semana', 'mes', 'ano', 'personalizado']).default('mes'),
  data_inicio: z.string().datetime().optional(),
  data_fim: z.string().datetime().optional(),
  id_veiculo: z.string().uuid().optional(),
  formato: z.enum(['json', 'csv']).default('json')
});

export class ReportsController {
  /**
   * Relatório Detalhado de Ganhos por Jornada
   */
  static async getJourneyEarningsReport(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }

      const queryValidation = reportsQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Parâmetros de consulta inválidos",
            details: queryValidation.error.errors
          }
        });
      }

      const { periodo, data_inicio, data_fim, id_veiculo, formato } = queryValidation.data;
      const { dataInicio, dataFim } = calcularPeriodo(periodo, data_inicio, data_fim);

      // Construir condições de filtro
      let whereConditions = and(
        eq(jornadas.id_usuario, req.user?.id),
        isNotNull(jornadas.data_fim),
        gte(jornadas.data_fim, dataInicio.toISOString()),
        lte(jornadas.data_fim, dataFim.toISOString()),
        isNull(jornadas.deleted_at)
      );

      if (id_veiculo) {
        whereConditions = and(whereConditions, eq(jornadas.id_veiculo, id_veiculo));
      }

      // Buscar jornadas com informações do veículo
      const jornadas_detalhadas = await db
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

      // Calcular custo estimado de combustível e lucro líquido para cada jornada
      const relatorio_jornadas = await Promise.all(
        jornadas_detalhadas.map(async (jornada) => {
          // Estimar custo de combustível baseado no consumo médio do veículo
          const custo_combustivel_estimado = await estimarCustoCombustivel(
            jornada.km_total || 0,
            jornada.veiculo_tipo_combustivel,
            jornada.data_fim ? new Date(jornada.data_fim) : null
          );

          // Buscar despesas específicas da jornada (se houver)
          const despesas_jornada = await buscarDespesasJornada(
            req.user?.id!,
            jornada.data_inicio ? new Date(jornada.data_inicio) : null,
            jornada.data_fim ? new Date(jornada.data_fim) : null,
            jornada.id
          );

          const lucro_liquido_estimado = (jornada.ganho_bruto || 0) - custo_combustivel_estimado - despesas_jornada;

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
              custo_combustivel_estimado,
              outras_despesas: despesas_jornada,
              lucro_liquido_estimado,
              margem_lucro: jornada.ganho_bruto ? 
                Math.round((lucro_liquido_estimado / jornada.ganho_bruto) * 10000) / 100 : 0
            },
            observacoes: jornada.observacoes
          };
        })
      );

      // Calcular estatísticas do relatório
      const estatisticas = calcularEstatisticasJornadas(relatorio_jornadas);

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
        jornadas: relatorio_jornadas,
        total_jornadas: relatorio_jornadas.length
      };

      if (formato === 'csv') {
        const csv = gerarCSVJornadas(relatorio_jornadas);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="relatorio_jornadas.csv"');
        return res.send(csv);
      }

      return res.json({
        success: true,
        data: relatorio
      });

    } catch (error: any) {
      console.error("Erro ao gerar relatório de jornadas:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }

  /**
   * Relatório de Análise de Despesas
   */
  static async getExpenseAnalysisReport(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }

      const queryValidation = reportsQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Parâmetros de consulta inválidos",
            details: queryValidation.error.errors
          }
        });
      }

      const { periodo, data_inicio, data_fim, id_veiculo, formato } = queryValidation.data;
      const { dataInicio, dataFim } = calcularPeriodo(periodo, data_inicio, data_fim);

      // Análise de despesas por categoria
      const despesas_por_categoria = await analisarDespesasPorCategoria(
        req.user?.id,
        dataInicio,
        dataFim,
        id_veiculo
      );

      // Evolução das despesas ao longo do tempo
      const evolucao_despesas = await analisarEvolucaoDespesas(
        req.user?.id,
        dataInicio,
        dataFim,
        id_veiculo
      );

      // Comparação entre veículos (se não filtrado por veículo específico)
      let comparacao_veiculos = null;
      if (!id_veiculo) {
        comparacao_veiculos = await compararDespesasVeiculos(
          req.user?.id,
          dataInicio,
          dataFim
        );
      }

      // Análise de combustível
      const analise_combustivel = await analisarGastosCombustivel(
        req.user?.id,
        dataInicio,
        dataFim,
        id_veiculo
      );

      const relatorio = {
        periodo: {
          tipo: periodo,
          data_inicio: dataInicio.toISOString(),
          data_fim: dataFim.toISOString()
        },
        filtros: {
          id_veiculo: id_veiculo || null
        },
        despesas_por_categoria,
        evolucao_despesas,
        comparacao_veiculos,
        analise_combustivel
      };

      if (formato === 'csv') {
        const csv = gerarCSVDespesas(despesas_por_categoria, evolucao_despesas);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="relatorio_despesas.csv"');
        return res.send(csv);
      }

      return res.json({
        success: true,
        data: relatorio
      });

    } catch (error: any) {
      console.error("Erro ao gerar relatório de despesas:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }

  /**
   * Relatório de Consumo de Combustível
   */
  static async getFuelConsumptionReport(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }

      const queryValidation = reportsQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Parâmetros de consulta inválidos",
            details: queryValidation.error.errors
          }
        });
      }

      const { periodo, data_inicio, data_fim, id_veiculo, formato } = queryValidation.data;
      const { dataInicio, dataFim } = calcularPeriodo(periodo, data_inicio, data_fim);

      // Análise de consumo por veículo
      const consumo_por_veiculo = await analisarConsumoPorVeiculo(
        req.user?.id,
        dataInicio,
        dataFim,
        id_veiculo
      );

      // Evolução do preço médio do litro
      const evolucao_precos = await analisarEvolucaoPrecos(
        req.user?.id,
        dataInicio,
        dataFim,
        id_veiculo
      );

      // Comparação entre tipos de combustível
      const comparacao_combustiveis = await compararTiposCombustivel(
        req.user?.id,
        dataInicio,
        dataFim
      );

      // Análise de eficiência
      const analise_eficiencia = await analisarEficienciaCombustivel(
        req.user?.id,
        dataInicio,
        dataFim,
        id_veiculo
      );

      const relatorio = {
        periodo: {
          tipo: periodo,
          data_inicio: dataInicio.toISOString(),
          data_fim: dataFim.toISOString()
        },
        filtros: {
          id_veiculo: id_veiculo || null
        },
        consumo_por_veiculo,
        evolucao_precos,
        comparacao_combustiveis,
        analise_eficiencia
      };

      if (formato === 'csv') {
        const csv = gerarCSVCombustivel(consumo_por_veiculo, evolucao_precos);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="relatorio_combustivel.csv"');
        return res.send(csv);
      }

      return res.json({
        success: true,
        data: relatorio
      });

    } catch (error: any) {
      console.error("Erro ao gerar relatório de combustível:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }
}

// Funções auxiliares

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

async function estimarCustoCombustivel(
  kmTotal: number,
  tipoCombustivel: string | null,
  dataJornada: Date | null
): Promise<number> {
  if (!kmTotal || !tipoCombustivel || !dataJornada) return 0;

  // Buscar preço médio do combustível próximo à data da jornada
  const precoMedio = await buscarPrecoMedioCombustivel(tipoCombustivel, dataJornada);
  
  // Assumir consumo médio de 12 km/l (pode ser melhorado com dados reais do veículo)
  const consumoMedio = 12;
  const litrosConsumidos = kmTotal / consumoMedio;
  
  return Math.round(litrosConsumidos * precoMedio);
}

async function buscarPrecoMedioCombustivel(tipoCombustivel: string, data: Date): Promise<number> {
  // Implementação simplificada - buscar preço médio recente
  // Em uma implementação real, buscaria no histórico de preços
  const precosPadrao: { [key: string]: number } = {
    'Gasolina': 550, // R$ 5,50 em centavos
    'Etanol': 350,   // R$ 3,50 em centavos
    'Diesel': 480,   // R$ 4,80 em centavos
    'GNV': 280,      // R$ 2,80 em centavos
    'Flex': 450      // R$ 4,50 em centavos
  };

  return precosPadrao[tipoCombustivel] || 500;
}

async function buscarDespesasJornada(
  userId: string,
  dataInicio: Date | null,
  dataFim: Date | null,
  idJornada: string
): Promise<number> {
  if (!dataInicio || !dataFim) return 0;

  // Buscar despesas no período da jornada
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

function calcularEstatisticasJornadas(jornadas: any[]): any {
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

  const totalGanhoBruto = jornadas.reduce((sum, j) => sum + j.financeiro.ganho_bruto, 0);
  const totalCustoEstimado = jornadas.reduce((sum, j) => 
    sum + j.financeiro.custo_combustivel_estimado + j.financeiro.outras_despesas, 0);
  const totalLucroLiquido = jornadas.reduce((sum, j) => sum + j.financeiro.lucro_liquido_estimado, 0);
  const totalKm = jornadas.reduce((sum, j) => sum + (j.quilometragem.total || 0), 0);

  return {
    total_ganho_bruto: totalGanhoBruto,
    total_custo_estimado: totalCustoEstimado,
    total_lucro_liquido: totalLucroLiquido,
    media_ganho_por_jornada: Math.round(totalGanhoBruto / jornadas.length),
    media_lucro_por_jornada: Math.round(totalLucroLiquido / jornadas.length),
    margem_lucro_media: totalGanhoBruto > 0 ? 
      Math.round((totalLucroLiquido / totalGanhoBruto) * 10000) / 100 : 0,
    total_km: totalKm,
    media_km_por_jornada: Math.round(totalKm / jornadas.length)
  };
}

async function analisarDespesasPorCategoria(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  idVeiculo?: string
): Promise<any> {
  // Implementação das análises de despesas por categoria
  // Retorna dados estruturados para gráficos e tabelas
  return {};
}

async function analisarEvolucaoDespesas(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  idVeiculo?: string
): Promise<any> {
  // Implementação da análise de evolução das despesas
  return {};
}

async function compararDespesasVeiculos(
  userId: string,
  dataInicio: Date,
  dataFim: Date
): Promise<any> {
  // Implementação da comparação entre veículos
  return {};
}

async function analisarGastosCombustivel(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  idVeiculo?: string
): Promise<any> {
  // Implementação da análise de gastos com combustível
  return {};
}

async function analisarConsumoPorVeiculo(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  idVeiculo?: string
): Promise<any> {
  // Implementação da análise de consumo por veículo
  return {};
}

async function analisarEvolucaoPrecos(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  idVeiculo?: string
): Promise<any> {
  // Implementação da análise de evolução de preços
  return {};
}

async function compararTiposCombustivel(
  userId: string,
  dataInicio: Date,
  dataFim: Date
): Promise<any> {
  // Implementação da comparação entre tipos de combustível
  return {};
}

async function analisarEficienciaCombustivel(
  userId: string,
  dataInicio: Date,
  dataFim: Date,
  idVeiculo?: string
): Promise<any> {
  // Implementação placeholder da análise de eficiência
  return {};
}

// Funções auxiliares para geração de CSV (placeholders)
function gerarCSVJornadas(jornadas: any[]): string {
  // Implementação placeholder para gerar CSV de jornadas
  return "id,data_inicio,data_fim,ganho_bruto\n" + jornadas.map(j => `${j.id_jornada},${j.data_inicio},${j.data_fim},${j.financeiro.ganho_bruto}`).join("\n");
}

function gerarCSVDespesas(despesas_por_categoria: any, evolucao_despesas: any): string {
  // Implementação placeholder para gerar CSV de despesas
  return "categoria,total\n" + Object.entries(despesas_por_categoria).map(([cat, total]) => `${cat},${total}`).join("\n");
}

function gerarCSVCombustivel(consumo_por_veiculo: any, evolucao_precos: any): string {
  // Implementação placeholder para gerar CSV de combustível
  return "veiculo,consumo\n" + Object.entries(consumo_por_veiculo).map(([veic, consumo]) => `${veic},${consumo}`).join("\n");
}


