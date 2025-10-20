import { LoginCredentials, AuthResponse, User, AuthTokens } from "../types/auth";

// URL da API - pode ser configurada via variável de ambiente
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

/**
 * Realiza login do usuário via API
 * @param credentials - Email e senha do usuário
 * @returns Dados do usuário e tokens de autenticação
 */
export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Mensagens de erro específicas baseadas no status
      if (response.status === 401) {
        throw new Error(errorData.message || 'Email ou senha incorretos');
      } else if (response.status === 404) {
        throw new Error('Usuário não encontrado');
      } else if (response.status === 429) {
        throw new Error('Muitas tentativas de login. Tente novamente mais tarde');
      } else {
        throw new Error(errorData.message || 'Erro ao fazer login. Tente novamente');
      }
    }

    const data = await response.json();
    
    // Valida se a resposta tem os campos esperados
    if (!data.user || !data.tokens) {
      throw new Error('Resposta inválida do servidor');
    }

    return {
      user: data.user,
      tokens: {
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        expiresAt: data.tokens.expiresAt || Date.now() + 3600 * 1000, // 1 hora por padrão
      },
    };
  } catch (error: any) {
    // Se for erro de rede
    if (error.message === 'Failed to fetch' || error.message === 'Network request failed') {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente');
    }
    
    // Repassa o erro original
    throw error;
  }
};

/**
 * Registra um novo usuário via API
 * @param credentials - Dados do novo usuário
 * @returns Dados do usuário criado e tokens de autenticação
 */
export const registerApi = async (credentials: any): Promise<AuthResponse> => {
  try {
    // Validar idade mínima no frontend (18 anos)
    if (credentials.dateOfBirth) {
      const [day, month, year] = credentials.dateOfBirth.split('/').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        throw new Error('Você deve ter pelo menos 18 anos para se cadastrar');
      }
    }

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Mensagens de erro específicas
      if (response.status === 409) {
        throw new Error('Este email já está cadastrado');
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Dados inválidos. Verifique os campos e tente novamente');
      } else {
        throw new Error(errorData.message || 'Erro ao criar conta. Tente novamente');
      }
    }

    const data = await response.json();
    
    if (!data.user || !data.tokens) {
      throw new Error('Resposta inválida do servidor');
    }

    return {
      user: data.user,
      tokens: {
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        expiresAt: data.tokens.expiresAt || Date.now() + 3600 * 1000,
      },
    };
  } catch (error: any) {
    if (error.message === 'Failed to fetch' || error.message === 'Network request failed') {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente');
    }
    throw error;
  }
};

/**
 * Renova o token de acesso usando o refresh token
 * @param refreshToken - Token de refresh
 * @returns Novos tokens de autenticação
 */
export const refreshTokenApi = async (refreshToken: string): Promise<AuthTokens> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente');
      } else {
        throw new Error(errorData.message || 'Erro ao renovar sessão');
      }
    }

    const data = await response.json();
    
    if (!data.tokens) {
      throw new Error('Resposta inválida do servidor');
    }

    return {
      accessToken: data.tokens.accessToken,
      refreshToken: data.tokens.refreshToken,
      expiresAt: data.tokens.expiresAt || Date.now() + 3600 * 1000,
    };
  } catch (error: any) {
    if (error.message === 'Failed to fetch' || error.message === 'Network request failed') {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente');
    }
    throw error;
  }
};

/**
 * Realiza logout do usuário via API
 * Invalida o refresh token no servidor
 */
export const logoutApi = async (): Promise<void> => {
  try {
    // Nota: O logout pode falhar se a rede estiver offline,
    // mas ainda assim devemos limpar os dados locais
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Ignora erros de logout - o importante é limpar os dados locais
    console.warn('Erro ao fazer logout no servidor:', error);
  }
};

