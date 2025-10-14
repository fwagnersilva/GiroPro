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
exports.InsightsController = void 0;
var logger_1 = require("../utils/logger");
var InsightsController = /** @class */ (function () {
    function InsightsController() {
    }
    InsightsController.generateInsights = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, idVeiculo, periodo_dias;
            var _a;
            return __generator(this, function (_b) {
                try {
                    userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.userId;
                    if (!userId) {
                        res.status(401).json({ error: 'Não autenticado' });
                        return [2 /*return*/];
                    }
                    idVeiculo = req.query.idVeiculo;
                    periodo_dias = parseInt(req.query.periodo_dias) || 30;
                    res.json({
                        message: 'Insights gerados com sucesso',
                        userId: userId,
                        idVeiculo: idVeiculo,
                        periodo_dias: periodo_dias,
                        timestamp: new Date().toISOString()
                    });
                }
                catch (error) {
                    logger_1.default.error('Erro ao gerar insights:', error);
                    res.status(500).json({ error: 'Erro ao gerar insights' });
                }
                return [2 /*return*/];
            });
        });
    };
    InsightsController.getInsightsSummary = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId;
            var _a;
            return __generator(this, function (_b) {
                try {
                    userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.userId;
                    if (!userId) {
                        res.status(401).json({ error: 'Não autenticado' });
                        return [2 /*return*/];
                    }
                    res.json({
                        message: 'Summary de insights',
                        userId: userId
                    });
                }
                catch (error) {
                    logger_1.default.error('Erro ao obter summary:', error);
                    res.status(500).json({ error: 'Erro ao obter summary' });
                }
                return [2 /*return*/];
            });
        });
    };
    InsightsController.getEfficiencyMetrics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId;
            var _a;
            return __generator(this, function (_b) {
                try {
                    userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.userId;
                    if (!userId) {
                        res.status(401).json({ error: 'Não autenticado' });
                        return [2 /*return*/];
                    }
                    res.json({
                        message: 'Métricas de eficiência',
                        userId: userId
                    });
                }
                catch (error) {
                    logger_1.default.error('Erro ao obter métricas:', error);
                    res.status(500).json({ error: 'Erro ao obter métricas' });
                }
                return [2 /*return*/];
            });
        });
    };
    InsightsController.getTrends = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId;
            var _a;
            return __generator(this, function (_b) {
                try {
                    userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.userId;
                    if (!userId) {
                        res.status(401).json({ error: 'Não autenticado' });
                        return [2 /*return*/];
                    }
                    res.json({
                        message: 'Análise de tendências',
                        userId: userId
                    });
                }
                catch (error) {
                    logger_1.default.error('Erro ao obter tendências:', error);
                    res.status(500).json({ error: 'Erro ao obter tendências' });
                }
                return [2 /*return*/];
            });
        });
    };
    InsightsController.getSeasonality = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId;
            var _a;
            return __generator(this, function (_b) {
                try {
                    userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.userId;
                    if (!userId) {
                        res.status(401).json({ error: 'Não autenticado' });
                        return [2 /*return*/];
                    }
                    res.json({
                        message: 'Análise de sazonalidade',
                        userId: userId
                    });
                }
                catch (error) {
                    logger_1.default.error('Erro ao obter sazonalidade:', error);
                    res.status(500).json({ error: 'Erro ao obter sazonalidade' });
                }
                return [2 /*return*/];
            });
        });
    };
    InsightsController.getCostAnalysis = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId;
            var _a;
            return __generator(this, function (_b) {
                try {
                    userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.userId;
                    if (!userId) {
                        res.status(401).json({ error: 'Não autenticado' });
                        return [2 /*return*/];
                    }
                    res.json({
                        message: 'Análise de custos',
                        userId: userId
                    });
                }
                catch (error) {
                    logger_1.default.error('Erro ao obter análise de custos:', error);
                    res.status(500).json({ error: 'Erro ao obter análise de custos' });
                }
                return [2 /*return*/];
            });
        });
    };
    return InsightsController;
}());
exports.InsightsController = InsightsController;
