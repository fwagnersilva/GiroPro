import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';

import { FocusAwareStatusBar, Text, View, Button, Input } from '@/components/ui';

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

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingFueling, setEditingFueling] = useState<Fueling | null>(null);
  const [formData, setFormData] = useState({
    vehicleId: '',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    tipoCombustivel: 'gasolina' as Fueling['tipoCombustivel'],
    totalValue: '',
    pricePerLiter: '',
    odometer: '',
    nomePosto: '',
  });

  const resetForm = () => {
    setFormData({
      vehicleId: '',
      date: new Date().toISOString().split('T')[0],
      tipoCombustivel: 'gasolina',
      totalValue: '',
      pricePerLiter: '',
      odometer: '',
      nomePosto: '',
    });
    setEditingFueling(null);
    setShowForm(false);
  };

  const handleAddFueling = () => {
    setShowForm(true);
    resetForm();
  };

  const handleEditFueling = (fueling: Fueling) => {
    setEditingFueling(fueling);
    setFormData({
      vehicleId: fueling.idVeiculo,
      date: fueling.dataAbastecimento.toISOString().split('T')[0],
      tipoCombustivel: fueling.tipoCombustivel,
      totalValue: (fueling.valorTotal / 100).toFixed(2),
      pricePerLiter: fueling.precoPorLitro.toFixed(2),
      odometer: fueling.kmAtual?.toString() || '',
      nomePosto: fueling.nomePosto || '',
    });
    setShowForm(true);
  };

  const handleDeleteFueling = (fuelingId: string) => {
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

  const handleSaveFueling = () => {
    // Validações
    if (
      !formData.vehicleId ||
      !formData.date ||
      !formData.totalValue ||
      !formData.pricePerLiter
    ) {
      Alert.alert('Erro', 'Veículo, data, valor total e preço por litro são obrigatórios.');
      return;
    }

    const totalValueNum = parseFloat(formData.totalValue);
    const pricePerLiterNum = parseFloat(formData.pricePerLiter);
    const odometerNum = formData.odometer ? parseInt(formData.odometer) : undefined;

    if (isNaN(totalValueNum) || totalValueNum <= 0) {
      Alert.alert('Erro', 'Valor total abastecido inválido.');
      return;
    }
    if (isNaN(pricePerLiterNum) || pricePerLiterNum <= 0) {
      Alert.alert('Erro', 'Valor do litro inválido.');
      return;
    }
    if (odometerNum !== undefined && (isNaN(odometerNum) || odometerNum <= 0)) {
      Alert.alert('Erro', 'Odômetro inválido.');
      return;
    }

    const liters = totalValueNum / pricePerLiterNum;
    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

    if (!selectedVehicle) {
      Alert.alert('Erro', 'Veículo selecionado inválido.');
      return;
    }

    // Converter valores para o formato do schema
    const fuelingData: Omit<Fueling, 'id'> = {
      idUsuario: userId,
      idVeiculo: formData.vehicleId,
      dataAbastecimento: new Date(formData.date),
      tipoCombustivel: formData.tipoCombustivel,
      litros: parseFloat(liters.toFixed(2)),
      valorLitro: Math.round(pricePerLiterNum * 100), // converter para centavos
      precoPorLitro: pricePerLiterNum,
      valorTotal: Math.round(totalValueNum * 100), // converter para centavos
      kmAtual: odometerNum,
      nomePosto: formData.nomePosto || undefined,
    };

    if (editingFueling) {
      // Editar abastecimento existente
      setFuelings(
        fuelings.map((f) =>
          f.id === editingFueling.id
            ? { ...fuelingData, id: editingFueling.id }
            : f
        )
      );
      Alert.alert('Sucesso', 'Abastecimento atualizado com sucesso!');
    } else {
      // Adicionar novo abastecimento
      const newFueling: Fueling = {
        id: Date.now().toString(),
        ...fuelingData,
      };
      setFuelings([...fuelings, newFueling]);
      Alert.alert('Sucesso', 'Abastecimento adicionado com sucesso!');
    }

    resetForm();
  };

  const formatCurrency = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              Meus Abastecimentos
            </Text>
            <Text className="text-gray-600">
              Registre e acompanhe seus abastecimentos
            </Text>
          </View>
          <Button onPress={handleAddFueling} className="px-4 py-2">
            <Text className="text-white font-medium">+ Adicionar</Text>
          </Button>
        </View>

        {/* Fueling Form */}
        {showForm && (
          <View className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              {editingFueling ? 'Editar Abastecimento' : 'Novo Abastecimento'}
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Veículo
              </Text>
              {/* TODO: Replace with a proper Picker/Dropdown component */}
              <Input
                placeholder="Selecione o veículo (ID)"
                value={formData.vehicleId}
                onChangeText={(text) =>
                  setFormData({ ...formData, vehicleId: text })
                }
                className="w-full"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Data
              </Text>
              <Input
                placeholder="YYYY-MM-DD"
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                className="w-full"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Tipo de Combustível
              </Text>
              <Input
                placeholder="gasolina, etanol, diesel, gnv, flex"
                value={formData.tipoCombustivel}
                onChangeText={(text) => setFormData({ ...formData, tipoCombustivel: text as Fueling['tipoCombustivel'] })}
                className="w-full"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Valor Total Abastecido (R$)
              </Text>
              <Input
                placeholder="Ex: 150.00"
                value={formData.totalValue}
                onChangeText={(text) =>
                  setFormData({ ...formData, totalValue: text })
                }
                keyboardType="numeric"
                className="w-full"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Valor do Litro (R$)
              </Text>
              <Input
                placeholder="Ex: 5.50"
                value={formData.pricePerLiter}
                onChangeText={(text) =>
                  setFormData({ ...formData, pricePerLiter: text })
                }
                keyboardType="numeric"
                className="w-full"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Odômetro (Km) - Opcional
              </Text>
              <Input
                placeholder="Ex: 50000"
                value={formData.odometer}
                onChangeText={(text) =>
                  setFormData({ ...formData, odometer: text })
                }
                keyboardType="numeric"
                className="w-full"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Nome do Posto - Opcional
              </Text>
              <Input
                placeholder="Ex: Posto Ipiranga"
                value={formData.nomePosto}
                onChangeText={(text) =>
                  setFormData({ ...formData, nomePosto: text })
                }
                className="w-full"
              />
            </View>

            <View className="flex-row space-x-2">
              <Button onPress={handleSaveFueling} className="flex-1 mr-2">
                <Text className="text-white font-medium">
                  {editingFueling ? 'Atualizar' : 'Salvar'}
                </Text>
              </Button>
              <Button
                onPress={resetForm}
                variant="outline"
                className="flex-1 ml-2"
              >
                <Text className="text-gray-600 font-medium">Cancelar</Text>
              </Button>
            </View>
          </View>
        )}

        {/* Fuelings List */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Abastecimentos Registrados ({fuelings.length})
          </Text>

          {fuelings.length === 0 ? (
            <View className="p-8 items-center">
              <Text className="text-gray-500 text-center">
                Nenhum abastecimento registrado.{'\n'}Adicione seu primeiro
                abastecimento para começar!
              </Text>
            </View>
          ) : (
            fuelings.map((fueling) => {
              const vehicle = vehicles.find(v => v.id === fueling.idVeiculo);
              return (
                <View key={fueling.id} className="bg-gray-50 p-4 rounded-lg mb-3">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900 text-lg mb-1">
                        {vehicle?.model || 'Veículo'} ({formatDate(fueling.dataAbastecimento)})
                      </Text>
                      <Text className="text-gray-600 mb-1">
                        Valor: R$ {formatCurrency(fueling.valorTotal)} • Litros: {fueling.litros.toFixed(2)}
                      </Text>
                      <Text className="text-gray-600 mb-1">
                        Combustível: {fueling.tipoCombustivel} • R$/L: {fueling.precoPorLitro.toFixed(2)}
                      </Text>
                      {fueling.kmAtual && (
                        <Text className="text-gray-600 mb-1">
                          Odômetro: {fueling.kmAtual} Km
                        </Text>
                      )}
                      {fueling.nomePosto && (
                        <Text className="text-gray-600">
                          Posto: {fueling.nomePosto}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row space-x-2">
                      <Button
                        onPress={() => handleEditFueling(fueling)}
                        variant="outline"
                        className="px-3 py-1"
                      >
                        <Text className="text-blue-600 text-sm">Editar</Text>
                      </Button>
                      <Button
                        onPress={() => handleDeleteFueling(fueling.id)}
                        variant="outline"
                        className="px-3 py-1"
                      >
                        <Text className="text-red-600 text-sm">Excluir</Text>
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
