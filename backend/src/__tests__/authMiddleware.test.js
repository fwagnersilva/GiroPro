"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var config_1 = require("../config");
// Mock do logger
jest.mock('../utils/logger', function () { return ({
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
}); });
describe('AuthMiddleware', function () {
    var mockRequest;
    var mockResponse;
    var mockNext;
    beforeEach(function () {
        mockRequest = {
            headers: {},
            ip: '127.0.0.1',
            get: jest.fn().mockReturnValue('test-user-agent'),
            path: '/test-path'
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
    });
    describe('authenticateToken', function () {
        it('should return 401 if no token is provided', function () {
            (0, authMiddleware_1.authenticateToken)(mockRequest, mockResponse, mockNext);
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token de acesso requerido' });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should return 403 if token is invalid', function () {
            mockRequest.headers = { authorization: 'Bearer invalid-token' };
            (0, authMiddleware_1.authenticateToken)(mockRequest, mockResponse, mockNext);
            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should call next() if token is valid', function () {
            var validUser = { id: '123', email: 'test@test.com', role: 'user' };
            var validToken = jsonwebtoken_1.default.sign(validUser, config_1.config.auth.jwtSecret);
            mockRequest.headers = { authorization: "Bearer ".concat(validToken) };
            (0, authMiddleware_1.authenticateToken)(mockRequest, mockResponse, mockNext);
            expect(mockRequest.user).toEqual(expect.objectContaining(validUser));
            expect(mockNext).toHaveBeenCalled();
        });
    });
    describe('authorizeRoles', function () {
        beforeEach(function () {
            mockRequest.user = { id: '123', email: 'test@test.com', role: 'user' };
        });
        it('should return 401 if user is not authenticated', function () {
            mockRequest.user = undefined;
            var middleware = (0, authMiddleware_1.authorizeRoles)('admin');
            middleware(mockRequest, mockResponse, mockNext);
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuário não autenticado' });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should return 403 if user role is not allowed', function () {
            var middleware = (0, authMiddleware_1.authorizeRoles)('admin');
            middleware(mockRequest, mockResponse, mockNext);
            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Acesso negado. Permissões insuficientes.' });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should call next() if user role is allowed', function () {
            var middleware = (0, authMiddleware_1.authorizeRoles)('user', 'admin');
            middleware(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });
        it('should allow admin access to admin-only routes', function () {
            mockRequest.user.role = 'admin';
            var middleware = (0, authMiddleware_1.authorizeRoles)('admin');
            middleware(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });
    });
});
