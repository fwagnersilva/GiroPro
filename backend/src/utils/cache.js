"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = exports.Cache = void 0;
var Cache = /** @class */ (function () {
    function Cache(options) {
        var _this = this;
        this.cache = new Map();
        this.ttl = (options === null || options === void 0 ? void 0 : options.ttl) || 5 * 60 * 1000; // Default 5 minutes
        this.maxSize = (options === null || options === void 0 ? void 0 : options.maxSize) || 1000; // Default 1000 items
        // Clean up expired items periodically
        setInterval(function () { return _this.cleanup(); }, this.ttl);
    }
    Cache.prototype.set = function (key, value, ttl) {
        if (this.cache.size >= this.maxSize) {
            this.evictOldest();
        }
        var expiry = Date.now() + (ttl || this.ttl);
        this.cache.set(key, { value: value, expiry: expiry });
    };
    Cache.prototype.get = function (key) {
        var item = this.cache.get(key);
        if (!item) {
            return undefined;
        }
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return undefined;
        }
        return item.value;
    };
    Cache.prototype.has = function (key) {
        return this.cache.has(key) && Date.now() <= this.cache.get(key).expiry;
    };
    Cache.prototype.delete = function (key) {
        return this.cache.delete(key);
    };
    Cache.prototype.invalidatePattern = function (pattern) {
        for (var _i = 0, _a = this.cache.keys(); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key.startsWith(pattern)) {
                this.cache.delete(key);
            }
        }
    };
    Cache.prototype.clearByPattern = function (pattern) {
        var count = 0;
        for (var _i = 0, _a = this.cache.keys(); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key.startsWith(pattern)) {
                this.cache.delete(key);
                count++;
            }
        }
        return Promise.resolve(count);
    };
    Cache.prototype.clear = function () {
        this.cache.clear();
    };
    Cache.prototype.cleanup = function () {
        var now = Date.now();
        for (var _i = 0, _a = this.cache.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], item = _b[1];
            if (now > item.expiry) {
                this.cache.delete(key);
            }
        }
    };
    Cache.prototype.evictOldest = function () {
        var oldestKey = this.cache.keys().next().value;
        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    };
    return Cache;
}());
exports.Cache = Cache;
// Instância global do cache
exports.cacheService = new Cache();
