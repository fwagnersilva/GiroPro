import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TextInput,
  Animated,
  Dimensions
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/designTokens';

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
  progresso_atual?: number;
  progresso_total?: number;
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

type FilterTab = 'all' | 'unlocked' | 'in_progress' | 'locked';

const { width: screenWidth } = Dimensions.get('window');

const AchievementsScreenImproved: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);
  const [statsAnimation] = useState(new Animated.Value(1));

  const queryClient = useQueryClient();

  // Query para buscar estatísticas do usuário
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['gamification-stats'],
    queryFn: async () => {
      const response = await api.get('/gamification/stats');
      return response.data.data as UserStats;
    }
  });

  // Query para buscar conquistas
  const { data: conquistas, isLoading: conquistasLoading, error } = useQuery({
    queryKey: ['achievements', selectedFilter, selectedType, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedFilter !== 'all') {
        if (selectedFilter === 'unlocked') {
          params.append('desbloqueada', 'true');
        } else if (selectedFilter === 'locked') {
          params.append('desbloqueada', 'false');
          params.append('progresso', '0');
        } else if (selectedFilter === 'in_progress') {
          params.append('desbloqueada', 'false');
          params.append('progresso', '>0');
        }
      }
      if (selectedType !== 'all') {
        params.append('tipo_conquista', selectedType);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      const response = await api.get(`/gamification/achievements?${params.toString()}`);
      return response.data.data.conquistas as Conquista[];
    }
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['gamification-stats'] }),
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
    ]);
    setRefreshing(false);
  };

  const toggleStatsCollapse = () => {
    const toValue = isStatsCollapsed ? 1 : 0;
    setIsStatsCollapsed(!isStatsCollapsed);
    
    Animated.timing(statsAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getRaridadeColors = (raridade: string) => {
    switch (raridade) {
      case 'Comum': 
        return {
          border: colors.neutral[400],
          background: colors.neutral[100],
          text: colors.neutral[700]
        };
      case 'Raro': 
        return {
          border: colors.primary[500],
          background: colors.primary[50],
          text: colors.primary[700]
        };
      case 'Epico': 
        return {
          border: colors.secondary[500],
          background: colors.secondary[50],
          text: colors.secondary[700]
        };
      case 'Lendario': 
        return {
          border: colors.warning[500],
          background: colors.warning[50],
          text: colors.warning[700]
        };
      default: 
        return {
          border: colors.neutral[400],
          background: colors.neutral[100],
          text: colors.neutral[700]
        };
    }
  };

  const getAchievementStatus = (conquista: Conquista): 'unlocked' | 'in_progress' | 'locked' => {
    if (conquista.desbloqueada) return 'unlocked';
    if (conquista.progresso_atual && conquista.progresso_atual > 0) return 'in_progress';
    return 'locked';
  };

  const getFilteredConquistas = () => {
    if (!conquistas) return [];
    
    return conquistas.filter(conquista => {
      const status = getAchievementStatus(conquista);
      
      if (selectedFilter !== 'all' && selectedFilter !== status) {
        return false;
      }
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return conquista.nome.toLowerCase().includes(query) ||
               conquista.descricao.toLowerCase().includes(query);
      }
      
      return true;
    });
  };

  const getFilterCount = (filter: FilterTab): number => {
    if (!conquistas) return 0;
    
    if (filter === 'all') return conquistas.length;
    
    return conquistas.filter(conquista => {
      const status = getAchievementStatus(conquista);
      return status === filter;
    }).length;
  };

  const tiposConquista = ['all', 'Faturamento', 'Quilometragem', 'Jornadas', 'Eficiencia', 'Consistencia', 'Metas', 'Especial'];

  const renderAchievementCard = (conquista: Conquista) => {
    const status = getAchievementStatus(conquista);
    const raridadeColors = getRaridadeColors(conquista.raridade);
    const progressPercentage = conquista.progresso_total ? 
      ((conquista.progresso_atual || 0) / conquista.progresso_total) * 100 : 0;

    return (
      <TouchableOpacity
        key={conquista.id}
        style={[
          styles.achievementCard,
          {
            borderColor: raridadeColors.border,
            opacity: status === 'locked' ? 0.7 : 1,
          }
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Conquista ${conquista.nome}. ${conquista.descricao}. ${
          status === 'unlocked' ? 'Desbloqueada' : 
          status === 'in_progress' ? `Em progresso: ${Math.round(progressPercentage)}%` : 
          'Bloqueada'
        }`}
        accessibilityHint={status === 'locked' ? 'Toque para ver os requisitos' : 'Toque para ver detalhes'}
      >
        <View style={styles.achievementHeader}>
          <View style={styles.achievementIconContainer}>
            <View style={[
              styles.achievementIconBackground,
              { backgroundColor: raridadeColors.background }
            ]}>
              <Text style={[
                styles.achievementIcon,
                { color: raridadeColors.text }
              ]}>
                {conquista.icone}
              </Text>
            </View>
            {status === 'unlocked' && (
              <View style={styles.unlockedBadge}>
                <Text style={styles.unlockedBadgeText}>✓</Text>
              </View>
            )}
            {status === 'locked' && (
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedBadgeText}>🔒</Text>
              </View>
            )}
          </View>
          
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementName}>{conquista.nome}</Text>
            <Text style={styles.achievementDescription}>{conquista.descricao}</Text>
            
            <View style={styles.achievementMeta}>
              <View style={[
                styles.rarityBadge,
                { backgroundColor: raridadeColors.border }
              ]}>
                <Text style={styles.rarityText}>{conquista.raridade}</Text>
              </View>
              <Text style={styles.pointsText}>+{conquista.pontos_recompensa} pts</Text>
            </View>
          </View>
        </View>

        {status === 'in_progress' && conquista.progresso_total && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                Progresso: {conquista.progresso_atual || 0} / {conquista.progresso_total}
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.round(progressPercentage)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor: raridadeColors.border
                  }
                ]}
              />
            </View>
          </View>
        )}

        {conquista.criterio_descricao && (
          <Text style={styles.criteriaText}>{conquista.criterio_descricao}</Text>
        )}

        {status === 'unlocked' && conquista.data_desbloqueio && (
          <View style={styles.unlockedInfo}>
            <Text style={styles.unlockedDate}>
              Desbloqueada em: {formatDate(conquista.data_desbloqueio)}
            </Text>
            {conquista.valor_atingido && (
              <Text style={styles.unlockedValue}>
                Valor atingido: {conquista.valor_atingido}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (statsLoading || conquistasLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar conquistas</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={onRefresh}
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
        >
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredConquistas = getFilteredConquistas();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Estatísticas do Usuário - Colapsável */}
        {userStats && (
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statsHeader}
              onPress={toggleStatsCollapse}
              accessibilityRole="button"
              accessibilityLabel={`Estatísticas do usuário. ${isStatsCollapsed ? 'Expandir' : 'Recolher'}`}
            >
              <Text style={styles.statsTitle}>Meu Progresso</Text>
              <Text style={styles.collapseIcon}>
                {isStatsCollapsed ? '▼' : '▲'}
              </Text>
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.statsContent,
                {
                  height: statsAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200], // Altura aproximada do conteúdo
                  }),
                  opacity: statsAnimation,
                }
              ]}
            >
              <View style={styles.levelCard}>
                <View style={styles.levelHeader}>
                  <Text style={styles.levelIcon}>{userStats.nivel_atual.icone}</Text>
                  <View style={styles.levelInfo}>
                    <Text style={styles.levelName}>{userStats.nivel_atual.nome_exibicao}</Text>
                    <Text style={styles.levelPoints}>{userStats.pontos_total} pontos</Text>
                  </View>
                </View>
                
                {userStats.proximo_nivel && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressText}>
                        Próximo nível: {userStats.proximo_nivel.nome_exibicao}
                      </Text>
                      <Text style={styles.progressPoints}>
                        {userStats.pontos_para_proximo_nivel} pontos restantes
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${userStats.progresso_nivel}%`,
                            backgroundColor: colors.primary[500]
                          }
                        ]}
                      />
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{userStats.total_conquistas_desbloqueadas}</Text>
                  <Text style={styles.statLabel}>Conquistas</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{userStats.pontos_total}</Text>
                  <Text style={styles.statLabel}>Pontos</Text>
                </View>
              </View>
            </Animated.View>
          </View>
        )}

        {/* Barra de Busca */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar conquistas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Campo de busca de conquistas"
            accessibilityHint="Digite para buscar conquistas por nome ou descrição"
          />
        </View>

        {/* Filtros em Tabs */}
        <View style={styles.filtersContainer}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          
          <View style={styles.tabsContainer}>
            {(['all', 'unlocked', 'in_progress', 'locked'] as FilterTab[]).map((filter) => {
              const count = getFilterCount(filter);
              const isActive = selectedFilter === filter;
              
              return (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.tabButton,
                    isActive && styles.tabButtonActive
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={`Filtro ${
                    filter === 'all' ? 'Todas' : 
                    filter === 'unlocked' ? 'Desbloqueadas' : 
                    filter === 'in_progress' ? 'Em Progresso' :
                    'Bloqueadas'
                  }. ${count} conquistas`}
                >
                  <Text style={[
                    styles.tabButtonText,
                    isActive && styles.tabButtonTextActive
                  ]}>
                    {filter === 'all' ? 'Todas' : 
                     filter === 'unlocked' ? 'Desbloqueadas' : 
                     filter === 'in_progress' ? 'Em Progresso' :
                     'Bloqueadas'}
                  </Text>
                  <Text style={[
                    styles.tabCount,
                    isActive && styles.tabCountActive
                  ]}>
                    {count}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Filtros por Tipo */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeFiltersContainer}>
            {tiposConquista.map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[
                  styles.typeButton,
                  selectedType === tipo && styles.typeButtonActive
                ]}
                onPress={() => setSelectedType(tipo)}
                accessibilityRole="button"
                accessibilityLabel={`Filtrar por tipo: ${tipo === 'all' ? 'Todos' : tipo}`}
              >
                <Text style={[
                  styles.typeButtonText,
                  selectedType === tipo && styles.typeButtonTextActive
                ]}>
                  {tipo === 'all' ? 'Todos' : tipo}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de Conquistas */}
        <View style={styles.achievementsContainer}>
          {filteredConquistas.length > 0 ? (
            filteredConquistas.map(renderAchievementCard)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhuma conquista encontrada' : 'Nenhuma conquista nesta categoria'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 
                  'Tente ajustar sua busca ou limpar os filtros' :
                  'Continue jogando para desbloquear conquistas!'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  
  // Estatísticas
  statsContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  statsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
  },
  collapseIcon: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[600],
  },
  statsContent: {
    overflow: 'hidden',
  },
  levelCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  levelIcon: {
    fontSize: 40,
    marginRight: spacing.lg,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
  },
  levelPoints: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[900],
  },
  progressPoints: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[600],
  },
  progressPercentage: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary[600],
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.neutral[200],
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  statNumber: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },

  // Busca
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    ...shadows.sm,
  },

  // Filtros
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    marginBottom: spacing.md,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    minHeight: 44, // Acessibilidade - touch target mínimo
  },
  tabButtonActive: {
    backgroundColor: colors.primary[500],
    ...shadows.sm,
  },
  tabButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[700],
    textAlign: 'center',
  },
  tabButtonTextActive: {
    color: colors.neutral[0],
    fontWeight: typography.fontWeight.semibold,
  },
  tabCount: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
    marginTop: 2,
  },
  tabCountActive: {
    color: colors.neutral[200],
  },
  typeFiltersContainer: {
    marginTop: spacing.sm,
  },
  typeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral[0],
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    minHeight: 44, // Acessibilidade - touch target mínimo
    justifyContent: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.success[500],
    borderColor: colors.success[500],
  },
  typeButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[700],
    fontWeight: typography.fontWeight.medium,
  },
  typeButtonTextActive: {
    color: colors.neutral[0],
    fontWeight: typography.fontWeight.semibold,
  },

  // Conquistas
  achievementsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  achievementCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    ...shadows.md,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  achievementIconContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  achievementIconBackground: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 28,
  },
  unlockedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.success[500],
    borderRadius: borderRadius.full,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedBadgeText: {
    color: colors.neutral[0],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  lockedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.neutral[500],
    borderRadius: borderRadius.full,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedBadgeText: {
    fontSize: 10,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  achievementDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  achievementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rarityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  rarityText: {
    color: colors.neutral[0],
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  pointsText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.semibold,
  },
  criteriaText: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  unlockedInfo: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  unlockedDate: {
    fontSize: typography.fontSize.xs,
    color: colors.success[600],
    fontWeight: typography.fontWeight.semibold,
  },
  unlockedValue: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },

  // Estados vazios e erro
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[500],
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    textAlign: 'center',
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.error[500],
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    minHeight: 44, // Acessibilidade - touch target mínimo
    justifyContent: 'center',
  },
  retryButtonText: {
    color: colors.neutral[0],
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.base,
  },
});

export default AchievementsScreenImproved;

