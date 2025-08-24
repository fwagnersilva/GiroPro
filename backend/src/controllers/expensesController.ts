import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index';
import { ExpenseService } from '../services/expenseService';
import { z } from 'zod';

// Schemas de validação com Zod
const createExpenseSchema = z.object({
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().min(1, 'Descrição é obrigatória').max(255, 'Descrição muito longa'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  vehicleId: z.string().uuid('ID do veículo inválido').optional(),
  date: z.string().datetime().or(z.date()).optional(),
  // Adicione outros campos conforme necessário
});

const updateExpenseSchema = createExpenseSchema.partial();

const idParamSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido')
});

// Tipos para melhor type safety
type CreateExpenseRequest = z.infer<typeof createExpenseSchema>;
type UpdateExpenseRequest = z.infer<typeof updateExpenseSchema>;


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
  console.error('ExpensesController Error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  // Mapeamento de erros conhecidos
  const errorMappings: Record<string, { status: number; message: string }> = {
    'UNAUTHORIZED': { status: 401, message: 'Usuário não autenticado' },
    'EXPENSE_NOT_FOUND': { status: 404, message: 'Despesa não encontrada' },
    'PERMISSION_DENIED': { status: 403, message: 'Sem permissão para esta operação' },
    'VALIDATION_ERROR': { status: 400, message: 'Dados inválidos' },
    'DUPLICATE_ENTRY': { status: 409, message: 'Despesa já existe' }
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
 * Cria uma nova despesa
 * @route POST /api/v1/expenses
 */
export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  // Validar dados de entrada
  const validatedData = validateRequestData(createExpenseSchema, req.body);
  
  try {
    // Mapear os dados do schema para o formato esperado pelo service
    const expenseData: CreateExpenseRequest = {
      vehicleId: validatedData.vehicleId || '',
      data: validatedData.date ? new Date(validatedData.date).toISOString() : new Date().toISOString(),
      valor: validatedData.amount,
      descricao: validatedData.description,
      categoria: validatedData.category
    };
    
    const newExpense = await ExpenseService.createExpense(userId, expenseData);
    
    return sendResponse(res, 201, newExpense, 'Despesa criada com sucesso');
  } catch (error: any) {
    return handleError(res, error, 'Erro ao criar despesa');
  }
});

/**
 * Lista todas as despesas do usuário
 * @route GET /api/v1/expenses
 */
export const getExpenses = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  // Parâmetros de query opcionais para filtros
  const {
    page = '1',
    limit = '10',
    category,
    vehicleId,
    startDate,
    endDate
  } = req.query;

  const filters = {
    page: parseInt(page as string, 10),
    limit: Math.min(parseInt(limit as string, 10), 100), // Máximo 100 registros
    category: category as string,
    vehicleId: vehicleId as string,
    startDate: startDate as string,
    endDate: endDate as string
  };

  try {
    const expenses = await ExpenseService.getExpensesByUserId(userId);
    
    return sendResponse(res, 200, expenses, 'Despesas recuperadas com sucesso');
  } catch (error: any) {
    return handleError(res, error, 'Erro ao recuperar despesas');
  }
});

/**
 * Busca uma despesa específica por ID
 * @route GET /api/v1/expenses/:id
 */
export const getExpenseById = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  // Validar parâmetro ID
  const { id } = validateRequestData(idParamSchema, req.params);
  
  try {
    const expense = await ExpenseService.getExpenseById(id, userId);
    
    if (!expense) {
      throw new Error('EXPENSE_NOT_FOUND');
    }
    
    return sendResponse(res, 200, expense, 'Despesa encontrada');
  } catch (error: any) {
    return handleError(res, error, 'Erro ao buscar despesa');
  }
});

/**
 * Atualiza uma despesa existente
 * @route PUT /api/v1/expenses/:id
 */
export const updateExpense = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  // Validar parâmetro ID e dados de atualização
  const { id } = validateRequestData(idParamSchema, req.params);
  const validatedData = validateRequestData(updateExpenseSchema, req.body);
  
  // Verificar se há dados para atualizar
  if (Object.keys(validatedData).length === 0) {
    return sendResponse(res, 400, null, 'Nenhum dado válido fornecido para atualização');
  }
  
  try {
    const updatedExpense = await ExpenseService.updateExpense(id, userId, validatedData as UpdateExpenseRequest);
    
    if (!updatedExpense) {
      throw new Error('EXPENSE_NOT_FOUND');
    }
    
    return sendResponse(res, 200, updatedExpense, 'Despesa atualizada com sucesso');
  } catch (error: any) {
    return handleError(res, error, 'Erro ao atualizar despesa');
  }
});

/**
 * Remove uma despesa
 * @route DELETE /api/v1/expenses/:id
 */
export const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  // Validar parâmetro ID
  const { id } = validateRequestData(idParamSchema, req.params);
  
  try {
    const deleted = await ExpenseService.deleteExpense(id, userId);
    
    if (!deleted) {
      throw new Error('EXPENSE_NOT_FOUND');
    }
    
    return sendResponse(res, 200, null, 'Despesa removida com sucesso');
  } catch (error: any) {
    return handleError(res, error, 'Erro ao remover despesa');
  }
});

/**
 * Busca estatísticas de despesas do usuário
 * @route GET /api/v1/expenses/stats
 */
export const getExpenseStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  const { period = 'month', vehicleId } = req.query;
  
  try {
    const stats = await ExpenseService.getExpenseStats(userId);
    
    return sendResponse(res, 200, stats, 'Estatísticas recuperadas com sucesso');
  } catch (error: any) {
    return handleError(res, error, 'Erro ao recuperar estatísticas');
  }
});

/**
 * Busca despesas por categoria
 * @route GET /api/v1/expenses/by-category
 */
export const getExpensesByCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = extractUserId(req);
  
  const { startDate, endDate } = req.query;
  
  try {
    // Para simplificar, vamos buscar todas as despesas por categoria 'geral'
    const expensesByCategory = await ExpenseService.getExpensesByCategory(userId, 'geral');
    
    return sendResponse(res, 200, expensesByCategory, 'Despesas por categoria recuperadas');
  } catch (error: any) {
    return handleError(res, error, 'Erro ao recuperar despesas por categoria');
  }
});

// Middleware de validação que pode ser usado nas rotas
export const validateCreateExpense = (req: Request, res: Response, next: NextFunction) => {
  try {
    validateRequestData(createExpenseSchema, req.body);
    next();
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const validateUpdateExpense = (req: Request, res: Response, next: NextFunction) => {
  try {
    validateRequestData(updateExpenseSchema, req.body);
    next();
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const validateExpenseId = (req: Request, res: Response, next: NextFunction) => {
  try {
    validateRequestData(idParamSchema, req.params);
    next();
  } catch (error: any) {
    return handleError(res, error);
  }
};
