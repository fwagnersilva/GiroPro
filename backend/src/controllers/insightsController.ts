import { Request, Response } from 'express';
import { AdvancedAnalyticsService } from '../services/advancedAnalyticsService';
import { z } from 'zod';

// Schema de validação para parâmetros de insights
const insightsQuerySchema = z.object({
  idVeiculo: z.string().uuid().optional(),
  periodo_dias: z.coerce.number().min(7).max(365).default(30),
  incluir_tendencias: z.boolean().default(true),
  incluir_sazonalidade: z.boolean().default(true),
  incluir_custos: z.boolean().default(true),
});

export class InsightsController {
  /**
   * Gerar insights completos para o usuário
   */
  static async generateInsights(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const validation = insightsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'Parâmetros inválidos', details: validation.error.errors } 
        });
      }

      const { 
        idVeiculo, 
        periodo_dias, 
        incluir_tendencias, 
        incluir_sazonalidade, 
        incluir_custos 
      } = validation.data;

      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - periodo_dias * 24 * 60 * 60 * 1000);

      // Executar análises em paralelo
      const [
        efficiencyMetrics,
        trends,
        seasonality,
        costs
      ] = await Promise.all([
        AdvancedAnalyticsService.calculateOperationalEfficiency(
          req.user?.id,
          idVeiculo,
          startDate,
          endDate
        ),
        incluir_tendencias ? AdvancedAnalyticsService.analyzeTrends(
          req.user?.id,
          idVeiculo,
          periodo_dias
        ) : null,
        incluir_sazonalidade ? AdvancedAnalyticsService.analyzeSeasonality(
          req.user?.id,
          idVeiculo
        ) : null,
        incluir_custos ? AdvancedAnalyticsService.analyzeCosts(
          req.user?.id,
          idVeiculo,
          startDate,
          endDate
        ) : null,
      ]);

      // Gerar insights e recomendações
      const insightsData = AdvancedAnalyticsService.generateInsights(
        efficiencyMetrics,
        trends,
        seasonality,
        costs
      );

      return res.json({
        success: true,
        data: {
          ...insightsData,
          metricas_eficiencia: efficiencyMetrics,
          analise_tendencias: trends,
          analise_sazonalidade: seasonality,
          analise_custos: costs,
          configuracao: {
            periodo_dias,
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            veiculo_especifico: idVeiculo || null,
            analises_incluidas: {
              tendencias: incluir_tendencias,
              sazonalidade: incluir_sazonalidade,
              custos: incluir_custos,
            }
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao gerar insights:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Obter apenas insights e recomendações (sem dados detalhados)
   */
  static async getInsightsSummary(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const validation = insightsQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'Parâmetros inválidos', details: validation.error.errors } 
        });
      }

      const { idVeiculo, periodo_dias } = validation.data;

      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - periodo_dias * 24 * 60 * 60 * 1000);

      // Executar análises básicas
      const [efficiencyMetrics, trends, seasonality, costs] = await Promise.all([
        AdvancedAnalyticsService.calculateOperationalEfficiency(
          req.user?.id,
          idVeiculo,
          startDate,
          endDate
        ),
        AdvancedAnalyticsService.analyzeTrends(req.user?.id, idVeiculo, periodo_dias),
        AdvancedAnalyticsService.analyzeSeasonality(req.user?.id, idVeiculo),
        AdvancedAnalyticsService.analyzeCosts(req.user?.id, idVeiculo, startDate, endDate),
      ]);

      // Gerar apenas insights e recomendações
      const insightsData = AdvancedAnalyticsService.generateInsights(
        efficiencyMetrics,
        trends,
        seasonality,
        costs
      );

      return res.json({
        success: true,
        data: {
          insights: insightsData.insights,
          recommendations: insightsData.recommendations,
          resumo_geral: insightsData.resumo_geral,
          periodo: {
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            total_dias: periodo_dias,
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao gerar resumo de insights:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Obter métricas de eficiência operacional
   */
  static async getEfficiencyMetrics(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const { idVeiculo, periodo_dias = 30 } = req.query;

      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - Number(periodo_dias) * 24 * 60 * 60 * 1000);

      const efficiencyMetrics = await AdvancedAnalyticsService.calculateOperationalEfficiency(
        req.user?.id,
        idVeiculo as string,
        startDate,
        endDate
      );

      return res.json({
        success: true,
        data: {
          metricas_eficiencia: efficiencyMetrics,
          periodo: {
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            total_dias: Number(periodo_dias),
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao obter métricas de eficiência:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Obter análise de tendências
   */
  static async getTrends(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const { idVeiculo, periodo_dias = 90 } = req.query;

      const trends = await AdvancedAnalyticsService.analyzeTrends(
        req.user?.id,
        idVeiculo as string,
        Number(periodo_dias)
      );

      return res.json({
        success: true,
        data: trends
      });

    } catch (error: any) {
      console.error('Erro ao obter análise de tendências:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Obter análise de sazonalidade
   */
  static async getSeasonality(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const { idVeiculo } = req.query;

      const seasonality = await AdvancedAnalyticsService.analyzeSeasonality(
        req.user?.id,
        idVeiculo as string
      );

      return res.json({
        success: true,
        data: seasonality
      });

    } catch (error: any) {
      console.error('Erro ao obter análise de sazonalidade:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }

  /**
   * Obter análise de custos
   */
  static async getCostAnalysis(req: Request & { userId?: string }, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: { message: 'Usuário não autenticado' } });
      }

      const { idVeiculo, periodo_dias = 30 } = req.query;

      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - Number(periodo_dias) * 24 * 60 * 60 * 1000);

      const costs = await AdvancedAnalyticsService.analyzeCosts(
        req.user?.id,
        idVeiculo as string,
        startDate,
        endDate
      );

      return res.json({
        success: true,
        data: {
          analise_custos: costs,
          periodo: {
            dataInicio: startDate.toISOString(),
            dataFim: endDate.toISOString(),
            total_dias: Number(periodo_dias),
          }
        }
      });

    } catch (error: any) {
      console.error('Erro ao obter análise de custos:', error);
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Erro interno do servidor' } 
      });
    }
  }
}


