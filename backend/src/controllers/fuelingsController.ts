import { Response, Request, NextFunction } from 'express';
import { AuthenticatedRequest, CreateFuelingRequest, UpdateFuelingRequest } from '../types/index';
import { FuelingService } from '../services/fuelingService';
import { z } from 'zod';

// Schemas de validação com Zod
const createFuelingSchema = z.object({
  id_veiculo: z.string().uuid('ID do veículo inválido').optional(),
  data_abastecimento: z.string().datetime('Data de abastecimento inválida').or(z.date()).optional(),
  tipo_combustivel: z.enum(['Gasolina', 'Etanol', 'Diesel', 'GNV', 'Flex'], { message: 'Tipo de combustível inválido' }),
  quantidade_litros: z.number().positive('Quantidade de litros deve ser positiva'),
  valor_litro: z.number().positive('Valor por litro deve ser positivo'),
  km_atual: z.number().int().positive('KM atual deve ser um número inteiro positivo').optional(),
  nome_posto: z.string().min(1, 'Nome do posto é obrigatório').max(255, 'Nome do posto muito longo').optional(),
});

const updateFuelingSchema = createFuelingSchema.partial();

const idParamSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido')
});

// Middleware para extrair e validar userId
const extractUserId = (req: Request): string => {
  const userId = (req as AuthenticatedRequest).user?.id;
  
  if (!userId) {
    throw new Error('UNAUTHORIZED');
  }
  
  return userId;
};

// Wrapper para tratamento consistente de erros
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Helper para respostas padronizadas
const sendResponse = (res: Response, statusCode: number, data?: any, message?: string) => {
  const response: any = {
    success: statusCode < 400,
    timestamp: new Date().toISOString()
  };

  if (message) response.message = message;
  if (data !== undefined) response.data = data;

  return res.status(statusCode).json(response);
};

// Helper para tratamento de erros
const handleError = (res: Response, error: any, defaultMessage: string = 'Erro interno do servidor') => {
  console.error('FuelingsController Error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  // Mapeamento de erros conhecidos
  const errorMappings: Record<string, { status: number; message: string }> = {
    'UNAUTHORIZED': { status: 401, message: 'Usuário não autenticado' },
    'FUELING_NOT_FOUND': { status: 404, message: 'Abastecimento não encontrado' },
    'PERMISSION_DENIED': { status: 403, message: 'Sem permissão para esta operação' },
    'VALIDATION_ERROR': { status: 400, message: 'Dados inválidos' },
    'DUPLICATE_ENTRY': { status: 409, message: 'Abastecimento já existe' }
  };

  const errorInfo = errorMappings[error.message] || { 
    status: 500, 
    message: defaultMessage 
  };

  return sendResponse(res, errorInfo.status, null, errorInfo.message);
};

// Validador de parâmetros de entrada
const validateRequestData = (schema: z.ZodSchema, data: any) => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      const validationError = new Error('VALIDATION_ERROR');
      validationError.message = `Dados inválidos: ${errorMessage}`;
      throw validationError;
    }
    throw error;
  }
};

/**
 * Cria um novo abastecimento
 * @route POST /api/v1/fuelings
 */
export const createFueling = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  // Validar dados de entrada
  const validatedData = validateRequestData(createFuelingSchema, req.body);
  
  try {
    const newFueling = await FuelingService.createFueling(userId, validatedData as CreateFuelingRequest);
    
    return sendResponse(res, 201, newFueling, 'Abastecimento criado com sucesso');
  } catch (error: any) {
    return handleError(res, error, 'Erro ao criar abastecimento');
  }
});

/**
 * Lista todos os abastecimentos do usuário
 * @route GET /api/v1/fuelings
 */
export const getFuelings = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  // Parâmetros de query opcionais para filtros
  const {
    page = '1',
    limit = '10',
    tipoCombustivel,
    vehicleId,
    startDate,
    endDate
  } = req.query;

  const filters = {
    page: parseInt(page as string, 10),
    limit: Math.min(parseInt(limit as string, 10), 100), // Máximo 100 registros
    tipoCombustivel: tipoCombustivel as string,
    vehicleId: vehicleId as string,
    startDate: startDate as string,
    endDate: endDate as string
  };

  try {
    const fuelings = await FuelingService.getFuelingsByUserId(userId);
    
    return sendResponse(res, 200, fuelings, 'Abastecimentos recuperados com sucesso');
  } catch (error: any) {
    return handleError(res, error, 'Erro ao recuperar abastecimentos');
  }
});

/**
 * Busca um abastecimento específico por ID
 * @route GET /api/v1/fuelings/:id
 */
export const getFuelingById = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  // Validar parâmetro ID
  const { id } = validateRequestData(idParamSchema, req.params);
  
  try {
    const fueling = await FuelingService.getFuelingById(id, userId);
    
    if (!fueling) {
      throw new Error('FUELING_NOT_FOUND');
    }
    
    return sendResponse(res, 200, fueling, 'Abastecimento encontrado');
  } catch (error: any) {
    return handleError(res, error, 'Erro ao buscar abastecimento');
  }
});

/**
 * Atualiza um abastecimento existente
 * @route PUT /api/v1/fuelings/:id
 */
export const updateFueling = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  // Validar parâmetro ID e dados de atualização
  const { id } = validateRequestData(idParamSchema, req.params);
  const validatedData = validateRequestData(updateFuelingSchema, req.body);
  
  // Verificar se há dados para atualizar
  if (Object.keys(validatedData).length === 0) {
    return sendResponse(res, 400, null, 'Nenhum dado válido fornecido para atualização');
  }
  
  try {
    const updatedFueling = await FuelingService.updateFueling(id, userId, validatedData as UpdateFuelingRequest);
    
    if (!updatedFueling) {
      throw new Error('FUELING_NOT_FOUND');
    }
    
    return sendResponse(res, 200, updatedFueling, 'Abastecimento atualizado com sucesso');
  } catch (error: any) {
    return handleError(res, error, 'Erro ao atualizar abastecimento');
  }
});

/**
 * Remove um abastecimento
 * @route DELETE /api/v1/fuelings/:id
 */
export const deleteFueling = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  // Validar parâmetro ID
  const { id } = validateRequestData(idParamSchema, req.params);
  
  try {
    const deleted = await FuelingService.deleteFueling(id, userId);
    
    if (!deleted) {
      throw new Error('FUELING_NOT_FOUND');
    }
    
    return sendResponse(res, 200, null, 'Abastecimento removido com sucesso');
  } catch (error: any) {
    return handleError(res, error, 'Erro ao remover abastecimento');
  }
});


