import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { VehiclesController } from "../controllers/vehiclesController";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limiter: limit each IP to 100 requests per 15 minutes for vehicle routes
const vehiclesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Todas as rotas de veículos requerem autenticação
router.use(authMiddleware);
// Apply rate limiter to all vehicle routes
router.use(vehiclesLimiter);

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


