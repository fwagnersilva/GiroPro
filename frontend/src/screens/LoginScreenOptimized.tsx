import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import FormInput, { validators, combineValidators } from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import { layouts, typography, spacing } from '../styles/responsive';
import { isWeb, isDesktop, platformStyles } from '../utils/platformUtils';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreenOptimized: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn } = useAuth();

  // Animação para entrada da tela (otimizada para performance)
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(50), []);

  React.useEffect(() => {
    // Reduzir duração da animação para web
    const duration = isWeb() ? 400 : 800;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLogin = useCallback(async () => {
    // Validação básica
    if (!email.trim()) {
      if (isWeb()) {
        alert('Por favor, informe seu email');
      } else {
        Alert.alert('Erro', 'Por favor, informe seu email');
      }
      return;
    }

    if (!senha.trim()) {
      if (isWeb()) {
        alert('Por favor, informe sua senha');
      } else {
        Alert.alert('Erro', 'Por favor, informe sua senha');
      }
      return;
    }

    try {
      setLoading(true);
      await signIn({ email: email.trim(), senha });
    } catch (error: any) {
      const message = error.message || 'Erro ao fazer login';
      if (isWeb()) {
        alert(message);
      } else {
        Alert.alert('Erro', message);
      }
    } finally {
      setLoading(false);
    }
  }, [email, senha, signIn]);

  const navigateToRegister = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const isFormValid = useMemo(() => 
    email.trim() !== '' && senha.trim() !== '', 
    [email, senha]
  );

  // Estilos responsivos
  const responsiveStyles = useMemo(() => StyleSheet.create({
    container: {
      ...layouts.auth.container,
      // Otimizações específicas para web
      ...platformStyles.web({
        minHeight: '100vh',
        justifyContent: 'center',
      }),
    },
    
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
      ...platformStyles.web({
        paddingHorizontal: isDesktop() ? spacing.xl : spacing.md,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
      }),
    },
    
    content: {
      ...layouts.auth.content,
    },
    
    header: {
      ...layouts.auth.header,
    },
    
    title: {
      ...typography.h1,
      color: '#007AFF',
      textAlign: 'center',
      ...platformStyles.web({
        fontSize: isDesktop() ? 42 : 36,
      }),
    },
    
    subtitle: {
      ...typography.body,
      color: '#8E8E93',
      textAlign: 'center',
    },
    
    form: {
      ...layouts.auth.form,
    },
    
    rememberMeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
      ...platformStyles.web({
        cursor: 'pointer',
      }),
    },
    
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: '#E5E5EA',
      borderRadius: 4,
      marginRight: spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
      ...platformStyles.web({
        cursor: 'pointer',
      }),
    },
    
    checkboxChecked: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
    },
    
    checkmark: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
    
    rememberMeText: {
      ...typography.body,
      color: '#333333',
    },
    
    button: {
      backgroundColor: '#007AFF',
      borderRadius: 8,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      marginBottom: spacing.md,
      minHeight: 48,
      // Sombras otimizadas por plataforma
      ...platformStyles.select({
        web: {
          boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        },
        mobile: {
          shadowColor: '#007AFF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
      }),
    },
    
    buttonDisabled: {
      backgroundColor: '#B0B0B0',
      ...platformStyles.select({
        web: {
          boxShadow: 'none',
          cursor: 'not-allowed',
        },
        mobile: {
          shadowOpacity: 0,
          elevation: 0,
        },
      }),
    },
    
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    
    forgotPasswordButton: {
      alignItems: 'center',
      padding: spacing.sm,
      marginBottom: spacing.lg,
      ...platformStyles.web({
        cursor: 'pointer',
      }),
    },
    
    forgotPasswordText: {
      color: '#007AFF',
      fontSize: 16,
      ...platformStyles.web({
        textDecoration: 'underline',
      }),
    },
    
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#E5E5EA',
    },
    
    dividerText: {
      marginHorizontal: spacing.md,
      fontSize: 14,
      color: '#8E8E93',
    },
    
    linkButton: {
      alignItems: 'center',
      padding: spacing.sm,
      ...platformStyles.web({
        cursor: 'pointer',
      }),
    },
    
    linkText: {
      color: '#8E8E93',
      fontSize: 16,
      textAlign: 'center',
    },
    
    linkTextBold: {
      color: '#007AFF',
      fontWeight: '600',
      ...platformStyles.web({
        textDecoration: 'underline',
      }),
    },
  }), []);

  // Componente otimizado para diferentes plataformas
  const KeyboardAvoidingContainer = isWeb() ? View : KeyboardAvoidingView;
  const keyboardProps = isWeb() ? {} : {
    behavior: Platform.OS === 'ios' ? 'padding' : 'height',
  };

  return (
    <KeyboardAvoidingContainer
      style={responsiveStyles.container}
      {...keyboardProps}
    >
      <ScrollView 
        contentContainerStyle={responsiveStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        // Otimizações para web
        {...platformStyles.web({
          scrollBehavior: 'smooth',
        })}
      >
        <Animated.View
          style={[
            responsiveStyles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={responsiveStyles.header}>
            <Text style={responsiveStyles.title}>GiroPro</Text>
            <Text style={responsiveStyles.subtitle}>
              Gestão financeira para motoristas
            </Text>
          </View>

          <View style={responsiveStyles.form}>
            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="mail-outline"
              validation={combineValidators(validators.required, validators.email)}
              required
            />

            <FormInput
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              placeholder="Digite sua senha"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={togglePasswordVisibility}
              validation={combineValidators(validators.required, validators.minLength(6))}
              required
            />

            <TouchableOpacity
              style={responsiveStyles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[
                responsiveStyles.checkbox, 
                rememberMe && responsiveStyles.checkboxChecked
              ]}>
                {rememberMe && (
                  <Text style={responsiveStyles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={responsiveStyles.rememberMeText}>Lembrar-me</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                responsiveStyles.button,
                (!isFormValid || loading) && responsiveStyles.buttonDisabled
              ]}
              onPress={handleLogin}
              disabled={!isFormValid || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <LoadingSpinner size="small" color="#FFFFFF" />
              ) : (
                <Text style={responsiveStyles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={responsiveStyles.forgotPasswordButton}
              onPress={() => {
                const message = 'Funcionalidade em desenvolvimento';
                if (isWeb()) {
                  alert(message);
                } else {
                  Alert.alert('Em breve', message);
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={responsiveStyles.forgotPasswordText}>
                Esqueceu sua senha?
              </Text>
            </TouchableOpacity>

            <View style={responsiveStyles.divider}>
              <View style={responsiveStyles.dividerLine} />
              <Text style={responsiveStyles.dividerText}>ou</Text>
              <View style={responsiveStyles.dividerLine} />
            </View>

            <TouchableOpacity
              style={responsiveStyles.linkButton}
              onPress={navigateToRegister}
              activeOpacity={0.7}
            >
              <Text style={responsiveStyles.linkText}>
                Não tem conta?{' '}
                <Text style={responsiveStyles.linkTextBold}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingContainer>
  );
};

export default LoginScreenOptimized;

