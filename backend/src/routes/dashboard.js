"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../middlewares/auth");
var router = (0, express_1.Router)();
// Todas as rotas do dashboard requerem autenticação
router.use(auth_1.authMiddleware);
// Rotas do dashboard serão implementadas via dashboardRoutes
// TODO: Integrar dashboardRoutes com Express Router
exports.default = router;
