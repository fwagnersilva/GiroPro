import React, { useState, useCallback } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  leftIcon?: string; // For simplicity, we'll use text for icons or replace with actual web icons
  rightIcon?: string;
  onRightIconPress?: () => void;
  validation?: (value: string) => string | null;
  containerStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  testID?: string;
  onChangeText?: (text: string) => void; // Custom prop for consistency with RN
}

const webStyles = {
  container: {
    marginBottom: '16px',
  },
  label: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#000000',
    marginBottom: '8px',
    display: 'block',
  },
  required: {
    color: '#FF3B30',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5EA',
    borderRadius: '8px',
    minHeight: '48px',
  },
  inputContainerFocused: {
    borderColor: '#007AFF',
    boxShadow: '0 0 0 2px rgba(0, 122, 255, 0.2)',
  },
  inputContainerError: {
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    fontSize: '16px',
    color: '#000000',
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    width: '100%',
  },
  inputWithLeftIcon: {
    paddingLeft: '8px',
  },
  inputWithRightIcon: {
    paddingRight: '8px',
  },
  leftIcon: {
    marginLeft: '16px',
    fontSize: '20px',
    color: '#8E8E93',
  },
  rightIconContainer: {
    padding: '12px',
    marginRight: '4px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '6px',
  },
  errorIcon: {
    fontSize: '16px',
    color: '#FF3B30',
    marginRight: '6px',
  },
  errorText: {
    fontSize: '14px',
    color: '#FF3B30',
    flex: 1,
  },
};

const FormInputWeb: React.FC<FormInputProps> = React.memo(({
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (onChangeText) {
      onChangeText(text);
    }
    if (validation) {
      const validationError = validation(text);
      setLocalError(validationError);
    } else if (localError) {
      setLocalError(null);
    }
  }, [onChangeText, localError, validation]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (validation && value !== undefined) {
      const validationError = validation(e.target.value);
      setLocalError(validationError);
    }
  }, [validation, value]);

  const displayError = error || localError;
  const hasError = Boolean(displayError);

  return (
    <div style={{ ...webStyles.container, ...containerStyle }}>
      <label style={webStyles.label}>
        {label}
        {required && <span style={webStyles.required}> *</span>}
      </label>
      
      <div
        style={{
          ...webStyles.inputContainer,
          ...(isFocused && webStyles.inputContainerFocused),
          ...(hasError && webStyles.inputContainerError),
        }}
        data-testid={testID ? `${testID}-container` : undefined}
      >
        {leftIcon && (
          <span
            style={{ ...webStyles.leftIcon, color: hasError ? '#FF3B30' : isFocused ? '#007AFF' : '#8E8E93' }}
          >
            {leftIcon === 'mail-outline' && '✉️'}
            {leftIcon === 'lock-closed-outline' && '🔒'}
            {/* Add more icon mappings here */}
          </span>
        )}
        
        <input
          style={{
            ...webStyles.input,
            ...(leftIcon && webStyles.inputWithLeftIcon),
            ...(rightIcon && webStyles.inputWithRightIcon),
            ...inputStyle,
          }}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={props.placeholder}
          type={props.secureTextEntry ? 'password' : props.keyboardType === 'email-address' ? 'email' : 'text'}
          autoCapitalize={props.autoCapitalize}
          data-testid={testID}
          {...props}
        />
        
        {rightIcon && (
          <button
            onClick={onRightIconPress}
            style={webStyles.rightIconContainer}
            data-testid="right-icon-button"
          >
            <span
              style={{ ...webStyles.errorIcon, color: hasError ? '#FF3B30' : isFocused ? '#007AFF' : '#8E8E93' }}
            >
              {rightIcon === 'eye-off-outline' && '👁️‍🗨️'}
              {rightIcon === 'eye-outline' && '👁️'}
              {/* Add more icon mappings here */}
            </span>
          </button>
        )}
      </div>
      
      {hasError && (
        <div style={webStyles.errorContainer}>
          <span style={webStyles.errorIcon}>⚠️</span>
          <span style={webStyles.errorText}>{displayError}</span>
        </div>
      )}
    </div>
  );
});

// Validações comuns (same as original, no changes needed here)
export const validators = {
  required: (value: string) => {
    return value.trim() === '' ? 'Este campo é obrigatório' : null;
  },
  
  email: (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (value.trim() === '') return null;
    return emailRegex.test(value) ? null : 'Email inválido';
  },
  
  password: (value: string) => {
    if (value.trim() === '') return null; 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    
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

export const combineValidators = (...validators: Array<(value: string) => string | null>) => {
  return (value: string) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
};

export default FormInputWeb;


