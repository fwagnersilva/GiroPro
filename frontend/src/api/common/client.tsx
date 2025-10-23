import axios from 'axios';
import { getToken } from '@/lib/auth/utils';
import Constants from 'expo-constants';

// Detectar se está rodando em localhost
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Se localhost, usa backend local. Senão usa do config
const API_URL = isLocalhost 
  ? 'http://localhost:3000/api'
  : (Constants.expoConfig?.extra?.API_URL || 'https://giropro-backend-bn14.onrender.com/api');

console.log('📡 Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server');
console.log('📡 isLocalhost:', isLocalhost);
console.log('📡 API URL configurada:', API_URL);

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const token = getToken();
  console.log('📡 Request URL completa:', config.baseURL + config.url);
  
  if (token) {
    const accessToken = token.accessToken || (token as any).access;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } else {
    console.warn('❌ Nenhum token encontrado');
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
    return Promise.reject(error);
  }
);

export { client };
export default client;
