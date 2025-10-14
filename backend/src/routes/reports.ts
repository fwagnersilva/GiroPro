import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { ReportsController } from "../controllers/reportsController";
import { WeeklyMonthlyReportsController } from "../controllers/weeklyMonthlyReportsController";
import { AuthenticatedRequest } from '../types';

const router = Router();

// Todas as rotas de relatórios requerem autenticação
router.use(authMiddleware);

// GET /api/v1/reports/journey-earnings - Relatório detalhado de ganhos por jornada
router.get("/journey-earnings", (req, res) => ReportsController.getJourneyEarningsReport(req as AuthenticatedRequest, res));

// GET /api/v1/reports/expense-analysis - Relatório de análise de despesas
router.get("/expense-analysis", (req, res) => ReportsController.getExpenseAnalysisReport(req as AuthenticatedRequest, res));

// GET /api/v1/reports/fuel-consumption - Relatório de consumo de combustível
router.get("/fuel-consumption", (req, res) => ReportsController.getFuelConsumptionReport(req as AuthenticatedRequest, res));

// GET /api/v1/reports/weekly - Relatório semanal de faturamento, despesas e lucro
router.get("/weekly", (req, res, next) => WeeklyMonthlyReportsController.getWeeklyReport(req, res, next));

// GET /api/v1/reports/monthly - Relatório mensal de faturamento, despesas e lucro
router.get("/monthly", (req, res, next) => WeeklyMonthlyReportsController.getMonthlyReport(req, res, next));

// GET /api/v1/reports/weekly-comparison - Comparativo de múltiplas semanas
router.get("/weekly-comparison", (req, res, next) => WeeklyMonthlyReportsController.getWeeklyComparison(req, res, next));

// GET /api/v1/reports/monthly-comparison - Comparativo de múltiplos meses
router.get("/monthly-comparison", (req, res, next) => WeeklyMonthlyReportsController.getMonthlyComparison(req, res, next));

export { router as reportRoutes };




// GET /api/v1/reports/journeys/csv - Exportar relatório de jornadas em CSV
router.get("/journeys/csv", (req, res) => ReportsController.getJourneysCsvReport(req as AuthenticatedRequest, res));



// GET /api/v1/reports/expenses/pdf - Exportar relatório de despesas em PDF
router.get("/expenses/pdf", (req, res) => ReportsController.getExpensesPdfReport(req as AuthenticatedRequest, res));

