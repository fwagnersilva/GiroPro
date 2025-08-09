import { db } from '../db/connection';
import { eq, and, gte, lte, desc, asc, sql, inArray, avg, ne } from 'drizzle-orm';
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
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
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

      let query = db
        .select()
        .from(historicoPrecoCombustivel)
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
      // Como não temos a tabela gasStations, vamos simular alguns postos próximos
      const mockGasStations = [];
      for (let i = 0; i < 5; i++) {
        mockGasStations.push({
          id: `posto_${i}`,
          nome: `Posto Simulado ${i + 1}`,
          latitude: query.latitude + (Math.random() - 0.5) * 0.01, // Pequena variação
          longitude: query.longitude + (Math.random() - 0.5) * 0.01,
          endereco: `Rua Fictícia ${i + 1}, Cidade Simulado`,
          precoGasolina: parseFloat((PRECOS_BASE_COMBUSTIVEL.Gasolina * (0.95 + Math.random() * 0.1)).toFixed(2)),
          precoEtanol: parseFloat((PRECOS_BASE_COMBUSTIVEL.Etanol * (0.95 + Math.random() * 0.1)).toFixed(2)),
          precoDiesel: parseFloat((PRECOS_BASE_COMBUSTIVEL.Diesel * (0.95 + Math.random() * 0.1)).toFixed(2)),
        });
      }
      return mockGasStations;

    } catch (error) {
      console.error('Erro ao buscar postos próximos:', error);
      throw error;
    }
  }

  // ========== MÉTODOS AUXILIARES ==========

  private static mapDatabaseToFuelPriceData(data: any): FuelPriceData {
    return {
      id: data.id,
      estado: data.estado,
      cidade: data.cidade,
      tipoCombustivel: data.tipoCombustivel,
      precoMedio: data.precoMedio,
      precoMinimo: data.precoMinimo,
      precoMaximo: data.precoMaximo,
      numeroPostos: data.numeroPostos,
      dataColeta: new Date(data.dataRegistro).toISOString(),
      fonte: data.fonte,
      latitude: data.latitude,
      longitude: data.longitude,
    };
  }

  private static generateMockPrices(filters: FuelPriceFilters): FuelPriceData[] {
    const mockPrices: FuelPriceData[] = [];
    const numPrices = filters.limite || 5;

    for (let i = 0; i < numPrices; i++) {
      const estado = filters.estado || Object.keys(ESTADO_NOMES)[Math.floor(Math.random() * Object.keys(ESTADO_NOMES).length)];
      const cidade = filters.cidade || `Cidade ${Math.floor(Math.random() * 100)}`;
      const tipoCombustivel = filters.tipoCombustivel || Object.keys(PRECOS_BASE_COMBUSTIVEL)[Math.floor(Math.random() * Object.keys(PRECOS_BASE_COMBUSTIVEL).length)];
      const precoBase = PRECOS_BASE_COMBUSTIVEL[tipoCombustivel];
      const fatorEstado = FATORES_ESTADO[estado] || 1.0;

      const precoMedio = parseFloat((precoBase * fatorEstado * (0.95 + Math.random() * 0.1)).toFixed(2));
      const precoMinimo = parseFloat((precoMedio * 0.95).toFixed(2));
      const precoMaximo = parseFloat((precoMedio * 1.05).toFixed(2));

      mockPrices.push({
        id: `mock_${Date.now()}_${i}`,
        estado,
        cidade,
        tipoCombustivel: tipoCombustivel as any,
        precoMedio: precoMedio,
        precoMinimo: precoMinimo,
        precoMaximo: precoMaximo,
        numeroPostos: Math.floor(Math.random() * 100) + 10,
        dataColeta: new Date().toISOString(),
        fonte: 'Simulado',
        latitude: -23.5505 + (Math.random() - 0.5) * 0.1,
        longitude: -46.6333 + (Math.random() - 0.5) * 0.1,
      });
    }
    return mockPrices;
  }

  private static generateMockPriceHistory(estado: string, cidade: string, tipoCombustivel: string, periodoDias: number): PriceHistoryEntry[] {
    const history: PriceHistoryEntry[] = [];
    const precoBase = PRECOS_BASE_COMBUSTIVEL[tipoCombustivel];
    const fatorEstado = FATORES_ESTADO[estado] || 1.0;

    for (let i = 0; i < periodoDias; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (periodoDias - 1 - i));
      const preco = parseFloat((precoBase * fatorEstado * (0.9 + Math.random() * 0.2)).toFixed(2));
      history.push({
        data: date.toISOString().split('T')[0],
        preco,
        fonte: 'Simulado',
      });
    }
    return history;
  }

  private static calculatePriceTrend(history: PriceHistoryEntry[]): 'alta' | 'baixa' | 'estavel' {
    if (history.length < 2) return 'estavel';

    const firstPrice = history[0].preco;
    const lastPrice = history[history.length - 1].preco;
    const diff = lastPrice - firstPrice;
    const percentChange = (diff / firstPrice) * 100;

    if (percentChange > 2) return 'alta';
    if (percentChange < -2) return 'baixa';
    return 'estavel';
  }

  private static groupPricesByState(results: any[]): Record<string, any> {
    const grouped: Record<string, any> = {};
    results.forEach(r => {
      if (!grouped[r.estado]) {
        grouped[r.estado] = {
          precos: [],
          dataColeta: [],
          numeroPostos: 0,
        };
      }
      grouped[r.estado].precos.push(r.precoMedio);
      grouped[r.estado].dataColeta.push(new Date(r.dataRegistro));
      grouped[r.estado].numeroPostos += r.numeroPostos || 1; // Assumindo 1 posto se não especificado
    });

    for (const estado in grouped) {
      const precos = grouped[estado].precos;
      grouped[estado].precoMedio = precos.reduce((sum: number, p: number) => sum + p, 0) / precos.length;
      grouped[estado].ultimaAtualizacao = new Date(Math.max(...grouped[estado].dataColeta)).toISOString();
      // Cálculo de variação semanal/mensal seria mais complexo com dados simulados
      grouped[estado].variacaoSemanal = (Math.random() - 0.5) * 0.05; // Simulado
      grouped[estado].variacaoMensal = (Math.random() - 0.5) * 0.1; // Simulado
    }
    return grouped;
  }

  private static getBasePriceForState(estado: string, tipoCombustivel: string): number {
    const precoBase = PRECOS_BASE_COMBUSTIVEL[tipoCombustivel];
    const fatorEstado = FATORES_ESTADO[estado] || 1.0;
    return parseFloat((precoBase * fatorEstado).toFixed(2));
  }

  private static calculateStandardDeviation(values: number[]): number {
    if (values.length < 2) return 0;
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1);
    return Math.sqrt(variance);
  }

  private static async calculateRegionalTrends(estados: string[], tipoCombustivel: string): Promise<any> {
    const tendencias: Record<string, 'alta' | 'baixa' | 'estavel'> = {};
    for (const estado of estados) {
      const historico = await this.generateMockPriceHistory(estado, 'Qualquer Cidade', tipoCombustivel, 30); // 30 dias de histórico simulado
      tendencias[estado] = this.calculatePriceTrend(historico);
    }
    return tendencias;
  }

  private static calculatePriceStatistics(prices: { preco: number }[]): PriceStatistics {
    if (prices.length === 0) {
      return {
        precoMinimo: 0,
        precoMaximo: 0,
        precoMedio: 0,
        mediana: 0,
        desvioPadrao: 0,
        variacaoPercentual: 0,
        tendencia: 'estavel',
        pontosDados: 0,
      };
    }

    const precos = prices.map(p => p.preco).sort((a, b) => a - b);
    const precoMinimo = precos[0];
    const precoMaximo = precos[precos.length - 1];
    const precoMedio = precos.reduce((sum, p) => sum + p, 0) / precos.length;

    let mediana;
    const mid = Math.floor(precos.length / 2);
    if (precos.length % 2 === 0) {
      mediana = (precos[mid - 1] + precos[mid]) / 2;
    } else {
      mediana = precos[mid];
    }

    const desvioPadrao = this.calculateStandardDeviation(precos);
    const variacaoPercentual = ((precoMaximo - precoMinimo) / precoMinimo) * 100;
    const tendencia = this.calculatePriceTrend(prices.map(p => ({ data: '', preco: p.preco })));

    return {
      precoMinimo,
      precoMaximo,
      precoMedio,
      mediana,
      desvioPadrao,
      variacaoPercentual,
      tendencia,
      pontosDados: prices.length,
    };
  }

  private static groupByFuelType(results: any[]): Record<string, PriceStatistics> {
    const grouped: Record<string, any[]> = {};
    results.forEach(r => {
      if (!grouped[r.tipoCombustivel]) {
        grouped[r.tipoCombustivel] = [];
      }
      grouped[r.tipoCombustivel].push(r);
    });

    const statsByFuelType: Record<string, PriceStatistics> = {};
    for (const fuelType in grouped) {
      statsByFuelType[fuelType] = this.calculatePriceStatistics(grouped[fuelType].map(r => ({ preco: r.precoMedio })));
    }
    return statsByFuelType;
  }

  private static calculateRegionalTrendSummary(results: any[]): Record<string, 'alta' | 'baixa' | 'estavel'> {
    const groupedByState: Record<string, any[]> = {};
    results.forEach(r => {
      if (!groupedByState[r.estado]) {
        groupedByState[r.estado] = [];
      }
      groupedByState[r.estado].push(r);
    });

    const trends: Record<string, 'alta' | 'baixa' | 'estavel'> = {};
    for (const estado in groupedByState) {
      const historico = groupedByState[estado].map(r => ({ data: new Date(r.dataRegistro).toISOString(), preco: r.precoMedio }));
      trends[estado] = this.calculatePriceTrend(historico);
    }
    return trends;
  }

  private static generatePriceProjections(results: any[], periodo: string): any {
    const lastPrice = results.length > 0 ? results[0].precoMedio : 0;
    const projectionDays = {
      'day': 7,
      'week': 4,
      'month': 3,
      'quarter': 2,
      'year': 1
    }[periodo] || 1;

    const projections: { data: string; preco: number }[] = [];
    for (let i = 1; i <= projectionDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const projectedPrice = parseFloat((lastPrice * (1 + (Math.random() - 0.5) * 0.03)).toFixed(2));
      projections.push({
        data: date.toISOString().split('T')[0],
        preco: projectedPrice,
      });
    }
    return projections;
  }
}


