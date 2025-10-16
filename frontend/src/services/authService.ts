import { LoginCredentials, AuthResponse, RegisterCredentials, AuthTokens } from "../types/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://giropro-78908506544.europe-west1.run.app/api/v1';

export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        senha: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.nome,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      tokens: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
};

export const registerApi = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: credentials.nome,
        email: credentials.email,
        senha: credentials.senha,
        dataNascimento: credentials.dataNascimento,
        cidade: credentials.cidade,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar conta');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.nome,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      tokens: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao criar conta');
  }
};

export const refreshTokenApi = async (refreshToken: string): Promise<AuthTokens> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao renovar token');
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao renovar token');
  }
};

export const logoutApi = async (): Promise<void> => {
  return Promise.resolve();
};
