import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import FormInput from '../components/FormInput';
import { layouts, typography, spacing, components, grid } from '../styles/responsive';
import { isWeb, isDesktop, platformStyles, getSafePadding } from '../utils/platformUtils';

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

const GoalsScreenOptimized: React.FC = () => {
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

  const { data: metas, isLoading, error, refetch } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get('/goals');
      return response.data.data.metas;
    }
  });

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
      if (isWeb()) {
        alert('Meta criada com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Meta criada com sucesso!');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Erro ao criar meta';
      if (isWeb()) {
        alert(message);
      } else {
        Alert.alert('Erro', message);
      }
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      await api.delete(`/goals/${goalId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      if (isWeb()) {
        alert('Meta excluída com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Meta excluída com sucesso!');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Erro ao excluir meta';
      if (isWeb()) {
        alert(message);
      } else {
        Alert.alert('Erro', message);
      }
    }
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const resetForm = useCallback(() => {
    setNewGoal({
      titulo: '',
      descricao: '',
      tipo_meta: 'Faturamento',
      periodo: 'Mensal',
      valor_objetivo: 0,
      data_inicio: new Date().toISOString().split('T')[0],
      data_fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }, []);

  const handleCreateGoal = useCallback(() => {
    if (!newGoal.titulo.trim()) {
      if (isWeb()) {
        alert('Título é obrigatório');
      } else {
        Alert.alert('Erro', 'Título é obrigatório');
      }
      return;
    }

    if (newGoal.valor_objetivo <= 0) {
      if (isWeb()) {
        alert('Valor objetivo deve ser maior que zero');
      } else {
        Alert.alert('Erro', 'Valor objetivo deve ser maior que zero');
      }
      return;
    }

    createGoalMutation.mutate(newGoal);
  }, [newGoal, createGoalMutation]);

  const handleDeleteGoal = useCallback((goalId: string, titulo: string) => {
    if (isWeb()) {
      if (confirm(`Tem certeza que deseja excluir a meta "${titulo}"?`)) {
        deleteGoalMutation.mutate(goalId);
      }
    } else {
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
    }
  }, [deleteGoalMutation]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'Ativa': return '#4CAF50';
      case 'Pausada': return '#FF9800';
      case 'Concluida': return '#2196F3';
      case 'Expirada': return '#F44336';
      default: return '#9E9E9E';
    }
  }, []);

  const getProgressColor = useCallback((percentual: number) => {
    if (percentual >= 100) return '#4CAF50';
    if (percentual >= 75) return '#8BC34A';
    if (percentual >= 50) return '#FF9800';
    if (percentual >= 25) return '#FFC107';
    return '#F44336';
  }, []);

  const formatGoalValue = useCallback((tipo: string, valor: number) => {
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
  }, []);

  const responsiveStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: layouts.dashboard.container.backgroundColor,
      paddingTop: getSafePadding().paddingTop,
    },
    scrollView: {
      flex: 1,
      padding: spacing.md,
      ...platformStyles.web({
        paddingHorizontal: isDesktop() ? spacing.xl : spacing.md,
      }),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.h2,
      color: '#333',
    },
    addButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: components.button.borderRadius,
      ...platformStyles.web({
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#0056b3',
        },
      }),
    },
    addButtonText: {
      ...typography.buttonText,
      color: '#fff',
    },
    goalCard: {
      ...components.card,
      marginBottom: spacing.md,
      padding: spacing.md,
      backgroundColor: '#fff',
      borderColor: '#E0E0E0',
      borderWidth: 1,
      ...platformStyles.web({
        transition: 'transform 0.2s ease-in-out',
        ':hover': {
          transform: 'translateY(-5px)',
        },
      }),
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    goalTitleContainer: {
      flex: 1,
      marginRight: spacing.sm,
    },
    goalTitle: {
      ...typography.h4,
      color: '#333',
      marginBottom: spacing.xs,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    statusText: {
      ...typography.small,
      color: '#fff',
      fontWeight: '600',
    },
    deleteButton: {
      padding: spacing.xs,
      ...platformStyles.web({
        cursor: 'pointer',
        ':hover': {
          opacity: 0.7,
        },
      }),
    },
    deleteButtonText: {
      fontSize: typography.body.fontSize,
    },
    goalDescription: {
      ...typography.caption,
      color: '#666',
      marginBottom: spacing.md,
    },
    goalInfo: {
      marginBottom: spacing.md,
    },
    goalType: {
      ...typography.caption,
      fontWeight: '600',
      color: '#007AFF',
      marginBottom: spacing.xs,
    },
    goalPeriod: {
      ...typography.small,
      color: '#999',
    },
    progressContainer: {
      marginBottom: spacing.sm,
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
    percentageText: {
      ...typography.caption,
      fontWeight: 'bold',
      color: '#007AFF',
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
    completionDate: {
      ...typography.small,
      color: '#4CAF50',
      fontWeight: '600',
      marginTop: spacing.xs,
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
    modalContainer: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      paddingTop: getSafePadding().paddingTop,
      ...platformStyles.web({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }),
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      backgroundColor: '#FFFFFF',
      ...platformStyles.web({
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 0,
      }),
    },
    modalTitle: {
      ...typography.h3,
      color: '#333333',
    },
    cancelButton: {
      ...typography.buttonText,
      color: '#FF3B30',
      ...platformStyles.web({
        cursor: 'pointer',
        ':hover': {
          opacity: 0.7,
        },
      }),
    },
    saveButton: {
      ...typography.buttonText,
      color: '#007AFF',
      ...platformStyles.web({
        cursor: 'pointer',
        ':hover': {
          opacity: 0.7,
        },
      }),
    },
    modalContent: {
      flex: 1,
      padding: spacing.md,
      ...platformStyles.web({
        backgroundColor: '#FFFFFF',
        borderRadius: components.card.borderRadius,
        width: '90%',
        maxWidth: 600,
        maxHeight: '90%',
        overflowY: 'auto',
        padding: spacing.lg,
      }),
    },
    inputGroup: {
      marginBottom: spacing.md,
    },
    inputLabel: {
      ...typography.body,
      fontWeight: '600',
      marginBottom: spacing.xs,
      color: '#333333',
    },
    textInput: {
      ...components.input,
      backgroundColor: '#F9F9F9',
      ...platformStyles.web({
        outline: 'none',
        ':focus': {
          borderColor: '#007AFF',
        },
      }),
    },
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    pickerContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: spacing.xs,
    },
    pickerOption: {
      backgroundColor: '#E5E5EA',
      borderRadius: components.button.borderRadius,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginRight: spacing.sm,
      marginBottom: spacing.sm,
      ...platformStyles.web({
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#D0D0D0',
        },
      }),
    },
    pickerOptionSelected: {
      backgroundColor: '#007AFF',
      ...platformStyles.web({
        ':hover': {
          backgroundColor: '#0056b3',
        },
      }),
    },
    pickerOptionText: {
      ...typography.caption,
      color: '#333333',
    },
    pickerOptionTextSelected: {
      color: '#FFFFFF',
    },
  }), [getSafePadding]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={responsiveStyles.errorContainer}>
        <Text style={responsiveStyles.errorText}>Erro ao carregar metas</Text>
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
        <View style={responsiveStyles.header}>
          <Text style={responsiveStyles.title}>Minhas Metas</Text>
          <TouchableOpacity
            style={responsiveStyles.addButton}
            onPress={() => setShowCreateModal(true)}
            activeOpacity={0.7}
          >
            <Text style={responsiveStyles.addButtonText}>+ Nova Meta</Text>
          </TouchableOpacity>
        </View>

        {metas && metas.length > 0 ? (
          metas.map((meta: Meta) => (
            <View key={meta.id} style={responsiveStyles.goalCard}>
              <View style={responsiveStyles.goalHeader}>
                <View style={responsiveStyles.goalTitleContainer}>
                  <Text style={responsiveStyles.goalTitle}>{meta.titulo}</Text>
                  <View style={[responsiveStyles.statusBadge, { backgroundColor: getStatusColor(meta.status) }]}>
                    <Text style={responsiveStyles.statusText}>{meta.status}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteGoal(meta.id, meta.titulo)}
                  style={responsiveStyles.deleteButton}
                  activeOpacity={0.7}
                >
                  <Text style={responsiveStyles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>

              {meta.descricao && (
                <Text style={responsiveStyles.goalDescription}>{meta.descricao}</Text>
              )}

              <View style={responsiveStyles.goalInfo}>
                <Text style={responsiveStyles.goalType}>{meta.tipo_meta} • {meta.periodo}</Text>
                <Text style={responsiveStyles.goalPeriod}>
                  {formatDate(meta.data_inicio)} - {formatDate(meta.data_fim)}
                </Text>
              </View>

              <View style={responsiveStyles.progressContainer}>
                <View style={responsiveStyles.progressHeader}>
                  <Text style={responsiveStyles.progressText}>
                    {formatGoalValue(meta.tipo_meta, meta.valor_atual)} / {formatGoalValue(meta.tipo_meta, meta.valor_objetivo)}
                  </Text>
                  <Text style={responsiveStyles.percentageText}>{meta.percentual_concluido}%</Text>
                </View>
                <View style={responsiveStyles.progressBar}>
                  <View
                    style={[
                      responsiveStyles.progressFill,
                      {
                        width: `${Math.min(meta.percentual_concluido, 100)}%`,
                        backgroundColor: getProgressColor(meta.percentual_concluido)
                      }
                    ]}
                  />
                </View>
              </View>

              {meta.data_conclusao && (
                <Text style={responsiveStyles.completionDate}>
                  Concluída em: {formatDate(meta.data_conclusao)}
                </Text>
              )}
            </View>
          ))
        ) : (
          <View style={responsiveStyles.emptyContainer}>
            <Text style={responsiveStyles.emptyText}>Nenhuma meta encontrada</Text>
            <Text style={responsiveStyles.emptySubtext}>
              Crie sua primeira meta para começar a acompanhar seus objetivos!
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle={isWeb() ? 'overFullScreen' : 'pageSheet'}
        onRequestClose={() => setShowCreateModal(false)}
        transparent={isWeb()}
      >
        <View style={responsiveStyles.modalContainer}>
          <View style={responsiveStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)} activeOpacity={0.7}>
              <Text style={responsiveStyles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={responsiveStyles.modalTitle}>Nova Meta</Text>
            <TouchableOpacity
              onPress={handleCreateGoal}
              disabled={createGoalMutation.isPending}
              activeOpacity={0.7}
            >
              {createGoalMutation.isPending ? (
                <LoadingSpinner size="small" color="#007AFF" />
              ) : (
                <Text style={responsiveStyles.saveButton}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={responsiveStyles.modalContent}>
            <FormInput
              label="Título *"
              value={newGoal.titulo}
              onChangeText={(text) => setNewGoal({ ...newGoal, titulo: text })}
              placeholder="Ex: Ganhar R$ 2.000 este mês"
              required
            />

            <FormInput
              label="Descrição"
              value={newGoal.descricao}
              onChangeText={(text) => setNewGoal({ ...newGoal, descricao: text })}
              placeholder="Descrição opcional da meta"
              multiline
              numberOfLines={3}
            />

            <View style={responsiveStyles.inputGroup}>
              <Text style={responsiveStyles.inputLabel}>Tipo de Meta *</Text>
              <View style={responsiveStyles.pickerContainer}>
                {['Faturamento', 'Quilometragem', 'Jornadas', 'Economia', 'Lucro'].map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      responsiveStyles.pickerOption,
                      newGoal.tipo_meta === tipo && responsiveStyles.pickerOptionSelected
                    ]}
                    onPress={() => setNewGoal({ ...newGoal, tipo_meta: tipo as any })}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      responsiveStyles.pickerOptionText,
                      newGoal.tipo_meta === tipo && responsiveStyles.pickerOptionTextSelected
                    ]}>
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={responsiveStyles.inputGroup}>
              <Text style={responsiveStyles.inputLabel}>Período *</Text>
              <View style={responsiveStyles.pickerContainer}>
                {['Semanal', 'Mensal', 'Trimestral', 'Anual'].map((periodo) => (
                  <TouchableOpacity
                    key={periodo}
                    style={[
                      responsiveStyles.pickerOption,
                      newGoal.periodo === periodo && responsiveStyles.pickerOptionSelected
                    ]}
                    onPress={() => setNewGoal({ ...newGoal, periodo: periodo as any })}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      responsiveStyles.pickerOptionText,
                      newGoal.periodo === periodo && responsiveStyles.pickerOptionTextSelected
                    ]}>
                      {periodo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <FormInput
              label="Valor Objetivo *"
              value={newGoal.valor_objetivo.toString()}
              onChangeText={(text) => {
                const numericValue = parseFloat(text) || 0;
                setNewGoal({ ...newGoal, valor_objetivo: numericValue });
              }}
              placeholder="0"
              keyboardType="numeric"
              required
            />

            <FormInput
              label="Data de Início *"
              value={newGoal.data_inicio}
              onChangeText={(text) => setNewGoal({ ...newGoal, data_inicio: text })}
              placeholder="YYYY-MM-DD"
              required
            />

            <FormInput
              label="Data de Fim *"
              value={newGoal.data_fim}
              onChangeText={(text) => setNewGoal({ ...newGoal, data_fim: text })}
              placeholder="YYYY-MM-DD"
              required
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default GoalsScreenOptimized;


