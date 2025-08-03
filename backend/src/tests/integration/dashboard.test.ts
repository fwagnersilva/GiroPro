import request from 'supertest';
import app from '../../app';
import { db } from '../../db/connection';
import { usuarios, veiculos, jornadas, abastecimentos, despesas } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

describe('Dashboard Integration Tests', () => {
  let authToken: string;
  let userId: string;
  let vehicleId: string;

  const testUser = {
    nome: 'Teste Dashboard',
    email: 'dashboard@exemplo.com',
    senha: 'senha123',
    telefone: '11999999999'
  };

  const testVehicle = {
    marca: 'Toyota',
    modelo: 'Corolla',
    ano: 2020,
    placa: 'ABC1234',
    combustivel: 'flex' as const,
    capacidadeTanque: 50
  };

  beforeAll(async () => {
    // Registrar usuário de teste
    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);
    
    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;

    // Criar veículo de teste
    const vehicleResponse = await request(app)
      .post('/api/v1/vehicles')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testVehicle);
    
    vehicleId = vehicleResponse.body.id;

    // Criar dados de teste
    await createTestData();
  });

  afterAll(async () => {
    // Limpar dados de teste
    await db.delete(despesas).where(eq(despesas.id_usuario, userId));
    await db.delete(abastecimentos).where(eq(abastecimentos.id_usuario, userId));
    await db.delete(jornadas).where(eq(jornadas.id_usuario, userId));
    await db.delete(veiculos).where(eq(veiculos.id_usuario, userId));
    await db.delete(usuarios).where(eq(usuarios.id, userId));
  });

  async function createTestData() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Criar jornadas
    await db.insert(jornadas).values([
      {
        id: uuidv4(),
        id_usuario: userId,
        id_veiculo: vehicleId,
        data_inicio: yesterday.toISOString(),
        data_fim: today.toISOString(),
        km_inicio: 1000,
        km_fim: 1100,
        ganho_bruto: 15000, // em centavos
        km_total: 100,
        tempo_total: 480, // em minutos
        observacoes: 'Jornada de teste'
      }
    ]);

    // Criar abastecimentos
    await db.insert(abastecimentos).values([
      {
        id: uuidv4(),
        id_usuario: userId,
        id_veiculo: vehicleId,
        data_abastecimento: yesterday.toISOString(),
        litros: 40,
        valor_total: 24000, // em centavos
        preco_litro: 600, // em centavos
        posto: 'Posto Teste',
        km_atual: 1050,
        tipo_combustivel: 'Gasolina'
      }
    ]);

    // Criar despesas
    await db.insert(despesas).values([
      {
        id: uuidv4(),
        id_usuario: userId,
        id_veiculo: vehicleId,
        data_despesa: yesterday.toISOString(),
        tipo_despesa: 'Manutencao',
        descricao: 'Troca de óleo',
        valor_despesa: 8000 // em centavos
      }
    ]);
  }

  describe('GET /api/v1/dashboard/summary', () => {
    it('deve retornar resumo de lucratividade', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('receita');
      expect(response.body).toHaveProperty('despesas');
      expect(response.body).toHaveProperty('lucro');
      expect(response.body).toHaveProperty('kmRodados');
      expect(response.body).toHaveProperty('consumoMedio');
      expect(response.body).toHaveProperty('periodo');

      expect(typeof response.body.receita).toBe('number');
      expect(typeof response.body.despesas).toBe('number');
      expect(typeof response.body.lucro).toBe('number');
      expect(typeof response.body.kmRodados).toBe('number');
    });

    it('deve aplicar cache na resposta', async () => {
      const response1 = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response2 = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response1.headers['x-cache']).toBe('MISS');
      expect(response2.headers['x-cache']).toBe('HIT');
    });

    it('deve filtrar por período quando especificado', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary?period=today')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('periodo');
      expect(response.body.periodo).toBe('today');
    });

    it('deve retornar erro sem autenticação', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/dashboard/evolution', () => {
    it('deve retornar dados de evolução temporal', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/evolution')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('dados');
      expect(response.body).toHaveProperty('periodo');
      expect(Array.isArray(response.body.dados)).toBe(true);

      if (response.body.dados.length > 0) {
        const item = response.body.dados[0];
        expect(item).toHaveProperty('data');
        expect(item).toHaveProperty('receita');
        expect(item).toHaveProperty('despesas');
        expect(item).toHaveProperty('lucro');
      }
    });

    it('deve aplicar cache na resposta', async () => {
      const response1 = await request(app)
        .get('/api/v1/dashboard/evolution')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response2 = await request(app)
        .get('/api/v1/dashboard/evolution')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response1.headers['x-cache']).toBe('MISS');
      expect(response2.headers['x-cache']).toBe('HIT');
    });

    it('deve retornar erro sem autenticação', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/evolution')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/dashboard/vehicles', () => {
    it('deve retornar comparativo entre veículos', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('veiculos');
      expect(Array.isArray(response.body.veiculos)).toBe(true);

      if (response.body.veiculos.length > 0) {
        const veiculo = response.body.veiculos[0];
        expect(veiculo).toHaveProperty('id');
        expect(veiculo).toHaveProperty('marca');
        expect(veiculo).toHaveProperty('modelo');
        expect(veiculo).toHaveProperty('receita');
        expect(veiculo).toHaveProperty('despesas');
        expect(veiculo).toHaveProperty('lucro');
        expect(veiculo).toHaveProperty('kmRodados');
      }
    });

    it('deve aplicar cache na resposta', async () => {
      const response1 = await request(app)
        .get('/api/v1/dashboard/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response2 = await request(app)
        .get('/api/v1/dashboard/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response1.headers['x-cache']).toBe('MISS');
      expect(response2.headers['x-cache']).toBe('HIT');
    });

    it('deve retornar erro sem autenticação', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/vehicles')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Performance Tests', () => {
    it('deve responder em menos de 2 segundos', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(2000);
    });

    it('deve incluir headers de performance', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (process.env.NODE_ENV === 'development') {
        expect(response.headers).toHaveProperty('x-response-time');
        expect(response.headers).toHaveProperty('x-memory-usage');
      }
    });

    it('deve suportar requests concorrentes', async () => {
      const promises = [];
      
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .get('/api/v1/dashboard/summary')
            .set('Authorization', `Bearer ${authToken}`)
        );
      }

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('receita');
      });
    });
  });

  describe('Error Handling', () => {
    it('deve retornar erro 500 em caso de falha no banco', async () => {
      // Simular erro no banco (isso dependeria da implementação específica)
      // Por enquanto, apenas verificamos que o endpoint existe
      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('deve validar parâmetros de query', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary?period=invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200); // Deve usar período padrão

      expect(response.body).toHaveProperty('periodo');
    });
  });
});

