import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';
import { useNavigation } from '@react-navigation/native';

import { Button, ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  nome: z.string({ required_error: 'Nome é obrigatório' }).min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z
    .string({
      required_error: 'Email é obrigatório',
    })
    .email('Formato de email inválido'),
  senha: z
    .string({
      required_error: 'Senha é obrigatória',
    })
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
  dateOfBirth: z.string().optional(), // Simplificado, o backend espera dataNascimento
  city: z.string().optional(), // Simplificado, o backend espera cidade
});

export type FormType = z.infer<typeof schema>;

export type RegisterFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const RegisterForm = ({ onSubmit = () => {} }: RegisterFormProps) => {
  const navigation = useNavigation();
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
          <Text
            testID="form-title"
            className="pb-6 text-center text-4xl font-bold"
          >
            Criar Conta GiroPro
          </Text>
        </View>

        <ControlledInput
          testID="name-input"
          control={control}
          name="nome"
          label="Nome Completo"
        />
        <ControlledInput
          testID="email-input"
          control={control}
          name="email"
          label="Email"
        />
        <ControlledInput
          testID="password-input"
          control={control}
          name="senha"
          label="Senha"
          placeholder="***"
          secureTextEntry={true}
        />
        <ControlledInput
          testID="dateOfBirth-input"
          control={control}
          name="dateOfBirth"
          label="Data de Nascimento (opcional)"
          placeholder="AAAA-MM-DD"
        />
        <ControlledInput
          testID="city-input"
          control={control}
          name="city"
          label="Cidade (opcional)"
        />

        <Button
          testID="register-button"
          label="Cadastrar"
          onPress={handleSubmit(onSubmit)}
        />
        
        <View className="mt-4 items-center">
          <Text
            className="text-blue-600 text-sm"
            onPress={() => navigation.navigate("login")}
          >
            Já tenho conta
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
