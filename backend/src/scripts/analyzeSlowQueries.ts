import { dbConfig } from '../config/database';
import logger from '../utils/logger';



interface QueryAnalysis {
  query: string;
  executionTime: number;
  rowsAffected: number;
  explanation: any;
  timestamp: Date;
}

interface SlowQueryReport {
  totalQueries: number;
  slowQueries: QueryAnalysis[];
  averageExecutionTime: number;
  recommendations: string[];
  indexSuggestions: string[];
}

class SlowQueryAnalyzer {
  private db = dbConfig.getDatabase();
  private slowQueryThreshold = 100; // ms
  private queryLog: QueryAnalysis[] = [];

  /**
   * Executa uma query e monitora sua performance
   */
  async executeAndAnalyze(query: string, params: any[] = []): Promise<QueryAnalysis> {
    const startTime = Date.now();
    
    try {
      // Preparar e executar a query
      const stmt = this.db.prepare(query);
      const result = stmt.all(...params);
      
      const executionTime = Date.now() - startTime;
      
      // Obter plano de execução
      const explanation = this.db.prepare(`EXPLAIN QUERY PLAN ${query}`).all(...params) as ExplainPlanRow[];
      
      const analysis: QueryAnalysis = {
        query,
        executionTime,
        rowsAffected: Array.isArray(result) ? result.length : 1,
        explanation,
        timestamp: new Date()
      };

      // Adicionar ao log se for lenta
      if (executionTime > this.slowQueryThreshold) {
        this.queryLog.push(analysis);
        logger.warn('Slow query detected', {
          query: query.substring(0, 100) + '...',
          executionTime,
          rowsAffected: analysis.rowsAffected
        });
      }

      return analysis;
    } catch (error) {
      logger.error('Query execution failed', { query, error });
      throw error;
    }
  }

  /**
   * Analisa queries comuns do sistema
   */
  async analyzeCommonQueries(): Promise<SlowQueryReport> {
    logger.info('Iniciando análise de queries comuns...');
    
    const commonQueries = [
      // Queries de jornadas
      {
        name: 'Listar jornadas do usuário',
        query: 'SELECT * FROM jornadas WHERE idUsuario = ? ORDER BY dataInicio DESC LIMIT 20',
        params: ['test-user-id']
      },
      {
        name: 'Jornadas em andamento',
        query: 'SELECT * FROM jornadas WHERE idUsuario = ? AND dataFim IS NULL',
        params: ['test-user-id']
      },
      {
        name: 'Relatório mensal de jornadas',
        query: `SELECT 
          COUNT(*) as totalJornadas,
          SUM(ganhoBruto) as totalGanho,
          SUM(kmTotal) as totalKm,
          AVG(tempoTotal) as tempoMedio
        FROM jornadas 
        WHERE idUsuario = ? 
        AND dataInicio >= datetime('now', '-30 days')`,
        params: ['test-user-id']
      },
      
      // Queries de abastecimentos
      {
        name: 'Histórico de abastecimentos',
        query: 'SELECT * FROM abastecimentos WHERE idUsuario = ? ORDER BY dataAbastecimento DESC LIMIT 20',
        params: ['test-user-id']
      },
      {
        name: 'Consumo médio por veículo',
        query: `SELECT 
          v.marca, v.modelo, v.placa,
          AVG(a.quantidadeLitros) as mediaLitros,
          AVG(a.valorTotal) as mediaValor
        FROM abastecimentos a
        JOIN veiculos v ON a.idVeiculo = v.id
        WHERE a.idUsuario = ?
        GROUP BY v.id`,
        params: ['test-user-id']
      },
      
      // Queries de dashboard
      {
        name: 'Dashboard principal',
        query: `SELECT 
          (SELECT COUNT(*) FROM jornadas WHERE idUsuario = ? AND dataInicio >= datetime('now', '-7 days')) as jornadasSemana,
          (SELECT SUM(ganhoBruto) FROM jornadas WHERE idUsuario = ? AND dataInicio >= datetime('now', '-30 days')) as ganhoMes,
          (SELECT SUM(valorTotal) FROM abastecimentos WHERE idUsuario = ? AND dataAbastecimento >= datetime('now', '-30 days')) as gastoMes,
          (SELECT COUNT(*) FROM veiculos WHERE idUsuario = ? AND deletedAt IS NULL) as totalVeiculos`,
        params: ['test-user-id', 'test-user-id', 'test-user-id', 'test-user-id']
      },
      
      // Queries de relatórios
      {
        name: 'Relatório de eficiência',
        query: `SELECT 
          j.id, j.dataInicio, j.dataFim, j.ganhoBruto, j.kmTotal,
          v.marca, v.modelo, v.mediaConsumo,
          (j.ganhoBruto / NULLIF(j.kmTotal, 0)) as ganhoPorKm
        FROM jornadas j
        JOIN veiculos v ON j.idVeiculo = v.id
        WHERE j.idUsuario = ? 
        AND j.dataInicio >= datetime('now', '-90 days')
        ORDER BY ganhoPorKm DESC`,
        params: ['test-user-id']
      }
    ];

    const analyses: QueryAnalysis[] = [];
    
    for (const queryInfo of commonQueries) {
      try {
        logger.info(`Analisando: ${queryInfo.name}`);
        const analysis = await this.executeAndAnalyze(queryInfo.query, queryInfo.params);
        analyses.push(analysis);
      } catch (error) {
        logger.error(`Erro ao analisar query: ${queryInfo.name}`, error);
      }
    }

    return this.generateReport(analyses);
  }

  /**
   * Gera relatório de análise
   */
  private generateReport(analyses: QueryAnalysis[]): SlowQueryReport {
    const slowQueries = analyses.filter(a => a.executionTime > this.slowQueryThreshold);
    const totalExecutionTime = analyses.reduce((sum, a) => sum + a.executionTime, 0);
    const averageExecutionTime = totalExecutionTime / analyses.length;

    const recommendations: string[] = [];
    const indexSuggestions: string[] = [];

    // Analisar padrões e gerar recomendações
    slowQueries.forEach(query => {
      if (query.query.includes('ORDER BY') && !query.query.includes('LIMIT')) {
        recommendations.push('Considere adicionar LIMIT em queries com ORDER BY para melhor performance');
      }
      
      if (query.query.includes('JOIN') && query.executionTime > 200) {
        recommendations.push('Queries com JOIN estão lentas - verifique índices nas colunas de junção');
      }
      
      if (query.query.includes('WHERE idUsuario') && query.executionTime > 50) {
        indexSuggestions.push('CREATE INDEX IF NOT EXISTS idx_performance_usuario ON [tabela](idUsuario)');
      }
      
      if (query.query.includes('dataInicio') && query.executionTime > 100) {
        indexSuggestions.push('CREATE INDEX IF NOT EXISTS idx_performance_data ON jornadas(idUsuario, dataInicio)');
      }
    });

    // Recomendações gerais
    if (averageExecutionTime > 50) {
      recommendations.push('Tempo médio de execução está alto - considere otimizar queries mais frequentes');
    }

    if (slowQueries.length > analyses.length * 0.3) {
      recommendations.push('Muitas queries lentas detectadas - revisar índices e estrutura do banco');
    }

    return {
      totalQueries: analyses.length,
      slowQueries,
      averageExecutionTime,
      recommendations: [...new Set(recommendations)], // Remove duplicatas
      indexSuggestions: [...new Set(indexSuggestions)]
    };
  }

  /**
   * Analisa uso de índices
   */
  async analyzeIndexUsage(): Promise<any> {
    logger.info('Analisando uso de índices...');
    
    // Listar todos os índices
    const indexes = this.db.prepare(`
      SELECT name, sql, tbl_name 
      FROM sqlite_master 
      WHERE type = 'index' 
      AND sql IS NOT NULL
      ORDER BY tbl_name, name
    `).all() as IndexInfo[];

    // Verificar estatísticas de uso (SQLite não tem estatísticas diretas, mas podemos simular)
    const indexAnalysis = indexes.map(index => {
      try {
        // Tentar usar EXPLAIN QUERY PLAN para ver se o índice seria usado
        const sampleQuery = `SELECT * FROM ${index.tbl_name} WHERE rowid = 1`;
        const plan = this.db.prepare(`EXPLAIN QUERY PLAN ${sampleQuery}`).all() as ExplainPlanRow[];
        
        return {
          name: index.name,
          table: index.tbl_name,
          sql: index.sql,
          potentially_used: plan.some(p => p.detail && p.detail.includes('INDEX'))
        };
      } catch (error) {
        return {
          name: index.name,
          table: index.tbl_name,
          sql: index.sql,
          potentially_used: false,
          error: error.message
        };
      }
    });

    return {
      total_indexes: indexes.length,
      indexes: indexAnalysis,
      recommendations: this.generateIndexRecommendations(indexAnalysis)
    };
  }

  /**
   * Gera recomendações de índices
   */
  private generateIndexRecommendations(indexAnalysis: any[]): string[] {
    const recommendations: string[] = [];
    
    // Verificar se existem índices importantes
    const hasUserIndex = indexAnalysis.some(idx => 
      idx.sql && idx.sql.includes('idUsuario')
    );
    
    if (!hasUserIndex) {
      recommendations.push('Criar índices em colunas idUsuario para melhor performance de filtros por usuário');
    }

    const hasDateIndex = indexAnalysis.some(idx => 
      idx.sql && (idx.sql.includes('dataInicio') || idx.sql.includes('dataAbastecimento'))
    );
    
    if (!hasDateIndex) {
      recommendations.push('Criar índices em colunas de data para melhor performance de consultas temporais');
    }

    return recommendations;
  }

  /**
   * Executa análise completa
   */
  async runCompleteAnalysis(): Promise<{
    queryAnalysis: SlowQueryReport;
    indexAnalysis: any;
    databaseStats: any;
  }> {
    logger.info('Executando análise completa de performance do banco de dados...');
    
    const queryAnalysis = await this.analyzeCommonQueries();
    const indexAnalysis = await this.analyzeIndexUsage();
    const databaseStats = dbConfig.getStats();

    // Salvar relatório
    const report = {
      timestamp: new Date().toISOString(),
      queryAnalysis,
      indexAnalysis,
      databaseStats
    };

    // Salvar em arquivo para referência
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(__dirname, '../../reports/slow_query_analysis.json');
    
    // Criar diretório se não existir
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    logger.info(`Relatório de análise salvo em: ${reportPath}`);
    
    return report;
  }
}

export const slowQueryAnalyzer = new SlowQueryAnalyzer();

// Executar análise se chamado diretamente
if (require.main === module) {
  slowQueryAnalyzer.runCompleteAnalysis()
    .then(report => {
      console.log('=== RELATÓRIO DE ANÁLISE DE QUERIES LENTAS ===');
      console.log(`Total de queries analisadas: ${report.queryAnalysis.totalQueries}`);
      console.log(`Queries lentas encontradas: ${report.queryAnalysis.slowQueries.length}`);
      console.log(`Tempo médio de execução: ${report.queryAnalysis.averageExecutionTime.toFixed(2)}ms`);
      console.log('\n=== RECOMENDAÇÕES ===');
      report.queryAnalysis.recommendations.forEach(rec => console.log(`- ${rec}`));
      console.log('\n=== SUGESTÕES DE ÍNDICES ===');
      report.queryAnalysis.indexSuggestions.forEach(idx => console.log(`- ${idx}`));
      process.exit(0);
    })
    .catch(error => {
      console.error('Erro na análise:', error);
      process.exit(1);
    });
}



interface ExplainPlanRow {
  id: number;
  parentid: number;
  detail: string;
}




interface IndexInfo {
  name: string;
  sql: string;
  tbl_name: string;
}


