// API Error Handler Utility

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class ApiErrorHandler {
  static handleError(error: any): ApiError {
    // Se já é um erro tratado, retorna como está
    if (error.message && typeof error.message === 'string') {
      return {
        message: error.message,
        status: error.status,
        code: error.code,
        details: error.details
      };
    }

    // Erro de rede
    if (error.name === 'NetworkError' || !navigator.onLine) {
      return {
        message: 'Erro de conexão. Verifique sua internet e tente novamente.',
        status: 0,
        code: 'NETWORK_ERROR'
      };
    }

    // Erro de timeout
    if (error.name === 'TimeoutError') {
      return {
        message: 'A requisição demorou muito para responder. Tente novamente.',
        status: 408,
        code: 'TIMEOUT_ERROR'
      };
    }

    // Erro de parsing JSON
    if (error.name === 'SyntaxError') {
      return {
        message: 'Erro interno do servidor. Tente novamente mais tarde.',
        status: 500,
        code: 'PARSE_ERROR'
      };
    }

    // Erro genérico
    return {
      message: 'Ocorreu um erro inesperado. Tente novamente.',
      status: 500,
      code: 'UNKNOWN_ERROR',
      details: error
    };
  }

  static getStatusMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Dados inválidos enviados.';
      case 401:
        return 'Você não está autenticado. Faça login novamente.';
      case 403:
        return 'Você não tem permissão para realizar esta ação.';
      case 404:
        return 'Recurso não encontrado.';
      case 409:
        return 'Conflito de dados. Verifique as informações.';
      case 422:
        return 'Dados inválidos. Verifique os campos preenchidos.';
      case 429:
        return 'Muitas tentativas. Aguarde um momento e tente novamente.';
      case 500:
        return 'Erro interno do servidor. Tente novamente mais tarde.';
      case 502:
        return 'Servidor temporariamente indisponível.';
      case 503:
        return 'Serviço temporariamente indisponível.';
      default:
        return 'Erro desconhecido.';
    }
  }

  static async handleResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');
    
    try {
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        throw {
          message: data.message || this.getStatusMessage(response.status),
          status: response.status,
          code: data.code || `HTTP_${response.status}`,
          details: data
        };
      }

      return data;
    } catch (error: any) {
      if (error.status) {
        throw error; // Re-throw se já é um erro tratado
      }
      
      throw this.handleError(error);
    }
  }
}

// Hook para usar o tratamento de erros em componentes
export const useApiErrorHandler = () => {
  const showError = (error: ApiError) => {
    // Aqui você pode integrar com um sistema de notificações
    console.error('API Error:', error);
    
    // Por enquanto, apenas exibe um alert
    // Em uma implementação real, você usaria um toast ou modal
    alert(error.message);
  };

  const handleApiCall = async <T>(
    apiCall: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: ApiError) => void
  ): Promise<T | null> => {
    try {
      const result = await apiCall();
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (error: any) {
      const handledError = ApiErrorHandler.handleError(error);
      
      if (onError) {
        onError(handledError);
      } else {
        showError(handledError);
      }
      
      return null;
    }
  };

  return {
    showError,
    handleApiCall,
    handleError: ApiErrorHandler.handleError,
    handleResponse: ApiErrorHandler.handleResponse
  };
};

// Função utilitária para fazer requisições com tratamento de erro
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  // Adiciona token de autenticação se disponível
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  try {
    const response = await fetch(url, defaultOptions);
    return await ApiErrorHandler.handleResponse(response);
  } catch (error: any) {
    throw ApiErrorHandler.handleError(error);
  }
};

