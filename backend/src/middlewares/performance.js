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
exports.detailedMetrics = exports.healthCheck = exports.memoryLeakDetector = exports.optimizeHeaders = exports.cacheHeaders = exports.payloadSizeLimit = exports.requestTimeout = exports.performanceMonitor = exports.compressionMiddleware = void 0;
var compression_1 = require("compression");
var performanceService_1 = require("../services/performanceService");
var logger_1 = require("../utils/logger");
// Middleware de compressão
exports.compressionMiddleware = (0, compression_1.default)({
    filter: function (req, res) {
        // Não comprimir se o cliente não suporta
        if (req.headers['x-no-compression']) {
            return false;
        }
        // Usar compressão padrão do compression
        return compression_1.default.filter(req, res);
    },
    level: 6, // Nível de compressão balanceado
    threshold: 1024, // Só comprimir arquivos > 1KB
});
// Middleware para monitorar performance de requests
var performanceMonitor = function (req, res, next) {
    var startTime = Date.now();
    var startCpuUsage = process.cpuUsage();
    // Interceptar o final da resposta
    res.on('finish', function () {
        var _a;
        var duration = Date.now() - startTime;
        var endCpuUsage = process.cpuUsage(startCpuUsage);
        var memoryUsage = process.memoryUsage();
        // Adicionar métrica ao serviço de performance
        performanceService_1.performanceService.addMetric({
            timestamp: Date.now(),
            endpoint: ((_a = req.route) === null || _a === void 0 ? void 0 : _a.path) || req.path,
            method: req.method,
            duration: duration,
            statusCode: res.statusCode,
            memoryUsage: memoryUsage,
            cpuUsage: endCpuUsage
        });
        // Adicionar headers de performance para debug
        if (process.env.NODE_ENV === 'development') {
            res.setHeader('X-Response-Time', "".concat(duration, "ms"));
            res.setHeader('X-Memory-Usage', "".concat((memoryUsage.heapUsed / 1024 / 1024).toFixed(2), "MB"));
        }
    });
    next();
};
exports.performanceMonitor = performanceMonitor;
var requestTimeout = function (timeoutMs) {
    if (timeoutMs === void 0) { timeoutMs = 30000; }
    return function (req, res, next) {
        var timeout = setTimeout(function () {
            if (!res.headersSent) {
                logger_1.default.warn("Request timeout for ".concat(req.method, " ").concat(req.path), {
                    ip: req.ip,
                    userAgent: req.get("User-Agent"),
                    timeout: timeoutMs
                });
                res.status(408).json({
                    error: "Request timeout",
                    code: "REQUEST_TIMEOUT"
                });
            }
        }, timeoutMs);
        res.on("finish", function () {
            clearTimeout(timeout);
        });
        next();
    };
};
exports.requestTimeout = requestTimeout;
// Middleware para limitar tamanho do payload
var payloadSizeLimit = function (maxSizeBytes) {
    if (maxSizeBytes === void 0) { maxSizeBytes = 10 * 1024 * 1024; }
    return function (req, res, next) {
        var contentLength = parseInt(req.get("Content-Length") || "0");
        if (contentLength > maxSizeBytes) {
            logger_1.default.warn("Payload too large: ".concat(contentLength, " bytes"), {
                ip: req.ip,
                path: req.path,
                maxSize: maxSizeBytes
            });
            return res.status(413).json({
                error: "Payload muito grande",
                code: "PAYLOAD_TOO_LARGE",
                maxSize: maxSizeBytes
            });
        }
        return next();
    };
};
exports.payloadSizeLimit = payloadSizeLimit;
// Middleware para adicionar headers de cache
var cacheHeaders = function (maxAge) {
    if (maxAge === void 0) { maxAge = 300; }
    return function (req, res, next) {
        if (req.method === "GET") {
            res.setHeader("Cache-Control", "public, max-age=".concat(maxAge));
            res.setHeader("ETag", "\"".concat(Date.now(), "\""));
        }
        else {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        }
        next();
    };
};
exports.cacheHeaders = cacheHeaders;
// Middleware para otimizar headers de resposta
var optimizeHeaders = function (req, res, next) {
    // Remover headers desnecessários
    res.removeHeader("X-Powered-By");
    // Adicionar headers de performance
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    // Headers para melhor performance
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Keep-Alive", "timeout=5, max=1000");
    next();
};
exports.optimizeHeaders = optimizeHeaders;
// Middleware para detectar memory leaks
var memoryLeakDetector = function (req, res, next) {
    var memoryBefore = process.memoryUsage();
    res.on("finish", function () {
        var memoryAfter = process.memoryUsage();
        var heapDiff = memoryAfter.heapUsed - memoryBefore.heapUsed;
        // Se o heap cresceu mais que 50MB em uma request, pode ser um leak
        if (heapDiff > 50 * 1024 * 1024) {
            logger_1.default.warn("Potential memory leak detected", {
                endpoint: req.path,
                method: req.method,
                heapDiff: "".concat((heapDiff / 1024 / 1024).toFixed(2), "MB"),
                memoryBefore: "".concat((memoryBefore.heapUsed / 1024 / 1024).toFixed(2), "MB"),
                memoryAfter: "".concat((memoryAfter.heapUsed / 1024 / 1024).toFixed(2), "MB")
            });
        }
    });
    next();
};
exports.memoryLeakDetector = memoryLeakDetector;
var healthCheck = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var health, alerts, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(req.path === "/health" || req.path === "/api/health")) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, performanceService_1.performanceService.getSystemHealth()];
            case 2:
                health = _a.sent();
                alerts = performanceService_1.performanceService.getPerformanceAlerts();
                res.status(health.status === "critical" ? 503 : 200).json({
                    status: health.status,
                    timestamp: new Date().toISOString(),
                    uptime: health.uptime,
                    memory: health.memory,
                    cache: health.cache,
                    database: health.database,
                    metrics: health.metrics,
                    alerts: alerts
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                logger_1.default.error("Health check error:", error_1);
                res.status(503).json({
                    status: "error",
                    message: "Health check failed"
                });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                next();
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.healthCheck = healthCheck;
var detailedMetrics = function (req, res, next) {
    if (process.env.NODE_ENV === "development" && req.path === "/metrics") {
        var stats = performanceService_1.performanceService.getAggregatedStats(60);
        var slowestEndpoints = performanceService_1.performanceService.getSlowestEndpoints(10);
        var alerts = performanceService_1.performanceService.getPerformanceAlerts();
        res.json({
            stats: stats,
            slowestEndpoints: slowestEndpoints,
            alerts: alerts,
            memory: process.memoryUsage(),
            uptime: process.uptime()
        });
    }
    else {
        next();
    }
};
exports.detailedMetrics = detailedMetrics;
