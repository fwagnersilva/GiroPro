import { Env } from '@env';
import axios from 'axios';
import { getToken } from '@/lib/auth';

export const client = axios.create({
  baseURL: Env.API_URL,
});

// Interceptor para adicionar token automaticamente
client.interceptors.request.use(
  async (config) => {
    const token = getToken();
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
      // Token expirado - redirecionar para login
      console.log('Token expirado, faça login novamente');
    }
    return Promise.reject(error);
  }
);
