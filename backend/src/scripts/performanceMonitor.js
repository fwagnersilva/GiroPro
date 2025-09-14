const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor() {
    const dbPath = path.join(__dirname, '../../giropro.db');
    
    try {
      this.db = new Database(dbPath);
      console.log('✅ Monitor de performance conectado ao banco de dados');
    } catch (error) {
      console.log('❌ Erro ao conectar ao banco:', error.message);
      process.exit(1);
    }
    
    this.queryLog = [];
    this.slowQueryThreshold = 100; // ms
    this.monitoringActive = false;
  }

  // Interceptar e monitorar queries
  wrapDatabase() {
    const originalPrepare = this.db.prepare.bind(this.db);
    
    this.db.prepare = (query) => {
      const stmt = originalPrepare(query);
      const originalAll = stmt.all.bind(stmt);
      const originalGet = stmt.get.bind(stmt);
      const originalRun = stmt.run.bind(stmt);
      
      stmt.all = (...params) => {
        return this.executeWithMonitoring(query, 'all', originalAll, params);
      };
      
      stmt.get = (...params) => {
        return this.executeWithMonitoring(query, 'get', originalGet, params);
      };
      
      stmt.run = (...params) => {
        return this.executeWithMonitoring(query, 'run', originalRun, params);
      };
      
      return stmt;
    };
  }

  executeWithMonitoring(query, method, originalMethod, params) {
    if (!this.monitoringActive) {
      return originalMethod(...params);
    }
    
    const startTime = Date.now();
    const result = originalMethod(...params);
    const executionTime = Date.now() - startTime;
    
    const logEntry = {
      query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
      method,
      executionTime,
      timestamp: new Date().toISOString(),
      params: params.length > 0 ? '[PARAMS]' : 'none'
    };
    
    this.queryLog.push(logEntry);
    
    // Manter apenas as últimas 1000 queries
    if (this.queryLog.length > 1000) {
      this.queryLog = this.queryLog.slice(-1000);
    }
    
    // Log de queries lentas
    if (executionTime > this.slowQueryThreshold) {
      console.log(`⚠️  Query lenta detectada: ${executionTime}ms`);
      console.log(`   Query: ${logEntry.query}`);
    }
    
    return result;
  }

  startMonitoring() {
    console.log('🚀 Iniciando monitoramento de performance...');
    this.monitoringActive = true;
    this.wrapDatabase();
    
    // Relatório periódico a cada 30 segundos
    this.reportInterval = setInterval(() => {
      this.generatePeriodicReport();
    }, 30000);
  }

  stopMonitoring() {
    console.log('⏹️  Parando monitoramento de performance...');
    this.monitoringActive = false;
    
    if (this.reportInterval) {
      clearInterval(this.reportInterval);
    }
  }

  generatePeriodicReport() {
    const recentQueries = this.queryLog.filter(q => 
      Date.now() - new Date(q.timestamp).getTime() < 30000 // Últimos 30 segundos
    );
    
    if (recentQueries.length === 0) {
      return;
    }
    
    const slowQueries = recentQueries.filter(q => q.executionTime > this.slowQueryThreshold);
    const avgTime = recentQueries.reduce((sum, q) => sum + q.executionTime, 0) / recentQueries.length;
    
    console.log('📊 Relatório de Performance (últimos 30s):');
    console.log(`   Total de queries: ${recentQueries.length}`);
    console.log(`   Queries lentas: ${slowQueries.length}`);
    console.log(`   Tempo médio: ${avgTime.toFixed(2)}ms`);
    
    if (slowQueries.length > 0) {
      console.log('   Queries mais lentas:');
      slowQueries
        .sort((a, b) => b.executionTime - a.executionTime)
        .slice(0, 3)
        .forEach(q => {
          console.log(`     - ${q.executionTime}ms: ${q.query.substring(0, 80)}...`);
        });
    }
    console.log('');
  }

  // Simular carga de trabalho para teste
  async simulateWorkload() {
    console.log('🔄 Simulando carga de trabalho...');
    
    const queries = [
      "SELECT COUNT(*) FROM usuarios WHERE statusConta = 'ativo'",
      "SELECT * FROM jornadas WHERE idUsuario = 'test-user' ORDER BY dataInicio DESC LIMIT 10",
      "SELECT j.*, v.marca FROM jornadas j JOIN veiculos v ON j.idVeiculo = v.id WHERE j.idUsuario = 'test-user'",
      "SELECT SUM(ganhoBruto) FROM jornadas WHERE dataInicio >= datetime('now', '-30 days')",
      "SELECT * FROM abastecimentos WHERE dataAbastecimento >= datetime('now', '-7 days') ORDER BY dataAbastecimento DESC"
    ];
    
    for (let i = 0; i < 50; i++) {
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      
      try {
        const stmt = this.db.prepare(randomQuery);
        stmt.all();
        
        // Pequena pausa entre queries
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      } catch (error) {
        // Ignorar erros de queries de teste
      }
    }
    
    console.log('✅ Simulação de carga concluída');
  }

  // Análise de padrões de uso
  analyzeQueryPatterns() {
    console.log('🔍 Analisando padrões de queries...');
    
    const patterns = {};
    const tableUsage = {};
    const methodUsage = { all: 0, get: 0, run: 0 };
    
    this.queryLog.forEach(entry => {
      // Contar métodos
      methodUsage[entry.method]++;
      
      // Extrair tabelas mencionadas
      const tables = ['usuarios', 'jornadas', 'veiculos', 'abastecimentos', 'despesas'];
      tables.forEach(table => {
        if (entry.query.toLowerCase().includes(table)) {
          tableUsage[table] = (tableUsage[table] || 0) + 1;
        }
      });
      
      // Categorizar tipos de query
      const queryLower = entry.query.toLowerCase();
      let category = 'other';
      
      if (queryLower.includes('select')) category = 'select';
      else if (queryLower.includes('insert')) category = 'insert';
      else if (queryLower.includes('update')) category = 'update';
      else if (queryLower.includes('delete')) category = 'delete';
      
      patterns[category] = (patterns[category] || 0) + 1;
    });
    
    console.log('📈 Padrões de uso:');
    console.log('   Tipos de query:', patterns);
    console.log('   Métodos:', methodUsage);
    console.log('   Tabelas mais acessadas:', tableUsage);
    
    return { patterns, tableUsage, methodUsage };
  }

  // Gerar relatório completo
  generateFullReport() {
    const slowQueries = this.queryLog.filter(q => q.executionTime > this.slowQueryThreshold);
    const patterns = this.analyzeQueryPatterns();
    
    const report = {
      timestamp: new Date().toISOString(),
      monitoring: {
        totalQueries: this.queryLog.length,
        slowQueries: slowQueries.length,
        slowQueryThreshold: this.slowQueryThreshold,
        averageExecutionTime: this.queryLog.reduce((sum, q) => sum + q.executionTime, 0) / this.queryLog.length
      },
      patterns,
      slowestQueries: slowQueries
        .sort((a, b) => b.executionTime - a.executionTime)
        .slice(0, 10),
      recommendations: this.generateRecommendations(slowQueries, patterns)
    };
    
    // Salvar relatório
    const reportDir = path.join(__dirname, '../../reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportPath = path.join(reportDir, 'performance_monitoring_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📄 Relatório de monitoramento salvo em:', reportPath);
    
    return report;
  }

  generateRecommendations(slowQueries, patterns) {
    const recommendations = [];
    
    if (slowQueries.length > 0) {
      recommendations.push(`Detectadas ${slowQueries.length} queries lentas - considere otimização`);
      
      // Analisar padrões de queries lentas
      const slowPatterns = {};
      slowQueries.forEach(q => {
        if (q.query.includes('JOIN')) {
          slowPatterns.join = (slowPatterns.join || 0) + 1;
        }
        if (q.query.includes('ORDER BY')) {
          slowPatterns.orderBy = (slowPatterns.orderBy || 0) + 1;
        }
        if (q.query.includes('GROUP BY')) {
          slowPatterns.groupBy = (slowPatterns.groupBy || 0) + 1;
        }
      });
      
      if (slowPatterns.join > 0) {
        recommendations.push('Queries com JOIN estão lentas - verificar índices em colunas de junção');
      }
      
      if (slowPatterns.orderBy > 0) {
        recommendations.push('Queries com ORDER BY estão lentas - considerar índices em colunas de ordenação');
      }
    }
    
    // Recomendações baseadas em padrões de uso
    if (patterns.tableUsage.jornadas > patterns.tableUsage.usuarios * 2) {
      recommendations.push('Tabela jornadas é muito acessada - verificar se índices estão otimizados');
    }
    
    if (patterns.methodUsage.all > patterns.methodUsage.get * 5) {
      recommendations.push('Muitas queries retornando múltiplos resultados - considerar paginação');
    }
    
    return recommendations;
  }

  close() {
    this.stopMonitoring();
    if (this.db) {
      this.db.close();
    }
  }
}

// Executar monitoramento se chamado diretamente
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  
  console.log('🎯 Iniciando teste de monitoramento de performance...');
  
  monitor.startMonitoring();
  
  // Simular carga e gerar relatório
  setTimeout(async () => {
    await monitor.simulateWorkload();
    
    setTimeout(() => {
      const report = monitor.generateFullReport();
      
      console.log('📊 RESUMO DO MONITORAMENTO');
      console.log('=' .repeat(50));
      console.log(`Total de queries monitoradas: ${report.monitoring.totalQueries}`);
      console.log(`Queries lentas detectadas: ${report.monitoring.slowQueries}`);
      console.log(`Tempo médio de execução: ${report.monitoring.averageExecutionTime.toFixed(2)}ms`);
      console.log('');
      
      if (report.recommendations.length > 0) {
        console.log('💡 RECOMENDAÇÕES:');
        report.recommendations.forEach((rec, index) => {
          console.log(`${index + 1}. ${rec}`);
        });
      }
      
      monitor.close();
      console.log('✅ Monitoramento concluído');
    }, 2000);
  }, 1000);
}

module.exports = PerformanceMonitor;

