export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  dateOfBirth?: string; // Adicionado campo para data de nascimento
  city?: string; // Adicionado campo para cidade
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  dateOfBirth: string; // Adicionado campo para data de nascimento
  city: string; // Adicionado campo para cidade
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Ações
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  
  // Utilitários
  checkAuthStatus: () => Promise<void>;
}

export interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
  isLoading: boolean;
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };
  touched: {
    email: boolean;
    password: boolean;
  };
}

export interface RegisterFormState {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  dateOfBirth: string; // Adicionado campo para data de nascimento
  city: string; // Adicionado campo para cidade
  isLoading: boolean;
  errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    dateOfBirth?: string; // Adicionado campo para data de nascimento
    city?: string; // Adicionado campo para cidade
    general?: string;
  };
  touched: {
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
    name: boolean;
    dateOfBirth: boolean; // Adicionado campo para data de nascimento
    city: boolean; // Adicionado campo para cidade
  };
}

export type LoginFormAction =
  | { type: 'SET_FIELD'; field: keyof Omit<LoginFormState, 'errors' | 'touched' | 'isLoading'>; value: any }
  | { type: 'SET_ERROR'; field: keyof LoginFormState['errors']; message: string }
  | { type: 'CLEAR_ERROR'; field: keyof LoginFormState['errors'] }
  | { type: 'SET_TOUCHED'; field: keyof LoginFormState['touched'] }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'RESET_FORM' };

export type RegisterFormAction =
  | { type: 'SET_FIELD'; field: keyof Omit<RegisterFormState, 'errors' | 'touched' | 'isLoading'>; value: any }
  | { type: 'SET_ERROR'; field: keyof RegisterFormState['errors']; message: string }
  | { type: 'CLEAR_ERROR'; field: keyof RegisterFormState['errors'] }
  | { type: 'SET_TOUCHED'; field: keyof RegisterFormState['touched'] }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'RESET_FORM' };

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

