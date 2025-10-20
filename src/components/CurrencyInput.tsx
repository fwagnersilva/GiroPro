import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
import { formatCurrencyInput } from '../utils/currency';

interface CurrencyInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string; // Valor limpo (apenas números)
  onChangeValue: (cleanValue: string) => void;
  label?: string;
  error?: string;
}

/**
 * Componente de input para valores monetários
 * 
 * Funcionalidades:
 * - Aceita apenas números
 * - Exibe formatação automática em tempo real (ex: 15050 → 150,50)
 * - Armazena valor limpo (apenas números) no estado
 * - Compatível com todas as plataformas (Web, Android, iOS)
 * 
 * @example
 * const [value, setValue] = useState('');
 * <CurrencyInput 
 *   value={value} 
 *   onChangeValue={setValue}
 *   label="Faturamento"
 *   placeholder="0,00"
 * />
 */
export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChangeValue,
  label,
  error,
  style,
  ...rest
}) => {
  const handleChange = (text: string) => {
    const { clean } = formatCurrencyInput(text);
    onChangeValue(clean);
  };

  // Formata o valor para exibição
  const displayValue = value ? formatCurrencyInput(value).formatted : '';

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <Text style={styles.currencySymbol}>R$</Text>
        <TextInput
          {...rest}
          style={[styles.input, style, error && styles.inputError]}
          value={displayValue}
          onChangeText={handleChange}
          keyboardType="numeric"
          placeholder="0,00"
        />
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
  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
    fontWeight: '500',
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
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});

