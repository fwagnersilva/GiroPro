import { Request, Response } from 'express';
import { JourneyService } from '../services/journeyService';
import { CreateJourneyRequest, UpdateJourneyRequest, JourneyFilters } from '../types';
import logger from "../utils/logger";
import { Cache } from '../utils/cache';
import { z } from 'zod';
import { performance } from 'perf_hooks';



// ===============================
// TIPOS E INTERFACES OTIMIZADAS
// ===============================

interface ControllerResult<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    pagination?: PaginationMeta;
    performance?: {
      queryTime: number;
      cacheHit?: boolean;
    };
    filters?: Record<string, any>;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}


// ===============================
// SCHEMAS DE VALIDAÇÃO
// ===============================

const createJourneySchema = z.object({
  idVeiculo: z.string().uuid('ID do veículo deve ser um UUID válido'),
  dataInicio: z.string().datetime('Data de início inválida'),
  kmInicio: z.number().int().min(0, 'Quilometragem inicial deve ser maior ou igual a 0'),
  dataFim: z.string().datetime('Data de fim inválida').optional(),
  kmFim: z.number().int().min(0, 'Quilometragem final deve ser maior ou igual a 0').optional(),
  ganhoBruto: z.number().int().min(0, 'Ganho bruto deve ser maior ou igual a 0').optional(),
  kmTotal: z.number().int().min(0, 'KM total deve ser maior ou igual a 0').optional(),
  tempoTotal: z.number().int().min(0, 'Tempo total deve ser maior ou igual a 0').optional(),
  observacoes: z.string().max(500, 'Observações muito longas').optional(),
});

const updateJourneySchema = z.object({
  dataFim: z.string().datetime('Data de fim inválida').optional(),
  kmFim: z.number().int().min(0, 'Quilometragem final deve ser maior ou igual a 0').optional(),
  ganhoBruto: z.number().int().min(0, 'Ganho bruto deve ser maior ou igual a 0').optional(),
  observacoes: z.string().max(500, 'Observações muito longas').optional(),
});

const querySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).pipe(z.number().min(1)),
  limit: z.string().transform(val => Math.min(parseInt(val) || 10, 100)).pipe(z.number().min(1).max(100)),
  sortBy: z.enum(['dataInicio', 'dataFim', 'kmTotal', 'ganhoBruto', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum(['em_andamento', 'concluida', 'todas']).default('todas'),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  veiculoId: z.string().uuid().optional(),
});

const periodoValido = z.enum(['semana', 'mes', 'trimestre', 'ano']).optional();

// ===============================
// CACHE CONFIGURATION
// ===============================

const cache = new Cache({
  ttl: 5 * 60 * 1000, // 5 minutos
  maxSize: 1000,
});

// ===============================
// HELPER FUNCTIONS
// ===============================

const extractUserId = (req: Request): string | null => {
  return (req as any).user?.id || null;
};

const generateCacheKey = (userId: string, operation: string, params?: Record<string, any>): string => {
  const paramString = params ? JSON.stringify(params) : '';
  return `journey:${userId}:${operation}:${Buffer.from(paramString).toString('base64')}`;
};

const createSuccessResponse = <T>(
  data: T, 
  message?: string, 
  meta?: ControllerResult['meta']
): ControllerResult<T> => ({
  success: true,
  data,
  message,
  meta,
});

const createErrorResponse = (
  error: string, 
  statusCode: number = 400,
  details?: any
): ControllerResult => ({
  success: false,
  error,
  meta: {
    performance: {
      queryTime: 0,
      cacheHit: false,
    },
  },
});

const logRequest = (operation: string, userId: string, params?: any) => {
  logger.info(`Journey ${operation}`, {
    userId,
    operation,
    params,
    timestamp: new Date().toISOString(),
  });
};

const logPerformance = (operation: string, queryTime: number, cacheHit: boolean = false) => {
  logger.debug(`Journey ${operation} performance`, {
    queryTime: `${queryTime.toFixed(2)}ms`,
    cacheHit,
  });
};

// ===============================
// CONTROLLER FUNCTIONS OTIMIZADAS
// ===============================

export const createJourney = async (req: Request, res: Response) => {
  const startTime = performance.now();
  
  try {
    // 1. Validação de autenticação
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json(createErrorResponse('Usuário não autenticado', 401));
    }

    // 2. Validação de entrada
    const validationResult = createJourneySchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join(', ');
      
      logger.warn('Validation failed for createJourney', {
        userId,
        errors: validationResult.error.issues,
      });
      
      return res.status(400).json(createErrorResponse(`Dados inválidos: ${errors}`));
    }

    const journeyData = validationResult.data as CreateJourneyRequest;

    // 3. Log da operação
    logRequest('create', userId, journeyData);

    // 4. Chamar service com tratamento de erro
    const newJourney = await JourneyService.createJourney(userId, journeyData);
    
    if (!newJourney) {
      return res.status(400).json(createErrorResponse('Falha ao criar jornada'));
    }

    // 5. Invalidar cache relacionado
    cache.invalidatePattern(`journey:${userId}:`);

    const queryTime = performance.now() - startTime;
    logPerformance('create', queryTime);

    // 6. Resposta de sucesso
    return res.status(201).json(createSuccessResponse(
      newJourney,
      'Jornada criada com sucesso',
      {
        performance: { queryTime, cacheHit: false }
      }
    ));

  } catch (error: any) {
    const queryTime = performance.now() - startTime;
    
    logger.error('Error in createJourney', {
      error: error.message,
      stack: error.stack,
      userId: extractUserId(req),
      body: req.body,
    });

    return res.status(500).json(createErrorResponse(
      'Erro interno do servidor. Tente novamente.'
    ));
  }
};

export const getJourneys = async (req: Request, res: Response) => {
  const startTime = performance.now();
  
  try {
    // 1. Validação de autenticação
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json(createErrorResponse('Usuário não autenticado', 401));
    }

    // 2. Validação e sanitização de query parameters
    const queryValidation = querySchema.safeParse(req.query);
    if (!queryValidation.success) {
      return res.status(400).json(createErrorResponse('Parâmetros de consulta inválidos', 400, queryValidation.error.errors));
    }

    const queryParams = queryValidation.data;

    // 3. Verificar cache primeiro
    const cacheKey = generateCacheKey(userId, 'list', queryParams);
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      const queryTime = performance.now() - startTime;
      logPerformance('list', queryTime, true);
      
      return res.status(200).json({
        ...cachedResult,
        meta: {
          ...cachedResult.meta,
          performance: { queryTime, cacheHit: true }
        }
      });
    }

    // 4. Log da operação
    logRequest('list', userId, queryParams);

    // 5. Buscar dados no service
    const result = await JourneyService.getJourneysByUserId(userId, {
      page: queryParams.page,
      limit: queryParams.limit,
      sortBy: queryParams.sortBy,
      sortOrder: queryParams.sortOrder,
      filters: {
        status: queryParams.status,
        dataInicio: queryParams.dataInicio,
        dataFim: queryParams.dataFim,
        veiculoId: queryParams.veiculoId,
      }
    });

    if (!result.success) {
      return res.status(400).json(createErrorResponse(result.error || 'Erro ao buscar jornadas'));
    }

    const queryTime = performance.now() - startTime;
    logPerformance('list', queryTime);

    // 6. Preparar resposta
    const response = createSuccessResponse(
      result.data,
      'Jornadas recuperadas com sucesso',
      {
        pagination: result.meta?.pagination,
        filters: queryParams,
        performance: { queryTime, cacheHit: false }
      }
    );

    // 7. Salvar no cache
    cache.set(cacheKey, response);

    return res.status(200).json(response);

  } catch (error: any) {
    const queryTime = performance.now() - startTime;
    
    logger.error('Error in getJourneys', {
      error: error.message,
      stack: error.stack,
      userId: extractUserId(req),
      query: req.query,
    });

    return res.status(500).json(createErrorResponse(
      'Erro interno do servidor. Tente novamente.'
    ));
  }
};

export const getJourneyById = async (req: Request, res: Response) => {
  const startTime = performance.now();
  
  try {
    // 1. Validação de autenticação
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json(createErrorResponse('Usuário não autenticado', 401));
    }

    // 2. Validação do ID
    const { id } = req.params;
    if (!id || !z.string().uuid().safeParse(id).success) {
      return res.status(400).json(createErrorResponse('ID da jornada inválido'));
    }

    // 3. Verificar cache
    const cacheKey = generateCacheKey(userId, 'detail', { id });
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      const queryTime = performance.now() - startTime;
      logPerformance('detail', queryTime, true);
      
      return res.status(200).json({
        ...cachedResult,
        meta: {
          ...cachedResult.meta,
          performance: { queryTime, cacheHit: true }
        }
      });
    }

    // 4. Log da operação
    logRequest('detail', userId, { id });

    // 5. Buscar jornada
    const journey = await JourneyService.getJourneyById(id, userId);
    
    if (!journey) {
      return res.status(404).json(createErrorResponse('Jornada não encontrada', 404));
    }

    const queryTime = performance.now() - startTime;
    logPerformance('detail', queryTime);

    // 6. Preparar resposta
    const response = createSuccessResponse(
      journey,
      'Jornada recuperada com sucesso',
      {
        performance: { queryTime, cacheHit: false }
      }
    );

    // 7. Salvar no cache
    cache.set(cacheKey, response);

    return res.status(200).json(response);

  } catch (error: any) {
    const queryTime = performance.now() - startTime;
    
    logger.error('Error in getJourneyById', {
      error: error.message,
      stack: error.stack,
      userId: extractUserId(req),
      journeyId: req.params.id,
    });

    return res.status(500).json(createErrorResponse(
      'Erro interno do servidor. Tente novamente.'
    ));
  }
};

export const updateJourney = async (req: Request, res: Response) => {
  const startTime = performance.now();
  
  try {
    // 1. Validação de autenticação
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json(createErrorResponse('Usuário não autenticado', 401));
    }

    // 2. Validação do ID
    const { id } = req.params;
    if (!id || !z.string().uuid().safeParse(id).success) {
      return res.status(400).json(createErrorResponse('ID da jornada inválido'));
    }

    // 3. Validação dos dados de entrada
    const validationResult = updateJourneySchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join(', ');
      
      return res.status(400).json(createErrorResponse(`Dados inválidos: ${errors}`));
    }

    const journeyData: UpdateJourneyRequest = validationResult.data;

    // 4. Validação de lógica de negócio
    if (journeyData.kmFim && journeyData.dataFim) {
      // Verificar se km final é maior que inicial (isso deveria estar no service)
      const currentJourney = await JourneyService.getJourneyById(id, userId);
      if (currentJourney && journeyData.kmFim <= currentJourney.kmInicio) {
        return res.status(400).json(createErrorResponse(
          'Quilometragem final deve ser maior que a inicial'
        ));
      }
    }

    // 5. Log da operação
    logRequest('update', userId, { id, ...journeyData });

    // 6. Atualizar jornada
    const updatedJourney = await JourneyService.updateJourney(id, userId, journeyData);
    
    if (!updatedJourney) {
      return res.status(404).json(createErrorResponse(
        'Jornada não encontrada ou você não tem permissão para atualizá-la',
        404
      ));
    }

    // 7. Invalidar cache
    cache.invalidatePattern(`journey:${userId}:`);

    const queryTime = performance.now() - startTime;
    logPerformance('update', queryTime);

    // 8. Resposta de sucesso
    return res.status(200).json(createSuccessResponse(
      updatedJourney,
      'Jornada atualizada com sucesso',
      {
        performance: { queryTime, cacheHit: false }
      }
    ));

  } catch (error: any) {
    const queryTime = performance.now() - startTime;
    
    logger.error('Error in updateJourney', {
      error: error.message,
      stack: error.stack,
      userId: extractUserId(req),
      journeyId: req.params.id,
      body: req.body,
    });

    return res.status(500).json(createErrorResponse(
      'Erro interno do servidor. Tente novamente.'
    ));
  }
};

export const deleteJourney = async (req: Request, res: Response) => {
  const startTime = performance.now();
  
  try {
    // 1. Validação de autenticação
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json(createErrorResponse('Usuário não autenticado', 401));
    }

    // 2. Validação do ID
    const { id } = req.params;
    if (!id || !z.string().uuid().safeParse(id).success) {
      return res.status(400).json(createErrorResponse('ID da jornada inválido'));
    }

    // 3. Log da operação
    logRequest('delete', userId, { id });

    // 4. Verificar se existe e pertence ao usuário antes de deletar
    const existingJourney = await JourneyService.getJourneyById(id, userId);
    if (!existingJourney) {
      return res.status(404).json(createErrorResponse(
        'Jornada não encontrada ou você não tem permissão para excluí-la',
        404
      ));
    }

    // 5. Deletar jornada (soft delete)
    const deleted = await JourneyService.deleteJourney(id, userId);
    
    if (!deleted) {
      return res.status(400).json(createErrorResponse('Falha ao excluir jornada'));
    }

    // 6. Invalidar cache
    cache.invalidatePattern(`journey:${userId}:`);

    const queryTime = performance.now() - startTime;
    logPerformance('delete', queryTime);

    // 7. Log de auditoria
    logger.info('Journey deleted', {
      userId,
      journeyId: id,
      deletedAt: new Date().toISOString(),
    });

    // 8. Resposta de sucesso (204 No Content)
    return res.status(204).send();

  } catch (error: any) {
    const queryTime = performance.now() - startTime;
    
    logger.error('Error in deleteJourney', {
      error: error.message,
      stack: error.stack,
      userId: extractUserId(req),
      journeyId: req.params.id,
    });

    return res.status(500).json(createErrorResponse(
      'Erro interno do servidor. Tente novamente.'
    ));
  }
};

// ===============================
// ENDPOINTS ADICIONAIS OTIMIZADOS
// ===============================

export const getJourneyStats = async (req: Request, res: Response) => {
  const startTime = performance.now();
  
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json(createErrorResponse('Usuário não autenticado', 401));
    }

    // Validar período (opcional)
    const { periodo } = req.query;
    const validatedPeriodo = periodoValido.safeParse(periodo);
    
    if (periodo && !validatedPeriodo.success) {
      return res.status(400).json(createErrorResponse('Período inválido', 400, validatedPeriodo.error.errors));
    }

    // Cache para estatísticas
    const cacheKey = generateCacheKey(userId, 'stats', { periodo: validatedPeriodo.data });
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      const queryTime = performance.now() - startTime;
      return res.status(200).json({
        ...cachedResult,
        meta: {
          ...cachedResult.meta,
          performance: { queryTime, cacheHit: true }
        }
      });
    }

    // Buscar estatísticas
    const stats = await JourneyService.getJourneyStatistics(userId, validatedPeriodo.data);

    const queryTime = performance.now() - startTime;
    logPerformance('stats', queryTime);

    // 6. Preparar resposta
    const response = createSuccessResponse(
      stats,
      'Estatísticas de jornada recuperadas com sucesso',
      {
        performance: { queryTime, cacheHit: false },
        filters: { periodo: validatedPeriodo.data || 'all' }
      }
    );

    // 7. Salvar no cache
    cache.set(cacheKey, response);

    return res.status(200).json(response);

  } catch (error: any) {
    const queryTime = performance.now() - startTime;
    
    logger.error('Error in getJourneyStats', {
      error: error.message,
      stack: error.stack,
      userId: extractUserId(req),
      query: req.query,
    });

    return res.status(500).json(createErrorResponse(
      'Erro interno do servidor. Tente novamente.'
    ));
  }
};

