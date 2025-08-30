import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, spacing, typography, borderRadius, shadows } from '../theme/tokens';

interface JourneyModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: JourneyData) => void;
  mode: 'start' | 'end';
  activeJourney?: any;
  loading?: boolean;
}

interface JourneyData {
  km: number;
  ganho?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const JourneyModalImproved: React.FC<JourneyModalProps> = ({
  visible,
  onClose,
  onConfirm,
  mode,
  activeJourney,
  loading = false,
}) => {
  const [km, setKm] = useState('');
  const [ganho, setGanho] = useState('');
  const [errors, setErrors] = useState<{ km?: string; ganho?: string }>({});
  
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const isStartMode = mode === 'start';
  const isEndMode = mode === 'end';

  useEffect(() => {
    if (visible) {
      // Reset form
      setKm('');
      setGanho('');
      setErrors({});
      
      // Animação de entrada
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      // Animação de saída
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    }
  }, [visible]);

  const validateForm = (): boolean => {
    const newErrors: { km?: string; ganho?: string } = {};
    
    // Validação KM
    const kmNumber = parseInt(km);
    if (!km || isNaN(kmNumber) || kmNumber < 0) {
      newErrors.km = 'Quilometragem inválida';
    } else if (isEndMode && activeJourney && kmNumber <= activeJourney.km_inicio) {
      newErrors.km = 'KM final deve ser maior que o inicial';
    }
    
    // Validação Ganho (apenas para finalizar)
    if (isEndMode) {
      const ganhoNumber = parseFloat(ganho.replace(',', '.'));
      if (!ganho || isNaN(ganhoNumber) || ganhoNumber < 0) {
        newErrors.ganho = 'Ganho inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validateForm()) return;
    
    const data: JourneyData = {
      km: parseInt(km),
    };
    
    if (isEndMode) {
      data.ganho = parseFloat(ganho.replace(',', '.')) * 100; // Converter para centavos
    }
    
    onConfirm(data);
  };

  const formatCurrency = (value: string): string => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    const cleanValue = value.replace(/[^\d,\.]/g, '');
    return cleanValue;
  };

  const handleGanhoChange = (text: string) => {
    const formatted = formatCurrency(text);
    setGanho(formatted);
  };

  const getKmSuggestions = () => {
    if (!activeJourney) return [];
    
    const baseKm = activeJourney.km_inicio;
    return [
      baseKm + 50,
      baseKm + 100,
      baseKm + 150,
      baseKm + 200,
    ];
  };

  const renderKmSuggestions = () => {
    if (isStartMode) return null;
    
    const suggestions = getKmSuggestions();
    
    return (
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsLabel}>Sugestões:</Text>
        <View style={styles.suggestionsGrid}>
          {suggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={styles.suggestionButton}
              onPress={() => setKm(suggestion.toString())}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestionText}>+{suggestion - activeJourney.km_inicio}</Text>
              <Text style={styles.suggestionSubtext}>{suggestion} km</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderJourneySummary = () => {
    if (!isEndMode || !activeJourney || !km) return null;
    
    const kmRodados = parseInt(km) - activeJourney.km_inicio;
    const tempoTrabalhado = Math.floor(
      (Date.now() - new Date(activeJourney.data_inicio).getTime()) / (1000 * 60 * 60)
    );
    
    const ganhoNumber = parseFloat(ganho.replace(',', '.'));
    const ganhoPorKm = !isNaN(ganhoNumber) && kmRodados > 0 ? ganhoNumber / kmRodados : 0;
    const ganhoPorHora = !isNaN(ganhoNumber) && tempoTrabalhado > 0 ? ganhoNumber / tempoTrabalhado : 0;
    
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo da Jornada</Text>
        
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Ionicons name="speedometer" size={20} color={lightTheme.colors.primary} />
            <Text style={styles.summaryLabel}>KM Rodados</Text>
            <Text style={styles.summaryValue}>{kmRodados} km</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="time" size={20} color={lightTheme.colors.primary} />
            <Text style={styles.summaryLabel}>Tempo</Text>
            <Text style={styles.summaryValue}>{tempoTrabalhado}h</Text>
          </View>
          
          {!isNaN(gangoNumber) && ganhoNumber > 0 && (
            <>
              <View style={styles.summaryItem}>
                <Ionicons name="cash" size={20} color="#34C759" />
                <Text style={styles.summaryLabel}>R$/KM</Text>
                <Text style={styles.summaryValue}>R$ {ganhoPorKm.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Ionicons name="trending-up" size={20} color="#34C759" />
                <Text style={styles.summaryLabel}>R$/Hora</Text>
                <Text style={styles.summaryValue}>R$ {ganhoPorHora.toFixed(2)}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  const isFormValid = () => {
    const kmValid = km && !isNaN(parseInt(km)) && parseInt(km) > 0;
    const ganhoValid = isStartMode || (ganho && !isNaN(parseFloat(ganho.replace(',', '.'))));
    
    return kmValid && ganhoValid;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          { opacity: overlayOpacity }
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerIcon}>
                  <Ionicons
                    name={isStartMode ? "play-circle" : "stop-circle"}
                    size={32}
                    color={isStartMode ? "#34C759" : "#FF3B30"}
                  />
                </View>
                
                <View style={styles.headerText}>
                  <Text style={styles.title}>
                    {isStartMode ? 'Iniciar Jornada' : 'Finalizar Jornada'}
                  </Text>
                  <Text style={styles.subtitle}>
                    {isStartMode 
                      ? 'Informe a quilometragem inicial do veículo'
                      : 'Informe os dados finais da jornada'
                    }
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={24} color={lightTheme.colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Campo KM */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {isStartMode ? 'Quilometragem Inicial' : 'Quilometragem Final'}
                  </Text>
                  <View style={[styles.inputContainer, errors.km && styles.inputError]}>
                    <Ionicons 
                      name="speedometer" 
                      size={20} 
                      color={errors.km ? '#FF3B30' : lightTheme.colors.textSecondary} 
                    />
                    <TextInput
                      style={styles.input}
                      value={km}
                      onChangeText={setKm}
                      placeholder="Ex: 12345"
                      keyboardType="numeric"
                      autoFocus
                      maxLength={8}
                    />
                    <Text style={styles.inputSuffix}>km</Text>
                  </View>
                  {errors.km && (
                    <Text style={styles.errorText}>{errors.km}</Text>
                  )}
                  {isEndMode && activeJourney && (
                    <Text style={styles.helperText}>
                      KM inicial: {activeJourney.km_inicio.toLocaleString('pt-BR')} km
                    </Text>
                  )}
                </View>

                {/* Sugestões de KM */}
                {renderKmSuggestions()}

                {/* Campo Ganho (apenas para finalizar) */}
                {isEndMode && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Ganho Bruto</Text>
                    <View style={[styles.inputContainer, errors.ganho && styles.inputError]}>
                      <Text style={styles.inputPrefix}>R$</Text>
                      <TextInput
                        style={styles.input}
                        value={ganho}
                        onChangeText={handleGanhoChange}
                        placeholder="150,00"
                        keyboardType="numeric"
                        maxLength={10}
                      />
                    </View>
                    {errors.ganho && (
                      <Text style={styles.errorText}>{errors.ganho}</Text>
                    )}
                    <Text style={styles.helperText}>
                      Valor total recebido durante a jornada
                    </Text>
                  </View>
                )}

                {/* Resumo da Jornada */}
                {renderJourneySummary()}
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    !isFormValid() && styles.confirmButtonDisabled,
                    { backgroundColor: isStartMode ? '#34C759' : '#FF3B30' }
                  ]}
                  onPress={handleConfirm}
                  disabled={!isFormValid() || loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Ionicons
                        name={isStartMode ? "play" : "stop"}
                        size={20}
                        color="#FFFFFF"
                      />
                      <Text style={styles.confirmText}>
                        {isStartMode ? 'Iniciar' : 'Finalizar'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  keyboardAvoidingView: {
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: lightTheme.colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: screenHeight * 0.9,
    ...shadows.xl,
  },
  modalContent: {
    maxHeight: screenHeight * 0.8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
    gap: spacing[3],
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: lightTheme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: lightTheme.colors.textSecondary,
    lineHeight: typography.lineHeight.sm,
  },
  closeButton: {
    padding: spacing[2],
  },
  form: {
    padding: spacing[5],
    gap: spacing[5],
  },
  inputGroup: {
    gap: spacing[2],
  },
  inputLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: lightTheme.colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
    backgroundColor: lightTheme.colors.surface,
    gap: spacing[2],
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    paddingVertical: spacing[3],
    fontSize: typography.fontSize.base,
    color: lightTheme.colors.text,
  },
  inputPrefix: {
    fontSize: typography.fontSize.base,
    color: lightTheme.colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  inputSuffix: {
    fontSize: typography.fontSize.sm,
    color: lightTheme.colors.textSecondary,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: '#FF3B30',
    marginTop: spacing[1],
  },
  helperText: {
    fontSize: typography.fontSize.xs,
    color: lightTheme.colors.textSecondary,
    marginTop: spacing[1],
  },
  suggestionsContainer: {
    gap: spacing[2],
  },
  suggestionsLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: lightTheme.colors.text,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  suggestionButton: {
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.md,
    padding: spacing[3],
    alignItems: 'center',
    minWidth: 80,
  },
  suggestionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.primary,
  },
  suggestionSubtext: {
    fontSize: typography.fontSize.xs,
    color: lightTheme.colors.textSecondary,
    marginTop: spacing[1],
  },
  summaryContainer: {
    backgroundColor: lightTheme.colors.surfaceVariant,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    gap: spacing[3],
  },
  summaryTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    gap: spacing[1],
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: lightTheme.colors.text,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    padding: spacing[5],
    paddingTop: 0,
    gap: spacing[3],
  },
  cancelButton: {
    flex: 1,
    padding: spacing[4],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: typography.fontSize.base,
    color: lightTheme.colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    padding: spacing[4],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    ...shadows.base,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmText: {
    fontSize: typography.fontSize.base,
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.semibold,
  },
});

export default JourneyModalImproved;

