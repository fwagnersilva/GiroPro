import { useReducer, useCallback, useEffect } from 'react';
import { LoginFormState, LoginFormAction } from '../types/auth';
import { validateEmail, validatePassword, debounce } from '../utils/validation';

const initialState: LoginFormState = {
  email: '',
  password: '',
  rememberMe: false,
  isLoading: false,
  errors: {},
  touched: {
    email: false,
    password: false,
  },
};

function loginFormReducer(state: LoginFormState, action: LoginFormAction): LoginFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.message,
        },
      };

    case 'CLEAR_ERROR':
      const { [action.field]: _, ...restErrors } = state.errors;
      return {
        ...state,
        errors: restErrors,
      };

    case 'SET_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case 'RESET_FORM':
      return initialState;

    default:
      return state;
  }
}

export const useLoginForm = () => {
  const [state, dispatch] = useReducer(loginFormReducer, initialState);

  // Validação com debounce para email
  const debouncedValidateEmail = useCallback(
    debounce((email: string) => {
      if (state.touched.email) {
        const validation = validateEmail(email);
        if (!validation.isValid) {
          dispatch({ type: 'SET_ERROR', field: 'email', message: validation.message! });
        } else {
          dispatch({ type: 'CLEAR_ERROR', field: 'email' });
        }
      }
    }, 300),
    [state.touched.email]
  );

  // Validação com debounce para senha
  const debouncedValidatePassword = useCallback(
    debounce((password: string) => {
      if (state.touched.password) {
        const validation = validatePassword(password);
        if (!validation.isValid) {
          dispatch({ type: 'SET_ERROR', field: 'password', message: validation.message! });
        } else {
          dispatch({ type: 'CLEAR_ERROR', field: 'password' });
        }
      }
    }, 300),
    [state.touched.password]
  );

  // Executar validação quando os campos mudarem
  useEffect(() => {
    debouncedValidateEmail(state.email);
  }, [state.email, debouncedValidateEmail]);

  useEffect(() => {
    debouncedValidatePassword(state.password);
  }, [state.password, debouncedValidatePassword]);

  // Funções para atualizar campos
  const setEmail = useCallback((email: string) => {
    dispatch({ type: 'SET_FIELD', field: 'email', value: email });
  }, []);

  const setPassword = useCallback((password: string) => {
    dispatch({ type: 'SET_FIELD', field: 'password', value: password });
  }, []);

  const setRememberMe = useCallback((rememberMe: boolean) => {
    dispatch({ type: 'SET_FIELD', field: 'rememberMe', value: rememberMe });
  }, []);

  // Funções para gerenciar estado de touched
  const setEmailTouched = useCallback(() => {
    dispatch({ type: 'SET_TOUCHED', field: 'email' });
  }, []);

  const setPasswordTouched = useCallback(() => {
    dispatch({ type: 'SET_TOUCHED', field: 'password' });
  }, []);

  // Funções para gerenciar erros
  const setError = useCallback((field: keyof LoginFormState['errors'], message: string) => {
    dispatch({ type: 'SET_ERROR', field, message });
  }, []);

  const clearError = useCallback((field: keyof LoginFormState['errors']) => {
    dispatch({ type: 'CLEAR_ERROR', field });
  }, []);

  const clearAllErrors = useCallback(() => {
    Object.keys(state.errors).forEach(field => {
      dispatch({ type: 'CLEAR_ERROR', field: field as keyof LoginFormState['errors'] });
    });
  }, [state.errors]);

  // Função para gerenciar loading
  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', isLoading });
  }, []);

  // Função para resetar formulário
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  // Validação completa do formulário
  const validateForm = useCallback(() => {
    const emailValidation = validateEmail(state.email);
    const passwordValidation = validatePassword(state.password);

    if (!emailValidation.isValid) {
      dispatch({ type: 'SET_ERROR', field: 'email', message: emailValidation.message! });
    }

    if (!passwordValidation.isValid) {
      dispatch({ type: 'SET_ERROR', field: 'password', message: passwordValidation.message! });
    }

    return emailValidation.isValid && passwordValidation.isValid;
  }, [state.email, state.password]);

  // Verificar se o formulário é válido
  const isFormValid = useCallback(() => {
    return (
      state.email.trim() !== '' &&
      state.password.trim() !== '' &&
      Object.keys(state.errors).length === 0
    );
  }, [state.email, state.password, state.errors]);

  // Função para submeter o formulário
  const handleSubmit = useCallback(async (onSubmit: (email: string, password: string, rememberMe: boolean) => Promise<void>) => {
    // Marcar todos os campos como touched
    dispatch({ type: 'SET_TOUCHED', field: 'email' });
    dispatch({ type: 'SET_TOUCHED', field: 'password' });

    // Validar formulário
    if (!validateForm()) {
      return false;
    }

    try {
      setLoading(true);
      clearAllErrors();
      await onSubmit(state.email, state.password, state.rememberMe);
      return true;
    } catch (error: any) {
      setError('general', error.message || 'Erro ao fazer login');
      return false;
    } finally {
      setLoading(false);
    }
  }, [state.email, state.password, state.rememberMe, validateForm, setLoading, clearAllErrors, setError]);

  return {
    // Estado
    ...state,
    
    // Funções para atualizar campos
    setEmail,
    setPassword,
    setRememberMe,
    
    // Funções para gerenciar touched
    setEmailTouched,
    setPasswordTouched,
    
    // Funções para gerenciar erros
    setError,
    clearError,
    clearAllErrors,
    
    // Funções para gerenciar loading
    setLoading,
    
    // Utilitários
    resetForm,
    validateForm,
    isFormValid: isFormValid(),
    handleSubmit,
  };
};

