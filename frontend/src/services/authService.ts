import { client } from '@/api/common';

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  dataNascimento: string;
  cidade: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthResponse {
  user: {
    id: number;
    nome: string;
    email: string;
    dataNascimento?: string;
    cidade?: string;
  };
  tokens: AuthTokens;
}

export const registerApi = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>('/auth/register', data);
  return response;
};

export const loginApi = async (data: LoginData): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>('/auth/login', data);
  return response;
};

export const logoutApi = async (): Promise<void> => {
  await client.post('/auth/logout');
};

export const refreshTokenApi = async (refreshToken: string): Promise<AuthTokens> => {
  const response = await client.post<AuthTokens>('/auth/refresh', { refreshToken });
  return response;
};

export const getCurrentUser = async () => {
  const response = await client.get('/auth/me');
  return response;
};
