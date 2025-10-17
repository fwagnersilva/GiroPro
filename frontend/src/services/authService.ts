const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_URL = isLocalhost
  ? 'http://localhost:3000/api/v1'
  : 'https://giropro-78908506544.europe-west1.run.app/api/v1';

console.log('🌐 API URL configurada:', API_URL);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  nome: string;
  email: string;
  senha: string;
  dataNascimento: string;
  cidade: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  tokens: AuthTokens;
}

export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('📡 Login para:', `${API_URL}/auth/login`);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        senha: credentials.password,
      }),
    });

    const data = await response.json();
    console.log('📦 Resposta:', data);

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erro ao fazer login');
    }

    return {
      user: {
        id: data.user?.id || data.userId,
        email: data.user?.email || data.email,
        name: data.user?.nome || data.user?.name || data.nome,
        createdAt: data.user?.createdAt || new Date().toISOString(),
        updatedAt: data.user?.updatedAt || new Date().toISOString(),
      },
      tokens: {
        accessToken: data.accessToken || data.token || data.tokens?.accessToken,
        refreshToken: data.refreshToken || data.tokens?.refreshToken,
        expiresAt: data.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000,
      },
    };
  } catch (error: any) {
    console.error('❌ Erro no login:', error);
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
};

export const registerApi = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erro ao criar conta');
    }

    return {
      user: {
        id: data.user?.id || data.userId,
        email: data.user?.email || data.email,
        name: data.user?.nome || data.user?.name || data.nome,
        createdAt: data.user?.createdAt || new Date().toISOString(),
        updatedAt: data.user?.updatedAt || new Date().toISOString(),
      },
      tokens: {
        accessToken: data.accessToken || data.token || data.tokens?.accessToken,
        refreshToken: data.refreshToken || data.tokens?.refreshToken,
        expiresAt: data.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000,
      },
    };
  } catch (error: any) {
    console.error('❌ Erro no registro:', error);
    throw new Error(error.message || 'Erro ao criar conta');
  }
};

export const refreshTokenApi = async (refreshToken: string): Promise<AuthTokens> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Erro ao renovar token');
    }

    return {
      accessToken: data.accessToken || data.token,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao renovar token');
  }
};

export const logoutApi = async (): Promise<void> => {
  return Promise.resolve();
};
