import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { CustomError, ValidationError, UnauthorizedError, NotFoundError, ConflictError, ServiceUnavailableError, RequestTimeoutError, PayloadTooLargeError } from '../utils/customErrors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log do erro para debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Erro de validação Zod
  if (err instanceof ZodError) {
    const validationError = new ValidationError(
      'Dados de entrada inválidos',
      err.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message,
        code: error.code
      }))
    );
    return res.status(validationError.statusCode).json({
      success: false,
      error: {
        message: validationError.message,
        details: validationError.details,
        code: validationError.code
      }
    });
  }

  // Erros customizados
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        ...(err.details && { details: err.details })
      }
    });
  }

  // Erro de autenticação JWT
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    const unauthorizedError = new UnauthorizedError('Token de acesso inválido ou expirado');
    return res.status(unauthorizedError.statusCode).json({
      success: false,
      error: {
        message: unauthorizedError.message,
        code: unauthorizedError.code
      }
    });
  }

  // Erro de token expirado
  if (err.name === 'TokenExpiredError') {
    const unauthorizedError = new UnauthorizedError('Token de acesso expirado');
    return res.status(unauthorizedError.statusCode).json({
      success: false,
      error: {
        message: unauthorizedError.message,
        code: unauthorizedError.code
      }
    });
  }

  // Erro de banco de dados
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    const serviceUnavailableError = new ServiceUnavailableError();
    return res.status(serviceUnavailableError.statusCode).json({
      success: false,
      error: {
        message: serviceUnavailableError.message,
        code: serviceUnavailableError.code
      }
    });
  }

  // Erro de violação de constraint do banco
  if (err.code === '23505') { // PostgreSQL unique violation
    const conflictError = new ConflictError('Recurso já existe');
    return res.status(conflictError.statusCode).json({
      success: false,
      error: {
        message: conflictError.message,
        code: conflictError.code
      }
    });
  }

  // Erro de foreign key violation
  if (err.code === '23503') { // PostgreSQL foreign key violation
    const validationError = new ValidationError('Referência inválida');
    return res.status(validationError.statusCode).json({
      success: false,
      error: {
        message: validationError.message,
        code: validationError.code
      }
    });
  }

  // Erro de sintaxe SQL
  if (err.code === '42601' || err.code === '42P01') {
    console.error('SQL Error:', err);
    const internalError = new CustomError('Erro interno do servidor', 500, 'INTERNAL_ERROR');
    return res.status(internalError.statusCode).json({
      success: false,
      error: {
        message: internalError.message,
        code: internalError.code
      }
    });
  }

  // Erro de rate limiting (se implementado)
  if (err.status === 429) {
    const tooManyRequestsError = new CustomError('Muitas requisições. Tente novamente em alguns minutos.', 429, 'RATE_LIMIT_EXCEEDED');
    return res.status(tooManyRequestsError.statusCode).json({
      success: false,
      error: {
        message: tooManyRequestsError.message,
        code: tooManyRequestsError.code
      }
    });
  }

  // Erro de payload muito grande
  if (err.type === 'entity.too.large') {
    const payloadTooLargeError = new PayloadTooLargeError();
    return res.status(payloadTooLargeError.statusCode).json({
      success: false,
      error: {
        message: payloadTooLargeError.message,
        code: payloadTooLargeError.code
      }
    });
  }

  // Erro de timeout
  if (err.code === 'ETIMEDOUT' || err.timeout) {
    const requestTimeoutError = new RequestTimeoutError();
    return res.status(requestTimeoutError.statusCode).json({
      success: false,
      error: {
        message: requestTimeoutError.message,
        code: requestTimeoutError.code
      }
    });
  }

  // Erro genérico do servidor
  const statusCode = err.status || err.statusCode || 500;
  
  // Em produção, não expor detalhes internos
  const isProduction = process.env.NODE_ENV === 'production';
  
  const genericError = new CustomError(
    isProduction ? 'Erro interno do servidor' : err.message || 'Erro interno do servidor',
    statusCode,
    'INTERNAL_ERROR',
    isProduction ? undefined : err.stack
  );

  return res.status(genericError.statusCode).json({
    success: false,
    error: {
      message: genericError.message,
      code: genericError.code,
      ...(genericError.details && { details: genericError.details })
    }
  });
};

