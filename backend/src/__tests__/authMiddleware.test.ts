import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

// Mock do logger
jest.mock('../utils/logger', () => ({
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}));

describe('AuthMiddleware', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
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

  describe('authenticateToken', () => {
    it('should return 401 if no token is provided', () => {
      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token de acesso requerido' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', () => {
      mockRequest.headers = { authorization: 'Bearer invalid-token' };

      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next() if token is valid', () => {
      const validUser = { id: '123', email: 'test@test.com', role: 'user' };
      const validToken = jwt.sign(validUser, config.auth.jwtSecret);
      mockRequest.headers = { authorization: `Bearer ${validToken}` };

      authenticateToken(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockRequest.user).toEqual(expect.objectContaining(validUser));
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('authorizeRoles', () => {
    beforeEach(() => {
      mockRequest.user = { id: '123', email: 'test@test.com', role: 'user' };
    });

    it('should return 401 if user is not authenticated', () => {
      mockRequest.user = undefined;
      const middleware = authorizeRoles('admin');

      middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuário não autenticado' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if user role is not allowed', () => {
      const middleware = authorizeRoles('admin');

      middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Acesso negado. Permissões insuficientes.' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next() if user role is allowed', () => {
      const middleware = authorizeRoles('user', 'admin');

      middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow admin access to admin-only routes', () => {
      mockRequest.user!.role = 'admin';
      const middleware = authorizeRoles('admin');

      middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});

