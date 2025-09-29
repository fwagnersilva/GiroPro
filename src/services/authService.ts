import { LoginCredentials, AuthResponse, User, AuthTokens } from "../types/auth";

// Simula uma chamada de API para login
export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === "test@example.com" && credentials.password === "Password123") {
        const user: User = {
          id: "1",
          email: credentials.email,
          name: "Usuário Teste",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const tokens: AuthTokens = {
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token",
          expiresAt: Date.now() + 3600 * 1000, // Expira em 1 hora
        };
        resolve({ user, tokens });
      } else {
        reject(new Error("Credenciais inválidas"));
      }
    }, 1000);
  });
};

// Simula uma chamada de API para registro
export const registerApi = async (credentials: any): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        const user: User = {
          id: String(Math.random()),
          email: credentials.email,
          name: credentials.name || "Novo Usuário",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const tokens: AuthTokens = {
          accessToken: "mock-new-access-token",
          refreshToken: "mock-new-refresh-token",
          expiresAt: Date.now() + 3600 * 1000, // Expira em 1 hora
        };
        resolve({ user, tokens });
      } else {
        reject(new Error("Dados de registro inválidos"));
      }
    }, 1000);
  });
};

// Simula uma chamada de API para refresh de token
export const refreshTokenApi = async (refreshToken: string): Promise<AuthTokens> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (refreshToken === "mock-refresh-token") {
        const newTokens: AuthTokens = {
          accessToken: "mock-new-access-token-" + Math.random().toString(36).substring(7),
          refreshToken: "mock-refresh-token",
          expiresAt: Date.now() + 3600 * 1000, // Expira em 1 hora
        };
        resolve(newTokens);
      } else {
        reject(new Error("Refresh token inválido"));
      }
    }, 500);
  });
};

// Simula uma chamada de API para logout
export const logoutApi = async (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

