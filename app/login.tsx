import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import LoginForm from '../src/components/LoginForm';

const Login = () => {
  const router = useRouter();

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    try {
      // TODO: Implementar lógica de autenticação
      console.log('Login attempt:', { email, password, rememberMe });
      
      // Simulação de login bem-sucedido
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implementar navegação para tela de recuperação de senha
    console.log('Forgot password clicked');
  };

  return (
    <View className="flex-1">
      <LoginForm
        onLogin={handleLogin}
        onForgotPassword={handleForgotPassword}
        loading={false}
      />
    </View>
  );
};

export default Login;

