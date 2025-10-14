"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUserOrAdmin = exports.requireAdmin = exports.requireAuth = exports.authorizeRoles = exports.authenticateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("../config");
var logger_1 = require("../utils/logger");
var authenticateToken = function (req, res, next) {
    var authHeader = req.headers["authorization"];
    var token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        logger_1.default.warn("Token de acesso não fornecido", { ip: req.ip, userAgent: req.get("User-Agent") });
        return res.status(401).json({ error: "Token de acesso requerido" });
    }
    return jsonwebtoken_1.default.verify(token, config_1.config.auth.jwtSecret, function (err, user) {
        if (err) {
            logger_1.default.warn("Token inválido ou expirado", { token: token.substring(0, 10) + "...", error: err.message });
            return res.status(403).json({ error: "Token inválido ou expirado" });
        }
        req.user = user;
        logger_1.default.info("Usuário autenticado com sucesso", { userId: user.id, role: user.role });
        return next();
    });
};
exports.authenticateToken = authenticateToken;
var authorizeRoles = function () {
    var allowedRoles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        allowedRoles[_i] = arguments[_i];
    }
    return function (req, res, next) {
        if (!req.user) {
            logger_1.default.error('Tentativa de autorização sem autenticação prévia');
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            logger_1.default.warn('Acesso negado por falta de permissão', {
                userId: req.user.id,
                userRole: req.user.role,
                requiredRoles: allowedRoles,
                route: req.path
            });
            return res.status(403).json({ error: 'Acesso negado. Permissões insuficientes.' });
        }
        logger_1.default.info("Autorização concedida", {
            userId: req.user.id,
            userRole: req.user.role,
            route: req.path
        });
        return next();
    };
};
exports.authorizeRoles = authorizeRoles;
// Middleware combinado para autenticação e autorização
var requireAuth = function (req, res, next) {
    (0, exports.authenticateToken)(req, res, next);
};
exports.requireAuth = requireAuth;
exports.requireAdmin = [
    exports.authenticateToken,
    (0, exports.authorizeRoles)("admin")
];
exports.requireUserOrAdmin = [
    exports.authenticateToken,
    (0, exports.authorizeRoles)("user", "admin")
];
