import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import LoginForm from '../src/components/LoginForm';
import { useAuth } from '../src/contexts/AuthContext';

const Login = () => {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    clearError(); // Limpa erros anteriores ao tentar novo login
    try {
      await login({ email, password, rememberMe });
      // O redirecionamento para /dashboard será tratado pelo ProtectedRoute ou pelo _layout
    } catch (err) {
      // Erro já é setado no AuthContext, apenas logamos aqui
      console.error('Login failed:', err);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implementar navegação para tela de recuperação de senha
    console.log('Forgot password clicked');
  };

  return (
    <View style={{ flex: 1 }}>
      <LoginForm
        onLogin={handleLogin}
        onForgotPassword={handleForgotPassword}
        loading={isLoading}
        error={error || undefined}
      />
    </View>
  );
};

export default Login;
