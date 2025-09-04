import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import { InteractiveButton } from '../components/InteractiveComponents';
import { lightTheme } from '../theme/enhancedTokens';
import { CarIcon } from '../components/EnhancedIcons';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreenRefactored: React.FC<Props> = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();

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

  const handleRegister = useCallback(async () => {
    setError('');

    // Validação adicional antes do envio
    if (!nome.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Erro', 'Email é obrigatório');
      return;
    }

    if (!senha.trim()) {
      Alert.alert('Erro', 'Senha é obrigatória');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    // Validação de senha usando o mesmo padrão do backend
    const passwordValidation = validators.password(senha);
    if (passwordValidation) {
      Alert.alert('Erro', passwordValidation);
      return;
    }

    setLoading(true);
    try {
      await signUp({ nome: nome.trim(), email: email.trim(), senha });
      Alert.alert(
        'Sucesso',
        'Conta criada com sucesso! Você pode fazer login agora.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta');
      Alert.alert('Erro', error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }, [nome, email, senha, confirmarSenha, signUp, navigation]);

  const navigateToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const isFormValid = useMemo(() => {
    return (
      nome.trim() !== '' &&
      email.trim() !== '' &&
      senha.trim() !== '' &&
      confirmarSenha.trim() !== '' &&
      senha === confirmarSenha &&
      validators.email(email) === null &&
      validators.password(senha) === null
    );
  }, [nome, email, senha, confirmarSenha]);

  // Função para mostrar os critérios de senha
  const getPasswordCriteria = () => {
    const criteria = [
      { text: 'Mínimo de 8 caracteres', valid: senha.length >= 8 },
      { text: 'Pelo menos 1 letra minúscula', valid: /[a-z]/.test(senha) },
      { text: 'Pelo menos 1 letra maiúscula', valid: /[A-Z]/.test(senha) },
      { text: 'Pelo menos 1 número', valid: /\d/.test(senha) },
      { text: 'Pelo menos 1 caractere especial (@$!%*?&)', valid: /[@$!%*?&]/.test(senha) },
    ];

    return criteria;
  };

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
              Crie sua conta e comece a gerenciar suas viagens
            </Text>
          </View>

          <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.formTitle, { color: theme.colors.textPrimary }]}>
              Criar nova conta
            </Text>

            <FormInput
              label="Nome Completo"
              required
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome completo"
              autoCapitalize="words"
              autoCorrect={false}
              leftIcon="person-outline"
              validation={validators.required}
              testID="name-input"
            />

            <FormInput
              label="E-mail"
              required
              value={email}
              onChangeText={setEmail}
              placeholder="seu.email@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
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
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="lock-closed-outline"
              validation={combineValidators(validators.required, validators.password)}
              testID="password-input"
            />

            {/* Critérios de Senha */}
            {senha.length > 0 && (
              <View style={[styles.passwordCriteria, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text style={[styles.criteriaTitle, { color: theme.colors.textPrimary }]}>
                  Critérios da senha:
                </Text>
                {getPasswordCriteria().map((criterion, index) => (
                  <View key={index} style={styles.criteriaItem}>
                    <Text style={[
                      styles.criteriaIcon,
                      { color: criterion.valid ? theme.colors.success : theme.colors.textTertiary }
                    ]}>
                      {criterion.valid ? '✓' : '○'}
                    </Text>
                    <Text style={[
                      styles.criteriaText,
                      { color: criterion.valid ? theme.colors.success : theme.colors.textSecondary }
                    ]}>
                      {criterion.text}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <FormInput
              label="Confirmar Senha"
              required
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              placeholder="Confirme sua senha"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="lock-closed-outline"
              validation={combineValidators(
                validators.required,
                (value) => (value === senha ? null : 'As senhas não coincidem')
              )}
              testID="confirm-password-input"
            />

            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorLight }]}>
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {error}
                </Text>
              </View>
            ) : null}

            <InteractiveButton
              variant="primary"
              size="lg"
              onPress={handleRegister}
              disabled={!isFormValid || loading}
              style={styles.registerButton}
              testID="register-button"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
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
              onPress={navigateToLogin}
              style={styles.loginButton}
              testID="login-button"
            >
              Já tenho conta
            </InteractiveButton>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.textTertiary }]}>
              Ao criar uma conta, você concorda com nossos{' '}
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
    fontWeight: '700' as any,
    marginLeft: lightTheme.spacing[3],
  },
  subtitle: {
    fontSize: lightTheme.typography.fontSize.base,
    textAlign: 'center',
    paddingHorizontal: lightTheme.spacing[4],
  },
  formContainer: {
    padding: lightTheme.spacing[6],
    borderRadius: lightTheme.borderRadius.xl,
    marginBottom: lightTheme.spacing[6],
    ...lightTheme.shadows.lg,
  },
  formTitle: {
    fontSize: lightTheme.typography.fontSize.xl,
    fontWeight: '600' as any,
    textAlign: 'center',
    marginBottom: lightTheme.spacing[6],
  },
  passwordCriteria: {
    padding: lightTheme.spacing[4],
    borderRadius: lightTheme.borderRadius.md,
    marginBottom: lightTheme.spacing[4],
  },
  criteriaTitle: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontWeight: '600' as any,
    marginBottom: lightTheme.spacing[2],
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: lightTheme.spacing[1],
  },
  criteriaIcon: {
    fontSize: lightTheme.typography.fontSize.sm,
    marginRight: lightTheme.spacing[2],
    width: 16,
  },
  criteriaText: {
    fontSize: lightTheme.typography.fontSize.xs,
    flex: 1,
  },
  errorContainer: {
    padding: lightTheme.spacing[3],
    borderRadius: lightTheme.borderRadius.md,
    marginBottom: lightTheme.spacing[4],
  },
  errorText: {
    fontSize: lightTheme.typography.fontSize.sm,
    textAlign: 'center',
  },
  registerButton: {
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
  loginButton: {
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
    fontWeight: '500' as any,
  },
});

export default RegisterScreenRefactored;

