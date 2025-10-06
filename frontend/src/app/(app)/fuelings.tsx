
import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { FocusAwareStatusBar, Text, View, Button } from '@/components/ui';

interface Fueling {
  id: string;
  idUsuario: string;
  idVeiculo: string;
  dataAbastecimento: Date;
  tipoCombustivel: 'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'flex';
  litros: number;
  valorLitro: number; // em centavos
  precoPorLitro: number; // preço real (ex: 5.89)
  valorTotal: number; // em centavos
  kmAtual?: number;
  nomePosto?: string;
}

export default function Fuelings() {
  const router = useRouter();
  // Mock userId - substituir pela autenticação real
  const userId = 'user-123';

  // Mock data for vehicles (to select which vehicle was fueled)
  const [vehicles] = useState([
    { id: '1', model: 'Honda Civic', placa: 'ABC-1234' },
    { id: '2', model: 'Toyota Corolla', placa: 'XYZ-5678' },
    { id: '3', model: 'Ford Ka', placa: 'DEF-9012' },
  ]);

  // Mock data for fuelings
  const [fuelings, setFuelings] = useState<Fueling[]>([
    {
      id: '1',
      idUsuario: userId,
      idVeiculo: '1',
      dataAbastecimento: new Date('2025-09-25'),
      tipoCombustivel: 'gasolina',
      litros: 27.27,
      valorLitro: 550, // 5.50 em centavos
      precoPorLitro: 5.50,
      valorTotal: 15000, // 150.00 em centavos
      kmAtual: 50000,
      nomePosto: 'Posto Ipiranga'
    },
    {
      id: '2',
      idUsuario: userId,
      idVeiculo: '2',
      dataAbastecimento: new Date('2025-09-20'),
      tipoCombustivel: 'gasolina',
      litros: 20.69,
      valorLitro: 580, // 5.80 em centavos
      precoPorLitro: 5.80,
      valorTotal: 12000, // 120.00 em centavos
      kmAtual: 75000,
      nomePosto: 'Shell'
    },
  ]);

  const handleAddFueling = () => {
    router.push('/edit-fueling');
  };

  const handleEditFueling = (fueling: Fueling) => {
    router.push(`/edit-fueling?id=${fueling.id}`);
  };

  const handleDeleteFueling = (fuelingId: string) => {
    // TODO: Implementar verificação no backend para saber se há registros associados
    // Por enquanto, vamos simular que não há registros associados para permitir a exclusão.
    const hasAssociatedRecords = false; // Placeholder

    if (hasAssociatedRecords) {
      Alert.alert(
        'Não é possível excluir',
        'Este abastecimento possui registros associados (jornadas, despesas). Exclua-os primeiro.',
      );
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este abastecimento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setFuelings(fuelings.filter((f) => f.id !== fuelingId));
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
    return date.toISOString().split('T')[0];
  };

  return (
    <View className="flex-1 bg-slate-900">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-3xl font-bold text-white mb-1">
              Meus Abastecimentos
            </Text>
            <Text className="text-slate-400">
              Registre e acompanhe seus abastecimentos
            </Text>
          </View>
          <Button onPress={handleAddFueling} className="px-4 py-2 bg-blue-600">
            <Text className="text-white font-medium">+ Adicionar</Text>
          </Button>
        </View>

        {/* Fuelings List */}
        <View>
          <Text className="text-2xl font-bold text-white mb-4">
            Abastecimentos Registrados ({fuelings.length})
          </Text>

          {fuelings.length === 0 ? (
            <View className="p-8 items-center">
              <Text className="text-slate-400 text-center">
                Nenhum abastecimento registrado.\nAdicione seu primeiro
                abastecimento para começar!
              </Text>
            </View>
          ) : (
            fuelings.map((fueling) => {
              const vehicle = vehicles.find(v => v.id === fueling.idVeiculo);
              return (
                <View key={fueling.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-3">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="font-semibold text-white text-lg mb-1">
                        {vehicle?.model || 'Veículo'} ({formatDate(fueling.dataAbastecimento)})
                      </Text>
                      <Text className="text-slate-300 mb-1">
                        Valor: R$ {formatCurrency(fueling.valorTotal)} • Litros: {fueling.litros.toFixed(2)}
                      </Text>
                      <Text className="text-slate-300 mb-1">
                        Combustível: {fueling.tipoCombustivel} • R$/L: {fueling.precoPorLitro.toFixed(2)}
                      </Text>
                      {fueling.kmAtual && (
                        <Text className="text-slate-300 mb-1">
                          Odômetro: {fueling.kmAtual} Km
                        </Text>
                      )}
                      {fueling.nomePosto && (
                        <Text className="text-slate-300">
                          Posto: {fueling.nomePosto}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row space-x-2">
                      <Button
                        onPress={() => handleEditFueling(fueling)}
                        className="px-3 py-1 bg-blue-600"
                      >
                        <Text className="text-white text-sm">Editar</Text>
                      </Button>
                      <Button
                        onPress={() => handleDeleteFueling(fueling.id)}
                        className="px-3 py-1 bg-red-600"
                      >
                        <Text className="text-white text-sm">Excluir</Text>
                      </Button>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

