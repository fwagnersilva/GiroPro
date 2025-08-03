import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

export class ResponseHelper {
  /**
   * Resposta de sucesso
   */
  static success<T>(res: Response, data: T, statusCode: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Resposta de sucesso com paginação
   */
  static successWithPagination<T>(
    res: Response,
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
    },
    statusCode: number = 200
  ): Response {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    
    const response: ApiResponse<T[]> = {
      success: true,
      data,
      pagination: {
        ...pagination,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Resposta de erro
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any
  ): Response {
    const response: ApiResponse = {
      success: false,
      error: {
        message,
        code,
        details
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Resposta de erro de validação
   */
  static validationError(res: Response, details: any[]): Response {
    return this.error(
      res,
      'Dados de entrada inválidos',
      400,
      'VALIDATION_ERROR',
      details
    );
  }

  /**
   * Resposta de erro de autenticação
   */
  static unauthorized(res: Response, message: string = 'Não autorizado'): Response {
    return this.error(res, message, 401, 'UNAUTHORIZED');
  }

  /**
   * Resposta de erro de autorização
   */
  static forbidden(res: Response, message: string = 'Acesso negado'): Response {
    return this.error(res, message, 403, 'FORBIDDEN');
  }

  /**
   * Resposta de recurso não encontrado
   */
  static notFound(res: Response, message: string = 'Recurso não encontrado'): Response {
    return this.error(res, message, 404, 'NOT_FOUND');
  }

  /**
   * Resposta de conflito
   */
  static conflict(res: Response, message: string = 'Recurso já existe'): Response {
    return this.error(res, message, 409, 'CONFLICT');
  }

  /**
   * Resposta de erro interno do servidor
   */
  static internalError(res: Response, message: string = 'Erro interno do servidor'): Response {
    return this.error(res, message, 500, 'INTERNAL_ERROR');
  }

  /**
   * Resposta de serviço indisponível
   */
  static serviceUnavailable(res: Response, message: string = 'Serviço temporariamente indisponível'): Response {
    return this.error(res, message, 503, 'SERVICE_UNAVAILABLE');
  }

  /**
   * Resposta de criação bem-sucedida
   */
  static created<T>(res: Response, data: T, message?: string): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    if (message) {
      (response as any).message = message;
    }

    return res.status(201).json(response);
  }

  /**
   * Resposta de operação bem-sucedida sem conteúdo
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * Resposta de aceito (operação assíncrona)
   */
  static accepted(res: Response, message: string = 'Operação aceita para processamento'): Response {
    const response: ApiResponse = {
      success: true,
      data: { message },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    return res.status(202).json(response);
  }
}

// Funções de conveniência para uso direto
export const successResponse = ResponseHelper.success;
export const errorResponse = ResponseHelper.error;
export const validationErrorResponse = ResponseHelper.validationError;
export const unauthorizedResponse = ResponseHelper.unauthorized;
export const forbiddenResponse = ResponseHelper.forbidden;
export const notFoundResponse = ResponseHelper.notFound;
export const conflictResponse = ResponseHelper.conflict;
export const internalErrorResponse = ResponseHelper.internalError;
export const createdResponse = ResponseHelper.created;
export const noContentResponse = ResponseHelper.noContent;

