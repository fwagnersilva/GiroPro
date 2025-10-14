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
exports.validateExpenseId = exports.validateUpdateExpense = exports.validateCreateExpense = exports.getExpensesByCategory = exports.getExpenseStats = exports.deleteExpense = exports.updateExpense = exports.getExpenseById = exports.getExpenses = exports.createExpense = void 0;
var expenseService_1 = require("../services/expenseService");
var zod_1 = require("zod");
// Schemas de validação com Zod
var createExpenseSchema = zod_1.z.object({
    amount: zod_1.z.number().positive('Valor deve ser positivo'),
    description: zod_1.z.string().min(1, 'Descrição é obrigatória').max(255, 'Descrição muito longa'),
    category: zod_1.z.string().min(1, 'Categoria é obrigatória'),
    vehicleId: zod_1.z.string().uuid('ID do veículo inválido').optional(),
    date: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
    // Adicione outros campos conforme necessário
});
var updateExpenseSchema = createExpenseSchema.partial();
var idParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID deve ser um UUID válido')
});
// Middleware para extrair e validar userId
var extractUserId = function (req) {
    var _a;
    var userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new Error('UNAUTHORIZED');
    }
    return userId;
};
// Wrapper para tratamento consistente de erros
var asyncHandler = function (fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
// Helper para respostas padronizadas
var sendResponse = function (res, statusCode, data, message) {
    var response = {
        success: statusCode < 400,
        timestamp: new Date().toISOString()
    };
    if (message)
        response.message = message;
    if (data !== undefined)
        response.data = data;
    return res.status(statusCode).json(response);
};
// Helper para tratamento de erros
var handleError = function (res, error, defaultMessage) {
    if (defaultMessage === void 0) { defaultMessage = 'Erro interno do servidor'; }
    console.error('ExpensesController Error:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
    });
    // Mapeamento de erros conhecidos
    var errorMappings = {
        'UNAUTHORIZED': { status: 401, message: 'Usuário não autenticado' },
        'EXPENSE_NOT_FOUND': { status: 404, message: 'Despesa não encontrada' },
        'PERMISSION_DENIED': { status: 403, message: 'Sem permissão para esta operação' },
        'VALIDATION_ERROR': { status: 400, message: 'Dados inválidos' },
        'DUPLICATE_ENTRY': { status: 409, message: 'Despesa já existe' }
    };
    var errorInfo = errorMappings[error.message] || {
        status: 500,
        message: defaultMessage
    };
    return sendResponse(res, errorInfo.status, null, errorInfo.message);
};
// Validador de parâmetros de entrada
var validateRequestData = function (schema, data) {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            var errorMessage = error.errors.map(function (err) { return "".concat(err.path.join('.'), ": ").concat(err.message); }).join(', ');
            var validationError = new Error('VALIDATION_ERROR');
            validationError.message = "Dados inv\u00E1lidos: ".concat(errorMessage);
            throw validationError;
        }
        throw error;
    }
};
/**
 * Cria uma nova despesa
 * @route POST /api/v1/expenses
 */
exports.createExpense = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, validatedData, expenseData, newExpense, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = extractUserId(req);
                validatedData = validateRequestData(createExpenseSchema, req.body);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                expenseData = {
                    vehicleId: validatedData.vehicleId || '',
                    data: validatedData.date ? new Date(validatedData.date).toISOString() : new Date().toISOString(),
                    valor: validatedData.amount || 0,
                    descricao: validatedData.description || '',
                    categoria: validatedData.category || ''
                };
                return [4 /*yield*/, expenseService_1.ExpenseService.createExpense(userId, expenseData)];
            case 2:
                newExpense = _a.sent();
                return [2 /*return*/, sendResponse(res, 201, newExpense, 'Despesa criada com sucesso')];
            case 3:
                error_1 = _a.sent();
                return [2 /*return*/, handleError(res, error_1, 'Erro ao criar despesa')];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Lista todas as despesas do usuário
 * @route GET /api/v1/expenses
 */
exports.getExpenses = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, _b, page, _c, limit, category, vehicleId, startDate, endDate, filters, expenses, error_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                userId = extractUserId(req);
                _a = req.query, _b = _a.page, page = _b === void 0 ? '1' : _b, _c = _a.limit, limit = _c === void 0 ? '10' : _c, category = _a.category, vehicleId = _a.vehicleId, startDate = _a.startDate, endDate = _a.endDate;
                filters = {
                    page: parseInt(page, 10),
                    limit: Math.min(parseInt(limit, 10), 100), // Máximo 100 registros
                    category: category,
                    vehicleId: vehicleId,
                    startDate: startDate,
                    endDate: endDate
                };
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                return [4 /*yield*/, expenseService_1.ExpenseService.getExpensesByUserId(userId)];
            case 2:
                expenses = _d.sent();
                return [2 /*return*/, sendResponse(res, 200, expenses, 'Despesas recuperadas com sucesso')];
            case 3:
                error_2 = _d.sent();
                return [2 /*return*/, handleError(res, error_2, 'Erro ao recuperar despesas')];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Busca uma despesa específica por ID
 * @route GET /api/v1/expenses/:id
 */
exports.getExpenseById = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, id, expense, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = extractUserId(req);
                id = validateRequestData(idParamSchema, req.params).id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, expenseService_1.ExpenseService.getExpenseById(id, userId)];
            case 2:
                expense = _a.sent();
                if (!expense) {
                    throw new Error('EXPENSE_NOT_FOUND');
                }
                return [2 /*return*/, sendResponse(res, 200, expense, 'Despesa encontrada')];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, handleError(res, error_3, 'Erro ao buscar despesa')];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Atualiza uma despesa existente
 * @route PUT /api/v1/expenses/:id
 */
exports.updateExpense = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, id, validatedData, updatedExpense, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = extractUserId(req);
                id = validateRequestData(idParamSchema, req.params).id;
                validatedData = validateRequestData(updateExpenseSchema, req.body);
                // Verificar se há dados para atualizar
                if (Object.keys(validatedData).length === 0) {
                    return [2 /*return*/, sendResponse(res, 400, null, 'Nenhum dado válido fornecido para atualização')];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, expenseService_1.ExpenseService.updateExpense(id, userId, validatedData)];
            case 2:
                updatedExpense = _a.sent();
                if (!updatedExpense) {
                    throw new Error('EXPENSE_NOT_FOUND');
                }
                return [2 /*return*/, sendResponse(res, 200, updatedExpense, 'Despesa atualizada com sucesso')];
            case 3:
                error_4 = _a.sent();
                return [2 /*return*/, handleError(res, error_4, 'Erro ao atualizar despesa')];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Remove uma despesa
 * @route DELETE /api/v1/expenses/:id
 */
exports.deleteExpense = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, id, deleted, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = extractUserId(req);
                id = validateRequestData(idParamSchema, req.params).id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, expenseService_1.ExpenseService.deleteExpense(id, userId)];
            case 2:
                deleted = _a.sent();
                if (!deleted) {
                    throw new Error('EXPENSE_NOT_FOUND');
                }
                return [2 /*return*/, sendResponse(res, 200, null, 'Despesa removida com sucesso')];
            case 3:
                error_5 = _a.sent();
                return [2 /*return*/, handleError(res, error_5, 'Erro ao remover despesa')];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Busca estatísticas de despesas do usuário
 * @route GET /api/v1/expenses/stats
 */
exports.getExpenseStats = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, _b, period, vehicleId, stats, error_6;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = extractUserId(req);
                _a = req.query, _b = _a.period, period = _b === void 0 ? 'month' : _b, vehicleId = _a.vehicleId;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, expenseService_1.ExpenseService.getExpenseStats(userId)];
            case 2:
                stats = _c.sent();
                return [2 /*return*/, sendResponse(res, 200, stats, 'Estatísticas recuperadas com sucesso')];
            case 3:
                error_6 = _c.sent();
                return [2 /*return*/, handleError(res, error_6, 'Erro ao recuperar estatísticas')];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Busca despesas por categoria
 * @route GET /api/v1/expenses/by-category
 */
exports.getExpensesByCategory = asyncHandler(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, startDate, endDate, expensesByCategory, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = extractUserId(req);
                _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, expenseService_1.ExpenseService.getExpensesByCategory(userId, 'geral')];
            case 2:
                expensesByCategory = _b.sent();
                return [2 /*return*/, sendResponse(res, 200, expensesByCategory, 'Despesas por categoria recuperadas')];
            case 3:
                error_7 = _b.sent();
                return [2 /*return*/, handleError(res, error_7, 'Erro ao recuperar despesas por categoria')];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Middleware de validação que pode ser usado nas rotas
var validateCreateExpense = function (req, res, next) {
    try {
        validateRequestData(createExpenseSchema, req.body);
        next();
    }
    catch (error) {
        handleError(res, error);
        return;
    }
};
exports.validateCreateExpense = validateCreateExpense;
var validateUpdateExpense = function (req, res, next) {
    try {
        validateRequestData(updateExpenseSchema, req.body);
        next();
    }
    catch (error) {
        handleError(res, error);
        return;
    }
};
exports.validateUpdateExpense = validateUpdateExpense;
var validateExpenseId = function (req, res, next) {
    try {
        validateRequestData(idParamSchema, req.params);
        next();
    }
    catch (error) {
        handleError(res, error);
        return;
    }
};
exports.validateExpenseId = validateExpenseId;
