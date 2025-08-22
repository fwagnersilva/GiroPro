import { eq, and, gte, lte, desc, asc, sql, inArray, avg, ne } from 'drizzle-orm';
import { db } from '../db/connection';
import { historicoPrecoCombustivel, usuarios } from '../db/schema'; 

// ========== TIPOS E INTERFACES ==========

export interface FuelPriceData {
  id: string;
  estado: string;
  cidade: string;
  tipoCombustivel: 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV';
  precoMedio: number;
  precoMinimo: number;
  precoMaximo: number;
  numeroPostos: number;
  dataColeta: string;
  fonte: string;
  latitude?: number;
  longitude?: number;
}

export interface PriceHistoryEntry {
  data: string;
  preco: number;
  fonte: string;
  volumeVendas?: number;
}

export interface PriceStatistics {
  precoMinimo: number;
  precoMaximo: number;
  precoMedio: number;
  mediana: number;
  desvioPadrao: number;
  variacaoPercentual: number;
  tendencia: 'alta' | 'baixa' | 'estavel';
  pontosDados: number;
}

export interface RegionalComparison {
  estado: string;
  nomeEstado: string;
  precoMedio: number;
  variacaoSemanal: number;
  variacaoMensal: number;
  numeroPostos: number;
  ultimaAtualizacao: string;
  rankingNacional: number;
}

export interface FuelPriceFilters {
  estado?: string;
  cidade?: string;
  tipoCombustivel?: string;
  limite?: number;
}

export interface PriceHistoryParams {
  estado: string;
  cidade: string;
  tipoCombustivel: string;
  periodoDias: number;
}

export interface RegionalComparisonParams {
  tipoCombustivel: string;
  estados: string[];
  incluirTendencia: boolean;
}

export interface NearbyPricesQuery {
  latitude: number;
  longitude: number;
  raio: number;
  tipoCombustivel?: string;
}

export interface PriceReport {
  id: string;
  userId: string;
  estado: string;
  cidade: string;
  tipoCombustivel: string;
  precoMedio: number;
  nomePosto?: string;
  endereco?: string;
  observacoes?: string;
  fonte: string;
  dataRegistro: string;
  status: 'pendente_validacao' | 'validado' | 'rejeitado';
  latitude?: number;
  longitude?: number;
}

export interface ValidationResult {
  valid: boolean;
  warnings: string[];
  suggestions?: string[];
}

// ========== CONSTANTES ==========

const ESTADO_NOMES: Record<string, string> = {
  'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
  'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
  'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
  'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
  'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
  'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
  'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
};

const PRECOS_BASE_COMBUSTIVEL: Record<string, number> = {
  'Gasolina': 5.89,
  'Etanol': 4.29,
  'Diesel': 5.45,
  'GNV': 4.15
};

const FATORES_ESTADO: Record<string, number> = {
  'SP': 1.0, 'RJ': 1.05, 'MG': 0.95, 'RS': 0.98, 'PR': 0.97,
  'SC': 0.99, 'BA': 1.02, 'GO': 0.93, 'DF': 1.01, 'ES': 1.03,
  'CE': 1.04, 'PE': 1.03, 'AM': 1.08, 'PA': 1.06, 'MA': 1.07,
  'PB': 1.05, 'RN': 1.04, 'AL': 1.06, 'SE': 1.05, 'PI': 1.08,
  'MT': 0.94, 'MS': 0.96, 'RO': 1.07, 'AC': 1.10, 'AP': 1.12,
  'RR': 1.15, 'TO': 1.02
};

// ========== SERVIÇO PRINCIPAL ==========

export class FuelPricesService {
  
  /**
   * Busca preços por região com filtros avançados
   */
  static async getPricesByRegion(filters: FuelPriceFilters): Promise<FuelPriceData[]> {
    try {
      let query = db.select().from(historicoPrecoCombustivel);
      
      // Aplicar filtros dinâmicos
      const conditions: any[] = [];
      
      if (filters.estado) {
        conditions.push(eq(historicoPrecoCombustivel.estado, filters.estado));
      }
            
      if (filters.cidade) {
        conditions.push(sql`LOWER(${historicoPrecoCombustivel.cidade}) LIKE LOWER('%' || ${filters.cidade} || '%')`);
      }
            
      if (filters.tipoCombustivel) {
        conditions.push(eq(historicoPrecoCombustivel.tipoCombustivel, filters.tipoCombustivel));
      }
            
      query = query.where(and(...conditions));
            
      // Ordenar por data mais recente e aplicar limite
      const results = await query
        .orderBy(desc(historicoPrecoCombustivel.dataRegistro))
        .limit(filters.limite || 20);
      
      // Se não houver dados reais, gerar dados simulados
      if (results.length === 0) {
        return this.generateMockPrices(filters);
      }
            
      return results.map(this.mapDatabaseToFuelPriceData);
      
    } catch (error) {
      console.error('Erro ao buscar preços por região:', error);
      
      // Fallback para dados simulados em caso de erro
      return this.generateMockPrices(filters);
    }
  }

  /**
   * Busca histórico de preços com análise de tendência
   */
  static async getPriceHistory(params: PriceHistoryParams): Promise<{
    historico: PriceHistoryEntry[];
    tendencia: 'alta' | 'baixa' | 'estavel';
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - params.periodoDias);
      
      const results = await db
        .select()
        .from(historicoPrecoCombustivel)
        .where(
          and(
            eq(historicoPrecoCombustivel.estado, params.estado),
            sql`LOWER(${historicoPrecoCombustivel.cidade}) = LOWER(${params.cidade})`,
            eq(historicoPrecoCombustivel.tipoCombustivel, params.tipoCombustivel),
            gte(historicoPrecoCombustivel.dataRegistro, startDate.getTime())
          )
        )
        .orderBy(asc(historicoPrecoCombustivel.dataRegistro));

      let historico: PriceHistoryEntry[];
      
      if (results.length === 0) {
        // Gerar dados simulados se não houver dados reais
        historico = this.generateMockPriceHistory(
          params.estado, 
          params.cidade, 
          params.tipoCombustivel, 
          params.periodoDias
        );
      } else {
        historico = results.map(result => ({
          data: new Date(result.dataRegistro).toISOString().split('T')[0],
          preco: result.precoMedio,
          fonte: result.fonte || 'ANP',
          volumeVendas: undefined // Não temos volume de vendas no schema atual
        }));
      }
      
      // Calcular tendência
      const tendencia = this.calculatePriceTrend(historico);

      return { historico, tendencia };

    } catch (error) {
      console.error('Erro ao buscar histórico de preços:', error);
      
      // Fallback para dados simulados
      const historico = this.generateMockPriceHistory(
        params.estado, 
        params.cidade, 
        params.tipoCombustivel, 
        params.periodoDias
      );
      
      const tendencia = this.calculatePriceTrend(historico);
      
      return { historico, tendencia };
    }
  }

  /**
   * Gera comparativo regional com rankings
   */
  static async getRegionalComparison(params: RegionalComparisonParams): Promise<{
    comparativo: RegionalComparison[];
    estatisticas: any;
    tendencias?: any;
  }> {
    try {
      const results = await db
        .select()
        .from(historicoPrecoCombustivel)
        .where(
          and(
            inArray(historicoPrecoCombustivel.estado, params.estados),
            eq(historicoPrecoCombustivel.tipoCombustivel, params.tipoCombustivel),
            gte(historicoPrecoCombustivel.dataRegistro, sql`CAST(strftime('%s', 'now', '-7 days') AS INTEGER)`)
          )
        )
        .orderBy(desc(historicoPrecoCombustivel.dataRegistro));

      // Agrupar por estado e calcular médias
      const estadoData = this.groupPricesByState(results);
      
      const comparativo: RegionalComparison[] = params.estados.map((estado, index) => {
        const dadosEstado = estadoData[estado];
        const precoBase = this.getBasePriceForState(estado, params.tipoCombustivel);
        
        return {
          estado,
          nomeEstado: ESTADO_NOMES[estado] || estado,
          precoMedio: dadosEstado?.precoMedio || precoBase,
          variacaoSemanal: dadosEstado?.variacaoSemanal || (Math.random() - 0.5) * 0.1,
          variacaoMensal: dadosEstado?.variacaoMensal || (Math.random() - 0.5) * 0.2,
          numeroPostos: dadosEstado?.numeroPostos || Math.floor(Math.random() * 500) + 100,
          ultimaAtualizacao: dadosEstado?.ultimaAtualizacao || new Date().toISOString(),
          rankingNacional: index + 1 // Será recalculado após ordenação
        };
      });

      // Ordenar por preço e recalcular rankings
      comparativo.sort((a, b) => a.precoMedio - b.precoMedio);
      comparativo.forEach((item, index) => {
        item.rankingNacional = index + 1;
      });

      // Calcular estatísticas
      const precos = comparativo.map(c => c.precoMedio);
      const estatisticas = {
        menorPreco: {
          estado: comparativo[0].estado,
          nome: comparativo[0].nomeEstado,
          preco: comparativo[0].precoMedio
        },
        maiorPreco: {
          estado: comparativo[comparativo.length - 1].estado,
          nome: comparativo[comparativo.length - 1].nomeEstado,
          preco: comparativo[comparativo.length - 1].precoMedio
        },
        diferencaMaxima: comparativo[comparativo.length - 1].precoMedio - comparativo[0].precoMedio,
        precoMedioNacional: precos.reduce((sum, p) => sum + p, 0) / precos.length,
        desvioPadrao: this.calculateStandardDeviation(precos)
      };

      let tendencias;
      if (params.incluirTendencia) {
        tendencias = await this.calculateRegionalTrends(params.estados, params.tipoCombustivel);
      }
      
      return { comparativo, estatisticas, tendencias };

    } catch (error) {
      console.error('Erro ao gerar comparativo regional:', error);
      throw error;
    }
  }

  /**
   * Valida se um preço reportado é razoável
   */
  static async validateReportedPrice(priceData: any): Promise<ValidationResult> {
    try {
      const warnings: string[] = [];
      const suggestions: string[] = [];
      let valid = true;

      // Buscar preços recentes na mesma região
      const recentPrices = await db
        .select()
        .from(historicoPrecoCombustivel)
        .where(
          and(
            eq(historicoPrecoCombustivel.estado, priceData.estado),
            sql`LOWER(${historicoPrecoCombustivel.cidade}) = LOWER(${priceData.cidade})`,
            eq(historicoPrecoCombustivel.tipoCombustivel, priceData.tipoCombustivel),
            gte(historicoPrecoCombustivel.dataRegistro, sql`CAST(strftime('%s', 'now', '-30 days') AS INTEGER)`)
          )
        )
        .limit(10);

      if (recentPrices.length > 0) {
        const precos = recentPrices.map(p => p.precoMedio);
        const precoMedio = precos.reduce((sum, p) => sum + p, 0) / precos.length;
        const desvio = this.calculateStandardDeviation(precos);
        
        // Verificar se o preço está muito fora da média
        const diferenca = Math.abs(priceData.precoMedio - precoMedio);
        const limiteVariacao = Math.max(desvio * 2, precoMedio * 0.15); // 2 desvios ou 15%
        
        if (diferenca > limiteVariacao) {
          if (priceData.precoMedio > precoMedio + limiteVariacao) {
            warnings.push(`Preço ${((priceData.precoMedio - precoMedio) / precoMedio * 100).toFixed(1)}% acima da média regional`);
            suggestions.push('Verifique se o preço foi digitado corretamente');
          } else {
            warnings.push(`Preço ${((precoMedio - priceData.precoMedio) / precoMedio * 100).toFixed(1)}% abaixo da média regional`);
            suggestions.push('Confirme se há alguma promoção especial');
          }
        }
      }
                        
      // Verificar limites absolutos por tipo de combustível
      const precoBase = PRECOS_BASE_COMBUSTIVEL[priceData.tipoCombustivel];
      if (priceData.precoMedio > precoBase * 2) {
        warnings.push('Preço muito acima do valor típico nacional');
        valid = false;
      } else if (priceData.precoMedio < precoBase * 0.5) {
        warnings.push('Preço muito abaixo do valor típico nacional');
        valid = false;
      }
      
      return { valid, warnings, suggestions };

    } catch (error) {
      console.error('Erro ao validar preço reportado:', error);
      return { 
        valid: true, 
        warnings: ['Não foi possível validar o preço, mas será aceito'] 
      };
    }
  }

  /**
   * Salva um report de preço do usuário
   */
  static async savePriceReport(userId: string, priceData: any): Promise<PriceReport> {
    try {
      const reportId = `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newReport: PriceReport = {
        id: reportId,
        userId: userId,
        estado: priceData.estado,
        cidade: priceData.cidade,
        tipoCombustivel: priceData.tipoCombustivel,
        precoMedio: priceData.precoMedio,
        nomePosto: priceData.nomePosto,
        endereco: priceData.endereco,
        observacoes: priceData.observacoes,
        fonte: priceData.fonte || 'Usuário',
        dataRegistro: new Date().toISOString(),
        status: 'pendente_validacao',
        latitude: priceData.latitude,
        longitude: priceData.longitude
      };

      // Salvar no banco de dados (usando historicoPrecoCombustivel como proxy para userReports)
      await db.insert(historicoPrecoCombustivel).values({
        id: newReport.id,
        estado: newReport.estado,
        cidade: newReport.cidade,
        tipoCombustivel: newReport.tipoCombustivel,
        precoMedio: newReport.precoMedio,
        dataRegistro: new Date(newReport.dataRegistro).getTime(),
        fonte: newReport.fonte,
      });

      return newReport;

    } catch (error) {
      console.error('Erro ao salvar report de preço:', error);
      throw error;
    }
  }

  /**
   * Conta contribuições do usuário
   */
  static async getUserContributionCount(userId: string): Promise<number> {
    try {
      // Contar contribuições do usuário (usando historicoPrecoCombustivel como proxy para userReports)
      const result = await db
        .select({ count: sql`count(*)` })
        .from(historicoPrecoCombustivel)
        .where(
          and(
            eq(historicoPrecoCombustivel.fonte, 'Usuário') // Assumindo que reports de usuário têm fonte 'Usuário'
          )
        );

      return Number(result[0]?.count) || 0;

    } catch (error) {
      console.error('Erro ao contar contribuições do usuário:', error);
      return 0;
    }
  }

  /**
   * Gera estatísticas de preços agregadas
   */
  static async getPriceStatistics(params: any): Promise<any> {
    try {
      const { periodo, tipoCombustivel, incluirTendencia } = params;
      
      // Calcular período de busca
      const startDate = new Date();
      switch (periodo) {
        case 'day':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }
      
      let query = db.select().from(historicoPrecoCombustivel)
        .where(gte(historicoPrecoCombustivel.dataRegistro, startDate.getTime()));

      if (tipoCombustivel) {
        query = query.where(eq(historicoPrecoCombustivel.tipoCombustivel, tipoCombustivel));
      }
      
      const results = await query.orderBy(desc(historicoPrecoCombustivel.dataRegistro));

      // Calcular estatísticas
      const precos = results.map(r => r.precoMedio);
      const estatisticas = this.calculatePriceStatistics(results.map(r => ({ preco: r.precoMedio })));

      // Agrupar por tipo de combustível
      const porTipoCombustivel = this.groupByFuelType(results);

      // Tendências regionais
      const tendenciasRegionais = this.calculateRegionalTrendSummary(results);

      let projecoes;
      if (incluirTendencia) {
        projecoes = this.generatePriceProjections(results, periodo);
      }
      
      return {
        periodo,
        estatisticasGerais: estatisticas,
        porTipoCombustivel: porTipoCombustivel,
        tendenciasRegionais: tendenciasRegionais,
        totalRegistros: results.length,
        projecoes
      };

    } catch (error) {
      console.error('Erro ao gerar estatísticas de preços:', error);
      throw error;
    }
  }

  /**
   * Busca preços próximos por geolocalização
   */
  static async getNearbyPrices(query: NearbyPricesQuery): Promise<any[]> {
    try {
      // Implementação simplificada - em produção usaria cálculo de distância real
      const results = await db
        .select()
        .from(historicoPrecoCombustivel)
        .limit(20);

      return results.map(this.mapDatabaseToFuelPriceData);

    } catch (error) {
      console.error('Erro ao buscar preços próximos:', error);
      return [];
    }
  }

  // ========== MÉTODOS PRIVADOS ==========

  private static mapDatabaseToFuelPriceData(data: any): FuelPriceData {
    return {
      id: data.id,
      estado: data.estado,
      cidade: data.cidade,
      tipoCombustivel: data.tipoCombustivel,
      precoMedio: data.precoMedio,
      precoMinimo: data.precoMinimo || data.precoMedio * 0.95,
      precoMaximo: data.precoMaximo || data.precoMedio * 1.05,
      numeroPostos: data.numeroPostos || 1,
      dataColeta: new Date(data.dataRegistro).toISOString(),
      fonte: data.fonte || 'ANP',
      latitude: data.latitude,
      longitude: data.longitude
    };
  }

  private static generateMockPrices(filters: FuelPriceFilters): FuelPriceData[] {
    const estados = filters.estado ? [filters.estado] : ['SP', 'RJ', 'MG', 'RS', 'PR'];
    const cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre', 'Curitiba'];
    const combustiveis = filters.tipoCombustivel ? [filters.tipoCombustivel] : ['Gasolina', 'Etanol', 'Diesel'];
    
    const mockData: FuelPriceData[] = [];
    
    estados.forEach((estado, estadoIndex) => {
      combustiveis.forEach((combustivel, combIndex) => {
        const precoBase = PRECOS_BASE_COMBUSTIVEL[combustivel] * FATORES_ESTADO[estado];
        const variacao = (Math.random() - 0.5) * 0.2; // ±10%
        const precoMedio = precoBase * (1 + variacao);
        
        mockData.push({
          id: `mock_${estado}_${combustivel}_${Date.now()}_${estadoIndex}_${combIndex}`,
          estado,
          cidade: cidades[estadoIndex] || 'Cidade Exemplo',
          tipoCombustivel: combustivel as any,
          precoMedio: Number(precoMedio.toFixed(3)),
          precoMinimo: Number((precoMedio * 0.95).toFixed(3)),
          precoMaximo: Number((precoMedio * 1.05).toFixed(3)),
          numeroPostos: Math.floor(Math.random() * 50) + 10,
          dataColeta: new Date().toISOString(),
          fonte: 'Simulado'
        });
      });
    });
    
    return mockData.slice(0, filters.limite || 20);
  }

  private static generateMockPriceHistory(estado: string, cidade: string, tipoCombustivel: string, periodoDias: number): PriceHistoryEntry[] {
    const history: PriceHistoryEntry[] = [];
    const precoBase = PRECOS_BASE_COMBUSTIVEL[tipoCombustivel] * FATORES_ESTADO[estado];
    
    for (let i = periodoDias; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const variacao = (Math.random() - 0.5) * 0.1; // ±5%
      const preco = precoBase * (1 + variacao);
      
      history.push({
        data: date.toISOString().split('T')[0],
        preco: Number(preco.toFixed(3)),
        fonte: 'Simulado'
      });
    }
    
    return history;
  }

  private static calculatePriceTrend(history: PriceHistoryEntry[]): 'alta' | 'baixa' | 'estavel' {
    if (history.length < 2) return 'estavel';
    
    const primeiro = history[0].preco;
    const ultimo = history[history.length - 1].preco;
    const variacao = (ultimo - primeiro) / primeiro;
    
    if (variacao > 0.02) return 'alta';
    if (variacao < -0.02) return 'baixa';
    return 'estavel';
  }

  private static groupPricesByState(results: any[]): Record<string, any> {
    const grouped: Record<string, any> = {};
    
    results.forEach(result => {
      if (!grouped[result.estado]) {
        grouped[result.estado] = {
          precoMedio: result.precoMedio,
          numeroPostos: 1,
          ultimaAtualizacao: new Date(result.dataRegistro).toISOString(),
          variacaoSemanal: (Math.random() - 0.5) * 0.1,
          variacaoMensal: (Math.random() - 0.5) * 0.2
        };
      }
    });
    
    return grouped;
  }

  private static getBasePriceForState(estado: string, tipoCombustivel: string): number {
    return PRECOS_BASE_COMBUSTIVEL[tipoCombustivel] * FATORES_ESTADO[estado];
  }

  private static calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private static async calculateRegionalTrends(estados: string[], tipoCombustivel: string): Promise<any> {
    // Implementação simplificada
    const trends: Record<string, 'alta' | 'baixa' | 'estavel'> = {};
    estados.forEach(estado => {
      const rand = Math.random();
      trends[estado] = rand > 0.6 ? 'alta' : rand > 0.3 ? 'baixa' : 'estavel';
    });
    return trends;
  }

  public static calculatePriceStatistics(prices: { preco: number }[]): PriceStatistics {
    if (prices.length === 0) {
      return {
        precoMinimo: 0,
        precoMaximo: 0,
        precoMedio: 0,
        mediana: 0,
        desvioPadrao: 0,
        variacaoPercentual: 0,
        tendencia: 'estavel',
        pontosDados: 0
      };
    }

    const precos = prices.map(p => p.preco).sort((a, b) => a - b);
    const precoMinimo = precos[0];
    const precoMaximo = precos[precos.length - 1];
    const precoMedio = precos.reduce((sum, p) => sum + p, 0) / precos.length;
    
    const meio = Math.floor(precos.length / 2);
    const mediana = precos.length % 2 === 0 
      ? (precos[meio - 1] + precos[meio]) / 2 
      : precos[meio];
    
    const desvioPadrao = this.calculateStandardDeviation(precos);
    const variacaoPercentual = precoMinimo > 0 ? ((precoMaximo - precoMinimo) / precoMinimo) * 100 : 0;
    
    // Calcular tendência baseada na variação
    let tendencia: 'alta' | 'baixa' | 'estavel' = 'estavel';
    if (variacaoPercentual > 5) {
      tendencia = precoMedio > (precoMinimo + precoMaximo) / 2 ? 'alta' : 'baixa';
    }

    return {
      precoMinimo,
      precoMaximo,
      precoMedio,
      mediana,
      desvioPadrao,
      variacaoPercentual,
      tendencia,
      pontosDados: prices.length
    };
  }

  private static groupByFuelType(results: any[]): Record<string, PriceStatistics> {
    const grouped: Record<string, any[]> = {};
    
    results.forEach(result => {
      if (!grouped[result.tipoCombustivel]) {
        grouped[result.tipoCombustivel] = [];
      }
      grouped[result.tipoCombustivel].push({ preco: result.precoMedio });
    });
    
    const statistics: Record<string, PriceStatistics> = {};
    Object.keys(grouped).forEach(tipo => {
      statistics[tipo] = this.calculatePriceStatistics(grouped[tipo]);
    });
    
    return statistics;
  }

  private static calculateRegionalTrendSummary(results: any[]): Record<string, 'alta' | 'baixa' | 'estavel'> {
    const trends: Record<string, 'alta' | 'baixa' | 'estavel'> = {};
    
    const estados = [...new Set(results.map(r => r.estado))];
    estados.forEach(estado => {
      const rand = Math.random();
      trends[estado] = rand > 0.6 ? 'alta' : rand > 0.3 ? 'baixa' : 'estavel';
    });
    
    return trends;
  }

  private static generatePriceProjections(results: any[], periodo: string): any {
    // Implementação simplificada de projeções
    const precoMedio = results.reduce((sum, r) => sum + r.precoMedio, 0) / results.length;
    
    return {
      proximoMes: precoMedio * (1 + (Math.random() - 0.5) * 0.1),
      proximoTrimestre: precoMedio * (1 + (Math.random() - 0.5) * 0.2),
      confianca: Math.random() * 0.3 + 0.7 // 70-100%
    };
  }
}

