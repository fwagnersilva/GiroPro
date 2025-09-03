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
import { fuelingService } from '../services/api';
import { Vehicle } from '../types';
import { InteractiveButton, InteractiveCard, InteractiveToggle } from '../components/InteractiveComponents';
import { lightTheme } from '../theme/enhancedTokens';
import { 
  CarIcon, 
  CheckIcon,
  HomeIcon,
  MoneyIcon,
  RoadIcon
} from '../components/EnhancedIcons';

interface AddFuelingScreenProps {
  navigation: any;
  route: {
    params: {
      vehicles: Vehicle[];
    };
  };
}

const AddFuelingScreenEnhanced: React.FC<AddFuelingScreenProps> = ({ navigation, route }) => {
  const { vehicles } = route.params;
  const theme = lightTheme;
  
  const [formData, setFormData] = useState({
    id_veiculo: '',
    data_abastecimento: new Date().toISOString().split('T')[0],
    tipo_combustivel: 'Gasolina' as 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Flex',
    quantidade_litros: '',
    valor_litro: '',
    km_atual: '',
    nome_posto: '',
    tanque_cheio: true,
  });

  const [loading, setLoading] = useState(false);
  const [valorTotal, setValorTotal] = useState(0);

  const fuelTypes = [
    { 
      value: 'Gasolina', 
      label: 'Gasolina', 
      color: theme.colors.primary,
      description: 'Gasolina comum'
    },
    { 
      value: 'Etanol', 
      label: 'Etanol', 
      color: theme.colors.success,
      description: 'Álcool etílico'
    },
    { 
      value: 'Diesel', 
      label: 'Diesel', 
      color: theme.colors.warning,
      description: 'Óleo diesel'
    },
    { 
      value: 'GNV', 
      label: 'GNV', 
      color: theme.colors.info,
      description: 'Gás natural veicular'
    },
    { 
      value: 'Flex', 
      label: 'Flex', 
      color: theme.colors.secondary,
      description: 'Combustível flex'
    },
  ];

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
    setValorTotal(quantidade * valorLitro);
  }, [formData.quantidade_litros, formData.valor_litro]);

  const handleSubmit = async () => {
    // Validações
    if (!formData.id_veiculo) {
      Alert.alert('Erro', 'Selecione um veículo');
      return;
    }

    if (!formData.quantidade_litros || parseFloat(formData.quantidade_litros) <= 0) {
      Alert.alert('Erro', 'Informe uma quantidade válida de litros');
      return;
    }

    if (!formData.valor_litro || parseFloat(formData.valor_litro) <= 0) {
      Alert.alert('Erro', 'Informe um valor válido por litro');
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
    fuelTypeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[3],
    },
    fuelTypeCard: {
      flex: 1,
      minWidth: '30%',
      padding: theme.spacing[3],
      alignItems: 'center',
      gap: theme.spacing[1],
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    fuelTypeCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },
    fuelTypeIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[1],
    },
    fuelTypeLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.textPrimary,
      textAlign: 'center',
    },
    fuelTypeLabelSelected: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    fuelTypeDescription: {
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
    totalCard: {
      backgroundColor: theme.colors.primaryLight,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      alignItems: 'center',
      gap: theme.spacing[2],
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    totalLabel: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    totalValue: {
      fontSize: theme.typography.fontSize['2xl'],
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.bold,
    },
    toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing[2],
    },
    toggleLabel: {
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.textPrimary,
      fontWeight: theme.typography.fontWeight.medium,
    },
    footer: {
      padding: theme.spacing[5],
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      ...theme.shadows.sm,
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
        <Text style={styles.title}>Novo Abastecimento</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Seleção de Veículo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Veículo <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.id_veiculo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, id_veiculo: value }))}
                style={styles.picker}
              >
                <Picker.Item label="Selecione um veículo" value="" />
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

          {/* Tipo de Combustível */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Tipo de Combustível <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <View style={styles.fuelTypeContainer}>
              {fuelTypes.map((type) => (
                <InteractiveCard
                  key={type.value}
                  variant="outlined"
                  style={[
                    styles.fuelTypeCard,
                    formData.tipo_combustivel === type.value && styles.fuelTypeCardSelected,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, tipo_combustivel: type.value as any }))}
                >
                  <View style={[
                    styles.fuelTypeIcon,
                    { backgroundColor: type.color + '20' }
                  ]}>
                    <CarIcon size={20} color={type.color} />
                  </View>
                  <Text style={[
                    styles.fuelTypeLabel,
                    formData.tipo_combustivel === type.value && styles.fuelTypeLabelSelected
                  ]}>
                    {type.label}
                  </Text>
                  <Text style={styles.fuelTypeDescription}>
                    {type.description}
                  </Text>
                </InteractiveCard>
              ))}
            </View>
          </View>

          {/* Data do Abastecimento */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Data <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.data_abastecimento}
              onChangeText={(text) => setFormData(prev => ({ ...prev, data_abastecimento: text }))}
              placeholder="YYYY-MM-DD"
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>

          {/* Quantidade de Litros */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Quantidade (Litros) <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.quantidade_litros}
              onChangeText={(text) => setFormData(prev => ({ ...prev, quantidade_litros: text }))}
              placeholder="Ex: 45.5"
              keyboardType="decimal-pad"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>

          {/* Valor por Litro */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Valor por Litro (R$) <Text style={styles.requiredIndicator}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.valor_litro}
              onChangeText={(text) => setFormData(prev => ({ ...prev, valor_litro: text }))}
              placeholder="Ex: 5.49"
              keyboardType="decimal-pad"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>

          {/* Quilometragem Atual */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quilometragem Atual (Opcional)</Text>
            <TextInput
              style={styles.input}
              value={formData.km_atual}
              onChangeText={(text) => setFormData(prev => ({ ...prev, km_atual: text }))}
              placeholder="Ex: 15000"
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>

          {/* Nome do Posto */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Posto (Opcional)</Text>
            <TextInput
              style={styles.input}
              value={formData.nome_posto}
              onChangeText={(text) => setFormData(prev => ({ ...prev, nome_posto: text }))}
              placeholder="Ex: Posto Shell"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>

          {/* Tanque Cheio Toggle */}
          <View style={styles.inputGroup}>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Tanque Cheio</Text>
              <InteractiveToggle
                value={formData.tanque_cheio}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tanque_cheio: value }))}
                size="md"
              />
            </View>
          </View>

          {/* Valor Total */}
          {valorTotal > 0 && (
            <InteractiveCard variant="elevated" style={styles.totalCard}>
              <MoneyIcon size={32} color={theme.colors.primary} />
              <Text style={styles.totalLabel}>Valor Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(valorTotal)}</Text>
            </InteractiveCard>
          )}
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
                  Registrar Abastecimento
                </Text>
              </View>
            )}
          </InteractiveButton>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddFuelingScreenEnhanced;

