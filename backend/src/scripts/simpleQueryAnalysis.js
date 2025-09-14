const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

class SimpleQueryAnalyzer {
  constructor() {
    // Tentar conectar ao banco de dados
    const dbPath = path.join(__dirname, '../../giropro.db');
    
    try {
      this.db = new Database(dbPath);
      console.log('✅ Conectado ao banco de dados:', dbPath);
    } catch (error) {
      console.log('❌ Erro ao conectar ao banco:', error.message);
      console.log('📝 Criando banco de dados temporário para análise...');
      this.db = new Database(':memory:');
      this.createSampleTables();
    }
  }

  createSampleTables() {
    // Criar tabelas básicas para análise
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        statusConta TEXT DEFAULT 'ativo'
      );
      
      CREATE TABLE IF NOT EXISTS veiculos (
        id TEXT PRIMARY KEY,
        idUsuario TEXT NOT NULL,
        marca TEXT NOT NULL,
        modelo TEXT NOT NULL,
        placa TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS jornadas (
        id TEXT PRIMARY KEY,
        idUsuario TEXT NOT NULL,
        idVeiculo TEXT NOT NULL,
        dataInicio INTEGER NOT NULL,
        dataFim INTEGER,
        ganhoBruto INTEGER,
        kmTotal INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS abastecimentos (
        id TEXT PRIMARY KEY,
        idUsuario TEXT NOT NULL,
        idVeiculo TEXT NOT NULL,
        dataAbastecimento INTEGER NOT NULL,
        valorTotal INTEGER NOT NULL
      );
    `);
    
    console.log('✅ Tabelas de exemplo criadas');
  }

  analyzeQuery(query, params = []) {
    const startTime = Date.now();
    
    try {
      // Executar query
      const stmt = this.db.prepare(query);
      const result = stmt.all(...params);
      const executionTime = Date.now() - startTime;
      
      // Obter plano de execução
      let explanation = [];
      try {
        const explainStmt = this.db.prepare(`EXPLAIN QUERY PLAN ${query}`);
        explanation = explainStmt.all(...params);
      } catch (e) {
        explanation = [{ detail: 'Não foi possível obter plano de execução' }];
      }
      
      return {
        query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
        executionTime,
        rowsAffected: Array.isArray(result) ? result.length : 1,
        explanation,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        query: query.substring(0, 100) + '...',
        executionTime: Date.now() - startTime,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  analyzeCommonQueries() {
    console.log('🔍 Analisando queries comuns do sistema...');
    
    const queries = [
      {
        name: 'Listar usuários ativos',
        query: "SELECT * FROM usuarios WHERE statusConta = 'ativo' LIMIT 10"
      },
      {
        name: 'Buscar jornadas por usuário',
        query: "SELECT * FROM jornadas WHERE idUsuario = 'test-user' ORDER BY dataInicio DESC LIMIT 20"
      },
      {
        name: 'Relatório de jornadas com JOIN',
        query: `SELECT j.*, v.marca, v.modelo 
                FROM jornadas j 
                JOIN veiculos v ON j.idVeiculo = v.id 
                WHERE j.idUsuario = 'test-user'`
      },
      {
        name: 'Agregação de ganhos mensais',
        query: `SELECT 
                  COUNT(*) as totalJornadas,
                  SUM(ganhoBruto) as totalGanho,
                  AVG(ganhoBruto) as ganhoMedio
                FROM jornadas 
                WHERE idUsuario = 'test-user' 
                AND dataInicio >= strftime('%s', 'now', '-30 days')`
      },
      {
        name: 'Dashboard com múltiplas subconsultas',
        query: `SELECT 
                  (SELECT COUNT(*) FROM jornadas WHERE idUsuario = 'test-user') as totalJornadas,
                  (SELECT COUNT(*) FROM veiculos WHERE idUsuario = 'test-user') as totalVeiculos,
                  (SELECT SUM(valorTotal) FROM abastecimentos WHERE idUsuario = 'test-user') as totalGastos`
      }
    ];

    const results = [];
    
    queries.forEach(queryInfo => {
      console.log(`  📊 Analisando: ${queryInfo.name}`);
      const analysis = this.analyzeQuery(queryInfo.query);
      results.push({
        name: queryInfo.name,
        ...analysis
      });
      
      if (analysis.executionTime > 50) {
        console.log(`    ⚠️  Query lenta detectada: ${analysis.executionTime}ms`);
      } else {
        console.log(`    ✅ Query rápida: ${analysis.executionTime}ms`);
      }
    });

    return results;
  }

  analyzeIndexes() {
    console.log('🔍 Analisando índices existentes...');
    
    try {
      const indexes = this.db.prepare(`
        SELECT name, sql, tbl_name 
        FROM sqlite_master 
        WHERE type = 'index' 
        AND sql IS NOT NULL
        ORDER BY tbl_name, name
      `).all();

      console.log(`📋 Encontrados ${indexes.length} índices:`);
      
      indexes.forEach(index => {
        console.log(`  - ${index.name} (${index.tbl_name})`);
      });

      return {
        total: indexes.length,
        indexes: indexes.map(idx => ({
          name: idx.name,
          table: idx.tbl_name,
          sql: idx.sql
        }))
      };
    } catch (error) {
      console.log('❌ Erro ao analisar índices:', error.message);
      return { total: 0, indexes: [], error: error.message };
    }
  }

  generateRecommendations(queryResults, indexAnalysis) {
    const recommendations = [];
    const slowQueries = queryResults.filter(q => q.executionTime > 50);
    
    console.log('💡 Gerando recomendações...');
    
    if (slowQueries.length > 0) {
      recommendations.push(`Encontradas ${slowQueries.length} queries lentas (>50ms)`);
      
      slowQueries.forEach(query => {
        if (query.query.includes('ORDER BY') && !query.query.includes('LIMIT')) {
          recommendations.push('Adicionar LIMIT em queries com ORDER BY');
        }
        
        if (query.query.includes('JOIN')) {
          recommendations.push('Verificar índices em colunas de JOIN');
        }
        
        if (query.query.includes('WHERE') && query.executionTime > 100) {
          recommendations.push('Criar índices em colunas frequentemente filtradas');
        }
      });
    }

    // Recomendações de índices baseadas nas tabelas
    const tables = ['usuarios', 'jornadas', 'veiculos', 'abastecimentos'];
    const existingIndexes = indexAnalysis.indexes.map(idx => idx.name.toLowerCase());
    
    tables.forEach(table => {
      if (!existingIndexes.some(idx => idx.includes(table) && idx.includes('usuario'))) {
        recommendations.push(`Criar índice em ${table}(idUsuario) para melhor performance`);
      }
    });

    if (!existingIndexes.some(idx => idx.includes('data'))) {
      recommendations.push('Criar índices em colunas de data para consultas temporais');
    }

    return recommendations;
  }

  runCompleteAnalysis() {
    console.log('🚀 Iniciando análise completa de performance do banco de dados...');
    console.log('=' .repeat(60));
    
    const queryResults = this.analyzeCommonQueries();
    console.log('');
    
    const indexAnalysis = this.analyzeIndexes();
    console.log('');
    
    const recommendations = this.generateRecommendations(queryResults, indexAnalysis);
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalQueries: queryResults.length,
        slowQueries: queryResults.filter(q => q.executionTime > 50).length,
        averageExecutionTime: queryResults.reduce((sum, q) => sum + q.executionTime, 0) / queryResults.length,
        totalIndexes: indexAnalysis.total
      },
      queryAnalysis: queryResults,
      indexAnalysis,
      recommendations
    };

    // Salvar relatório
    const reportDir = path.join(__dirname, '../../reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportPath = path.join(reportDir, 'slow_query_analysis.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 RESUMO DA ANÁLISE');
    console.log('=' .repeat(60));
    console.log(`Total de queries analisadas: ${report.summary.totalQueries}`);
    console.log(`Queries lentas (>50ms): ${report.summary.slowQueries}`);
    console.log(`Tempo médio de execução: ${report.summary.averageExecutionTime.toFixed(2)}ms`);
    console.log(`Total de índices: ${report.summary.totalIndexes}`);
    console.log('');
    
    console.log('💡 RECOMENDAÇÕES');
    console.log('=' .repeat(60));
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    console.log('');
    
    console.log(`📄 Relatório completo salvo em: ${reportPath}`);
    
    return report;
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

// Executar análise
const analyzer = new SimpleQueryAnalyzer();

try {
  const report = analyzer.runCompleteAnalysis();
  console.log('✅ Análise concluída com sucesso!');
} catch (error) {
  console.error('❌ Erro durante a análise:', error);
} finally {
  analyzer.close();
}

