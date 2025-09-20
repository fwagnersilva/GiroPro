import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FuelPreferences {
  favoriteState: string;
  favoriteCity: string;
  favoriteFuelType: 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV';
  priceAlerts: boolean;
  alertThreshold: number;
  recentSearches: Array<{
    state: string;
    city: string;
    fuelType: string;
    timestamp: number;
  }>;
  favoriteStations: Array<{
    id: string;
    name: string;
    location: string;
    fuelType: string;
  }>;
}

const DEFAULT_PREFERENCES: FuelPreferences = {
  favoriteState: 'SP',
  favoriteCity: 'São Paulo',
  favoriteFuelType: 'Gasolina',
  priceAlerts: false,
  alertThreshold: 5.0,
  recentSearches: [],
  favoriteStations: [],
};

const STORAGE_KEY = '@fuel_preferences';
const MAX_RECENT_SEARCHES = 10;

export const useFuelPreferences = () => {
  const [preferences, setPreferences] = useState<FuelPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  // Carregar preferências do AsyncStorage
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedPreferences = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsedPreferences });
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: Partial<FuelPreferences>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPreferences));
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  };

  // Atualizar preferência de localização favorita
  const setFavoriteLocation = async (state: string, city: string) => {
    await savePreferences({
      favoriteState: state,
      favoriteCity: city,
    });
  };

  // Atualizar combustível favorito
  const setFavoriteFuelType = async (fuelType: FuelPreferences['favoriteFuelType']) => {
    await savePreferences({
      favoriteFuelType: fuelType,
    });
  };

  // Adicionar busca recente
  const addRecentSearch = async (state: string, city: string, fuelType: string) => {
    const newSearch = {
      state,
      city,
      fuelType,
      timestamp: Date.now(),
    };

    const updatedSearches = [
      newSearch,
      ...preferences.recentSearches.filter(
        search => !(search.state === state && search.city === city && search.fuelType === fuelType)
      ),
    ].slice(0, MAX_RECENT_SEARCHES);

    await savePreferences({
      recentSearches: updatedSearches,
    });
  };

  // Adicionar posto favorito
  const addFavoriteStation = async (station: FuelPreferences['favoriteStations'][0]) => {
    const isAlreadyFavorite = preferences.favoriteStations.some(
      fav => fav.id === station.id
    );

    if (!isAlreadyFavorite) {
      const updatedFavorites = [...preferences.favoriteStations, station];
      await savePreferences({
        favoriteStations: updatedFavorites,
      });
    }
  };

  // Remover posto favorito
  const removeFavoriteStation = async (stationId: string) => {
    const updatedFavorites = preferences.favoriteStations.filter(
      station => station.id !== stationId
    );
    await savePreferences({
      favoriteStations: updatedFavorites,
    });
  };

  // Configurar alertas de preço
  const setPriceAlerts = async (enabled: boolean, threshold?: number) => {
    const updates: Partial<FuelPreferences> = { priceAlerts: enabled };
    if (threshold !== undefined) {
      updates.alertThreshold = threshold;
    }
    await savePreferences(updates);
  };

  // Limpar histórico de buscas
  const clearRecentSearches = async () => {
    await savePreferences({
      recentSearches: [],
    });
  };

  // Resetar todas as preferências
  const resetPreferences = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setPreferences(DEFAULT_PREFERENCES);
    } catch (error) {
      console.error('Erro ao resetar preferências:', error);
    }
  };

  // Verificar se uma localização é favorita
  const isFavoriteLocation = (state: string, city: string) => {
    return preferences.favoriteState === state && preferences.favoriteCity === city;
  };

  // Verificar se um posto é favorito
  const isFavoriteStation = (stationId: string) => {
    return preferences.favoriteStations.some(station => station.id === stationId);
  };

  // Obter sugestões baseadas no histórico
  const getSuggestions = () => {
    const uniqueLocations = preferences.recentSearches.reduce((acc, search) => {
      const key = `${search.state}-${search.city}`;
      if (!acc[key]) {
        acc[key] = {
          state: search.state,
          city: search.city,
          count: 0,
          lastUsed: search.timestamp,
        };
      }
      acc[key].count++;
      acc[key].lastUsed = Math.max(acc[key].lastUsed, search.timestamp);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(uniqueLocations)
      .sort((a: any, b: any) => b.count - a.count || b.lastUsed - a.lastUsed)
      .slice(0, 5);
  };

  return {
    preferences,
    loading,
    setFavoriteLocation,
    setFavoriteFuelType,
    addRecentSearch,
    addFavoriteStation,
    removeFavoriteStation,
    setPriceAlerts,
    clearRecentSearches,
    resetPreferences,
    isFavoriteLocation,
    isFavoriteStation,
    getSuggestions,
  };
};

