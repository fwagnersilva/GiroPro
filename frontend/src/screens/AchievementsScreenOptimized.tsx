import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import { layouts, typography, spacing, components, grid } from '../styles/responsive';
import { isWeb, isDesktop, platformStyles, getSafePadding } from '../utils/platformUtils';

interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  tipo_conquista: 'Faturamento' | 'Quilometragem' | 'Jornadas' | 'Eficiencia' | 'Consistencia' | 'Metas' | 'Especial';
  raridade: 'Comum' | 'Raro' | 'Epico' | 'Lendario';
  icone: string;
  cor: string;
  criterio_valor?: number;
  criterio_descricao?: string;
  pontos_recompensa: number;
  desbloqueada: boolean;
  data_desbloqueio?: string;
  valor_atingido?: number;
}

interface UserStats {
  pontos_total: number;
  nivel_atual: {
    nivel: string;
    nome_exibicao: string;
    pontos_necessarios: number;
    cor: string;
    icone: string;
    beneficios: string;
  };
  proximo_nivel?: {
    nivel: string;
    nome_exibicao: string;
    pontos_necessarios: number;
    cor: string;
    icone: string;
  };
  pontos_para_proximo_nivel: number;
  progresso_nivel: number;
  total_conquistas_desbloqueadas: number;
  conquistas_por_tipo: Array<{
    tipo_conquista: string;
    total: number;
    desbloqueadas: number;
  }>;
  conquistas_recentes: Array<{
    conquista: {
      nome: string;
      icone: string;
      cor: string;
      pontos_recompensa: number;
    };
    data_desbloqueio: string;
  }>;
}

const AchievementsScreenOptimized: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const queryClient = useQueryClient();

  const { data: userStats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['gamification-stats'],
    queryFn: async () => {
      const response = await api.get('/gamification/stats');
      return response.data.data as UserStats;
    }
  });

  const { data: conquistas, isLoading: conquistasLoading, error, refetch: refetchConquistas } = useQuery({
    queryKey: ['achievements', selectedFilter, selectedType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedFilter !== 'all') {
        params.append('desbloqueada', selectedFilter === 'unlocked' ? 'true' : 'false');
      }
      if (selectedType !== 'all') {
        params.append('tipo_conquista', selectedType);
      }
      
      const response = await api.get(`/gamification/achievements?${params.toString()}`);
      return response.data.data.conquistas as Conquista[];
    }
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchStats(),
      refetchConquistas()
    ]);
    setRefreshing(false);
  }, [refetchStats, refetchConquistas]);

  const getRaridadeColor = useCallback((raridade: string) => {
    switch (raridade) {
      case 'Comum': return '#9E9E9E';
      case 'Raro': return '#2196F3';
      case 'Epico': return '#9C27B0';
      case 'Lendario': return '#FF6F00';
      default: return '#9E9E9E';
    }
  }, []);

  const getRaridadeBorder = useCallback((raridade: string) => {
    switch (raridade) {
      case 'Comum': return '#E0E0E0';
      case 'Raro': return '#2196F3';
      case 'Epico': return '#9C27B0';
      case 'Lendario': return '#FF6F00';
      default: return '#E0E0E0';
    }
  }, []);

  const tiposConquista = useMemo(() => ['all', 'Faturamento', 'Quilometragem', 'Jornadas', 'Eficiencia', 'Consistencia', 'Metas', 'Especial'], []);

  const responsiveStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: layouts.dashboard.container.backgroundColor,
      paddingTop: getSafePadding().paddingTop,
    },
    scrollView: {
      flex: 1,
      ...platformStyles.web({
        paddingHorizontal: isDesktop() ? spacing.xl : spacing.md,
      }),
    },
    statsContainer: {
      padding: spacing.md,
      ...platformStyles.web({
        paddingHorizontal: isDesktop() ? spacing.xl : spacing.md,
      }),
    },
    levelCard: {
      ...components.card,
      padding: spacing.md,
      marginBottom: spacing.md,
      backgroundColor: '#fff',
      borderColor: '#E0E0E0',
      borderWidth: 1,
    },
    levelHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    levelIcon: {
      fontSize: typography.h1.fontSize,
      marginRight: spacing.md,
    },
    levelInfo: {
      flex: 1,
    },
    levelName: {
      ...typography.h3,
      color: '#333',
    },
    levelPoints: {
      ...typography.body,
      color: '#666',
      marginTop: spacing.xs,
    },
    progressContainer: {
      marginTop: spacing.sm,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    progressText: {
      ...typography.caption,
      fontWeight: '600',
      color: '#333',
    },
    progressPoints: {
      ...typography.small,
      color: '#666',
    },
    progressBar: {
      height: 8,
      backgroundColor: '#E0E0E0',
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    statCard: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: components.card.borderRadius,
      padding: spacing.md,
      alignItems: 'center',
      borderColor: '#E0E0E0',
      borderWidth: 1,
    },
    statNumber: {
      fontSize: typography.h2.fontSize,
      fontWeight: 'bold',
      color: '#007AFF',
    },
    statLabel: {
      ...typography.caption,
      color: '#666',
      marginTop: spacing.xs,
    },
    recentAchievements: {
      marginBottom: spacing.md,
    },
    sectionTitle: {
      ...typography.h3,
      color: '#333',
      marginBottom: spacing.md,
    },
    recentAchievementCard: {
      backgroundColor: '#fff',
      borderRadius: components.card.borderRadius,
      padding: spacing.sm,
      marginRight: spacing.sm,
      alignItems: 'center',
      minWidth: 100,
      borderColor: '#E0E0E0',
      borderWidth: 1,
    },
    recentAchievementIcon: {
      fontSize: typography.h4.fontSize,
      marginBottom: spacing.xs,
    },
    recentAchievementName: {
      ...typography.small,
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
      marginBottom: spacing.xxs,
    },
    recentAchievementDate: {
      ...typography.xxs,
      color: '#666',
    },
    filtersContainer: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      ...platformStyles.web({
        paddingHorizontal: isDesktop() ? spacing.xl : spacing.md,
      }),
    },
    filterRow: {
      marginBottom: spacing.sm,
    },
    filterButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: 20,
      backgroundColor: '#fff',
      marginRight: spacing.xs,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      ...platformStyles.web({
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#F0F0F0',
        },
      }),
    },
    filterButtonActive: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
      ...platformStyles.web({
        ':hover': {
          backgroundColor: '#0056b3',
        },
      }),
    },
    filterButtonText: {
      ...typography.caption,
      color: '#666',
    },
    filterButtonTextActive: {
      color: '#fff',
      fontWeight: '600',
    },
    typeButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: 16,
      backgroundColor: '#fff',
      marginRight: spacing.xs,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      ...platformStyles.web({
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#F0F0F0',
        },
      }),
    },
    typeButtonActive: {
      backgroundColor: '#4CAF50',
      borderColor: '#4CAF50',
      ...platformStyles.web({
        ':hover': {
          backgroundColor: '#388E3C',
        },
      }),
    },
    typeButtonText: {
      ...typography.small,
      color: '#666',
    },
    typeButtonTextActive: {
      color: '#fff',
      fontWeight: '600',
    },
    achievementsContainer: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      ...platformStyles.web({
        paddingHorizontal: isDesktop() ? spacing.xl : spacing.md,
      }),
    },
    achievementCard: {
      backgroundColor: '#fff',
      borderRadius: components.card.borderRadius,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 2,
      borderColor: '#E0E0E0',
      ...platformStyles.web({
        transition: 'transform 0.2s ease-in-out',
        ':hover': {
          transform: 'translateY(-5px)',
        },
      }),
    },
    achievementHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    achievementIconContainer: {
      position: 'relative',
      marginRight: spacing.sm,
    },
    achievementIcon: {
      fontSize: typography.h3.fontSize,
    },
    unlockedBadge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: '#4CAF50',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    unlockedBadgeText: {
      color: '#fff',
      fontSize: typography.small.fontSize,
      fontWeight: 'bold',
    },
    achievementInfo: {
      flex: 1,
    },
    achievementName: {
      ...typography.body,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: spacing.xxs,
    },
    achievementDescription: {
      ...typography.caption,
      color: '#666',
      marginBottom: spacing.xs,
    },
    achievementMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rarityBadge: {
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xxs,
      borderRadius: 8,
      marginRight: spacing.xs,
    },
    rarityText: {
      ...typography.xxs,
      color: '#fff',
      fontWeight: '600',
    },
    pointsText: {
      ...typography.small,
      color: '#007AFF',
      fontWeight: '600',
    },
    criteriaText: {
      ...typography.caption,
      color: '#555',
      marginTop: spacing.xs,
      fontStyle: 'italic',
    },
    unlockedInfo: {
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      paddingTop: spacing.sm,
      marginTop: spacing.sm,
    },
    unlockedDate: {
      ...typography.small,
      color: '#4CAF50',
      fontWeight: '600',
    },
    unlockedValue: {
      ...typography.small,
      color: '#4CAF50',
      fontWeight: '600',
      marginTop: spacing.xxs,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.lg,
    },
    emptyText: {
      ...typography.h3,
      color: '#CCCCCC',
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    emptySubtext: {
      ...typography.body,
      color: '#AAAAAA',
      textAlign: 'center',
      lineHeight: typography.body.lineHeight,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    errorText: {
      ...typography.h3,
      color: '#F44336',
      textAlign: 'center',
      marginTop: spacing.md,
    },
    retryButton: {
      backgroundColor: '#007AFF',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: components.button.borderRadius,
      marginTop: spacing.lg,
      ...platformStyles.web({
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#0056b3',
        },
      }),
    },
    retryButtonText: {
      ...typography.buttonText,
      color: '#FFFFFF',
    },
  }), [getSafePadding]);

  if (statsLoading || conquistasLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={responsiveStyles.errorContainer}>
        <Text style={responsiveStyles.errorText}>Erro ao carregar conquistas</Text>
        <TouchableOpacity style={responsiveStyles.retryButton} onPress={onRefresh}>
          <Text style={responsiveStyles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={responsiveStyles.container}>
      <ScrollView
        style={responsiveStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        {...platformStyles.web({
          scrollBehavior: 'smooth',
        })}
      >
        {/* Estatísticas do Usuário */}
        {userStats && (
          <View style={responsiveStyles.statsContainer}>
            <View style={responsiveStyles.levelCard}>
              <View style={responsiveStyles.levelHeader}>
                <Text style={responsiveStyles.levelIcon}>{userStats.nivel_atual.icone}</Text>
                <View style={responsiveStyles.levelInfo}>
                  <Text style={responsiveStyles.levelName}>{userStats.nivel_atual.nome_exibicao}</Text>
                  <Text style={responsiveStyles.levelPoints}>{userStats.pontos_total} pontos</Text>
                </View>
              </View>
              
              {userStats.proximo_nivel && (
                <View style={responsiveStyles.progressContainer}>
                  <View style={responsiveStyles.progressHeader}>
                    <Text style={responsiveStyles.progressText}>
                      Próximo nível: {userStats.proximo_nivel.nome_exibicao}
                    </Text>
                    <Text style={responsiveStyles.progressPoints}>
                      {userStats.pontos_para_proximo_nivel} pontos restantes
                    </Text>
                  </View>
                  <View style={responsiveStyles.progressBar}>
                    <View
                      style={[
                        responsiveStyles.progressFill,
                        {
                          width: `${userStats.progresso_nivel}%`,
                          backgroundColor: userStats.nivel_atual.cor
                        }
                      ]}
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={responsiveStyles.statsGrid}>
              <View style={responsiveStyles.statCard}>
                <Text style={responsiveStyles.statNumber}>{userStats.total_conquistas_desbloqueadas}</Text>
                <Text style={responsiveStyles.statLabel}>Conquistas</Text>
              </View>
              <View style={responsiveStyles.statCard}>
                <Text style={responsiveStyles.statNumber}>{userStats.pontos_total}</Text>
                <Text style={responsiveStyles.statLabel}>Pontos</Text>
              </View>
            </View>

            {/* Conquistas Recentes */}
            {userStats.conquistas_recentes.length > 0 && (
              <View style={responsiveStyles.recentAchievements}>
                <Text style={responsiveStyles.sectionTitle}>Conquistas Recentes</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {userStats.conquistas_recentes.map((item, index) => (
                    <TouchableOpacity key={index} style={responsiveStyles.recentAchievementCard} activeOpacity={0.7}>
                      <Text style={responsiveStyles.recentAchievementIcon}>{item.conquista.icone}</Text>
                      <Text style={responsiveStyles.recentAchievementName}>{item.conquista.nome}</Text>
                      <Text style={responsiveStyles.recentAchievementDate}>
                        {formatDate(item.data_desbloqueio)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {/* Filtros */}
        <View style={responsiveStyles.filtersContainer}>
          <Text style={responsiveStyles.sectionTitle}>Conquistas</Text>
          
          <View style={responsiveStyles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['all', 'unlocked', 'locked'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    responsiveStyles.filterButton,
                    selectedFilter === filter && responsiveStyles.filterButtonActive
                  ]}
                  onPress={() => setSelectedFilter(filter as any)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    responsiveStyles.filterButtonText,
                    selectedFilter === filter && responsiveStyles.filterButtonTextActive
                  ]}>
                    {filter === 'all' ? 'Todas' : filter === 'unlocked' ? 'Desbloqueadas' : 'Bloqueadas'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={responsiveStyles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tiposConquista.map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    responsiveStyles.typeButton,
                    selectedType === tipo && responsiveStyles.typeButtonActive
                  ]}
                  onPress={() => setSelectedType(tipo)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    responsiveStyles.typeButtonText,
                    selectedType === tipo && responsiveStyles.typeButtonTextActive
                  ]}>
                    {tipo === 'all' ? 'Todos' : tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Lista de Conquistas */}
        <View style={responsiveStyles.achievementsContainer}>
          {conquistas && conquistas.length > 0 ? (
            conquistas.map((conquista) => (
              <View
                key={conquista.id}
                style={[
                  responsiveStyles.achievementCard,
                  {
                    borderColor: getRaridadeBorder(conquista.raridade),
                    opacity: conquista.desbloqueada ? 1 : 0.6
                  }
                ]}
              >
                <View style={responsiveStyles.achievementHeader}>
                  <View style={responsiveStyles.achievementIconContainer}>
                    <Text style={[
                      responsiveStyles.achievementIcon,
                      { color: conquista.cor }
                    ]}>
                      {conquista.icone}
                    </Text>
                    {conquista.desbloqueada && (
                      <View style={responsiveStyles.unlockedBadge}>
                        <Text style={responsiveStyles.unlockedBadgeText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <View style={responsiveStyles.achievementInfo}>
                    <Text style={responsiveStyles.achievementName}>{conquista.nome}</Text>
                    <Text style={responsiveStyles.achievementDescription}>{conquista.descricao}</Text>
                    <View style={responsiveStyles.achievementMeta}>
                      <View style={[
                        responsiveStyles.rarityBadge,
                        { backgroundColor: getRaridadeColor(conquista.raridade) }
                      ]}>
                        <Text style={responsiveStyles.rarityText}>{conquista.raridade}</Text>
                      </View>
                      <Text style={responsiveStyles.pointsText}>+{conquista.pontos_recompensa} pts</Text>
                    </View>
                  </View>
                </View>

                {conquista.criterio_descricao && (
                  <Text style={responsiveStyles.criteriaText}>{conquista.criterio_descricao}</Text>
                )}

                {conquista.desbloqueada && conquista.data_desbloqueio && (
                  <View style={responsiveStyles.unlockedInfo}>
                    <Text style={responsiveStyles.unlockedDate}>
                      Desbloqueada em: {formatDate(conquista.data_desbloqueio)}
                    </Text>
                    {conquista.valor_atingido && (
                      <Text style={responsiveStyles.unlockedValue}>
                        Valor atingido: {conquista.valor_atingido}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={responsiveStyles.emptyContainer}>
              <Text style={responsiveStyles.emptyText}>Nenhuma conquista encontrada</Text>
              <Text style={responsiveStyles.emptySubtext}>
                Ajuste os filtros ou continue jogando para desbloquear conquistas!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AchievementsScreenOptimized;


