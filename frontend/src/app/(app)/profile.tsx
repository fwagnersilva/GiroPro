import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';

import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';

export default function Profile() {
  const [userEmail] = useState('joao.silva@email.com'); // Mock data
  const [userName] = useState('João Silva'); // Mock data
  
  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleChangePassword = async () => {
    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'A nova senha e a confirmação não coincidem.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    // Validação de senha forte
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        'Erro', 
        'A nova senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial.'
      );
      return;
    }

    setIsChangingPassword(true);

    try {
      // TODO: Implementar chamada para API de alteração de senha
      // await api.put('/auth/change-password', {
      //   currentPassword,
      //   newPassword
      // });

      // Simulação de sucesso
      setTimeout(() => {
        setIsChangingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowChangePassword(false);
        Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      }, 2000);
    } catch (error) {
      setIsChangingPassword(false);
      Alert.alert('Erro', 'Não foi possível alterar a senha. Verifique sua senha atual.');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Meu Perfil
          </Text>
          <Text className="text-gray-600">
            Gerencie suas informações pessoais e configurações de segurança
          </Text>
        </View>

        {/* User Info */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Informações Pessoais
          </Text>
          
          <View className="bg-gray-50 p-4 rounded-lg mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Nome
            </Text>
            <Text className="text-base text-gray-900">
              {userName}
            </Text>
          </View>

          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              E-mail
            </Text>
            <Text className="text-base text-gray-900">
              {userEmail}
            </Text>
          </View>
        </View>

        {/* Security Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Segurança
          </Text>
          
          {!showChangePassword ? (
            <Button
              onPress={() => setShowChangePassword(true)}
              variant="outline"
              className="w-full"
            >
              <Text className="text-blue-600 font-medium">
                Alterar Senha
              </Text>
            </Button>
          ) : (
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-base font-medium text-gray-900 mb-4">
                Alterar Senha
              </Text>
              
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Senha Atual
                </Text>
                <Input
                  placeholder="Digite sua senha atual"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  className="w-full"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </Text>
                <Input
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  className="w-full"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha
                </Text>
                <Input
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  className="w-full"
                />
              </View>

              <View className="flex-row space-x-2">
                <Button
                  onPress={handleChangePassword}
                  disabled={isChangingPassword}
                  className="flex-1 mr-2"
                >
                  <Text className="text-white font-medium">
                    {isChangingPassword ? 'Alterando...' : 'Confirmar'}
                  </Text>
                </Button>
                
                <Button
                  onPress={() => {
                    setShowChangePassword(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  variant="outline"
                  className="flex-1 ml-2"
                >
                  <Text className="text-gray-600 font-medium">
                    Cancelar
                  </Text>
                </Button>
              </View>
            </View>
          )}
        </View>

        {/* Password Requirements */}
        {showChangePassword && (
          <View className="mb-8 p-4 bg-blue-50 rounded-lg">
            <Text className="text-blue-800 font-medium mb-2">
              Requisitos da Senha:
            </Text>
            <Text className="text-blue-700 text-sm">
              • Mínimo de 8 caracteres{'\n'}
              • Pelo menos 1 letra minúscula{'\n'}
              • Pelo menos 1 letra maiúscula{'\n'}
              • Pelo menos 1 número{'\n'}
              • Pelo menos 1 caractere especial (@$!%*?&)
            </Text>
          </View>
        )}

        {/* Account Stats */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Estatísticas da Conta
          </Text>
          
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 bg-blue-50 p-4 rounded-lg mr-2">
              <Text className="text-blue-600 text-sm font-medium mb-1">
                Membro desde
              </Text>
              <Text className="text-blue-900 font-bold">
                Janeiro 2024
              </Text>
            </View>
            <View className="flex-1 bg-green-50 p-4 rounded-lg ml-2">
              <Text className="text-green-600 text-sm font-medium mb-1">
                Veículos cadastrados
              </Text>
              <Text className="text-green-900 font-bold">
                3
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
