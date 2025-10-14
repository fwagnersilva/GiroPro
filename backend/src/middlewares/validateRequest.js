"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
var validate = function (schema) {
    return function (req, res, next) {
        try {
            schema.parse(req.body);
            return next();
        }
        catch (e) {
            return res.status(400).json({
                message: 'Erro de validação',
                errors: e.errors
            });
        }
    };
};
exports.validate = validate;
