import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '@/lib/hooks/use-theme';
import { Text } from './text';

// Ícones simples usando texto (você pode substituir por ícones SVG)
const SunIcon = () => (
  <Text className="text-lg">☀️</Text>
);

const MoonIcon = () => (
  <Text className="text-lg">🌙</Text>
);

const SystemIcon = () => (
  <Text className="text-lg">💻</Text>
);

interface ThemeToggleProps {
  /**
   * Variante do componente
   * - 'button': Botão simples com ícone
   * - 'switch': Switch com ícones e labels
   * - 'dropdown': Dropdown com todas as opções (light, dark, system)
   */
  variant?: 'button' | 'switch' | 'dropdown';
  
  /**
   * Tamanho do componente
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Se deve mostrar o label
   */
  showLabel?: boolean;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'button',
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const { theme, effectiveTheme, changeTheme, toggleTheme } = useTheme();

  // Configurações de tamanho
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  // Renderização do botão simples
  if (variant === 'button') {
    return (
      <Pressable
        onPress={toggleTheme}
        className={`
          ${sizeClasses[size]}
          bg-theme-surface
          border border-theme
          rounded-lg
          items-center
          justify-center
          theme-transition
          active:opacity-70
          ${className}
        `}
        accessibilityRole="button"
        accessibilityLabel={`Alternar para modo ${effectiveTheme === 'light' ? 'escuro' : 'claro'}`}
      >
        <View className="items-center justify-center">
          {effectiveTheme === 'light' ? <MoonIcon /> : <SunIcon />}
          {showLabel && (
            <Text className="text-theme-secondary text-xs mt-1">
              {effectiveTheme === 'light' ? 'Escuro' : 'Claro'}
            </Text>
          )}
        </View>
      </Pressable>
    );
  }

  // Renderização do switch
  if (variant === 'switch') {
    return (
      <View className={`flex-row items-center ${className}`}>
        <Pressable
          onPress={() => changeTheme('light')}
          className={`
            ${sizeClasses[size]}
            rounded-l-lg
            border border-theme
            items-center
            justify-center
            theme-transition
            ${theme === 'light' ? 'bg-theme-primary' : 'bg-theme-surface'}
            active:opacity-70
          `}
          accessibilityRole="button"
          accessibilityLabel="Modo claro"
        >
          <SunIcon />
          {showLabel && (
            <Text className={`text-xs mt-1 ${theme === 'light' ? 'text-theme-on-primary' : 'text-theme-secondary'}`}>
              Claro
            </Text>
          )}
        </Pressable>
        
        <Pressable
          onPress={() => changeTheme('dark')}
          className={`
            ${sizeClasses[size]}
            border-t border-b border-theme
            items-center
            justify-center
            theme-transition
            ${theme === 'dark' ? 'bg-theme-primary' : 'bg-theme-surface'}
            active:opacity-70
          `}
          accessibilityRole="button"
          accessibilityLabel="Modo escuro"
        >
          <MoonIcon />
          {showLabel && (
            <Text className={`text-xs mt-1 ${theme === 'dark' ? 'text-theme-on-primary' : 'text-theme-secondary'}`}>
              Escuro
            </Text>
          )}
        </Pressable>
        
        <Pressable
          onPress={() => changeTheme('system')}
          className={`
            ${sizeClasses[size]}
            rounded-r-lg
            border border-theme
            items-center
            justify-center
            theme-transition
            ${theme === 'system' ? 'bg-theme-primary' : 'bg-theme-surface'}
            active:opacity-70
          `}
          accessibilityRole="button"
          accessibilityLabel="Modo automático"
        >
          <SystemIcon />
          {showLabel && (
            <Text className={`text-xs mt-1 ${theme === 'system' ? 'text-theme-on-primary' : 'text-theme-secondary'}`}>
              Auto
            </Text>
          )}
        </Pressable>
      </View>
    );
  }

  // Renderização do dropdown (versão simplificada)
  if (variant === 'dropdown') {
    return (
      <View className={`${className}`}>
        <Text className="text-theme-secondary text-sm mb-2">Tema</Text>
        <View className="space-y-1">
          <Pressable
            onPress={() => changeTheme('light')}
            className={`
              flex-row items-center
              ${sizeClasses[size]}
              rounded-lg
              theme-transition
              ${theme === 'light' ? 'bg-theme-primary' : 'bg-theme-surface'}
              active:opacity-70
            `}
            accessibilityRole="button"
            accessibilityLabel="Modo claro"
          >
            <SunIcon />
            <Text className={`ml-3 ${theme === 'light' ? 'text-theme-on-primary' : 'text-theme-primary'}`}>
              Claro
            </Text>
          </Pressable>
          
          <Pressable
            onPress={() => changeTheme('dark')}
            className={`
              flex-row items-center
              ${sizeClasses[size]}
              rounded-lg
              theme-transition
              ${theme === 'dark' ? 'bg-theme-primary' : 'bg-theme-surface'}
              active:opacity-70
            `}
            accessibilityRole="button"
            accessibilityLabel="Modo escuro"
          >
            <MoonIcon />
            <Text className={`ml-3 ${theme === 'dark' ? 'text-theme-on-primary' : 'text-theme-primary'}`}>
              Escuro
            </Text>
          </Pressable>
          
          <Pressable
            onPress={() => changeTheme('system')}
            className={`
              flex-row items-center
              ${sizeClasses[size]}
              rounded-lg
              theme-transition
              ${theme === 'system' ? 'bg-theme-primary' : 'bg-theme-surface'}
              active:opacity-70
            `}
            accessibilityRole="button"
            accessibilityLabel="Modo automático"
          >
            <SystemIcon />
            <Text className={`ml-3 ${theme === 'system' ? 'text-theme-on-primary' : 'text-theme-primary'}`}>
              Automático
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return null;
};
