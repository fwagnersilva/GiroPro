"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.journeyRoutes = void 0;
var express_1 = require("express");
var journeysController_1 = require("../controllers/journeysController");
var auth_1 = require("../middlewares/auth"); // Importação nomeada
var router = (0, express_1.Router)();
router.post('/', auth_1.authMiddleware, journeysController_1.createJourney);
router.get('/', auth_1.authMiddleware, journeysController_1.getJourneys);
router.get('/:id', auth_1.authMiddleware, journeysController_1.getJourneyById);
router.put('/:id', auth_1.authMiddleware, journeysController_1.updateJourney);
router.delete('/:id', auth_1.authMiddleware, journeysController_1.deleteJourney);
exports.journeyRoutes = router;
