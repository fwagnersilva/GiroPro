const Database = require('better-sqlite3');
const path = require('path');

// Conectar ao banco de dados
const dbPath = path.join(__dirname, 'giropro.db');
const db = new Database(dbPath);

console.log('🔍 Iniciando análise de queries lentas...\n');

// Habilitar logging de queries
db.pragma('query_only = OFF');

// Função para medir tempo de execução
function measureQuery(query, description) {
  const start = process.hrtime.bigint();
  try {
    const result = db.prepare(query).all();
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Converter para ms
    
    console.log(`📊 ${description}`);
    console.log(`   Query: ${query.substring(0, 80)}${query.length > 80 ? '...' : ''}`);
    console.log(`   Tempo: ${duration.toFixed(2)}ms`);
    console.log(`   Registros: ${result.length}`);
    console.log('');
    
    return { query, description, duration, recordCount: result.length };
  } catch (error) {
    console.log(`❌ Erro na query: ${description}`);
    console.log(`   Erro: ${error.message}`);
    console.log('');
    return { query, description, duration: -1, error: error.message };
  }
}

// Lista de queries para testar
const queries = [
  {
    query: "SELECT name FROM sqlite_master WHERE type='table'",
    description: "Listar tabelas"
  },
  {
    query: "SELECT COUNT(*) as total FROM usuarios",
    description: "Contar usuários"
  },
  {
    query: "SELECT COUNT(*) as total FROM veiculos",
    description: "Contar veículos"
  },
  {
    query: "SELECT COUNT(*) as total FROM jornadas",
    description: "Contar jornadas"
  },
  {
    query: "SELECT COUNT(*) as total FROM abastecimentos",
    description: "Contar abastecimentos"
  },
  {
    query: "SELECT COUNT(*) as total FROM despesas",
    description: "Contar despesas"
  },
  {
    query: "SELECT u.nome, COUNT(v.id) as total_veiculos FROM usuarios u LEFT JOIN veiculos v ON u.id = v.usuario_id GROUP BY u.id",
    description: "Usuários com contagem de veículos (JOIN)"
  },
  {
    query: "SELECT v.modelo, COUNT(j.id) as total_jornadas FROM veiculos v LEFT JOIN jornadas j ON v.id = j.veiculo_id GROUP BY v.id ORDER BY total_jornadas DESC",
    description: "Veículos com contagem de jornadas (JOIN + ORDER BY)"
  },
  {
    query: "SELECT j.*, v.modelo FROM jornadas j INNER JOIN veiculos v ON j.veiculo_id = v.id WHERE j.data_inicio >= date('now', '-30 days')",
    description: "Jornadas dos últimos 30 dias (JOIN + WHERE com data)"
  },
  {
    query: "SELECT AVG(a.valor_total) as media_abastecimento, v.modelo FROM abastecimentos a INNER JOIN veiculos v ON a.veiculo_id = v.id GROUP BY v.id",
    description: "Média de abastecimento por veículo (JOIN + AVG + GROUP BY)"
  }
];

// Executar análise
const results = [];
queries.forEach(({ query, description }) => {
  const result = measureQuery(query, description);
  results.push(result);
});

// Análise de índices
console.log('📋 ANÁLISE DE ÍNDICES:\n');
const indexes = db.prepare("SELECT name, tbl_name, sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL").all();
console.log(`Total de índices: ${indexes.length}\n`);

indexes.forEach(index => {
  console.log(`📌 ${index.name} (tabela: ${index.tbl_name})`);
  console.log(`   SQL: ${index.sql}`);
  console.log('');
});

// Estatísticas do banco
console.log('📊 ESTATÍSTICAS DO BANCO:\n');
const pageCount = db.prepare('PRAGMA page_count').get();
const pageSize = db.prepare('PRAGMA page_size').get();
const cacheSize = db.prepare('PRAGMA cache_size').get();
const journalMode = db.prepare('PRAGMA journal_mode').get();

console.log(`Páginas: ${pageCount.page_count}`);
console.log(`Tamanho da página: ${pageSize.page_size} bytes`);
console.log(`Tamanho do banco: ${(pageCount.page_count * pageSize.page_size / 1024 / 1024).toFixed(2)} MB`);
console.log(`Cache: ${Math.abs(cacheSize.cache_size)} páginas`);
console.log(`Journal mode: ${journalMode.journal_mode}`);

// Resumo das queries mais lentas
console.log('\n🐌 RESUMO - QUERIES MAIS LENTAS:\n');
const validResults = results.filter(r => r.duration >= 0);
validResults.sort((a, b) => b.duration - a.duration);

validResults.forEach((result, index) => {
  if (index < 5) { // Top 5
    console.log(`${index + 1}. ${result.description}: ${result.duration.toFixed(2)}ms`);
  }
});

// Recomendações
console.log('\n💡 RECOMENDAÇÕES:\n');
const slowQueries = validResults.filter(r => r.duration > 10);
if (slowQueries.length === 0) {
  console.log('✅ Todas as queries estão executando rapidamente (< 10ms)');
  console.log('✅ Performance do banco está excelente');
} else {
  console.log(`⚠️  ${slowQueries.length} queries lentas identificadas (> 10ms):`);
  slowQueries.forEach(q => {
    console.log(`   - ${q.description}: ${q.duration.toFixed(2)}ms`);
  });
}

db.close();
console.log('\n✅ Análise concluída!');
