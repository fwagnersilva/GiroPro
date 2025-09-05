import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext.web';

interface Props {
  navigation?: any;
}

const LoginScreenSimple: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email.trim()) {
      alert('Por favor, informe seu email');
      return;
    }

    if (!senha.trim()) {
      alert('Por favor, informe sua senha');
      return;
    }

    try {
      setLoading(true);
      await signIn({ email: email.trim(), senha });
    } catch (error: any) {
      alert(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.trim() !== '' && senha.trim() !== '';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>GiroPro</Text>
          <Text style={styles.subtitle}>Gestão financeira para motoristas</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={true}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              !isFormValid && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!isFormValid || loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          {/* Test Credentials */}
          <View style={styles.testCredentials}>
            <Text style={styles.testText}>Credenciais de teste:</Text>
            <Text style={styles.testText}>Email: test@test.com</Text>
            <Text style={styles.testText}>Senha: 123456</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
    }),
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8E8E93',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        outline: 'none',
      },
    }),
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 52,
  },
  loginButtonDisabled: {
    backgroundColor: '#A9D3FF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  testCredentials: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  testText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default LoginScreenSimple;

