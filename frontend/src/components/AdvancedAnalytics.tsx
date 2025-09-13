import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { advancedAnalyticsService } from '../services/multiVehicleService';
import { LoadingSpinner } from './LoadingSpinner';
import { SkeletonLoader } from './SkeletonLoader';

const { width } = Dimensions.get('window');

interface AdvancedAnalyticsProps {
  selectedVehicleId?: string;
  selectedPeriod?: '7d' | '30d' | '90d' | '1y';
}

type AnalysisType = 'consumption' | 'productivity' | 'patterns' | 'comparison';

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  selectedVehicleId,
  selectedPeriod = '30d',
}) => {
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisType>('consumption');

  // Queries para diferentes tipos de análise
  const consumptionQuery = useQuery({
    queryKey: ['consumption-analysis', selectedVehicleId, selectedPeriod],
    queryFn: () => advancedAnalyticsService.getConsumptionAnalysis({
      id_veiculo: selectedVehicleId,
      periodo: selectedPeriod,
    }),
    enabled: activeAnalysis === 'consumption',
  });

  const productivityQuery = useQuery({
    queryKey: ['productivity-analysis', selectedVehicleId, selectedPeriod],
    queryFn: () => advancedAnalyticsService.getProductivityAnalysis({
      id_veiculo: selectedVehicleId,
      periodo: selectedPeriod,
    }),
    enabled: activeAnalysis === 'productivity',
  });

  const patternsQuery = useQuery({
    queryKey: ['patterns-analysis', selectedVehicleId, selectedPeriod],
    queryFn: () => advancedAnalyticsService.getTemporalPatterns({
      id_veiculo: selectedVehicleId,
      periodo: selectedPeriod,
    }),
    enabled: activeAnalysis === 'patterns',
  });

  const comparisonQuery = useQuery({
    queryKey: ['comparison-analysis', selectedPeriod],
    queryFn: () => advancedAnalyticsService.getVehicleComparison({
      periodo: selectedPeriod,
    }),
    enabled: activeAnalysis === 'comparison',
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getPeriodLabel = (period: string) => {
    const labels = {
      '7d': 'Últimos 7 dias',
      '30d': 'Últimos 30 dias',
      '90d': 'Últimos 90 dias',
      '1y': 'Último ano',
    };
    return labels[period as keyof typeof labels] || period;
  };

  const renderAnalysisSelector = () => (
    <View style={styles.selectorContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: 'consumption', label: 'Consumo', icon: '⛽' },
          { key: 'productivity', label: 'Produtividade', icon: '📊' },
          { key: 'patterns', label: 'Padrões', icon: '📈' },
          { key: 'comparison', label: 'Comparação', icon: '🔄' },
        ].map((analysis) => (
          <TouchableOpacity
            key={analysis.key}
            style={[
              styles.selectorButton,
              activeAnalysis === analysis.key && styles.selectorButtonActive
            ]}
            onPress={() => setActiveAnalysis(analysis.key as AnalysisType)}
          >
            <Text style={styles.selectorIcon}>{analysis.icon}</Text>
            <Text style={[
              styles.selectorText,
              activeAnalysis === analysis.key && styles.selectorTextActive
            ]}>
              {analysis.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderConsumptionAnalysis = () => {
    if (consumptionQuery.isLoading) {
      return <SkeletonLoader height={300} />;
    }

    if (consumptionQuery.error || !consumptionQuery.data) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar análise de consumo</Text>
        </View>
      );
    }

    const data = consumptionQuery.data;

    return (
      <ScrollView style={styles.analysisContainer}>
        <Text style={styles.analysisTitle}>Análise de Consumo</Text>
        <Text style={styles.periodText}>{data.periodo.descricao}</Text>

        {/* Resumo Geral */}
        {data.resumo_geral && (
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Resumo Geral</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{data.resumo_geral.total_veiculos}</Text>
                <Text style={styles.summaryLabel}>Veículos</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {data.resumo_geral.consumo_medio_geral} km/l
                </Text>
                <Text style={styles.summaryLabel}>Consumo Médio</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {formatCurrency(data.resumo_geral.custo_medio_geral)}
                </Text>
                <Text style={styles.summaryLabel}>Custo/km</Text>
              </View>
            </View>
          </View>
        )}

        {/* Análise por Veículo */}
        {data.analise_consumo.map((vehicleAnalysis, index) => (
          <View key={index} style={styles.vehicleCard}>
            <Text style={styles.vehicleTitle}>
              {vehicleAnalysis.veiculo.marca} {vehicleAnalysis.veiculo.modelo}
            </Text>
            <Text style={styles.vehicleSubtitle}>
              {vehicleAnalysis.veiculo.placa} • {vehicleAnalysis.veiculo.tipo_combustivel}
            </Text>

            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>
                  {vehicleAnalysis.metricas_periodo.consumo_medio} km/l
                </Text>
                <Text style={styles.metricLabel}>Consumo Médio</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>
                  {vehicleAnalysis.metricas_periodo.total_km} km
                </Text>
                <Text style={styles.metricLabel}>KM Total</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>
                  {vehicleAnalysis.metricas_periodo.total_litros} L
                </Text>
                <Text style={styles.metricLabel}>Litros</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>
                  {formatCurrency(vehicleAnalysis.metricas_periodo.total_gasto_combustivel)}
                </Text>
                <Text style={styles.metricLabel}>Gasto Total</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderProductivityAnalysis = () => {
    if (productivityQuery.isLoading) {
      return <SkeletonLoader height={300} />;
    }

    if (productivityQuery.error || !productivityQuery.data) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar análise de produtividade</Text>
        </View>
      );
    }

    const data = productivityQuery.data;

    return (
      <ScrollView style={styles.analysisContainer}>
        <Text style={styles.analysisTitle}>Análise de Produtividade</Text>
        <Text style={styles.periodText}>{data.periodo.descricao}</Text>

        {/* Rankings */}
        <View style={styles.rankingContainer}>
          <Text style={styles.cardTitle}>Ranking - Ganho por KM</Text>
          {data.rankings.ganho_por_km.slice(0, 3).map((item, index) => (
            <View key={index} style={styles.rankingItem}>
              <View style={styles.rankingPosition}>
                <Text style={styles.rankingPositionText}>{item.posicao}º</Text>
              </View>
              <View style={styles.rankingInfo}>
                <Text style={styles.rankingVehicle}>
                  {item.veiculo.marca} {item.veiculo.modelo}
                </Text>
                <Text style={styles.rankingValue}>
                  {formatCurrency(item.ganho_por_km)}/km
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Análise por Veículo */}
        {data.analise_produtividade.map((vehicleAnalysis, index) => (
          <View key={index} style={styles.vehicleCard}>
            <Text style={styles.vehicleTitle}>
              {vehicleAnalysis.veiculo.marca} {vehicleAnalysis.veiculo.modelo}
            </Text>
            <Text style={styles.vehicleSubtitle}>
              {vehicleAnalysis.veiculo.placa}
            </Text>

            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>
                  {formatCurrency(vehicleAnalysis.produtividade.ganho_por_km)}
                </Text>
                <Text style={styles.metricLabel}>Ganho/km</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>
                  {formatCurrency(vehicleAnalysis.produtividade.ganho_por_hora)}
                </Text>
                <Text style={styles.metricLabel}>Ganho/hora</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>
                  {vehicleAnalysis.produtividade.km_por_hora} km/h
                </Text>
                <Text style={styles.metricLabel}>Velocidade Média</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[
                  styles.metricValue,
                  { color: vehicleAnalysis.produtividade.classificacao_eficiencia === 'Alta' ? '#10B981' : 
                           vehicleAnalysis.produtividade.classificacao_eficiencia === 'Média' ? '#F59E0B' : '#EF4444' }
                ]}>
                  {vehicleAnalysis.produtividade.classificacao_eficiencia}
                </Text>
                <Text style={styles.metricLabel}>Eficiência</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderPatternsAnalysis = () => {
    if (patternsQuery.isLoading) {
      return <SkeletonLoader height={300} />;
    }

    if (patternsQuery.error || !patternsQuery.data) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar padrões temporais</Text>
        </View>
      );
    }

    const data = patternsQuery.data;

    return (
      <ScrollView style={styles.analysisContainer}>
        <Text style={styles.analysisTitle}>Padrões Temporais</Text>
        <Text style={styles.periodText}>{data.periodo.descricao}</Text>

        {/* Recomendações */}
        {data.recomendacoes && data.recomendacoes.length > 0 && (
          <View style={styles.recommendationsCard}>
            <Text style={styles.cardTitle}>💡 Recomendações</Text>
            {data.recomendacoes.map((recomendacao, index) => (
              <Text key={index} style={styles.recommendationText}>
                • {recomendacao}
              </Text>
            ))}
          </View>
        )}

        {/* Melhor Dia da Semana */}
        {data.padroes_identificados.melhor_dia_semana && (
          <View style={styles.patternCard}>
            <Text style={styles.cardTitle}>📅 Melhor Dia da Semana</Text>
            <Text style={styles.patternValue}>
              {data.padroes_identificados.melhor_dia_semana.dia_semana}
            </Text>
            <Text style={styles.patternDescription}>
              Faturamento médio: {formatCurrency(data.padroes_identificados.melhor_dia_semana.faturamento_medio)}
            </Text>
            <Text style={styles.patternDescription}>
              {data.padroes_identificados.melhor_dia_semana.numero_jornadas} jornadas em média
            </Text>
          </View>
        )}

        {/* Melhor Horário */}
        {data.padroes_identificados.melhor_horario && (
          <View style={styles.patternCard}>
            <Text style={styles.cardTitle}>🕐 Melhor Horário</Text>
            <Text style={styles.patternValue}>
              {data.padroes_identificados.melhor_horario.hora}:00h
            </Text>
            <Text style={styles.patternDescription}>
              Faturamento médio: {formatCurrency(data.padroes_identificados.melhor_horario.faturamento_medio)}
            </Text>
          </View>
        )}

        {/* Análise por Dia da Semana */}
        <View style={styles.weekAnalysisCard}>
          <Text style={styles.cardTitle}>Análise por Dia da Semana</Text>
          {data.analise_por_dia_semana.map((dia, index) => (
            <View key={index} style={styles.dayAnalysisItem}>
              <Text style={styles.dayName}>{dia.dia_semana}</Text>
              <View style={styles.dayMetrics}>
                <Text style={styles.dayMetric}>
                  {formatCurrency(dia.faturamento_medio)} médio
                </Text>
                <Text style={styles.dayMetric}>
                  {dia.numero_jornadas} jornadas
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderComparisonAnalysis = () => {
    if (comparisonQuery.isLoading) {
      return <SkeletonLoader height={300} />;
    }

    if (comparisonQuery.error || !comparisonQuery.data) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar comparação entre veículos</Text>
        </View>
      );
    }

    const data = comparisonQuery.data;

    return (
      <ScrollView style={styles.analysisContainer}>
        <Text style={styles.analysisTitle}>Comparação entre Veículos</Text>
        <Text style={styles.periodText}>{data.periodo.descricao}</Text>

        {/* Resumo Comparativo */}
        {data.resumo_comparativo && (
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>🏆 Destaques</Text>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightLabel}>Maior Faturamento:</Text>
              <Text style={styles.highlightValue}>
                {data.resumo_comparativo.veiculo_maior_faturamento.marca} {data.resumo_comparativo.veiculo_maior_faturamento.modelo}
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightLabel}>Maior Lucro:</Text>
              <Text style={styles.highlightValue}>
                {data.resumo_comparativo.veiculo_maior_lucro.marca} {data.resumo_comparativo.veiculo_maior_lucro.modelo}
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightLabel}>Mais Eficiente:</Text>
              <Text style={styles.highlightValue}>
                {data.resumo_comparativo.veiculo_mais_eficiente.marca} {data.resumo_comparativo.veiculo_mais_eficiente.modelo}
              </Text>
            </View>
          </View>
        )}

        {/* Comparação Detalhada */}
        {data.comparacao_veiculos.map((vehicleComparison, index) => (
          <View key={index} style={styles.comparisonCard}>
            <Text style={styles.vehicleTitle}>
              {vehicleComparison.veiculo.marca} {vehicleComparison.veiculo.modelo}
            </Text>
            <Text style={styles.vehicleSubtitle}>
              {vehicleComparison.veiculo.placa} • {vehicleComparison.veiculo.tipo_combustivel}
            </Text>

            <View style={styles.comparisonSection}>
              <Text style={styles.sectionTitle}>💰 Financeiro</Text>
              <View style={styles.comparisonGrid}>
                <View style={styles.comparisonItem}>
                  <Text style={styles.comparisonValue}>
                    {formatCurrency(vehicleComparison.metricas_financeiras.faturamento_total)}
                  </Text>
                  <Text style={styles.comparisonLabel}>Faturamento</Text>
                </View>
                <View style={styles.comparisonItem}>
                  <Text style={[
                    styles.comparisonValue,
                    { color: vehicleComparison.metricas_financeiras.lucro_liquido >= 0 ? '#10B981' : '#EF4444' }
                  ]}>
                    {formatCurrency(vehicleComparison.metricas_financeiras.lucro_liquido)}
                  </Text>
                  <Text style={styles.comparisonLabel}>Lucro</Text>
                </View>
                <View style={styles.comparisonItem}>
                  <Text style={styles.comparisonValue}>
                    {formatPercentage(vehicleComparison.metricas_financeiras.margem_lucro)}
                  </Text>
                  <Text style={styles.comparisonLabel}>Margem</Text>
                </View>
              </View>
            </View>

            <View style={styles.comparisonSection}>
              <Text style={styles.sectionTitle}>⚡ Eficiência</Text>
              <View style={styles.comparisonGrid}>
                <View style={styles.comparisonItem}>
                  <Text style={styles.comparisonValue}>
                    {vehicleComparison.metricas_eficiencia.consumo_medio} km/l
                  </Text>
                  <Text style={styles.comparisonLabel}>Consumo</Text>
                </View>
                <View style={styles.comparisonItem}>
                  <Text style={styles.comparisonValue}>
                    {formatCurrency(vehicleComparison.metricas_eficiencia.ganho_por_km)}
                  </Text>
                  <Text style={styles.comparisonLabel}>Ganho/km</Text>
                </View>
                <View style={styles.comparisonItem}>
                  <Text style={styles.comparisonValue}>
                    {formatCurrency(vehicleComparison.metricas_eficiencia.custo_por_km)}
                  </Text>
                  <Text style={styles.comparisonLabel}>Custo/km</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderCurrentAnalysis = () => {
    switch (activeAnalysis) {
      case 'consumption':
        return renderConsumptionAnalysis();
      case 'productivity':
        return renderProductivityAnalysis();
      case 'patterns':
        return renderPatternsAnalysis();
      case 'comparison':
        return renderComparisonAnalysis();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderAnalysisSelector()}
      <View style={styles.periodContainer}>
        <Text style={styles.periodLabel}>Período: {getPeriodLabel(selectedPeriod)}</Text>
      </View>
      {renderCurrentAnalysis()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  selectorContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectorButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    minWidth: 80,
  },
  selectorButtonActive: {
    backgroundColor: '#3B82F6',
  },
  selectorIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  selectorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectorTextActive: {
    color: '#FFFFFF',
  },
  periodContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  periodLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  analysisContainer: {
    flex: 1,
    padding: 16,
  },
  analysisTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  periodText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  summaryCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '30%',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  vehicleSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  metricLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  rankingContainer: {
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
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rankingPosition: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankingPositionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  rankingInfo: {
    flex: 1,
  },
  rankingVehicle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  rankingValue: {
    fontSize: 12,
    color: '#6B7280',
  },
  recommendationsCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  recommendationText: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
    lineHeight: 20,
  },
  patternCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  patternValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  patternDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  weekAnalysisCard: {
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
  dayAnalysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dayName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  dayMetrics: {
    alignItems: 'flex-end',
  },
  dayMetric: {
    fontSize: 12,
    color: '#6B7280',
  },
  comparisonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  comparisonSection: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  comparisonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comparisonItem: {
    width: '30%',
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  comparisonLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  highlightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  highlightLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  highlightValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
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
  },
});

