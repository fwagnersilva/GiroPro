import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { useAuth } from '@/lib';
import { loginApi } from '@/services/authService';

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const response = await loginApi({
        email: data.email,
        password: data.password,
      });

      signIn({
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        expiresAt: response.tokens.expiresAt,
      });

      router.push('/');
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      setErrorMessage(error.message || 'Não foi possível fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} errorMessage={errorMessage} isLoading={isLoading} />
    </>
  );
}
