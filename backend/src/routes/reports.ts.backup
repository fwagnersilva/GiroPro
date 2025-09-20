import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { ReportsController } from "../controllers/reportsController";
import { WeeklyMonthlyReportsController } from "../controllers/weeklyMonthlyReportsController";

const router = Router();

// Todas as rotas de relatórios requerem autenticação
router.use(authMiddleware);

// GET /api/v1/reports/journey-earnings - Relatório detalhado de ganhos por jornada
router.get("/journey-earnings", ReportsController.getJourneyEarningsReport);

// GET /api/v1/reports/expense-analysis - Relatório de análise de despesas
router.get("/expense-analysis", ReportsController.getExpenseAnalysisReport);

// GET /api/v1/reports/fuel-consumption - Relatório de consumo de combustível
router.get("/fuel-consumption", ReportsController.getFuelConsumptionReport);

// GET /api/v1/reports/weekly - Relatório semanal de faturamento, despesas e lucro
router.get("/weekly", WeeklyMonthlyReportsController.getWeeklyReport);

// GET /api/v1/reports/monthly - Relatório mensal de faturamento, despesas e lucro
router.get("/monthly", WeeklyMonthlyReportsController.getMonthlyReport);

// GET /api/v1/reports/weekly-comparison - Comparativo de múltiplas semanas
router.get("/weekly-comparison", WeeklyMonthlyReportsController.getWeeklyComparison);

// GET /api/v1/reports/monthly-comparison - Comparativo de múltiplos meses
router.get("/monthly-comparison", WeeklyMonthlyReportsController.getMonthlyComparison);

export { router as reportRoutes };


