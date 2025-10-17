import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';
import { useNavigation } from '@react-navigation/native';
import { Button, ControlledInput, Text, View } from '@/components/ui';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email é obrigatório',
    })
    .email('Formato de email inválido'),
  password: z
    .string({
      required_error: 'Senha é obrigatória',
    })
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  errorMessage?: string;
  isLoading?: boolean;
};

export const LoginForm = ({ 
  onSubmit = () => {}, 
  errorMessage = '',
  isLoading = false 
}: LoginFormProps) => {
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
            GiroPro
          </Text>
        </View>

        {errorMessage ? (
          <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4">
            <Text className="text-red-700 text-center">{errorMessage}</Text>
          </View>
        ) : null}

        <ControlledInput
          testID="email-input"
          control={control}
          name="email"
          label="Login (Email)"
        />
        <ControlledInput
          testID="password-input"
          control={control}
          name="password"
          label="Senha"
          placeholder="***"
          secureTextEntry={true}
        />
        <Button
          testID="login-button"
          label={isLoading ? "Entrando..." : "Login"}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
        <View className="mt-4 items-center">
          <Text
            className="text-blue-600 text-sm"
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            Esqueceu sua senha?
          </Text>
          <Text
            className="text-blue-600 text-sm mt-2"
            onPress={() => navigation.navigate("register")}
          >
            Criar Conta
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
