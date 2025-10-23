import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FocusAwareStatusBar } from '@/components/ui';
import { signIn } from '@/lib/auth';
import { loginApi } from '@/services/authService';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await loginApi({ email, senha });
      
      signIn({
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        expiresAt: response.tokens.expiresAt,
      });
      
      router.replace('/(app)/dashboard');
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err?.response?.data?.message || 'Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar />
      
      <View style={styles.content}>
        <Text style={styles.title}>GiroPro</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={styles.link}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  linksContainer: {
    gap: 12,
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 14,
  },
  error: {
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
    padding: 12,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
  },
});
