import React, { useCallback, useMemo } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import LoginHeader from '../components/LoginHeader';
import LoginForm from '../components/LoginForm';
import Alert from '../utils/alert';
import { showErrorToast } from '../utils/toastUtils';
import { useLoginState } from '../hooks/useLoginState';
import { useLoginValidation } from '../hooks/useLoginValidation';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn } = useAuth();
  
  // Hooks customizados para gerenciar estado e validação
  const {
    email,
    senha,
    loading,
    showPassword,
    rememberMe,
    setEmail,
    setSenha,
    setLoading,
    togglePasswordVisibility,
    toggleRememberMe,
    clearPassword,
    initializeRememberMe,
  } = useLoginState();

  const { isFormValid } = useLoginValidation({ email, senha });

  // Animação para entrada da tela - memoizada para performance
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(50), []);

  React.useEffect(() => {
    // Inicializar "Lembrar-me"
    initializeRememberMe();

    // Animação otimizada com menor duração
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600, // Reduzido de 800ms para 600ms
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600, // Reduzido de 800ms para 600ms
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, initializeRememberMe]);

  const handleLogin = useCallback(async () => {
    if (!isFormValid) {
      Alert.alert('Erro', 'Por favor, verifique os dados informados');
      return;
    }

    try {
      setLoading(true);
      await signIn({ email: email.trim(), senha }, rememberMe);
    } catch (error: any) {
      // Limpar campo de senha após erro
      clearPassword();
      
      // Mensagens de erro mais específicas
      const getErrorMessage = (errorMsg: string): string => {
        if (errorMsg.includes('Credenciais inválidas') || 
            errorMsg.includes('Email ou senha incorretos') ||
            errorMsg.includes('Usuário não encontrado')) {
          return "Email ou senha incorretos. Verifique suas credenciais e tente novamente.";
        } else if (errorMsg.includes('Conta temporariamente bloqueada')) {
          return "Conta temporariamente bloqueada devido a muitas tentativas de login. Tente novamente em 15 minutos.";
        } else if (errorMsg.includes('Conta inativa')) {
          return "Sua conta está inativa ou suspensa. Entre em contato com o suporte.";
        } else if (errorMsg.includes('Email inválido')) {
          return "Formato de email inválido. Verifique e tente novamente.";
        } else if (errorMsg.includes('rede') || errorMsg.includes('timeout')) {
          return "Problema de conexão. Verifique sua internet e tente novamente.";
        }
        return errorMsg || "Erro inesperado ao fazer login. Tente novamente.";
      };
      
      showErrorToast(getErrorMessage(error.message));
    } finally {
      setLoading(false);
    }
  }, [email, senha, rememberMe, isFormValid, signIn, setLoading, clearPassword]);

  const navigateToRegister = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  const navigateToForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const toggleRememberMe = useCallback(() => {
    setRememberMe(!rememberMe);
  }, [rememberMe]);

  const isFormValid = useMemo(() => {
    return email.trim() !== '' && senha.trim() !== '';
  }, [email, senha]);

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
          <LoginHeader />

          <LoginForm
            email={email}
            senha={senha}
            loading={loading}
            showPassword={showPassword}
            rememberMe={rememberMe}
            isFormValid={isFormValid}
            onEmailChange={setEmail}
            onPasswordChange={setSenha}
            onTogglePasswordVisibility={togglePasswordVisibility}
            onToggleRememberMe={toggleRememberMe}
            onLogin={handleLogin}
            onForgotPassword={navigateToForgotPassword}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={navigateToRegister}>
            <Text style={styles.registerButtonText}>Não tem conta? <Text style={styles.registerLink}>Cadastre-se</Text></Text>
          </TouchableOpacity>
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  registerButton: {
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  registerLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default LoginScreen;

