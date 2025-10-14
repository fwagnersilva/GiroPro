"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
var express_1 = require("express");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var router = (0, express_1.Router)();
exports.userRoutes = router;
// GET /api/v1/users/profile - Usuários autenticados podem ver seu próprio perfil
router.get("/profile", authMiddleware_1.requireUserOrAdmin, function (req, res) {
    res.json({ message: "Rota de perfil do usuário - Em desenvolvimento" });
});
// PUT /api/v1/users/profile - Usuários autenticados podem atualizar seu próprio perfil
router.put("/profile", authMiddleware_1.requireUserOrAdmin, function (req, res) {
    res.json({ message: "Atualização de perfil - Em desenvolvimento" });
});
// GET /api/v1/users/backup - Apenas admins podem fazer backup
router.get("/backup", authMiddleware_1.requireAdmin, function (req, res) {
    res.json({ message: "Rota de backup de usuário - Em desenvolvimento" });
});
// POST /api/v1/users/restore - Apenas admins podem restaurar
router.post("/restore", authMiddleware_1.requireAdmin, function (req, res) {
    res.json({ message: "Rota de restore de usuário - Em desenvolvimento" });
});
