// src/lib/auth/utils.ts
// Armazenar token em sessionStorage (funciona em aba anônima) com fallback para memória

let tokenCache: any = null;

export type TokenType = {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
};

export const setToken = (token: TokenType) => {
  try {
    // Tentar sessionStorage primeiro (funciona em aba anônima)
    sessionStorage.setItem('auth_token', JSON.stringify(token));
    tokenCache = token;
  } catch (error) {
    // Se sessionStorage falhar, usar cache em memória
    console.warn('sessionStorage não disponível, usando cache em memória');
    tokenCache = token;
  }
};

export const getToken = (): TokenType | null => {
  try {
    // Tentar recuperar do sessionStorage
    const stored = sessionStorage.getItem('auth_token');
    if (stored) {
      tokenCache = JSON.parse(stored);
      return tokenCache;
    }
  } catch (error) {
    console.warn('Erro ao ler sessionStorage');
  }

  // Retornar do cache se sessionStorage falhou
  return tokenCache;
};

export const removeToken = () => {
  try {
    sessionStorage.removeItem('auth_token');
  } catch (error) {
    console.warn('Erro ao remover de sessionStorage');
  }
  tokenCache = null;
};

// Exportar token do cache para uso durante a sessão
export const getTokenSync = () => tokenCache;