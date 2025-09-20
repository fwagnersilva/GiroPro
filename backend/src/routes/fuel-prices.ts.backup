import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { fuelPricesCache, invalidateCache } from "../middlewares/cache";
import { FuelPricesController } from "../controllers/fuelPricesController";

const router = Router();

// Todas as rotas de preços de combustível requerem autenticação
router.use(authMiddleware);

// GET /api/v1/fuel-prices - Obter preços de combustível por região
router.get("/", fuelPricesCache(7200), FuelPricesController.getPrices);

// GET /api/v1/fuel-prices/history - Obter histórico de preços
router.get("/history", fuelPricesCache(3600), FuelPricesController.getPriceHistory);

// GET /api/v1/fuel-prices/comparison - Obter comparativo regional de preços
router.get("/comparison", fuelPricesCache(3600), FuelPricesController.getRegionalComparison);

// POST /api/v1/fuel-prices/report - Reportar preço observado pelo usuário
router.post("/report", invalidateCache(['fuel_prices:*']), FuelPricesController.reportPrice);

export default router;


