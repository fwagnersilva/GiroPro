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
exports.getJourneyStats = exports.deleteJourney = exports.updateJourney = exports.getJourneyById = exports.getJourneys = exports.createJourney = void 0;
var journeyService_1 = require("../services/journeyService");
var logger_1 = require("../utils/logger");
var cache_1 = require("../utils/cache");
var zod_1 = require("zod");
var perf_hooks_1 = require("perf_hooks");
// ===============================
// SCHEMAS DE VALIDAÇÃO
// ===============================
var createJourneySchema = zod_1.z.object({
    idVeiculo: zod_1.z.string().uuid('ID do veículo deve ser um UUID válido'),
    dataInicio: zod_1.z.string().datetime('Data de início inválida'),
    kmInicio: zod_1.z.number().int().min(0, 'Quilometragem inicial deve ser maior ou igual a 0'),
    dataFim: zod_1.z.string().datetime('Data de fim inválida').optional(),
    kmFim: zod_1.z.number().int().min(0, 'Quilometragem final deve ser maior ou igual a 0').optional(),
    ganhoBruto: zod_1.z.number().int().min(0, 'Ganho bruto deve ser maior ou igual a 0').optional(),
    kmTotal: zod_1.z.number().int().min(0, 'KM total deve ser maior ou igual a 0').optional(),
    tempoTotal: zod_1.z.number().int().min(0, 'Tempo total deve ser maior ou igual a 0').optional(),
    observacoes: zod_1.z.string().max(500, 'Observações muito longas').optional(),
});
var updateJourneySchema = zod_1.z.object({
    dataFim: zod_1.z.string().datetime('Data de fim inválida').optional(),
    kmFim: zod_1.z.number().int().min(0, 'Quilometragem final deve ser maior ou igual a 0').optional(),
    ganhoBruto: zod_1.z.number().int().min(0, 'Ganho bruto deve ser maior ou igual a 0').optional(),
    observacoes: zod_1.z.string().max(500, 'Observações muito longas').optional(),
});
var querySchema = zod_1.z.object({
    page: zod_1.z.string().transform(function (val) { return parseInt(val) || 1; }).pipe(zod_1.z.number().min(1)),
    limit: zod_1.z.string().transform(function (val) { return Math.min(parseInt(val) || 10, 100); }).pipe(zod_1.z.number().min(1).max(100)),
    sortBy: zod_1.z.enum(['dataInicio', 'dataFim', 'kmTotal', 'ganhoBruto', 'createdAt']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
    status: zod_1.z.enum(['em_andamento', 'concluida', 'todas']).default('todas'),
    dataInicio: zod_1.z.string().datetime().optional(),
    dataFim: zod_1.z.string().datetime().optional(),
    veiculoId: zod_1.z.string().uuid().optional(),
});
var periodoValido = zod_1.z.enum(['semana', 'mes', 'trimestre', 'ano']).optional();
// ===============================
// CACHE CONFIGURATION
// ===============================
var cache = new cache_1.Cache({
    ttl: 5 * 60 * 1000, // 5 minutos
    maxSize: 1000,
});
// ===============================
// HELPER FUNCTIONS
// ===============================
var extractUserId = function (req) {
    var _a;
    return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
};
var generateCacheKey = function (userId, operation, params) {
    var paramString = params ? JSON.stringify(params) : '';
    return "journey:".concat(userId, ":").concat(operation, ":").concat(Buffer.from(paramString).toString('base64'));
};
var createSuccessResponse = function (data, message, meta) { return ({
    success: true,
    data: data,
    message: message,
    meta: meta,
}); };
var createErrorResponse = function (error, statusCode, details) {
    if (statusCode === void 0) { statusCode = 400; }
    return ({
        success: false,
        error: error,
        meta: {
            performance: {
                queryTime: 0,
                cacheHit: false,
            },
        },
    });
};
var logRequest = function (operation, userId, params) {
    logger_1.default.info("Journey ".concat(operation), {
        userId: userId,
        operation: operation,
        params: params,
        timestamp: new Date().toISOString(),
    });
};
var logPerformance = function (operation, queryTime, cacheHit) {
    if (cacheHit === void 0) { cacheHit = false; }
    logger_1.default.debug("Journey ".concat(operation, " performance"), {
        queryTime: "".concat(queryTime.toFixed(2), "ms"),
        cacheHit: cacheHit,
    });
};
// ===============================
// CONTROLLER FUNCTIONS OTIMIZADAS
// ===============================
var createJourney = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var startTime, userId, validationResult, errors, journeyData, newJourney, queryTime, error_1, queryTime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                startTime = perf_hooks_1.performance.now();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                userId = extractUserId(req);
                if (!userId) {
                    return [2 /*return*/, res.status(401).json(createErrorResponse('Usuário não autenticado', 401))];
                }
                validationResult = createJourneySchema.safeParse(req.body);
                if (!validationResult.success) {
                    errors = validationResult.error.issues.map(function (issue) {
                        return "".concat(issue.path.join('.'), ": ").concat(issue.message);
                    }).join(', ');
                    logger_1.default.warn('Validation failed for createJourney', {
                        userId: userId,
                        errors: validationResult.error.issues,
                    });
                    return [2 /*return*/, res.status(400).json(createErrorResponse("Dados inv\u00E1lidos: ".concat(errors)))];
                }
                journeyData = validationResult.data;
                // 3. Log da operação
                logRequest('create', userId, journeyData);
                return [4 /*yield*/, journeyService_1.JourneyService.createJourney(userId, journeyData)];
            case 2:
                newJourney = _a.sent();
                if (!newJourney) {
                    return [2 /*return*/, res.status(400).json(createErrorResponse('Falha ao criar jornada'))];
                }
                // 5. Invalidar cache relacionado
                cache.invalidatePattern("journey:".concat(userId, ":"));
                queryTime = perf_hooks_1.performance.now() - startTime;
                logPerformance('create', queryTime);
                // 6. Resposta de sucesso
                return [2 /*return*/, res.status(201).json(createSuccessResponse(newJourney, 'Jornada criada com sucesso', {
                        performance: { queryTime: queryTime, cacheHit: false }
                    }))];
            case 3:
                error_1 = _a.sent();
                queryTime = perf_hooks_1.performance.now() - startTime;
                logger_1.default.error('Error in createJourney', {
                    error: error_1.message,
                    stack: error_1.stack,
                    userId: extractUserId(req),
                    body: req.body,
                });
                return [2 /*return*/, res.status(500).json(createErrorResponse('Erro interno do servidor. Tente novamente.'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createJourney = createJourney;
var getJourneys = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var startTime, userId, queryValidation, queryParams, cacheKey, cachedResult, queryTime_1, result, queryTime, response, error_2, queryTime;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                startTime = perf_hooks_1.performance.now();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                userId = extractUserId(req);
                if (!userId) {
                    return [2 /*return*/, res.status(401).json(createErrorResponse('Usuário não autenticado', 401))];
                }
                queryValidation = querySchema.safeParse(req.query);
                if (!queryValidation.success) {
                    return [2 /*return*/, res.status(400).json(createErrorResponse('Parâmetros de consulta inválidos', 400, queryValidation.error.errors))];
                }
                queryParams = queryValidation.data;
                cacheKey = generateCacheKey(userId, 'list', queryParams);
                cachedResult = cache.get(cacheKey);
                if (cachedResult) {
                    queryTime_1 = perf_hooks_1.performance.now() - startTime;
                    logPerformance('list', queryTime_1, true);
                    return [2 /*return*/, res.status(200).json(__assign(__assign({}, cachedResult), { meta: __assign(__assign({}, cachedResult.meta), { performance: { queryTime: queryTime_1, cacheHit: true } }) }))];
                }
                // 4. Log da operação
                logRequest('list', userId, queryParams);
                return [4 /*yield*/, journeyService_1.JourneyService.getJourneysByUserId(userId, {
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
                    })];
            case 2:
                result = _b.sent();
                if (!result.success) {
                    return [2 /*return*/, res.status(400).json(createErrorResponse(result.error || 'Erro ao buscar jornadas'))];
                }
                queryTime = perf_hooks_1.performance.now() - startTime;
                logPerformance('list', queryTime);
                response = createSuccessResponse(result.data, 'Jornadas recuperadas com sucesso', {
                    pagination: (_a = result.meta) === null || _a === void 0 ? void 0 : _a.pagination,
                    filters: queryParams,
                    performance: { queryTime: queryTime, cacheHit: false }
                });
                // 7. Salvar no cache
                cache.set(cacheKey, response);
                return [2 /*return*/, res.status(200).json(response)];
            case 3:
                error_2 = _b.sent();
                queryTime = perf_hooks_1.performance.now() - startTime;
                logger_1.default.error('Error in getJourneys', {
                    error: error_2.message,
                    stack: error_2.stack,
                    userId: extractUserId(req),
                    query: req.query,
                });
                return [2 /*return*/, res.status(500).json(createErrorResponse('Erro interno do servidor. Tente novamente.'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getJourneys = getJourneys;
var getJourneyById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var startTime, userId, id, cacheKey, cachedResult, queryTime_2, journey, queryTime, response, error_3, queryTime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                startTime = perf_hooks_1.performance.now();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                userId = extractUserId(req);
                if (!userId) {
                    return [2 /*return*/, res.status(401).json(createErrorResponse('Usuário não autenticado', 401))];
                }
                id = req.params.id;
                if (!id || !zod_1.z.string().uuid().safeParse(id).success) {
                    return [2 /*return*/, res.status(400).json(createErrorResponse('ID da jornada inválido'))];
                }
                cacheKey = generateCacheKey(userId, 'detail', { id: id });
                cachedResult = cache.get(cacheKey);
                if (cachedResult) {
                    queryTime_2 = perf_hooks_1.performance.now() - startTime;
                    logPerformance('detail', queryTime_2, true);
                    return [2 /*return*/, res.status(200).json(__assign(__assign({}, cachedResult), { meta: __assign(__assign({}, cachedResult.meta), { performance: { queryTime: queryTime_2, cacheHit: true } }) }))];
                }
                // 4. Log da operação
                logRequest('detail', userId, { id: id });
                return [4 /*yield*/, journeyService_1.JourneyService.getJourneyById(id, userId)];
            case 2:
                journey = _a.sent();
                if (!journey) {
                    return [2 /*return*/, res.status(404).json(createErrorResponse('Jornada não encontrada', 404))];
                }
                queryTime = perf_hooks_1.performance.now() - startTime;
                logPerformance('detail', queryTime);
                response = createSuccessResponse(journey, 'Jornada recuperada com sucesso', {
                    performance: { queryTime: queryTime, cacheHit: false }
                });
                // 7. Salvar no cache
                cache.set(cacheKey, response);
                return [2 /*return*/, res.status(200).json(response)];
            case 3:
                error_3 = _a.sent();
                queryTime = perf_hooks_1.performance.now() - startTime;
                logger_1.default.error('Error in getJourneyById', {
                    error: error_3.message,
                    stack: error_3.stack,
                    userId: extractUserId(req),
                    journeyId: req.params.id,
                });
                return [2 /*return*/, res.status(500).json(createErrorResponse('Erro interno do servidor. Tente novamente.'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getJourneyById = getJourneyById;
var updateJourney = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var startTime, userId, id, validationResult, errors, journeyData, currentJourney, updatedJourney, queryTime, error_4, queryTime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                startTime = perf_hooks_1.performance.now();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                userId = extractUserId(req);
                if (!userId) {
                    return [2 /*return*/, res.status(401).json(createErrorResponse('Usuário não autenticado', 401))];
                }
                id = req.params.id;
                if (!id || !zod_1.z.string().uuid().safeParse(id).success) {
                    return [2 /*return*/, res.status(400).json(createErrorResponse('ID da jornada inválido'))];
                }
                validationResult = updateJourneySchema.safeParse(req.body);
                if (!validationResult.success) {
                    errors = validationResult.error.issues.map(function (issue) {
                        return "".concat(issue.path.join('.'), ": ").concat(issue.message);
                    }).join(', ');
                    return [2 /*return*/, res.status(400).json(createErrorResponse("Dados inv\u00E1lidos: ".concat(errors)))];
                }
                journeyData = validationResult.data;
                if (!(journeyData.kmFim && journeyData.dataFim)) return [3 /*break*/, 3];
                return [4 /*yield*/, journeyService_1.JourneyService.getJourneyById(id, userId)];
            case 2:
                currentJourney = _a.sent();
                if (currentJourney && journeyData.kmFim <= currentJourney.kmInicio) {
                    return [2 /*return*/, res.status(400).json(createErrorResponse('Quilometragem final deve ser maior que a inicial'))];
                }
                _a.label = 3;
            case 3:
                // 5. Log da operação
                logRequest('update', userId, __assign({ id: id }, journeyData));
                return [4 /*yield*/, journeyService_1.JourneyService.updateJourney(id, userId, journeyData)];
            case 4:
                updatedJourney = _a.sent();
                if (!updatedJourney) {
                    return [2 /*return*/, res.status(404).json(createErrorResponse('Jornada não encontrada ou você não tem permissão para atualizá-la', 404))];
                }
                // 7. Invalidar cache
                cache.invalidatePattern("journey:".concat(userId, ":"));
                queryTime = perf_hooks_1.performance.now() - startTime;
                logPerformance('update', queryTime);
                // 8. Resposta de sucesso
                return [2 /*return*/, res.status(200).json(createSuccessResponse(updatedJourney, 'Jornada atualizada com sucesso', {
                        performance: { queryTime: queryTime, cacheHit: false }
                    }))];
            case 5:
                error_4 = _a.sent();
                queryTime = perf_hooks_1.performance.now() - startTime;
                logger_1.default.error('Error in updateJourney', {
                    error: error_4.message,
                    stack: error_4.stack,
                    userId: extractUserId(req),
                    journeyId: req.params.id,
                    body: req.body,
                });
                return [2 /*return*/, res.status(500).json(createErrorResponse('Erro interno do servidor. Tente novamente.'))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateJourney = updateJourney;
var deleteJourney = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var startTime, userId, id, existingJourney, deleted, queryTime, error_5, queryTime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                startTime = perf_hooks_1.performance.now();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                userId = extractUserId(req);
                if (!userId) {
                    return [2 /*return*/, res.status(401).json(createErrorResponse('Usuário não autenticado', 401))];
                }
                id = req.params.id;
                if (!id || !zod_1.z.string().uuid().safeParse(id).success) {
                    return [2 /*return*/, res.status(400).json(createErrorResponse('ID da jornada inválido'))];
                }
                // 3. Log da operação
                logRequest('delete', userId, { id: id });
                return [4 /*yield*/, journeyService_1.JourneyService.getJourneyById(id, userId)];
            case 2:
                existingJourney = _a.sent();
                if (!existingJourney) {
                    return [2 /*return*/, res.status(404).json(createErrorResponse('Jornada não encontrada ou você não tem permissão para excluí-la', 404))];
                }
                return [4 /*yield*/, journeyService_1.JourneyService.deleteJourney(id, userId)];
            case 3:
                deleted = _a.sent();
                if (!deleted) {
                    return [2 /*return*/, res.status(400).json(createErrorResponse('Falha ao excluir jornada'))];
                }
                // 6. Invalidar cache
                cache.invalidatePattern("journey:".concat(userId, ":"));
                queryTime = perf_hooks_1.performance.now() - startTime;
                logPerformance('delete', queryTime);
                // 7. Log de auditoria
                logger_1.default.info('Journey deleted', {
                    userId: userId,
                    journeyId: id,
                    deletedAt: new Date().toISOString(),
                });
                // 8. Resposta de sucesso (204 No Content)
                return [2 /*return*/, res.status(204).send()];
            case 4:
                error_5 = _a.sent();
                queryTime = perf_hooks_1.performance.now() - startTime;
                logger_1.default.error('Error in deleteJourney', {
                    error: error_5.message,
                    stack: error_5.stack,
                    userId: extractUserId(req),
                    journeyId: req.params.id,
                });
                return [2 /*return*/, res.status(500).json(createErrorResponse('Erro interno do servidor. Tente novamente.'))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteJourney = deleteJourney;
// ===============================
// ENDPOINTS ADICIONAIS OTIMIZADOS
// ===============================
var getJourneyStats = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var startTime, userId, periodo, validatedPeriodo, cacheKey, cachedResult, queryTime_3, stats, queryTime, response, error_6, queryTime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                startTime = perf_hooks_1.performance.now();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                userId = extractUserId(req);
                if (!userId) {
                    return [2 /*return*/, res.status(401).json(createErrorResponse('Usuário não autenticado', 401))];
                }
                periodo = req.query.periodo;
                validatedPeriodo = periodoValido.safeParse(periodo);
                if (periodo && !validatedPeriodo.success) {
                    return [2 /*return*/, res.status(400).json(createErrorResponse('Período inválido', 400, validatedPeriodo.error.errors))];
                }
                cacheKey = generateCacheKey(userId, 'stats', { periodo: validatedPeriodo.data });
                cachedResult = cache.get(cacheKey);
                if (cachedResult) {
                    queryTime_3 = perf_hooks_1.performance.now() - startTime;
                    return [2 /*return*/, res.status(200).json(__assign(__assign({}, cachedResult), { meta: __assign(__assign({}, cachedResult.meta), { performance: { queryTime: queryTime_3, cacheHit: true } }) }))];
                }
                return [4 /*yield*/, journeyService_1.JourneyService.getJourneyStatistics(userId, validatedPeriodo.data)];
            case 2:
                stats = _a.sent();
                queryTime = perf_hooks_1.performance.now() - startTime;
                logPerformance('stats', queryTime);
                response = createSuccessResponse(stats, 'Estatísticas de jornada recuperadas com sucesso', {
                    performance: { queryTime: queryTime, cacheHit: false },
                    filters: { periodo: validatedPeriodo.data || 'all' }
                });
                // 7. Salvar no cache
                cache.set(cacheKey, response);
                return [2 /*return*/, res.status(200).json(response)];
            case 3:
                error_6 = _a.sent();
                queryTime = perf_hooks_1.performance.now() - startTime;
                logger_1.default.error('Error in getJourneyStats', {
                    error: error_6.message,
                    stack: error_6.stack,
                    userId: extractUserId(req),
                    query: req.query,
                });
                return [2 /*return*/, res.status(500).json(createErrorResponse('Erro interno do servidor. Tente novamente.'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getJourneyStats = getJourneyStats;
