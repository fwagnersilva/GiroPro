import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import FormInput, { validators, combineValidators } from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from '../components/Icon';
import Alert from '../utils/alert';
import { showErrorToast, showSuccessToast } from '../utils/toastUtils';
import { authService } from '../services/authService';

type ResetPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ResetPassword'>;
type ResetPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

interface Props {
  navigation: ResetPasswordScreenNavigationProp;
  route: ResetPasswordScreenRouteProp;
}

const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState('');

  // Animação para entrada da tela
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Obter token dos parâmetros da rota
    const resetToken = route.params?.token;
    if (resetToken) {
      setToken(resetToken);
    } else {
      Alert.alert('Erro', 'Token de redefinição inválido', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [route.params]);

  const validatePassword = (password: string): string | null => {
    if (!password || password.length < 8) {
      return 'Senha deve ter pelo menos 8 caracteres';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Senha deve conter pelo menos uma letra minúscula';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Senha deve conter pelo menos uma letra maiúscula';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Senha deve conter pelo menos um número';
    }
    return null;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
      return 'As senhas não coincidem';
    }
    return null;
  };

  const handleResetPassword = async () => {
    // Validações
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      Alert.alert('Erro', passwordError);
      return;
    }

    const confirmPasswordError = validateConfirmPassword(newPassword, confirmPassword);
    if (confirmPasswordError) {
      Alert.alert('Erro', confirmPasswordError);
      return;
    }

    if (!token) {
      Alert.alert('Erro', 'Token de redefinição inválido');
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(token, newPassword);
      showSuccessToast('Senha redefinida com sucesso!');
      
      // Navegar para login após sucesso
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (error: any) {
      showErrorToast(error.message || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const isFormValid = newPassword.trim() !== '' && 
                     confirmPassword.trim() !== '' && 
                     newPassword === confirmPassword &&
                     validatePassword(newPassword) === null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Icon name="key-outline" size={64} color="#007AFF" />
            <Text style={styles.title}>Redefinir Senha</Text>
            <Text style={styles.subtitle}>
              Digite sua nova senha. Certifique-se de que seja segura e fácil de lembrar.
            </Text>
          </View>

          <View style={styles.form}>
            <FormInput
              label="Nova Senha"
              placeholder="Digite sua nova senha"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              required
              leftIcon="lock-closed-outline"
              rightIcon={showNewPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowNewPassword(!showNewPassword)}
              validation={(value) => validatePassword(value)}
              testID="new-password-input"
            />

            <FormInput
              label="Confirmar Nova Senha"
              placeholder="Confirme sua nova senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              required
              leftIcon="lock-closed-outline"
              rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              validation={(value) => validateConfirmPassword(newPassword, value)}
              testID="confirm-password-input"
            />

            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Requisitos da senha:</Text>
              <Text style={[
                styles.requirement,
                newPassword.length >= 8 ? styles.requirementMet : styles.requirementNotMet
              ]}>
                • Pelo menos 8 caracteres
              </Text>
              <Text style={[
                styles.requirement,
                /(?=.*[a-z])/.test(newPassword) ? styles.requirementMet : styles.requirementNotMet
              ]}>
                • Uma letra minúscula
              </Text>
              <Text style={[
                styles.requirement,
                /(?=.*[A-Z])/.test(newPassword) ? styles.requirementMet : styles.requirementNotMet
              ]}>
                • Uma letra maiúscula
              </Text>
              <Text style={[
                styles.requirement,
                /(?=.*\d)/.test(newPassword) ? styles.requirementMet : styles.requirementNotMet
              ]}>
                • Um número
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.resetButton, !isFormValid && styles.resetButtonDisabled]}
              onPress={handleResetPassword}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <LoadingSpinner color="#FFFFFF" />
              ) : (
                <Text style={styles.resetButtonText}>Redefinir Senha</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backToLoginButton} onPress={navigateToLogin}>
              <Text style={styles.backToLoginText}>
                Voltar ao <Text style={styles.loginLink}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  passwordRequirements: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 14,
    marginBottom: 4,
  },
  requirementMet: {
    color: '#34C759',
  },
  requirementNotMet: {
    color: '#8E8E93',
  },
  resetButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resetButtonDisabled: {
    backgroundColor: '#A9D3FF',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backToLoginButton: {
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 16,
    color: '#000000',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default ResetPasswordScreen;
