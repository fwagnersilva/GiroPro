import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Você também pode registrar o erro em um serviço de relatórios de erro
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI de fallback personalizada
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Algo deu errado</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'Ocorreu um erro inesperado.'}
          </Text>
          <Text style={styles.message}>Por favor, tente novamente mais tarde.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
});

export default ErrorBoundary;


