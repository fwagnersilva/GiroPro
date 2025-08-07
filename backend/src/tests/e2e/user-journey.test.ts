import request from 'supertest';
import app from '../../app';
import { db } from '../../db/connection';
import { usuarios, veiculos, jornadas, abastecimentos, despesas } from '../../db/schema';
import { eq } from 'drizzle-orm';

describe('User Journey E2E Tests', () => {
  const testUser = {
    nome: 'João Motorista',
    email: 'joao.motorista@exemplo.com',
    senha: 'minhasenha123',
    telefone: '11987654321'
  };

  const testVehicle = {
    marca: 'Honda',
    modelo: 'Civic',
    ano: 2019,
    placa: 'XYZ9876',
    combustivel: 'flex' as const,
    capacidadeTanque: 47
  };

  let authToken: string;
  let userId: string;
  let vehicleId: string;

  afterAll(async () => {
    // Limpar todos os dados de teste
    if (userId) {
      await db.delete(despesas).where(eq(despesas.id_usuario, userId));
      await db.delete(abastecimentos).where(eq(abastecimentos.id_usuario, userId));
      await db.delete(jornadas).where(eq(jornadas.id_usuario, userId));
      await db.delete(veiculos).where(eq(veiculos.id_usuario, userId));
      await db.delete(usuarios).where(eq(usuarios.id, userId));
    }
  });

  describe('Jornada Completa do Usuário', () => {
    it('1. Deve registrar um novo usuário', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.nome).toBe(testUser.nome);

      authToken = response.body.token;
      userId = response.body.user.id;
    });

    it('2. Deve fazer login com as credenciais criadas', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          senha: testUser.senha
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testUser.email);

      // Atualizar token para garantir que está válido
      authToken = response.body.token;
    });

    it('3. Deve acessar o perfil do usuário', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.user.id).toBe(userId);
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('4. Deve cadastrar um veículo', async () => {
      const response = await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testVehicle)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.marca).toBe(testVehicle.marca);
      expect(response.body.modelo).toBe(testVehicle.modelo);
      expect(response.body.placa).toBe(testVehicle.placa);

      vehicleId = response.body.id;
    });

    it('5. Deve listar os veículos do usuário', async () => {
      const response = await request(app)
        .get('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(vehicleId);
    });

    it('6. Deve registrar um abastecimento', async () => {
      const fuelingData = {
        veiculoId: vehicleId,
        data: new Date().toISOString(),
        quantidade_litros: 35,
        valor_total: 210.00,
        valor_litro: 6.00,
        posto: 'Shell Centro',
        kmAtual: 15000,
        tanqueCheio: true
      };

      const response = await request(app)
        .post('/api/v1/abastecimentos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(fuelingData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.quantidade_litros).toBe(fuelingData.quantidade_litros);
      expect(response.body.valor_total).toBe(fuelingData.valor_total);
      expect(response.body.posto).toBe(fuelingData.posto);
    });

    it('7. Deve registrar uma jornada de trabalho', async () => {
      const journeyData = {
        veiculoId: vehicleId,
        dataInicio: new Date().toISOString(),
        dataFim: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 horas depois
        kmInicial: 15000,
        kmFinal: 15200,
        ganho_bruto: 280.50,
        plataforma: 'uber',
        observacoes: 'Dia de trabalho normal'
      };

      const response = await request(app)
        .post('/api/v1/jornadas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(journeyData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.ganho_bruto).toBe(journeyData.ganho_bruto);
      expect(response.body.plataforma).toBe(journeyData.plataforma);
      expect(response.body.km_inicio).toBe(journeyData.kmInicial);
      expect(response.body.km_fim).toBe(journeyData.kmFinal);
    });

    it('8. Deve registrar uma despesa', async () => {
      const expenseData = {
        veiculoId: vehicleId,
        data: new Date().toISOString(),
        categoria: 'manutencao',
        descricao: 'Troca de óleo e filtros',
        valor_despesa: 120.00,
        observacoes: 'Manutenção preventiva aos 15.000 km'
      };

      const response = await request(app)
        .post('/api/v1/despesas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(expenseData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.categoria).toBe(expenseData.categoria);
      expect(response.body.descricao).toBe(expenseData.descricao);
      expect(response.body.valor_despesa).toBe(expenseData.valor_despesa);
    });

    it('9. Deve acessar o dashboard com dados calculados', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('receita');
      expect(response.body).toHaveProperty('despesas');
      expect(response.body).toHaveProperty('lucro');
      expect(response.body).toHaveProperty('kmRodados');

      // Verificar se os valores fazem sentido
      expect(response.body.receita).toBeGreaterThan(0);
      expect(response.body.despesas).toBeGreaterThan(0);
      expect(response.body.kmRodados).toBeGreaterThan(0);
      expect(response.body.lucro).toBe(response.body.receita - response.body.despesas);
    });

    it('10. Deve acessar dados de evolução temporal', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/evolution')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('dados');
      expect(Array.isArray(response.body.dados)).toBe(true);
    });

    it('11. Deve acessar comparativo de veículos', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('veiculos');
      expect(Array.isArray(response.body.veiculos)).toBe(true);
      expect(response.body.veiculos.length).toBe(1);
      expect(response.body.veiculos[0].id).toBe(vehicleId);
    });

    it('12. Deve listar histórico de abastecimentos', async () => {
      const response = await request(app)
        .get('/api/v1/abastecimentos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].posto).toBe('Shell Centro');
    });

    it('13. Deve listar histórico de jornadas', async () => {
      const response = await request(app)
        .get('/api/v1/jornadas')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].plataforma).toBe('uber');
    });

    it('14. Deve listar histórico de despesas', async () => {
      const response = await request(app)
        .get('/api/v1/despesas')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].categoria).toBe('manutencao');
    });

    it('15. Deve acessar preços de combustível', async () => {
      const response = await request(app)
        .get('/api/v1/fuel-prices')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('precos');
      // Pode estar vazio se não houver dados de preços
    });

    it('16. Deve fazer logout com sucesso', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('sucesso');
    });

    it('17. Não deve acessar recursos protegidos após logout', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Fluxo de Erro e Recuperação', () => {
    beforeAll(async () => {
      // Fazer login novamente para testes de erro
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          senha: testUser.senha
        });
      
      authToken = loginResponse.body.token;
    });

    it('deve validar dados obrigatórios ao criar veículo', async () => {
      const invalidVehicle = {
        marca: '',
        modelo: '',
        ano: 'invalid',
        placa: '',
        combustivel: 'invalid'
      };

      const response = await request(app)
        .post('/api/v1/veiculos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidVehicle)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('deve validar dados obrigatórios ao criar abastecimento', async () => {
      const invalidFueling = {
        veiculoId: 'invalid-id',
        quantidade_litros: -10,
        valor_total: -100,
        valor_litro: 0
      };

      const response = await request(app)
        .post('/api/v1/abastecimentos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidFueling)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('deve validar dados obrigatórios ao criar jornada', async () => {
      const invalidJourney = {
        veiculoId: 'invalid-id',
        kmInicial: 'invalid',
        kmFinal: 'invalid',
        valorGanho: -100
      };

      const response = await request(app)
        .post('/api/v1/jornadas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidJourney)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('deve validar dados obrigatórios ao criar despesa', async () => {
      const invalidExpense = {
        veiculoId: 'invalid-id',
        categoria: 'invalid-category',
        valor: -50
      };

      const response = await request(app)
        .post('/api/v1/despesas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidExpense)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Performance e Segurança', () => {
    beforeAll(async () => {
      // Garantir que estamos logados
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          senha: testUser.senha
        });
      
      authToken = loginResponse.body.token;
    });

    it('deve aplicar rate limiting em endpoints sensíveis', async () => {
      const promises = [];
      
      // Fazer muitas tentativas de criação de veículo
      for (let i = 0; i < 20; i++) {
        promises.push(
          request(app)
            .post('/api/v1/veiculos')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
              ...testVehicle,
              placa: `TEST${i.toString().padStart(3, '0')}`
            })
        );
      }

      const responses = await Promise.all(promises);
      
      // Algumas devem ser bloqueadas por rate limiting
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it('deve incluir headers de segurança em todas as respostas', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });

    it('deve responder rapidamente mesmo com múltiplas requests', async () => {
      const startTime = Date.now();
      const promises = [];
      
      for (let i = 0; i < 5; i++) {
        promises.push(
          request(app)
            .get('/api/v1/dashboard/summary')
            .set('Authorization', `Bearer ${authToken}`)
        );
      }

      const responses = await Promise.all(promises);
      const duration = Date.now() - startTime;

      // Todas as respostas devem ser bem-sucedidas
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Deve responder em menos de 5 segundos para 5 requests
      expect(duration).toBeLessThan(5000);
    });
  });
});

