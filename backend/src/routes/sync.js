"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncRoutes = void 0;
var express_1 = require("express");
var syncController_1 = require("../controllers/syncController");
var auth_1 = require("../middlewares/auth");
var router = (0, express_1.Router)();
exports.syncRoutes = router;
// Middleware de autenticação para todas as rotas
router.use(auth_1.authMiddleware);
// Upload de dados offline (batch processing)
router.post('/upload', syncController_1.uploadOfflineData);
// Download de dados para sincronização inicial
router.get('/download/initial', syncController_1.downloadInitialData);
// Download de dados para sincronização incremental
router.get('/download/incremental', syncController_1.downloadIncrementalData);
// Obter timestamp da última sincronização
router.get('/last-sync', syncController_1.getLastSyncTimestamp);
