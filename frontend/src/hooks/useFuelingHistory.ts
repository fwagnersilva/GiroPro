import { useState, useEffect, useCallback, useMemo } from 'react';
import { Animated } from 'react-native';
import { fuelingService, vehicleService } from '../services/api';
import { Fueling, Vehicle } from '../types';

interface FuelingWithVehicle extends Fueling {
  veiculo_marca?: string;
  veiculo_modelo?: string;
  veiculo_placa?: string;
}

interface FuelingFilters {
  searchText: string;
  selectedVehicle: string;
  selectedFuelType: string;
}

interface QuickStats {
  totalSpent: number;
  totalLiters: number;
  averagePrice: number;
  lastFueling: FuelingWithVehicle | null;
  fuelingsCount: number;
}

// Hook para gerenciar o histórico de abastecimentos
export const useFuelingHistory = () => {
  const [fuelings, setFuelings] = useState<FuelingWithVehicle[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVehicles = useCallback(async () => {
    try {
      const vehiclesData = await vehicleService.getVehicles();
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      setError('Erro ao carregar veículos');
    }
  }, []);

  const loadFuelings = useCallback(async (
    pageNumber: number, 
    reset: boolean = false,
    filters: FuelingFilters = { searchText: '', selectedVehicle: '', selectedFuelType: '' }
  ) => {
    try {
      setError(null);
      
      if (pageNumber === 1) {
        setRefreshing(true);
      } else {
        setLoadingMore(true);
      }

      const params: any = {
        page: pageNumber,
        limit: 20,
      };

      if (filters.selectedVehicle) {
        params.id_veiculo = filters.selectedVehicle;
      }

      if (filters.selectedFuelType) {
        params.tipo_combustivel = filters.selectedFuelType;
      }

      if (filters.searchText.trim()) {
        params.search = filters.searchText.trim();
      }

      const response = await fuelingService.getFuelings(params);
      const newFuelings = response.data || [];

      // Enriquecer com dados do veículo
      const enrichedFuelings = newFuelings.map((fueling: Fueling) => {
        const vehicle = vehicles.find(v => v.id === fueling.id_veiculo);
        return {
          ...fueling,
          veiculo_marca: vehicle?.marca,
          veiculo_modelo: vehicle?.modelo,
          veiculo_placa: vehicle?.placa,
        };
      });

      if (reset || pageNumber === 1) {
        setFuelings(enrichedFuelings);
        setPage(1);
      } else {
        setFuelings(prev => [...prev, ...enrichedFuelings]);
      }

      setPage(pageNumber);
      setHasMore(newFuelings.length === 20);

    } catch (error: any) {
      console.error('Erro ao carregar abastecimentos:', error);
      setError(error.message || 'Não foi possível carregar os abastecimentos');
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [vehicles]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        loadVehicles(),
        loadFuelings(1, true)
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  }, [loadVehicles, loadFuelings]);

  const deleteFueling = useCallback(async (fuelingId: string) => {
    try {
      await fuelingService.deleteFueling(fuelingId);
      setFuelings(prev => prev.filter(f => f.id !== fuelingId));
      return true;
    } catch (error: any) {
      setError(error.message || 'Não foi possível excluir o abastecimento');
      return false;
    }
  }, []);

  return {
    fuelings,
    vehicles,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    loadInitialData,
    loadFuelings,
    deleteFueling,
    loadMore: () => loadFuelings(page + 1),
  };
};

// Hook para gerenciar filtros
export const useFuelingFilters = (onFiltersChange: (filters: FuelingFilters) => void) => {
  const [searchText, setSearchText] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filters = useMemo(() => ({
    searchText,
    selectedVehicle,
    selectedFuelType,
  }), [searchText, selectedVehicle, selectedFuelType]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchText.trim()) count++;
    if (selectedVehicle) count++;
    if (selectedFuelType) count++;
    return count;
  }, [searchText, selectedVehicle, selectedFuelType]);

  const clearFilters = useCallback(() => {
    setSearchText('');
    setSelectedVehicle('');
    setSelectedFuelType('');
  }, []);

  // Debounce para busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, onFiltersChange]);

  return {
    searchText,
    setSearchText,
    selectedVehicle,
    setSelectedVehicle,
    selectedFuelType,
    setSelectedFuelType,
    showFilters,
    setShowFilters,
    activeFiltersCount,
    clearFilters,
    filters,
  };
};

// Hook para calcular estatísticas rápidas
export const useQuickStats = (fuelings: FuelingWithVehicle[]): QuickStats => {
  return useMemo(() => {
    if (fuelings.length === 0) {
      return {
        totalSpent: 0,
        totalLiters: 0,
        averagePrice: 0,
        lastFueling: null,
        fuelingsCount: 0,
      };
    }

    const totalSpent = fuelings.reduce((sum, f) => sum + f.valor_total, 0);
    const totalLiters = fuelings.reduce((sum, f) => sum + f.quantidade_litros, 0);
    const averagePrice = totalLiters > 0 ? totalSpent / totalLiters : 0;
    const lastFueling = fuelings[0]; // Assumindo que a lista está ordenada por data

    return {
      totalSpent,
      totalLiters,
      averagePrice,
      lastFueling,
      fuelingsCount: fuelings.length,
    };
  }, [fuelings]);
};

// Hook para animações
export const useAnimations = () => {
  const [filterAnimation] = useState(new Animated.Value(0));
  const [cardAnimations] = useState<{ [key: string]: Animated.Value }>({});

  const animateFilters = useCallback((show: boolean) => {
    Animated.timing(filterAnimation, {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [filterAnimation]);

  const animateCard = useCallback((cardId: string, delay: number = 0) => {
    if (!cardAnimations[cardId]) {
      cardAnimations[cardId] = new Animated.Value(0);
    }

    Animated.timing(cardAnimations[cardId], {
      toValue: 1,
      duration: 300,
      delay,
      useNativeDriver: true,
    }).start();
  }, [cardAnimations]);

  const getCardAnimation = useCallback((cardId: string) => {
    if (!cardAnimations[cardId]) {
      cardAnimations[cardId] = new Animated.Value(0);
    }
    return cardAnimations[cardId];
  }, [cardAnimations]);

  return {
    filterAnimation,
    animateFilters,
    animateCard,
    getCardAnimation,
  };
};

// Hook para formatação de dados
export const useFormatters = () => {
  const formatCurrency = useCallback((centavos: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(centavos / 100);
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  const formatRelativeDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses atrás`;
    
    return `${Math.floor(diffDays / 365)} anos atrás`;
  }, []);

  return {
    formatCurrency,
    formatDate,
    formatRelativeDate,
  };
};

// Hook para agrupamento de dados
export const useGroupedFuelings = (fuelings: FuelingWithVehicle[]) => {
  return useMemo(() => {
    const groups: { [key: string]: FuelingWithVehicle[] } = {};
    
    fuelings.forEach(fueling => {
      const date = new Date(fueling.data_abastecimento);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey: string;
      
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Hoje';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Ontem';
      } else {
        const diffTime = today.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 7) {
          groupKey = 'Esta semana';
        } else if (diffDays <= 30) {
          groupKey = 'Este mês';
        } else {
          groupKey = date.toLocaleDateString('pt-BR', { 
            month: 'long', 
            year: 'numeric' 
          });
        }
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(fueling);
    });
    
    return groups;
  }, [fuelings]);
};

