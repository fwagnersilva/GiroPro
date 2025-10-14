"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multiVehicleController_1 = require("../controllers/multiVehicleController");
var auth_1 = require("../middlewares/auth");
var router = (0, express_1.Router)();
// Aplicar middleware de autenticação em todas as rotas
router.use(auth_1.authMiddleware);
/**
 * @route GET /api/v1/multi-vehicle/vehicles-with-stats
 * @desc Listar todos os veículos do usuário com estatísticas básicas
 * @access Private
 * @query {string[]} [ids_veiculos] - Array de UUIDs dos veículos específicos
 * @query {boolean} [incluir_inativos=false] - Incluir veículos marcados como deletados
 * @query {string} [ordenar_por=data_cadastro] - Campo para ordenação (marca, modelo, ano, data_cadastro)
 * @query {string} [ordem=desc] - Direção da ordenação (asc, desc)
 */
router.get('/vehicles-with-stats', multiVehicleController_1.MultiVehicleController.getVehiclesWithStats);
/**
 * @route POST /api/v1/multi-vehicle/set-active-vehicle
 * @desc Definir veículo ativo/padrão para jornadas
 * @access Private
 * @body {string} idVeiculo - UUID do veículo a ser definido como ativo
 */
router.post('/set-active-vehicle', multiVehicleController_1.MultiVehicleController.setActiveVehicle);
/**
 * @route GET /api/v1/multi-vehicle/quick-summary
 * @desc Obter resumo rápido de todos os veículos
 * @access Private
 */
router.get('/quick-summary', multiVehicleController_1.MultiVehicleController.getQuickSummary);
/**
 * @route GET /api/v1/multi-vehicle/vehicle-usage/:idVeiculo
 * @desc Obter histórico de uso por veículo
 * @access Private
 * @param {string} idVeiculo - UUID do veículo
 */
router.get('/vehicle-usage/:idVeiculo', multiVehicleController_1.MultiVehicleController.getVehicleUsageHistory);
exports.default = router;
