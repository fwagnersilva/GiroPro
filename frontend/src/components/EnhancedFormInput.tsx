import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme, components, spacing, borderRadius } from '../theme/tokens';
import { useResponsiveStyles } from '../hooks/useResponsiveLayout';

interface EnhancedFormInputProps extends TextInputProps {
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
  isDark?: boolean;
  showValidationIcon?: boolean;
  helperText?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
}

const EnhancedFormInput: React.FC<EnhancedFormInputProps> = React.memo(({
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
  isDark = false,
  showValidationIcon = true,
  helperText,
  maxLength,
  showCharacterCount = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  
  const theme = isDark ? darkTheme : lightTheme;
  const { getResponsiveFontSize, getResponsiveSpacing } = useResponsiveStyles();
  
  // Animações
  const focusAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleChangeText = useCallback((text: string) => {
    if (onChangeText) {
      onChangeText(text);
    }
    
    // Limpa o erro local ao digitar
    if (localError) {
      setLocalError(null);
      setIsValid(null);
    }
    
    // Validação em tempo real (opcional)
    if (validation && text.length > 0) {
      const validationError = validation(text);
      setIsValid(validationError === null);
    }
  }, [onChangeText, localError, validation]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    
    // Animação de foco
    Animated.parallel([
      Animated.timing(focusAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.02,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focusAnim, scaleAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    
    // Animação de desfoco
    Animated.parallel([
      Animated.timing(focusAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Validação no blur
    if (validation && value !== undefined) {
      const validationError = validation(value);
      setLocalError(validationError);
      setIsValid(validationError === null);
      
      // Animação de erro
      if (validationError) {
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [validation, value, shakeAnim]);

  const displayError = error || localError;
  const hasError = Boolean(displayError);
  const showSuccess = isValid === true && !hasError && value && value.length > 0;

  // Estilos dinâmicos baseados no estado
  const inputContainerStyle = [
    styles.inputContainer,
    components.input.base,
    components.input.states.default(theme),
    isFocused && {
      ...components.input.states.focused(theme),
      borderColor: focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.border, theme.colors.primary],
      }),
    },
    hasError && components.input.states.error(theme),
    showSuccess && {
      borderColor: theme.colors.success,
    },
  ];

  const characterCount = value ? value.length : 0;
  const isOverLimit = maxLength ? characterCount > maxLength : false;

  return (
    <Animated.View 
      style={[
        styles.container, 
        containerStyle,
        { transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] }
      ]}
    >
      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { 
          color: theme.colors.text,
          fontSize: getResponsiveFontSize(14),
        }]}>
          {label}
          {required && <Text style={[styles.required, { color: theme.colors.error }]}> *</Text>}
        </Text>
        
        {showCharacterCount && maxLength && (
          <Text style={[
            styles.characterCount,
            { 
              color: isOverLimit ? theme.colors.error : theme.colors.textSecondary,
              fontSize: getResponsiveFontSize(12),
            }
          ]}>
            {characterCount}/{maxLength}
          </Text>
        )}
      </View>
      
      {/* Input Container */}
      <Animated.View style={inputContainerStyle} testID="enhanced-form-input-container">
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons
              name={leftIcon as any}
              size={20}
              color={
                hasError 
                  ? theme.colors.error 
                  : isFocused 
                    ? theme.colors.primary 
                    : theme.colors.textSecondary
              }
            />
          </View>
        )}
        
        {/* Text Input */}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              fontSize: getResponsiveFontSize(16),
            },
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || showValidationIcon) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={theme.colors.textTertiary}
          testID={testID}
          maxLength={maxLength}
          {...props}
        />
        
        {/* Right Icons */}
        <View style={styles.rightIconsContainer}>
          {/* Validation Icon */}
          {showValidationIcon && (showSuccess || hasError) && (
            <View style={styles.validationIconContainer}>
              <Ionicons
                name={showSuccess ? "checkmark-circle" : "alert-circle"}
                size={20}
                color={showSuccess ? theme.colors.success : theme.colors.error}
              />
            </View>
          )}
          
          {/* Custom Right Icon */}
          {rightIcon && (
            <TouchableOpacity
              onPress={onRightIconPress}
              style={styles.rightIconContainer}
              testID="right-icon-button"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={rightIcon as any}
                size={20}
                color={
                  hasError 
                    ? theme.colors.error 
                    : isFocused 
                      ? theme.colors.primary 
                      : theme.colors.textSecondary
                }
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      
      {/* Helper Text / Error Message */}
      {(displayError || helperText) && (
        <View style={styles.messageContainer}>
          {displayError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
              <Text style={[styles.errorText, { 
                color: theme.colors.error,
                fontSize: getResponsiveFontSize(12),
              }]}>
                {displayError}
              </Text>
            </View>
          ) : helperText ? (
            <Text style={[styles.helperText, { 
              color: theme.colors.textSecondary,
              fontSize: getResponsiveFontSize(12),
            }]}>
              {helperText}
            </Text>
          ) : null}
        </View>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  
  label: {
    fontWeight: '500',
  },
  
  required: {
    fontWeight: 'bold',
  },
  
  characterCount: {
    fontWeight: '400',
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  leftIconContainer: {
    paddingLeft: spacing[4],
    paddingRight: spacing[2],
  },
  
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? spacing[3] : spacing[2],
    paddingHorizontal: spacing[4],
  },
  
  inputWithLeftIcon: {
    paddingLeft: spacing[2],
  },
  
  inputWithRightIcon: {
    paddingRight: spacing[2],
  },
  
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing[2],
  },
  
  validationIconContainer: {
    marginRight: spacing[2],
  },
  
  rightIconContainer: {
    padding: spacing[2],
  },
  
  messageContainer: {
    marginTop: spacing[2],
  },
  
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  errorText: {
    marginLeft: spacing[2],
    flex: 1,
  },
  
  helperText: {
    marginLeft: spacing[1],
  },
});

export default EnhancedFormInput;

