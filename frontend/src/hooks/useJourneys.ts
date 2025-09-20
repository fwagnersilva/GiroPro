import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Journey, 
  JourneyFilter, 
  JourneySortOption, 
  UseJourneysReturn,
  JourneyMetrics,
  CreateJourneyRequest,
  UpdateJourneyRequest
} from '../types/journey';
import { journeyService } from '../services/api';

export const useJourneys = (initialFilter?: JourneyFilter): UseJourneysReturn => {
  const [allJourneys, setAllJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<JourneyFilter>(initialFilter || {});
  const [sortBy, setSortBy] = useState<JourneySortOption>({
    field: 'date',
    direction: 'desc',
  });

  const loadJourneys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await journeyService.getJourneys();
      setAllJourneys(response.data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar jornadas. Tente novamente.");
      console.error("Erro ao carregar jornadas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar jornadas baseado nos filtros ativos
  const filteredJourneys = useMemo(() => {
    let filtered = [...allJourneys];

    // Filtro por período
    if (filter.dateRange) {
      filtered = filtered.filter(journey => {
        const journeyDate = parseJourneyDate(journey.date);
        return journeyDate >= filter.dateRange!.start && journeyDate <= filter.dateRange!.end;
      });
    }

    // Filtro por status
    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter(journey => filter.status!.includes(journey.status));
    }

    // Filtro por veículos
    if (filter.vehicleIds && filter.vehicleIds.length > 0) {
      filtered = filtered.filter(journey => filter.vehicleIds!.includes(journey.vehicleId));
    }

    // Filtro por motoristas
    if (filter.driverIds && filter.driverIds.length > 0) {
      filtered = filtered.filter(journey => 
        journey.driverId && filter.driverIds!.includes(journey.driverId)
      );
    }

    // Filtro por distância mínima
    if (filter.minDistance !== undefined) {
      filtered = filtered.filter(journey => journey.distance >= filter.minDistance!);
    }

    // Filtro por distância máxima
    if (filter.maxDistance !== undefined) {
      filtered = filtered.filter(journey => journey.distance <= filter.maxDistance!);
    }

    // Filtro por custo mínimo
    if (filter.minCost !== undefined) {
      filtered = filtered.filter(journey => journey.cost >= filter.minCost!);
    }

    // Filtro por custo máximo
    if (filter.maxCost !== undefined) {
      filtered = filtered.filter(journey => journey.cost <= filter.maxCost!);
    }

    // Filtro por tags
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(journey => 
        journey.tags && journey.tags.some(tag => filter.tags!.includes(tag))
      );
    }

    return filtered;
  }, [allJourneys, filter]);

  // Ordenar jornadas
  const sortedJourneys = useMemo(() => {
    const sorted = [...filteredJourneys];
    
    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy.field) {
        case 'date':
          aValue = parseJourneyDate(a.date);
          bValue = parseJourneyDate(b.date);
          break;
        case 'distance':
          aValue = a.distance;
          bValue = b.distance;
          break;
        case 'duration':
          aValue = parseDuration(a.duration);
          bValue = parseDuration(b.duration);
          break;
        case 'cost':
          aValue = a.cost;
          bValue = b.cost;
          break;
        case 'fuelConsumption':
          aValue = a.fuelConsumption;
          bValue = b.fuelConsumption;
          break;
        default:
          return 0;
      }

      if (sortBy.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [filteredJourneys, sortBy]);

  // Calcular métricas
  const metrics = useMemo((): JourneyMetrics => {
    const completedJourneys = sortedJourneys.filter(j => j.status === 'completed');
    
    if (completedJourneys.length === 0) {
      return {
        totalDistance: 0,
        totalDuration: 0,
        averageFuelConsumption: 0,
        totalCost: 0,
        averageSpeed: 0,
        co2Emissions: 0,
      };
    }

    const totalDistance = completedJourneys.reduce((sum, j) => sum + j.distance, 0);
    const totalDuration = completedJourneys.reduce((sum, j) => sum + parseDuration(j.duration), 0);
    const totalCost = completedJourneys.reduce((sum, j) => sum + j.cost, 0);
    const averageFuelConsumption = completedJourneys.reduce((sum, j) => sum + j.fuelConsumption, 0) / completedJourneys.length;
    const averageSpeed = totalDistance / (totalDuration / 60); // km/h
    const co2Emissions = totalDistance * 0.12; // Estimativa: 120g CO2/km

    return {
      totalDistance,
      totalDuration,
      averageFuelConsumption,
      totalCost,
      averageSpeed,
      co2Emissions,
    };
  }, [sortedJourneys]);

  // Refresh data
  const refresh = useCallback(async () => {
    await loadJourneys();
  }, [loadJourneys]);

  // Load more (para paginação futura)
  const loadMore = useCallback(async () => {
    // Implementar paginação quando necessário
    console.log('Load more journeys');
  }, []);

  // Apply filter
  const applyFilter = useCallback((newFilter: JourneyFilter) => {
    setFilter(newFilter);
  }, []);

  // Apply sort
  const applySort = useCallback((newSortBy: JourneySortOption) => {
    setSortBy(newSortBy);
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    loadJourneys();
  }, [loadJourneys]);

  const createJourney = useCallback(async (journeyData: CreateJourneyRequest) => {
    try {
      setLoading(true);
      await journeyService.createJourney(journeyData);
      await loadJourneys();
    } catch (err: any) {
      setError(err.message || "Erro ao criar jornada.");
      console.error("Erro ao criar jornada:", err);
    } finally {
      setLoading(false);
    }
  }, [loadJourneys]);

  const updateJourney = useCallback(async (id: string, journeyData: UpdateJourneyRequest) => {
    try {
      setLoading(true);
      await journeyService.updateJourney(id, journeyData);
      await loadJourneys();
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar jornada.");
      console.error("Erro ao atualizar jornada:", err);
    } finally {
      setLoading(false);
    }
  }, [loadJourneys]);

  const deleteJourney = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await journeyService.deleteJourney(id);
      await loadJourneys();
    } catch (err: any) {
      setError(err.message || "Erro ao excluir jornada.");
      console.error("Erro ao excluir jornada:", err);
    } finally {
      setLoading(false);
    }
  }, [loadJourneys]);

  return {
    journeys: sortedJourneys,
    loading,
    error,
    refresh,
    loadMore,
    filter: applyFilter,
    sort: applySort,
    metrics,
    createJourney,
    updateJourney,
    deleteJourney,
  };
};

// Utility functions
const parseJourneyDate = (dateString: string): Date => {
  // Converter "DD/MM/YYYY HH:mm" para Date
  const [datePart, timePart] = dateString.split(' ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  
  return new Date(year, month - 1, day, hours, minutes);
};

const parseDuration = (duration: string): number => {
  // Converter "Xh Ymin" para minutos
  const hoursMatch = duration.match(/(\d+)h/);
  const minutesMatch = duration.match(/(\d+)min/);
  
  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
  
  return hours * 60 + minutes;
};

// Hook para filtros rápidos
export const useQuickFilters = () => {
  const getQuickFilter = useCallback((filterKey: string): JourneyFilter => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (filterKey) {
      case 'today':
        return {
          dateRange: {
            start: today,
            end: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        };
      case 'week':
        return {
          dateRange: {
            start: weekStart,
            end: now,
          },
        };
      case 'month':
        return {
          dateRange: {
            start: monthStart,
            end: now,
          },
        };
      case 'completed':
        return {
          status: ['completed'],
        };
      case 'in_progress':
        return {
          status: ['in_progress'],
        };
      default:
        return {};
    }
  }, []);

  return { getQuickFilter };
};

