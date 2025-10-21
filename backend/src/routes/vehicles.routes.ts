import { Router } from "express";
import { VehiclesController } from "../controllers/vehiclesController";
import asyncHandler from "../utils/asyncHandler";
import rateLimit from "express-rate-limit";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

const vehiclesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.use(authMiddleware);
router.use(vehiclesLimiter);

router.get("/", asyncHandler(VehiclesController.getAll));
router.post("/", asyncHandler(VehiclesController.create));
router.get("/:id", asyncHandler(VehiclesController.getById));
router.put("/:id", asyncHandler(VehiclesController.update));
router.delete("/:id", asyncHandler(VehiclesController.delete));

export { router as vehicleRoutes };
