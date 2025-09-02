import { eq, and, gte, lte, desc, asc, sql, inArray, avg, ne } from 'drizzle-orm';
import { db } from '../db/connection';
import { historicoPrecoCombustivel, usuarios } from '../db/schema'; 

// ========== TIPOS E INTERFACES ==========

export interface FuelPriceData {
  id: string;
  estado: string;
  cidade: string;
  tipoCombustivel: 'gasolina' | 'etanol' | ' gasolina' | 'gnv' | 'flex';
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
  tipoCombustivel?: 'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'flex';
  limite?: number;
}

export interface PriceHistoryParams {
  estado: string;
  cidade: string;
  tipoCombustivel: 'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'flex';
  periodoDias: number;
}

export interface RegionalComparisonParams {
  tipoCombustivel: 'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'flex';
  estados: string[];
  incluirTendencia: boolean;
}

export interface NearbyPricesQuery {
  latitude: number;
  longitude: number;
  raio: number;
  tipoCombustivel?: 'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'flex';
}

export interface PriceReport {
  id: string;
  userId: string;
  estado: string;
  cidade: string;
  tipoCombustivel: 'gasolina' | 'etanol' | 'diesel' | 'gnv';
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
  'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'SC': 'Santa Catarina',
  'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
};

const PRECOS_BASE_COMBUSTIVEL: Record<string, number> = {
  'gasolina': 5.89,
  'etanol': 4.29,
  'diesel': 5.45,
  'gnv': 4.15
};

const FATORES_ESTADO: Record<string, number> = {
  'SP': 1.0, 'RJ': 1.05, 'MG': 0.95, 'RS': 0.98, 'PR': 0.97,
  'SC': 0.99, 'BA': 1.02, 'GO': 0.93, 'DF': 1.01, 'ES': 1.03,
  'CE': 1.04, 'PE': 1.03, 'AM': 1.08, 'PA': 1.06, 'MA': 1.07,
  'PB': 1.05, 'RN': 1.04, 'AL': 1.06, 'SE': 1.05, 'PI': 1.08,
  'MT': 0.94, 'MS': 0.96, 'RO': 1.07, 'AC': 1.10, 'AP': 1.12,
  'RR': 1.15, 'TO': 1.02
};

// Helper function for cryptographically secure random number generation
function getRandomNumber(min: number, max: number): number {
  const randomBytes = new Uint8Array(1);
  crypto.getRandomValues(randomBytes);
  return min + (randomBytes[0] / 255) * (max - min);
}

// ========== SERVIÇO PRINCIPAL ==========

export class FuelPricesService {
  
  /**
   * Busca preços por região com filtros avançados
   */
  static async getPricesByRegion(filters: FuelPriceFilters): Promise<FuelPriceData[]> {
    try {
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
      
      // Construir query com condições aplicadas
      const query = db.select().from(historicoPrecoCombustivel)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
            
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
            gte(historicoPrecoCombustivel.dataRegistro, startDate)
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
          variacaoSemanal: dadosEstado?.variacaoSemanal || (getRandomNumber(-0.05, 0.05)),
          variacaoMensal: dadosEstado?.variacaoMensal || (getRandomNumber(-0.1, 0.1)),
          numeroPostos: dadosEstado?.numeroPostos || Math.floor(getRandomNumber(100, 600)),
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
            gte(historicoPrecoCombustivel.dataRegistro, sql`DATE('now', '-30 days')`)
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
            warnings.push(`Preço ${(Math.abs(precoMedio - priceData.precoMedio) / precoMedio * 100).toFixed(1)}% abaixo da média regional`);
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
      const reportId = `price_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      
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
        dataRegistro: new Date(newDate.dataRegistro),
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
      
      // Construir query com condições aplicadas
      const conditions: any[] = [gte(historicoPrecoCombustivel.dataRegistro, startDate)];
      
      if (tipoCombustivel) {
        conditions.push(eq(historicoPrecoCombustivel.tipoCombustivel, tipoCombustivel));
      }
      
      const query = db.select().from(historicoPrecoCombustivel)
        .where(and(...conditions));
      
      const results = await query.orderBy(desc(historicoPrecoCombustivel.dataRegistro));

      // Calcular estatísticas
      const precos = results.map(r => r.precoMedio);
      const estatisticas = this.calculatePriceStatistics(results.map(r => ({ preco: r.precoMedio })));

      // Agrupar por tipo de combustível
      const porTipoCombustivel = this.groupByFuelType(results);


(Content truncated due to size limit. Use page ranges or line ranges to read remaining content.

