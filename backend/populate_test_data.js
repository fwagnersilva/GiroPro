const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'giropro.db');
const db = new sqlite3.Database(dbPath);

// Dados de teste
const testData = {
  // Usuário de teste já existe, vamos usar o ID existente
  userId: '76580f2f-6be3-4c79-881b-1b368e333356',
  
  // Dados de veículo
  veiculo: {
    id: 'veiculo-test-001',
    marca: 'Honda',
    modelo: 'Civic',
    ano: 2019,
    placa: 'ABC1234',
    combustivel: 'flex',
    capacidadeTanque: 47,
    idUsuario: '76580f2f-6be3-4c79-881b-1b368e333356'
  },
  
  // Dados de jornadas
  jornadas: [
    {
      id: 'jornada-001',
      veiculoId: 'veiculo-test-001',
      idUsuario: '76580f2f-6be3-4c79-881b-1b368e333356',
      dataInicio: Math.floor(Date.now() / 1000) - 86400, // ontem
      dataFim: Math.floor(Date.now() / 1000) - 86400 + 28800, // 8 horas depois
      kmInicial: 15000,
      kmFinal: 15200,
      ganhoBruto: 28050, // R$ 280,50 em centavos
      plataforma: 'uber',
      observacoes: 'Dia de trabalho normal'
    },
    {
      id: 'jornada-002',
      veiculoId: 'veiculo-test-001',
      idUsuario: '76580f2f-6be3-4c79-881b-1b368e333356',
      dataInicio: Math.floor(Date.now() / 1000) - 172800, // 2 dias atrás
      dataFim: Math.floor(Date.now() / 1000) - 172800 + 25200, // 7 horas depois
      kmInicial: 14750,
      kmFinal: 15000,
      ganhoBruto: 32500, // R$ 325,00 em centavos
      plataforma: '99',
      observacoes: 'Bom movimento no final de semana'
    }
  ],
  
  // Dados de abastecimentos
  abastecimentos: [
    {
      id: 'abast-001',
      veiculoId: 'veiculo-test-001',
      idUsuario: '76580f2f-6be3-4c79-881b-1b368e333356',
      data: Math.floor(Date.now() / 1000) - 86400,
      quantidadeLitros: 35,
      valorTotal: 21000, // R$ 210,00 em centavos
      valorLitro: 600, // R$ 6,00 em centavos
      posto: 'Shell Centro',
      kmAtual: 15000,
      tanqueCheio: true
    }
  ],
  
  // Dados de despesas
  despesas: [
    {
      id: 'despesa-001',
      veiculoId: 'veiculo-test-001',
      idUsuario: '76580f2f-6be3-4c79-881b-1b368e333356',
      data: Math.floor(Date.now() / 1000) - 172800,
      categoria: 'manutencao',
      descricao: 'Troca de óleo e filtros',
      valorDespesa: 12000, // R$ 120,00 em centavos
      observacoes: 'Manutenção preventiva aos 15.000 km'
    },
    {
      id: 'despesa-002',
      veiculoId: 'veiculo-test-001',
      idUsuario: '76580f2f-6be3-4c79-881b-1b368e333356',
      data: Math.floor(Date.now() / 1000) - 259200,
      categoria: 'combustivel',
      descricao: 'Abastecimento anterior',
      valorDespesa: 18500, // R$ 185,00 em centavos
      observacoes: 'Posto BR'
    }
  ]
};

console.log('Populando banco com dados de teste...');

// Inserir veículo
db.run(`INSERT OR REPLACE INTO veiculos (id, marca, modelo, ano, placa, combustivel, capacidadeTanque, idUsuario, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [testData.veiculo.id, testData.veiculo.marca, testData.veiculo.modelo, testData.veiculo.ano, 
   testData.veiculo.placa, testData.veiculo.combustivel, testData.veiculo.capacidadeTanque, 
   testData.veiculo.idUsuario, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000)],
  function(err) {
    if (err) console.error('Erro ao inserir veículo:', err);
    else console.log('✓ Veículo inserido');
  });

// Inserir jornadas
testData.jornadas.forEach((jornada, index) => {
  db.run(`INSERT OR REPLACE INTO jornadas (id, veiculoId, idUsuario, dataInicio, dataFim, kmInicial, kmFinal, ganhoBruto, plataforma, observacoes, createdAt, updatedAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [jornada.id, jornada.veiculoId, jornada.idUsuario, jornada.dataInicio, jornada.dataFim,
     jornada.kmInicial, jornada.kmFinal, jornada.ganhoBruto, jornada.plataforma, jornada.observacoes,
     Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000)],
    function(err) {
      if (err) console.error(`Erro ao inserir jornada ${index + 1}:`, err);
      else console.log(`✓ Jornada ${index + 1} inserida`);
    });
});

// Inserir abastecimentos
testData.abastecimentos.forEach((abast, index) => {
  db.run(`INSERT OR REPLACE INTO abastecimentos (id, veiculoId, idUsuario, data, quantidadeLitros, valorTotal, valorLitro, posto, kmAtual, tanqueCheio, createdAt, updatedAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [abast.id, abast.veiculoId, abast.idUsuario, abast.data, abast.quantidadeLitros,
     abast.valorTotal, abast.valorLitro, abast.posto, abast.kmAtual, abast.tanqueCheio,
     Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000)],
    function(err) {
      if (err) console.error(`Erro ao inserir abastecimento ${index + 1}:`, err);
      else console.log(`✓ Abastecimento ${index + 1} inserido`);
    });
});

// Inserir despesas
testData.despesas.forEach((despesa, index) => {
  db.run(`INSERT OR REPLACE INTO despesas (id, veiculoId, idUsuario, data, categoria, descricao, valorDespesa, observacoes, createdAt, updatedAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [despesa.id, despesa.veiculoId, despesa.idUsuario, despesa.data, despesa.categoria,
     despesa.descricao, despesa.valorDespesa, despesa.observacoes,
     Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000)],
    function(err) {
      if (err) console.error(`Erro ao inserir despesa ${index + 1}:`, err);
      else console.log(`✓ Despesa ${index + 1} inserida`);
    });
});

setTimeout(() => {
  console.log('\n📊 Dados de teste inseridos com sucesso!');
  db.close();
}, 1000);
