import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { fuelingService } from '../services/api';
import { Vehicle } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme/tokens';

interface AddFuelingScreenProps {
  navigation: any;
  route: {
    params: {
      vehicles: Vehicle[];
    };
  };
}

interface ValidationErrors {
  [key: string]: string | null;
}

const AddFuelingScreenImproved: React.FC<AddFuelingScreenProps> = ({ navigation, route }) => {
  const { vehicles } = route.params;
  
  const [formData, setFormData] = useState({
    nome_posto: '',
    data_abastecimento: new Date().toISOString().split('T')[0],
    id_veiculo: '',
    tipo_combustivel: 'Gasolina' as 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Flex',
    valor_litro: '',
    quantidade_litros: '',
    km_atual: '',
  });

  const [loading, setLoading] = useState(false);
  const [valorTotal, setValorTotal] = useState(0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // Animações
  const progressAnim = useRef(new Animated.Value(0)).current;
  const totalValueAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Campos obrigatórios para cálculo de progresso
  const requiredFields = ['nome_posto', 'id_veiculo', 'tipo_combustivel', 'valor_litro', 'quantidade_litros'];

  useEffect(() => {
    // Se houver apenas um veículo, selecionar automaticamente
    if (vehicles.length === 1) {
      setFormData(prev => ({ ...prev, id_veiculo: vehicles[0].id }));
    }
  }, [vehicles]);

  useEffect(() => {
    // Calcular valor total automaticamente
    const quantidade = parseFloat(formData.quantidade_litros) || 0;
    const valorLitro = parseFloat(formData.valor_litro) || 0;
    const newTotal = quantidade * valorLitro;
    
    if (newTotal !== valorTotal) {
      setValorTotal(newTotal);
      // Animar mudança do valor total
      Animated.spring(totalValueAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start(() => {
        totalValueAnim.setValue(0);
      });
    }
  }, [formData.quantidade_litros, formData.valor_litro, valorTotal]);

  useEffect(() => {
    // Atualizar progresso
    const filledRequiredFields = requiredFields.filter(field => 
      formData[field as keyof typeof formData] && 
      !errors[field]
    ).length;
    const progress = filledRequiredFields / requiredFields.length;
    
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [formData, errors]);

  const validateField = useCallback((field: string, value: string): string | null => {
    switch (field) {
      case 'nome_posto':
        return value.trim().length < 2 ? 'Nome do posto deve ter pelo menos 2 caracteres' : null;
      
      case 'id_veiculo':
        return !value ? 'Selecione um veículo' : null;
      
      case 'quantidade_litros':
        const quantidade = parseFloat(value);
        if (!value) return 'Quantidade é obrigatória';
        if (isNaN(quantidade)) return 'Quantidade deve ser um número';
        if (quantidade <= 0) return 'Quantidade deve ser maior que zero';
        if (quantidade > 200) return 'Quantidade muito alta (máx: 200L)';
        return null;
      
      case 'valor_litro':
        const valor = parseFloat(value);
        if (!value) return 'Valor por litro é obrigatório';
        if (isNaN(valor)) return 'Valor deve ser um número';
        if (valor <= 0) return 'Valor deve ser maior que zero';
        if (valor > 15) return 'Valor muito alto (máx: R$ 15,00)';
        return null;
      
      case 'km_atual':
        if (value && isNaN(parseInt(value))) return 'KM deve ser um número';
        return null;
      
      default:
        return null;
    }
  }, []);

  const handleFieldChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validar campo em tempo real se já foi tocado
    if (touchedFields.has(field)) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [touchedFields, validateField]);

  const handleFieldBlur = useCallback((field: string) => {
    setTouchedFields(prev => new Set(prev).add(field));
    const value = formData[field as keyof typeof formData];
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    
    // Haptic feedback para erro
    if (error && Platform.OS !== 'web') {
      Vibration.vibrate(100);
    }
  }, [formData, validateField]);

  const validateAllFields = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let hasErrors = false;

    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    // Validar campos opcionais se preenchidos
    if (formData.km_atual) {
      const error = validateField('km_atual', formData.km_atual);
      if (error) {
        newErrors.km_atual = error;
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    
    if (hasErrors) {
      // Animação de shake para indicar erro
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
      
      if (Platform.OS !== 'web') {
        Vibration.vibrate([100, 50, 100]);
      }
    }

    return !hasErrors;
  }, [formData, validateField]);

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      return;
    }

    try {
      setLoading(true);

      const fuelingData = {
        id_veiculo: formData.id_veiculo,
        data_abastecimento: new Date(formData.data_abastecimento + 'T12:00:00.000Z').toISOString(),
        tipo_combustivel: formData.tipo_combustivel,
        quantidade_litros: parseFloat(formData.quantidade_litros),
        valor_litro: parseFloat(formData.valor_litro),
        km_atual: formData.km_atual ? parseInt(formData.km_atual) : undefined,
        nome_posto: formData.nome_posto || undefined,
      };

      await fuelingService.createFueling(fuelingData);
      
      // Haptic feedback de sucesso
      if (Platform.OS !== 'web') {
        Vibration.vibrate(200);
      }
      
      Alert.alert(
        'Sucesso',
        'Abastecimento registrado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro ao registrar abastecimento:', error);
      Alert.alert('Erro', error.message || 'Não foi possível registrar o abastecimento');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getFuelIcon = (type: string) => {
    switch (type) {
      case 'Gasolina': return 'car';
      case 'Etanol': return 'leaf';
      case 'Diesel': return 'bus';
      case 'GNV': return 'cloud';
      case 'Flex': return 'swap-horizontal';
      default: return 'car';
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Progresso do Formulário</Text>
        <Text style={styles.progressText}>
          {Math.round((progressAnim._value || 0) * 100)}%
        </Text>
      </View>
      <View style={styles.progressBarContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }
          ]} 
        />
      </View>
    </View>
  );

  const renderInput = (
    field: string,
    label: string,
    placeholder: string,
    options: {
      required?: boolean;
      keyboardType?: any;
      icon?: string;
      multiline?: boolean;
    } = {}
  ) => {
    const { required = false, keyboardType = 'default', icon, multiline = false } = options;
    const hasError = errors[field];
    const isTouched = touchedFields.has(field);
    const value = formData[field as keyof typeof formData];

    return (
      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <View style={styles.labelRow}>
            {icon && (
              <Ionicons 
                name={icon as any} 
                size={16} 
                color={colors.primary[600]} 
                style={styles.labelIcon} 
              />
            )}
            <Text style={[styles.label, required && styles.requiredLabel]}>
              {label}
              {required && <Text style={styles.asterisk}> *</Text>}
            </Text>
          </View>
          {hasError && isTouched && (
            <Ionicons name="alert-circle" size={16} color={colors.error[500]} />
          )}
        </View>
        
        <TextInput
          style={[
            styles.input,
            hasError && isTouched && styles.inputError,
            !hasError && isTouched && value && styles.inputValid,
            multiline && styles.inputMultiline,
          ]}
          value={value}
          onChangeText={(text) => handleFieldChange(field, text)}
          onBlur={() => handleFieldBlur(field)}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[400]}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
        
        {hasError && isTouched && (
          <Animated.View 
            style={[
              styles.errorContainer,
              { transform: [{ translateX: shakeAnim }] }
            ]}
          >
            <Text style={styles.errorText}>{hasError}</Text>
          </Animated.View>
        )}
      </View>
    );
  };

  const renderPicker = (
    field: string,
    label: string,
    items: Array<{ label: string; value: string }>,
    options: { required?: boolean; icon?: string } = {}
  ) => {
    const { required = false, icon } = options;
    const hasError = errors[field];
    const isTouched = touchedFields.has(field);
    const value = formData[field as keyof typeof formData];

    return (
      <View style={styles.inputGroup}>
        <View style={styles.labelContainer}>
          <View style={styles.labelRow}>
            {icon && (
              <Ionicons 
                name={icon as any} 
                size={16} 
                color={colors.primary[600]} 
                style={styles.labelIcon} 
              />
            )}
            <Text style={[styles.label, required && styles.requiredLabel]}>
              {label}
              {required && <Text style={styles.asterisk}> *</Text>}
            </Text>
          </View>
          {hasError && isTouched && (
            <Ionicons name="alert-circle" size={16} color={colors.error[500]} />
          )}
        </View>
        
        <View style={[
          styles.pickerContainer,
          hasError && isTouched && styles.inputError,
          !hasError && isTouched && value && styles.inputValid,
        ]}>
          <Picker
            selectedValue={value}
            onValueChange={(itemValue) => {
              handleFieldChange(field, itemValue);
              handleFieldBlur(field);
            }}
            style={styles.picker}
          >
            {items.map((item) => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>
        
        {hasError && isTouched && (
          <Animated.View 
            style={[
              styles.errorContainer,
              { transform: [{ translateX: shakeAnim }] }
            ]}
          >
            <Text style={styles.errorText}>{hasError}</Text>
          </Animated.View>
        )}
      </View>
    );
  };

  const isFormValid = Object.keys(errors).every(key => !errors[key]) && 
                     requiredFields.every(field => formData[field as keyof typeof formData]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary[600]} />
        </TouchableOpacity>
        <Text style={styles.title}>Novo Abastecimento</Text>
        <View style={styles.placeholder} />
      </View>

      {renderProgressBar()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Seção: Informações Essenciais */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={20} color={colors.primary[600]} />
              <Text style={styles.sectionTitle}>Informações Essenciais</Text>
            </View>

            {renderInput('nome_posto', 'Nome do Posto', 'Ex: Posto Shell', {
              required: true,
              icon: 'business',
            })}

            {renderInput('data_abastecimento', 'Data do Abastecimento', 'YYYY-MM-DD', {
              required: true,
              keyboardType: 'numeric',
              icon: 'calendar',
            })}

            {renderPicker('id_veiculo', 'Veículo', [
              { label: 'Selecione um veículo', value: '' },
              ...vehicles.map((vehicle) => ({
                label: `${vehicle.marca} ${vehicle.modelo} - ${vehicle.placa}`,
                value: vehicle.id,
              })),
            ], {
              required: true,
              icon: 'car-sport',
            })}

            {renderPicker('tipo_combustivel', 'Tipo de Combustível', [
              { label: 'Gasolina', value: 'Gasolina' },
              { label: 'Etanol', value: 'Etanol' },
              { label: 'Diesel', value: 'Diesel' },
              { label: 'GNV', value: 'GNV' },
              { label: 'Flex', value: 'Flex' },
            ], {
              required: true,
              icon: getFuelIcon(formData.tipo_combustivel),
            })}

            {renderInput('valor_litro', 'Valor por Litro (R$)', 'Ex: 5.49', {
              required: true,
              keyboardType: 'decimal-pad',
              icon: 'cash',
            })}

            {renderInput('quantidade_litros', 'Quantidade (Litros)', 'Ex: 45.5', {
              required: true,
              keyboardType: 'decimal-pad',
              icon: 'speedometer',
            })}
          </View>

          {/* Valor Total */}
          {valorTotal > 0 && (
            <Animated.View 
              style={[
                styles.totalContainer,
                {
                  transform: [{
                    scale: totalValueAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.05],
                    }),
                  }],
                }
              ]}
            >
              <View style={styles.totalHeader}>
                <Ionicons name="calculator" size={20} color={colors.neutral[0]} />
                <Text style={styles.totalLabel}>Valor Total</Text>
              </View>
              <Text style={styles.totalValue}>{formatCurrency(valorTotal)}</Text>
            </Animated.View>
          )}

          {/* Seção: Detalhes Adicionais */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setShowOptionalFields(!showOptionalFields)}
            >
              <Ionicons name="settings" size={20} color={colors.neutral[600]} />
              <Text style={styles.sectionTitleOptional}>Detalhes Adicionais (Opcional)</Text>
              <Ionicons 
                name={showOptionalFields ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={colors.neutral[600]} 
              />
            </TouchableOpacity>

            {showOptionalFields && (
              <View style={styles.optionalFields}>
                {renderInput('km_atual', 'Quilometragem Atual', 'Ex: 125000', {
                  keyboardType: 'numeric',
                  icon: 'speedometer-outline',
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isFormValid || loading) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.neutral[0]} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={colors.neutral[0]} />
              <Text style={styles.submitButtonText}>Registrar Abastecimento</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    elevation: 2,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
  },
  placeholder: {
    width: 32,
  },
  progressContainer: {
    backgroundColor: colors.neutral[0],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[700],
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary[600],
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.neutral[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[900],
    marginLeft: spacing.sm,
    flex: 1,
  },
  sectionTitleOptional: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[600],
    marginLeft: spacing.sm,
    flex: 1,
  },
  optionalFields: {
    marginTop: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelIcon: {
    marginRight: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[700],
  },
  requiredLabel: {
    color: colors.neutral[900],
    fontWeight: typography.fontWeight.semibold,
  },
  asterisk: {
    color: colors.error[500],
    fontWeight: typography.fontWeight.bold,
  },
  input: {
    backgroundColor: colors.neutral[0],
    borderWidth: 2,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.neutral[900],
    minHeight: 48,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error[500],
    backgroundColor: colors.error[50],
  },
  inputValid: {
    borderColor: colors.success[500],
    backgroundColor: colors.success[50],
  },
  pickerContainer: {
    backgroundColor: colors.neutral[0],
    borderWidth: 2,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
  },
  errorContainer: {
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error[600],
    fontWeight: typography.fontWeight.medium,
  },
  totalContainer: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    elevation: 4,
    shadowColor: colors.primary[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  totalLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[0],
    marginLeft: spacing.sm,
  },
  totalValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[0],
    textAlign: 'center',
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.neutral[0],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    elevation: 8,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  submitButton: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    elevation: 2,
    shadowColor: colors.primary[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: colors.neutral[400],
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[0],
  },
});

export default AddFuelingScreenImproved;

