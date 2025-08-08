export class CustomError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = 'Dados de entrada inválidos', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Não autorizado', details?: any) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Recurso não encontrado', details?: any) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = 'Conflito de recurso', details?: any) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class ServiceUnavailableError extends CustomError {
  constructor(message: string = 'Serviço temporariamente indisponível', details?: any) {
    super(message, 503, 'SERVICE_UNAVAILABLE', details);
  }
}

export class RequestTimeoutError extends CustomError {
  constructor(message: string = 'Timeout da requisição', details?: any) {
    super(message, 408, 'REQUEST_TIMEOUT', details);
  }
}

export class PayloadTooLargeError extends CustomError {
  constructor(message: string = 'Payload muito grande', details?: any) {
    super(message, 413, 'PAYLOAD_TOO_LARGE', details);
  }
}


