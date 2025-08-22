import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { FuelPricesService } from "../services/fuel_prices_service";
import { cacheService } from "../services/cacheService";

// ========== SCHEMAS DE VALIDAÇÃO ==========

const fuelPricesQuerySchema = z.object({
  estado: z.string()
    .length(2, "Estado deve ter 2 caracteres")
    .regex(/^[A-Z]{2}$/, "Estado deve estar em maiúsculas")
    .optional(),
  cidade: z.string()
    .min(2, "Cidade deve ter pelo menos 2 caracteres")
    .max(100, "Nome da cidade muito longo")
    .optional(),
  tipoCombustivel: z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV'])
    .optional(),
  limite: z.coerce.number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .optional()
});

const priceHistoryQuerySchema = z.object({
  estado: z.string()
    .length(2, "Estado deve ter 2 caracteres")
    .regex(/^[A-Z]{2}$/, "Estado deve estar em maiúsculas"),
  cidade: z.string()
    .min(2, "Cidade deve ter pelo menos 2 caracteres")
    .max(100, "Nome da cidade muito longo"),
  tipoCombustivel: z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV']),
  periodo_dias: z.coerce.number()
    .int()
    .min(1, "Período mínimo é 1 dia")
    .max(365, "Período máximo é 365 dias")
    .default(30)
});

const regionalComparisonSchema = z.object({
  tipoCombustivel: z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV'])
    .default('Gasolina'),
  estados: z.string()
    .optional()
    .transform(str => {
      if (!str) return ['SP', 'RJ', 'MG', 'RS', 'PR'];
      const estadosArray = str.split(',').map(e => e.trim().toUpperCase());
      if (estadosArray.length > 10) {
        throw new Error('Máximo de 10 estados permitidos');
      }
      return estadosArray;
    }),
  incluirTendencia: z.coerce.boolean().default(false)
});

const reportPriceSchema = z.object({
  estado: z.string()
    .length(2, "Estado deve ter 2 caracteres")
    .regex(/^[A-Z]{2}$/, "Estado deve estar em maiúsculas"),
  cidade: z.string()
    .min(2, "Cidade deve ter pelo menos 2 caracteres")
    .max(100, "Nome da cidade muito longo"),
  tipoCombustivel: z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV']),
  precoMedio: z.number()
    .positive("Preço médio deve ser positivo")
    .max(50, "Preço parece muito alto, verifique")
    .refine(val => Number(val.toFixed(3)) === val, "Máximo 3 casas decimais"),
  nomePosto: z.string()
    .min(2, "Nome do posto é obrigatório")
    .max(200, "Nome do posto muito longo")
    .optional(),
  endereco: z.string()
    .max(300, "Endereço muito longo")
    .optional(),
  observacoes: z.string()
    .max(500, "Observações muito longas")
    .optional(),
  fonte: z.string()
    .min(1, "Fonte é obrigatória")
    .default("Usuário"),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

// ========== TIPOS E INTERFACES ==========

interface FuelPriceFilters {
  estado?: string;
  cidade?: string;
  tipoCombustivel?: string;
  limite?: number;
}

interface PriceHistoryParams {
  estado: string;
  cidade: string;
  tipoCombustivel: string;
  periodo_dias: number;
}

interface RegionalComparisonParams {
  tipoCombustivel: string;
  estados: string[];
  incluirTendencia: boolean;
}

// ========== UTILITÁRIOS ==========

const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const extractUserId = (req: Request): string => {
  const userId = (req as AuthenticatedRequest).user?.id;
  if (!userId) {
    throw new Error('UNAUTHORIZED');
  }
  return userId;
};

const sendResponse = (
  res: Response, 
  statusCode: number, 
  data?: any, 
  message?: string,
  meta?: any
) => {
  const response: any = {
    success: statusCode < 400,
    timestamp: new Date().toISOString()
  };

  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  if (meta) response.meta = meta;

  return res.status(statusCode).json(response);
};

const handleError = (res: Response, error: any, defaultMessage: string = 'Erro interno do servidor') => {
  console.error('FuelPricesController Error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  const errorMappings: Record<string, { status: number; message: string }> = {
    'UNAUTHORIZED': { status: 401, message: 'Usuário não autenticado' },
    'VALIDATION_ERROR': { status: 400, message: 'Dados inválidos' },
    'NOT_FOUND': { status: 404, message: 'Dados não encontrados' },
    'RATE_LIMITED': { status: 429, message: 'Muitas requisições, tente novamente em breve' },
    'EXTERNAL_API_ERROR': { status: 502, message: 'Erro no serviço de preços externo' },
    'CACHE_ERROR': { status: 503, message: 'Serviço temporariamente indisponível' }
  };

  const errorInfo = errorMappings[error.message] || { 
    status: 500, 
    message: defaultMessage 
  };

  return sendResponse(res, errorInfo.status, null, errorInfo.message);
};

const validateRequestData = (schema: z.ZodSchema, data: any) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      const validationError = new Error('VALIDATION_ERROR');
      validationError.message = `Dados inválidos: ${errorMessage}`;
      throw validationError;
    }
    throw error;
  }
};

// ========== CONTROLADOR PRINCIPAL ==========

/**
 * Obtém preços de combustível por região
 * @route GET /api/v1/fuel-prices
 * @query {string} [estado] - Código do estado (2 letras)
 * @query {string} [cidade] - Nome da cidade
 * @query {string} [tipoCombustivel] - Tipo de combustível
 * @query {number} [limite=20] - Número máximo de resultados
 */
export const getPrices = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  const filters = validateRequestData(fuelPricesQuerySchema, req.query) as FuelPriceFilters;
  
  // Gerar chave de cache baseada nos filtros
  const cacheKey = `fuel-prices:${JSON.stringify(filters)}`;
  
  try {
    // Tentar buscar do cache primeiro
    let prices = await cacheService.get(cacheKey);
    
    if (!prices) {
      // Buscar do serviço se não estiver em cache
      prices = await FuelPricesService.getPricesByRegion(filters);
      
      // Cachear por 5 minutos
      await cacheService.set(cacheKey, prices, 300);
    }

    const meta = {
      total_results: prices.length,
      cached: !!await cacheService.get(cacheKey),
      filters_applied: Object.keys(filters).filter(key => filters[key as keyof FuelPriceFilters] !== undefined),
      ultima_atualizacao: new Date().toISOString()
    };

    return sendResponse(
      res, 
      200, 
      {
        precos: prices,
        filtros: filters
      },
      'Preços recuperados com sucesso',
      meta
    );

  } catch (error: any) {
    return handleError(res, error, 'Erro ao buscar preços de combustível');
  }
});

/**
 * Obtém histórico de preços de combustível
 * @route GET /api/v1/fuel-prices/history
 * @query {string} estado - Código do estado (obrigatório)
 * @query {string} cidade - Nome da cidade (obrigatório)
 * @query {string} tipoCombustivel - Tipo de combustível (obrigatório)
 * @query {number} [periodo_dias=30] - Período em dias
 */
export const getPriceHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  const params = validateRequestData(priceHistoryQuerySchema, req.query) as PriceHistoryParams;
  
  const cacheKey = `price-history:${JSON.stringify(params)}`;
  
  try {
    let historyData = await cacheService.get(cacheKey) as any;
    
    if (!historyData) {
      historyData = await FuelPricesService.getPriceHistory(params);
      await cacheService.set(cacheKey, historyData, 600); // Cache por 10 minutos
    }

    // Calcular estatísticas otimizadas
    const statistics = FuelPricesService.calculatePriceStatistics(historyData.historico);

    return sendResponse(
      res,
      200,
      {
        historico: historyData.historico,
        parametros: params,
        estatisticas: statistics,
        tendencia: historyData.tendencia
      },
      'Histórico recuperado com sucesso',
      {
        periodo_analisado: `${params.periodo_dias} dias`,
        pontos_dados: historyData.historico.length
      }
    );

  } catch (error: any) {
    return handleError(res, error, 'Erro ao buscar histórico de preços');
  }
});

/**
 * Obtém comparativo de preços entre regiões
 * @route GET /api/v1/fuel-prices/regional-comparison
 * @query {string} [tipoCombustivel=Gasolina] - Tipo de combustível
 * @query {string} [estados] - Estados separados por vírgula
 * @query {boolean} [incluir_tendencia=false] - Incluir análise de tendência
 */
export const getRegionalComparison = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  const params = validateRequestData(regionalComparisonSchema, req.query) as RegionalComparisonParams;
  
  const cacheKey = `regional-comparison:${JSON.stringify(params)}`;
  
  try {
    let comparisonData = await cacheService.get(cacheKey) as any;
    
    if (!comparisonData) {
      comparisonData = await FuelPricesService.getRegionalComparison(params);
      await cacheService.set(cacheKey, comparisonData, 900); // Cache por 15 minutos
    }

    // Análise de ranking - usando dados já calculados no comparativo
    const rankings = comparisonData.comparativo || [];

    return sendResponse(
      res,
      200,
      {
        tipoCombustivel: params.tipoCombustivel,
        comparativo: comparisonData.comparativo,
        estatisticas: comparisonData.estatisticas,
        rankings,
        ...(params.incluirTendencia && { tendencias: comparisonData.tendencias })
      },
      'Comparativo regional gerado com sucesso',
      {
        estados_analisados: params.estados.length,
        incluiu_tendencia: params.incluirTendencia
      }
    );

  } catch (error: any) {
    return handleError(res, error, 'Erro ao gerar comparativo regional');
  }
});

/**
 * Registra um preço de combustível observado pelo usuário
 * @route POST /api/v1/fuel-prices/report
 * @body {object} - Dados do preço observado
 */
export const reportPrice = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  const priceData = validateRequestData(reportPriceSchema, req.body);
  
  try {
    // Verificar rate limiting por usuário
    const rateLimitKey = `price-report:${userId}`;
    const recentReports = (await cacheService.get(rateLimitKey) as number) || 0;
    
    if (recentReports >= 10) { // Máximo 10 reports por hora
      throw new Error('RATE_LIMITED');
    }

    // Validar se o preço é razoável comparado aos dados existentes
    const isReasonablePrice = await FuelPricesService.validateReportedPrice(priceData);
    
    if (!isReasonablePrice.valid) {
      return sendResponse(
        res,
        422,
        {
          price_data: priceData,
          validation_warnings: isReasonablePrice.warnings
        },
        'Preço reportado parece incomum. Confirme os dados.',
        {
          requires_confirmation: true
        }
      );
    }

    // Salvar o report
    const reportedPrice = await FuelPricesService.savePriceReport(userId, priceData);
    
    // Atualizar rate limiting
    await cacheService.set(rateLimitKey, recentReports + 1, 3600);
    
    // Invalidar caches relacionados
    await cacheService.delPattern(`fuel-prices:*${priceData.estado}*`);

    return sendResponse(
      res,
      201,
      reportedPrice,
      'Preço reportado com sucesso! Obrigado por contribuir com a comunidade.',
      {
        status_validacao: reportedPrice.status,
        contribuicoes_usuario: await FuelPricesService.getUserContributionCount(userId)
      }
    );

  } catch (error: any) {
    return handleError(res, error, 'Erro ao reportar preço');
  }
});

/**
 * Obtém estatísticas de preços agregadas
 * @route GET /api/v1/fuel-prices/stats
 * @query {string} [periodo=week] - Período para estatísticas
 * @query {string} [tipoCombustivel] - Filtrar por tipo
 */
export const getPriceStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  const statsQuery = z.object({
    periodo: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('week'),
    tipoCombustivel: z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV']).optional(),
    incluir_projecoes: z.coerce.boolean().default(false)
  }).parse(req.query);

  const cacheKey = `price-stats:${JSON.stringify(statsQuery)}`;

  try {
    let stats = await cacheService.get(cacheKey);

    if (!stats) {
      stats = await FuelPricesService.getPriceStatistics(statsQuery);
      await cacheService.set(cacheKey, stats, 1800); // Cache por 30 minutos
    }

    return sendResponse(
      res,
      200,
      stats,
      'Estatísticas de preços recuperadas com sucesso',
      {
        periodo_analisado: statsQuery.periodo,
        data_calculo: new Date().toISOString()
      }
    );

  } catch (error: any) {
    return handleError(res, error, 'Erro ao gerar estatísticas');
  }
});

/**
 * Busca postos próximos com preços
 * @route GET /api/v1/fuel-prices/nearby
 * @query {number} latitude - Latitude
 * @query {number} longitude - Longitude
 * @query {number} [raio=10] - Raio em km
 */
export const getNearbyPrices = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  const locationQuery = z.object({
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    raio: z.coerce.number().min(1).max(50).default(10),
    tipoCombustivel: z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV']).optional()
  }).parse(req.query);

  try {
    const nearbyPrices = await FuelPricesService.getNearbyPrices(locationQuery);

    return sendResponse(
      res,
      200,
      {
        postos: nearbyPrices,
        centro_busca: {
          latitude: locationQuery.latitude,
          longitude: locationQuery.longitude
        },
        raio_km: locationQuery.raio
      },
      'Postos próximos encontrados',
      {
        total_postos: nearbyPrices.length
      }
    );

  } catch (error: any) {
    return handleError(res, error, 'Erro ao buscar postos próximos');
  }
});
