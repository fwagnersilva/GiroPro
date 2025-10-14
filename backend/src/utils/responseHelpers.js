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
exports.noContentResponse = exports.createdResponse = exports.internalErrorResponse = exports.conflictResponse = exports.notFoundResponse = exports.forbiddenResponse = exports.unauthorizedResponse = exports.validationErrorResponse = exports.errorResponse = exports.successResponse = exports.ResponseHelper = void 0;
var ResponseHelper = /** @class */ (function () {
    function ResponseHelper() {
    }
    /**
     * Resposta de sucesso
     */
    ResponseHelper.success = function (res, data, statusCode) {
        if (statusCode === void 0) { statusCode = 200; }
        var response = {
            success: true,
            data: data,
            meta: {
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            }
        };
        return res.status(statusCode).json(response);
    };
    /**
     * Resposta de sucesso com paginação
     */
    ResponseHelper.successWithPagination = function (res, data, pagination, statusCode) {
        if (statusCode === void 0) { statusCode = 200; }
        var totalPages = Math.ceil(pagination.total / pagination.limit);
        var response = {
            success: true,
            data: data,
            pagination: __assign(__assign({}, pagination), { totalPages: totalPages, hasNext: pagination.page < totalPages, hasPrev: pagination.page > 1 }),
            meta: {
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            }
        };
        return res.status(statusCode).json(response);
    };
    /**
     * Resposta de erro
     */
    ResponseHelper.error = function (res, message, statusCode, code, details) {
        if (statusCode === void 0) { statusCode = 500; }
        var response = {
            success: false,
            error: {
                message: message,
                code: code,
                details: details
            },
            meta: {
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            }
        };
        return res.status(statusCode).json(response);
    };
    /**
     * Resposta de erro de validação
     */
    ResponseHelper.validationError = function (res, details) {
        return this.error(res, 'Dados de entrada inválidos', 400, 'VALIDATION_ERROR', details);
    };
    /**
     * Resposta de erro de autenticação
     */
    ResponseHelper.unauthorized = function (res, message) {
        if (message === void 0) { message = 'Não autorizado'; }
        return this.error(res, message, 401, 'UNAUTHORIZED');
    };
    /**
     * Resposta de erro de autorização
     */
    ResponseHelper.forbidden = function (res, message) {
        if (message === void 0) { message = 'Acesso negado'; }
        return this.error(res, message, 403, 'FORBIDDEN');
    };
    /**
     * Resposta de recurso não encontrado
     */
    ResponseHelper.notFound = function (res, message) {
        if (message === void 0) { message = 'Recurso não encontrado'; }
        return this.error(res, message, 404, 'NOT_FOUND');
    };
    /**
     * Resposta de conflito
     */
    ResponseHelper.conflict = function (res, message) {
        if (message === void 0) { message = 'Recurso já existe'; }
        return this.error(res, message, 409, 'CONFLICT');
    };
    /**
     * Resposta de erro interno do servidor
     */
    ResponseHelper.internalError = function (res, message) {
        if (message === void 0) { message = 'Erro interno do servidor'; }
        return this.error(res, message, 500, 'INTERNAL_ERROR');
    };
    /**
     * Resposta de serviço indisponível
     */
    ResponseHelper.serviceUnavailable = function (res, message) {
        if (message === void 0) { message = 'Serviço temporariamente indisponível'; }
        return this.error(res, message, 503, 'SERVICE_UNAVAILABLE');
    };
    /**
     * Resposta de criação bem-sucedida
     */
    ResponseHelper.created = function (res, data, message) {
        var response = {
            success: true,
            data: data,
            meta: {
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            }
        };
        if (message) {
            response.message = message;
        }
        return res.status(201).json(response);
    };
    /**
     * Resposta de operação bem-sucedida sem conteúdo
     */
    ResponseHelper.noContent = function (res) {
        return res.status(204).send();
    };
    /**
     * Resposta de aceito (operação assíncrona)
     */
    ResponseHelper.accepted = function (res, message) {
        if (message === void 0) { message = 'Operação aceita para processamento'; }
        var response = {
            success: true,
            data: { message: message },
            meta: {
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            }
        };
        return res.status(202).json(response);
    };
    return ResponseHelper;
}());
exports.ResponseHelper = ResponseHelper;
// Funções de conveniência para uso direto
exports.successResponse = ResponseHelper.success;
exports.errorResponse = ResponseHelper.error;
exports.validationErrorResponse = ResponseHelper.validationError;
exports.unauthorizedResponse = ResponseHelper.unauthorized;
exports.forbiddenResponse = ResponseHelper.forbidden;
exports.notFoundResponse = ResponseHelper.notFound;
exports.conflictResponse = ResponseHelper.conflict;
exports.internalErrorResponse = ResponseHelper.internalError;
exports.createdResponse = ResponseHelper.created;
exports.noContentResponse = ResponseHelper.noContent;
