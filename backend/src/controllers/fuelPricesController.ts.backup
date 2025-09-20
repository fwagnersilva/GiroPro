import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../types';

// Interfaces
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  message?: string;
}

interface FuelPrice {
  id?: string;
  tipoCombustivel: FuelType;
  precoMedio: number;
  precoMinimo?: number;
  precoMaximo?: number;
  estado: string;
  cidade: string;
  numeroPostos?: number;
  dataColeta: string;
  fonte?: string;
}

interface PriceHistory {
  data: string;
  preco: number;
  fonte: string;
}

interface RegionalComparison {
  estado: string;
  precoMedio: number;
  variacao_semanal: number;
  numeroPostos: number;
  ultima_atualizacao: string;
}

interface PriceStatistics {
  precoMinimo: number;
  precoMaximo: number;
  precoMedio: number;
  variacao_percentual: number;
}

// Enums
enum FuelType {
  GASOLINA = 'Gasolina',
  ETANOL = 'Etanol',
  DIESEL = 'Diesel',
  GNV = 'GNV'
}

// Constants
const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

const BASE_FUEL_PRICES: Record<FuelType, number> = {
  [FuelType.GASOLINA]: 5.89,
  [FuelType.ETANOL]: 4.29,
  [FuelType.DIESEL]: 5.45,
  [FuelType.GNV]: 4.15
};

const STATE_PRICE_FACTORS: Record<string, number> = {
  'SP': 1.0,   'RJ': 1.05,  'MG': 0.95,  'RS': 0.98,  'PR': 0.97,
  'SC': 0.99,  'BA': 1.02,  'GO': 0.93,  'DF': 1.01,  'ES': 1.03,
  'CE': 1.04,  'PE': 1.06,  'AM': 1.08,  'PA': 1.07,  'MT': 0.92,
  'MS': 0.94,  'RO': 0.96,  'AC': 1.09,  'RR': 1.12,  'AP': 1.10
};

// Schemas de validação
const fuelPricesQuerySchema = z.object({
  estado: z.enum(BRAZILIAN_STATES).optional(),
  cidade: z.string()
    .min(2, "Cidade deve ter pelo menos 2 caracteres")
    .max(50, "Cidade deve ter no máximo 50 caracteres")
    .optional(),
  tipoCombustivel: z.nativeEnum(FuelType).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0)
});

const priceHistoryQuerySchema = z.object({
  estado: z.enum(BRAZILIAN_STATES),
  cidade: z.string()
    .min(2, "Cidade deve ter pelo menos 2 caracteres")
    .max(50, "Cidade deve ter no máximo 50 caracteres"),
  tipoCombustivel: z.nativeEnum(FuelType),
  periodo_dias: z.coerce.number()
    .int("Período deve ser um número inteiro")
    .min(1, "Período mínimo é 1 dia")
    .max(365, "Período máximo é 365 dias")
    .default(30)
});

const regionalComparisonQuerySchema = z.object({
  tipoCombustivel: z.nativeEnum(FuelType).default(FuelType.GASOLINA),
  estados: z.string()
    .optional()
    .transform(str => {
      if (!str) return ['SP', 'RJ', 'MG', 'RS', 'PR'];
      return str.split(',').map(s => s.trim().toUpperCase()).filter(s => 
        BRAZILIAN_STATES.includes(s as any)
      );
    })
});

const fuelPriceReportSchema = z.object({
  estado: z.enum(BRAZILIAN_STATES),
  cidade: z.string()
    .min(2, "Cidade deve ter pelo menos 2 caracteres")
    .max(50, "Cidade deve ter no máximo 50 caracteres")
    .trim(),
  tipoCombustivel: z.nativeEnum(FuelType),
  precoMedio: z.number()
    .positive("Preço médio deve ser positivo")
    .max(20, "Preço não pode ser superior a R$ 20,00")
    .multipleOf(0.001, "Preço deve ter no máximo 3 casas decimais"),
  posto_nome: z.string()
    .min(2, "Nome do posto deve ter pelo menos 2 caracteres")
    .max(100, "Nome do posto deve ter no máximo 100 caracteres")
    .optional(),
  endereco: z.string()
    .max(200, "Endereço deve ter no máximo 200 caracteres")
    .optional(),
  observacoes: z.string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional()
});

export class FuelPricesController {
  /**
   * Valida se o usuário está autenticado
   */
  private static validateAuth(req: AuthenticatedRequest): string | null {
    return req.user?.id || null;
  }

  /**
   * Retorna resposta de erro padronizada
   */
  private static errorResponse(res: Response, status: number, message: string, details?: any): Response {
    return res.status(status).json({
      success: false,
      error: { message, details }
    });
  }

  /**
   * Retorna resposta de sucesso padronizada
   */
  private static successResponse<T>(res: Response, data?: T, message?: string, status: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      ...(data !== undefined && { data }),
      ...(message && { message })
    };
    return res.status(status).json(response);
  }

  /**
   * Obtém preços de combustível por região
   */
  static async getPrices(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = FuelPricesController.validateAuth(req);
      if (!userId) {
        return FuelPricesController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const validation = fuelPricesQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return FuelPricesController.errorResponse(
          res,
          400,
          "Parâmetros de consulta inválidos",
          validation.error.errors
        );
      }

      const { estado, cidade, tipoCombustivel, limit, offset } = validation.data;

      // Gerar dados simulados (em produção, buscar de API externa ou banco)
      const precos = MockDataGenerator.generatePrices(
        estado,
        cidade,
        tipoCombustivel,
        limit,
        offset
      );

      const responseData = {
        precos,
        pagination: {
          limit,
          offset,
          total: precos.length,
          has_more: false // Em produção, calcular baseado na query real
        },
        filtros: {
          estado: estado || null,
          cidade: cidade || null,
          tipoCombustivel: tipoCombustivel || null
        },
        ultima_atualizacao: new Date().toISOString(),
        fonte: "Dados simulados - ANP"
      };

      return FuelPricesController.successResponse(res, responseData);

    } catch (error: any) {
      console.error("Erro ao obter preços de combustível:", error);
      return FuelPricesController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }

  /**
   * Obtém histórico de preços de combustível
   */
  static async getPriceHistory(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = FuelPricesController.validateAuth(req);
      if (!userId) {
        return FuelPricesController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const validation = priceHistoryQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return FuelPricesController.errorResponse(
          res,
          400,
          "Parâmetros de consulta inválidos",
          validation.error.errors
        );
      }

      const { estado, cidade, tipoCombustivel, periodo_dias } = validation.data;

      // Gerar histórico simulado
      const historico = MockDataGenerator.generatePriceHistory(
        estado,
        cidade,
        tipoCombustivel,
        periodo_dias
      );

      const estatisticas = StatisticsCalculator.calculatePriceStatistics(historico);

      const responseData = {
        historico,
        parametros: {
          estado,
          cidade,
          tipoCombustivel,
          periodo_dias
        },
        estatisticas
      };

      return FuelPricesController.successResponse(res, responseData);

    } catch (error: any) {
      console.error("Erro ao obter histórico de preços:", error);
      return FuelPricesController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }

  /**
   * Obtém comparativo de preços entre regiões
   */
  static async getRegionalComparison(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = FuelPricesController.validateAuth(req);
      if (!userId) {
        return FuelPricesController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const validation = regionalComparisonQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return FuelPricesController.errorResponse(
          res,
          400,
          "Parâmetros de consulta inválidos",
          validation.error.errors
        );
      }

      const { tipoCombustivel, estados } = validation.data;

      // Gerar comparativo simulado
      const comparativo = MockDataGenerator.generateRegionalComparison(
        tipoCombustivel,
        estados
      );

      // Ordenar por preço e calcular estatísticas
      comparativo.sort((a, b) => a.precoMedio - b.precoMedio);

      const estatisticas = {
        menor_preco: comparativo[0],
        maior_preco: comparativo[comparativo.length - 1],
        diferenca_maxima: Number(
          (comparativo[comparativo.length - 1].precoMedio - comparativo[0].precoMedio).toFixed(3)
        ),
        variacao_media: Number(
          (comparativo.reduce((acc, item) => acc + Math.abs(item.variacao_semanal), 0) / comparativo.length).toFixed(3)
        )
      };

      const responseData = {
        tipoCombustivel,
        comparativo,
        estatisticas,
        total_estados: comparativo.length
      };

      return FuelPricesController.successResponse(res, responseData);

    } catch (error: any) {
      console.error("Erro ao obter comparativo regional:", error);
      return FuelPricesController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }

  /**
   * Registra um preço de combustível observado pelo usuário
   */
  static async reportPrice(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = FuelPricesController.validateAuth(req);
      if (!userId) {
        return FuelPricesController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const validation = fuelPriceReportSchema.safeParse(req.body);
      if (!validation.success) {
        return FuelPricesController.errorResponse(
          res,
          400,
          "Dados inválidos",
          validation.error.errors
        );
      }

      const priceData = validation.data;

      // Validar se o preço está dentro de uma faixa realista
      const priceValidation = PriceValidator.validateReportedPrice(priceData);
      if (!priceValidation.isValid) {
        return FuelPricesController.errorResponse(
          res,
          422,
          priceValidation.message || "Preço fora da faixa esperada"
        );
      }

      // Em produção, salvar no banco de dados
      const reportedPrice = {
        id: `price_${Date.now()}_${userId}`,
        ...priceData,
        idUsuario: userId,
        dataRegistro: new Date().toISOString(),
        status: 'pendente_validacao',
        fonte: 'Usuario'
      };

      return FuelPricesController.successResponse(
        res,
        reportedPrice,
        "Preço reportado com sucesso. Obrigado por contribuir com a comunidade!",
        201
      );

    } catch (error: any) {
      console.error("Erro ao reportar preço:", error);
      return FuelPricesController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }

  /**
   * Obtém postos próximos com base na localização
   */
  static async getNearbyStations(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = FuelPricesController.validateAuth(req);
      if (!userId) {
        return FuelPricesController.errorResponse(res, 401, "Usuário não autenticado");
      }

      const validation = z.object({
        latitude: z.coerce.number().min(-90).max(90),
        longitude: z.coerce.number().min(-180).max(180),
        raio_km: z.coerce.number().positive().max(50).default(10),
        tipoCombustivel: z.nativeEnum(FuelType).optional()
      }).safeParse(req.query);

      if (!validation.success) {
        return FuelPricesController.errorResponse(
          res,
          400,
          "Parâmetros de localização inválidos",
          validation.error.errors
        );
      }

      const { latitude, longitude, raio_km, tipoCombustivel } = validation.data;

      // Gerar postos simulados próximos
      const postos = MockDataGenerator.generateNearbyStations(
        latitude,
        longitude,
        raio_km,
        tipoCombustivel
      );

      const responseData = {
        postos,
        localizacao: {
          latitude,
          longitude,
          raio_km
        },
        filtros: {
          tipoCombustivel: tipoCombustivel || null
        },
        total_postos: postos.length
      };

      return FuelPricesController.successResponse(res, responseData);

    } catch (error: any) {
      console.error("Erro ao buscar postos próximos:", error);
      return FuelPricesController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }

  /**
   * Obtém alertas de preço para o usuário
   */
  static async getPriceAlerts(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = FuelPricesController.validateAuth(req);
      if (!userId) {
        return FuelPricesController.errorResponse(res, 401, "Usuário não autenticado");
      }

      // Em produção, buscar alertas do usuário no banco de dados
      const alertas = MockDataGenerator.generatePriceAlerts(userId);

      const responseData = {
        alertas,
        total_alertas: alertas.length,
        alertas_ativos: alertas.filter(a => a.ativo).length
      };

      return FuelPricesController.successResponse(res, responseData);

    } catch (error: any) {
      console.error("Erro ao obter alertas de preço:", error);
      return FuelPricesController.errorResponse(res, 500, "Erro interno do servidor");
    }
  }
}

// Classes auxiliares

class MockDataGenerator {
  static generatePrices(
    estado?: string,
    cidade?: string,
    tipoCombustivel?: FuelType,
    limit: number = 20,
    offset: number = 0
  ): FuelPrice[] {
    const tipos = tipoCombustivel ? [tipoCombustivel] : Object.values(FuelType);
    const precos: FuelPrice[] = [];

    for (const tipo of tipos) {
      const precoBase = BASE_FUEL_PRICES[tipo];
      const estadoFactor = STATE_PRICE_FACTORS[estado || 'SP'] || 1.0;
      const variacao = (Math.random() - 0.5) * 0.4; // ±20%
      
      const precoMedio = precoBase * estadoFactor * (1 + variacao);
      
      precos.push({
        tipoCombustivel: tipo,
        precoMedio: Number(precoMedio.toFixed(3)),
        precoMinimo: Number((precoMedio * 0.9).toFixed(3)),
        precoMaximo: Number((precoMedio * 1.1).toFixed(3)),
        estado: estado || 'SP',
        cidade: cidade || 'São Paulo',
        numeroPostos: Math.floor(Math.random() * 50) + 10,
        dataColeta: new Date().toISOString(),
        fonte: 'ANP'
      });
    }

    return precos.slice(offset, offset + limit);
  }

  static generatePriceHistory(
    estado: string,
    cidade: string,
    tipoCombustivel: FuelType,
    periodoDias: number
  ): PriceHistory[] {
    const historico: PriceHistory[] = [];
    const precoBase = BASE_FUEL_PRICES[tipoCombustivel];
    const estadoFactor = STATE_PRICE_FACTORS[estado] || 1.0;
    
    for (let i = periodoDias - 1; i >= 0; i--) {
      const data = new Date();
      data.setDate(data.getDate() - i);
      
      // Simular variação gradual com tendência e ruído
      const tendencia = Math.sin(i / 10) * 0.1;
      const ruido = (Math.random() - 0.5) * 0.05;
      const preco = precoBase * estadoFactor * (1 + tendencia + ruido);
      
      historico.push({
        data: data.toISOString().split('T')[0],
        preco: Number(preco.toFixed(3)),
        fonte: 'ANP'
      });
    }

    return historico;
  }

  static generateRegionalComparison(
    tipoCombustivel: FuelType,
    estados: string[]
  ): RegionalComparison[] {
    const precoBase = BASE_FUEL_PRICES[tipoCombustivel];
    
    return estados.map(estado => {
      const fator = STATE_PRICE_FACTORS[estado] || 1.0;
      const precoMedio = precoBase * fator;
      
      return {
        estado,
        precoMedio: Number(precoMedio.toFixed(3)),
        variacao_semanal: Number(((Math.random() - 0.5) * 0.2).toFixed(3)), // -10% a +10%
        numeroPostos: Math.floor(Math.random() * 500) + 100,
        ultima_atualizacao: new Date().toISOString()
      };
    });
  }

  static generateNearbyStations(
    latitude: number,
    longitude: number,
    raioKm: number,
    tipoCombustivel?: FuelType
  ): any[] {
    const postos = [];
    const numPostos = Math.floor(Math.random() * 10) + 5;

    for (let i = 0; i < numPostos; i++) {
      // Gerar coordenadas próximas (aproximação simples)
      const latOffset = (Math.random() - 0.5) * (raioKm / 111); // ~111km por grau
      const lngOffset = (Math.random() - 0.5) * (raioKm / 111);

      postos.push({
        id: `posto_${i + 1}`,
        nome: `Posto ${String.fromCharCode(65 + i)}`,
        latitude: Number((latitude + latOffset).toFixed(6)),
        longitude: Number((longitude + lngOffset).toFixed(6)),
        distancia_km: Number((Math.random() * raioKm).toFixed(1)),
        endereco: `Rua ${i + 1}, ${100 + i}`,
        telefone: `(11) 9999-${String(i).padStart(4, '0')}`,
        combustiveis: tipoCombustivel ? 
          [{ tipo: tipoCombustivel, preco: Number((BASE_FUEL_PRICES[tipoCombustivel] * (1 + Math.random() * 0.2)).toFixed(3)) }] :
          Object.entries(BASE_FUEL_PRICES).map(([tipo, preco]) => ({
            tipo,
            preco: Number((preco * (1 + Math.random() * 0.2)).toFixed(3))
          }))
      });
    }

    return postos.sort((a, b) => a.distancia_km - b.distancia_km);
  }

  static generatePriceAlerts(userId: string): any[] {
    return [
      {
        id: `alert_${userId}_1`,
        tipoCombustivel: FuelType.GASOLINA,
        precoMaximo: 5.50,
        estado: 'SP',
        cidade: 'São Paulo',
        ativo: true,
        criado_em: new Date().toISOString()
      }
    ];
  }
}

class StatisticsCalculator {
  static calculatePriceStatistics(historico: PriceHistory[]): PriceStatistics {
    if (historico.length === 0) {
      return {
        precoMinimo: 0,
        precoMaximo: 0,
        precoMedio: 0,
        variacao_percentual: 0
      };
    }

    const precos = historico.map(h => h.preco);
    const precoMinimo = Math.min(...precos);
    const precoMaximo = Math.max(...precos);
    const precoMedio = precos.reduce((acc, p) => acc + p, 0) / precos.length;
    
    const precoInicial = historico[0].preco;
    const precoFinal = historico[historico.length - 1].preco;
    const variacaoPercentual = precoInicial > 0 ? 
      ((precoFinal - precoInicial) / precoInicial) * 100 : 0;

    return {
      precoMinimo: Number(precoMinimo.toFixed(3)),
      precoMaximo: Number(precoMaximo.toFixed(3)),
      precoMedio: Number(precoMedio.toFixed(3)),
      variacao_percentual: Number(variacaoPercentual.toFixed(2))
    };
  }
}

class PriceValidator {
  static validateReportedPrice(priceData: any): { isValid: boolean; message?: string } {
    const precoBase = BASE_FUEL_PRICES[priceData.tipoCombustivel as FuelType];
    const estadoFactor = STATE_PRICE_FACTORS[priceData.estado] || 1.0;
    const precoEsperado = precoBase * estadoFactor;
    
    // Verificar se o preço está dentro de ±50% do esperado
    const limiteMinimo = precoEsperado * 0.5;
    const limiteMaximo = precoEsperado * 1.5;
    
    if (priceData.precoMedio < limiteMinimo) {
      return {
        isValid: false,
        message: `Preço muito baixo. Preço mínimo esperado: R$ ${limiteMinimo.toFixed(3)}`
      };
    }
    
    if (priceData.precoMedio > limiteMaximo) {
      return {
        isValid: false,
        message: `Preço muito alto. Preço máximo esperado: R$ ${limiteMaximo.toFixed(3)}`
      };
    }
    
    return { isValid: true };
  }
}
