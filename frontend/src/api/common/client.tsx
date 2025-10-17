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
  
  if (token?.accessToken) {
    config.headers.Authorization = `Bearer ${token.accessToken}`;
  }
  
  console.log('📡 Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'Presente' : 'Ausente');
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
