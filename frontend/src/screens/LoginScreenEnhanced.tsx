import React, { useState, useRef, useEffect } from 'react';
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
  StatusBar,
  Appearance,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import EnhancedFormInput from '../components/EnhancedFormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import { lightTheme, darkTheme, components, spacing, borderRadius } from '../theme/tokens';
import { useResponsiveStyles } from '../hooks/useResponsiveLayout';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

// Validadores melhorados
const validators = {
  required: (value: string) => {
    return value.trim() === '' ? 'Este campo é obrigatório' : null;
  },
  
  email: (value: string) => {
    if (value.trim() === '') return null;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? null : 'Por favor, insira um email válido';
  },
  
  password: (value: string) => {
    if (value.trim() === '') return null;
    if (value.length < 6) return 'A senha deve ter pelo menos 6 caracteres';
    return null;
  },
};

const combineValidators = (...validators: Array<(value: string) => string | null>) => {
  return (value: string) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
};

const LoginScreenEnhanced: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { signIn } = useAuth();
  
  const { layout, getResponsivePadding, getResponsiveFontSize, getMaxWidth } = useResponsiveStyles();
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Detectar tema do sistema
  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    setIsDarkMode(colorScheme === 'dark');

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription?.remove();
  }, []);

  // Animação de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    // Validação
    const emailError = combineValidators(validators.required, validators.email)(email);
    const passwordError = combineValidators(validators.required, validators.password)(senha);

    if (emailError || passwordError) {
      Alert.alert('Erro de Validação', emailError || passwordError || 'Por favor, verifique os dados inseridos');
      return;
    }

    try {
      setLoading(true);
      
      // Animação do botão
      Animated.sequence([
        Animated.timing(buttonScaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      await signIn({ email: email.trim(), senha });
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message || 'Não foi possível fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar Senha',
      'Funcionalidade em desenvolvimento. Em breve você poderá recuperar sua senha por email.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const isFormValid = email.trim() !== '' && senha.trim() !== '';

  // Estilos responsivos
  const responsiveStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: getResponsivePadding(),
      paddingVertical: layout.deviceType === 'desktop' ? spacing[12] : spacing[8],
    },
    
    content: {
      backgroundColor: theme.colors.surface,
      borderRadius: layout.deviceType === 'desktop' ? borderRadius.xl : borderRadius.lg,
      padding: layout.deviceType === 'desktop' ? spacing[8] : spacing[6],
      maxWidth: getMaxWidth(),
      alignSelf: 'center',
      width: '100%',
      ...components.card.base(theme),
    },
    
    header: {
      alignItems: 'center',
      marginBottom: layout.deviceType === 'desktop' ? spacing[10] : spacing[8],
    },
    
    logoContainer: {
      alignItems: 'center',
      marginBottom: spacing[4],
    },
    
    logo: {
      width: layout.deviceType === 'desktop' ? 80 : 60,
      height: layout.deviceType === 'desktop' ? 80 : 60,
      backgroundColor: theme.colors.primary,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[4],
    },
    
    title: {
      fontSize: getResponsiveFontSize(layout.deviceType === 'desktop' ? 42 : 36),
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: spacing[2],
      textAlign: 'center',
    },
    
    subtitle: {
      fontSize: getResponsiveFontSize(layout.deviceType === 'desktop' ? 20 : 18),
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: getResponsiveFontSize(layout.deviceType === 'desktop' ? 28 : 24),
    },
    
    form: {
      width: '100%',
    },
    
    optionsContainer: {
      flexDirection: layout.deviceType === 'mobile' ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: layout.deviceType === 'mobile' ? 'flex-start' : 'center',
      marginBottom: spacing[6],
      gap: layout.deviceType === 'mobile' ? spacing[3] : 0,
    },
    
    rememberMeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    rememberMeText: {
      marginLeft: spacing[2],
      fontSize: getResponsiveFontSize(16),
      color: theme.colors.text,
    },
    
    forgotPasswordText: {
      fontSize: getResponsiveFontSize(16),
      color: theme.colors.primary,
      fontWeight: '500',
    },
    
    loginButton: {
      ...components.button.base,
      ...components.button.variants.primary(theme),
      ...components.button.sizes[layout.deviceType === 'desktop' ? 'lg' : 'md'],
      marginBottom: spacing[4],
    },
    
    loginButtonDisabled: {
      backgroundColor: theme.colors.textTertiary,
      opacity: 0.6,
    },
    
    loginButtonText: {
      color: theme.colors.text === theme.colors.text ? '#FFFFFF' : theme.colors.text,
      fontSize: getResponsiveFontSize(18),
      fontWeight: '600',
    },
    
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing[4],
    },
    
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    
    dividerText: {
      marginHorizontal: spacing[4],
      fontSize: getResponsiveFontSize(16),
      color: theme.colors.textSecondary,
    },
    
    registerButton: {
      alignItems: 'center',
      paddingVertical: spacing[3],
    },
    
    registerButtonText: {
      fontSize: getResponsiveFontSize(16),
      color: theme.colors.text,
    },
    
    registerLink: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    
    themeToggle: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 50 : 30,
      right: 20,
      padding: spacing[2],
      borderRadius: borderRadius.full,
      backgroundColor: theme.colors.surfaceVariant,
    },
  });

  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background}
      />
      
      <KeyboardAvoidingView
        style={responsiveStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Toggle de Tema */}
        <TouchableOpacity
          style={responsiveStyles.themeToggle}
          onPress={() => setIsDarkMode(!isDarkMode)}
        >
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        <ScrollView 
          contentContainerStyle={responsiveStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
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
            {/* Header */}
            <View style={responsiveStyles.header}>
              <Animated.View 
                style={[
                  responsiveStyles.logoContainer,
                  { transform: [{ scale: logoScaleAnim }] }
                ]}
              >
                <View style={responsiveStyles.logo}>
                  <Ionicons 
                    name="car-sport" 
                    size={layout.deviceType === 'desktop' ? 40 : 30} 
                    color="#FFFFFF" 
                  />
                </View>
              </Animated.View>
              
              <Text style={responsiveStyles.title}>GiroPro</Text>
              <Text style={responsiveStyles.subtitle}>
                Gestão financeira inteligente{'\n'}para motoristas profissionais
              </Text>
            </View>

            {/* Formulário */}
            <View style={responsiveStyles.form}>
              <EnhancedFormInput
                label="Email"
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                required
                leftIcon="mail-outline"
                validation={combineValidators(validators.required, validators.email)}
                testID="email-input"
                isDark={isDarkMode}
                helperText="Use o email cadastrado na sua conta"
              />

              <EnhancedFormInput
                label="Senha"
                placeholder="Digite sua senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPassword}
                autoComplete="password"
                required
                leftIcon="lock-closed-outline"
                rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                onRightIconPress={togglePasswordVisibility}
                validation={combineValidators(validators.required, validators.password)}
                testID="password-input"
                isDark={isDarkMode}
                helperText="Mínimo de 6 caracteres"
              />

              {/* Opções */}
              <View style={responsiveStyles.optionsContainer}>
                <TouchableOpacity
                  style={responsiveStyles.rememberMeContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={rememberMe ? "checkbox" : "square-outline"}
                    size={24}
                    color={rememberMe ? theme.colors.primary : theme.colors.textSecondary}
                  />
                  <Text style={responsiveStyles.rememberMeText}>Lembrar-me</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleForgotPassword}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={responsiveStyles.forgotPasswordText}>
                    Esqueceu sua senha?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Botão de Login */}
              <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                <TouchableOpacity
                  style={[
                    responsiveStyles.loginButton,
                    !isFormValid && responsiveStyles.loginButtonDisabled
                  ]}
                  onPress={handleLogin}
                  disabled={!isFormValid || loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <LoadingSpinner color="#FFFFFF" />
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={responsiveStyles.loginButtonText}>Entrar</Text>
                      <Ionicons 
                        name="arrow-forward" 
                        size={20} 
                        color="#FFFFFF" 
                        style={{ marginLeft: spacing[2] }}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>

              {/* Divider */}
              <View style={responsiveStyles.dividerContainer}>
                <View style={responsiveStyles.divider} />
                <Text style={responsiveStyles.dividerText}>ou</Text>
                <View style={responsiveStyles.divider} />
              </View>

              {/* Botão de Registro */}
              <TouchableOpacity 
                style={responsiveStyles.registerButton} 
                onPress={navigateToRegister}
                activeOpacity={0.7}
              >
                <Text style={responsiveStyles.registerButtonText}>
                  Não tem conta? {' '}
                  <Text style={responsiveStyles.registerLink}>Cadastre-se gratuitamente</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default LoginScreenEnhanced;

