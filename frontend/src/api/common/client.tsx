import axios from 'axios';
import { getToken } from '@/lib/auth/utils';

// Detecta se está em desenvolvimento local
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_URL = isLocalhost ? 'http://localhost:3000/api/v1' : 'https://giropro-78908506544.europe-west1.run.app/api/v1';

console.log('📡 API URL configurada:', API_URL);

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const token = getToken();
  
  console.log('🔍 DEBUG - Token recuperado:', token);
  
  if (token) {
    // ✅ MIGRAÇÃO: Aceitar tanto 'accessToken' quanto 'access' (estrutura antiga)
    const accessToken = token.accessToken || (token as any).access;
    
    console.log('🔍 DEBUG - accessToken extraído:', accessToken ? `${accessToken.substring(0, 30)}...` : 'NENHUM');
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('📡 Request:', config.method?.toUpperCase(), config.url, '✅ Token adicionado');
      console.log('🔍 DEBUG - Header completo:', config.headers.Authorization?.substring(0, 50) + '...');
    } else {
      console.warn('⚠️ Token encontrado mas sem accessToken:', token);
    }
  } else {
    console.warn('❌ Nenhum token encontrado no sessionStorage/cache');
  }
  
  return config;
});

client.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      console.error('🔐 Não autenticado - Token pode estar inválido ou expirado');
      console.error('🔍 DEBUG - Dados do erro:', error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

export { client };
export default client;