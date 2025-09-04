import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import { InteractiveButton, InteractiveCard } from '../components/InteractiveComponents';
import { TrashIcon, PlusIcon, TargetIcon, MoneyIcon, RoadIcon, CarIcon, BulbIcon, ChartIcon } from '../components/EnhancedIcons';
import FormInput, { validators, combineValidators } from '../components/FormInput';
import { lightTheme } from '../theme/enhancedTokens';

interface Meta {
  id: string;
  titulo: string;
  descricao?: string;
  tipo_meta: 'Faturamento' | 'Quilometragem' | 'Jornadas' | 'Economia' | 'Lucro';
  periodo: 'Semanal' | 'Mensal' | 'Trimestral' | 'Anual';
  valor_objetivo: number;
  valor_atual: number;
  percentual_concluido: number;
  status: 'Ativa' | 'Pausada' | 'Concluida' | 'Expirada';
  data_inicio: string;
  data_fim: string;
  data_conclusao?: string;
}

interface CreateGoalData {
  titulo: string;
  descricao?: string;
  tipo_meta: string;
  periodo: string;
  valor_objetivo: number;
  data_inicio: string;
  data_fim: string;
}

const GoalsScreenRefactored: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState<CreateGoalData>({
    titulo: '',
    descricao: '',
    tipo_meta: 'Faturamento',
    periodo: 'Mensal',
    valor_objetivo: 0,
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const queryClient = useQueryClient();
  const theme = lightTheme;

  // Query para buscar metas
  const { data: metas, isLoading, error } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get('/goals');
      return response.data.data.metas;
    }
  });

  // Mutation para criar meta
  const createGoalMutation = useMutation({
    mutationFn: async (goalData: CreateGoalData) => {
      const response = await api.post('/goals', {
        ...goalData,
        valor_objetivo: Math.round(goalData.valor_objetivo * 100), // Converter para centavos
        data_inicio: new Date(goalData.data_inicio).toISOString(),
        data_fim: new Date(goalData.data_fim).toISOString()
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setShowCreateModal(false);
      resetForm();
      Alert.alert('Sucesso', 'Meta criada com sucesso!');
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.response?.data?.error?.message || 'Erro ao criar meta');
    }
  });

  // Mutation para deletar meta
  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      await api.delete(`/goals/${goalId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      Alert.alert('Sucesso', 'Meta excluída com sucesso!');
    },
    onError: (error: any) => {
      Alert.alert('Erro', error.response?.data?.error?.message || 'Erro ao excluir meta');
    }
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['goals'] });
    setRefreshing(false);
  };

  const resetForm = () => {
    setNewGoal({
      titulo: '',
      descricao: '',
      tipo_meta: 'Faturamento',
      periodo: 'Mensal',
      valor_objetivo: 0,
      data_inicio: new Date().toISOString().split('T')[0],
      data_fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const handleCreateGoal = () => {
    if (!newGoal.titulo.trim()) {
      Alert.alert('Erro', 'Título é obrigatório');
      return;
    }

    if (newGoal.valor_objetivo <= 0) {
      Alert.alert('Erro', 'Valor objetivo deve ser maior que zero');
      return;
    }

    createGoalMutation.mutate(newGoal);
  };

  const handleDeleteGoal = (goalId: string, titulo: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a meta "${titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteGoalMutation.mutate(goalId)
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativa': return theme.colors.success;
      case 'Pausada': return theme.colors.warning;
      case 'Concluida': return theme.colors.info;
      case 'Expirada': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const getProgressColor = (percentual: number) => {
    if (percentual >= 100) return theme.colors.success;
    if (percentual >= 75) return theme.colors.successLight;
    if (percentual >= 50) return theme.colors.warning;
    if (percentual >= 25) return theme.colors.warningLight;
    return theme.colors.error;
  };

  const formatGoalValue = (tipo: string, valor: number) => {
    switch (tipo) {
      case 'Faturamento':
      case 'Economia':
      case 'Lucro':
        return formatCurrency(valor / 100); // Converter de centavos
      case 'Quilometragem':
        return `${valor} km`;
      case 'Jornadas':
        return `${valor} jornadas`;
      default:
        return valor.toString();
    }
  };

  const getGoalTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'Faturamento':
      case 'Lucro':
        return <MoneyIcon size={20} />;
      case 'Quilometragem':
        return <RoadIcon size={20} />;
      case 'Jornadas':
        return <CarIcon size={20} />;
      case 'Economia':
        return <BulbIcon size={20} />;
      default:
        return <ChartIcon size={20} />;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>Erro ao carregar metas</Text>
        <InteractiveButton
          variant="outline"
          onPress={onRefresh}
        >
          Tentar Novamente
        </InteractiveButton>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <TargetIcon size={28} />
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Minhas Metas</Text>
          </View>
          <InteractiveButton
            variant="primary"
            size="sm"
            onPress={() => setShowCreateModal(true)}
          >
            <PlusIcon size={16} />
            <Text style={[styles.addButtonText, { marginLeft: theme.spacing[2] }]}>Nova Meta</Text>
          </InteractiveButton>
        </View>

        {metas && metas.length > 0 ? (
          metas.map((meta: Meta) => (
            <InteractiveCard
              key={meta.id}
              style={styles.goalCard}
              variant="elevated"
            >
              <View style={styles.goalHeader}>
                <View style={styles.goalTitleContainer}>
                  <View style={styles.goalTitleRow}>
                    {getGoalTypeIcon(meta.tipo_meta)}
                    <Text style={[styles.goalTitle, { color: theme.colors.textPrimary }]}>
                      {meta.titulo}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(meta.status) }]}>
                    <Text style={[styles.statusText, { color: theme.colors.textOnPrimary }]}>
                      {meta.status}
                    </Text>
                  </View>
                </View>
                <TrashIcon
                  size={20}
                  onPress={() => handleDeleteGoal(meta.id, meta.titulo)}
                />
              </View>

              {meta.descricao && (
                <Text style={[styles.goalDescription, { color: theme.colors.textSecondary }]}>
                  {meta.descricao}
                </Text>
              )}

              <View style={styles.goalInfo}>
                <Text style={[styles.goalType, { color: theme.colors.textPrimary }]}>
                  {meta.tipo_meta} • {meta.periodo}
                </Text>
                <Text style={[styles.goalPeriod, { color: theme.colors.textSecondary }]}>
                  {formatDate(meta.data_inicio)} - {formatDate(meta.data_fim)}
                </Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressText, { color: theme.colors.textPrimary }]}>
                    {formatGoalValue(meta.tipo_meta, meta.valor_atual)} / {formatGoalValue(meta.tipo_meta, meta.valor_objetivo)}
                  </Text>
                  <Text style={[styles.percentageText, { color: theme.colors.primary }]}>
                    {meta.percentual_concluido}%
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(meta.percentual_concluido, 100)}%`,
                        backgroundColor: getProgressColor(meta.percentual_concluido)
                      }
                    ]}
                  />
                </View>
              </View>

              {meta.data_conclusao && (
                <Text style={[styles.completionDate, { color: theme.colors.success }]}>
                  Concluída em: {formatDate(meta.data_conclusao)}
                </Text>
              )}
            </InteractiveCard>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <TargetIcon size={48} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.colors.textPrimary }]}>
              Nenhuma meta encontrada
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              Crie sua primeira meta para começar a acompanhar seus objetivos!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Criação de Meta */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <InteractiveButton
              variant="ghost"
              size="sm"
              onPress={() => setShowCreateModal(false)}
            >
              Cancelar
            </InteractiveButton>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Nova Meta</Text>
            <InteractiveButton
              variant="primary"
              size="sm"
              onPress={handleCreateGoal}
              disabled={createGoalMutation.isPending}
            >
              {createGoalMutation.isPending ? (
                <ActivityIndicator size="small" color={theme.colors.textOnPrimary} />
              ) : (
                'Salvar'
              )}
            </InteractiveButton>
          </View>

          <ScrollView style={styles.modalContent}>
            <FormInput
              label="Título"
              required
              value={newGoal.titulo}
              onChangeText={(text) => setNewGoal({ ...newGoal, titulo: text })}
              placeholder="Ex: Ganhar R$ 2.000 este mês"
              validation={validators.required}
            />

            <FormInput
              label="Descrição"
              value={newGoal.descricao}
              onChangeText={(text) => setNewGoal({ ...newGoal, descricao: text })}
              placeholder="Descrição opcional da meta"
              multiline
              numberOfLines={3}
            />

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Tipo de Meta *
              </Text>
              <View style={styles.pickerContainer}>
                {['Faturamento', 'Quilometragem', 'Jornadas', 'Economia', 'Lucro'].map((tipo) => (
                  <InteractiveButton
                    key={tipo}
                    variant={newGoal.tipo_meta === tipo ? 'primary' : 'outline'}
                    size="sm"
                    style={styles.pickerOption}
                    onPress={() => setNewGoal({ ...newGoal, tipo_meta: tipo })}
                  >
                    {tipo}
                  </InteractiveButton>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Período *
              </Text>
              <View style={styles.pickerContainer}>
                {['Semanal', 'Mensal', 'Trimestral', 'Anual'].map((periodo) => (
                  <InteractiveButton
                    key={periodo}
                    variant={newGoal.periodo === periodo ? 'primary' : 'outline'}
                    size="sm"
                    style={styles.pickerOption}
                    onPress={() => setNewGoal({ ...newGoal, periodo })}
                  >
                    {periodo}
                  </InteractiveButton>
                ))}
              </View>
            </View>

            <FormInput
              label="Valor Objetivo"
              required
              value={newGoal.valor_objetivo.toString()}
              onChangeText={(text) => {
                const numericValue = parseFloat(text) || 0;
                setNewGoal({ ...newGoal, valor_objetivo: numericValue });
              }}
              placeholder="0"
              keyboardType="numeric"
              validation={validators.positiveNumber}
            />

            <FormInput
              label="Data de Início"
              required
              value={newGoal.data_inicio}
              onChangeText={(text) => setNewGoal({ ...newGoal, data_inicio: text })}
              placeholder="YYYY-MM-DD"
            />

            <FormInput
              label="Data de Fim"
              required
              value={newGoal.data_fim}
              onChangeText={(text) => setNewGoal({ ...newGoal, data_fim: text })}
              placeholder="YYYY-MM-DD"
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: lightTheme.spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: lightTheme.spacing[5],
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: lightTheme.typography.fontSize['2xl'],
    fontWeight: lightTheme.typography.fontWeight.bold,
    marginLeft: lightTheme.spacing[2],
  },
  addButtonText: {
    color: lightTheme.colors.textOnPrimary,
    fontWeight: lightTheme.typography.fontWeight.medium,
  },
  goalCard: {
    marginBottom: lightTheme.spacing[4],
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: lightTheme.spacing[2],
  },
  goalTitleContainer: {
    flex: 1,
    marginRight: lightTheme.spacing[2],
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing[1],
  },
  goalTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontWeight: lightTheme.typography.fontWeight.bold,
    marginLeft: lightTheme.spacing[2],
  },
  statusBadge: {
    paddingHorizontal: lightTheme.spacing[2],
    paddingVertical: lightTheme.spacing[1],
    borderRadius: lightTheme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: lightTheme.typography.fontSize.xs,
    fontWeight: lightTheme.typography.fontWeight.semibold,
  },
  goalDescription: {
    fontSize: lightTheme.typography.fontSize.sm,
    marginBottom: lightTheme.spacing[3],
  },
  goalInfo: {
    marginBottom: lightTheme.spacing[4],
  },
  goalType: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: lightTheme.typography.fontWeight.semibold,
    marginBottom: lightTheme.spacing[1],
  },
  goalPeriod: {
    fontSize: lightTheme.typography.fontSize.xs,
  },
  progressContainer: {
    marginBottom: lightTheme.spacing[2],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: lightTheme.spacing[2],
  },
  progressText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: lightTheme.typography.fontWeight.medium,
  },
  percentageText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: lightTheme.typography.fontWeight.bold,
  },
  progressBar: {
    height: 8,
    borderRadius: lightTheme.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: lightTheme.borderRadius.full,
  },
  completionDate: {
    fontSize: lightTheme.typography.fontSize.xs,
    fontWeight: lightTheme.typography.fontWeight.medium,
    marginTop: lightTheme.spacing[2],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: lightTheme.spacing[12],
  },
  emptyText: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontWeight: lightTheme.typography.fontWeight.semibold,
    marginTop: lightTheme.spacing[4],
    marginBottom: lightTheme.spacing[2],
  },
  emptySubtext: {
    fontSize: lightTheme.typography.fontSize.sm,
    textAlign: 'center',
    paddingHorizontal: lightTheme.spacing[8],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: lightTheme.spacing[4],
  },
  errorText: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontWeight: lightTheme.typography.fontWeight.medium,
    marginBottom: lightTheme.spacing[4],
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: lightTheme.spacing[4],
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontWeight: lightTheme.typography.fontWeight.bold,
  },
  modalContent: {
    flex: 1,
    padding: lightTheme.spacing[4],
  },
  inputGroup: {
    marginBottom: lightTheme.spacing[4],
  },
  inputLabel: {
    fontSize: lightTheme.typography.fontSize.base,
    fontWeight: lightTheme.typography.fontWeight.medium,
    marginBottom: lightTheme.spacing[2],
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: lightTheme.spacing[2],
  },
  pickerOption: {
    marginRight: lightTheme.spacing[2],
    marginBottom: lightTheme.spacing[2],
  },
});

export default GoalsScreenRefactored;

