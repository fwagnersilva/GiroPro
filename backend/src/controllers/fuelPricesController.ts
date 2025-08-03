import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../types';

// Schema para validação dos parâmetros de consulta de preços
const fuelPricesQuerySchema = z.object({
  estado: z.string().length(2, "Estado deve ter 2 caracteres").optional(),
  cidade: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres").optional(),
  tipo_combustivel: z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV']).optional()
});

// Schema para validação de dados de preço de combustível
const fuelPriceSchema = z.object({
  estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  cidade: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  tipo_combustivel: z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV']),
  preco_medio: z.number().positive("Preço médio deve ser positivo"),
  data_coleta: z.string().datetime("Data de coleta deve estar no formato ISO 8601"),
  fonte: z.string().min(1, "Fonte é obrigatória").default("Manual")
});

export class FuelPricesController {
  /**
   * Obtém preços de combustível por região
   */
  static async getPrices(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }

      const queryValidation = fuelPricesQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Parâmetros de consulta inválidos",
            details: queryValidation.error.errors
          }
        });
      }

      const { estado, cidade, tipo_combustivel } = queryValidation.data;

      // Por enquanto, retornar dados simulados
      // Em uma implementação real, isso consultaria uma API externa ou banco de dados
      const precosMock = generateMockPrices(estado, cidade, tipo_combustivel);

      return res.json({
        success: true,
        data: {
          precos: precosMock,
          filtros: {
            estado,
            cidade,
            tipo_combustivel
          },
          ultima_atualizacao: new Date().toISOString(),
          fonte: "Dados simulados - ANP"
        }
      });

    } catch (error: any) {
      console.error("Erro ao obter preços de combustível:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }

  /**
   * Obtém histórico de preços de combustível
   */
  static async getPriceHistory(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }

      const queryValidation = z.object({
        estado: z.string().length(2, "Estado deve ter 2 caracteres"),
        cidade: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
        tipo_combustivel: z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV']),
        periodo_dias: z.coerce.number().int().min(1).max(365).default(30)
      }).safeParse(req.query);

      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Parâmetros de consulta inválidos",
            details: queryValidation.error.errors
          }
        });
      }

      const { estado, cidade, tipo_combustivel, periodo_dias } = queryValidation.data;

      // Gerar histórico simulado
      const historico = generateMockPriceHistory(estado, cidade, tipo_combustivel, periodo_dias);

      return res.json({
        success: true,
        data: {
          historico,
          parametros: {
            estado,
            cidade,
            tipo_combustivel,
            periodo_dias
          },
          estatisticas: {
            preco_minimo: Math.min(...historico.map(h => h.preco)),
            preco_maximo: Math.max(...historico.map(h => h.preco)),
            preco_medio: historico.reduce((acc, h) => acc + h.preco, 0) / historico.length,
            variacao_percentual: calculatePriceVariation(historico)
          }
        }
      });

    } catch (error: any) {
      console.error("Erro ao obter histórico de preços:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }

  /**
   * Obtém comparativo de preços entre regiões
   */
  static async getRegionalComparison(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }

      const queryValidation = z.object({
        tipo_combustivel: z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV']).default('Gasolina'),
        estados: z.string().optional().transform(str => str ? str.split(',') : ['SP', 'RJ', 'MG', 'RS', 'PR'])
      }).safeParse(req.query);

      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Parâmetros de consulta inválidos",
            details: queryValidation.error.errors
          }
        });
      }

      const { tipo_combustivel, estados } = queryValidation.data;

      // Gerar comparativo simulado
      const comparativo = estados.map(estado => {
        const precoBase = getBasePriceForState(estado, tipo_combustivel);
        return {
          estado,
          preco_medio: precoBase,
          variacao_semanal: (Math.random() - 0.5) * 0.2, // -10% a +10%
          numero_postos: Math.floor(Math.random() * 500) + 100,
          ultima_atualizacao: new Date().toISOString()
        };
      });

      // Ordenar por preço
      comparativo.sort((a, b) => a.preco_medio - b.preco_medio);

      return res.json({
        success: true,
        data: {
          tipo_combustivel,
          comparativo,
          estatisticas: {
            menor_preco: comparativo[0],
            maior_preco: comparativo[comparativo.length - 1],
            diferenca_maxima: comparativo[comparativo.length - 1].preco_medio - comparativo[0].preco_medio
          }
        }
      });

    } catch (error: any) {
      console.error("Erro ao obter comparativo regional:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }

  /**
   * Registra um preço de combustível observado pelo usuário
   */
  static async reportPrice(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Usuário não autenticado" }
        });
      }

      const validation = fuelPriceSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: {
            message: "Dados inválidos",
            details: validation.error.errors
          }
        });
      }

      const priceData = validation.data;

      // Em uma implementação real, isso salvaria no banco de dados
      // Por enquanto, apenas simular o sucesso
      const reportedPrice = {
        id: `price_${Date.now()}`,
        ...priceData,
        id_usuario: req.user?.id,
        data_registro: new Date().toISOString(),
        status: 'pendente_validacao'
      };

      return res.status(201).json({
        success: true,
        data: reportedPrice,
        message: "Preço reportado com sucesso. Obrigado por contribuir com a comunidade!"
      });

    } catch (error: any) {
      console.error("Erro ao reportar preço:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Erro interno do servidor" }
      });
    }
  }
}

// Funções auxiliares para dados simulados

function generateMockPrices(estado?: string, cidade?: string, tipoCombustivel?: string) {
  const tipos = tipoCombustivel ? [tipoCombustivel] : ['Gasolina', 'Etanol', 'Diesel', 'GNV'];
  const precos = [];

  for (const tipo of tipos) {
    const precoBase = getBasePriceForFuel(tipo);
    const variacao = (Math.random() - 0.5) * 0.4; // ±20%
    
    precos.push({
      tipo_combustivel: tipo,
      preco_medio: Math.round((precoBase * (1 + variacao)) * 100) / 100,
      preco_minimo: Math.round((precoBase * (1 + variacao - 0.1)) * 100) / 100,
      preco_maximo: Math.round((precoBase * (1 + variacao + 0.1)) * 100) / 100,
      estado: estado || 'SP',
      cidade: cidade || 'São Paulo',
      numero_postos: Math.floor(Math.random() * 50) + 10,
      data_coleta: new Date().toISOString()
    });
  }

  return precos;
}

function generateMockPriceHistory(estado: string, cidade: string, tipoCombustivel: string, periodoDias: number) {
  const historico = [];
  const precoBase = getBasePriceForFuel(tipoCombustivel);
  
  for (let i = periodoDias - 1; i >= 0; i--) {
    const data = new Date();
    data.setDate(data.getDate() - i);
    
    // Simular variação gradual de preços
    const tendencia = Math.sin(i / 10) * 0.1; // Variação cíclica
    const ruido = (Math.random() - 0.5) * 0.05; // Ruído aleatório
    const preco = precoBase * (1 + tendencia + ruido);
    
    historico.push({
      data: data.toISOString().split('T')[0],
      preco: Math.round(preco * 100) / 100,
      fonte: 'ANP'
    });
  }

  return historico;
}

function getBasePriceForFuel(tipoCombustivel: string): number {
  const precosBases = {
    'Gasolina': 5.89,
    'Etanol': 4.29,
    'Diesel': 5.45,
    'GNV': 4.15
  };
  
  return precosBases[tipoCombustivel as keyof typeof precosBases] || 5.89;
}

function getBasePriceForState(estado: string, tipoCombustivel: string): number {
  const precoBase = getBasePriceForFuel(tipoCombustivel);
  
  // Fatores de ajuste por estado (simulado)
  const fatoresEstado: { [key: string]: number } = {
    'SP': 1.0,
    'RJ': 1.05,
    'MG': 0.95,
    'RS': 0.98,
    'PR': 0.97,
    'SC': 0.99,
    'BA': 1.02,
    'GO': 0.93,
    'DF': 1.01,
    'ES': 1.03
  };
  
  const fator = fatoresEstado[estado] || 1.0;
  return Math.round(precoBase * fator * 100) / 100;
}

function calculatePriceVariation(historico: Array<{ preco: number }>): number {
  if (historico.length < 2) return 0;
  
  const precoInicial = historico[0].preco;
  const precoFinal = historico[historico.length - 1].preco;
  
  return Math.round(((precoFinal - precoInicial) / precoInicial) * 10000) / 100;
}

