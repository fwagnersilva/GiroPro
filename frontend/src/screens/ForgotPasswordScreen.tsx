import React, { useState } from 'react';
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
import { RootStackParamList } from '../types';
import FormInput, { validators } from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from '../components/Icon';
import Alert from '../utils/alert';
import { showErrorToast, showSuccessToast } from '../utils/toastUtils';
import { authService } from '../services/authService';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Animação para entrada da tela
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  React.useEffect(() => {
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
  }, []);

  const handleRequestPasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu email');
      return;
    }

    // Validação de formato de email
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Erro', 'Por favor, informe um email válido');
      return;
    }

    try {
      setLoading(true);
      await authService.requestPasswordReset(email.trim());
      setEmailSent(true);
      showSuccessToast('Se o email estiver registrado, você receberá um link de recuperação');
    } catch (error: any) {
      showErrorToast(error.message || 'Erro ao solicitar recuperação de senha');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const isFormValid = email.trim() !== '';

  if (emailSent) {
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
              <Icon name="mail-outline" size={64} color="#007AFF" />
              <Text style={styles.title}>Email Enviado</Text>
              <Text style={styles.subtitle}>
                Se o email estiver registrado em nossa base de dados, você receberá um link para redefinir sua senha.
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.instructionText}>
                Verifique sua caixa de entrada e siga as instruções no email para redefinir sua senha.
              </Text>

              <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
                <Text style={styles.backButtonText}>Voltar ao Login</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resendButton} 
                onPress={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
              >
                <Text style={styles.resendButtonText}>Enviar novamente</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

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
            <TouchableOpacity style={styles.backIcon} onPress={navigateToLogin}>
              <Icon name="arrow-back-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Icon name="lock-closed-outline" size={64} color="#007AFF" />
            <Text style={styles.title}>Esqueceu sua senha?</Text>
            <Text style={styles.subtitle}>
              Não se preocupe! Digite seu email e enviaremos um link para redefinir sua senha.
            </Text>
          </View>

          <View style={styles.form}>
            <FormInput
              label="Email"
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              required
              leftIcon="mail-outline"
              validation={validators.email}
              testID="email-input"
            />

            <TouchableOpacity
              style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
              onPress={handleRequestPasswordReset}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <LoadingSpinner color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Enviar Link de Recuperação</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backToLoginButton} onPress={navigateToLogin}>
              <Text style={styles.backToLoginText}>
                Lembrou da senha? <Text style={styles.loginLink}>Fazer Login</Text>
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
    position: 'relative',
  },
  backIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    marginTop: 40,
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
  instructionText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#A9D3FF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: 16,
    color: '#007AFF',
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

export default ForgotPasswordScreen;
