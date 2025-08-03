const axios = require('axios');

// Configuração base para testes
const API_BASE_URL = 'http://localhost:3000/api/v1';
const TEST_USER_EMAIL = 'teste@exemplo.com';
const TEST_USER_PASSWORD = 'senha123';

let authToken = '';

// Função para fazer login e obter token
async function login() {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD
    });
    
    if (response.data.success && response.data.data.token) {
      authToken = response.data.data.token;
      console.log('✅ Login realizado com sucesso');
      return true;
    } else {
      console.log('❌ Falha no login:', response.data.error?.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro no login:', error.response?.data?.error?.message || error.message);
    return false;
  }
}

// Função para fazer requisições autenticadas
async function makeAuthenticatedRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || error.message);
  }
}

// Teste do relatório semanal
async function testWeeklyReport() {
  console.log('\n📊 Testando Relatório Semanal...');
  
  try {
    const result = await makeAuthenticatedRequest('GET', '/reports/weekly');
    
    if (result.success && result.data) {
      console.log('✅ Relatório semanal gerado com sucesso');
      console.log('📈 Resumo financeiro:');
      console.log(`   - Faturamento Bruto: R$ ${(result.data.resumo_financeiro.faturamento_bruto / 100).toFixed(2)}`);
      console.log(`   - Total Despesas: R$ ${(result.data.resumo_financeiro.total_despesas / 100).toFixed(2)}`);
      console.log(`   - Lucro Líquido: R$ ${(result.data.resumo_financeiro.lucro_liquido / 100).toFixed(2)}`);
      console.log(`   - Margem de Lucro: ${result.data.resumo_financeiro.margem_lucro.toFixed(1)}%`);
      console.log(`   - KM Total: ${result.data.resumo_financeiro.km_total} km`);
      console.log(`   - Número de Jornadas: ${result.data.resumo_financeiro.numero_jornadas}`);
      return true;
    } else {
      console.log('❌ Falha ao gerar relatório semanal:', result.error?.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro no relatório semanal:', error.message);
    return false;
  }
}

// Teste do relatório mensal
async function testMonthlyReport() {
  console.log('\n📊 Testando Relatório Mensal...');
  
  try {
    const result = await makeAuthenticatedRequest('GET', '/reports/monthly');
    
    if (result.success && result.data) {
      console.log('✅ Relatório mensal gerado com sucesso');
      console.log('📈 Resumo financeiro:');
      console.log(`   - Faturamento Bruto: R$ ${(result.data.resumo_financeiro.faturamento_bruto / 100).toFixed(2)}`);
      console.log(`   - Total Despesas: R$ ${(result.data.resumo_financeiro.total_despesas / 100).toFixed(2)}`);
      console.log(`   - Lucro Líquido: R$ ${(result.data.resumo_financeiro.lucro_liquido / 100).toFixed(2)}`);
      console.log(`   - Margem de Lucro: ${result.data.resumo_financeiro.margem_lucro.toFixed(1)}%`);
      console.log(`   - KM Total: ${result.data.resumo_financeiro.km_total} km`);
      console.log(`   - Número de Jornadas: ${result.data.resumo_financeiro.numero_jornadas}`);
      return true;
    } else {
      console.log('❌ Falha ao gerar relatório mensal:', result.error?.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro no relatório mensal:', error.message);
    return false;
  }
}

// Teste do comparativo semanal
async function testWeeklyComparison() {
  console.log('\n📊 Testando Comparativo Semanal...');
  
  try {
    const result = await makeAuthenticatedRequest('GET', '/reports/weekly-comparison?numero_semanas=4');
    
    if (result.success && result.data) {
      console.log('✅ Comparativo semanal gerado com sucesso');
      console.log('📈 Últimas 4 semanas:');
      result.data.comparativo_semanas.forEach((semana, index) => {
        console.log(`   Semana ${semana.numero_semana}: R$ ${(semana.lucro_liquido / 100).toFixed(2)} (${semana.margem_lucro.toFixed(1)}% margem)`);
      });
      return true;
    } else {
      console.log('❌ Falha ao gerar comparativo semanal:', result.error?.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro no comparativo semanal:', error.message);
    return false;
  }
}

// Teste do comparativo mensal
async function testMonthlyComparison() {
  console.log('\n📊 Testando Comparativo Mensal...');
  
  try {
    const result = await makeAuthenticatedRequest('GET', '/reports/monthly-comparison?numero_meses=6');
    
    if (result.success && result.data) {
      console.log('✅ Comparativo mensal gerado com sucesso');
      console.log('📈 Últimos 6 meses:');
      result.data.comparativo_meses.forEach((mes, index) => {
        console.log(`   ${mes.mes_ano}: R$ ${(mes.lucro_liquido / 100).toFixed(2)} (${mes.margem_lucro.toFixed(1)}% margem)`);
      });
      return true;
    } else {
      console.log('❌ Falha ao gerar comparativo mensal:', result.error?.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro no comparativo mensal:', error.message);
    return false;
  }
}

// Teste de download CSV
async function testCSVDownload() {
  console.log('\n📄 Testando Download CSV...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/reports/weekly?formato=csv`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      responseType: 'text'
    });
    
    if (response.data && response.data.includes('Período')) {
      console.log('✅ Download CSV funcionando');
      console.log('📄 Primeiras linhas do CSV:');
      console.log(response.data.split('\n').slice(0, 3).join('\n'));
      return true;
    } else {
      console.log('❌ Falha no download CSV');
      return false;
    }
  } catch (error) {
    console.log('❌ Erro no download CSV:', error.message);
    return false;
  }
}

// Função principal de teste
async function runTests() {
  console.log('🚀 Iniciando testes dos relatórios semanais e mensais...\n');
  
  // Fazer login primeiro
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('\n❌ Não foi possível fazer login. Verifique se o servidor está rodando e se existe um usuário de teste.');
    console.log('💡 Para criar um usuário de teste, use o endpoint POST /auth/register com:');
    console.log(`   Email: ${TEST_USER_EMAIL}`);
    console.log(`   Password: ${TEST_USER_PASSWORD}`);
    return;
  }
  
  // Executar testes
  const tests = [
    { name: 'Relatório Semanal', fn: testWeeklyReport },
    { name: 'Relatório Mensal', fn: testMonthlyReport },
    { name: 'Comparativo Semanal', fn: testWeeklyComparison },
    { name: 'Comparativo Mensal', fn: testMonthlyComparison },
    { name: 'Download CSV', fn: testCSVDownload }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    const success = await test.fn();
    if (success) passedTests++;
  }
  
  // Resumo dos testes
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO DOS TESTES');
  console.log('='.repeat(50));
  console.log(`✅ Testes aprovados: ${passedTests}/${totalTests}`);
  console.log(`❌ Testes falharam: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 Todos os testes passaram! A implementação está funcionando corretamente.');
  } else {
    console.log('\n⚠️  Alguns testes falharam. Verifique os logs acima para mais detalhes.');
  }
  
  console.log('\n💡 Dicas para resolver problemas:');
  console.log('   - Verifique se o servidor backend está rodando na porta 3000');
  console.log('   - Certifique-se de que existe um usuário de teste no banco de dados');
  console.log('   - Verifique se existem dados de jornadas, abastecimentos e despesas para teste');
}

// Executar testes se o script for chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testWeeklyReport,
  testMonthlyReport,
  testWeeklyComparison,
  testMonthlyComparison,
  testCSVDownload
};

