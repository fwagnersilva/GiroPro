const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testRateLimit() {
  console.log('🧪 Testando Rate Limiting...\n');
  
  try {
    // Teste 1: Rate limiting geral
    console.log('📊 Teste 1: Rate limiting geral (100 req/15min)');
    for (let i = 1; i <= 5; i++) {
      try {
        const response = await axios.get(`${BASE_URL}/health`);
        console.log(`✅ Request ${i}: Status ${response.status} - ${response.data.message}`);
        
        // Verificar headers de rate limit
        if (response.headers['x-ratelimit-limit']) {
          console.log(`   Rate Limit: ${response.headers['x-ratelimit-remaining']}/${response.headers['x-ratelimit-limit']} remaining`);
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.log(`❌ Request ${i}: Rate limit atingido - ${error.response.data.error.message}`);
        } else {
          console.log(`❌ Request ${i}: Erro - ${error.message}`);
        }
      }
    }
    
    console.log('\n📊 Teste 2: Rate limiting de autenticação (5 req/15min)');
    // Teste 2: Rate limiting de autenticação
    for (let i = 1; i <= 7; i++) {
      try {
        const response = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
          email: 'test@example.com',
          password: 'testpassword'
        });
        console.log(`✅ Auth Request ${i}: Status ${response.status}`);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.log(`❌ Auth Request ${i}: Rate limit atingido - ${error.response.data.error.message}`);
          console.log(`   Retry After: ${error.response.data.error.retryAfter} segundos`);
        } else if (error.response && error.response.status === 401) {
          console.log(`✅ Auth Request ${i}: Credenciais inválidas (esperado) - Rate limit funcionando`);
        } else {
          console.log(`❌ Auth Request ${i}: Erro - ${error.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

// Executar teste apenas se o arquivo for executado diretamente
if (require.main === module) {
  testRateLimit();
}

module.exports = { testRateLimit };

