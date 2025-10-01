import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

const Dashboard = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const handleLogout = () => {
    // TODO: Implementar lógica de logout
    console.log('Logout clicked');
    router.push('/login');
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white shadow-sm px-6 py-4 flex-row justify-between items-center">
        <TouchableOpacity onPress={openDrawer} className="p-2">
          <Text className="text-blue-600 text-xl">☰</Text>
        </TouchableOpacity>
        <View>
          <Text className="text-2xl font-bold text-gray-900">Dashboard</Text>
          <Text className="text-gray-600">Bem-vindo ao GiroPro</Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 py-8">
        <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            🎉 Login realizado com sucesso!
          </Text>
          <Text className="text-gray-600">
            Você está agora logado no sistema GiroPro. Esta é uma tela protegida que só pode ser acessada após autenticação.
          </Text>
        </View>

        {/* Cards de funcionalidades */}
        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] bg-blue-50 rounded-lg p-4 mb-4">
            <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center mb-3">
              <Text className="text-white text-xl">🚗</Text>
            </View>
            <Text className="text-blue-900 font-semibold mb-1">Veículos</Text>
            <Text className="text-blue-700 text-sm">Gerencie sua frota</Text>
          </View>

          <View className="w-[48%] bg-green-50 rounded-lg p-4 mb-4">
            <View className="w-12 h-12 bg-green-600 rounded-full items-center justify-center mb-3">
              <Text className="text-white text-xl">📊</Text>
            </View>
            <Text className="text-green-900 font-semibold mb-1">Relatórios</Text>
            <Text className="text-green-700 text-sm">Visualize dados</Text>
          </View>

          <View className="w-[48%] bg-purple-50 rounded-lg p-4 mb-4">
            <View className="w-12 h-12 bg-purple-600 rounded-full items-center justify-center mb-3">
              <Text className="text-white text-xl">⚙️</Text>
            </View>
            <Text className="text-purple-900 font-semibold mb-1">Configurações</Text>
            <Text className="text-purple-700 text-sm">Ajuste preferências</Text>
          </View>

          <View className="w-[48%] bg-orange-50 rounded-lg p-4 mb-4">
            <View className="w-12 h-12 bg-orange-600 rounded-full items-center justify-center mb-3">
              <Text className="text-white text-xl">👤</Text>
            </View>
            <Text className="text-orange-900 font-semibold mb-1">Perfil</Text>
            <Text className="text-orange-700 text-sm">Edite seus dados</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;

