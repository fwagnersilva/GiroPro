import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FuelingHistoryItem {
  id: string;
  nome_posto: string;
  tipo_combustivel: string;
  valor_litro: number;
  quantidade_litros: number;
  data_abastecimento: string;
  id_veiculo: string;
  created_at: string;
}

interface SmartSuggestion {
  type: 'posto' | 'valor' | 'quantidade';
  value: string;
  label: string;
  frequency: number;
  confidence: number;
  icon: string;
}

interface UseSmartSuggestionsReturn {
  getSuggestions: (field: string, vehicleId?: string, fuelType?: string) => SmartSuggestion[];
  addToHistory: (fueling: Omit<FuelingHistoryItem, 'id' | 'created_at'>) => Promise<void>;
  getAveragePrice: (fuelType: string, days?: number) => number | null;
  getCommonQuantity: (vehicleId?: string) => number | null;
  getFrequentStations: (limit?: number) => Array<{ name: string; frequency: number }>;
  clearHistory: () => Promise<void>;
  isLoading: boolean;
}

const STORAGE_KEY = '@fueling_suggestions_history';
const MAX_HISTORY_ITEMS = 100;

export const useSmartSuggestions = (): UseSmartSuggestionsReturn => {
  const [history, setHistory] = useState<FuelingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar histórico do AsyncStorage
  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedHistory = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedHistory) {
        const parsedHistory: FuelingHistoryItem[] = JSON.parse(storedHistory);
        // Ordenar por data mais recente
        const sortedHistory = parsedHistory.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setHistory(sortedHistory);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de sugestões:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar histórico no AsyncStorage
  const saveHistory = useCallback(async (newHistory: FuelingHistoryItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Erro ao salvar histórico de sugestões:', error);
    }
  }, []);

  // Adicionar novo item ao histórico
  const addToHistory = useCallback(async (fueling: Omit<FuelingHistoryItem, 'id' | 'created_at'>) => {
    const newItem: FuelingHistoryItem = {
      ...fueling,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };

    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    setHistory(updatedHistory);
    await saveHistory(updatedHistory);
  }, [history, saveHistory]);

  // Obter preço médio por tipo de combustível
  const getAveragePrice = useCallback((fuelType: string, days: number = 30): number | null => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentFuelings = history.filter(
      item => 
        item.tipo_combustivel === fuelType &&
        new Date(item.created_at) >= cutoffDate
    );

    if (recentFuelings.length === 0) return null;

    const totalValue = recentFuelings.reduce((sum, item) => sum + item.valor_litro, 0);
    return totalValue / recentFuelings.length;
  }, [history]);

  // Obter quantidade mais comum para um veículo
  const getCommonQuantity = useCallback((vehicleId?: string): number | null => {
    let relevantFuelings = history;
    
    if (vehicleId) {
      relevantFuelings = history.filter(item => item.id_veiculo === vehicleId);
    }

    if (relevantFuelings.length === 0) return null;

    // Agrupar por quantidade (arredondada) e contar frequência
    const quantityFrequency: { [key: number]: number } = {};
    relevantFuelings.forEach(item => {
      const qty = Math.round(item.quantidade_litros * 2) / 2; // Arredondar para 0.5L
      quantityFrequency[qty] = (quantityFrequency[qty] || 0) + 1;
    });

    // Encontrar a quantidade mais frequente
    const mostCommon = Object.entries(quantityFrequency)
      .sort(([, a], [, b]) => b - a)[0];

    return mostCommon ? parseFloat(mostCommon[0]) : null;
  }, [history]);

  // Obter postos mais frequentes
  const getFrequentStations = useCallback((limit: number = 5): Array<{ name: string; frequency: number }> => {
    const stationFrequency: { [key: string]: number } = {};
    
    history.forEach(item => {
      const station = item.nome_posto.trim().toLowerCase();
      stationFrequency[station] = (stationFrequency[station] || 0) + 1;
    });

    return Object.entries(stationFrequency)
      .map(([name, frequency]) => ({ 
        name: name.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '), 
        frequency 
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }, [history]);

  // Gerar sugestões baseadas no histórico
  const getSuggestions = useCallback((
    field: string, 
    vehicleId?: string, 
    fuelType?: string
  ): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];

    switch (field) {
      case 'nome_posto':
        const frequentStations = getFrequentStations(3);
        frequentStations.forEach(station => {
          suggestions.push({
            type: 'posto',
            value: station.name,
            label: `${station.name} (${station.frequency}x usado)`,
            frequency: station.frequency,
            confidence: Math.min(station.frequency / 10, 1),
            icon: 'business',
          });
        });
        break;

      case 'valor_litro':
        if (fuelType) {
          const avgPrice30 = getAveragePrice(fuelType, 30);
          const avgPrice7 = getAveragePrice(fuelType, 7);
          
          if (avgPrice30) {
            const count30 = history.filter(
              h => h.tipo_combustivel === fuelType && 
              new Date(h.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length;
            
            suggestions.push({
              type: 'valor',
              value: avgPrice30.toFixed(2),
              label: `Média (30 dias): R$ ${avgPrice30.toFixed(2)}`,
              frequency: count30,
              confidence: Math.min(count30 / 10, 0.8),
              icon: 'trending-up',
            });
          }
          
          if (avgPrice7 && Math.abs(avgPrice7 - (avgPrice30 || 0)) > 0.1) {
            const count7 = history.filter(
              h => h.tipo_combustivel === fuelType && 
              new Date(h.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length;
            
            suggestions.push({
              type: 'valor',
              value: avgPrice7.toFixed(2),
              label: `Média recente: R$ ${avgPrice7.toFixed(2)}`,
              frequency: count7,
              confidence: Math.min(count7 / 5, 0.9),
              icon: 'flash',
            });
          }

          // Sugerir último preço usado para este combustível
          const lastFueling = history.find(h => h.tipo_combustivel === fuelType);
          if (lastFueling && !suggestions.some(s => s.value === lastFueling.valor_litro.toFixed(2))) {
            suggestions.push({
              type: 'valor',
              value: lastFueling.valor_litro.toFixed(2),
              label: `Último usado: R$ ${lastFueling.valor_litro.toFixed(2)}`,
              frequency: 1,
              confidence: 0.6,
              icon: 'time',
            });
          }
        }
        break;

      case 'quantidade_litros':
        const commonQty = getCommonQuantity(vehicleId);
        if (commonQty) {
          const frequency = history.filter(
            h => (!vehicleId || h.id_veiculo === vehicleId) && 
            Math.abs(h.quantidade_litros - commonQty) <= 2.5
          ).length;
          
          suggestions.push({
            type: 'quantidade',
            value: commonQty.toString(),
            label: `Quantidade usual: ${commonQty}L`,
            frequency,
            confidence: Math.min(frequency / 5, 0.9),
            icon: 'speedometer',
          });
        }

        // Sugerir também a média geral
        let relevantHistory = history;
        if (vehicleId) {
          relevantHistory = history.filter(h => h.id_veiculo === vehicleId);
        }
        
        if (relevantHistory.length > 2) {
          const avgQty = relevantHistory.reduce((sum, h) => sum + h.quantidade_litros, 0) / relevantHistory.length;
          if (!commonQty || Math.abs(avgQty - commonQty) > 5) {
            suggestions.push({
              type: 'quantidade',
              value: avgQty.toFixed(1),
              label: `Média: ${avgQty.toFixed(1)}L`,
              frequency: relevantHistory.length,
              confidence: 0.7,
              icon: 'analytics',
            });
          }
        }

        // Sugerir tanque cheio baseado na capacidade do veículo (se disponível)
        // Esta informação viria do contexto do veículo selecionado
        if (vehicleId) {
          const vehicleFuelings = history.filter(h => h.id_veiculo === vehicleId);
          if (vehicleFuelings.length > 0) {
            const maxQuantity = Math.max(...vehicleFuelings.map(h => h.quantidade_litros));
            if (maxQuantity > 40 && !suggestions.some(s => Math.abs(parseFloat(s.value) - maxQuantity) < 5)) {
              suggestions.push({
                type: 'quantidade',
                value: maxQuantity.toString(),
                label: `Tanque cheio: ${maxQuantity}L`,
                frequency: vehicleFuelings.filter(h => Math.abs(h.quantidade_litros - maxQuantity) < 5).length,
                confidence: 0.8,
                icon: 'battery-full',
              });
            }
          }
        }
        break;
    }

    // Ordenar por confiança e frequência
    return suggestions
      .sort((a, b) => {
        if (Math.abs(a.confidence - b.confidence) > 0.1) {
          return b.confidence - a.confidence;
        }
        return b.frequency - a.frequency;
      })
      .slice(0, 3); // Limitar a 3 sugestões por campo
  }, [history, getAveragePrice, getCommonQuantity, getFrequentStations]);

  // Limpar histórico
  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (error) {
      console.error('Erro ao limpar histórico de sugestões:', error);
    }
  }, []);

  // Carregar histórico na inicialização
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    getSuggestions,
    addToHistory,
    getAveragePrice,
    getCommonQuantity,
    getFrequentStations,
    clearHistory,
    isLoading,
  };
};

