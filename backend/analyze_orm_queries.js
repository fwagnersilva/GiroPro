const fs = require('fs');
const path = require('path');

console.log('🔍 Iniciando análise de queries ORM/SQL...\n');

// Função para analisar um arquivo
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  console.log(`📄 Analisando: ${fileName}`);
  
  const issues = [];
  const optimizations = [];
  
  // Padrões a verificar
  const patterns = {
    // Problemas comuns
    selectAll: /\.select\(\s*\*\s*\)/g,
    noLimit: /\.findMany\(\s*\{[^}]*\}\s*\)/g,
    nPlusOne: /\.forEach\s*\(\s*async/g,
    noIndex: /\.where\s*\(\s*\{[^}]*\}\s*\)/g,
    
    // Boas práticas
    selectSpecific: /\.select\s*\(\s*\{[^}]+\}\s*\)/g,
    withLimit: /\.limit\s*\(\s*\d+\s*\)/g,
    withPagination: /\.offset\s*\(\s*\d+\s*\)/g,
    withJoin: /\.leftJoin|\.innerJoin|\.join/g,
    withTransaction: /\.transaction\s*\(/g,
    withCache: /cache\./g,
  };
  
  // Verificar problemas
  if (patterns.selectAll.test(content)) {
    issues.push('❌ SELECT * encontrado - especifique campos necessários');
  }
  
  if (patterns.nPlusOne.test(content)) {
    issues.push('⚠️  Possível problema N+1 - use JOINs ou includes');
  }
  
  // Verificar otimizações
  if (patterns.selectSpecific.test(content)) {
    optimizations.push('✅ SELECT específico implementado');
  }
  
  if (patterns.withLimit.test(content)) {
    optimizations.push('✅ LIMIT implementado');
  }
  
  if (patterns.withPagination.test(content)) {
    optimizations.push('✅ Paginação implementada');
  }
  
  if (patterns.withJoin.test(content)) {
    optimizations.push('✅ JOINs utilizados');
  }
  
  if (patterns.withTransaction.test(content)) {
    optimizations.push('✅ Transações implementadas');
  }
  
  if (patterns.withCache.test(content)) {
    optimizations.push('✅ Cache implementado');
  }
  
  // Análise específica do Drizzle ORM
  const drizzlePatterns = {
    optimizedSelect: /\.select\s*\(\s*\{[\s\S]*?\}\s*\)/g,
    withConditions: /and\s*\(|or\s*\(/g,
    withAggregation: /sum\s*\(|count\s*\(|avg\s*\(|max\s*\(|min\s*\(/g,
    withGroupBy: /\.groupBy\s*\(/g,
    withOrderBy: /\.orderBy\s*\(/g,
  };
  
  if (drizzlePatterns.optimizedSelect.test(content)) {
    optimizations.push('✅ Drizzle select otimizado');
  }
  
  if (drizzlePatterns.withConditions.test(content)) {
    optimizations.push('✅ Condições complexas bem estruturadas');
  }
  
  if (drizzlePatterns.withAggregation.test(content)) {
    optimizations.push('✅ Funções de agregação utilizadas');
  }
  
  // Contar queries
  const queryCount = (content.match(/\.select\s*\(|\.findMany\s*\(|\.findFirst\s*\(|\.findUnique\s*\(/g) || []).length;
  
  console.log(`   📊 Queries encontradas: ${queryCount}`);
  
  if (issues.length > 0) {
    console.log('   🚨 Problemas identificados:');
    issues.forEach(issue => console.log(`     ${issue}`));
  }
  
  if (optimizations.length > 0) {
    console.log('   ✅ Otimizações encontradas:');
    optimizations.forEach(opt => console.log(`     ${opt}`));
  }
  
  if (issues.length === 0 && optimizations.length > 0) {
    console.log('   🎉 Arquivo bem otimizado!');
  }
  
  console.log('');
  
  return {
    file: fileName,
    queryCount,
    issues: issues.length,
    optimizations: optimizations.length,
    details: { issues, optimizations }
  };
}

// Analisar todos os controllers
const controllersDir = path.join(__dirname, 'src/controllers');
const files = fs.readdirSync(controllersDir).filter(file => file.endsWith('.ts'));

const results = [];

files.forEach(file => {
  const filePath = path.join(controllersDir, file);
  const result = analyzeFile(filePath);
  results.push(result);
});

// Resumo geral
console.log('📋 RESUMO GERAL:\n');

const totalFiles = results.length;
const totalQueries = results.reduce((sum, r) => sum + r.queryCount, 0);
const totalIssues = results.reduce((sum, r) => sum + r.issues, 0);
const totalOptimizations = results.reduce((sum, r) => sum + r.optimizations, 0);

console.log(`📁 Arquivos analisados: ${totalFiles}`);
console.log(`🔍 Total de queries: ${totalQueries}`);
console.log(`🚨 Total de problemas: ${totalIssues}`);
console.log(`✅ Total de otimizações: ${totalOptimizations}`);

// Top arquivos com mais queries
console.log('\n🔥 TOP ARQUIVOS COM MAIS QUERIES:\n');
results
  .sort((a, b) => b.queryCount - a.queryCount)
  .slice(0, 5)
  .forEach((result, index) => {
    console.log(`${index + 1}. ${result.file}: ${result.queryCount} queries`);
  });

// Arquivos com problemas
const filesWithIssues = results.filter(r => r.issues > 0);
if (filesWithIssues.length > 0) {
  console.log('\n⚠️  ARQUIVOS COM PROBLEMAS:\n');
  filesWithIssues.forEach(result => {
    console.log(`📄 ${result.file}: ${result.issues} problemas`);
    result.details.issues.forEach(issue => {
      console.log(`   ${issue}`);
    });
    console.log('');
  });
}

// Arquivos bem otimizados
const wellOptimizedFiles = results.filter(r => r.issues === 0 && r.optimizations > 0);
console.log('\n🏆 ARQUIVOS BEM OTIMIZADOS:\n');
wellOptimizedFiles.forEach(result => {
  console.log(`✅ ${result.file}: ${result.optimizations} otimizações`);
});

// Recomendações
console.log('\n💡 RECOMENDAÇÕES GERAIS:\n');

if (totalIssues === 0) {
  console.log('🎉 Excelente! Nenhum problema crítico encontrado.');
  console.log('✅ Código ORM/SQL está seguindo boas práticas.');
} else {
  console.log('📝 Implementar as correções identificadas nos arquivos com problemas.');
}

console.log('🔄 Continuar monitoramento de performance das queries.');
console.log('📊 Considerar implementar métricas de performance em produção.');

console.log('\n✅ Análise concluída!');
