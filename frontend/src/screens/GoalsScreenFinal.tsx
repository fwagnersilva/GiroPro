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
  ActivityIndicator,
  Animated,
  Platform,
  Dimensions
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedProgressBar from '../components/AnimatedProgressBar';
import { 
  TrashIcon, 
  PlusIcon, 
  TargetIcon, 
  WarningIcon,
  getGoalTypeIcon,
  getStatusIcon 
} from '../components/Icons';
import { lightTheme, spacing, borderRadius, shadows, typography } from '../theme/tokens';

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

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;
const theme = lightTheme;

const GoalsScreenFinal: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
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

  // Animação de entrada
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

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
        valor_objetivo: Math.round(goalData.valor_objetivo * 100),
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
      case 'Concluida': return theme.colors.primary;
      case 'Expirada': return theme.colors.error;
      default: return theme.colors.textTertiary;
    }
  };

  const formatGoalValue = (tipo: string, valor: number) => {
    switch (tipo) {
      case 'Faturamento':
      case 'Economia':
      case 'Lucro':
        return formatCurrency(valor / 100);
      case 'Quilometragem':
        return `${valor} km`;
      case 'Jornadas':
        return `${valor} jornadas`;
      default:
        return valor.toString();
    }
  };

  const renderGoalCard = (meta: Meta, index: number) => {
    const cardAnimValue = new Animated.Value(0);
    
    Animated.timing(cardAnimValue, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View
        key={meta.id}
        style={[
          styles.goalCard,
          {
            opacity: cardAnimValue,
            transform: [{
              translateY: cardAnimValue.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          },
        ]}
      >
        <View style={styles.goalHeader}>
          <View style={styles.goalTitleSection}>
            <View style={styles.goalTitleRow}>
              <View style={styles.goalTypeIconContainer}>
                {getGoalTypeIcon(meta.tipo_meta, 28)}
              </View>
              <View style={styles.goalTitleContainer}>
                <Text style={styles.goalTitle} numberOfLines={2}>
                  {meta.titulo}
                </Text>
                <View style={styles.goalMetaInfo}>
                  <Text style={styles.goalType}>
                    {meta.tipo_meta}
                  </Text>
                  <Text style={styles.goalPeriod}>
                    • {meta.periodo}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.statusRow}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(meta.status) }]}>
                {getStatusIcon(meta.status, 14)}
                <Text style={styles.statusText}>{meta.status}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={() => handleDeleteGoal(meta.id, meta.titulo)}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <TrashIcon size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {meta.descricao && (
          <Text style={styles.goalDescription} numberOfLines={2}>
            {meta.descricao}
          </Text>
        )}

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progresso</Text>
            <Text style={styles.percentageText}>
              {meta.percentual_concluido}%
            </Text>
          </View>
          
          <AnimatedProgressBar
            progress={meta.percentual_concluido}
            height={10}
            style={styles.progressBar}
          />
          
          <View style={styles.progressValues}>
            <Text style={styles.progressText}>
              {formatGoalValue(meta.tipo_meta, meta.valor_atual)}
            </Text>
            <Text style={styles.progressTarget}>
              de {formatGoalValue(meta.tipo_meta, meta.valor_objetivo)}
            </Text>
          </View>
        </View>

        <View style={styles.goalFooter}>
          <Text style={styles.goalDates}>
            {formatDate(meta.data_inicio)} - {formatDate(meta.data_fim)}
          </Text>
          {meta.data_conclusao && (
            <Text style={styles.completionDate}>
              Concluída em {formatDate(meta.data_conclusao)}
            </Text>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
      <View style={styles.emptyIconContainer}>
        <TargetIcon size={60} />
      </View>
      <Text style={styles.emptyTitle}>Nenhuma meta criada</Text>
      <Text style={styles.emptySubtext}>
        Defina seus objetivos e acompanhe seu progresso de forma visual e organizada. 
        Metas claras ajudam você a alcançar melhores resultados!
      </Text>
      <TouchableOpacity
        style={styles.emptyActionButton}
        onPress={() => setShowCreateModal(true)}
      >
        <PlusIcon size={20} />
        <Text style={styles.emptyActionText}>Criar primeira meta</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner text="Carregando suas metas..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <WarningIcon size={60} />
        <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
        <Text style={styles.errorText}>
          Não foi possível carregar suas metas. Verifique sua conexão e tente novamente.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleSection}>
            <Text style={styles.title}>Minhas Metas</Text>
            {metas && metas.length > 0 && (
              <Text style={styles.subtitle}>
                {metas.length} {metas.length === 1 ? 'meta' : 'metas'} criada{metas.length === 1 ? '' : 's'}
              </Text>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateModal(true)}
          >
            <PlusIcon size={18} />
            <Text style={styles.addButtonText}>Nova Meta</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {metas && metas.length > 0 ? (
          <View style={styles.goalsGrid}>
            {metas.map((meta: Meta, index: number) => renderGoalCard(meta, index))}
          </View>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>

      {/* Modal de Criação de Meta - Versão Melhorada */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowCreateModal(false)}
              style={styles.modalCancelButton}
            >
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Nova Meta</Text>
            
            <TouchableOpacity
              onPress={handleCreateGoal}
              disabled={createGoalMutation.isPending}
              style={[
                styles.modalSaveButton,
                createGoalMutation.isPending && styles.modalSaveButtonDisabled
              ]}
            >
              {createGoalMutation.isPending ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Text style={styles.saveButton}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Título */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Título <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  !newGoal.titulo.trim() && styles.textInputError
                ]}
                value={newGoal.titulo}
                onChangeText={(text) => setNewGoal({ ...newGoal, titulo: text })}
                placeholder="Ex: Ganhar R$ 2.000 este mês"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newGoal.descricao}
                onChangeText={(text) => setNewGoal({ ...newGoal, descricao: text })}
                placeholder="Adicione uma descrição para sua meta (opcional)"
                placeholderTextColor={theme.colors.textTertiary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Tipo de Meta */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Tipo de Meta <Text style={styles.required}>*</Text>
              </Text>
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
                    <View style={styles.pickerOptionIcon}>
                      {getGoalTypeIcon(tipo, 18)}
                    </View>
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

            {/* Período */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Período <Text style={styles.required}>*</Text>
              </Text>
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

            {/* Valor Objetivo */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Valor Objetivo <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  newGoal.valor_objetivo <= 0 && styles.textInputError
                ]}
                value={newGoal.valor_objetivo.toString()}
                onChangeText={(text) => {
                  const numericValue = parseFloat(text) || 0;
                  setNewGoal({ ...newGoal, valor_objetivo: numericValue });
                }}
                placeholder="0"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="numeric"
              />
            </View>

            {/* Datas */}
            <View style={styles.dateRow}>
              <View style={[styles.inputGroup, styles.dateInput]}>
                <Text style={styles.inputLabel}>
                  Data de Início <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={newGoal.data_inicio}
                  onChangeText={(text) => setNewGoal({ ...newGoal, data_inicio: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.textTertiary}
                />
              </View>

              <View style={[styles.inputGroup, styles.dateInput]}>
                <Text style={styles.inputLabel}>
                  Data de Fim <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={newGoal.data_fim}
                  onChangeText={(text) => setNewGoal({ ...newGoal, data_fim: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.textTertiary}
                />
              </View>
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
    backgroundColor: theme.colors.background,
  },
  
  // Loading e Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
    backgroundColor: theme.colors.background,
  },
  
  errorTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: theme.colors.text,
    marginTop: spacing[4],
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  
  errorText: {
    fontSize: typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: typography.lineHeight.base,
  },
  
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.md,
    ...shadows.base,
  },
  
  retryButtonText: {
    color: theme.colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },

  // Header
  header: {
    backgroundColor: theme.colors.surface,
    paddingTop: Platform.OS === 'ios' ? 60 : spacing[6],
    paddingBottom: spacing[4],
    paddingHorizontal: spacing[4],
    ...shadows.sm,
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  
  headerTitleSection: {
    flex: 1,
  },
  
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: spacing[1],
  },
  
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  
  addButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.md,
    ...shadows.base,
  },
  
  addButtonText: {
    color: theme.colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing[2],
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  
  goalsGrid: {
    gap: spacing[4],
  },

  // Goal Cards
  goalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    marginBottom: spacing[4],
    ...shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  
  goalTitleSection: {
    flex: 1,
    marginRight: spacing[3],
  },
  
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  
  goalTypeIconContainer: {
    marginRight: spacing[3],
    marginTop: spacing[1],
  },
  
  goalTitleContainer: {
    flex: 1,
  },
  
  goalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: theme.colors.text,
    lineHeight: typography.lineHeight.lg,
    marginBottom: spacing[1],
  },
  
  goalMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  goalType: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: theme.colors.primary,
  },
  
  goalPeriod: {
    fontSize: typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: spacing[1],
  },
  
  statusRow: {
    alignItems: 'flex-end',
  },
  
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  
  statusText: {
    color: theme.colors.surface,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing[1],
  },
  
  deleteButton: {
    padding: spacing[2],
    borderRadius: borderRadius.sm,
  },
  
  goalDescription: {
    fontSize: typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: typography.lineHeight.sm,
    marginBottom: spacing[4],
  },

  // Progress Section
  progressSection: {
    marginBottom: spacing[4],
  },
  
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  
  progressLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  
  percentageText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  
  progressBar: {
    marginBottom: spacing[2],
  },
  
  progressValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  progressText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  
  progressTarget: {
    fontSize: typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },

  // Goal Footer
  goalFooter: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingTop: spacing[3],
  },
  
  goalDates: {
    fontSize: typography.fontSize.xs,
    color: theme.colors.textTertiary,
    marginBottom: spacing[1],
  },
  
  completionDate: {
    fontSize: typography.fontSize.xs,
    color: theme.colors.success,
    fontWeight: typography.fontWeight.semibold,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
    paddingHorizontal: spacing[6],
  },
  
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  
  emptySubtext: {
    fontSize: typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.base,
    marginBottom: spacing[8],
  },
  
  emptyActionButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderRadius: borderRadius.md,
    ...shadows.base,
  },
  
  emptyActionText: {
    color: theme.colors.surface,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing[2],
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    paddingTop: Platform.OS === 'ios' ? 60 : spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: theme.colors.text,
  },
  
  modalCancelButton: {
    padding: spacing[2],
  },
  
  cancelButton: {
    color: theme.colors.error,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  
  modalSaveButton: {
    padding: spacing[2],
  },
  
  modalSaveButtonDisabled: {
    opacity: 0.6,
  },
  
  saveButton: {
    color: theme.colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  
  modalContent: {
    flex: 1,
    padding: spacing[4],
  },

  // Form Inputs
  inputGroup: {
    marginBottom: spacing[5],
  },
  
  inputLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: spacing[2],
  },
  
  required: {
    color: theme.colors.error,
  },
  
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: borderRadius.md,
    padding: spacing[3],
    fontSize: typography.fontSize.base,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    minHeight: 48,
  },
  
  textInputError: {
    borderColor: theme.colors.error,
  },
  
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  
  dateRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  
  dateInput: {
    flex: 1,
  },

  // Picker Options
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  
  pickerOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  
  pickerOptionIcon: {
    marginRight: spacing[2],
  },
  
  pickerOptionText: {
    fontSize: typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  
  pickerOptionTextSelected: {
    color: theme.colors.surface,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default GoalsScreenFinal;

