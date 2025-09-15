import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Todas as rotas de usuários requerem autenticação
router.use(authMiddleware);

// GET /api/v1/users/profile
router.get("/profile", (req, res) => {
  res.json({ message: "Rota de perfil do usuário - Em desenvolvimento" });
});

// PUT /api/v1/users/profile
router.put("/profile", (req, res) => {
  res.json({ message: "Atualização de perfil - Em desenvolvimento" });
});

export { router as userRoutes };




// GET /api/v1/users/backup
router.get("/backup", (req, res) => {
  res.json({ message: "Rota de backup de usuário - Em desenvolvimento" });
});


// POST /api/v1/users/restore
router.post("/restore", (req, res) => {
  res.json({ message: "Rota de restauração de usuário - Em desenvolvimento" });
});

