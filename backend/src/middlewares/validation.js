"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRangeSchema = exports.paginationSchema = exports.uuidSchema = exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
var zod_1 = require("zod");
var validateBody = function (schema) {
    return function (req, res, next) {
        try {
            var validatedData = schema.parse(req.body);
            req.body = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Dados de entrada inválidos',
                        details: error.errors.map(function (err) { return ({
                            field: err.path.join('.'),
                            message: err.message,
                            code: err.code
                        }); })
                    }
                });
                return;
            }
            next(error);
        }
    };
};
exports.validateBody = validateBody;
var validateQuery = function (schema) {
    return function (req, res, next) {
        try {
            var validatedData = schema.parse(req.query);
            req.query = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Parâmetros de consulta inválidos',
                        details: error.errors.map(function (err) { return ({
                            field: err.path.join('.'),
                            message: err.message,
                            code: err.code
                        }); })
                    }
                });
                return;
            }
            next(error);
        }
    };
};
exports.validateQuery = validateQuery;
var validateParams = function (schema) {
    return function (req, res, next) {
        try {
            var validatedData = schema.parse(req.params);
            req.params = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Parâmetros de rota inválidos',
                        details: error.errors.map(function (err) { return ({
                            field: err.path.join('.'),
                            message: err.message,
                            code: err.code
                        }); })
                    }
                });
                return;
            }
            next(error);
        }
    };
};
exports.validateParams = validateParams;
// Schemas comuns para validação
var zod_2 = require("zod");
exports.uuidSchema = zod_2.z.object({
    id: zod_2.z.string().uuid('ID deve ser um UUID válido')
});
exports.paginationSchema = zod_2.z.object({
    page: zod_2.z.coerce.number().int().min(1, 'Página deve ser um número inteiro maior que 0').default(1),
    limit: zod_2.z.coerce.number().int().min(1, 'Limite deve ser um número inteiro maior que 0').max(100, 'Limite máximo é 100').default(10)
});
exports.dateRangeSchema = zod_2.z.object({
    dataInicio: zod_2.z.string().datetime('Data de início deve estar no formato ISO 8601').optional(),
    dataFim: zod_2.z.string().datetime('Data de fim deve estar no formato ISO 8601').optional()
}).refine(function (data) {
    if (data.dataInicio && data.dataFim) {
        return new Date(data.dataInicio) <= new Date(data.dataFim);
    }
    return true;
}, {
    message: 'Data de início deve ser anterior à data de fim'
});
