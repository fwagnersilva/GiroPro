import React, { createContext, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import { useTheme as useThemeHook } from '../hooks/use-theme';
import type { Theme } from '../hooks/use-theme';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  changeTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLight: boolean;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Provider de tema que gerencia o estado global do tema da aplicação
 * Deve ser usado no nível mais alto da aplicação para garantir que
 * todos os componentes tenham acesso ao contexto de tema
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeHook = useThemeHook();

  // Aplicar tema inicial no DOM (apenas web)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Aplicar classe de tema inicial
      if (themeHook.effectiveTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      // Aplicar variáveis CSS de tema no body para garantir que sejam aplicadas
      document.body.className = `${document.body.className} theme-transition`.trim();
    }
  }, [themeHook.effectiveTheme]);

  return (
    <ThemeContext.Provider value={themeHook}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de tema
 * Deve ser usado dentro de componentes que estão envolvidos pelo ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  
  return context;
};

/**
 * HOC (Higher-Order Component) para envolver componentes com o provider de tema
 * Útil para casos onde você precisa garantir que um componente tenha acesso ao tema
 */
export const withTheme = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => (
    <ThemeProvider>
      <Component {...props} />
    </ThemeProvider>
  );
  
  WrappedComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};
