"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("./middlewares/cors");
var helmet_1 = require("helmet");
var compression_1 = require("compression");
var errorHandler_1 = require("./middlewares/errorHandler");
var requestLogger_1 = require("./middlewares/requestLogger");
var logger_1 = require("./utils/logger");
var app = (0, express_1.default)();
// Middlewares globais
app.use(cors_1.corsMiddleware);
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(requestLogger_1.requestLogger);
// Health check
app.get('/health', function (req, res) {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});
// Rotas (importar apenas as que existem)
try {
    var authRoutes = require('./routes/auth').authRoutes;
    app.use('/api/v1/auth', authRoutes);
}
catch (e) {
    logger_1.default.warn('Auth routes não disponíveis');
}
try {
    var vehicleRoutes = require('./routes/vehicles').vehicleRoutes;
    app.use('/api/v1/vehicles', vehicleRoutes);
}
catch (e) {
    logger_1.default.warn('Vehicle routes não disponíveis');
}
try {
    var journeyRoutes = require('./routes/journeys').journeyRoutes;
    app.use('/api/v1/journeys', journeyRoutes);
}
catch (e) {
    logger_1.default.warn('Journey routes não disponíveis');
}
// Error handler (deve ser o último middleware)
app.use(errorHandler_1.errorHandler);
exports.default = app;
