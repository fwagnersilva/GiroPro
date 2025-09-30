import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Link } from 'expo-router';

import { FocusAwareStatusBar, Text, Button, Input } from '@/components/ui';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail.');
      return;
    }

    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implementar chamada para API de recuperação de senha
      // await api.post('/auth/forgot-password', { email });
      
      // Simulação de sucesso
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          'E-mail Enviado',
          'Instruções para redefinir sua senha foram enviadas para seu e-mail.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navegar de volta para login
              }
            }
          ]
        );
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Erro', 'Não foi possível enviar o e-mail de recuperação. Tente novamente.');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-8 mt-12">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Esqueceu sua senha?
          </Text>
          <Text className="text-gray-600 text-base">
            Digite seu e-mail e enviaremos instruções para redefinir sua senha.
          </Text>
        </View>

        {/* Form */}
        <View className="mb-8">
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              E-mail
            </Text>
            <Input
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              className="w-full"
            />
          </View>

          <Button
            onPress={handleResetPassword}
            disabled={isLoading}
            className="w-full mb-4"
          >
            <Text className="text-white font-medium">
              {isLoading ? 'Enviando...' : 'Enviar Instruções'}
            </Text>
          </Button>
        </View>

        {/* Back to Login */}
        <View className="items-center">
          <Link href="/login" asChild>
            <Button variant="ghost" className="p-0">
              <Text className="text-blue-600 font-medium">
                ← Voltar para o Login
              </Text>
            </Button>
          </Link>
        </View>

        {/* Info */}
        <View className="mt-8 p-4 bg-blue-50 rounded-lg">
          <Text className="text-blue-800 text-sm">
            💡 <Text className="font-medium">Dica:</Text> Verifique sua caixa de spam se não receber o e-mail em alguns minutos.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
