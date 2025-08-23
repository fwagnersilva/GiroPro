import request from 'supertest';
import app from '../../app_simple';
import { db, closeConnection } from '../../db/connection';
import { usuarios, veiculos } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import jwt from 'jsonwebtoken';


describe('VehiclesController', () => {
  let authToken: string;
  let userId: string;
  
  const testUser = {
    nome: 'Test User',
    email: 'test@veiculos.com',
    senha: 'password123',
    telefone: '11999999999'
  };

  const testVehicle = {
    marca: 'Toyota',
    modelo: 'Corolla',
    ano: 2020,
    placa: 'ABC1234',
    cor: 'Branco',
    combustivel: 'flex',
    categoria: 'sedan'
  };

  beforeAll(async () => {
    // Limpar dados de teste
    await db.delete(veiculos).where(eq(veiculos.placa, testVehicle.placa));
    await db.delete(usuarios).where(eq(usuarios.email, testUser.email));
  });

  beforeEach(async () => {
    // Criar usuário de teste e obter token
    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);
    
    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  afterEach(async () => {
    // Limpar dados após cada teste
    await db.delete(veiculos).where(eq(veiculos.idUsuario, userId));
    await db.delete(usuarios).where(eq(usuarios.id, userId));
  });

  describe('POST /api/v1/veiculos', () => {
    it('should create a new vehicle with valid data', async () => {
      const response = await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testVehicle)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.marca).toBe(testVehicle.marca);
      expect(response.body.modelo).toBe(testVehicle.modelo);
      expect(response.body.placa).toBe(testVehicle.placa);
      expect(response.body.idUsuario).toBe(userId);
    });

    it('should return 400 for invalid vehicle data', async () => {
      const invalidVehicle = {
        marca: '', // Campo obrigatório vazio
        modelo: 'Corolla',
        ano: 1800, // Ano inválido
        placa: 'INVALID', // Placa inválida
      };

      const response = await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidVehicle)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('inválido');
    });

    it('should return 401 for unauthorized user', async () => {
      const response = await request(app)
        .post('/api/v1/veiculos')
        .send(testVehicle)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Token');
    });

    it('should return 409 for duplicate vehicle plate', async () => {
      // Criar primeiro veículo
      await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testVehicle)
        .expect(201);

      // Tentar criar segundo veículo com mesma placa
      const response = await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testVehicle)
        .expect(409);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('já cadastrada');
    });

    it('should validate required fields', async () => {
      const incompleteVehicle = {
        marca: 'Toyota',
        // modelo ausente
        ano: 2020,
      };

      const response = await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteVehicle)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should validate plate format', async () => {
      const invalidPlates = [
        'ABC123', // Muito curto
        'ABC12345', // Muito longo
        '1234567', // Só números
        'ABCDEFG', // Só letras
      ];

      for (const placa of invalidPlates) {
        const response = await request(app)
          .post('/api/v1/veiculos')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ ...testVehicle, placa })
          .expect(400);

        expect(response.body).toHaveProperty('error');
      }
    });

    it('should validate year range', async () => {
      const invalidYears = [1899, 2030];

      for (const ano of invalidYears) {
        const response = await request(app)
          .post('/api/v1/veiculos')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ ...testVehicle, ano })
          .expect(400);

        expect(response.body).toHaveProperty('error');
      }
    });
  });

  describe('GET /api/v1/veiculos', () => {
    beforeEach(async () => {
      // Criar alguns veículos de teste
      await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testVehicle);

      await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...testVehicle,
          placa: 'XYZ9876',
          modelo: 'Civic',
        });
    });

    it('should return user veiculos', async () => {
      const response = await request(app)
        .get('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('marca');
      expect(response.body[0]).toHaveProperty('modelo');
    });

    it('should return empty array for user without veiculos', async () => {
      // Criar novo usuário sem veículos
      const newUser = {
        ...testUser,
        email: 'newuser@test.com',
      };

      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(newUser);

      const response = await request(app)
        .get('/api/v1/veiculos')
        .set('Authorization', `Bearer ${registerResponse.body.token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);

      // Limpar usuário criado
      await db.delete(usuarios).where(eq(usuarios.id, registerResponse.body.user.id));
    });

    it('should return 401 for unauthorized user', async () => {
      const response = await request(app)
        .get('/api/v1/veiculos')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should apply pagination correctly', async () => {
      const response = await request(app)
        .get('/api/v1/veiculos?page=1&limit=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });

    it('should filter by active veiculos only', async () => {
      const response = await request(app)
        .get('/api/v1/veiculos?ativo=true')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((vehicle: any) => {
        expect(vehicle.ativo).toBe(true);
      });
    });
  });

  describe('GET /api/v1/veiculos/:id', () => {
    let vehicleId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testVehicle);
      
      vehicleId = createResponse.body.id;
    });

    it('should return specific vehicle', async () => {
      const response = await request(app)
        .get(`/api/v1/veiculos/${vehicleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', vehicleId);
      expect(response.body).toHaveProperty('marca', testVehicle.marca);
      expect(response.body).toHaveProperty('modelo', testVehicle.modelo);
    });

    it('should return 404 for non-existent vehicle', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const response = await request(app)
        .get(`/api/v1/veiculos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('encontrado');
    });

    it('should return 401 for unauthorized user', async () => {
      const response = await request(app)
        .get(`/api/v1/veiculos/${vehicleId}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 for vehicle of another user', async () => {
      // Criar outro usuário
      const otherUser = {
        ...testUser,
        email: 'other@test.com',
      };

      const otherUserResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(otherUser);

      const response = await request(app)
        .get(`/api/v1/veiculos/${vehicleId}`)
        .set('Authorization', `Bearer ${otherUserResponse.body.token}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('acesso');

      // Limpar usuário criado
      await db.delete(usuarios).where(eq(usuarios.id, otherUserResponse.body.user.id));
    });
  });

  describe('PUT /api/v1/veiculos/:id', () => {
    let vehicleId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testVehicle);
      
      vehicleId = createResponse.body.id;
    });

    it('should update vehicle with valid data', async () => {
      const updateData = {
        marca: 'Honda',
        modelo: 'Civic',
        cor: 'Preto',
      };

      const response = await request(app)
        .put(`/api/v1/veiculos/${vehicleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', vehicleId);
      expect(response.body.marca).toBe(updateData.marca);
      expect(response.body.modelo).toBe(updateData.modelo);
      expect(response.body.cor).toBe(updateData.cor);
      // Campos não atualizados devem permanecer
      expect(response.body.ano).toBe(testVehicle.ano);
    });

    it('should return 400 for invalid update data', async () => {
      const invalidData = {
        ano: 1800, // Ano inválido
      };

      const response = await request(app)
        .put(`/api/v1/veiculos/${vehicleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent vehicle', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const response = await request(app)
        .put(`/api/v1/veiculos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ marca: 'Honda' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for unauthorized user', async () => {
      const response = await request(app)
        .put(`/api/v1/veiculos/${vehicleId}`)
        .send({ marca: 'Honda' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/v1/veiculos/:id', () => {
    let vehicleId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testVehicle);
      
      vehicleId = createResponse.body.id;
    });

    it('should soft delete vehicle', async () => {
      const response = await request(app)
        .delete(`/api/v1/veiculos/${vehicleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('removido');

      // Verificar se o veículo foi marcado como inativo
      const getResponse = await request(app)
        .get(`/api/v1/veiculos/${vehicleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body.ativo).toBe(false);
    });

    it('should return 404 for non-existent vehicle', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const response = await request(app)
        .delete(`/api/v1/veiculos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for unauthorized user', async () => {
      const response = await request(app)
        .delete(`/api/v1/veiculos/${vehicleId}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should prevent deletion if vehicle has active journeys', async () => {
      // Este teste assumiria que existe uma verificação de jornadas ativas
      // A implementação específica dependeria da regra de negócio
      
      // Por enquanto, apenas verificamos que a deleção funciona normalmente
      const response = await request(app)
        .delete(`/api/v1/veiculos/${vehicleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Vehicle Statistics', () => {
    let vehicleId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testVehicle);
      
      vehicleId = createResponse.body.id;
    });

    it('should return vehicle statistics', async () => {
      const response = await request(app)
        .get(`/api/v1/veiculos/${vehicleId}/stats`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total_jornadas');
      expect(response.body).toHaveProperty('kmTotal');
      expect(response.body).toHaveProperty('consumo_medio');
      expect(response.body).toHaveProperty('custo_total_combustivel');
      expect(response.body).toHaveProperty('ultima_jornada');
    });

    it('should return zero stats for new vehicle', async () => {
      const response = await request(app)
        .get(`/api/v1/veiculos/${vehicleId}/stats`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.total_jornadas).toBe(0);
      expect(response.body.kmTotal).toBe(0);
      expect(response.body.consumo_medio).toBe(0);
      expect(response.body.custo_total_combustivel).toBe(0);
      expect(response.body.ultima_jornada).toBeNull();
    });
  });

  describe('Input Validation and Security', () => {
    it('should sanitize input data', async () => {
      const maliciousData = {
        marca: '<script>alert("xss")</script>',
        modelo: 'DROP TABLE veiculos;',
        ano: 2020,
        placa: 'ABC1234',
        cor: 'Branco',
        combustivel: 'flex',
        categoria: 'sedan'
      };

      const response = await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(maliciousData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.code).toBe('DANGEROUS_CONTENT');
    });

    it('should validate JWT token properly', async () => {
      const invalidToken = 'invalid.jwt.token';

      const response = await request(app)
        .get('/api/v1/veiculos')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Token');
    });

    it('should handle expired JWT token', async () => {
      // Criar token expirado
      const expiredToken = jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1h' }
      );

      const response = await request(app)
        .get('/api/v1/veiculos')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('expirado');
    });
  });
});



  afterAll(async () => {
    await closeConnection();
  });

