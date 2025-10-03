import { storage } from '../utils/storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

export interface Platform {
  id: string;
  idUsuario: string;
  nome: string;
  isPadrao: boolean;
  ativa: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreatePlatformData {
  nome: string;
  ativa?: boolean;
}

export interface UpdatePlatformData {
  nome?: string;
  ativa?: boolean;
}

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

export const getPlatforms = async (): Promise<Platform[]> => {
  try {
    const response = await fetch(`${API_URL}/platforms`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar plataformas');
    }

    const data = await response.json();
    return data.platforms || [];
  } catch (error) {
    console.error('Erro ao buscar plataformas:', error);
    throw error;
  }
};

export const getActivePlatforms = async (): Promise<Platform[]> => {
  try {
    const response = await fetch(`${API_URL}/platforms/active`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar plataformas ativas');
    }

    const data = await response.json();
    return data.platforms || [];
  } catch (error) {
    console.error('Erro ao buscar plataformas ativas:', error);
    throw error;
  }
};

export const getPlatformById = async (id: string): Promise<Platform | null> => {
  try {
    const response = await fetch(`${API_URL}/platforms/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Erro ao buscar plataforma');
    }

    const data = await response.json();
    return data.platform || null;
  } catch (error) {
    console.error('Erro ao buscar plataforma por ID:', error);
    throw error;
  }
};

export const createPlatform = async (platformData: CreatePlatformData): Promise<Platform> => {
  try {
    const response = await fetch(`${API_URL}/platforms`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(platformData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar plataforma');
    }

    const data = await response.json();
    return data.platform;
  } catch (error) {
    console.error('Erro ao criar plataforma:', error);
    throw error;
  }
};

export const updatePlatform = async (id: string, updateData: UpdatePlatformData): Promise<Platform> => {
  try {
    const response = await fetch(`${API_URL}/platforms/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar plataforma');
    }

    const data = await response.json();
    return data.platform;
  } catch (error) {
    console.error('Erro ao atualizar plataforma:', error);
    throw error;
  }
};

export const deletePlatform = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/platforms/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao excluir plataforma');
    }

    return true;
  } catch (error) {
    console.error('Erro ao excluir plataforma:', error);
    throw error;
  }
};
