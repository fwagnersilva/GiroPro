import React, { useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Animated,
  LayoutAnimation,
  Platform
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { insightsService, Insight, Recommendation } from '../services/insightsService';
import { LoadingSpinner } from './LoadingSpinner';
import { SkeletonLoaderImproved } from './SkeletonLoaderImproved';

// Ícones profissionais melhorados
const Icons = {
  TrendingUp: () => <Text style={[styles.icon, { color: '#10B981' }]}>📈</Text>,
  TrendingDown: () => <Text style={[styles.icon, { color: '#EF4444' }]}>📉</Text>,
  AlertTriangle: () => <Text style={[styles.icon, { color: '#F59E0B' }]}>⚠️</Text>,
  CheckCircle: () => <Text style={[styles.icon, { color: '#10B981' }]}>✅</Text>,
  Info: () => <Text style={[styles.icon, { color: '#3B82F6' }]}>ℹ️</Text>,
  Target: () => <Text style={[styles.icon, { color: '#EF4444' }]}>🎯</Text>,
  Lightbulb: () => <Text style={[styles.icon, { color: '#F59E0B' }]}>💡</Text>,
  ChevronDown: () => <Text style={styles.chevron}>▼</Text>,
  ChevronRight: () => <Text style={styles.chevron}>▶</Text>,
  BarChart: () => <Text style={styles.icon}>📊</Text>,
  Calendar: () => <Text style={styles.icon}>📅</Text>,
  Clock: () => <Text style={styles.icon}>🕐</Text>,
};

type ViewMode = 'all' | 'insights' | 'recommendations';
type DensityMode = 'compact' | 'normal' | 'expanded';

interface InsightsPanelImprovedProps {
  selectedVehicleId?: string;
  periodDays?: number;
  showFullAnalysis?: boolean;
  viewMode?: ViewMode;
}

export const InsightsPanelImproved: React.FC<InsightsPanelImprovedProps> = ({
  selectedVehicleId,
  periodDays = 30,
  showFullAnalysis = false,
  viewMode = 'all',
}) => {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  const [expandedRecommendation, setExpandedRecommendation] = useState<number | null>(null);
  const [densityMode, setDensityMode] = useState<DensityMode>('normal');
  const [sortBy, setSortBy] = useState<'priority' | 'impact' | 'date'>('priority');

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

  const getImpactConfig = (impacto: string) => {
    switch (impacto) {
      case 'positivo':
        return {
          color: '#10B981',
          backgroundColor: '#ECFDF5',
          borderColor: '#10B981',
          icon: Icons.TrendingUp,
          label: 'Positivo'
        };
      case 'negativo':
        return {
          color: '#EF4444',
          backgroundColor: '#FEF2F2',
          borderColor: '#EF4444',
          icon: Icons.TrendingDown,
          label: 'Negativo'
        };
      case 'neutro':
      default:
        return {
          color: '#F59E0B',
          backgroundColor: '#FFFBEB',
          borderColor: '#F59E0B',
          icon: Icons.Info,
          label: 'Neutro'
        };
    }
  };

  const getPriorityConfig = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return {
          color: '#EF4444',
          backgroundColor: '#FEF2F2',
          borderColor: '#EF4444',
          icon: Icons.AlertTriangle,
          label: 'Alta'
        };
      case 'media':
        return {
          color: '#F59E0B',
          backgroundColor: '#FFFBEB',
          borderColor: '#F59E0B',
          icon: Icons.Target,
          label: 'Média'
        };
      case 'baixa':
      default:
        return {
          color: '#6B7280',
          backgroundColor: '#F9FAFB',
          borderColor: '#6B7280',
          icon: Icons.Info,
          label: 'Baixa'
        };
    }
  };

  const toggleExpansion = useCallback((type: 'insight' | 'recommendation', index: number) => {
    if (Platform.OS === 'ios') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    
    if (type === 'insight') {
      setExpandedInsight(expandedInsight === index ? null : index);
    } else {
      setExpandedRecommendation(expandedRecommendation === index ? null : index);
    }
  }, [expandedInsight, expandedRecommendation]);

  const filteredInsights = useMemo(() => {
    if (!insightsData?.insights) return [];
    
    let filtered = [...insightsData.insights];
    
    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { alta: 3, media: 2, baixa: 1 };
          return (priorityOrder[b.impacto as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.impacto as keyof typeof priorityOrder] || 0);
        case 'impact':
          const impactOrder = { positivo: 3, neutro: 2, negativo: 1 };
          return (impactOrder[b.impacto as keyof typeof impactOrder] || 0) - 
                 (impactOrder[a.impacto as keyof typeof impactOrder] || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [insightsData?.insights, sortBy]);

  const filteredRecommendations = useMemo(() => {
    if (!insightsData?.recommendations) return [];
    
    let filtered = [...insightsData.recommendations];
    
    // Ordenação por prioridade
    filtered.sort((a, b) => {
      const priorityOrder = { alta: 3, media: 2, baixa: 1 };
      return (priorityOrder[b.prioridade as keyof typeof priorityOrder] || 0) - 
             (priorityOrder[a.prioridade as keyof typeof priorityOrder] || 0);
    });
    
    return filtered;
  }, [insightsData?.recommendations, sortBy]);

  const renderInsight = useCallback((insight: Insight, index: number) => {
    const isExpanded = expandedInsight === index;
    const config = getImpactConfig(insight.impacto);
    const isCompact = densityMode === 'compact';

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.card,
          styles.insightCard,
          { borderLeftColor: config.borderColor },
          isCompact && styles.compactCard
        ]}
        onPress={() => toggleExpansion('insight', index)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <View style={[styles.iconContainer, { backgroundColor: config.backgroundColor }]}>
              <config.icon />
            </View>
            <View style={styles.titleTextContainer}>
              <Text style={[styles.cardTitle, isCompact && styles.compactTitle]}>
                {insight.titulo}
              </Text>
              {!isCompact && (
                <Text style={styles.cardCategory}>{insight.tipo}</Text>
              )}
            </View>
          </View>
          <View style={styles.cardActions}>
            <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
              <Text style={[styles.badgeText, { color: config.color }]}>
                {config.label}
              </Text>
            </View>
            {isExpanded ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
          </View>
        </View>
        
        {!isCompact && (
          <Text style={styles.cardDescription} numberOfLines={isExpanded ? undefined : 2}>
            {insight.descricao}
          </Text>
        )}
        
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.detailsText}>{insight.detalhes}</Text>
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Icons.BarChart />
                <Text style={styles.metaText}>Categoria: {insight.tipo}</Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [expandedInsight, densityMode, toggleExpansion]);

  const renderRecommendation = useCallback((recommendation: Recommendation, index: number) => {
    const isExpanded = expandedRecommendation === index;
    const config = getPriorityConfig(recommendation.prioridade);
    const isCompact = densityMode === 'compact';

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.card,
          styles.recommendationCard,
          { borderLeftColor: config.borderColor },
          isCompact && styles.compactCard
        ]}
        onPress={() => toggleExpansion('recommendation', index)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <View style={[styles.iconContainer, { backgroundColor: config.backgroundColor }]}>
              <config.icon />
            </View>
            <View style={styles.titleTextContainer}>
              <Text style={[styles.cardTitle, isCompact && styles.compactTitle]}>
                {recommendation.titulo}
              </Text>
              {!isCompact && (
                <Text style={styles.cardCategory}>{recommendation.categoria}</Text>
              )}
            </View>
          </View>
          <View style={styles.cardActions}>
            <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
              <Text style={[styles.badgeText, { color: config.color }]}>
                {config.label}
              </Text>
            </View>
            {isExpanded ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
          </View>
        </View>
        
        {!isCompact && (
          <Text style={styles.cardDescription} numberOfLines={isExpanded ? undefined : 2}>
            {recommendation.descricao}
          </Text>
        )}

        {isExpanded && recommendation.acoes.length > 0 && (
          <View style={styles.expandedContent}>
            <Text style={styles.actionsTitle}>Ações recomendadas:</Text>
            <View style={styles.actionsList}>
              {recommendation.acoes.map((acao, actionIndex) => (
                <View key={actionIndex} style={styles.actionItem}>
                  <View style={styles.actionBullet} />
                  <Text style={styles.actionText}>{acao}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [expandedRecommendation, densityMode, toggleExpansion]);

  const renderSummary = () => {
    if (!insightsData?.resumo_geral) return null;

    const { resumo_geral } = insightsData;

    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryHeader}>
          <Icons.BarChart />
          <Text style={styles.summaryTitle}>Resumo Geral</Text>
        </View>
        
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

  const renderControls = () => (
    <View style={styles.controlsContainer}>
      <View style={styles.controlsRow}>
        <Text style={styles.controlsLabel}>Visualização:</Text>
        <View style={styles.densityButtons}>
          {(['compact', 'normal', 'expanded'] as DensityMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.densityButton,
                densityMode === mode && styles.activeDensityButton
              ]}
              onPress={() => setDensityMode(mode)}
            >
              <Text style={[
                styles.densityButtonText,
                densityMode === mode && styles.activeDensityButtonText
              ]}>
                {mode === 'compact' ? 'Compacto' : mode === 'normal' ? 'Normal' : 'Expandido'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SkeletonLoaderImproved />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icons.AlertTriangle />
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
        <Icons.Info />
        <Text style={styles.emptyText}>Nenhum insight disponível</Text>
        <Text style={styles.emptySubtext}>
          Dados insuficientes para gerar insights no período selecionado
        </Text>
      </View>
    );
  }

  const shouldShowInsights = viewMode === 'all' || viewMode === 'insights';
  const shouldShowRecommendations = viewMode === 'all' || viewMode === 'recommendations';

  return (
    <View style={styles.container}>
      {renderSummary()}
      {renderControls()}

      {/* Insights */}
      {shouldShowInsights && filteredInsights.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icons.Lightbulb />
            <Text style={styles.sectionTitle}>Insights ({filteredInsights.length})</Text>
          </View>
          {filteredInsights.map((insight, index) => renderInsight(insight, index))}
        </View>
      )}

      {/* Recomendações */}
      {shouldShowRecommendations && filteredRecommendations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icons.Target />
            <Text style={styles.sectionTitle}>Recomendações ({filteredRecommendations.length})</Text>
          </View>
          {filteredRecommendations.map((recommendation, index) => 
            renderRecommendation(recommendation, index)
          )}
        </View>
      )}

      {/* Informações do período */}
      {'periodo' in insightsData && insightsData.periodo && (
        <View style={styles.periodInfo}>
          <View style={styles.periodHeader}>
            <Icons.Calendar />
            <Text style={styles.periodTitle}>Período de Análise</Text>
          </View>
          <Text style={styles.periodText}>
            {new Date(insightsData.periodo.data_inicio).toLocaleDateString('pt-BR')} até{' '}
            {new Date(insightsData.periodo.data_fim).toLocaleDateString('pt-BR')}
          </Text>
          <Text style={styles.periodText}>
            Total: {insightsData.periodo.total_dias} dias
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  areasContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  areasTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  areasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  areaTag: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  areaText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
  controlsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  densityButtons: {
    flexDirection: 'row',
  },
  densityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginLeft: 8,
  },
  activeDensityButton: {
    backgroundColor: '#3B82F6',
  },
  densityButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeDensityButtonText: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  compactCard: {
    padding: 16,
  },
  insightCard: {
    // Específico para insights
  },
  recommendationCard: {
    // Específico para recomendações
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 4,
  },
  compactTitle: {
    fontSize: 14,
    marginBottom: 0,
  },
  cardCategory: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  cardActions: {
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  expandedContent: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  actionsList: {
    // Container para lista de ações
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  actionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginTop: 7,
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    flex: 1,
  },
  periodInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  periodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  periodText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  icon: {
    fontSize: 18,
  },
  chevron: {
    fontSize: 12,
    color: '#6B7280',
  },
});

