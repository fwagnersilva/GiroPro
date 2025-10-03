import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import RegisterForm from '../src/components/RegisterForm';
import { useAuth } from '../src/contexts/AuthContext';

const Register = () => {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();

  const handleRegister = async (nome: string, email: string, senha: string) => {
    clearError();
    try {
      await register({ nome, email, senha });
      // O redirecionamento será tratado pelo AuthContext
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <View style={{ flex: 1 }}>
      <RegisterForm
        onRegister={handleRegister}
        onBackToLogin={handleBackToLogin}
        loading={isLoading}
        error={error || undefined}
      />
    </View>
  );
};

export default Register;
