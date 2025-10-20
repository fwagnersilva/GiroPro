import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface EmailInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  value: string;
  onChangeValue: (value: string) => void;
  error?: string;
  showValidation?: boolean;
}

/**
 * Componente de input para email com validação
 * Valida formato de email em tempo real
 */
export const EmailInput: React.FC<EmailInputProps> = ({
  label,
  value,
  onChangeValue,
  error,
  showValidation = true,
  ...props
}) => {
  const validateEmail = (email: string): string | undefined => {
    if (!email) return undefined;
    
    // Regex para validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return 'Email inválido';
    }
    
    return undefined;
  };

  const validationError = showValidation ? (error || validateEmail(value)) : error;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        style={[styles.input, validationError && styles.inputError, props.style]}
        value={value}
        onChangeText={onChangeValue}
        placeholder="Digite seu email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
      />
      {validationError && <Text style={styles.errorText}>{validationError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
});

