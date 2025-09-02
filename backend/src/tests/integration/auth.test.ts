import request from 'supertest';
import app from '../../app';
import { db } from '../../db/connection';
import { usuarios } from '../../db/schema';
import { eq } from 'drizzle-orm';

describe('Authentication Integration Tests', () => {
  const testUser = {
    nome: `Teste Usuario ${Date.now()}`,
    email: `teste${Date.now()}@exemplo.com`,
    senha: 'senha123',
    telefone: '11999999999'
  };

  beforeEach(async () => {
    // Limpar usuários de teste
    await db.delete(usuarios).where(eq(usuarios.email, testUser.email));
  });

  afterEach(async () => {
    // Limpar usuários de teste
    await db.delete(usuarios).where(eq(usuarios.email, testUser.email));
  });

  describe('POST /api/v1/auth/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.nome).toBe(testUser.nome);
      expect(response.body.user).not.toHaveProperty('senha');
    });

    it('deve retornar erro para email já cadastrado', async () => {
      // Primeiro registro
      await request(app)
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201);

      // Segundo registro com mesmo email
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('já cadastrado');
    });

    it('deve retornar erro para dados inválidos', async () => {
      const invalidUser = {
        nome: `Invalid User ${Date.now()}`,
        email: `invalid${Date.now()}@example.com`,
        senha: `invalid-password-${Date.now()}`,
        telefone: `invalid-phone-${Date.now()}`
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('deve aplicar rate limiting para muitas tentativas', async () => {
      const promises = [];
      
      // Fazer 10 tentativas rapidamente
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post('/api/v1/auth/register')
            .send({
              ...testUser,
              email: `teste${i}@exemplo.com`
            })
        );
      }

      const responses = await Promise.all(promises);
      
      // Algumas devem ser bloqueadas por rate limiting
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Registrar usuário para testes de login
      await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
    });

    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          senha: testUser.senha
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user).not.toHaveProperty('senha');
    });

    it('deve retornar erro para credenciais inválidas', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          senha: 'senha-errada'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('inválidas');
    });

    it('deve retornar erro para usuário não encontrado', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: `naoexiste${Date.now()}@exemplo.com`,
          senha: 'qualquersenha'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('deve aplicar proteção contra força bruta', async () => {
      const promises = [];
      
      // Fazer 15 tentativas de login com senha errada
      for (let i = 0; i < 15; i++) {
        promises.push(
          request(app)
            .post('/api/v1/auth/login')
            .send({
              email: testUser.email,
              senha: 'senha-errada'
            })
        );
      }

      const responses = await Promise.all(promises);
      
      // Últimas tentativas devem ser bloqueadas
      const blockedResponses = responses.slice(-5).filter(r => r.status === 429);
      expect(blockedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let authToken: string;

    beforeEach(async () => {
      // Registrar e fazer login para obter token
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
      
      authToken = registerResponse.body.token;
    });

    it('deve retornar dados do usuário autenticado', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user).not.toHaveProperty('senha');
    });

    it('deve retornar erro sem token de autenticação', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Token');
    });

    it('deve retornar erro com token inválido', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    let authToken: string;

    beforeEach(async () => {
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);
      
      authToken = registerResponse.body.token;
    });

    it('deve fazer logout com sucesso', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('sucesso');
    });

    it('deve retornar erro sem token de autenticação', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Security Headers', () => {
    it('deve incluir headers de segurança nas respostas', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    it('deve detectar tentativas de SQL injection', async () => {
      const maliciousPayload = {
        email: "admin@test.com'; DROP TABLE usuarios; --",
        senha: 'password'
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(maliciousPayload)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.code).toBe('INVALID_REQUEST');
    });

    it('deve detectar tentativas de XSS', async () => {
      const maliciousPayload = {
        nome: '<script>alert("xss")</script>',
        email: `test${Date.now()}@test.com`,
        senha: 'password',
        telefone: '11999999999'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(maliciousPayload)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.code).toBe('DANGEROUS_CONTENT');
    });
  });
});

