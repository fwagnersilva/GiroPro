import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';

// Instância do MMKV para persistir preferências
const storage = new MMKV();

export type Theme = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'app-theme';

/**
 * Hook personalizado para gerenciar o tema da aplicação
 * Suporta temas claro, escuro e automático (baseado no sistema)
 */
export const useTheme = () => {
  // Estado do tema atual
  const [theme, setTheme] = useState<Theme>(() => {
    // Recupera o tema salvo ou usa 'light' como padrão FORÇADO
    const savedTheme = storage.getString(THEME_STORAGE_KEY) as Theme;
    // FORÇANDO TEMA CLARO PARA RESOLVER PROBLEMA DE LEGIBILIDADE
    return savedTheme || 'light'; 
  });

  // Estado do tema efetivo (resolvido)
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Função para detectar preferência do sistema
  const getSystemTheme = (): 'light' | 'dark' => {
    // Retorna 'light' por padrão para evitar o tema escuro automático
    return 'light';
  };

  // Função para aplicar o tema no DOM (apenas web)
  const applyThemeToDOM = (themeToApply: 'light' | 'dark') => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const root = document.documentElement;
      
      if (themeToApply === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Função para resolver o tema efetivo
  const resolveEffectiveTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      // Usar 'light' em vez de getSystemTheme() para forçar o tema claro
      return 'light';
    }
    return currentTheme;
  };

  // Efeito para atualizar o tema efetivo quando o tema muda
  useEffect(() => {
    const newEffectiveTheme = resolveEffectiveTheme(theme);
    setEffectiveTheme(newEffectiveTheme);
    applyThemeToDOM(newEffectiveTheme);
  }, [theme]);

  // Efeito para escutar mudanças na preferência do sistema (apenas web)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = () => {
        if (theme === 'system') {
          // Não faz nada, pois o tema 'system' foi forçado para 'light'
        }
      };

      // Adiciona listener para mudanças na preferência do sistema
      mediaQuery.addEventListener('change', handleSystemThemeChange);

      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, [theme]);

  // Função para alterar o tema
  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    storage.set(THEME_STORAGE_KEY, newTheme);
  };

  // Função para alternar entre claro e escuro
  const toggleTheme = () => {
    const newTheme = effectiveTheme === 'light' ? 'dark' : 'light';
    changeTheme(newTheme);
  };

  return {
    theme,
    effectiveTheme,
    changeTheme,
    toggleTheme,
    isLight: effectiveTheme === 'light',
    isDark: effectiveTheme === 'dark',
  };
};
