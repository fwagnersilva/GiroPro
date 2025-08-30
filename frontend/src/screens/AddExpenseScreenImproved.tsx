import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { expenseService } from '../services/api';
import { Vehicle } from '../types';
import EnhancedFormInput from '../components/EnhancedFormInput';
import ToastNotificationImproved from '../components/ToastNotificationImproved';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/designTokens';

interface AddExpenseScreenImprovedProps {
  navigation: any;
  route: {
    params: {
      vehicles: Vehicle[];
    };
  };
}

interface FormData {
  id_veiculo: string;
  data_despesa: Date;
  tipo_despesa: 'Manutencao' | 'Pneus' | 'Seguro' | 'Outros';
  valor_despesa: string;
  descricao: string;
}

interface FormErrors {
  valor_despesa?: string;
  descricao?: string;
}

const { width: screenWidth } = Dimensions.get('window');

const AddExpenseScreenImproved: React.FC<AddExpenseScreenImprovedProps> = ({ 
  navigation, 
  route 
}) => {
  const { vehicles } = route.params;
  
  const [formData, setFormData] = useState<FormData>({
    id_veiculo: vehicles.length === 1 ? vehicles[0].id : '',
    data_despesa: new Date(),
    tipo_despesa: 'Manutencao',
    valor_despesa: '',
    descricao: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
  });

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Tipos de despesa com ícones melhorados e cores específicas
  const expenseTypes = [
    { 
      value: 'Manutencao', 
      label: 'Manutenção', 
      icon: 'construct-outline', 
      color: colors.expense.maintenance,
      description: 'Reparos e serviços'
    },
    { 
      value: 'Pneus', 
      label: 'Pneus', 
      icon: 'radio-button-off-outline', 
      color: colors.expense.tires,
      description: 'Troca e calibragem'
    },
    { 
      value: 'Seguro', 
      label: 'Seguro', 
      icon: 'shield-checkmark-outline', 
      color: colors.expense.insurance,
      description: 'Seguros e proteções'
    },
    { 
      value: 'Outros', 
      label: 'Outros', 
      icon: 'ellipsis-horizontal-outline', 
      color: colors.expense.others,
      description: 'Outras despesas'
    },
  ];

  // Valores sugeridos para cada tipo de despesa
  const suggestedValues = {
    Manutencao: ['50', '100', '200', '500'],
    Pneus: ['200', '400', '600', '800'],
    Seguro: ['100', '300', '500', '1000'],
    Outros: ['50', '100', '150', '300'],
  };

  useEffect(() => {
    // Animação de entrada da tela
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, []);

  // Validações em tempo real
  const validateValue = useCallback((value: string): string | null => {
    if (!value) return 'Valor é obrigatório';
    const numValue = parseFloat(value.replace(',', '.'));
    if (isNaN(numValue) || numValue <= 0) {
      return 'Informe um valor válido maior que zero';
    }
    if (numValue > 999999) {
      return 'Valor muito alto (máximo R$ 999.999)';
    }
    return null;
  }, []);

  const validateDescription = useCallback((value: string): string | null => {
    if (value.length > 500) {
      return 'Descrição muito longa (máximo 500 caracteres)';
    }
    return null;
  }, []);

  // Formatação de moeda em tempo real
  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value.replace(',', '.')) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  };

  // Handlers
  const handleValueChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário digita
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      handleValueChange('data_despesa', selectedDate);
    }
  };

  const handleSuggestedValuePress = (value: string) => {
    handleValueChange('valor_despesa', value);
    // Animação de feedback
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    setToast({ visible: true, type, title, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleSubmit = async () => {
    // Validação completa do formulário
    const errors: FormErrors = {};
    
    const valueError = validateValue(formData.valor_despesa);
    if (valueError) errors.valor_despesa = valueError;
    
    const descError = validateDescription(formData.descricao);
    if (descError) errors.descricao = descError;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('error', 'Erro no formulário', 'Corrija os campos destacados');
      return;
    }

    try {
      setLoading(true);

      const expenseData = {
        id_veiculo: formData.id_veiculo || undefined,
        data_despesa: formData.data_despesa.toISOString(),
        tipo_despesa: formData.tipo_despesa,
        valor_despesa: parseFloat(formData.valor_despesa.replace(',', '.')),
        descricao: formData.descricao.trim() || undefined,
      };

      await expenseService.createExpense(expenseData);
      
      showToast('success', 'Sucesso!', 'Despesa registrada com sucesso');
      
      // Aguardar um pouco antes de navegar de volta
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
      
    } catch (error: any) {
      console.error('Erro ao registrar despesa:', error);
      showToast('error', 'Erro', error.message || 'Não foi possível registrar a despesa');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    Alert.alert(
      'Limpar formulário',
      'Tem certeza que deseja limpar todos os campos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            setFormData({
              id_veiculo: vehicles.length === 1 ? vehicles[0].id : '',
              data_despesa: new Date(),
              tipo_despesa: 'Manutencao',
              valor_despesa: '',
              descricao: '',
            });
            setFormErrors({});
            showToast('info', 'Formulário limpo');
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Toast Notification */}
      <ToastNotificationImproved
        visible={toast.visible}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onHide={hideToast}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary[500]} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Nova Despesa</Text>
          <Text style={styles.subtitle}>Registre suas despesas do veículo</Text>
        </View>
        
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearForm}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh-outline" size={24} color={colors.neutral[600]} />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            {/* Indicador de campos obrigatórios */}
            <View style={styles.requiredIndicator}>
              <Ionicons name="information-circle-outline" size={16} color={colors.primary[500]} />
              <Text style={styles.requiredText}>
                Campos marcados com * são obrigatórios
              </Text>
            </View>

            {/* Tipo de Despesa */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Tipo de Despesa <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.expenseTypeContainer}>
                {expenseTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.expenseTypeButton,
                      formData.tipo_despesa === type.value && [
                        styles.expenseTypeButtonSelected,
                        { borderColor: type.color, backgroundColor: type.color + '15' }
                      ]
                    ]}
                    onPress={() => handleValueChange('tipo_despesa', type.value)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.expenseTypeIcon,
                      { backgroundColor: type.color + '20' }
                    ]}>
                      <Ionicons
                        name={type.icon as any}
                        size={28}
                        color={type.color}
                      />
                    </View>
                    <Text style={[
                      styles.expenseTypeLabel,
                      formData.tipo_despesa === type.value && { color: type.color }
                    ]}>
                      {type.label}
                    </Text>
                    <Text style={styles.expenseTypeDescription}>
                      {type.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Data da Despesa */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Data da Despesa <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} />
                <Text style={styles.dateText}>
                  {formData.data_despesa.toLocaleDateString('pt-BR')}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.neutral[500]} />
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={formData.data_despesa}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)}
                />
              )}
            </View>

            {/* Valor da Despesa */}
            <View style={styles.inputGroup}>
              <EnhancedFormInput
                label="Valor da Despesa"
                required
                value={formData.valor_despesa}
                onChangeText={(text) => handleValueChange('valor_despesa', text)}
                placeholder="Ex: 150,00"
                keyboardType="decimal-pad"
                leftIcon="cash-outline"
                error={formErrors.valor_despesa}
                validation={validateValue}
                maxLength={10}
              />
              
              {/* Preview do valor formatado */}
              {formData.valor_despesa && !formErrors.valor_despesa && (
                <Text style={styles.valuePreview}>
                  {formatCurrency(formData.valor_despesa)}
                </Text>
              )}

              {/* Valores sugeridos */}
              <View style={styles.suggestedValuesContainer}>
                <Text style={styles.suggestedValuesLabel}>Valores sugeridos:</Text>
                <View style={styles.suggestedValues}>
                  {suggestedValues[formData.tipo_despesa].map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={styles.suggestedValueButton}
                      onPress={() => handleSuggestedValuePress(value)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.suggestedValueText}>
                        R$ {value}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Seleção de Veículo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Veículo (Opcional)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.id_veiculo}
                  onValueChange={(value) => handleValueChange('id_veiculo', value)}
                  style={styles.picker}
                >
                  <Picker.Item 
                    label="Não associar a um veículo" 
                    value="" 
                    color={colors.neutral[600]}
                  />
                  {vehicles.map((vehicle) => (
                    <Picker.Item
                      key={vehicle.id}
                      label={`${vehicle.marca} ${vehicle.modelo} - ${vehicle.placa}`}
                      value={vehicle.id}
                      color={colors.neutral[900]}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <EnhancedFormInput
                label="Descrição"
                value={formData.descricao}
                onChangeText={(text) => handleValueChange('descricao', text)}
                placeholder="Descreva os detalhes da despesa..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                error={formErrors.descricao}
                validation={validateDescription}
                maxLength={500}
                showCharacterCount
                helperText="Adicione detalhes que possam ser úteis no futuro"
                inputStyle={styles.textArea}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer com botão de submit */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.neutral[0]} size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color={colors.neutral[0]} />
                <Text style={styles.submitButtonText}>Registrar Despesa</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    ...shadows.sm,
  },
  backButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
  },
  clearButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: spacing.xl,
  },
  requiredIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  requiredText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[700],
    marginLeft: spacing.sm,
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[800],
    marginBottom: spacing.md,
  },
  required: {
    color: colors.error[500],
    fontWeight: typography.fontWeight.bold,
  },
  expenseTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  expenseTypeButton: {
    flex: 1,
    minWidth: (screenWidth - (spacing.xl * 2) - spacing.md) / 2,
    backgroundColor: colors.neutral[0],
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  expenseTypeButtonSelected: {
    borderWidth: 2,
    ...shadows.md,
  },
  expenseTypeIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  expenseTypeLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  expenseTypeDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    textAlign: 'center',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  dateText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.neutral[900],
    marginLeft: spacing.md,
  },
  valuePreview: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.lg,
    color: colors.success[600],
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
    backgroundColor: colors.success[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  suggestedValuesContainer: {
    marginTop: spacing.lg,
  },
  suggestedValuesLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    fontWeight: typography.fontWeight.medium,
  },
  suggestedValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  suggestedValueButton: {
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  suggestedValueText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[700],
    fontWeight: typography.fontWeight.medium,
  },
  pickerContainer: {
    backgroundColor: colors.neutral[0],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  textArea: {
    height: 100,
    paddingTop: spacing.md,
  },
  footer: {
    padding: spacing.xl,
    backgroundColor: colors.neutral[0],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    ...shadows.lg,
  },
  submitButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.md,
  },
  submitButtonDisabled: {
    backgroundColor: colors.neutral[400],
  },
  submitButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[0],
  },
});

export default AddExpenseScreenImproved;

