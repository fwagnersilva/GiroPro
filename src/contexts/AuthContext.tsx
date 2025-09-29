import React, { createContext, useReducer, useEffect, useContext, ReactNode } from 'react';
import { AuthState, AuthContextType, LoginCredentials, RegisterCredentials, User, AuthTokens } from '../types/auth';
import { loginApi, registerApi, refreshTokenApi, logoutApi } from '../services/authService';
import { setAuthTokens, getAuthTokens, removeAuthTokens, setUser, getUser, removeUser } from '../utils/storage';

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true, // Inicia como true para verificar o status de autenticação
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'LOGOUT' }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INITIAL_STATE'; payload: { user: User | null; tokens: AuthTokens | null; isAuthenticated: boolean } };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_INITIAL_STATE':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: action.payload.isAuthenticated,
        isLoading: false,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verifica o status de autenticação inicial ao carregar o aplicativo
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = await getUser();
        const storedTokens = await getAuthTokens();

        if (storedUser && storedTokens && storedTokens.expiresAt > Date.now()) {
          dispatch({
            type: 'SET_INITIAL_STATE',
            payload: { user: storedUser, tokens: storedTokens, isAuthenticated: true },
          });
        } else {
          // Tenta refresh token se houver um, mesmo que o access token tenha expirado
          if (storedTokens?.refreshToken) {
            try {
              const newTokens = await refreshTokenApi(storedTokens.refreshToken);
              await setAuthTokens(newTokens);
              dispatch({
                type: 'SET_INITIAL_STATE',
                payload: { user: storedUser, tokens: newTokens, isAuthenticated: true },
              });
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
              await removeAuthTokens();
              await removeUser();
              dispatch({ type: 'LOGOUT' });
            }
          } else {
            dispatch({ type: 'LOGOUT' }); // Não há tokens ou estão expirados e sem refresh token
          }
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
        dispatch({ type: 'LOGOUT' });
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const { user, tokens } = await loginApi(credentials);
      await setUser(user);
      await setAuthTokens(tokens);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, tokens } });
    } catch (err: any) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message || 'Erro ao fazer login' });
      throw err; // Rejeita a promessa para que o componente chamador possa lidar com o erro
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const { user, tokens } = await registerApi(credentials);
      await setUser(user);
      await setAuthTokens(tokens);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, tokens } });
    } catch (err: any) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message || 'Erro ao registrar' });
      throw err;
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await logoutApi();
      await removeAuthTokens();
      await removeUser();
      dispatch({ type: 'LOGOUT' });
    } catch (err: any) {
      console.error('Logout error:', err);
      dispatch({ type: 'AUTH_ERROR', payload: err.message || 'Erro ao fazer logout' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const refreshToken = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const storedTokens = await getAuthTokens();
      if (!storedTokens?.refreshToken) {
        throw new Error('No refresh token available');
      }
      const newTokens = await refreshTokenApi(storedTokens.refreshToken);
      await setAuthTokens(newTokens);
      const storedUser = await getUser(); // Re-obter usuário para garantir consistência
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: storedUser!, tokens: newTokens } });
    } catch (err: any) {
      console.error('Refresh token error:', err);
      await removeAuthTokens();
      await removeUser();
      dispatch({ type: 'LOGOUT' });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const checkAuthStatus = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const storedUser = await getUser();
      const storedTokens = await getAuthTokens();

      if (storedUser && storedTokens && storedTokens.expiresAt > Date.now()) {
        dispatch({
          type: 'SET_INITIAL_STATE',
          payload: { user: storedUser, tokens: storedTokens, isAuthenticated: true },
        });
      } else if (storedTokens?.refreshToken) {
        // Tenta refresh token se o access token expirou
        await refreshToken();
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    refreshToken,
    clearError,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

