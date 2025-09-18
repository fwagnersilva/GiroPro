import { Router } from "express";
import { requireUserOrAdmin, requireAdmin } from "../middlewares/authMiddleware";

const router = Router();

// GET /api/v1/users/profile - Usuários autenticados podem ver seu próprio perfil
router.get("/profile", requireUserOrAdmin, (req, res) => {
  res.json({ message: "Rota de perfil do usuário - Em desenvolvimento" });
});

// PUT /api/v1/users/profile - Usuários autenticados podem atualizar seu próprio perfil
router.put("/profile", requireUserOrAdmin, (req, res) => {
  res.json({ message: "Atualização de perfil - Em desenvolvimento" });
});

// GET /api/v1/users/backup - Apenas admins podem fazer backup
router.get("/backup", requireAdmin, (req, res) => {
  res.json({ message: "Rota de backup de usuário - Em desenvolvimento" });
});

// POST /api/v1/users/restore - Apenas admins podem restaurar
router.post("/restore", requireAdmin, (req, res) => {
  res.json({ message: "Rota de restore de usuário - Em desenvolvimento" });
});

export { router as userRoutes };

