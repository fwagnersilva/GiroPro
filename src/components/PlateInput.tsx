import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface PlateInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  value: string;
  onChangeValue: (value: string) => void;
  error?: string;
}

/**
 * Componente de input para placas de veículos
 * Suporta formato Mercosul (ABC1D23) e antigo (ABC-1234)
 * Aplica máscara automaticamente durante a digitação
 */
export const PlateInput: React.FC<PlateInputProps> = ({
  label,
  value,
  onChangeValue,
  error,
  ...props
}) => {
  const formatPlate = (input: string): string => {
    // Remove tudo que não é letra ou número
    const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (clean.length === 0) return '';
    
    // Detecta formato baseado no padrão de entrada
    // Mercosul: ABC1D23 (letras, número, letra, números)
    // Antigo: ABC1234 (letras, números)
    
    if (clean.length <= 3) {
      // Primeiras 3 letras
      return clean.replace(/[^A-Z]/g, '').slice(0, 3);
    } else if (clean.length === 4) {
      // ABC + 1 número
      const letters = clean.slice(0, 3).replace(/[^A-Z]/g, '');
      const number = clean.slice(3, 4).replace(/[^0-9]/g, '');
      return `${letters}${number}`;
    } else if (clean.length === 5) {
      // Detecta se é Mercosul (letra) ou Antigo (número)
      const letters = clean.slice(0, 3).replace(/[^A-Z]/g, '');
      const firstNum = clean.slice(3, 4).replace(/[^0-9]/g, '');
      const fifth = clean.charAt(4);
      
      if (/[A-Z]/.test(fifth)) {
        // Mercosul: ABC1D
        return `${letters}${firstNum}${fifth}`;
      } else {
        // Antigo: ABC-12
        const secondNum = fifth.replace(/[^0-9]/g, '');
        return `${letters}-${firstNum}${secondNum}`;
      }
    } else if (clean.length === 6) {
      const letters = clean.slice(0, 3).replace(/[^A-Z]/g, '');
      const firstNum = clean.slice(3, 4).replace(/[^0-9]/g, '');
      const fifth = clean.charAt(4);
      
      if (/[A-Z]/.test(fifth)) {
        // Mercosul: ABC1D2
        const sixthNum = clean.slice(5, 6).replace(/[^0-9]/g, '');
        return `${letters}${firstNum}${fifth}${sixthNum}`;
      } else {
        // Antigo: ABC-123
        const nums = clean.slice(4, 6).replace(/[^0-9]/g, '');
        return `${letters}-${firstNum}${nums}`;
      }
    } else {
      // 7 caracteres ou mais
      const letters = clean.slice(0, 3).replace(/[^A-Z]/g, '');
      const firstNum = clean.slice(3, 4).replace(/[^0-9]/g, '');
      const fifth = clean.charAt(4);
      
      if (/[A-Z]/.test(fifth)) {
        // Mercosul: ABC1D23
        const lastNums = clean.slice(5, 7).replace(/[^0-9]/g, '');
        return `${letters}${firstNum}${fifth}${lastNums}`;
      } else {
        // Antigo: ABC-1234
        const nums = clean.slice(4, 7).replace(/[^0-9]/g, '');
        return `${letters}-${firstNum}${nums}`;
      }
    }
  };

  const handleChange = (text: string) => {
    const formatted = formatPlate(text);
    onChangeValue(formatted);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        style={[styles.input, error && styles.inputError, props.style]}
        value={value}
        onChangeText={handleChange}
        placeholder="ABC-1234 ou ABC1D23"
        placeholderTextColor="#999"
        autoCapitalize="characters"
        maxLength={8}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.hint}>
        Formatos: ABC-1234 (antigo) ou ABC1D23 (Mercosul)
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

