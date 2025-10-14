"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDownloadRoutes = void 0;
var express_1 = require("express");
var syncDownloadController_1 = require("../controllers/syncDownloadController");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
exports.syncDownloadRoutes = router;
// Rotas protegidas que requerem autenticação
router.get('/download/all', auth_1.authMiddleware, syncDownloadController_1.SyncDownloadController.downloadAll);
router.get('/download/since', auth_1.authMiddleware, syncDownloadController_1.SyncDownloadController.downloadSince);
