import { storage } from '../utils/storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

export interface Journey {
  id: string;
  idUsuario: string;
  idVeiculo: string;
  dataInicio: string;
  kmInicio: number;
  dataFim?: string;
  kmFim?: number;
  ganhoBruto?: number;
  lucroLiquidoEstimado: number;
  margemLucro: number;
  kmTotal?: number;
  tempoTotal?: number;
  duracaoMinutos?: number;
  custoCombustivelEstimado: number;
  outrasDespesas: number;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformRevenue {
  idPlataforma: string;
  valor: number;
}

export interface SplitPlatformRevenue extends PlatformRevenue {
  valorAntesCorte?: number;
  valorDepoisCorte?: number;
}

export interface CreateJourneyData {
  idVeiculo: string;
  dataInicio: string;
  kmInicio: number;
  dataFim?: string;
  kmFim?: number;
  ganhoBruto?: number;
  observacoes?: string;
  plataformas?: (PlatformRevenue | SplitPlatformRevenue)[];
}

export interface UpdateJourneyData extends Partial<CreateJourneyData> {}

const getAuthToken = (): string | null => {
  return storage.getToken();
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const getJourneys = async (): Promise<Journey[]> => {
  try {
    const response = await fetch(`${API_URL}/journeys`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar jornadas');
    }

    const data = await response.json();
    return data.journeys || [];
  } catch (error) {
    console.error('Erro ao buscar jornadas:', error);
    throw error;
  }
};

export const getJourneyById = async (id: string): Promise<Journey | null> => {
  try {
    const response = await fetch(`${API_URL}/journeys/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Erro ao buscar jornada');
    }

    const data = await response.json();
    return data.journey || null;
  } catch (error) {
    console.error('Erro ao buscar jornada por ID:', error);
    throw error;
  }
};

export const createJourney = async (journeyData: CreateJourneyData): Promise<Journey> => {
  try {
    const response = await fetch(`${API_URL}/journeys`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(journeyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar jornada');
    }

    const data = await response.json();
    return data.journey;
  } catch (error) {
    console.error('Erro ao criar jornada:', error);
    throw error;
  }
};

export const updateJourney = async (id: string, updateData: UpdateJourneyData): Promise<Journey> => {
  try {
    const response = await fetch(`${API_URL}/journeys/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar jornada');
    }

    const data = await response.json();
    return data.journey;
  } catch (error) {
    console.error('Erro ao atualizar jornada:', error);
    throw error;
  }
};

export const deleteJourney = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/journeys/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao excluir jornada');
    }

    return true;
  } catch (error) {
    console.error('Erro ao excluir jornada:', error);
    throw error;
  }
};
