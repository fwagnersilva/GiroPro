"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalsRoutes = void 0;
var zod_1 = require("zod");
// 🚀 Schemas otimizados com validações mais robustas
var createGoalSchema = zod_1.z.object({
    titulo: zod_1.z.string()
        .min(1, 'Título é obrigatório')
        .max(100, 'Título deve ter no máximo 100 caracteres')
        .trim(),
    desiredWeeklyFrequency: zod_1.z.number()
        .int('Frequência deve ser um número inteiro')
        .min(1, 'Frequência mínima é 1')
        .max(7, 'Frequência máxima é 7'),
});
var completeGoalSchema = zod_1.z.object({
    goalId: zod_1.z.string()
        .cuid2('ID da meta deve ser um CUID válido'),
});
// 🔧 Schema otimizado para datas com coerção automática
var weekDateQuerySchema = zod_1.z.object({
    weekStartsAt: zod_1.z.string()
        .datetime('Data deve estar no formato ISO 8601')
        .optional()
        .transform(function (val) { return val ? new Date(val).toISOString() : undefined; }),
});
// 🔧 Imports dos services
var create_goal_service_1 = require("../services/create_goal_service");
var create_goal_completion_service_1 = require("../services/create_goal_completion_service");
var get_week_pending_goals_service_1 = require("../services/get_week_pending_goals_service");
var get_week_summary_service_1 = require("../services/get_week_summary_service");
var createSuccessResponse = function (data) { return ({
    success: true,
    data: data,
    timestamp: new Date().toISOString(),
}); };
var createErrorResponse = function (error) { return ({
    success: false,
    error: error,
    timestamp: new Date().toISOString(),
}); };
// 🛡️ Handler de erro padronizado
var withErrorHandling = function (fn) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(void 0, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fn.apply(void 0, args)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        // Log do erro para monitoramento
                        console.error('[GoalsController]', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
};
var goalsRoutes = function (app) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // POST /goals - Criar nova meta
        app.post('/goals', {
            schema: {
                body: createGoalSchema,
                response: {
                    200: zod_1.z.object({
                        success: zod_1.z.boolean(),
                        data: zod_1.z.object({
                            goalId: zod_1.z.string().cuid2(),
                        }),
                        timestamp: zod_1.z.string().datetime(),
                    }),
                    400: zod_1.z.object({
                        success: zod_1.z.boolean(),
                        error: zod_1.z.string(),
                        timestamp: zod_1.z.string().datetime(),
                    }),
                },
            },
        }, withErrorHandling(function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, titulo, desiredWeeklyFrequency, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, titulo = _a.titulo, desiredWeeklyFrequency = _a.desiredWeeklyFrequency;
                        return [4 /*yield*/, (0, create_goal_service_1.createGoal)({
                                titulo: titulo,
                                desiredWeeklyFrequency: desiredWeeklyFrequency,
                            })
                            // 🚀 Response padronizado
                        ];
                    case 1:
                        result = _b.sent();
                        // 🚀 Response padronizado
                        return [2 /*return*/, createSuccessResponse({
                                goalId: result.id,
                                titulo: result.titulo,
                                desiredWeeklyFrequency: result.desiredWeeklyFrequency,
                                createdAt: result.createdAt,
                            })];
                }
            });
        }); }));
        // POST /completions - Completar uma meta
        app.post('/completions', {
            schema: {
                body: completeGoalSchema,
                response: {
                    200: zod_1.z.object({
                        success: zod_1.z.boolean(),
                        data: zod_1.z.object({
                            completionId: zod_1.z.string().cuid2(),
                        }),
                        timestamp: zod_1.z.string().datetime(),
                    }),
                    400: zod_1.z.object({
                        success: zod_1.z.boolean(),
                        error: zod_1.z.string(),
                        timestamp: zod_1.z.string().datetime(),
                    }),
                    404: zod_1.z.object({
                        success: zod_1.z.boolean(),
                        error: zod_1.z.string(),
                        timestamp: zod_1.z.string().datetime(),
                    }),
                },
            },
        }, withErrorHandling(function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var goalId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        goalId = request.body.goalId;
                        return [4 /*yield*/, (0, create_goal_completion_service_1.createGoalCompletion)({
                                goalId: goalId,
                            })
                            // 🚀 Response com status codes apropriados
                        ];
                    case 1:
                        result = _a.sent();
                        // 🚀 Response com status codes apropriados
                        return [2 /*return*/, createSuccessResponse({
                                completionId: result.id,
                            })];
                }
            });
        }); }));
        // GET /pending-goals - Obter metas pendentes da semana
        app.get('/pending-goals', {
            schema: {
                querystring: weekDateQuerySchema,
                response: {
                    200: zod_1.z.object({
                        success: zod_1.z.boolean(),
                        data: zod_1.z.object({
                            pendingGoals: zod_1.z.array(zod_1.z.object({
                                id: zod_1.z.string().cuid2(),
                                titulo: zod_1.z.string(),
                                desiredWeeklyFrequency: zod_1.z.number(),
                                completionCount: zod_1.z.number(),
                            })),
                        }),
                        timestamp: zod_1.z.string().datetime(),
                    }),
                },
            },
        }, withErrorHandling(function (request) { return __awaiter(void 0, void 0, void 0, function () {
            var weekStartsAt, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weekStartsAt = request.query.weekStartsAt;
                        return [4 /*yield*/, (0, get_week_pending_goals_service_1.getWeekPendingGoals)({
                                weekStartsAt: weekStartsAt,
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, createSuccessResponse(result)];
                }
            });
        }); }));
        // GET /summary - Obter resumo da semana
        app.get('/summary', {
            schema: {
                querystring: weekDateQuerySchema,
                response: {
                    200: zod_1.z.object({
                        success: zod_1.z.boolean(),
                        data: zod_1.z.object({
                            completed: zod_1.z.number(),
                            total: zod_1.z.number(),
                            goalsPerDay: zod_1.z.record(zod_1.z.number()),
                        }),
                        timestamp: zod_1.z.string().datetime(),
                    }),
                },
            },
        }, withErrorHandling(function (request) { return __awaiter(void 0, void 0, void 0, function () {
            var weekStartsAt, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        weekStartsAt = request.query.weekStartsAt;
                        return [4 /*yield*/, (0, get_week_summary_service_1.getWeekSummary)({
                                weekStartsAt: weekStartsAt,
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, createSuccessResponse(result)];
                }
            });
        }); }));
        // 🔍 GET /goals/:id - Obter detalhes de uma meta específica (novo endpoint)
        app.get('/goals/:id', {
            schema: {
                params: zod_1.z.object({
                    id: zod_1.z.string().cuid2('ID da meta deve ser um CUID válido'),
                }),
                response: {
                    200: zod_1.z.object({
                        success: zod_1.z.boolean(),
                        data: zod_1.z.object({
                            id: zod_1.z.string().cuid2(),
                            titulo: zod_1.z.string(),
                            desiredWeeklyFrequency: zod_1.z.number(),
                            createdAt: zod_1.z.string().datetime(),
                        }),
                        timestamp: zod_1.z.string().datetime(),
                    }),
                    404: zod_1.z.object({
                        success: zod_1.z.boolean(),
                        error: zod_1.z.string(),
                        timestamp: zod_1.z.string().datetime(),
                    }),
                },
            },
        }, withErrorHandling(function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                id = request.params.id;
                // Este endpoint precisará ser implementado no service
                // const result = await getGoalById({ goalId: id })
                // Por enquanto, retorna erro não implementado
                return [2 /*return*/, reply.status(501).send(createErrorResponse('Endpoint em desenvolvimento'))];
            });
        }); }));
        // 🔍 Health check específico para goals
        app.get('/goals/health', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        status: 'healthy',
                        service: 'goals-controller',
                        timestamp: new Date().toISOString(),
                        endpoints: [
                            'POST /goals',
                            'POST /completions',
                            'GET /pending-goals',
                            'GET /summary',
                            'GET /goals/:id',
                        ],
                    }];
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.goalsRoutes = goalsRoutes;
