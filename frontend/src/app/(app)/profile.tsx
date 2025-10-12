import React, { useState } from 'react';
import { ScrollView, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 400;

interface UserStats {
  memberSince: string;
  vehiclesCount: number;
  journeysTotal: number;
  kmTraveled: number;
}

export default function Profile() {
  const [userEmail] = useState('fwagnersilva@gmail.com');
  const [userName] = useState('FW Wagner Silva');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const userStats: UserStats = {
    memberSince: 'Janeiro 2024',
    vehiclesCount: 3,
    journeysTotal: 245,
    kmTraveled: 12450,
  };

  const handleChangePassword = async () => {
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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        'Erro',
        'A nova senha deve conter: 1 minúscula, 1 maiúscula, 1 número e 1 caractere especial.'
      );
      return;
    }

    setIsChangingPassword(true);

    try {
      setTimeout(() => {
        setIsChangingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowChangePassword(false);
        Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      }, 1500);
    } catch (error) {
      setIsChangingPassword(false);
      Alert.alert('Erro', 'Não foi possível alterar a senha. Verifique sua senha atual.');
    }
  };

  const PasswordField = ({
    label,
    placeholder,
    value,
    onChange,
    showPassword,
    onToggleShow,
    type,
  }: any) => (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>
      <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
        <Input
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          secureTextEntry={!showPassword}
          className="flex-1 bg-transparent py-3 px-3 text-gray-900"
        />
        <Button
          onPress={() => onToggleShow(type)}
          className="bg-transparent px-3"
        >
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="#6B7280"
          />
        </Button>
      </View>
    </View>
  );

  const StatCard = ({ icon, label, value, color }: any) => (
    <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-white rounded-xl p-4 border border-gray-100 mr-2 mb-3`}>
      <View className={`w-10 h-10 rounded-lg items-center justify-center mb-2 ${color}`}>
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <Text className="text-xs text-gray-500 font-medium mb-1">{label}</Text>
      <Text className="text-lg font-bold text-gray-900">{value}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with Profile */}
        <View className="bg-gradient-to-b from-blue-600 to-blue-700 px-4 pt-6 pb-8 rounded-b-3xl">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-3xl font-bold mb-1">
                {userName}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text className="text-blue-100 ml-2">Conta Verificada</Text>
              </View>
            </View>
            <View className="w-16 h-16 rounded-full bg-white items-center justify-center shadow-lg">
              <Ionicons name="person" size={32} color="#0066CC" />
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 pt-6">
          {/* Personal Information */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-lg bg-blue-100 items-center justify-center mr-2">
                <Ionicons name="person-outline" size={18} color="#0066CC" />
              </View>
              <Text className="text-lg font-bold text-gray-900">
                Informações Pessoais
              </Text>
            </View>

            <View className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <View className="px-4 py-4 border-b border-gray-100">
                <Text className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Nome
                </Text>
                <Text className="text-lg font-semibold text-gray-900">
                  {userName}
                </Text>
              </View>
              <View className="px-4 py-4">
                <Text className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  E-mail
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="mail" size={16} color="#0066CC" />
                  <Text className="text-lg font-semibold text-gray-900 ml-2">
                    {userEmail}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Statistics */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-lg bg-green-100 items-center justify-center mr-2">
                <Ionicons name="stats-chart" size={18} color="#16A34A" />
              </View>
              <Text className="text-lg font-bold text-gray-900">
                Estatísticas
              </Text>
            </View>

            <View className={`flex-row flex-wrap`}>
              <StatCard
                icon="calendar"
                label="Membro desde"
                value={userStats.memberSince}
                color="bg-blue-600"
              />
              <StatCard
                icon="car"
                label="Veículos"
                value={userStats.vehiclesCount}
                color="bg-green-600"
              />
              <StatCard
                icon="location"
                label="Jornadas"
                value={userStats.journeysTotal}
                color="bg-purple-600"
              />
              <StatCard
                icon="speedometer"
                label="KM Rodados"
                value={`${userStats.kmTraveled}`}
                color="bg-orange-600"
              />
            </View>
          </View>

          {/* Security Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-lg bg-red-100 items-center justify-center mr-2">
                <Ionicons name="lock-closed" size={18} color="#DC2626" />
              </View>
              <Text className="text-lg font-bold text-gray-900">
                Segurança
              </Text>
            </View>

            {!showChangePassword ? (
              <Button
                onPress={() => setShowChangePassword(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 py-3 rounded-xl shadow-md"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="key" size={20} color="white" />
                  <Text className="text-white font-bold ml-2">Alterar Senha</Text>
                </View>
              </Button>
            ) : (
              <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <View className="flex-row items-center mb-4">
                  <Ionicons name="warning" size={20} color="#DC2626" />
                  <Text className="text-lg font-bold text-gray-900 ml-2">
                    Alterar Senha
                  </Text>
                </View>

                <PasswordField
                  label="Senha Atual"
                  placeholder="Digite sua senha atual"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  showPassword={showPasswords.current}
                  onToggleShow={(type: string) =>
                    setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                  }
                  type="current"
                />

                <PasswordField
                  label="Nova Senha"
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChange={setNewPassword}
                  showPassword={showPasswords.new}
                  onToggleShow={() =>
                    setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                  }
                  type="new"
                />

                <PasswordField
                  label="Confirmar Nova Senha"
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  showPassword={showPasswords.confirm}
                  onToggleShow={() =>
                    setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                  }
                  type="confirm"
                />

                {/* Password Requirements */}
                <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <Text className="text-xs font-bold text-blue-900 uppercase mb-2">
                    Requisitos da Senha:
                  </Text>
                  <View>
                    <Text className="text-xs text-blue-800 mb-1">
                      • Mínimo 8 caracteres
                    </Text>
                    <Text className="text-xs text-blue-800 mb-1">
                      • Pelo menos 1 letra minúscula
                    </Text>
                    <Text className="text-xs text-blue-800 mb-1">
                      • Pelo menos 1 letra maiúscula
                    </Text>
                    <Text className="text-xs text-blue-800 mb-1">
                      • Pelo menos 1 número
                    </Text>
                    <Text className="text-xs text-blue-800">
                      • Pelo menos 1 caractere especial (@$!%*?&)
                    </Text>
                  </View>
                </View>

                {/* Buttons */}
                <View className="flex-row gap-3">
                  <Button
                    onPress={handleChangePassword}
                    disabled={isChangingPassword}
                    className={`flex-1 py-3 rounded-lg ${
                      isChangingPassword ? 'bg-gray-400' : 'bg-green-600'
                    }`}
                  >
                    {isChangingPassword ? (
                      <View className="flex-row items-center justify-center">
                        <ActivityIndicator color="white" size="small" />
                        <Text className="text-white font-bold ml-2">Alterando...</Text>
                      </View>
                    ) : (
                      <Text className="text-white font-bold text-center">Confirmar</Text>
                    )}
                  </Button>

                  <Button
                    onPress={() => {
                      setShowChangePassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setShowPasswords({ current: false, new: false, confirm: false });
                    }}
                    className="flex-1 bg-gray-200 py-3 rounded-lg"
                  >
                    <Text className="text-gray-800 font-bold text-center">Cancelar</Text>
                  </Button>
                </View>
              </View>
            )}
          </View>

          {/* Additional Info */}
          <View className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200 mb-8">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#0066CC" />
              <View className="ml-3 flex-1">
                <Text className="font-bold text-blue-900 mb-1">
                  Dica de Segurança
                </Text>
                <Text className="text-sm text-blue-800">
                  Use uma senha única e complexa. Nunca compartilhe sua senha com ninguém.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}