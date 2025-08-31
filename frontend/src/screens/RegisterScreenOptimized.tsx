import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import FormInput from '../components/FormInput';
import { layouts, typography, spacing, components, grid } from '../styles/responsive';
import { isWeb, isDesktop, platformStyles, getSafePadding } from '../utils/platformUtils';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreenOptimized: React.FC<Props> = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = useCallback(async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      if (isWeb()) {
        alert('Por favor, preencha todos os campos');
      } else {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
      }
      return;
    }

    if (senha !== confirmarSenha) {
      if (isWeb()) {
        alert('As senhas não coincidem');
      } else {
        Alert.alert('Erro', 'As senhas não coincidem');
      }
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (senha.length < 8 || !passwordRegex.test(senha)) {
      const errorMessage = 'A senha deve ter pelo menos 8 caracteres, 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial (@$!%*?&).';
      if (isWeb()) {
        alert(errorMessage);
      } else {
        Alert.alert('Erro', errorMessage);
      }
      return;
    }

    setLoading(true);
    try {
      await signUp({ nome, email, senha });
    } catch (error: any) {
      const message = error.message || 'Erro ao criar conta';
      if (isWeb()) {
        alert(message);
      } else {
        Alert.alert('Erro', message);
      }
    } finally {
      setLoading(false);
    }
  }, [nome, email, senha, confirmarSenha, signUp]);

  const navigateToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const responsiveStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: layouts.dashboard.container.backgroundColor,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: spacing.md,
      ...platformStyles.web({
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
      }),
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.xxl,
    },
    title: {
      ...typography.h1,
      color: '#007AFF',
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.body,
      color: '#8E8E93',
      textAlign: 'center',
    },
    form: {
      width: '100%',
    },
    button: {
      backgroundColor: '#007AFF',
      borderRadius: components.button.borderRadius,
      padding: spacing.md,
      alignItems: 'center',
      marginBottom: spacing.md,
      ...platformStyles.web({
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        ':hover': {
          backgroundColor: '#0056b3',
        },
      }),
    },
    buttonDisabled: {
      backgroundColor: '#B0B0B0',
      ...platformStyles.web({
        cursor: 'not-allowed',
        ':hover': {
          backgroundColor: '#B0B0B0',
        },
      }),
    },
    buttonText: {
      color: '#FFFFFF',
      ...typography.buttonText,
    },
    linkButton: {
      alignItems: 'center',
      padding: spacing.xs,
      ...platformStyles.web({
        cursor: 'pointer',
        ':hover': {
          opacity: 0.7,
        },
      }),
    },
    linkText: {
      color: '#007AFF',
      ...typography.body,
    },
  }), []);

  return (
    <KeyboardAvoidingView
      style={responsiveStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={responsiveStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={responsiveStyles.header}>
          <Text style={responsiveStyles.title}>Criar Conta</Text>
          <Text style={responsiveStyles.subtitle}>Cadastre-se no GiroPro</Text>
        </View>

        <View style={responsiveStyles.form}>
          <FormInput
            placeholder="Nome completo"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            autoCorrect={false}
            leftIcon="person-outline"
          />

          <FormInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="mail-outline"
          />

          <FormInput
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="lock-closed-outline"
          />

          <FormInput
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="lock-closed-outline"
          />

          <TouchableOpacity
            style={[responsiveStyles.button, loading && responsiveStyles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={responsiveStyles.buttonText}>
                Criar conta
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={responsiveStyles.linkButton}
            onPress={navigateToLogin}
            activeOpacity={0.7}
          >
            <Text style={responsiveStyles.linkText}>
              Já tem conta? Faça login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreenOptimized;


