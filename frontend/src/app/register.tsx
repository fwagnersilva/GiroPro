import { useRouter } from 'expo-router';
import React from 'react';

import type { RegisterFormProps } from '@/components/register-form';
import { RegisterForm } from '@/components/register-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { registerApi } from '@/services/authService';

export default function Register() {
  const router = useRouter();

  const onSubmit: RegisterFormProps['onSubmit'] = async (data) => {
    try {
      await registerApi({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        dataNascimento: data.dateOfBirth,
        cidade: data.city,
      });
      alert('Cadastro realizado com sucesso! Faça login.');
      router.replace('/login');
    } catch (error) {
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
