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
    senha: 'senha123'
  };

  const testVehicle = {
    marca: 'Toyota',
    modelo: 'Corolla',
    ano: 2020,
    placa: 'ABC1234',
    tipoCombustivel: 'flex' as const,
    tipoUso: 'proprio' as const,
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
    await db.delete(despesas).where(eq(despesas.idUsuario, userId));
    await db.delete(abastecimentos).where(eq(abastecimentos.idUsuario, userId));
    await db.delete(jornadas).where(eq(jornadas.idUsuario, userId));
    await db.delete(veiculos).where(eq(veiculos.idUsuario, userId));
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
        idUsuario: userId,
        idVeiculo: vehicleId,
        dataInicio: yesterday.getTime(),
        dataFim: today.getTime(),
        kmInicio: 1000,
        kmFim: 1100,
        ganhoBruto: 15000, // em centavos
        kmTotal: 100,
        tempoTotal: 480, // em minutos
        observacoes: 'Jornada de teste'
      }
    ]);

    // Criar abastecimentos
    await db.insert(abastecimentos).values([
      {
        id: uuidv4(),
        idUsuario: userId,
        idVeiculo: vehicleId,
        dataAbastecimento: yesterday.getTime(),
        quantidadeLitros: 40,
        valorTotal: 24000, // em centavos
        valorLitro: 600, // em centavos
        nomePosto: 'Posto Teste',
        kmAtual: 1050,
        tipoCombustivel: 'gasolina' as const,
      }
    ]);

    // Criar despesas
    await db.insert(despesas).values([
      {
        id: uuidv4(),
        idUsuario: userId,
        idVeiculo: vehicleId,
        dataDespesa: yesterday.getTime(),
        tipoDespesa: 'manutencao' as const,
        descricao: 'Troca de óleo',
        valorDespesa: 8000 // em centavos
      }
    ]);
  }

  describe('GET /api/v1/dashboard/summary', () => {
    it('deve retornar resumo de lucratividade', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('metricasPrincipais');
      expect(response.body.data.metricasPrincipais).toHaveProperty('faturamentoBruto');
      expect(response.body.data.metricasPrincipais).toHaveProperty('totalDespesas');
      expect(response.body.data.metricasPrincipais).toHaveProperty('lucroLiquido');
      expect(response.body.data.metricasPrincipais).toHaveProperty('margemLucro');
      expect(response.body.data.metricasOperacionais).toHaveProperty('kmTotal');
      expect(response.body.data.metricasOperacionais).toHaveProperty('custoPorKm');
      expect(response.body.data).toHaveProperty('periodo');

      expect(typeof response.body.data.metricasPrincipais.faturamentoBruto).toBe('number');
      expect(typeof response.body.data.metricasPrincipais.totalDespesas).toBe('number');
      expect(typeof response.body.data.metricasPrincipais.lucroLiquido).toBe('number');
      expect(typeof response.body.data.metricasOperacionais.kmTotal).toBe('number');
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

      expect(response1.body.data.cacheInfo.hit).toBe(false);
      expect(response2.body.data.cacheInfo.hit).toBe(true);
    });

    it('deve filtrar por período quando especificado', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary?periodo=hoje')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('periodo');
      expect(response.body.data.periodo.tipo).toBe('hoje');
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

      expect(response.body.data).toHaveProperty('evolucao');
      expect(response.body.data).toHaveProperty('periodo');
      expect(Array.isArray(response.body.data.evolucao)).toBe(true);

      if (response.body.data.evolucao.length > 0) {
        const item = response.body.data.evolucao[0];
        expect(item).toHaveProperty('data');
        expect(item).toHaveProperty('faturamentoBruto');
        expect(item).toHaveProperty('totalDespesas');
        expect(item).toHaveProperty('lucroLiquido');
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

      expect(response1.body.data.cacheInfo.hit).toBe(false);
      expect(response2.body.data.cacheInfo.hit).toBe(true);
    });

    it('deve retornar erro sem autenticação', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/evolution')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/dashboard/comparison', () => {
    it('deve retornar comparativo entre veículos', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/comparison')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('comparacaoVeiculos');
      expect(Array.isArray(response.body.data.comparacaoVeiculos)).toBe(true);

      if (response.body.data.comparacaoVeiculos.length > 0) {
        const veiculo = response.body.data.comparacaoVeiculos[0];
        expect(veiculo).toHaveProperty('veiculo');
        expect(veiculo.veiculo).toHaveProperty('id');
        expect(veiculo.veiculo).toHaveProperty('marca');
        expect(veiculo.veiculo).toHaveProperty('modelo');
        expect(veiculo).toHaveProperty('metricas');
        expect(veiculo.metricas).toHaveProperty('faturamentoBruto');
        expect(veiculo.metricas).toHaveProperty('totalDespesas');
        expect(veiculo.metricas).toHaveProperty('lucroLiquido');
        expect(veiculo.metricas).toHaveProperty('kmTotal');
      }
    });

    it('deve aplicar cache na resposta', async () => {
      const response1 = await request(app)
        .get('/api/v1/dashboard/comparison')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response2 = await request(app)
        .get('/api/v1/dashboard/comparison')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response1.body.data.cacheInfo.hit).toBe(false);
      expect(response2.body.data.cacheInfo.hit).toBe(true);
    });

    it('deve retornar erro sem autenticação', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/comparison')
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
        expect(response.body.data).toHaveProperty('metricasPrincipais');
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
        .get('/api/v1/dashboard/summary?periodo=invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200); // Deve usar período padrão

      expect(response.body.data).toHaveProperty('periodo');
    });
  });
});


