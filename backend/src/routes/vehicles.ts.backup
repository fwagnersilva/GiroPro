import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { VehiclesController } from "../controllers/vehiclesController";

const router = Router();

// Todas as rotas de veículos requerem autenticação
router.use(authMiddleware);

// GET /api/v1/vehicles
router.get("/", VehiclesController.getAll);

// POST /api/v1/vehicles
router.post("/", VehiclesController.create);

// GET /api/v1/vehicles/:id
router.get("/:id", VehiclesController.getById);

// PUT /api/v1/vehicles/:id
router.put("/:id", VehiclesController.update);

// DELETE /api/v1/vehicles/:id
router.delete("/:id", VehiclesController.delete);

export { router as vehicleRoutes };


