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
exports.invalidateUserCache = exports.invalidateCache = exports.fuelPricesCache = exports.reportCache = exports.dashboardCache = exports.userCache = exports.cache = void 0;
var cacheService_1 = require("../services/cacheService");
var logger_1 = require("../utils/logger");
var cache = function (options) {
    if (options === void 0) { options = {}; }
    var _a = options.ttl, ttl = _a === void 0 ? 300 : _a, // 5 minutos por padrão
    keyGenerator = options.keyGenerator, skipCache = options.skipCache, _b = options.varyBy, varyBy = _b === void 0 ? [] : _b;
    return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var cacheKey_1, baseKey, varyParts, cachedData, originalJson_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Verifica se deve pular o cache
                    if (skipCache && skipCache(req)) {
                        return [2 /*return*/, next()];
                    }
                    // Só faz cache para métodos GET
                    if (req.method !== 'GET') {
                        return [2 /*return*/, next()];
                    }
                    if (keyGenerator) {
                        cacheKey_1 = keyGenerator(req);
                    }
                    else {
                        baseKey = "route:".concat(req.originalUrl);
                        varyParts = varyBy.map(function (key) {
                            if (req.headers[key]) {
                                return "".concat(key, ":").concat(req.headers[key]);
                            }
                            if (req.query[key]) {
                                return "".concat(key, ":").concat(req.query[key]);
                            }
                            return null;
                        }).filter(Boolean);
                        cacheKey_1 = varyParts.length > 0
                            ? "".concat(baseKey, ":").concat(varyParts.join(':'))
                            : baseKey;
                    }
                    return [4 /*yield*/, cacheService_1.cacheService.get(cacheKey_1)];
                case 1:
                    cachedData = _a.sent();
                    if (cachedData) {
                        logger_1.default.debug("Cache hit for key: ".concat(cacheKey_1));
                        res.setHeader('X-Cache', 'HIT');
                        return [2 /*return*/, res.json(cachedData)];
                    }
                    // Cache miss - intercepta a resposta
                    logger_1.default.debug("Cache miss for key: ".concat(cacheKey_1));
                    res.setHeader('X-Cache', 'MISS');
                    originalJson_1 = res.json;
                    res.json = function (data) {
                        // Só faz cache de respostas de sucesso
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            cacheService_1.cacheService.set(cacheKey_1, data, ttl).catch(function (error) {
                                logger_1.default.error('Failed to cache response:', error);
                            });
                        }
                        return originalJson_1.call(this, data);
                    };
                    next();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    logger_1.default.error('Cache middleware error:', error_1);
                    next();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
};
exports.cache = cache;
// Middleware específico para cache de usuário
var userCache = function (ttl) {
    if (ttl === void 0) { ttl = 1800; }
    return (0, exports.cache)({
        ttl: ttl,
        keyGenerator: function (req) {
            var _a;
            var userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 'anonymous';
            return "user_data:".concat(userId, ":").concat(req.originalUrl);
        },
        skipCache: function (req) { var _a; return !((_a = req.user) === null || _a === void 0 ? void 0 : _a.id); }
    });
};
exports.userCache = userCache;
// Middleware específico para cache de dashboard
var dashboardCache = function (ttl) {
    if (ttl === void 0) { ttl = 1800; }
    return (0, exports.cache)({
        ttl: ttl,
        keyGenerator: function (req) {
            var _a;
            var userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 'anonymous';
            var period = req.query.period || 'today';
            return "dashboard:".concat(userId, ":").concat(period);
        },
        skipCache: function (req) { var _a; return !((_a = req.user) === null || _a === void 0 ? void 0 : _a.id); },
        varyBy: ['period']
    });
};
exports.dashboardCache = dashboardCache;
// Middleware específico para cache de relatórios
var reportCache = function (ttl) {
    if (ttl === void 0) { ttl = 3600; }
    return (0, exports.cache)({
        ttl: ttl,
        keyGenerator: function (req) {
            var _a;
            var userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 'anonymous';
            var startDate = req.query.startDate || '';
            var endDate = req.query.endDate || '';
            var vehicleId = req.query.vehicleId || 'all';
            return "report:".concat(userId, ":").concat(startDate, ":").concat(endDate, ":").concat(vehicleId);
        },
        skipCache: function (req) { var _a; return !((_a = req.user) === null || _a === void 0 ? void 0 : _a.id); },
        varyBy: ['startDate', 'endDate', 'vehicleId']
    });
};
exports.reportCache = reportCache;
// Middleware para cache de preços de combustível
var fuelPricesCache = function (ttl) {
    if (ttl === void 0) { ttl = 7200; }
    return (0, exports.cache)({
        ttl: ttl,
        keyGenerator: function () { return 'fuel_prices:latest'; }
    });
};
exports.fuelPricesCache = fuelPricesCache;
// Middleware para invalidar cache
var invalidateCache = function (patterns) {
    return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var originalJson_2;
        return __generator(this, function (_a) {
            try {
                originalJson_2 = res.json;
                res.json = function (data) {
                    // Só invalida cache em respostas de sucesso
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        patterns.forEach(function (pattern) {
                            var _a;
                            var resolvedPattern = pattern.replace(':userId', ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || '');
                            cacheService_1.cacheService.delPattern(resolvedPattern).catch(function (error) {
                                logger_1.default.error('Failed to invalidate cache:', error);
                            });
                        });
                    }
                    return originalJson_2.call(this, data);
                };
                next();
            }
            catch (error) {
                logger_1.default.error('Cache invalidation middleware error:', error);
                next();
            }
            return [2 /*return*/];
        });
    }); };
};
exports.invalidateCache = invalidateCache;
// Middleware para invalidar cache de usuário específico
var invalidateUserCache = function () {
    return (0, exports.invalidateCache)(['user:*:userId*', 'dashboard:*:userId*', 'vehicles:*:userId*']);
};
exports.invalidateUserCache = invalidateUserCache;
