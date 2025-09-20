import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock types for web version
interface User {
  id: string;
  nome: string;
  email: string;
}

interface LoginRequest {
  email: string;
  senha: string;
}

interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signUp: (userData: RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock auth service for web
const mockAuthService = {
  async login(credentials: LoginRequest) {
    // Usar API real
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: credentials.email, senha: credentials.senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    if (data.success) {
      const user = {
        id: data.user.id,
        nome: data.user.nome,
        email: data.user.email,
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', data.accessToken);
      return { user };
    } else {
      throw new Error(data.message || 'Erro ao fazer login');
    }
  },

  async register(userData: RegisterRequest) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = {
      id: Date.now().toString(),
      nome: userData.nome,
      email: userData.email,
    };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'mock-jwt-token');
    return { user };
  },

  async getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async getStoredToken() {
    return localStorage.getItem('token');
  },

  async logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await mockAuthService.getCurrentUser();
      const token = await mockAuthService.getStoredToken();
      
      if (storedUser && token) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await mockAuthService.login(credentials);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      const response = await mockAuthService.register(userData);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await mockAuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;

