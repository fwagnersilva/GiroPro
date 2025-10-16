import axios from 'axios';
import { getItem } from '@/lib/storage';

// Forçar localhost em desenvolvimento
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://giropro-backend2.onrender.com/api/v1';

console.log('🔗 API URL configurada:', API_URL);

export const client = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar token automaticamente
client.interceptors.request.use(
  async (config) => {
    const token = getItem<{ access: string; refresh: string }>('token');
    if (token?.access) {
      config.headers.Authorization = `Bearer ${token.access}`;
    }
    console.log('📡 Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
client.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('❌ Error:', error.message, error.config?.url);
    if (error.response?.status === 401) {
      console.log('🔐 Token expirado, faça login novamente');
    }
    return Promise.reject(error);
  }
);
