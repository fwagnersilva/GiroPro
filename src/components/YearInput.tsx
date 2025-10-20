import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface YearInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  value: string;
  onChangeValue: (value: string) => void;
  error?: string;
}

/**
 * Componente de input para ano do veículo
 * Valida que o ano está entre 1900 e ano atual + 1
 * Aceita apenas números
 */
export const YearInput: React.FC<YearInputProps> = ({
  label,
  value,
  onChangeValue,
  error,
  ...props
}) => {
  const currentYear = new Date().getFullYear();
  const minYear = 1900;
  const maxYear = currentYear + 1; // Permite ano seguinte para veículos 0km

  const handleChange = (text: string) => {
    // Remove tudo que não é número
    const clean = text.replace(/[^0-9]/g, '');
    
    // Limita a 4 dígitos
    const limited = clean.slice(0, 4);
    
    onChangeValue(limited);
  };

  const validateYear = (): string | undefined => {
    if (!value) return undefined;
    
    const year = parseInt(value);
    
    if (isNaN(year)) {
      return 'Ano inválido';
    }
    
    if (value.length < 4) {
      return 'Digite o ano completo (4 dígitos)';
    }
    
    if (year < minYear) {
      return `Ano deve ser maior que ${minYear}`;
    }
    
    if (year > maxYear) {
      return `Ano não pode ser maior que ${maxYear}`;
    }
    
    return undefined;
  };

  const validationError = error || validateYear();

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        style={[styles.input, validationError && styles.inputError, props.style]}
        value={value}
        onChangeText={handleChange}
        placeholder={`Ex: ${currentYear}`}
        placeholderTextColor="#999"
        keyboardType="numeric"
        maxLength={4}
      />
      {validationError && <Text style={styles.errorText}>{validationError}</Text>}
      <Text style={styles.hint}>
        Entre {minYear} e {maxYear}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

