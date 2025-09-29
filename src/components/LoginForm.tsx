import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Input from './Input';
import Button from './Button';

interface LoginFormProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => void;
  onForgotPassword: () => void;
  loading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onForgotPassword,
  loading = false,
  error
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onLogin(email, password, rememberMe);
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <View className="flex-1 justify-center px-6 py-8 bg-white">
      {/* Logo e Título */}
      <View className="items-center mb-8">
        <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
          <Text className="text-white text-2xl font-bold">GP</Text>
        </View>
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo de volta
        </Text>
        <Text className="text-gray-600 text-center">
          Entre com suas credenciais para acessar sua conta
        </Text>
      </View>

      {/* Formulário */}
      <View className="w-full max-w-sm mx-auto">
        {/* Campo Email */}
        <Input
          label="Email"
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          leftIcon={
            <View className="w-5 h-5 bg-gray-400 rounded-full" />
          }
        />

        {/* Campo Senha */}
        <Input
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoComplete="password"
          leftIcon={
            <View className="w-5 h-5 bg-gray-400 rounded-full" />
          }
          rightIcon={
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="p-1"
            >
              <Text className="text-gray-500 text-xs">
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          }
        />

        {/* Opções */}
        <View className="flex-row justify-between items-center mb-6">
          {/* Lembrar-me */}
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              className={`
                w-5 h-5 border-2 rounded mr-2 items-center justify-center
                ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}
              `}
            >
              {rememberMe && (
                <Text className="text-white text-xs">✓</Text>
              )}
            </View>
            <Text className="text-gray-700 text-sm">Lembrar-me</Text>
          </TouchableOpacity>

          {/* Esqueci minha senha */}
          <TouchableOpacity onPress={onForgotPassword}>
            <Text className="text-blue-600 text-sm font-medium">
              Esqueci minha senha
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mensagem de Erro */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <Text className="text-red-700 text-sm text-center">{error}</Text>
          </View>
        )}

        {/* Botão de Login */}
        <Button
          title="Entrar"
          onPress={handleSubmit}
          loading={loading}
          disabled={!isFormValid || loading}
          containerClassName="mb-6"
        />

        {/* Links auxiliares */}
        <View className="items-center">
          <Text className="text-gray-600 text-sm mb-2">
            Não tem uma conta?
          </Text>
          <TouchableOpacity>
            <Text className="text-blue-600 text-sm font-medium">
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Rodapé */}
      <View className="items-center mt-8">
        <Text className="text-gray-500 text-xs">
          © 2024 GiroPro. Todos os direitos reservados.
        </Text>
      </View>
    </View>
  );
};

export default LoginForm;

