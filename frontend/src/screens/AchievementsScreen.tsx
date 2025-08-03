import React, { useState } from 'react';
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

const AchievementsScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

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

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['gamification-stats'] }),
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
    ]);
    setRefreshing(false);
  };

  const getRaridadeColor = (raridade: string) => {
    switch (raridade) {
      case 'Comum': return '#9E9E9E';
      case 'Raro': return '#2196F3';
      case 'Epico': return '#9C27B0';
      case 'Lendario': return '#FF6F00';
      default: return '#9E9E9E';
    }
  };

  const getRaridadeBorder = (raridade: string) => {
    switch (raridade) {
      case 'Comum': return '#E0E0E0';
      case 'Raro': return '#2196F3';
      case 'Epico': return '#9C27B0';
      case 'Lendario': return '#FF6F00';
      default: return '#E0E0E0';
    }
  };

  const tiposConquista = ['all', 'Faturamento', 'Quilometragem', 'Jornadas', 'Eficiencia', 'Consistencia', 'Metas', 'Especial'];

  if (statsLoading || conquistasLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar conquistas</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Estatísticas do Usuário */}
        {userStats && (
          <View style={styles.statsContainer}>
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
                          backgroundColor: userStats.nivel_atual.cor
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

            {/* Conquistas Recentes */}
            {userStats.conquistas_recentes.length > 0 && (
              <View style={styles.recentAchievements}>
                <Text style={styles.sectionTitle}>Conquistas Recentes</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {userStats.conquistas_recentes.map((item, index) => (
                    <View key={index} style={styles.recentAchievementCard}>
                      <Text style={styles.recentAchievementIcon}>{item.conquista.icone}</Text>
                      <Text style={styles.recentAchievementName}>{item.conquista.nome}</Text>
                      <Text style={styles.recentAchievementDate}>
                        {formatDate(item.data_desbloqueio)}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {/* Filtros */}
        <View style={styles.filtersContainer}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          
          <View style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['all', 'unlocked', 'locked'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter && styles.filterButtonActive
                  ]}
                  onPress={() => setSelectedFilter(filter as any)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedFilter === filter && styles.filterButtonTextActive
                  ]}>
                    {filter === 'all' ? 'Todas' : filter === 'unlocked' ? 'Desbloqueadas' : 'Bloqueadas'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tiposConquista.map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.typeButton,
                    selectedType === tipo && styles.typeButtonActive
                  ]}
                  onPress={() => setSelectedType(tipo)}
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
        </View>

        {/* Lista de Conquistas */}
        <View style={styles.achievementsContainer}>
          {conquistas && conquistas.length > 0 ? (
            conquistas.map((conquista) => (
              <View
                key={conquista.id}
                style={[
                  styles.achievementCard,
                  {
                    borderColor: getRaridadeBorder(conquista.raridade),
                    opacity: conquista.desbloqueada ? 1 : 0.6
                  }
                ]}
              >
                <View style={styles.achievementHeader}>
                  <View style={styles.achievementIconContainer}>
                    <Text style={[
                      styles.achievementIcon,
                      { color: conquista.cor }
                    ]}>
                      {conquista.icone}
                    </Text>
                    {conquista.desbloqueada && (
                      <View style={styles.unlockedBadge}>
                        <Text style={styles.unlockedBadgeText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementName}>{conquista.nome}</Text>
                    <Text style={styles.achievementDescription}>{conquista.descricao}</Text>
                    <View style={styles.achievementMeta}>
                      <View style={[
                        styles.rarityBadge,
                        { backgroundColor: getRaridadeColor(conquista.raridade) }
                      ]}>
                        <Text style={styles.rarityText}>{conquista.raridade}</Text>
                      </View>
                      <Text style={styles.pointsText}>+{conquista.pontos_recompensa} pts</Text>
                    </View>
                  </View>
                </View>

                {conquista.criterio_descricao && (
                  <Text style={styles.criteriaText}>{conquista.criterio_descricao}</Text>
                )}

                {conquista.desbloqueada && conquista.data_desbloqueio && (
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
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma conquista encontrada</Text>
              <Text style={styles.emptySubtext}>
                Ajuste os filtros ou continue jogando para desbloquear conquistas!
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
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    padding: 16,
  },
  levelCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  levelPoints: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressPoints: {
    fontSize: 12,
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
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  recentAchievements: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  recentAchievementCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentAchievementIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  recentAchievementName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  recentAchievementDate: {
    fontSize: 10,
    color: '#666',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  typeButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  achievementsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  achievementIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  achievementIcon: {
    fontSize: 32,
  },
  unlockedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  achievementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rarityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pointsText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  criteriaText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  unlockedInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    marginTop: 8,
  },
  unlockedDate: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  unlockedValue: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AchievementsScreen;

