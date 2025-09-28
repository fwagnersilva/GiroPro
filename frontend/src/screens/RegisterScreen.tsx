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
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import FormInput from '../components/FormInput';
import { validators, combineValidators } from '../components/FormInput/FormInput.web';
import { showErrorToast } from '../utils/toastUtils';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para web

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation?: RegisterScreenNavigationProp; // Tornar opcional para web
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate(); // Hook para navegação web

  const handleRegister = useCallback(async () => {
    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      showErrorToast("Por favor, preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      showErrorToast("As senhas não coincidem");
      return;
    }

    if (senha.length < 8) {
      showErrorToast("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    setLoading(true);
    try {
      await signUp({ nome, email, senha });
      if (Platform.OS === 'web') {
        navigate('/login'); // Redirecionar para login na web após registro
      } else if (navigation) {
        navigation.navigate('Login'); // Redirecionar para Login no mobile
      }
    } catch (error: any) {
      showErrorToast(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }, [nome, email, senha, confirmarSenha, signUp, navigate, navigation]);

  const navigateToLogin = useCallback(() => {
    if (Platform.OS === 'web') {
      navigate('/login');
    } else if (navigation) {
      navigation.navigate('Login');
    }
  }, [navigate, navigation]);

  const isFormValid = useMemo(() => 
    nome.trim() !== '' && 
    email.trim() !== '' && 
    senha.trim() !== '' && 
    confirmarSenha.trim() !== '' && 
    senha === confirmarSenha && 
    senha.length >= 8,
    [nome, email, senha, confirmarSenha]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Cadastre-se no GiroPro</Text>
        </View>

        <View style={styles.form}>
          <FormInput
            label="Nome completo"
            placeholder="Nome completo"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            autoCorrect={false}
            leftIcon="person-outline"
            validation={validators.required}
            required
          />

          <FormInput
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="mail-outline"
            validation={combineValidators(validators.required, validators.email)}
            required
          />

          <FormInput
            label="Senha"
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="lock-closed-outline"
            validation={combineValidators(validators.required, validators.minLength(8))}
            required
          />

          <FormInput
            label="Confirmar senha"
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="lock-closed-outline"
            validation={(value: string) =>
              value.trim() === ''
                ? 'Este campo é obrigatório'
                : value !== senha
                ? 'As senhas não coincidem'
                : null
            }
            required
          />

          <TouchableOpacity
            style={[styles.button, (!isFormValid || loading) && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={!isFormValid || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={navigateToLogin}
          >
            <Text style={styles.linkText}>
              Já tem conta? Faça login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: { // Este estilo não será mais usado diretamente pelos TextInputs, mas pode ser mantido para referência ou para outros elementos
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    padding: 8,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default RegisterScreen;


