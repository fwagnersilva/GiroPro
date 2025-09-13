import { Platform } from 'react-native';

// Design Tokens - Sistema de Design GiroPro

// Paleta de Cores Base
export const colors = {
  // Cores Primárias - Identidade da Marca
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // Cor principal
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  
  // Cores Secundárias - Complementares
  secondary: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#9C27B0',
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
  },
  
  // Cores de Status
  success: {
    50: '#E8F5E8',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },
  
  warning: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FFC107',
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },
  
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },
  
  // Cores Neutras
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    1000: '#000000',
  },
};

// Sistema de Tipografia
export const typography = {
  fontFamily: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 42,
    '4xl': 48,
    '5xl': 64,
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Sistema de Espaçamentos
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
};

// Sistema de Border Radius
export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// Sistema de Sombras
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  sm: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  base: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  md: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  lg: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  
  xl: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
};

// Breakpoints para Responsividade
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Temas
export const lightTheme = {
  colors: {
    primary: colors.primary[500],
    primaryLight: colors.primary[100],
    primaryDark: colors.primary[700],
    
    secondary: colors.secondary[500],
    secondaryLight: colors.secondary[100],
    secondaryDark: colors.secondary[700],
    
    background: colors.neutral[50],
    surface: colors.neutral[0],
    surfaceVariant: colors.neutral[100],
    
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
    textTertiary: colors.neutral[500],
    
    border: colors.neutral[200],
    borderLight: colors.neutral[100],
    borderDark: colors.neutral[300],
    
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
    
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  typography,
  spacing,
  borderRadius,
  shadows,
};

export const darkTheme = {
  colors: {
    primary: colors.primary[400],
    primaryLight: colors.primary[200],
    primaryDark: colors.primary[600],
    
    secondary: colors.secondary[400],
    secondaryLight: colors.secondary[200],
    secondaryDark: colors.secondary[600],
    
    background: colors.neutral[900],
    surface: colors.neutral[800],
    surfaceVariant: colors.neutral[700],
    
    text: colors.neutral[50],
    textSecondary: colors.neutral[300],
    textTertiary: colors.neutral[400],
    
    border: colors.neutral[600],
    borderLight: colors.neutral[700],
    borderDark: colors.neutral[500],
    
    success: colors.success[400],
    warning: colors.warning[400],
    error: colors.error[400],
    
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  
  typography,
  spacing,
  borderRadius,
  shadows,
};

export type Theme = typeof lightTheme;

// Utilitários de Tema
export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};

// Componentes Base do Sistema de Design
export const components = {
  button: {
    base: {
      borderRadius: borderRadius.md,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[6],
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: 48,
    },
    
    variants: {
      primary: (theme: Theme) => ({
        backgroundColor: theme.colors.primary,
        ...shadows.base,
      }),
      
      secondary: (theme: Theme) => ({
        backgroundColor: theme.colors.secondary,
        ...shadows.base,
      }),
      
      outline: (theme: Theme) => ({
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
      }),
      
      ghost: () => ({
        backgroundColor: 'transparent',
      }),
    },
    
    sizes: {
      sm: {
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[4],
        minHeight: 36,
      },
      md: {
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[6],
        minHeight: 48,
      },
      lg: {
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[8],
        minHeight: 56,
      },
    },
  },
  
  input: {
    base: {
      borderRadius: borderRadius.md,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      fontSize: typography.fontSize.base,
      minHeight: 48,
      borderWidth: 1,
    },
    
    states: {
      default: (theme: Theme) => ({
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
      }),
      
      focused: (theme: Theme) => ({
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.surface,
        ...shadows.sm,
      }),
      
      error: (theme: Theme) => ({
        borderColor: theme.colors.error,
        backgroundColor: theme.colors.surface,
      }),
      
      disabled: (theme: Theme) => ({
        borderColor: theme.colors.borderLight,
        backgroundColor: theme.colors.surfaceVariant,
        color: theme.colors.textTertiary,
      }),
    },
  },
  
  card: {
    base: (theme: Theme) => ({
      backgroundColor: theme.colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing[6],
      ...shadows.base,
    }),
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  lightTheme,
  darkTheme,
  getTheme,
  components,
};

