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
exports.performanceService = void 0;
var logger_1 = require("../utils/logger");
var cacheService_1 = require("./cacheService");
var PerformanceService = /** @class */ (function () {
    function PerformanceService() {
        this.metrics = [];
        this.maxMetrics = 1000; // Manter apenas as últimas 1000 métricas
        this.startTime = Date.now();
    }
    // Adicionar métrica de performance
    PerformanceService.prototype.addMetric = function (metric) {
        this.metrics.push(metric);
        // Manter apenas as métricas mais recentes
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }
        // Log de requests lentos
        if (metric.duration > 2000) {
            logger_1.default.warn('Slow request detected', { endpoint: metric.endpoint,
                method: metric.method,
                duration: metric.duration,
                statusCode: metric.statusCode
            });
        }
        // Salvar métricas agregadas no cache a cada 100 requests
        if (this.metrics.length % 100 === 0) {
            this.saveAggregatedMetrics();
        }
    };
    // Obter métricas dos últimos N minutos
    PerformanceService.prototype.getMetrics = function (minutes) {
        if (minutes === void 0) { minutes = 60; }
        var cutoff = Date.now() - (minutes * 60 * 1000);
        return this.metrics.filter(function (metric) { return metric.timestamp > cutoff; });
    };
    // Obter estatísticas agregadas
    PerformanceService.prototype.getAggregatedStats = function (minutes) {
        if (minutes === void 0) { minutes = 60; }
        var recentMetrics = this.getMetrics(minutes);
        if (recentMetrics.length === 0) {
            return {
                totalRequests: 0,
                avgResponseTime: 0,
                minResponseTime: 0,
                maxResponseTime: 0,
                errorRate: 0,
                requestsPerMinute: 0,
                statusCodes: {},
                endpoints: {}
            };
        }
        var durations = recentMetrics.map(function (m) { return m.duration; });
        var errors = recentMetrics.filter(function (m) { return m.statusCode >= 400; });
        // Agrupar por status code
        var statusCodes = {};
        recentMetrics.forEach(function (metric) {
            statusCodes[metric.statusCode] = (statusCodes[metric.statusCode] || 0) + 1;
        });
        // Agrupar por endpoint
        var endpoints = {};
        recentMetrics.forEach(function (metric) {
            var key = "".concat(metric.method, " ").concat(metric.endpoint);
            if (!endpoints[key]) {
                endpoints[key] = { count: 0, avgDuration: 0 };
            }
            endpoints[key].count++;
            endpoints[key].avgDuration = (endpoints[key].avgDuration + metric.duration) / 2;
        });
        return {
            totalRequests: recentMetrics.length,
            avgResponseTime: durations.reduce(function (a, b) { return a + b; }, 0) / durations.length,
            minResponseTime: Math.min.apply(Math, durations),
            maxResponseTime: Math.max.apply(Math, durations),
            errorRate: (errors.length / recentMetrics.length) * 100,
            requestsPerMinute: recentMetrics.length / minutes,
            statusCodes: statusCodes,
            endpoints: endpoints
        };
    };
    // Verificar saúde do sistema
    PerformanceService.prototype.getSystemHealth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var memoryUsage, uptime, stats, cacheHealthy, memoryPercentage, status;
            return __generator(this, function (_a) {
                memoryUsage = process.memoryUsage();
                uptime = process.uptime();
                stats = this.getAggregatedStats(5);
                cacheHealthy = cacheService_1.cacheService.isHealthy();
                memoryPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
                status = 'healthy';
                if (memoryPercentage > 90 || stats.avgResponseTime > 3000 || stats.errorRate > 10) {
                    status = 'critical';
                }
                else if (memoryPercentage > 70 || stats.avgResponseTime > 1000 || stats.errorRate > 5) {
                    status = 'warning';
                }
                return [2 /*return*/, {
                        status: status,
                        uptime: uptime,
                        memory: {
                            used: memoryUsage.heapUsed,
                            total: memoryUsage.heapTotal,
                            percentage: memoryPercentage
                        },
                        cache: {
                            connected: cacheHealthy,
                            status: cacheHealthy ? 'connected' : 'disconnected'
                        },
                        database: {
                            connected: true, // TODO: Implementar verificação real do banco
                            status: 'connected'
                        },
                        metrics: {
                            avgResponseTime: stats.avgResponseTime,
                            requestsPerMinute: stats.requestsPerMinute,
                            errorRate: stats.errorRate
                        }
                    }];
            });
        });
    };
    // Salvar métricas agregadas no cache
    PerformanceService.prototype.saveAggregatedMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stats, dailyStats, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        stats = this.getAggregatedStats(60);
                        return [4 /*yield*/, cacheService_1.cacheService.set('performance:stats:hourly', stats, 3600)];
                    case 1:
                        _a.sent();
                        dailyStats = this.getAggregatedStats(1440);
                        return [4 /*yield*/, cacheService_1.cacheService.set('performance:stats:daily', dailyStats, 86400)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        logger_1.default.error('Failed to save aggregated metrics:', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Obter métricas salvas do cache
    PerformanceService.prototype.getCachedStats = function (period) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, cacheService_1.cacheService.get("performance:stats:".concat(period))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        logger_1.default.error("Failed to get cached stats:", error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Limpar métricas antigas
    PerformanceService.prototype.clearOldMetrics = function () {
        var cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 horas
        this.metrics = this.metrics.filter(function (metric) { return metric.timestamp > cutoff; });
        logger_1.default.info("Cleared old metrics, ".concat(this.metrics.length, " metrics remaining"));
    };
    // Obter top endpoints mais lentos
    PerformanceService.prototype.getSlowestEndpoints = function (limit) {
        if (limit === void 0) { limit = 10; }
        var recentMetrics = this.getMetrics(60);
        var endpointStats = {};
        recentMetrics.forEach(function (metric) {
            var key = "".concat(metric.method, " ").concat(metric.endpoint);
            if (!endpointStats[key]) {
                endpointStats[key] = { count: 0, totalDuration: 0, avgDuration: 0 };
            }
            endpointStats[key].count++;
            endpointStats[key].totalDuration += metric.duration;
            endpointStats[key].avgDuration = endpointStats[key].totalDuration / endpointStats[key].count;
        });
        return Object.entries(endpointStats)
            .sort(function (_a, _b) {
            var a = _a[1];
            var b = _b[1];
            return b.avgDuration - a.avgDuration;
        })
            .slice(0, limit)
            .map(function (_a) {
            var endpoint = _a[0], stats = _a[1];
            return (__assign({ endpoint: endpoint }, stats));
        });
    };
    // Obter alertas de performance
    PerformanceService.prototype.getPerformanceAlerts = function () {
        var alerts = [];
        var stats = this.getAggregatedStats(5);
        var memoryUsage = process.memoryUsage();
        var memoryPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
        if (stats.avgResponseTime > 2000) {
            alerts.push({
                type: 'warning',
                message: "Tempo de resposta m\u00E9dio alto: ".concat(stats.avgResponseTime.toFixed(0), "ms"),
                metric: 'response_time',
                value: stats.avgResponseTime
            });
        }
        if (stats.errorRate > 5) {
            alerts.push({
                type: 'error',
                message: "Taxa de erro alta: ".concat(stats.errorRate.toFixed(1), "%"),
                metric: 'error_rate',
                value: stats.errorRate
            });
        }
        if (memoryPercentage > 80) {
            alerts.push({
                type: 'warning',
                message: "Uso de mem\u00F3ria alto: ".concat(memoryPercentage.toFixed(1), "%"),
                metric: 'memory_usage',
                value: memoryPercentage
            });
        }
        if (!cacheService_1.cacheService.isHealthy()) {
            alerts.push({
                type: 'error',
                message: 'Cache Redis desconectado',
                metric: 'cache_status',
                value: 'disconnected'
            });
        }
        return alerts;
    };
    return PerformanceService;
}());
exports.performanceService = new PerformanceService();
// Limpar métricas antigas a cada hora
setInterval(function () {
    exports.performanceService.clearOldMetrics();
}, 60 * 60 * 1000);
