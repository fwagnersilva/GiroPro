import { Router } from 'express';
import { AdvancedAnalyticsController } from '../controllers/advancedAnalyticsController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

/**
 * @route GET /api/v1/analytics/consumption
 * @desc Análise de consumo por veículo
 * @access Private
 * @query {string} [data_inicio] - Data de início (ISO 8601)
 * @query {string} [data_fim] - Data de fim (ISO 8601)
 * @query {string} [id_veiculo] - UUID do veículo específico
 * @query {string} [periodo=30d] - Período predefinido (7d, 30d, 90d, 1y)
 */
router.get('/consumption', AdvancedAnalyticsController.getConsumptionAnalysis);

/**
 * @route GET /api/v1/analytics/productivity
 * @desc Análise de produtividade por veículo
 * @access Private
 * @query {string} [data_inicio] - Data de início (ISO 8601)
 * @query {string} [data_fim] - Data de fim (ISO 8601)
 * @query {string} [id_veiculo] - UUID do veículo específico
 * @query {string} [periodo=30d] - Período predefinido (7d, 30d, 90d, 1y)
 */
router.get('/productivity', AdvancedAnalyticsController.getProductivityAnalysis);

/**
 * @route GET /api/v1/analytics/patterns
 * @desc Identificação de padrões temporais
 * @access Private
 * @query {string} [data_inicio] - Data de início (ISO 8601)
 * @query {string} [data_fim] - Data de fim (ISO 8601)
 * @query {string} [id_veiculo] - UUID do veículo específico
 * @query {string} [periodo=30d] - Período predefinido (7d, 30d, 90d, 1y)
 */
router.get('/patterns', AdvancedAnalyticsController.getTemporalPatterns);

/**
 * @route GET /api/v1/analytics/vehicle-comparison
 * @desc Comparação entre veículos
 * @access Private
 * @query {string} [data_inicio] - Data de início (ISO 8601)
 * @query {string} [data_fim] - Data de fim (ISO 8601)
 * @query {string} [periodo=30d] - Período predefinido (7d, 30d, 90d, 1y)
 */
router.get('/vehicle-comparison', AdvancedAnalyticsController.getVehicleComparison);

export default router;

