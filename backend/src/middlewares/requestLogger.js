"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
var requestLogger = function (req, res, next) {
    console.log("[".concat(new Date().toISOString(), "] Request:"), req.method, req.originalUrl);
    var originalJson = res.json;
    res.json = function (body) {
        console.log("[".concat(new Date().toISOString(), "] Response:"), req.method, req.originalUrl, body ? "- Body: ".concat(JSON.stringify(body)) :
            req.originalUrl.includes("login") || req.originalUrl.includes("register") ? "- Body: [REDACTED]" : "");
        return originalJson.call(this, body);
    };
    next();
};
exports.requestLogger = requestLogger;
