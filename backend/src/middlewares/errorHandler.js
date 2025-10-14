"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var zod_1 = require("zod");
var customErrors_1 = require("../utils/customErrors");
var errorHandler = function (err, req, res, next) {
    // Log do erro para debugging
    console.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    // Erro de validação Zod
    if (err instanceof zod_1.ZodError) {
        var validationError = new customErrors_1.ValidationError('Dados de entrada inválidos', err.errors.map(function (error) { return ({
            field: error.path.join('.'),
            message: error.message,
            code: error.code
        }); }));
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
    if (err instanceof customErrors_1.CustomError) {
        return res.status(err.statusCode).json({
            success: false,
            error: __assign({ message: err.message, code: err.code }, (err.details && { details: err.details }))
        });
    }
    // Erro de autenticação JWT
    if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
        var unauthorizedError = new customErrors_1.UnauthorizedError('Token de acesso inválido ou expirado');
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
        var unauthorizedError = new customErrors_1.UnauthorizedError('Token de acesso expirado');
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
        var serviceUnavailableError = new customErrors_1.ServiceUnavailableError();
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
        var conflictError = new customErrors_1.ConflictError('Recurso já existe');
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
        var validationError = new customErrors_1.ValidationError('Referência inválida');
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
        var internalError = new customErrors_1.CustomError('Erro interno do servidor', 500, 'INTERNAL_ERROR');
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
        var tooManyRequestsError = new customErrors_1.CustomError('Muitas requisições. Tente novamente em alguns minutos.', 429, 'RATE_LIMIT_EXCEEDED');
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
        var payloadTooLargeError = new customErrors_1.PayloadTooLargeError();
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
        var requestTimeoutError = new customErrors_1.RequestTimeoutError();
        return res.status(requestTimeoutError.statusCode).json({
            success: false,
            error: {
                message: requestTimeoutError.message,
                code: requestTimeoutError.code
            }
        });
    }
    // Erro genérico do servidor
    var statusCode = err.status || err.statusCode || 500;
    // Em produção, não expor detalhes internos
    var isProduction = process.env.NODE_ENV === 'production';
    var genericError = new customErrors_1.CustomError(isProduction ? 'Erro interno do servidor' : err.message || 'Erro interno do servidor', statusCode, 'INTERNAL_ERROR', isProduction ? undefined : err.stack);
    return res.status(genericError.statusCode).json({
        success: false,
        error: __assign({ message: genericError.message, code: genericError.code }, (genericError.details && { details: genericError.details }))
    });
};
exports.errorHandler = errorHandler;
