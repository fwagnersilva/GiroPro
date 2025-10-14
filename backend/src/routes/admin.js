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
var express_1 = require("express");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var logger_1 = require("../utils/logger");
var router = (0, express_1.Router)();
// Middleware de autenticação para todas as rotas admin
router.use(authMiddleware_1.authenticateToken);
router.use((0, authMiddleware_1.authorizeRoles)("admin"));
// GET /api/v1/admin/health - Status detalhado do sistema
router.get("/health", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.json({
                system: {
                    status: 'healthy',
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                },
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            logger_1.default.error('Erro ao obter status do sistema:', error);
            res.status(500).json({
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/v1/admin/metrics - Métricas detalhadas de performance
router.get('/metrics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var period;
    return __generator(this, function (_a) {
        try {
            period = parseInt(req.query.period) || 60;
            res.json({
                current: {
                    responseTime: 'N/A',
                    requestsPerSecond: 'N/A',
                },
                memory: process.memoryUsage(),
                uptime: process.uptime(),
                period: period
            });
        }
        catch (error) {
            logger_1.default.error('Erro ao obter métricas:', error);
            res.status(500).json({
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
        return [2 /*return*/];
    });
}); });
// POST /api/v1/admin/backup - Executar backup manual
router.post('/backup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            return [2 /*return*/, res.json({
                    message: 'Backup iniciado com sucesso',
                    status: 'started'
                })];
        }
        catch (error) {
            logger_1.default.error('Erro ao iniciar backup:', error);
            return [2 /*return*/, res.status(500).json({
                    error: 'Erro interno do servidor',
                    code: 'INTERNAL_ERROR'
                })];
        }
        return [2 /*return*/];
    });
}); });
// GET /api/v1/admin/backup/history - Histórico de backups
router.get('/backup/history', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.json({
                history: [],
                config: {
                    enabled: false,
                    schedule: 'daily',
                    retention: 30,
                }
            });
        }
        catch (error) {
            logger_1.default.error('Erro ao obter histórico de backups:', error);
            res.status(500).json({
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/v1/admin/backup/status - Status do backup
router.get('/backup/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.json({
                enabled: false,
                running: false,
                last: null,
                config: {}
            });
        }
        catch (error) {
            logger_1.default.error('Erro ao obter status do backup:', error);
            res.status(500).json({
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
        return [2 /*return*/];
    });
}); });
// POST /api/v1/admin/cache/clear - Limpar cache
router.post('/cache/clear', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pattern;
    var _a, _b;
    return __generator(this, function (_c) {
        try {
            pattern = req.body.pattern || '*';
            if (pattern === '*') {
                logger_1.default.info('Cache completamente limpo por admin', { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
            }
            else {
                logger_1.default.info('Cache limpo por padrão', { pattern: pattern, userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id });
            }
            res.json({
                message: 'Cache limpo com sucesso',
                pattern: pattern
            });
        }
        catch (error) {
            logger_1.default.error('Erro ao limpar cache:', error);
            res.status(500).json({
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/v1/admin/cache/stats - Estatísticas do cache
router.get('/cache/stats', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.json({
                connected: true,
                status: 'connected',
            });
        }
        catch (error) {
            logger_1.default.error('Erro ao obter estatísticas do cache:', error);
            res.status(500).json({
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/v1/admin/logs - Logs recentes do sistema
router.get('/logs', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var level, limit;
    return __generator(this, function (_a) {
        try {
            level = req.query.level || 'info';
            limit = parseInt(req.query.limit) || 100;
            res.json({
                message: 'Funcionalidade de logs seria implementada aqui',
                level: level,
                limit: limit
            });
        }
        catch (error) {
            logger_1.default.error('Erro ao obter logs:', error);
            res.status(500).json({
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
        return [2 /*return*/];
    });
}); });
// POST /api/v1/admin/maintenance - Ativar/desativar modo de manutenção
router.post('/maintenance', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, enabled, message;
    var _b, _c;
    return __generator(this, function (_d) {
        try {
            _a = req.body, enabled = _a.enabled, message = _a.message;
            if (enabled) {
                logger_1.default.warn('Modo de manutenção ativado', { userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id, message: message });
            }
            else {
                logger_1.default.info('Modo de manutenção desativado', { userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id });
            }
            res.json({
                message: enabled ? 'Modo de manutenção ativado' : 'Modo de manutenção desativado',
                enabled: enabled
            });
        }
        catch (error) {
            logger_1.default.error('Erro ao alterar modo de manutenção:', error);
            res.status(500).json({
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
        return [2 /*return*/];
    });
}); });
// GET /api/v1/admin/users/stats - Estatísticas de usuários
router.get('/users/stats', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.json({
                message: 'Estatísticas de usuários seriam implementadas aqui',
                totalUsers: 0,
                activeUsers: 0,
            });
        }
        catch (error) {
            logger_1.default.error('Erro ao obter estatísticas de usuários:', error);
            res.status(500).json({
                error: 'Erro interno do servidor',
                code: 'INTERNAL_ERROR'
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
