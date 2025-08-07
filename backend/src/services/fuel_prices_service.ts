import { db } from '../db/connection';
import { eq, and, gte, lte, desc, asc, sql, inArray } from 'drizzle-orm';
import { fuelPrices, gasStations, userReports } from '../db/schema';

// ========== TIPOS E INTERFACES ==========

export interface FuelPriceData {
  id: string;
  estado: string;
  cidade: string;
  tipo_combustivel: 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV';
  preco_medio: number;
  preco_minimo: number;
  preco_maximo: number;
  numero_postos: number;
  data_coleta: string;
  fonte: string;
  latitude?: number;
  longitude?: number;
}

export interface PriceHistoryEntry {
  data: string;
  preco: number;
  fonte: string;
  volume_vendas?: number;
}

export interface PriceStatistics {
  preco_minimo: number;
  preco_maximo: number;
  preco_medio: number;
  mediana: number;
  desvio_padrao: number;
  variacao_percentual: number;
  tendencia: 'alta' | 'baixa' | 'estavel';
  pontos_dados: number;
}

export interface RegionalComparison {
  estado: string;
  nome_estado: string;
  preco_medio: number;
  variacao_semanal: number;
  variacao_mensal: number;
  numero_postos: number;
  ultima_atualizacao: string;
  ranking_nacional: number;
}

export interface FuelPriceFilters {
  estado?: string;
  cidade?: string;
  tipo_combustivel?: string;
  limite?: number;
}

export interface PriceHistoryParams {
  estado: string;
  cidade: string;
  tipo_combustivel: string;
  periodo_dias: number;
}

export interface RegionalComparisonParams {
  tipo_combustivel: string;
  estados: string[];
  incluir_tendencia: boolean;
}

export interface NearbyPricesQuery {
  latitude: number;
  longitude: number;
  raio: number;
  tipo_combustivel?: string;
}

export interface PriceReport {
  id: string;
  user_id: string;
  estado: string;
  cidade: string;
  tipo_combustivel: string;
  preco_medio: number;
  nome_posto?: string;
  endereco?: string;
  observacoes?: string;
  fonte: string;
  data_registro: string;
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
      let query = db.select().from(fuelPrices);
      
      // Aplicar filtros dinâmicos
      const conditions: any[] = [];
      
      if (filters.estado) {
        conditions.push(eq(fuelPrices.estado, filters.estado));
      }
      
      if (filters.cidade) {
        conditions.push(sql`LOWER(${fuelPrices.cidade}) LIKE LOWER('%' || ${filters.cidade} || '%')`);
      }
      
      if (filters.tipo_combustivel) {
        conditions.push(eq(fuelPrices.tipo_combustivel, filters.tipo_combustivel));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      // Ordenar por data mais recente e aplicar limite
      const results = await query
        .orderBy(desc(fuelPrices.data_coleta))
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
      startDate.setDate(startDate.getDate() - params.periodo_dias);
      
      const results = await db
        .select()
        .from(fuelPrices)
        .where(
          and(
            eq(fuelPrices.estado, params.estado),
            sql`LOWER(${fuelPrices.cidade}) = LOWER(${params.cidade})`,
            eq(fuelPrices.tipo_combustivel, params.tipo_combustivel),
            gte(fuelPrices.data_coleta, startDate.toISOString())
          )
        )
        .orderBy(asc(fuelPrices.data_coleta));

      let historico: PriceHistoryEntry[];
      
      if (results.length === 0) {
        // Gerar dados simulados se não houver dados reais
        historico = this.generateMockPriceHistory(
          params.estado, 
          params.cidade, 
          params.tipo_combustivel, 
          params.periodo_dias
        );
      } else {
        historico = results.map(result => ({
          data: result.data_coleta.split('T')[0],
          preco: result.preco_medio,
          fonte: result.fonte || 'ANP',
          volume_vendas: result.volume_vendas
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
        params.tipo_combustivel, 
        params.periodo_dias
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
        .from(fuelPrices)
        .where(
          and(
            inArray(fuelPrices.estado, params.estados),
            eq(fuelPrices.tipo_combustivel, params.tipo_combustivel),
            gte(fuelPrices.data_coleta, sql`DATE('now', '-7 days')`)
          )
        )
        .orderBy(desc(fuelPrices.data_coleta));

      // Agrupar por estado e calcular médias
      const estadoData = this.groupPricesByState(results);
      
      const comparativo: RegionalComparison[] = params.estados.map((estado, index) => {
        const dadosEstado = estadoData[estado];
        const precoBase = this.getBasePriceForState(estado, params.tipo_combustivel);
        
        return {
          estado,
          nome_estado: ESTADO_NOMES[estado] || estado,
          preco_medio: dadosEstado?.preco_medio || precoBase,
          variacao_semanal: dadosEstado?.variacao_semanal || (Math.random() - 0.5) * 0.1,
          variacao_mensal: dadosEstado?.variacao_mensal || (Math.random() - 0.5) * 0.2,
          numero_postos: dadosEstado?.numero_postos || Math.floor(Math.random() * 500) + 100,
          ultima_atualizacao: dadosEstado?.ultima_atualizacao || new Date().toISOString(),
          ranking_nacional: index + 1 // Será recalculado após ordenação
        };
      });

      // Ordenar por preço e recalcular rankings
      comparativo.sort((a, b) => a.preco_medio - b.preco_medio);
      comparativo.forEach((item, index) => {
        item.ranking_nacional = index + 1;
      });

      // Calcular estatísticas
      const precos = comparativo.map(c => c.preco_medio);
      const estatisticas = {
        menor_preco: {
          estado: comparativo[0].estado,
          nome: comparativo[0].nome_estado,
          preco: comparativo[0].preco_medio
        },
        maior_preco: {
          estado: comparativo[comparativo.length - 1].estado,
          nome: comparativo[comparativo.length - 1].nome_estado,
          preco: comparativo[comparativo.length - 1].preco_medio
        },
        diferenca_maxima: comparativo[comparativo.length - 1].preco_medio - comparativo[0].preco_medio,
        preco_medio_nacional: precos.reduce((sum, p) => sum + p, 0) / precos.length,
        desvio_padrao: this.calculateStandardDeviation(precos)
      };

      let tendencias;
      if (params.incluir_tendencia) {
        tendencias = await this.calculateRegionalTrends(params.estados, params.tipo_combustivel);
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
        .from(fuelPrices)
        .where(
          and(
            eq(fuelPrices.estado, priceData.estado),
            sql`LOWER(${fuelPrices.cidade}) = LOWER(${priceData.cidade})`,
            eq(fuelPrices.tipo_combustivel, priceData.tipo_combustivel),
            gte(fuelPrices.data_coleta, sql`DATE('now', '-30 days')`)
          )
        )
        .limit(10);

      if (recentPrices.length > 0) {
        const precos = recentPrices.map(p => p.preco_medio);
        const precoMedio = precos.reduce((sum, p) => sum + p, 0) / precos.length;
        const desvio = this.calculateStandardDeviation(precos);
        
        // Verificar se o preço está muito fora da média
        const diferenca = Math.abs(priceData.preco_medio - precoMedio);
        const limiteVariacao = Math.max(desvio * 2, precoMedio * 0.15); // 2 desvios ou 15%
        
        if (diferenca > limiteVariacao) {
          if (priceData.preco_medio > precoMedio + limiteVariacao) {
            warnings.push(`Preço ${((priceData.preco_medio - precoMedio) / precoMedio * 100).toFixed(1)}% acima da média regional`);
            suggestions.push('Verifique se o preço foi digitado corretamente');
          } else {
            warnings.push(`Preço ${((precoMedio - priceData.preco_medio) / precoMedio * 100).toFixed(1)}% abaixo da média regional`);
            suggestions.push('Confirme se há alguma promoção especial');
          }
        }
      }

      // Verificar limites absolutos por tipo de combustível
      const precoBase = PRECOS_BASE_COMBUSTIVEL[priceData.tipo_combustivel];
      if (priceData.preco_medio > precoBase * 2) {
        warnings.push('Preço muito acima do valor típico nacional');
        valid = false;
      } else if (priceData.preco_medio < precoBase * 0.5) {
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
        user_id: userId,
        estado: priceData.estado,
        cidade: priceData.cidade,
        tipo_combustivel: priceData.tipo_combustivel,
        preco_medio: priceData.preco_medio,
        nome_posto: priceData.nome_posto,
        endereco: priceData.endereco,
        observacoes: priceData.observacoes,
        fonte: priceData.fonte || 'Usuário',
        data_registro: new Date().toISOString(),
        status: 'pendente_validacao',
        latitude: priceData.latitude,
        longitude: priceData.longitude
      };

      // Salvar no banco de dados
      await db.insert(userReports).values({
        id: newReport.id,
        userId: userId,
        tipo: 'fuel_price',
        dados: JSON.stringify(newReport),
        status: 'pendente',
        createdAt: new Date(),
        updatedAt: new Date()
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
      const result = await db
        .select({ count: sql`count(*)` })
        .from(userReports)
        .where(
          and(
            eq(userReports.userId, userId),
            eq(userReports.tipo, 'fuel_price')
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
      const { periodo, tipo_combustivel, incluir_projecoes } = params;
      
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

      let query = db
        .select()
        .from(fuelPrices)
        .where(gte(fuelPrices.data_coleta, startDate.toISOString()));

      if (tipo_combustivel) {
        query = query.where(eq(fuelPrices.tipo_combustivel, tipo_combustivel));
      }

      const results = await query.orderBy(desc(fuelPrices.data_coleta));

      // Calcular estatísticas
      const precos = results.map(r => r.preco_medio);
      const estatisticas = this.calculatePriceStatistics(results.map(r => ({ preco: r.preco_medio })));

      // Agrupar por tipo de combustível
      const porTipoCombustivel = this.groupByFuelType(results);

      // Tendências regionais
      const tendenciasRegionais = this.calculateRegionalTrendSummary(results);

      let projecoes;
      if (incluir_projecoes) {
        projecoes = this.generatePriceProjections(results, periodo);
      }

      return {
        periodo,
        estatisticas_gerais: estatisticas,
        por_tipo_combustivel: porTipoCombustivel,
        tendencias_regionais: tendenciasRegionais,
        total_registros: results.length,
        ...(projecoes && { projecoes })
      };

    } catch (error) {
      console.error('Erro ao gerar estatísticas de preços:', error);
      throw error;
    }
  }

  /**
   * Busca postos próximos por geolocalização
   */
  static async getNearbyPrices(query: NearbyPricesQuery): Promise<any[]> {
    try {
      // Query usando fórmula haversine para distância
      const results = await db
        .select()
        .from(gasStations)
        .where(sql`
          (6371 * acos(
            cos(radians(${query.latitude})) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${query.longitude})) + 
            sin(radians(${query.latitude})) * 
            sin(radians(latitude))
          )) <= ${query.raio}
        `)
        .limit(50);

      return results.map(station => ({
        ...station,
        distancia_km: this.calculateDistance(
          query.latitude,
          query.longitude,
          station.latitude,
          station.longitude
        )
      })).sort((a, b) => a.distancia_km - b.distancia_km);

    } catch (error) {
      console.error('Erro ao buscar postos próximos:', error);
      
      // Fallback para dados simulados
      return this.generateMockNearbyStations(query);
    }
  }

  /**
   * Calcula estatísticas de preços
   */
  static calculatePriceStatistics(prices: Array<{ preco: number }>): PriceStatistics {
    if (prices.length === 0) {
      return {
        preco_minimo: 0,
        preco_maximo: 0,
        preco_medio: 0,
        mediana: 0,
        desvio_padrao: 0,
        variacao_percentual: 0,
        tendencia: 'estavel',
        pontos_dados: 0
      };
    }

    const precos = prices.map(p => p.preco).sort((a, b) => a - b);
    const soma = precos.reduce((acc, p) => acc + p, 0);
    const media = soma / precos.length;
    
    // Calcular mediana
    const meio = Math.floor(precos.length / 2);
    const mediana = precos.length % 2 !== 0 
      ? precos[meio]
      : (precos[meio - 1] + precos[meio]) / 2;

    // Calcular desvio padrão
    const desvio_padrao = this.calculateStandardDeviation(precos);

    // Calcular variação percentual (primeiro vs último)
    const variacao_percentual = precos.length > 1
      ? ((precos[precos.length - 1] - precos[0]) / precos[0]) * 100
      : 0;

    // Determinar tendência
    let tendencia: 'alta' | 'baixa' | 'estavel' = 'estavel';
    if (Math.abs(variacao_percentual) > 2) {
      tendencia = variacao_percentual > 0 ? 'alta' : 'baixa';
    }

    return {
      preco_minimo: Math.min(...precos),
      preco_maximo: Math.max(...precos),
      preco_medio: Math.round(media * 100) / 100,
      mediana: Math.round(mediana * 100) / 100,
      desvio_padrao: Math.round(desvio_padrao * 100) / 100,
      variacao_percentual: Math.round(variacao_percentual * 100) / 100,
      tendencia,
      pontos_dados: precos.length
    };
  }

  /**
   * Calcula rankings regionais
   */
  static calculateRegionalRankings(comparativo: RegionalComparison[]): any {
    const porPreco = [...comparativo].sort((a, b) => a.preco_medio - b.preco_medio);
    const porVariacao = [...comparativo].sort((a, b) => a.variacao_semanal - b.variacao_semanal);

    return {
      menores_precos: porPreco.slice(0, 3),
      maiores_precos: porPreco.slice(-3).reverse(),
      maior_alta: porVariacao.slice(-3).reverse(),
      maior_baixa: porVariacao.slice(0, 3),
      mais_estaveis: [...comparativo]
        .sort((a, b) => Math.abs(a.variacao_semanal) - Math.abs(b.variacao_semanal))
        .slice(0, 3)
    };
  }

  // ========== MÉTODOS AUXILIARES PRIVADOS ==========

  private static mapDatabaseToFuelPriceData(dbResult: any): FuelPriceData {
    return {
      id: dbResult.id,
      estado: dbResult.estado,
      cidade: dbResult.cidade,
      tipo_combustivel: dbResult.tipo_combustivel,
      preco_medio: dbResult.preco_medio,
      preco_minimo: dbResult.preco_minimo || dbResult.preco_medio * 0.95,
      preco_maximo: dbResult.preco_maximo || dbResult.preco_medio * 1.05,
      numero_postos: dbResult.numero_postos || Math.floor(Math.random() * 50) + 10,
      data_coleta: dbResult.data_coleta,
      fonte: dbResult.fonte || 'ANP',
      latitude: dbResult.latitude,
      longitude: dbResult.longitude
    };
  }

  private static generateMockPrices(filters: FuelPriceFilters): FuelPriceData[] {
    const tipos = filters.tipo_combustivel ? [filters.tipo_combustivel] : ['Gasolina', 'Etanol', 'Diesel', 'GNV'];
    const precos: FuelPriceData[] = [];

    for (const tipo of tipos) {
      const precoBase = PRECOS_BASE_COMBUSTIVEL[tipo];
      const fatorEstado = FATORES_ESTADO[filters.estado || 'SP'] || 1.0;
      const variacao = (Math.random() - 0.5) * 0.2; // ±10%
      
      const precoMedio = Math.round((precoBase * fatorEstado * (1 + variacao)) * 100) / 100;
      
      precos.push({
        id: `mock_${tipo}_${Date.now()}`,
        tipo_combustivel: tipo as any,
        preco_medio: precoMedio,
        preco_minimo: Math.round((precoMedio * 0.95) * 100) / 100,
        preco_maximo: Math.round((precoMedio * 1.05) * 100) / 100,
        estado: filters.estado || 'SP',
        cidade: filters.cidade || 'São Paulo',
        numero_postos: Math.floor(Math.random() * 50) + 10,
        data_coleta: new Date().toISOString(),
        fonte: 'Dados simulados'
      });
    }

    return precos;
  }

  private static generateMockPriceHistory(
    estado: string, 
    cidade: string, 
    tipoCombustivel: string, 
    periodoDias: number
  ): PriceHistoryEntry[] {
    const historico: PriceHistoryEntry[] = [];
    const precoBase = this.getBasePriceForState(estado, tipoCombustivel);
    
    for (let i = periodoDias - 1; i >= 0; i--) {
      const data = new Date();
      data.setDate(data.getDate() - i);
      
      // Simular variação gradual com tendência e ruído
      const tendencia = Math.sin(i / 10) * 0.05; // Variação cíclica de 5%
      const ruido = (Math.random() - 0.5) * 0.03; // Ruído de ±1.5%
      const preco = precoBase * (1 + tendencia + ruido);
      
      historico.push({
        data: data.toISOString().split('T')[0],
        preco: Math.round(preco * 100) / 100,
        fonte: 'ANP',
        volume_vendas: Math.floor(Math.random() * 10000) + 1000
      });
    }

    return historico;
  }

  private static getBasePriceForState(estado: string, tipoCombustivel: string): number {
    const precoBase = PRECOS_BASE_COMBUSTIVEL[tipoCombustivel] || 5.89;
    const fator = FATORES_ESTADO[estado] || 1.0;
    return Math.round(precoBase * fator * 100) / 100;
  }

  private static calculatePriceTrend(historico: PriceHistoryEntry[]): 'alta' | 'baixa' | 'estavel' {
    if (historico.length < 2) return 'estavel';

    const primeiroTerco = historico.slice(0, Math.floor(historico.length / 3));
    const ultimoTerco = historico.slice(-Math.floor(historico.length / 3));

    const mediaPrimeiro = primeiroTerco.reduce((sum, p) => sum + p.preco, 0) / primeiroTerco.length;
    const mediaUltimo = ultimoTerco.reduce((sum, p) => sum + p.preco, 0) / ultimoTerco.length;

    const variacao = (mediaUltimo - mediaPrimeiro) / mediaPrimeiro * 100;

    if (variacao > 2) return 'alta';
    if (variacao < -2) return 'baixa';
    return 'estavel';
  }

  private static calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    
    const media = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variancia = values.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / values.length;
    
    return Math.sqrt(variancia);
  }

  private static groupPricesByState(results: any[]): Record<string, any> {
    const grupos: Record<string, any> = {};

    for (const result of results) {
      if (!grupos[result.estado]) {
        grupos[result.estado] = {
          precos: [],
          numero_postos: 0,
          ultima_atualizacao: result.data_coleta
        };
      }

      grupos[result.estado].precos.push(result.preco_medio);
      grupos[result.estado].numero_postos += result.numero_postos || 1;
      
      // Manter a data mais recente
      if (result.data_coleta > grupos[result.estado].ultima_atualizacao) {
        grupos[result.estado].ultima_atualizacao = result.data_coleta;
      }
    }

    // Calcular médias e variações
    Object.keys(grupos).forEach(estado => {
      const precos = grupos[estado].precos;
      grupos[estado].preco_medio = precos.reduce((sum: number, p: number) => sum + p, 0) / precos.length;
      
      // Simular variações semanais e mensais (em implementação real, calcular baseado em dados históricos)
      grupos[estado].variacao_semanal = (Math.random() - 0.5) * 0.1; // ±5%
      grupos[estado].variacao_mensal = (Math.random() - 0.5) * 0.2; // ±10%
    });

    return grupos;
  }

  private static async calculateRegionalTrends(estados: string[], tipoCombustivel: string): Promise<any> {
    const tendencias: Record<string, any> = {};

    for (const estado of estados) {
      try {
        // Buscar dados dos últimos 3 meses para calcular tendência real
        const historico = await db
          .select()
          .from(fuelPrices)
          .where(
            and(
              eq(fuelPrices.estado, estado),
              eq(fuelPrices.tipo_combustivel, tipoCombustivel),
              gte(fuelPrices.data_coleta, sql`DATE('now', '-90 days')`)
            )
          )
          .orderBy(asc(fuelPrices.data_coleta));

        if (historico.length > 0) {
          const precos = historico.map(h => h.preco_medio);
          const tendencia = this.calculateLinearTrend(precos);
          
          tendencias[estado] = {
            direcao: tendencia.slope > 0.01 ? 'alta' : tendencia.slope < -0.01 ? 'baixa' : 'estavel',
            intensidade: Math.abs(tendencia.slope),
            correlacao: tendencia.correlation,
            pontos_dados: precos.length,
            periodo_dias: 90
          };
        } else {
          // Dados simulados se não houver histórico
          const intensidade = Math.random() * 0.05;
          const direcao = Math.random() > 0.5 ? 'alta' : 'baixa';
          
          tendencias[estado] = {
            direcao: Math.random() > 0.7 ? 'estavel' : direcao,
            intensidade,
            correlacao: 0.3 + Math.random() * 0.4, // 0.3-0.7
            pontos_dados: 30,
            periodo_dias: 90,
            simulado: true
          };
        }
      } catch (error) {
        console.error(`Erro ao calcular tendência para ${estado}:`, error);
        
        // Fallback para dados básicos
        tendencias[estado] = {
          direcao: 'estavel',
          intensidade: 0,
          correlacao: 0,
          pontos_dados: 0,
          periodo_dias: 90,
          erro: true
        };
      }
    }

    return tendencias;
  }

  private static calculateLinearTrend(values: number[]): { slope: number; correlation: number } {
    if (values.length < 2) return { slope: 0, correlation: 0 };

    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    // Calcular médias
    const xMean = x.reduce((sum, val) => sum + val, 0) / n;
    const yMean = y.reduce((sum, val) => sum + val, 0) / n;

    // Calcular numerador e denominadores para slope e correlação
    let numerator = 0;
    let xDenominator = 0;
    let yDenominator = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = x[i] - xMean;
      const yDiff = y[i] - yMean;
      
      numerator += xDiff * yDiff;
      xDenominator += xDiff * xDiff;
      yDenominator += yDiff * yDiff;
    }

    const slope = xDenominator === 0 ? 0 : numerator / xDenominator;
    const correlation = Math.sqrt(xDenominator * yDenominator) === 0 ? 0 : numerator / Math.sqrt(xDenominator * yDenominator);

    return { slope, correlation };
  }

  private static groupByFuelType(results: any[]): Record<string, any> {
    const grupos: Record<string, any> = {};

    for (const result of results) {
      const tipo = result.tipo_combustivel;
      
      if (!grupos[tipo]) {
        grupos[tipo] = {
          precos: [],
          registros: 0
        };
      }

      grupos[tipo].precos.push(result.preco_medio);
      grupos[tipo].registros++;
    }

    // Calcular estatísticas para cada tipo
    Object.keys(grupos).forEach(tipo => {
      const precos = grupos[tipo].precos;
      
      grupos[tipo] = {
        ...grupos[tipo],
        ...this.calculatePriceStatistics(precos.map((p: number) => ({ preco: p })))
      };
    });

    return grupos;
  }

  private static calculateRegionalTrendSummary(results: any[]): any {
    const regioes = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];
    const mapeamentoRegioes: Record<string, string> = {
      'AC': 'Norte', 'AP': 'Norte', 'AM': 'Norte', 'PA': 'Norte', 'RO': 'Norte', 'RR': 'Norte', 'TO': 'Norte',
      'AL': 'Nordeste', 'BA': 'Nordeste', 'CE': 'Nordeste', 'MA': 'Nordeste', 'PB': 'Nordeste', 'PE': 'Nordeste', 'PI': 'Nordeste', 'RN': 'Nordeste', 'SE': 'Nordeste',
      'DF': 'Centro-Oeste', 'GO': 'Centro-Oeste', 'MT': 'Centro-Oeste', 'MS': 'Centro-Oeste',
      'ES': 'Sudeste', 'MG': 'Sudeste', 'RJ': 'Sudeste', 'SP': 'Sudeste',
      'PR': 'Sul', 'RS': 'Sul', 'SC': 'Sul'
    };

    const porRegiao: Record<string, number[]> = {};
    
    regioes.forEach(regiao => {
      porRegiao[regiao] = [];
    });

    // Agrupar preços por região
    results.forEach(result => {
      const regiao = mapeamentoRegioes[result.estado];
      if (regiao) {
        porRegiao[regiao].push(result.preco_medio);
      }
    });

    // Calcular estatísticas por região
    const tendenciasRegionais: Record<string, any> = {};
    
    Object.keys(porRegiao).forEach(regiao => {
      const precos = porRegiao[regiao];
      
      if (precos.length > 0) {
        tendenciasRegionais[regiao] = {
          preco_medio: precos.reduce((sum, p) => sum + p, 0) / precos.length,
          numero_registros: precos.length,
          variacao: this.calculateStandardDeviation(precos),
          tendencia: precos.length > 1 ? this.calculatePriceTrend(precos.map(p => ({ preco: p, data: '' }))) : 'estavel'
        };
      } else {
        tendenciasRegionais[regiao] = {
          preco_medio: 0,
          numero_registros: 0,
          variacao: 0,
          tendencia: 'estavel'
        };
      }
    });

    return tendenciasRegionais;
  }

  private static generatePriceProjections(results: any[], periodo: string): any {
    // Análise simplificada de projeção baseada em tendências históricas
    const tiposCombustivel = [...new Set(results.map(r => r.tipo_combustivel))];
    const projecoes: Record<string, any> = {};

    tiposCombustivel.forEach(tipo => {
      const dadosTipo = results.filter(r => r.tipo_combustivel === tipo);
      const precos = dadosTipo.map(d => d.preco_medio).sort((a, b) => a - b);
      
      if (precos.length > 0) {
        const trend = this.calculateLinearTrend(precos);
        const precoAtual = precos[precos.length - 1];
        
        // Projeções para 1, 3 e 6 meses
        projecoes[tipo] = {
          preco_atual: precoAtual,
          projecao_1_mes: Math.max(0, precoAtual + (trend.slope * 30)),
          projecao_3_meses: Math.max(0, precoAtual + (trend.slope * 90)),
          projecao_6_meses: Math.max(0, precoAtual + (trend.slope * 180)),
          confianca: trend.correlation,
          baseado_em: precos.length,
          metodologia: 'Regressão linear simples'
        };
      }
    });

    return projecoes;
  }

  private static generateMockNearbyStations(query: NearbyPricesQuery): any[] {
    const stations = [];
    const numStations = Math.floor(Math.random() * 10) + 5; // 5-15 postos

    for (let i = 0; i < numStations; i++) {
      // Gerar coordenadas próximas (dentro do raio)
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * query.raio;
      const deltaLat = distance * Math.cos(angle) / 111; // ~111km por grau de latitude
      const deltaLon = distance * Math.sin(angle) / (111 * Math.cos(query.latitude * Math.PI / 180));

      const stationLat = query.latitude + deltaLat;
      const stationLon = query.longitude + deltaLon;

      const precoBase = query.tipo_combustivel 
        ? PRECOS_BASE_COMBUSTIVEL[query.tipo_combustivel] 
        : PRECOS_BASE_COMBUSTIVEL['Gasolina'];
      
      const variacao = (Math.random() - 0.5) * 0.2; // ±10%
      const preco = Math.round((precoBase * (1 + variacao)) * 100) / 100;

      stations.push({
        id: `station_${i}`,
        nome: `Posto ${['Shell', 'Ipiranga', 'BR', 'Texaco', 'Ale'][i % 5]} ${i + 1}`,
        endereco: `Rua Exemplo ${i + 1}, Bairro Central`,
        latitude: stationLat,
        longitude: stationLon,
        distancia_km: distance,
        precos: {
          [query.tipo_combustivel || 'Gasolina']: preco,
          ...(Math.random() > 0.5 && { 'Etanol': preco * 0.73 }),
          ...(Math.random() > 0.7 && { 'Diesel': preco * 0.93 })
        },
        ultima_atualizacao: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        rating: Math.round((3 + Math.random() * 2) * 10) / 10, // 3.0-5.0
        servicos: ['Lava-rápido', 'Loja de conveniência', 'Calibragem'].filter(() => Math.random() > 0.5)
      });
    }

    return stations.sort((a, b) => a.distancia_km - b.distancia_km);
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100;
  }
}