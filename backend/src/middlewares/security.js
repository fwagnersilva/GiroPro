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
exports.securityLogger = exports.xssProtection = exports.sqlInjectionProtection = exports.sanitizeHeaders = exports.validateContentType = exports.clearBruteForceAttempts = exports.bruteForceProtection = exports.speedLimiter = exports.authRateLimit = exports.generalRateLimit = exports.securityHeaders = void 0;
var helmet_1 = require("helmet");
var express_rate_limit_1 = require("express-rate-limit");
var express_slow_down_1 = require("express-slow-down");
var cacheService_1 = require("../services/cacheService");
var logger_1 = require("../utils/logger");
// Configuração do Helmet para segurança
exports.securityHeaders = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});
// Rate limiting geral
exports.generalRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP por janela
    message: {
        error: 'Muitas tentativas. Tente novamente em 15 minutos.',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Rate limiting para autenticação (mais restritivo)
exports.authRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 tentativas de login por IP por janela
    message: {
        error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
        code: 'AUTH_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // não conta requests bem-sucedidos
});
// Slow down para requests frequentes
exports.speedLimiter = (0, express_slow_down_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    delayAfter: 50, // permitir 50 requests por janela sem delay
    delayMs: 500, // adicionar 500ms de delay para cada request adicional
    maxDelayMs: 20000, // máximo de 20 segundos de delay
    keyGenerator: function (req) {
        return req.ip || 'unknown';
    },
});
// Middleware para detectar ataques de força bruta por usuário
var bruteForceProtection = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, key, attempts, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                email = (_a = req.body) === null || _a === void 0 ? void 0 : _a.email;
                if (!email) {
                    return [2 /*return*/, next()];
                }
                key = "brute_force:".concat(email);
                return [4 /*yield*/, cacheService_1.cacheService.increment(key, 3600)];
            case 1:
                attempts = _b.sent();
                if (attempts > 10) {
                    logger_1.default.warn("Brute force attack detected for email: ".concat(email), {
                        ip: req.ip,
                        userAgent: req.get('User-Agent'),
                        attempts: attempts
                    });
                    return [2 /*return*/, res.status(429).json({
                            error: 'Conta temporariamente bloqueada devido a muitas tentativas de login.',
                            code: 'ACCOUNT_TEMPORARILY_LOCKED'
                        })];
                }
                // Adiciona informação ao request para uso posterior
                req.bruteForceAttempts = attempts;
                next();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                logger_1.default.error('Brute force protection error:', error_1);
                next();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.bruteForceProtection = bruteForceProtection;
// Middleware para limpar tentativas de força bruta em login bem-sucedido
var clearBruteForceAttempts = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var originalJson_1;
    return __generator(this, function (_a) {
        try {
            originalJson_1 = res.json;
            res.json = function (data) {
                var _a;
                // Se o login foi bem-sucedido (status 200 e tem token)
                if (res.statusCode === 200 && data.token && ((_a = req.body) === null || _a === void 0 ? void 0 : _a.email)) {
                    var key = "brute_force:".concat(req.body.email);
                    cacheService_1.cacheService.del(key).catch(function (error) {
                        logger_1.default.error('Failed to clear brute force attempts:', error);
                    });
                }
                return originalJson_1.call(this, data);
            };
            next();
        }
        catch (error) {
            logger_1.default.error('Clear brute force attempts error:', error);
            next();
        }
        return [2 /*return*/];
    });
}); };
exports.clearBruteForceAttempts = clearBruteForceAttempts;
// Middleware para validar Content-Type em requests POST/PUT
var validateContentType = function (req, res, next) {
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
        var contentType = req.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
            return res.status(400).json({
                error: "Content-Type deve ser application/json",
                code: "INVALID_CONTENT_TYPE"
            });
        }
    }
    return next();
};
exports.validateContentType = validateContentType;
// Middleware para sanitizar headers perigosos
var sanitizeHeaders = function (req, res, next) {
    // Remove headers potencialmente perigosos
    delete req.headers['x-forwarded-host'];
    delete req.headers['x-original-host'];
    // Valida User-Agent
    var userAgent = req.get('User-Agent');
    if (!userAgent || userAgent.length > 500) {
        logger_1.default.warn("Suspicious User-Agent from IP: ".concat(req.ip), {
            ip: req.ip,
            userAgent: userAgent === null || userAgent === void 0 ? void 0 : userAgent.substring(0, 100)
        });
    }
    next();
};
exports.sanitizeHeaders = sanitizeHeaders;
// Middleware para detectar tentativas de SQL injection
var sqlInjectionProtection = function (req, res, next) {
    var sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
        /(--|\/\*|\*\/|;|"|"|`)/,
        /(\bOR\b|\bAND\b).*(\b=\b|\bLIKE\b)/i
    ];
    var checkValue = function (value) {
        if (typeof value === "string") {
            return sqlPatterns.some(function (pattern) { return pattern.test(value); });
        }
        if (typeof value === "object" && value !== null) {
            return Object.values(value).some(checkValue);
        }
        return false;
    };
    var suspicious = checkValue(req.body) || checkValue(req.query) || checkValue(req.params);
    if (suspicious) {
        logger_1.default.warn("SQL injection attempt detected from IP: ".concat(req.ip), {
            ip: req.ip,
            userAgent: req.get("User-Agent"),
            path: req.path,
            body: req.body,
            query: req.query
        });
        return res.status(400).json({
            error: 'Requisição inválida detectada',
            code: 'INVALID_REQUEST'
        });
    }
    return next();
};
exports.sqlInjectionProtection = sqlInjectionProtection;
// Middleware para detectar tentativas de XSS
var xssProtection = function (req, res, next) {
    var xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
    ];
    var checkValue = function (value) {
        if (typeof value === 'string') {
            return xssPatterns.some(function (pattern) { return pattern.test(value); });
        }
        if (typeof value === 'object' && value !== null) {
            return Object.values(value).some(checkValue);
        }
        return false;
    };
    var suspicious = checkValue(req.body) || checkValue(req.query) || checkValue(req.params);
    if (suspicious) {
        logger_1.default.warn("XSS attempt detected from IP: ".concat(req.ip), {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            path: req.path,
            body: req.body,
            query: req.query
        });
        return res.status(400).json({
            error: 'Conteúdo perigoso detectado',
            code: 'DANGEROUS_CONTENT'
        });
    }
    return next();
};
exports.xssProtection = xssProtection;
// Middleware para log de segurança
var securityLogger = function (req, res, next) {
    var startTime = Date.now();
    res.on('finish', function () {
        var _a;
        var duration = Date.now() - startTime;
        var logData = {
            ip: req.ip,
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: duration,
            userAgent: req.get('User-Agent'),
            referer: req.get('Referer'),
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        };
        // Log requests suspeitos
        if (res.statusCode >= 400 || duration > 5000) {
            logger_1.default.warn('Suspicious request detected', logData);
        }
        else {
            logger_1.default.info('Request processed', logData);
        }
    });
    next();
};
exports.securityLogger = securityLogger;
