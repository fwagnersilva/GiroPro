import { Env } from '@env';
import axios from 'axios';
import { getItem } from '@/lib/storage';

export const client = axios.create({
  baseURL: Env.API_URL,
});

// Interceptor para adicionar token automaticamente
client.interceptors.request.use(
  async (config) => {
    const token = getItem<{ access: string; refresh: string }>('token');
    if (token?.access) {
      config.headers.Authorization = `Bearer ${token.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('Token expirado, faça login novamente');
    }
    return Promise.reject(error);
  }
);