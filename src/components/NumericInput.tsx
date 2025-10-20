import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
import { validateNumericInput } from '../utils/currency';

interface NumericInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeValue: (value: string) => void;
  label?: string;
  error?: string;
  suffix?: string; // Ex: "km", "L", etc.
}

/**
 * Componente de input para valores numéricos (inteiros)
 * 
 * Funcionalidades:
 * - Aceita apenas números (sem vírgula, sem ponto)
 * - Validação em tempo real
 * - Suporte a sufixo (ex: "km")
 * - Compatível com todas as plataformas (Web, Android, iOS)
 * 
 * @example
 * const [km, setKm] = useState('');
 * <NumericInput 
 *   value={km} 
 *   onChangeValue={setKm}
 *   label="Quilometragem"
 *   suffix="km"
 *   placeholder="0"
 * />
 */
export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChangeValue,
  label,
  error,
  suffix,
  style,
  ...rest
}) => {
  const handleChange = (text: string) => {
    const cleanValue = validateNumericInput(text);
    onChangeValue(cleanValue);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          {...rest}
          style={[styles.input, style, error && styles.inputError]}
          value={value}
          onChangeText={handleChange}
          keyboardType="numeric"
        />
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  suffix: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});

