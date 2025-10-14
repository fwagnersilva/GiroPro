"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRoutes = void 0;
var express_1 = require("express");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var vehiclesController_1 = require("../controllers/vehiclesController");
var asyncHandler_1 = require("../utils/asyncHandler");
var express_rate_limit_1 = require("express-rate-limit");
var router = (0, express_1.Router)();
exports.vehicleRoutes = router;
// Rate limiter: limit each IP to 100 requests per 15 minutes for vehicle routes
var vehiclesLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
// Todas as rotas de veículos requerem autenticação
router.use((0, asyncHandler_1.default)(authMiddleware_1.authenticateToken));
// Apply rate limiter to all vehicle routes
router.use(vehiclesLimiter);
// GET /api/v1/vehicles
router.get("/", (0, asyncHandler_1.default)(vehiclesController_1.VehiclesController.getAll));
// POST /api/v1/vehicles
router.post("/", (0, asyncHandler_1.default)(vehiclesController_1.VehiclesController.create));
// GET /api/v1/vehicles/:id
router.get("/:id", (0, asyncHandler_1.default)(vehiclesController_1.VehiclesController.getById));
// PUT /api/v1/vehicles/:id
router.put("/:id", (0, asyncHandler_1.default)(vehiclesController_1.VehiclesController.update));
// DELETE /api/v1/vehicles/:id
router.delete("/:id", (0, asyncHandler_1.default)(vehiclesController_1.VehiclesController.delete));
