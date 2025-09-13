import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { insightsService, Insight, Recommendation } from '../services/insightsService';
import { LoadingSpinner } from './LoadingSpinner';
import { SkeletonLoader } from './SkeletonLoader';

interface InsightsPanelProps {
  selectedVehicleId?: string;
  periodDays?: number;
  showFullAnalysis?: boolean;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  selectedVehicleId,
  periodDays = 30,
  showFullAnalysis = false,
}) => {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  const [expandedRecommendation, setExpandedRecommendation] = useState<number | null>(null);

  // Query para insights
  const { data: insightsData, isLoading, error, refetch } = useQuery({
    queryKey: ['insights', selectedVehicleId, periodDays, showFullAnalysis],
    queryFn: () => {
      if (showFullAnalysis) {
        return insightsService.generateInsights({
          id_veiculo: selectedVehicleId,
          periodo_dias: periodDays,
        });
      } else {
        return insightsService.getInsightsSummary({
          id_veiculo: selectedVehicleId,
          periodo_dias: periodDays,
        });
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  const getImpactColor = (impacto: string) => {
    switch (impacto) {
      case 'positivo':
        return '#10B981'; // Verde
      case 'negativo':
        return '#EF4444'; // Vermelho
      case 'neutro':
      default:
        return '#F59E0B'; // Amarelo
    }
  };

  const getImpactIcon = (impacto: string) => {
    switch (impacto) {
      case 'positivo':
        return '✅';
      case 'negativo':
        return '⚠️';
      case 'neutro':
      default:
        return 'ℹ️';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return '#EF4444'; // Vermelho
      case 'media':
        return '#F59E0B'; // Amarelo
      case 'baixa':
      default:
        return '#6B7280'; // Cinza
    }
  };

  const getPriorityIcon = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return '🔴';
      case 'media':
        return '🟡';
      case 'baixa':
      default:
        return '🔵';
    }
  };

  const renderInsight = (insight: Insight, index: number) => {
    const isExpanded = expandedInsight === index;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.insightCard,
          { borderLeftColor: getImpactColor(insight.impacto) }
        ]}
        onPress={() => setExpandedInsight(isExpanded ? null : index)}
      >
        <View style={styles.insightHeader}>
          <View style={styles.insightTitleContainer}>
            <Text style={styles.insightIcon}>{getImpactIcon(insight.impacto)}</Text>
            <Text style={styles.insightTitle}>{insight.titulo}</Text>
          </View>
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </View>
        
        <Text style={styles.insightDescription}>{insight.descricao}</Text>
        
        {isExpanded && (
          <View style={styles.insightDetails}>
            <Text style={styles.insightDetailsText}>{insight.detalhes}</Text>
            <View style={styles.insightTypeContainer}>
              <Text style={styles.insightType}>Categoria: {insight.tipo}</Text>
              <View style={[
                styles.impactBadge,
                { backgroundColor: getImpactColor(insight.impacto) }
              ]}>
                <Text style={styles.impactText}>{insight.impacto}</Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderRecommendation = (recommendation: Recommendation, index: number) => {
    const isExpanded = expandedRecommendation === index;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.recommendationCard,
          { borderLeftColor: getPriorityColor(recommendation.prioridade) }
        ]}
        onPress={() => setExpandedRecommendation(isExpanded ? null : index)}
      >
        <View style={styles.recommendationHeader}>
          <View style={styles.recommendationTitleContainer}>
            <Text style={styles.recommendationIcon}>
              {getPriorityIcon(recommendation.prioridade)}
            </Text>
            <Text style={styles.recommendationTitle}>{recommendation.titulo}</Text>
          </View>
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </View>
        
        <Text style={styles.recommendationDescription}>{recommendation.descricao}</Text>
        
        <View style={styles.recommendationMeta}>
          <Text style={styles.recommendationCategory}>
            {recommendation.categoria}
          </Text>
          <View style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(recommendation.prioridade) }
          ]}>
            <Text style={styles.priorityText}>{recommendation.prioridade}</Text>
          </View>
        </View>

        {isExpanded && recommendation.acoes.length > 0 && (
          <View style={styles.actionsContainer}>
            <Text style={styles.actionsTitle}>Ações recomendadas:</Text>
            {recommendation.acoes.map((acao, actionIndex) => (
              <Text key={actionIndex} style={styles.actionItem}>
                • {acao}
              </Text>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSummary = () => {
    if (!insightsData?.resumo_geral) return null;

    const { resumo_geral } = insightsData;

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo Geral</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{resumo_geral.total_insights}</Text>
            <Text style={styles.summaryLabel}>Insights</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{resumo_geral.total_recomendacoes}</Text>
            <Text style={styles.summaryLabel}>Recomendações</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
              {resumo_geral.prioridade_alta}
            </Text>
            <Text style={styles.summaryLabel}>Alta Prioridade</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{resumo_geral.areas_atencao.length}</Text>
            <Text style={styles.summaryLabel}>Áreas de Atenção</Text>
          </View>
        </View>
        
        {resumo_geral.areas_atencao.length > 0 && (
          <View style={styles.areasContainer}>
            <Text style={styles.areasTitle}>Áreas que precisam de atenção:</Text>
            <View style={styles.areasGrid}>
              {resumo_geral.areas_atencao.map((area, index) => (
                <View key={index} style={styles.areaTag}>
                  <Text style={styles.areaText}>{area}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SkeletonLoader height={120} />
        <SkeletonLoader height={80} />
        <SkeletonLoader height={80} />
        <SkeletonLoader height={80} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar insights</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!insightsData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum insight disponível</Text>
        <Text style={styles.emptySubtext}>
          Dados insuficientes para gerar insights no período selecionado
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderSummary()}

      {/* Insights */}
      {insightsData.insights && insightsData.insights.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Insights</Text>
          {insightsData.insights.map((insight, index) => renderInsight(insight, index))}
        </View>
      )}

      {/* Recomendações */}
      {insightsData.recommendations && insightsData.recommendations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Recomendações</Text>
          {insightsData.recommendations
            .sort((a, b) => {
              const priorityOrder = { alta: 3, media: 2, baixa: 1 };
              return priorityOrder[b.prioridade] - priorityOrder[a.prioridade];
            })
            .map((recommendation, index) => renderRecommendation(recommendation, index))}
        </View>
      )}

      {/* Informações do período */}
      {'periodo' in insightsData && insightsData.periodo && (
        <View style={styles.periodInfo}>
          <Text style={styles.periodTitle}>Período de Análise</Text>
          <Text style={styles.periodText}>
            {new Date(insightsData.periodo.data_inicio).toLocaleDateString('pt-BR')} até{' '}
            {new Date(insightsData.periodo.data_fim).toLocaleDateString('pt-BR')}
          </Text>
          <Text style={styles.periodText}>
            Total: {insightsData.periodo.total_dias} dias
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  areasContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  areasTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  areasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  areaTag: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  areaText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  insightIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  expandIcon: {
    fontSize: 12,
    color: '#6B7280',
  },
  insightDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  insightDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  insightDetailsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  insightTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightType: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recommendationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  recommendationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendationCategory: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  actionsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  actionItem: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  periodInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  periodTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  periodText: {
    fontSize: 12,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

