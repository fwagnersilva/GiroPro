// Types para funcionalidade de Jornadas

export interface Journey {
  id: string;
  title: string;
  origin: string;
  destination: string;
  distance: number; // em quilômetros
  duration: string; // formato "Xh Ymin"
  fuelConsumption: number; // L/100km
  cost: number; // custo total em reais
  status: JourneyStatus;
  date: string; // formato "DD/MM/YYYY HH:mm"
  vehicleId: string;
  driverId?: string;
  route?: RoutePoint[];
  notes?: string;
  tags?: string[];
  weather?: WeatherInfo;
  traffic?: TrafficInfo;
}

export type JourneyStatus = 
  | 'completed' 
  | 'in_progress' 
  | 'paused' 
  | 'cancelled' 
  | 'planned';

export interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  speed?: number; // km/h
  altitude?: number; // metros
}

export interface WeatherInfo {
  condition: string; // "sunny", "rainy", "cloudy", etc.
  temperature: number; // Celsius
  humidity: number; // porcentagem
  windSpeed: number; // km/h
}

export interface TrafficInfo {
  level: 'light' | 'moderate' | 'heavy' | 'severe';
  delays: number; // minutos de atraso
  incidents: TrafficIncident[];
}

export interface TrafficIncident {
  type: 'accident' | 'construction' | 'closure' | 'congestion';
  description: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
}

export interface JourneyMetrics {
  totalDistance: number;
  totalDuration: number; // em minutos
  averageFuelConsumption: number;
  totalCost: number;
  averageSpeed: number; // km/h
  co2Emissions: number; // kg
}

export interface JourneyFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: JourneyStatus[];
  vehicleIds?: string[];
  driverIds?: string[];
  minDistance?: number;
  maxDistance?: number;
  minCost?: number;
  maxCost?: number;
  tags?: string[];
}

export interface JourneySortOption {
  field: 'date' | 'distance' | 'duration' | 'cost' | 'fuelConsumption';
  direction: 'asc' | 'desc';
}

export interface JourneyListState {
  journeys: Journey[];
  loading: boolean;
  error: string | null;
  filter: JourneyFilter;
  sortBy: JourneySortOption;
  page: number;
  hasMore: boolean;
}

export interface NewJourneyData {
  title: string;
  origin: string;
  destination: string;
  vehicleId: string;
  driverId?: string;
  plannedDate?: string;
  notes?: string;
  tags?: string[];
}

export interface JourneyUpdate {
  id: string;
  updates: Partial<Omit<Journey, 'id'>>;
}

// Hooks types
export interface UseJourneysReturn {
  journeys: Journey[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  filter: (filter: JourneyFilter) => void;
  sort: (sortBy: JourneySortOption) => void;
}

export interface UseJourneyDetailsReturn {
  journey: Journey | null;
  loading: boolean;
  error: string | null;
  update: (updates: Partial<Journey>) => Promise<void>;
  delete: () => Promise<void>;
}

// API Response types
export interface JourneysApiResponse {
  data: Journey[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  metrics: JourneyMetrics;
}

export interface JourneyApiResponse {
  data: Journey;
  relatedJourneys?: Journey[];
}

// Component Props types
export interface JourneyCardProps {
  journey: Journey;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export interface JourneyListProps {
  journeys: Journey[];
  loading?: boolean;
  onJourneyPress: (journey: Journey) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onLoadMore?: () => void;
  ListEmptyComponent?: React.ComponentType;
}

export interface JourneyFiltersProps {
  filter: JourneyFilter;
  onFilterChange: (filter: JourneyFilter) => void;
  vehicles: Array<{ id: string; name: string }>;
  drivers: Array<{ id: string; name: string }>;
}

export interface QuickFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export interface EmptyStateProps {
  onNewJourney: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

// Constants
export const JOURNEY_STATUS_LABELS: Record<JourneyStatus, string> = {
  completed: 'Concluída',
  in_progress: 'Em andamento',
  paused: 'Pausada',
  cancelled: 'Cancelada',
  planned: 'Planejada',
};

export const JOURNEY_STATUS_COLORS = {
  completed: '#4CAF50',
  in_progress: '#2196F3',
  paused: '#FFC107',
  cancelled: '#F44336',
  planned: '#9C27B0',
};

export const JOURNEY_STATUS_ICONS = {
  completed: 'checkmark-circle',
  in_progress: 'play-circle',
  paused: 'pause-circle',
  cancelled: 'close-circle',
  planned: 'calendar-outline',
} as const;

export const QUICK_FILTERS = [
  { key: 'all', label: 'Todas', icon: 'list-outline' },
  { key: 'today', label: 'Hoje', icon: 'today-outline' },
  { key: 'week', label: 'Semana', icon: 'calendar-outline' },
  { key: 'month', label: 'Mês', icon: 'calendar-outline' },
  { key: 'completed', label: 'Concluídas', icon: 'checkmark-circle-outline' },
  { key: 'in_progress', label: 'Em andamento', icon: 'play-circle-outline' },
] as const;

