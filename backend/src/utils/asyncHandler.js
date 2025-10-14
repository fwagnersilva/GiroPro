"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var asyncHandler = function (fn) { return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next);
}; };
exports.default = asyncHandler;
