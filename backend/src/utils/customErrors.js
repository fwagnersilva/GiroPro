"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.PayloadTooLargeError = exports.RequestTimeoutError = exports.ServiceUnavailableError = exports.ConflictError = exports.NotFoundError = exports.UnauthorizedError = exports.ValidationError = exports.CustomError = void 0;
var CustomError = /** @class */ (function (_super) {
    __extends(CustomError, _super);
    function CustomError(message, statusCode, code, details) {
        if (statusCode === void 0) { statusCode = 500; }
        if (code === void 0) { code = 'INTERNAL_ERROR'; }
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.statusCode = statusCode;
        _this.code = code;
        _this.details = details;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return CustomError;
}(Error));
exports.CustomError = CustomError;
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(message, details) {
        if (message === void 0) { message = 'Dados de entrada inválidos'; }
        return _super.call(this, message, 400, 'VALIDATION_ERROR', details) || this;
    }
    return ValidationError;
}(CustomError));
exports.ValidationError = ValidationError;
var UnauthorizedError = /** @class */ (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(message, details) {
        if (message === void 0) { message = 'Não autorizado'; }
        return _super.call(this, message, 401, 'UNAUTHORIZED', details) || this;
    }
    return UnauthorizedError;
}(CustomError));
exports.UnauthorizedError = UnauthorizedError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message, details) {
        if (message === void 0) { message = 'Recurso não encontrado'; }
        return _super.call(this, message, 404, 'NOT_FOUND', details) || this;
    }
    return NotFoundError;
}(CustomError));
exports.NotFoundError = NotFoundError;
var ConflictError = /** @class */ (function (_super) {
    __extends(ConflictError, _super);
    function ConflictError(message, details) {
        if (message === void 0) { message = 'Conflito de recurso'; }
        return _super.call(this, message, 409, 'CONFLICT', details) || this;
    }
    return ConflictError;
}(CustomError));
exports.ConflictError = ConflictError;
var ServiceUnavailableError = /** @class */ (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError(message, details) {
        if (message === void 0) { message = 'Serviço temporariamente indisponível'; }
        return _super.call(this, message, 503, 'SERVICE_UNAVAILABLE', details) || this;
    }
    return ServiceUnavailableError;
}(CustomError));
exports.ServiceUnavailableError = ServiceUnavailableError;
var RequestTimeoutError = /** @class */ (function (_super) {
    __extends(RequestTimeoutError, _super);
    function RequestTimeoutError(message, details) {
        if (message === void 0) { message = 'Timeout da requisição'; }
        return _super.call(this, message, 408, 'REQUEST_TIMEOUT', details) || this;
    }
    return RequestTimeoutError;
}(CustomError));
exports.RequestTimeoutError = RequestTimeoutError;
var PayloadTooLargeError = /** @class */ (function (_super) {
    __extends(PayloadTooLargeError, _super);
    function PayloadTooLargeError(message, details) {
        if (message === void 0) { message = 'Payload muito grande'; }
        return _super.call(this, message, 413, 'PAYLOAD_TOO_LARGE', details) || this;
    }
    return PayloadTooLargeError;
}(CustomError));
exports.PayloadTooLargeError = PayloadTooLargeError;
// Alias para compatibilidade
exports.AppError = CustomError;
