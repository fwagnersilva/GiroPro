import React, { useState } from 'react';
import { ScrollView, Alert, Dimensions, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
<<<<<<< HEAD
import { Ionicons } from '@expo/vector-icons';
=======
import { FocusAwareStatusBar, Text, View, Button } from '@/components/ui';
>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e

import { FocusAwareStatusBar, Text, View, Button } from '@/components/ui';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 400;

interface Fueling {
  id: string;
  idUsuario: string;
  idVeiculo: string;
  dataAbastecimento: Date;
  tipoCombustivel: 'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'flex';
  litros: number;
  valorLitro: number;
  precoPorLitro: number;
  valorTotal: number;
  kmAtual?: number;
  nomePosto?: string;
}

interface Vehicle {
  id: string;
  model: string;
  placa: string;
}

const getFuelIcon = (tipo: string) => {
  const iconMap: { [key: string]: string } = {
    gasolina: 'flame',
    etanol: 'leaf',
    diesel: 'water',
    gnv: 'wind',
    flex: 'swap-vertical',
  };
  return iconMap[tipo] || 'flame';
};

const getFuelColor = (tipo: string) => {
  const colorMap: { [key: string]: string } = {
    gasolina: 'bg-yellow-600',
    etanol: 'bg-green-600',
    diesel: 'bg-blue-600',
    gnv: 'bg-purple-600',
    flex: 'bg-orange-600',
  };
  return colorMap[tipo] || 'bg-gray-600';
};

export default function Fuelings() {
  const router = useRouter();
  const userId = 'user-123';
  const [refreshing, setRefreshing] = useState(false);

  const [vehicles] = useState<Vehicle[]>([
    { id: '1', model: 'Honda Civic', placa: 'ABC-1234' },
    { id: '2', model: 'Toyota Corolla', placa: 'XYZ-5678' },
    { id: '3', model: 'Ford Ka', placa: 'DEF-9012' },
  ]);

  const [fuelings, setFuelings] = useState<Fueling[]>([
    {
      id: '1',
      idUsuario: userId,
      idVeiculo: '1',
      dataAbastecimento: new Date('2025-09-25'),
      tipoCombustivel: 'gasolina',
      litros: 27.27,
      valorLitro: 550,
      precoPorLitro: 5.50,
      valorTotal: 15000,
      kmAtual: 50000,
      nomePosto: 'Posto Ipiranga'
    },
    {
      id: '2',
      idUsuario: userId,
      idVeiculo: '2',
      dataAbastecimento: new Date('2025-09-20'),
      tipoCombustivel: 'etanol',
      litros: 20.69,
      valorLitro: 380,
      precoPorLitro: 3.80,
      valorTotal: 7900,
      kmAtual: 75000,
      nomePosto: 'Shell'
    },
    {
      id: '3',
      idUsuario: userId,
      idVeiculo: '1',
      dataAbastecimento: new Date('2025-09-15'),
      tipoCombustivel: 'gasolina',
      litros: 35.5,
      valorLitro: 540,
      precoPorLitro: 5.40,
      valorTotal: 19170,
      kmAtual: 49500,
      nomePosto: 'Br Station'
    },
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

<<<<<<< HEAD
  const handleAddFueling = () => {
    router.push('/edit-fueling');
  };
=======
return (
<View className={`flex-1 bg-gray-900`}>
<FocusAwareStatusBar />
<ScrollView className="flex-1 px-6 py-8">
<View className="flex-row justify-between items-center mb-6">
<View>
<Text className="text-3xl font-bold text-white">Abastecimentos</Text>
<Text className="text-slate-300">Registre e acompanhe</Text>
</View>
<Button onPress={handleAdd} label="+ Adicionar" className="bg-blue-600" />
</View>
>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e

  const handleEditFueling = (fueling: Fueling) => {
    router.push(`/edit-fueling?id=${fueling.id}`);
  };

<<<<<<< HEAD
  const handleDeleteFueling = (fueling: Fueling) => {
    Alert.alert(
      'Excluir Abastecimento',
      `Tem certeza que deseja excluir o abastecimento de ${formatDate(fueling.dataAbastecimento)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setFuelings(fuelings.filter((f) => f.id !== fueling.id));
            Alert.alert('Sucesso', 'Abastecimento excluído com sucesso!');
          },
        },
      ]
    );
  };

  const formatCurrency = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const totalSpent = fuelings.reduce((sum, f) => sum + f.valorTotal, 0);
  const totalLiters = fuelings.reduce((sum, f) => sum + f.litros, 0);
  const averagePrice = totalLiters > 0 ? (totalSpent / totalLiters / 100).toFixed(2) : '0.00';

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <FocusAwareStatusBar />
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0066CC" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-6 pb-8 rounded-b-3xl">
          <Text className="text-white text-3xl font-bold mb-1">
            Abastecimentos
          </Text>
          <Text className="text-blue-100 mb-6">Registre e acompanhe seus combustíveis</Text>

          {/* Summary Stats */}
          <View className={`flex-row gap-2 ${isSmallScreen ? 'flex-wrap' : ''}`}>
            <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-white bg-opacity-15 rounded-xl p-3`}>
              <Text className="text-blue-100 text-xs font-medium mb-1">Total Gasto</Text>
              <Text className="text-white text-lg font-bold">R$ {formatCurrency(totalSpent)}</Text>
            </View>
            <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-white bg-opacity-15 rounded-xl p-3`}>
              <Text className="text-blue-100 text-xs font-medium mb-1">Total Litros</Text>
              <Text className="text-white text-lg font-bold">{totalLiters.toFixed(1)} L</Text>
            </View>
            <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-white bg-opacity-15 rounded-xl p-3`}>
              <Text className="text-blue-100 text-xs font-medium mb-1">Preço Médio</Text>
              <Text className="text-white text-lg font-bold">R$ {averagePrice}</Text>
            </View>
            <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-white bg-opacity-15 rounded-xl p-3`}>
              <Text className="text-blue-100 text-xs font-medium mb-1">Registros</Text>
              <Text className="text-white text-lg font-bold">{fuelings.length}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 pt-6 pb-8">
          {/* Add Button */}
          <Button
            onPress={handleAddFueling}
            className="bg-gradient-to-r from-blue-600 to-blue-700 py-3 rounded-xl mb-6 shadow-lg"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="add-circle" size={22} color="white" />
              <Text className="text-white font-bold ml-2">Novo Abastecimento</Text>
            </View>
          </Button>

          {/* Fuelings List */}
          {fuelings.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center border border-gray-100 shadow-sm">
              <View className="bg-blue-100 rounded-full w-16 h-16 items-center justify-center mb-4">
                <Ionicons name="water-outline" size={32} color="#0066CC" />
              </View>
              <Text className="text-lg font-semibold text-gray-900 text-center">
                Nenhum abastecimento registrado
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Adicione seu primeiro abastecimento para começar
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {fuelings.map((fueling) => {
                const vehicle = vehicles.find(v => v.id === fueling.idVeiculo);
                const fuelIcon = getFuelIcon(fueling.tipoCombustivel);
                const fuelColor = getFuelColor(fueling.tipoCombustivel);

                return (
                  <View
                    key={fueling.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                  >
                    {/* Header */}
                    <View className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${fuelColor}`}>
                          <Ionicons name={fuelIcon as any} size={20} color="white" />
                        </View>
                        <View className="flex-1">
                          <Text className="font-bold text-gray-900">
                            {vehicle?.model}
                          </Text>
                          <Text className="text-xs text-gray-600 mt-1">
                            {formatDate(fueling.dataAbastecimento)}
                          </Text>
                        </View>
                      </View>
                      <View className="bg-blue-100 rounded-lg px-3 py-1">
                        <Text className="text-blue-600 font-bold text-sm">
                          R$ {formatCurrency(fueling.valorTotal)}
                        </Text>
                      </View>
                    </View>

                    {/* Details */}
                    <View className="px-4 py-4">
                      <View className={`flex-row gap-3 ${isSmallScreen ? 'flex-wrap' : ''} mb-3`}>
                        <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-gray-50 rounded-lg p-3`}>
                          <Text className="text-xs text-gray-500 font-medium mb-1">
                            Litros
                          </Text>
                          <Text className="text-lg font-bold text-gray-900">
                            {fueling.litros.toFixed(2)} L
                          </Text>
                        </View>

                        <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-gray-50 rounded-lg p-3`}>
                          <Text className="text-xs text-gray-500 font-medium mb-1">
                            Preço/L
                          </Text>
                          <Text className="text-lg font-bold text-gray-900">
                            R$ {fueling.precoPorLitro.toFixed(2)}
                          </Text>
                        </View>

                        <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-gray-50 rounded-lg p-3`}>
                          <Text className="text-xs text-gray-500 font-medium mb-1">
                            Combustível
                          </Text>
                          <Text className="text-lg font-bold text-gray-900 capitalize">
                            {fueling.tipoCombustivel}
                          </Text>
                        </View>

                        {fueling.kmAtual && (
                          <View className={`flex-1 ${isSmallScreen ? 'w-[48%]' : ''} bg-gray-50 rounded-lg p-3`}>
                            <Text className="text-xs text-gray-500 font-medium mb-1">
                              Odômetro
                            </Text>
                            <Text className="text-lg font-bold text-gray-900">
                              {fueling.kmAtual.toLocaleString('pt-BR')} km
                            </Text>
                          </View>
                        )}
                      </View>

                      {fueling.nomePosto && (
                        <View className="bg-blue-50 rounded-lg p-3 flex-row items-center mb-3">
                          <Ionicons name="location" size={16} color="#0066CC" />
                          <Text className="text-blue-900 font-medium ml-2">
                            {fueling.nomePosto}
                          </Text>
                        </View>
                      )}

                      {/* Actions */}
                      <View className="flex-row gap-2 pt-3 border-t border-gray-100">
                        <Button
                          onPress={() => handleEditFueling(fueling)}
                          className="flex-1 bg-blue-100 py-2 rounded-lg"
                        >
                          <View className="flex-row items-center justify-center">
                            <Ionicons name="pencil" size={16} color="#0066CC" />
                            <Text className="text-blue-600 font-semibold ml-1">Editar</Text>
                          </View>
                        </Button>
                        <Button
                          onPress={() => handleDeleteFueling(fueling)}
                          className="flex-1 bg-red-100 py-2 rounded-lg"
                        >
                          <View className="flex-row items-center justify-center">
                            <Ionicons name="trash" size={16} color="#DC2626" />
                            <Text className="text-red-600 font-semibold ml-1">Excluir</Text>
                          </View>
                        </Button>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
=======
<View className="space-y-3">
{fuelings.length === 0 ? (
<View className={`bg-gray-800 rounded-lg p-8 border border-slate-700 items-center`}>
<Text className="text-slate-300 text-center">Nenhum abastecimento registrado. Adicione o primeiro!</Text>
</View>
) : (
fuelings.map((f) => (
<View key={f.id} className={`bg-gray-800 rounded-lg p-4 border border-slate-700 flex-row justify-between`}>
<View className="flex-1 mr-3">
<Text className="text-white font-semibold">{f.nomePosto || 'Posto'}</Text>
<Text className="text-slate-300 text-sm">{f.litros} L · R$ {f.precoPorLitro.toFixed(2)}</Text>
</View>
<View className="flex-row space-x-2">
<Button onPress={() => {}} label="Editar" className="bg-blue-600 px-3 py-2" />
<Button onPress={() => {}} label="Excluir" className="bg-red-600 px-3 py-2" />
</View>
</View>
))
)}
</View>
</ScrollView>
</View>
);
}

>>>>>>> b929df65fb738a91ac9dd02ae198b0b42f48cb4e
