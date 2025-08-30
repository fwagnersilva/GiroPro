import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Vibration,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userService } from '../services/api';

// Sistema de cores semânticas
const Colors = {
  primary: Platform.OS === 'ios' ? '#007AFF' : '#1976D2',
  success: Platform.OS === 'ios' ? '#34C759' : '#4CAF50',
  warning: Platform.OS === 'ios' ? '#FF9500' : '#FF9800',
  error: Platform.OS === 'ios' ? '#FF3B30' : '#F44336',
  background: Platform.OS === 'ios' ? '#F2F2F7' : '#FAFAFA',
  surface: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: 'rgba(0, 0, 0, 0.6)',
  border: '#E0E0E0',
  borderFocused: Platform.OS === 'ios' ? '#007AFF' : '#1976D2',
  placeholder: 'rgba(0, 0, 0, 0.4)',
};

// Componente para barra de força da senha
const PasswordStrengthBar: React.FC<{ strength: number }> = ({ strength }) => {
  const getStrengthColor = () => {
    if (strength < 2) return Colors.error;
    if (strength < 4) return Colors.warning;
    return Colors.success;
  };

  const getStrengthText = () => {
    if (strength < 2) return 'Fraca';
    if (strength < 4) return 'Média';
    return 'Forte';
  };

  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthBarContainer}>
        <View 
          style={[
            styles.strengthBar, 
            { 
              width: `${(strength / 5) * 100}%`,
              backgroundColor: getStrengthColor()
            }
          ]} 
        />
      </View>
      <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
        {getStrengthText()}
      </Text>
    </View>
  );
};

// Componente para input de senha melhorado
const PasswordInput: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  error?: string;
  showStrength?: boolean;
  strength?: number;
}> = ({
  label,
  value,
  onChangeText,
  placeholder,
  showPassword,
  onTogglePassword,
  isFocused,
  onFocus,
  onBlur,
  error,
  showStrength,
  strength = 0,
}) => {
  const shakeAnimation = new Animated.Value(0);

  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [error]);

  return (
    <View style={styles.inputSection}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View 
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          { transform: [{ translateX: shakeAnimation }] }
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={!showPassword}
          accessibilityLabel={label}
          accessibilityHint={`Digite sua ${label.toLowerCase()}`}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={onTogglePassword}
          accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          accessibilityRole="button"
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      </Animated.View>
      {error && (
        <Animated.View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}
      {showStrength && value.length > 0 && (
        <PasswordStrengthBar strength={strength} />
      )}
    </View>
  );
};

// Componente para requisitos de senha
const PasswordRequirements: React.FC<{ requirements: any }> = ({ requirements }) => {
  const requirementsList = [
    { key: 'length', text: 'Mínimo de 6 caracteres', met: requirements.length },
    { key: 'uppercase', text: 'Pelo menos uma letra maiúscula', met: requirements.uppercase },
    { key: 'lowercase', text: 'Pelo menos uma letra minúscula', met: requirements.lowercase },
    { key: 'number', text: 'Pelo menos um número', met: requirements.number },
    { key: 'specialChar', text: 'Pelo menos um caractere especial', met: requirements.specialChar },
  ];

  return (
    <View style={styles.requirementsCard}>
      <Text style={styles.requirementsTitle}>Requisitos da senha:</Text>
      {requirementsList.map((req) => (
        <Animated.View key={req.key} style={styles.requirementItem}>
          <Ionicons
            name={req.met ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color={req.met ? Colors.success : Colors.error}
          />
          <Text style={[
            styles.requirementText,
            { color: req.met ? Colors.success : Colors.textSecondary }
          ]}>
            {req.text}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

const ChangePasswordScreen: React.FC = ({ navigation }: any) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isCurrentPasswordFocused, setIsCurrentPasswordFocused] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isConfirmNewPasswordFocused, setIsConfirmNewPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const successAnimation = new Animated.Value(0);

  // Calcular força da senha
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  useEffect(() => {
    const length = newPassword.length >= 6;
    const uppercase = /[A-Z]/.test(newPassword);
    const lowercase = /[a-z]/.test(newPassword);
    const number = /[0-9]/.test(newPassword);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    setPasswordRequirements({
      length,
      uppercase,
      lowercase,
      number,
      specialChar,
    });

    // Validação com debounce implícito
    const timer = setTimeout(() => {
      if (newPassword && newPassword.length < 6) {
        setNewPasswordError("A nova senha deve ter pelo menos 6 caracteres.");
      } else if (newPassword && (!uppercase || !lowercase || !number || !specialChar)) {
        setNewPasswordError("A nova senha deve atender a todos os requisitos.");
      } else {
        setNewPasswordError("");
      }

      if (confirmNewPassword && newPassword !== confirmNewPassword) {
        setConfirmNewPasswordError("A nova senha e a confirmação não coincidem.");
      } else {
        setConfirmNewPasswordError("");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [newPassword, confirmNewPassword]);

  const handleChangePassword = async () => {
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmNewPasswordError("");

    if (!currentPassword) {
      setCurrentPasswordError("A senha atual é obrigatória.");
      return;
    }

    if (!newPassword) {
      setNewPasswordError("A nova senha é obrigatória.");
      return;
    }

    if (!confirmNewPassword) {
      setConfirmNewPasswordError("A confirmação da nova senha é obrigatória.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError("A nova senha e a confirmação não coincidem.");
      return;
    }

    if (calculatePasswordStrength(newPassword) < 5) {
      setNewPasswordError("A nova senha não atende a todos os requisitos.");
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword({
        currentPassword,
        newPassword,
      });
      
      // Animação de sucesso
      Animated.spring(successAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      setLoading(false);
      Vibration.vibrate(50);
      setSuccessMessage("Senha alterada com sucesso!");
      
      setTimeout(() => {
        setSuccessMessage("");
        navigation.goBack();
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      Vibration.vibrate([100, 50, 100]);
      Alert.alert("Erro", error.message || "Não foi possível alterar a senha.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return currentPassword && 
           newPassword && 
           confirmNewPassword && 
           calculatePasswordStrength(newPassword) === 5 &&
           newPassword === confirmNewPassword;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header melhorado */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Alterar Senha</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Formulário em cards separados */}
      <View style={styles.formContainer}>
        {/* Card da senha atual */}
        <View style={styles.card}>
          <PasswordInput
            label="Senha Atual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Digite sua senha atual"
            showPassword={showCurrentPassword}
            onTogglePassword={() => setShowCurrentPassword(!showCurrentPassword)}
            isFocused={isCurrentPasswordFocused}
            onFocus={() => setIsCurrentPasswordFocused(true)}
            onBlur={() => setIsCurrentPasswordFocused(false)}
            error={currentPasswordError}
          />
        </View>

        {/* Card da nova senha */}
        <View style={styles.card}>
          <PasswordInput
            label="Nova Senha"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Digite sua nova senha"
            showPassword={showNewPassword}
            onTogglePassword={() => setShowNewPassword(!showNewPassword)}
            isFocused={isNewPasswordFocused}
            onFocus={() => setIsNewPasswordFocused(true)}
            onBlur={() => setIsNewPasswordFocused(false)}
            error={newPasswordError}
            showStrength={true}
            strength={calculatePasswordStrength(newPassword)}
          />
          
          {newPassword.length > 0 && (
            <PasswordRequirements requirements={passwordRequirements} />
          )}
        </View>

        {/* Card de confirmação */}
        <View style={styles.card}>
          <PasswordInput
            label="Confirmar Nova Senha"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            placeholder="Confirme sua nova senha"
            showPassword={showConfirmNewPassword}
            onTogglePassword={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            isFocused={isConfirmNewPasswordFocused}
            onFocus={() => setIsConfirmNewPasswordFocused(true)}
            onBlur={() => setIsConfirmNewPasswordFocused(false)}
            error={confirmNewPasswordError}
          />
        </View>

        {/* Botão de salvar melhorado */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            !isFormValid() && styles.saveButtonDisabled,
            successMessage && styles.saveButtonSuccess
          ]}
          onPress={handleChangePassword}
          disabled={loading || !isFormValid()}
          activeOpacity={0.8}
          accessibilityLabel="Alterar senha"
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : successMessage ? (
            <Animated.View style={[
              styles.successContainer,
              { transform: [{ scale: successAnimation }] }
            ]}>
              <Ionicons name="checkmark-circle" size={24} color="#FFF" />
              <Text style={styles.saveButtonText}>{successMessage}</Text>
            </Animated.View>
          ) : (
            <Text style={styles.saveButtonText}>Alterar Senha</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  formContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputSection: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    minHeight: 56,
  },
  inputContainerFocused: {
    borderColor: Colors.borderFocused,
    shadowColor: Colors.borderFocused,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  eyeIcon: {
    padding: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginLeft: 6,
    flex: 1,
  },
  strengthContainer: {
    marginTop: 12,
  },
  strengthBarContainer: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'right',
  },
  requirementsCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 56,
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    elevation: 0,
    shadowOpacity: 0,
  },
  saveButtonSuccess: {
    backgroundColor: Colors.success,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ChangePasswordScreen;

