import { Router } from "express";
import { GamificationController } from "../controllers/gamificationController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware);

/**
 * @route GET /api/v1/gamification/achievements
 * @desc Listar todas as conquistas disponíveis com status de desbloqueio
 * @access Private
 * @query {number} page - Página (padrão: 1)
 * @query {number} limit - Itens por página (padrão: 20)
 * @query {string} tipo_conquista - Filtrar por tipo de conquista
 * @query {string} raridade - Filtrar por raridade
 * @query {boolean} desbloqueada - Filtrar por status de desbloqueio
 */
router.get("/achievements", GamificationController.getAllAchievements);

/**
 * @route GET /api/v1/gamification/user-achievements
 * @desc Obter conquistas desbloqueadas pelo usuário
 * @access Private
 * @query {number} page - Página (padrão: 1)
 * @query {number} limit - Itens por página (padrão: 20)
 * @query {string} tipo_conquista - Filtrar por tipo de conquista
 * @query {string} raridade - Filtrar por raridade
 */
router.get("/user-achievements", GamificationController.getUserAchievements);

/**
 * @route GET /api/v1/gamification/stats
 * @desc Obter estatísticas de gamificação do usuário
 * @access Private
 */
router.get("/stats", GamificationController.getUserStats);

/**
 * @route POST /api/v1/gamification/unlock-achievement
 * @desc Desbloquear conquista manualmente (para testes ou casos especiais)
 * @access Private
 * @body {string} id_conquista - ID da conquista a ser desbloqueada
 * @body {number} valor_atingido - Valor atingido pelo usuário (opcional)
 */
router.post("/unlock-achievement", GamificationController.unlockAchievement);

export default router;


