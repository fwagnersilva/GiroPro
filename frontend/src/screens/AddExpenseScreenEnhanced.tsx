import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { expenseService } from '../services/api';
import { Vehicle } from '../types';
import { InteractiveButton, InteractiveCard } from '../components/InteractiveComponents';
import { lightTheme } from '../theme/enhancedTokens';
import { 
  TrashIcon, 
  PlusIcon, 
  MoneyIcon, 
  CarIcon, 
  CheckIcon,
  HomeIcon 
} from '../components/EnhancedIcons';

interface AddExpenseScreenProps {
  navigation: any;
  route: {
    params: {
      vehicles: Vehicle[];
    };
  };
}

const AddExpenseScreenEnhanced: React.FC<AddExpenseScreenProps> = ({ navigation, route }) => {
  const { vehicles } = route.params;
  const theme = lightTheme;
  
  const [formData, setFormData] = useState({
    id_veiculo: '',
    data_despesa: new Date().toISOString().split('T')[0],
    tipo_despesa: 'Manutencao' as 'Manutencao' | 'Pneus' | 'Seguro' | 'Outros',
    valor_despesa: '',
    descricao: '',
  });

  const [loading, setLoading] = useState(false);
  const [valorDespesaError, setValorDespesaError] = useState<string | null>(null);

  const expenseTypes = [
    { 
      value: 'Manutencao', 
      label: 'Manutenção', 
      color: theme.colors.warning,
      description: 'Reparos e manutenção preventiva'
    },
    { 
      value: 'Pneus', 
      label: 'Pneus', 
      color: theme.colors.success,
      description: 'Troca e manutenção de pneus'
    },
    { 
      value: 'Seguro', 
      label: 'Seguro', 
      color: theme.colors.primary,
      description: 'Seguro do veículo'
    },
    { 
      value: 'Outros', 
      label: 'Outros', 
      color: theme.colors.textSecondary,
      description: 'Outras despesas relacionadas'
    },
  ];

  const handleSubmit = async () => {
    // Validações
    if (valorDespesaError) {
      Alert.alert('Erro', valorDespesaError);
      return;
    }

    if (!formData.valor_despesa || parseFloat(formData.valor_despesa) <= 0) {
      Alert.alert('Erro', 'Informe um valor válido para a despesa');
      return;
    }

    try {
      setLoading(true);

      const expenseData = {
        id_veiculo: formData.id_veiculo || undefined,
        data_despesa: new Date(formData.data_despesa + 'T12:00:00.000Z').toISOString(),
        tipo_despesa: formData.tipo_despesa,
        valor_despesa: parseFloat(formData.valor_despesa),
        descricao: formData.descricao || undefined,
      };

      await expenseService.createExpense(expenseData);
      
      Alert.alert(
        'Sucesso',
        'Despesa registrada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro ao registrar despesa:', error);
      Alert.alert('Erro', error.message || 'Não foi possível registrar a despesa');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[5],
      paddingVertical: theme.spacing[4],
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      ...theme.shadows.sm,
    },
    title: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.textPrimary,
    },
    placeholder: {
      width: 32,
    },
    content: {
      flex: 1,
    },
    form: {
      padding: theme.spacing[5],
      gap: theme.spacing[5],
    },
    inputGroup: {
      gap: theme.spacing[2],
    },
    label: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.textPrimary,
    },
    requiredIndicator: {
      color: theme.colors.error,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textPrimary,
      minHeight: 48,
    },
    inputFocused: {
      borderColor: theme.colors.borderFocus,
      ...theme.shadows.sm,
    },
    textArea: {
      height: 100,
      paddingTop: theme.spacing[3],
      textAlignVertical: 'top',
    },
    valuePreview: {
      marginTop: theme.spacing[2],
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    expenseTypeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[3],
    },
    expenseTypeCard: {
      flex: 1,
      minWidth: '45%',
      padding: theme.spacing[4],
      alignItems: 'center',
      gap: theme.spacing[2],
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    expenseTypeCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },
    expenseTypeIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[1],
    },
    expenseTypeLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.textPrimary,
      textAlign: 'center',
    },
    expenseTypeLabelSelected: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    expenseTypeDescription: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    pickerContainer: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
    },
    picker: {
      height: 50,
      color: theme.colors.textPrimary,
    },
    footer: {
      padding: theme.spacing[5],
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      ...theme.shadows.sm,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.sm,
      marginTop: theme.spacing[1],
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing[3],
    },
    cancelButton: {
      flex: 1,
    },
    submitButton: {
      flex: 2,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[2],
    },
    buttonText: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <InteractiveButton
          variant="ghost"
          size="sm"
          onPress={() => navigation.goBack()}
          style={{ padding: theme.spacing[1] }}
        >
          <HomeIcon size={24} color={theme.colors.primary} />
        </InteractiveButton>
        <Text style={styles.title}>Nova Despesa</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Tipo de Despesa */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Tipo de Despesa <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <View style={styles.expenseTypeContainer}>
              {expenseTypes.map((type) => (
                <InteractiveCard
                  key={type.value}
                  variant="outlined"
                  style={[
                    styles.expenseTypeCard,
                    formData.tipo_despesa === type.value && styles.expenseTypeCardSelected,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, tipo_despesa: type.value as any }))}
                >
                  <View style={[
                    styles.expenseTypeIcon,
                    { backgroundColor: type.color + '20' }
                  ]}>
                    <MoneyIcon size={24} color={type.color} />
                  </View>
                  <Text style={[
                    styles.expenseTypeLabel,
                    formData.tipo_despesa === type.value && styles.expenseTypeLabelSelected
                  ]}>
                    {type.label}
                  </Text>
                  <Text style={styles.expenseTypeDescription}>
                    {type.description}
                  </Text>
                </InteractiveCard>
              ))}
            </View>
          </View>

          {/* Data da Despesa */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Data <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.data_despesa}
              onChangeText={(text) => setFormData(prev => ({ ...prev, data_despesa: text }))}
              placeholder="YYYY-MM-DD"
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>

          {/* Valor da Despesa */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Valor (R$) <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.valor_despesa}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, valor_despesa: text }));
                if (parseFloat(text) <= 0 || isNaN(parseFloat(text))) {
                  setValorDespesaError('Informe um valor válido para a despesa');
                } else {
                  setValorDespesaError(null);
                }
              }}
              placeholder="Ex: 150.00"
              keyboardType="decimal-pad"
              placeholderTextColor={theme.colors.textTertiary}
            />
            {formData.valor_despesa && (
              <Text style={styles.valuePreview}>
                {formatCurrency(formData.valor_despesa)}
              </Text>
            )}
            {valorDespesaError && <Text style={styles.errorText}>{valorDespesaError}</Text>}
          </View>

          {/* Seleção de Veículo (Opcional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Veículo (Opcional)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.id_veiculo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, id_veiculo: value }))}
                style={styles.picker}
              >
                <Picker.Item label="Não associar a um veículo" value="" />
                {vehicles.map((vehicle) => (
                  <Picker.Item
                    key={vehicle.id}
                    label={`${vehicle.marca} ${vehicle.modelo} - ${vehicle.placa}`}
                    value={vehicle.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Descrição (Opcional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.descricao}
              onChangeText={(text) => setFormData(prev => ({ ...prev, descricao: text }))}
              placeholder="Descreva os detalhes da despesa..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <InteractiveButton
            variant="outline"
            size="lg"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: theme.colors.textPrimary }]}>
              Cancelar
            </Text>
          </InteractiveButton>
          
          <InteractiveButton
            variant="primary"
            size="lg"
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={loading}
            loading={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.textOnPrimary} size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <CheckIcon size={20} color={theme.colors.textOnPrimary} />
                <Text style={[styles.buttonText, { color: theme.colors.textOnPrimary }]}>
                  Registrar Despesa
                </Text>
              </View>
            )}
          </InteractiveButton>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddExpenseScreenEnhanced;

