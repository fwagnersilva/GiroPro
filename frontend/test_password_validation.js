/**
 * Teste simples da validação de senha
 * Simula a lógica implementada no frontend
 */

// Regex exata do backend
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

function validatePassword(password) {
  const criteria = [
    { text: 'Mínimo de 8 caracteres', valid: password.length >= 8 },
    { text: 'Pelo menos 1 letra minúscula', valid: /[a-z]/.test(password) },
    { text: 'Pelo menos 1 letra maiúscula', valid: /[A-Z]/.test(password) },
    { text: 'Pelo menos 1 número', valid: /\d/.test(password) },
    { text: 'Pelo menos 1 caractere especial (@$!%*?&)', valid: /[@$!%*?&]/.test(password) },
  ];

  const allCriteriaMet = criteria.every(criterion => criterion.valid);
  const onlyAllowedChars = PASSWORD_REGEX.test(password);

  let message = null;
  let isValid = false;

  if (password.trim() === '') {
    isValid = false;
    message = null;
  } else if (password.length < 8) {
    message = 'Senha deve ter pelo menos 8 caracteres';
  } else if (!criteria[1].valid) {
    message = 'Senha deve conter pelo menos 1 letra minúscula';
  } else if (!criteria[2].valid) {
    message = 'Senha deve conter pelo menos 1 letra maiúscula';
  } else if (!criteria[3].valid) {
    message = 'Senha deve conter pelo menos 1 número';
  } else if (!criteria[4].valid) {
    message = 'Senha deve conter pelo menos 1 caractere especial (@$!%*?&)';
  } else if (!onlyAllowedChars) {
    message = 'Senha contém caracteres não permitidos. Use apenas letras, números e @$!%*?&';
  } else {
    isValid = true;
    message = null;
  }

  return { isValid, message, criteria };
}

// Senhas de teste
const testPasswords = [
  { label: 'Senha fraca', value: '123', expected: false },
  { label: 'Sem maiúscula', value: 'senha123!', expected: false },
  { label: 'Sem minúscula', value: 'SENHA123!', expected: false },
  { label: 'Sem número', value: 'SenhaForte!', expected: false },
  { label: 'Sem especial', value: 'SenhaForte123', expected: false },
  { label: 'Caractere inválido', value: 'SenhaForte123#', expected: false },
  { label: 'Senha válida 1', value: 'MinhaSenh@123', expected: true },
  { label: 'Senha válida 2', value: 'SuperSenh@Forte2024!', expected: true },
  { label: 'Senha válida 3', value: 'Test123$', expected: true },
  { label: 'Senha válida 4', value: 'MyP@ssw0rd', expected: true },
];

console.log('=== TESTE DE VALIDAÇÃO DE SENHA ===\n');
console.log('Regex do backend: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]/\n');

let passedTests = 0;
let totalTests = testPasswords.length;

testPasswords.forEach((test, index) => {
  const result = validatePassword(test.value);
  const passed = result.isValid === test.expected;
  
  console.log(`${index + 1}. ${test.label}`);
  console.log(`   Senha: "${test.value}"`);
  console.log(`   Esperado: ${test.expected ? 'VÁLIDA' : 'INVÁLIDA'}`);
  console.log(`   Resultado: ${result.isValid ? 'VÁLIDA' : 'INVÁLIDA'}`);
  
  if (result.message) {
    console.log(`   Erro: ${result.message}`);
  }
  
  console.log(`   Critérios:`);
  result.criteria.forEach(criterion => {
    console.log(`     ${criterion.valid ? '✓' : '✗'} ${criterion.text}`);
  });
  
  console.log(`   Status: ${passed ? '✅ PASSOU' : '❌ FALHOU'}\n`);
  
  if (passed) passedTests++;
});

console.log(`=== RESULTADO FINAL ===`);
console.log(`Testes passados: ${passedTests}/${totalTests}`);
console.log(`Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log('🎉 TODOS OS TESTES PASSARAM! A validação está funcionando corretamente.');
} else {
  console.log('⚠️  Alguns testes falharam. Verifique a implementação.');
}

