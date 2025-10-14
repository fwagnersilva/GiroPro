import { Router, Request, Response, NextFunction } from "express";
import { VehiclesController } from "../controllers/vehiclesController";
import asyncHandler from "../utils/asyncHandler";
import rateLimit from "express-rate-limit";

const router = Router();

// Rate limiter: limit each IP to 100 requests per 15 minutes for vehicle routes
const vehiclesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Todas as rotas de veículos requerem autenticação
router.use(asyncHandler((req, res, next) => next()));
// Apply rate limiter to all vehicle routes
router.use(vehiclesLimiter);

// GET /api/v1/vehicles
router.get("/", asyncHandler(VehiclesController.getAll));

// POST /api/v1/vehicles
router.post("/", asyncHandler(VehiclesController.create));

// GET /api/v1/vehicles/:id
router.get("/:id", asyncHandler(VehiclesController.getById));

// PUT /api/v1/vehicles/:id
router.put("/:id", asyncHandler(VehiclesController.update));

// DELETE /api/v1/vehicles/:id
router.delete("/:id", asyncHandler(VehiclesController.delete));

export { router as vehicleRoutes };


