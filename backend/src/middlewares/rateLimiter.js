"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = exports.dashboardRateLimit = exports.apiRateLimit = exports.authRateLimit = exports.generalRateLimit = void 0;
var RateLimiter = /** @class */ (function () {
    function RateLimiter(options) {
        var _this = this;
        this.store = {};
        this.middleware = function (req, res, next) {
            var key = _this.getKey(req);
            var now = Date.now();
            // Limpar entradas expiradas
            _this.cleanup(now);
            // Verificar se a chave existe no store
            if (!_this.store[key]) {
                _this.store[key] = {
                    count: 1,
                    resetTime: now + _this.windowMs
                };
                return next();
            }
            var record = _this.store[key];
            // Se o tempo de reset passou, reiniciar o contador
            if (now > record.resetTime) {
                record.count = 1;
                record.resetTime = now + _this.windowMs;
                return next();
            }
            // Incrementar contador
            record.count++;
            // Verificar se excedeu o limite
            if (record.count > _this.maxRequests) {
                var timeUntilReset = Math.ceil((record.resetTime - now) / 1000);
                res.status(429).json({
                    success: false,
                    error: {
                        message: _this.message,
                        code: 'RATE_LIMIT_EXCEEDED',
                        retryAfter: timeUntilReset
                    }
                });
                return;
            }
            // Adicionar headers informativos
            res.set({
                'X-RateLimit-Limit': _this.maxRequests.toString(),
                'X-RateLimit-Remaining': (_this.maxRequests - record.count).toString(),
                'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
            });
            next();
        };
        this.windowMs = options.windowMs;
        this.maxRequests = options.maxRequests;
        this.message = options.message || 'Muitas requisições. Tente novamente mais tarde.';
    }
    RateLimiter.prototype.getKey = function (req) {
        // Usar IP do usuário como chave
        var ip = req.ip || req.connection.remoteAddress || 'unknown';
        // Se houver usuário autenticado, usar o ID do usuário
        var userId = req.userId;
        if (userId) {
            return "user:".concat(userId);
        }
        return "ip:".concat(ip);
    };
    RateLimiter.prototype.cleanup = function (now) {
        var _this = this;
        Object.keys(this.store).forEach(function (key) {
            if (now > _this.store[key].resetTime) {
                delete _this.store[key];
            }
        });
    };
    return RateLimiter;
}());
exports.RateLimiter = RateLimiter;
// Rate limiters pré-configurados
exports.generalRateLimit = new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 100, // 100 requisições por 15 minutos
    message: 'Muitas requisições. Limite de 100 requisições por 15 minutos.'
});
exports.authRateLimit = new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 5, // 5 tentativas de login por 15 minutos
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});
exports.apiRateLimit = new RateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minuto
    maxRequests: 60, // 60 requisições por minuto
    message: 'Muitas requisições à API. Limite de 60 requisições por minuto.'
});
exports.dashboardRateLimit = new RateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minuto
    maxRequests: 30, // 30 requisições por minuto para dashboard
    message: 'Muitas requisições ao dashboard. Limite de 30 requisições por minuto.'
});
