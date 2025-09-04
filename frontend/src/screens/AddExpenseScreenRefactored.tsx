import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { expenseService } from '../services/api';
import { Vehicle } from '../types';
import { InteractiveButton, InteractiveCard } from '../components/InteractiveComponents';
import FormInput, { validators, combineValidators } from '../components/FormInput';
import { lightTheme } from '../theme/enhancedTokens';
import { MoneyIcon, CarIcon } from '../components/EnhancedIcons';

interface AddExpenseScreenRefactoredProps {
  navigation: any;
  route: {
    params: {
      vehicles: Vehicle[];
    };
  };
}

const AddExpenseScreenRefactored: React.FC<AddExpenseScreenRefactoredProps> = ({ navigation, route }) => {
  const { vehicles } = route.params;
  
  const [formData, setFormData] = useState({
    id_veiculo: '',
    data_despesa: new Date().toISOString().split('T')[0],
    tipo_despesa: 'Manutencao' as 'Manutencao' | 'Pneus' | 'Seguro' | 'Outros',
    valor_despesa: '',
    descricao: '',
  });

  const [loading, setLoading] = useState(false);
  const theme = lightTheme;

  const expenseTypes = [
    { value: 'Manutencao', label: 'Manutenção', icon: '🔧', color: theme.colors.warning },
    { value: 'Pneus', label: 'Pneus', icon: '⚫', color: theme.colors.success },
    { value: 'Seguro', label: 'Seguro', icon: '🛡️', color: theme.colors.info },
    { value: 'Outros', label: 'Outros', icon: '📄', color: theme.colors.textSecondary },
  ];

  const handleSubmit = async () => {
    // Validações
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

  const getSelectedExpenseType = () => {
    return expenseTypes.find(type => type.value === formData.tipo_despesa);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <InteractiveButton
          variant="ghost"
          size="sm"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          ←
        </InteractiveButton>
        <View style={styles.titleContainer}>
          <MoneyIcon size={24} />
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Nova Despesa
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <InteractiveCard style={styles.formCard} variant="elevated">
          {/* Seleção de Veículo */}
          {vehicles && vehicles.length > 0 && (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
                Veículo
              </Text>
              <View style={styles.vehicleContainer}>
                {vehicles.map((vehicle) => (
                  <InteractiveButton
                    key={vehicle.id}
                    variant={formData.id_veiculo === vehicle.id ? 'primary' : 'outline'}
                    size="sm"
                    style={styles.vehicleOption}
                    onPress={() => updateFormData('id_veiculo', vehicle.id)}
                  >
                    <CarIcon size={16} />
                    <Text style={styles.vehicleText}>
                      {vehicle.marca} {vehicle.modelo} - {vehicle.placa}
                    </Text>
                  </InteractiveButton>
                ))}
              </View>
            </View>
          )}

          {/* Data da Despesa */}
          <FormInput
            label="Data da Despesa"
            required
            value={formData.data_despesa}
            onChangeText={(value) => updateFormData('data_despesa', value)}
            placeholder="YYYY-MM-DD"
            leftIcon="calendar-outline"
            validation={validators.required}
          />

          {/* Tipo de Despesa */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.textPrimary }]}>
              Tipo de Despesa *
            </Text>
            <View style={styles.expenseTypeContainer}>
              {expenseTypes.map((type) => (
                <InteractiveButton
                  key={type.value}
                  variant={formData.tipo_despesa === type.value ? 'primary' : 'outline'}
                  size="sm"
                  style={[
                    styles.expenseTypeOption,
                    formData.tipo_despesa === type.value && { 
                      backgroundColor: type.color,
                      borderColor: type.color 
                    }
                  ]}
                  onPress={() => updateFormData('tipo_despesa', type.value)}
                >
                  <Text style={styles.expenseTypeIcon}>{type.icon}</Text>
                  <Text style={[
                    styles.expenseTypeText,
                    formData.tipo_despesa === type.value && { color: theme.colors.textOnPrimary }
                  ]}>
                    {type.label}
                  </Text>
                </InteractiveButton>
              ))}
            </View>
          </View>

          {/* Valor da Despesa */}
          <FormInput
            label="Valor da Despesa"
            required
            value={formData.valor_despesa}
            onChangeText={(value) => updateFormData('valor_despesa', value)}
            placeholder="0,00"
            keyboardType="numeric"
            leftIcon="cash-outline"
            validation={combineValidators(validators.required, validators.currency)}
          />

          {/* Preview do Valor */}
          {formData.valor_despesa && (
            <View style={[styles.previewContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={[styles.previewLabel, { color: theme.colors.textSecondary }]}>
                Valor formatado:
              </Text>
              <Text style={[styles.previewValue, { color: theme.colors.primary }]}>
                {formatCurrency(formData.valor_despesa)}
              </Text>
            </View>
          )}

          {/* Descrição */}
          <FormInput
            label="Descrição"
            value={formData.descricao}
            onChangeText={(value) => updateFormData('descricao', value)}
            placeholder="Descrição opcional da despesa"
            multiline
            numberOfLines={3}
            leftIcon="document-text-outline"
          />

          {/* Resumo da Despesa */}
          <View style={[styles.summaryContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.summaryTitle, { color: theme.colors.textPrimary }]}>
              Resumo da Despesa
            </Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Tipo:
              </Text>
              <View style={styles.summaryTypeContainer}>
                <Text style={styles.summaryIcon}>
                  {getSelectedExpenseType()?.icon}
                </Text>
                <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>
                  {getSelectedExpenseType()?.label}
                </Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Data:
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>
                {new Date(formData.data_despesa).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            {formData.valor_despesa && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Valor:
                </Text>
                <Text style={[styles.summaryValue, { color: theme.colors.success, fontWeight: 'bold' }]}>
                  {formatCurrency(formData.valor_despesa)}
                </Text>
              </View>
            )}
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionContainer}>
            <InteractiveButton
              variant="outline"
              size="lg"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            >
              Cancelar
            </InteractiveButton>

            <InteractiveButton
              variant="primary"
              size="lg"
              onPress={handleSubmit}
              disabled={loading || !formData.valor_despesa}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.textOnPrimary} />
              ) : (
                'Registrar Despesa'
              )}
            </InteractiveButton>
          </View>
        </InteractiveCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: lightTheme.spacing[4],
    paddingTop: lightTheme.spacing[8],
  },
  backButton: {
    marginRight: lightTheme.spacing[3],
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: lightTheme.typography.fontSize['2xl'],
    fontWeight: lightTheme.typography.fontWeight.bold,
    marginLeft: lightTheme.spacing[2],
  },
  scrollView: {
    flex: 1,
    padding: lightTheme.spacing[4],
  },
  formCard: {
    padding: lightTheme.spacing[6],
  },
  inputGroup: {
    marginBottom: lightTheme.spacing[6],
  },
  inputLabel: {
    fontSize: lightTheme.typography.fontSize.base,
    fontWeight: lightTheme.typography.fontWeight.medium,
    marginBottom: lightTheme.spacing[3],
  },
  vehicleContainer: {
    gap: lightTheme.spacing[2],
  },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing[2],
  },
  vehicleText: {
    marginLeft: lightTheme.spacing[2],
    fontSize: lightTheme.typography.fontSize.sm,
  },
  expenseTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: lightTheme.spacing[2],
  },
  expenseTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: lightTheme.spacing[3],
    paddingVertical: lightTheme.spacing[2],
    marginBottom: lightTheme.spacing[2],
    minWidth: '45%',
  },
  expenseTypeIcon: {
    fontSize: lightTheme.typography.fontSize.base,
    marginRight: lightTheme.spacing[2],
  },
  expenseTypeText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: lightTheme.typography.fontWeight.medium,
  },
  previewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: lightTheme.spacing[3],
    borderRadius: lightTheme.borderRadius.md,
    marginBottom: lightTheme.spacing[4],
  },
  previewLabel: {
    fontSize: lightTheme.typography.fontSize.sm,
  },
  previewValue: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontWeight: lightTheme.typography.fontWeight.bold,
  },
  summaryContainer: {
    padding: lightTheme.spacing[4],
    borderRadius: lightTheme.borderRadius.md,
    marginBottom: lightTheme.spacing[6],
  },
  summaryTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontWeight: lightTheme.typography.fontWeight.semibold,
    marginBottom: lightTheme.spacing[3],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: lightTheme.spacing[1],
  },
  summaryLabel: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: lightTheme.typography.fontWeight.medium,
  },
  summaryTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: lightTheme.typography.fontSize.base,
    marginRight: lightTheme.spacing[1],
  },
  summaryValue: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: lightTheme.typography.fontWeight.medium,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: lightTheme.spacing[3],
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default AddExpenseScreenRefactored;

