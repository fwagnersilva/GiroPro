import React, { useState, useEffect } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';

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

const GoalsScreen: React.FC = () => {
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
      case 'Ativa': return '#4CAF50';
      case 'Pausada': return '#FF9800';
      case 'Concluida': return '#2196F3';
      case 'Expirada': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getProgressColor = (percentual: number) => {
    if (percentual >= 100) return '#4CAF50';
    if (percentual >= 75) return '#8BC34A';
    if (percentual >= 50) return '#FF9800';
    if (percentual >= 25) return '#FFC107';
    return '#F44336';
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar metas</Text>
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
        <View style={styles.header}>
          <Text style={styles.title}>Minhas Metas</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.addButtonText}>+ Nova Meta</Text>
          </TouchableOpacity>
        </View>

        {metas && metas.length > 0 ? (
          metas.map((meta: Meta) => (
            <View key={meta.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalTitleContainer}>
                  <Text style={styles.goalTitle}>{meta.titulo}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(meta.status) }]}>
                    <Text style={styles.statusText}>{meta.status}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteGoal(meta.id, meta.titulo)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>

              {meta.descricao && (
                <Text style={styles.goalDescription}>{meta.descricao}</Text>
              )}

              <View style={styles.goalInfo}>
                <Text style={styles.goalType}>{meta.tipo_meta} • {meta.periodo}</Text>
                <Text style={styles.goalPeriod}>
                  {formatDate(meta.data_inicio)} - {formatDate(meta.data_fim)}
                </Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressText}>
                    {formatGoalValue(meta.tipo_meta, meta.valor_atual)} / {formatGoalValue(meta.tipo_meta, meta.valor_objetivo)}
                  </Text>
                  <Text style={styles.percentageText}>{meta.percentual_concluido}%</Text>
                </View>
                <View style={styles.progressBar}>
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
                <Text style={styles.completionDate}>
                  Concluída em: {formatDate(meta.data_conclusao)}
                </Text>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma meta encontrada</Text>
            <Text style={styles.emptySubtext}>
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
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova Meta</Text>
            <TouchableOpacity
              onPress={handleCreateGoal}
              disabled={createGoalMutation.isPending}
            >
              {createGoalMutation.isPending ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={styles.saveButton}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título *</Text>
              <TextInput
                style={styles.textInput}
                value={newGoal.titulo}
                onChangeText={(text) => setNewGoal({ ...newGoal, titulo: text })}
                placeholder="Ex: Ganhar R$ 2.000 este mês"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newGoal.descricao}
                onChangeText={(text) => setNewGoal({ ...newGoal, descricao: text })}
                placeholder="Descrição opcional da meta"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo de Meta *</Text>
              <View style={styles.pickerContainer}>
                {['Faturamento', 'Quilometragem', 'Jornadas', 'Economia', 'Lucro'].map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.pickerOption,
                      newGoal.tipo_meta === tipo && styles.pickerOptionSelected
                    ]}
                    onPress={() => setNewGoal({ ...newGoal, tipo_meta: tipo })}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      newGoal.tipo_meta === tipo && styles.pickerOptionTextSelected
                    ]}>
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Período *</Text>
              <View style={styles.pickerContainer}>
                {['Semanal', 'Mensal', 'Trimestral', 'Anual'].map((periodo) => (
                  <TouchableOpacity
                    key={periodo}
                    style={[
                      styles.pickerOption,
                      newGoal.periodo === periodo && styles.pickerOptionSelected
                    ]}
                    onPress={() => setNewGoal({ ...newGoal, periodo })}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      newGoal.periodo === periodo && styles.pickerOptionTextSelected
                    ]}>
                      {periodo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Valor Objetivo *</Text>
              <TextInput
                style={styles.textInput}
                value={newGoal.valor_objetivo.toString()}
                onChangeText={(text) => {
                  const numericValue = parseFloat(text) || 0;
                  setNewGoal({ ...newGoal, valor_objetivo: numericValue });
                }}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Data de Início *</Text>
              <TextInput
                style={styles.textInput}
                value={newGoal.data_inicio}
                onChangeText={(text) => setNewGoal({ ...newGoal, data_inicio: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Data de Fim *</Text>
              <TextInput
                style={styles.textInput}
                value={newGoal.data_fim}
                onChangeText={(text) => setNewGoal({ ...newGoal, data_fim: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  goalTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  goalInfo: {
    marginBottom: 16,
  },
  goalType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  goalPeriod: {
    fontSize: 12,
    color: '#999',
  },
  progressContainer: {
    marginBottom: 8,
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
  percentageText: {
    fontSize: 14,
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
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 8,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    color: '#F44336',
    fontSize: 16,
  },
  saveButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  pickerOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#666',
  },
  pickerOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default GoalsScreen;

