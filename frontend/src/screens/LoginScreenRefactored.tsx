import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import { InteractiveButton, InteractiveToggle } from '../components/InteractiveComponents';
import { lightTheme } from '../theme/enhancedTokens';
import { CarIcon } from '../components/EnhancedIcons';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreenRefactored: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn } = useAuth();

  const theme = lightTheme;

  // Animação para entrada da tela
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
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

  const handleLogin = async () => {
    // Validação básica
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu email');
      return;
    }

    if (!senha.trim()) {
      Alert.alert('Erro', 'Por favor, informe sua senha');
      return;
    }

    try {
      setLoading(true);
      await signIn({ email: email.trim(), senha });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login');
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

  const isFormValid = email.trim() !== '' && senha.trim() !== '';

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
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
            <View style={styles.logoContainer}>
              <CarIcon size={48} color={theme.colors.primary} />
              <Text style={[styles.appName, { color: theme.colors.primary }]}>
                GiroPro
              </Text>
            </View>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Gerencie suas viagens e despesas
            </Text>
          </View>

          <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.formTitle, { color: theme.colors.textPrimary }]}>
              Entrar na sua conta
            </Text>

            <FormInput
              label="E-mail"
              required
              value={email}
              onChangeText={setEmail}
              placeholder="seu.email@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              leftIcon="mail-outline"
              validation={combineValidators(validators.required, validators.email)}
              testID="email-input"
            />

            <FormInput
              label="Senha"
              required
              value={senha}
              onChangeText={setSenha}
              placeholder="Sua senha"
              secureTextEntry={!showPassword}
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={togglePasswordVisibility}
              validation={validators.required}
              testID="password-input"
            />

            <View style={styles.optionsContainer}>
              <View style={styles.rememberMeContainer}>
                <InteractiveToggle
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  size="sm"
                />
                <Text style={[styles.rememberMeText, { color: theme.colors.textSecondary }]}>
                  Lembrar de mim
                </Text>
              </View>

              <InteractiveButton
                variant="ghost"
                size="sm"
                onPress={() => {
                  Alert.alert(
                    'Recuperar Senha',
                    'Funcionalidade em desenvolvimento. Entre em contato com o suporte.',
                    [{ text: 'OK' }]
                  );
                }}
              >
                <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
                  Esqueci minha senha
                </Text>
              </InteractiveButton>
            </View>

            <InteractiveButton
              variant="primary"
              size="lg"
              onPress={handleLogin}
              disabled={!isFormValid || loading}
              style={styles.loginButton}
              testID="login-button"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </InteractiveButton>

            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.textTertiary }]}>
                ou
              </Text>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            </View>

            <InteractiveButton
              variant="outline"
              size="lg"
              onPress={navigateToRegister}
              style={styles.registerButton}
              testID="register-button"
            >
              Criar nova conta
            </InteractiveButton>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.textTertiary }]}>
              Ao continuar, você concorda com nossos{' '}
            </Text>
            <InteractiveButton
              variant="ghost"
              size="sm"
              onPress={() => {
                Alert.alert('Termos de Uso', 'Funcionalidade em desenvolvimento.');
              }}
            >
              <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                Termos de Uso
              </Text>
            </InteractiveButton>
            <Text style={[styles.footerText, { color: theme.colors.textTertiary }]}>
              {' '}e{' '}
            </Text>
            <InteractiveButton
              variant="ghost"
              size="sm"
              onPress={() => {
                Alert.alert('Política de Privacidade', 'Funcionalidade em desenvolvimento.');
              }}
            >
              <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                Política de Privacidade
              </Text>
            </InteractiveButton>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: lightTheme.spacing[4],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: lightTheme.spacing[8],
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing[2],
  },
  appName: {
    fontSize: lightTheme.typography.fontSize['4xl'],
    fontWeight: lightTheme.typography.fontWeight.bold,
    marginLeft: lightTheme.spacing[3],
  },
  subtitle: {
    fontSize: lightTheme.typography.fontSize.base,
    textAlign: 'center',
  },
  formContainer: {
    padding: lightTheme.spacing[6],
    borderRadius: lightTheme.borderRadius.xl,
    marginBottom: lightTheme.spacing[6],
    ...lightTheme.shadows.lg,
  },
  formTitle: {
    fontSize: lightTheme.typography.fontSize.xl,
    fontWeight: lightTheme.typography.fontWeight.semibold,
    textAlign: 'center',
    marginBottom: lightTheme.spacing[6],
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: lightTheme.spacing[6],
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: lightTheme.typography.fontSize.sm,
    marginLeft: lightTheme.spacing[2],
  },
  forgotPasswordText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: lightTheme.typography.fontWeight.medium,
  },
  loginButton: {
    marginBottom: lightTheme.spacing[4],
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: lightTheme.spacing[4],
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: lightTheme.typography.fontSize.sm,
    paddingHorizontal: lightTheme.spacing[4],
  },
  registerButton: {
    marginTop: lightTheme.spacing[2],
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: lightTheme.spacing[4],
  },
  footerText: {
    fontSize: lightTheme.typography.fontSize.xs,
    textAlign: 'center',
  },
  linkText: {
    fontSize: lightTheme.typography.fontSize.xs,
    fontWeight: lightTheme.typography.fontWeight.medium,
  },
});

export default LoginScreenRefactored;

