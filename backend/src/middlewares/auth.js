"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("../config");
var authMiddleware = function (req, res, next) {
    try {
        // Extrai o header de autorização
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: "Header de autorização não fornecido"
            });
            return;
        }
        // Verifica se o formato está correto (Bearer TOKEN)
        var tokenParts = authHeader.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            res.status(401).json({
                success: false,
                message: "Formato do token inválido. Use: Bearer <token>"
            });
            return;
        }
        var token = tokenParts[1];
        // Verifica se o JWT_SECRET está configurado adequadamente
        var jwtSecret = config_1.config.auth.jwtSecret;
        if (!jwtSecret || jwtSecret === 'supersecretjwtkey') {
            console.error("JWT_SECRET não configurado adequadamente nas variáveis de ambiente");
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor"
            });
            return;
        }
        // Verifica e decodifica o token
        var decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        // Valida se o payload contém os campos necessários
        if (!decoded.userId || !decoded.email) {
            res.status(403).json({
                success: false,
                message: "Token não contém dados válidos do usuário"
            });
            return;
        }
        // Adiciona os dados do usuário ao request
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            nome: decoded.nome,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        // Log do erro para debugging (em produção, use um logger adequado)
        console.error("Erro na autenticação:", error);
        // Trata diferentes tipos de erro do JWT
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: "Token expirado"
            });
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(403).json({
                success: false,
                message: "Token inválido"
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor"
            });
        }
    }
};
exports.authMiddleware = authMiddleware;
