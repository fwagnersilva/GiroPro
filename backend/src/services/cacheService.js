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
exports.cacheService = void 0;
var logger_1 = require("../utils/logger");
var CacheService = /** @class */ (function () {
    function CacheService() {
        this.redis = null;
        this.isConnected = false;
        // this.initializeRedis(); // Comentado para desabilitar o cache Redis
    }
    CacheService.prototype.initializeRedis = function () {
        try {
            var redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
            // this.redis = new Redis(redisUrl, {
            //   retryDelayOnFailover: 100,
            //   maxRetriesPerRequest: 3,
            //   lazyConnect: true,
            //   connectTimeout: 10000,
            //   commandTimeout: 5000,
            // });
            // this.redis.on('connect', () => {
            //   this.isConnected = true;
            //   logger.info('Redis connected successfully');
            // });
            // this.redis.on('error', (error) => {
            //   this.isConnected = false;
            //   logger.error('Redis connection error:', error);
            // });
            // this.redis.on('close', () => {
            //   this.isConnected = false;
            //   logger.warn('Redis connection closed');
            // });
        }
        catch (error) {
            logger_1.default.error('Failed to initialize Redis:', error);
        }
    };
    CacheService.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // if (!this.redis || !this.isConnected) {
                logger_1.default.warn('Redis not available, cache miss for key:', key); //   return null;
                // }
                try {
                    // const value = await this.redis.get(key);
                    // if (value) {
                    //   return JSON.parse(value) as T;
                    // }
                    return [2 /*return*/, null];
                }
                catch (error) {
                    logger_1.default.error('Cache get error:', error);
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    CacheService.prototype.set = function (key_1, value_1) {
        return __awaiter(this, arguments, void 0, function (key, value, ttlSeconds) {
            if (ttlSeconds === void 0) { ttlSeconds = 3600; }
            return __generator(this, function (_a) {
                // if (!this.redis || !this.isConnected) {
                //   logger.warn('Redis not available, skipping cache set for key:', key);
                //   return false;
                // }
                try {
                    // const serializedValue = JSON.stringify(value);
                    // await this.redis.setex(key, ttlSeconds, serializedValue);
                    return [2 /*return*/, true];
                }
                catch (error) {
                    logger_1.default.error('Cache set error:', error);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    CacheService.prototype.del = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // if (!this.redis || !this.isConnected) {
                //   logger.warn('Redis not available, skipping cache delete for key:', key);
                //   return false;
                // }
                try {
                    // await this.redis.del(key);
                    return [2 /*return*/, true];
                }
                catch (error) {
                    logger_1.default.error('Cache delete error:', error);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    CacheService.prototype.delPattern = function (pattern) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // if (!this.redis || !this.isConnected) {
                //   logger.warn('Redis not available, skipping cache pattern delete:', pattern);
                //   return false;
                // }
                try {
                    // const keys = await this.redis.keys(pattern);
                    // if (keys.length > 0) {
                    //   await this.redis.del(...keys);
                    // }
                    return [2 /*return*/, true];
                }
                catch (error) {
                    logger_1.default.error('Cache pattern delete error:', error);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    CacheService.prototype.exists = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // if (!this.redis || !this.isConnected) {
                //   return false;
                // }
                try {
                    // const result = await this.redis.exists(key);
                    // return result === 1;
                    return [2 /*return*/, false];
                }
                catch (error) {
                    logger_1.default.error('Cache exists error:', error);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    CacheService.prototype.increment = function (key_1) {
        return __awaiter(this, arguments, void 0, function (key, ttlSeconds) {
            if (ttlSeconds === void 0) { ttlSeconds = 3600; }
            return __generator(this, function (_a) {
                // if (!this.redis || !this.isConnected) {
                //   logger.warn('Redis not available, skipping cache increment for key:', key);
                //   return 0;
                // }
                try {
                    // const result = await this.redis.incr(key);
                    // if (result === 1) {
                    //   // Se é a primeira vez, define o TTL
                    //   await this.redis.expire(key, ttlSeconds);
                    // }
                    return [2 /*return*/, 0];
                }
                catch (error) {
                    logger_1.default.error('Cache increment error:', error);
                    return [2 /*return*/, 0];
                }
                return [2 /*return*/];
            });
        });
    };
    CacheService.prototype.getTTL = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // if (!this.redis || !this.isConnected) {
                //   return -1;
                // }
                try {
                    // return await this.redis.ttl(key);
                    return [2 /*return*/, -1];
                }
                catch (error) {
                    logger_1.default.error('Cache TTL error:', error);
                    return [2 /*return*/, -1];
                }
                return [2 /*return*/];
            });
        });
    };
    CacheService.prototype.flushAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // if (!this.redis || !this.isConnected) {
                //   logger.warn('Redis not available, skipping cache flush');
                //   return false;
                // }
                try {
                    // await this.redis.flushall();
                    // logger.info('Cache flushed successfully');
                    return [2 /*return*/, true];
                }
                catch (error) {
                    logger_1.default.error('Cache flush error:', error);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    CacheService.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    CacheService.prototype.isHealthy = function () {
        return this.isConnected;
    };
    // Métodos específicos para o GiroPro
    // Cache para dados de usuário
    CacheService.prototype.getUserCache = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null]; // this.get(`user:${userId}`);
            });
        });
    };
    CacheService.prototype.setUserCache = function (userId_1, userData_1) {
        return __awaiter(this, arguments, void 0, function (userId, userData, ttlSeconds) {
            if (ttlSeconds === void 0) { ttlSeconds = 1800; }
            return __generator(this, function (_a) {
                return [2 /*return*/, true]; // this.set(`user:${userId}`, userData, ttlSeconds);
            });
        });
    };
    CacheService.prototype.invalidateUserCache = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true]; // this.delPattern(`user:${userId}*`);
            });
        });
    };
    // Cache para dados de veículos
    CacheService.prototype.getVehicleCache = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null]; // this.get(`vehicles:${userId}`);
            });
        });
    };
    CacheService.prototype.setVehicleCache = function (userId_1, vehicleData_1) {
        return __awaiter(this, arguments, void 0, function (userId, vehicleData, ttlSeconds) {
            if (ttlSeconds === void 0) { ttlSeconds = 3600; }
            return __generator(this, function (_a) {
                return [2 /*return*/, true]; // this.set(`vehicles:${userId}`, vehicleData, ttlSeconds);
            });
        });
    };
    CacheService.prototype.invalidateVehicleCache = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true]; // this.delPattern(`vehicles:${userId}*`);
            });
        });
    };
    // Cache para relatórios e dashboard
    CacheService.prototype.getDashboardCache = function (userId, period) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null]; // this.get(`dashboard:${userId}:${period}`);
            });
        });
    };
    CacheService.prototype.setDashboardCache = function (userId_1, period_1, dashboardData_1) {
        return __awaiter(this, arguments, void 0, function (userId, period, dashboardData, ttlSeconds) {
            if (ttlSeconds === void 0) { ttlSeconds = 1800; }
            return __generator(this, function (_a) {
                return [2 /*return*/, true]; // this.set(`dashboard:${userId}:${period}`, dashboardData, ttlSeconds);
            });
        });
    };
    CacheService.prototype.invalidateDashboardCache = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true]; // this.delPattern(`dashboard:${userId}*`);
            });
        });
    };
    // Cache para preços de combustível
    CacheService.prototype.getFuelPricesCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null]; // this.get('fuel_prices:latest');
            });
        });
    };
    CacheService.prototype.setFuelPricesCache = function (pricesData_1) {
        return __awaiter(this, arguments, void 0, function (pricesData, ttlSeconds) {
            if (ttlSeconds === void 0) { ttlSeconds = 7200; }
            return __generator(this, function (_a) {
                return [2 /*return*/, true]; // this.set('fuel_prices:latest', pricesData, ttlSeconds);
            });
        });
    };
    // Rate limiting
    CacheService.prototype.checkRateLimit = function (identifier, limit, windowSeconds) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // const key = `rate_limit:${identifier}`;
                // const current = await this.increment(key, windowSeconds);
                // const ttl = await this.getTTL(key);
                return [2 /*return*/, {
                        allowed: true, // current <= limit,
                        remaining: 100, // Math.max(0, limit - current),
                        resetTime: Date.now() + (windowSeconds * 1000) // Date.now() + (ttl * 1000)
                    }];
            });
        });
    };
    return CacheService;
}());
exports.cacheService = new CacheService();
