import { useRouter } from 'expo-router';
import React from 'react';
import type { RegisterFormProps } from '@/components/register-form';
import { RegisterForm } from '@/components/register-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { registerApi } from '@/services/authService';
import { signIn } from '@/lib/auth';

export default function Register() {
  const router = useRouter();
  const onSubmit: RegisterFormProps['onSubmit'] = async (data) => {
    try {
      const response = await registerApi({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        dataNascimento: data.dateOfBirth,
        cidade: data.city,
      });
      
      console.log('Resposta do registro:', response);
      console.log('Tokens:', response.tokens);
      
      signIn({
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        expiresAt: response.tokens.expiresAt,
      });
      
      console.log('Token salvo. tokenCache:', window.tokenCache);
      
      alert('Cadastro realizado com sucesso!');
      router.replace('/(app)');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert(error.message || 'Erro ao cadastrar. Tente novamente.');
    }
  };
  
  return (
    <>
      <FocusAwareStatusBar />
      <RegisterForm onSubmit={onSubmit} />
    </>
  );
}
