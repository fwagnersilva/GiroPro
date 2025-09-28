import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import Icon from '../../components/Icon';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  validation?: (value: string) => string | null;
  containerStyle?: any;
  inputStyle?: any;
  testID?: string;
}

const FormInput: React.FC<FormInputProps> = React.memo(({
  label,
  error,
  required = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  validation,
  containerStyle,
  inputStyle,
  value,
  onChangeText,
  testID,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChangeText = useCallback((text: string) => {
    if (onChangeText) {
      onChangeText(text);
    }
    // Limpa o erro local ao digitar, a validação ocorrerá no blur
    if (validation) {
      const validationError = validation(text);
      setLocalError(validationError);
    } else if (localError) {
      setLocalError(null);
    }
  }, [onChangeText, localError]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Validação ocorre quando o campo perde o foco
    if (validation && value !== undefined) {
      const validationError = validation(value);
      setLocalError(validationError);
    }
  }, [validation, value]);

  const displayError = error || localError;
  const hasError = Boolean(displayError);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          hasError && styles.inputContainerError,
        ]}
        testID="form-input-container"
      >
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={hasError ? '#FF3B30' : isFocused ? '#007AFF' : '#8E8E93'}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="#8E8E93"
          testID={testID}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconContainer}
            testID="right-icon-button"
          >
            <Icon
              name={rightIcon}
              size={20}
              color={hasError ? '#FF3B30' : isFocused ? '#007AFF' : '#8E8E93'}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {hasError && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={16} color="#FF3B30" />
          <Text style={styles.errorText}>{displayError}</Text>
        </View>
      )}
    </View>
  );
});

// Validações comuns
export const validators = {
  required: (value: string) => {
    return value.trim() === '' ? 'Este campo é obrigatório' : null;
  },
  
  email: (value: string) => {
    // Regex de email mais robusta
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (value.trim() === '') return null;
    return emailRegex.test(value) ? null : 'Email inválido';
  },
  
  password: (value: string) => {
    if (value.trim() === '') return null; // Permite campo vazio para validação opcional
    
    // Regex exata do backend: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    
    // Verificações individuais para mensagens mais específicas
    if (value.length < 8) {
      return 'Senha deve ter pelo menos 8 caracteres';
    }
    
    if (!/(?=.*[a-z])/.test(value)) {
      return 'Senha deve conter pelo menos 1 letra minúscula';
    }
    
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'Senha deve conter pelo menos 1 letra maiúscula';
    }
    
    if (!/(?=.*\d)/.test(value)) {
      return 'Senha deve conter pelo menos 1 número';
    }
    
    if (!/(?=.*[@$!%*?&])/.test(value)) {
      return 'Senha deve conter pelo menos 1 caractere especial (@$!%*?&)';
    }
    
    if (!passwordRegex.test(value)) {
      return 'Senha contém caracteres não permitidos. Use apenas letras, números e @$!%*?&';
    }
    
    return null;
  },
  
  positiveNumber: (value: string) => {
    if (value.trim() === '') return null;
    const num = parseFloat(value);
    return !isNaN(num) && num > 0 ? null : 'Deve ser um número positivo';
  },
  
  currency: (value: string) => {
    if (value.trim() === '') return null;
    const num = parseFloat(value.replace(',', '.'));
    return !isNaN(num) && num >= 0 ? null : 'Valor inválido';
  },
  
  plate: (value: string) => {
    if (value.trim() === '') return null;
    const plateRegex = /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/;
    return plateRegex.test(value.toUpperCase()) ? null : 'Placa inválida';
  },
};

// Função para combinar validações
export const combineValidators = (...validators: Array<(value: string) => string | null>) => {
  return (value: string) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    marginLeft: 16,
  },
  rightIconContainer: {
    padding: 12,
    marginRight: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginLeft: 6,
    flex: 1,
  },
});

export default FormInput;


