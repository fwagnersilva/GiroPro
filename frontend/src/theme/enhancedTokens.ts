import { Platform } from 'react-native';

// Design Tokens Melhorados - Sistema de Design GiroPro
// Focado em acessibilidade, contraste e experiência do usuário

// Paleta de Cores Base Melhorada
export const colors = {
  // Cores Primárias - Identidade da Marca (Melhor contraste)
  primary: {
    50: '#E8F4FD',
    100: '#C3E2FB',
    200: '#9BCEF8',
    300: '#72BAF5',
    400: '#54ABF3',
    500: '#359CF1', // Cor principal com melhor contraste
    600: '#2F8AE0',
    700: '#2875CD',
    800: '#2161BA',
    900: '#15439A',
  },
  
  // Cores Secundárias - Complementares (Ajustadas para melhor harmonia)
  secondary: {
    50: '#F8F3FF',
    100: '#EDE1FF',
    200: '#DECCFF',
    300: '#CDB4FF',
    400: '#C1A3FF',
    500: '#B592FF', // Cor secundária mais vibrante
    600: '#A485F0',
    700: '#9076E0',
    800: '#7C67D0',
    900: '#5A4CB8',
  },
  
  // Cores de Status (Melhor acessibilidade)
  success: {
    50: '#E8F8F0',
    100: '#C6EDD8',
    200: '#A1E1BD',
    300: '#7BD5A2',
    400: '#5ECB8E',
    500: '#42C17A', // Verde mais acessível
    600: '#3BB972',
    700: '#32AE67',
    800: '#29A45C',
    900: '#1A9248',
  },
  
  warning: {
    50: '#FFF9E6',
    100: '#FFEFBF',
    200: '#FFE495',
    300: '#FFD96B',
    400: '#FFD04C',
    500: '#FFC72C', // Amarelo com melhor contraste
    600: '#FFB927',
    700: '#FFA821',
    800: '#FF981B',
    900: '#FF7F10',
  },
  
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#E53E3E', // Vermelho mais acessível
    600: '#D73A3A',
    700: '#C53030',
    800: '#B91C1C',
    900: '#991B1B',
  },
  
  info: {
    50: '#E6F7FF',
    100: '#BAE7FF',
    200: '#91D5FF',
    300: '#69C0FF',
    400: '#40A9FF',
    500: '#1890FF',
    600: '#096DD9',
    700: '#0050B3',
    800: '#003A8C',
    900: '#002766',
  },
  
  // Cores Neutras (Melhor gradação)
  neutral: {
    0: '#FFFFFF',
    50: '#FAFBFC',
    100: '#F4F6F8',
    200: '#E4E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    1000: '#000000',
  },
};

// Sistema de Tipografia Melhorado
export const typography = {
  fontFamily: {
    regular: Platform.select({
      ios: '-apple-system',
      android: 'Roboto',
      web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }),
    medium: Platform.select({
      ios: '-apple-system',
      android: 'Roboto-Medium',
      web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }),
    bold: Platform.select({
      ios: '-apple-system',
      android: 'Roboto-Bold',
      web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }),
    mono: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      web: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
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
    '6xl': 60,
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
    '6xl': 72,
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
};

// Sistema de Espaçamentos Melhorado
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
};

// Sistema de Border Radius Melhorado
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  base: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Sistema de Sombras Melhorado
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  xs: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  
  sm: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  
  base: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  
  md: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  
  lg: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  
  xl: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 15,
  },
  
  '2xl': {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 20,
  },
};

// Breakpoints para Responsividade
export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Temas Melhorados
export const lightTheme = {
  colors: {
    // Cores principais
    primary: colors.primary[500],
    primaryLight: colors.primary[100],
    primaryDark: colors.primary[700],
    primaryForeground: colors.neutral[0],
    
    secondary: colors.secondary[500],
    secondaryLight: colors.secondary[100],
    secondaryDark: colors.secondary[700],
    secondaryForeground: colors.neutral[0],
    
    // Backgrounds
    background: colors.neutral[50],
    backgroundSecondary: colors.neutral[100],
    surface: colors.neutral[0],
    surfaceSecondary: colors.neutral[50],
    surfaceVariant: colors.neutral[100],
    
    // Textos com melhor contraste
    textPrimary: colors.neutral[900],
    textSecondary: colors.neutral[700],
    textTertiary: colors.neutral[500],
    textDisabled: colors.neutral[400],
    textOnPrimary: colors.neutral[0],
    textOnSecondary: colors.neutral[0],
    
    // Bordas
    border: colors.neutral[200],
    borderLight: colors.neutral[100],
    borderStrong: colors.neutral[300],
    borderFocus: colors.primary[500],
    
    // Estados
    success: colors.success[500],
    successLight: colors.success[100],
    successDark: colors.success[700],
    
    warning: colors.warning[500],
    warningLight: colors.warning[100],
    warningDark: colors.warning[700],
    
    error: colors.error[500],
    errorLight: colors.error[100],
    errorDark: colors.error[700],
    
    info: colors.info[500],
    infoLight: colors.info[100],
    infoDark: colors.info[700],
    
    // Overlays
    overlay: 'rgba(17, 24, 39, 0.5)',
    overlayLight: 'rgba(17, 24, 39, 0.25)',
    overlayStrong: 'rgba(17, 24, 39, 0.75)',
    
    // Estados interativos
    hover: 'rgba(53, 156, 241, 0.08)',
    pressed: 'rgba(53, 156, 241, 0.12)',
    focus: 'rgba(53, 156, 241, 0.12)',
    selected: 'rgba(53, 156, 241, 0.16)',
    disabled: 'rgba(156, 163, 175, 0.5)',
  },
  
  typography,
  spacing,
  borderRadius,
  shadows,
};

export const darkTheme = {
  colors: {
    // Cores principais
    primary: colors.primary[400],
    primaryLight: colors.primary[300],
    primaryDark: colors.primary[600],
    primaryForeground: colors.neutral[900],
    
    secondary: colors.secondary[400],
    secondaryLight: colors.secondary[300],
    secondaryDark: colors.secondary[600],
    secondaryForeground: colors.neutral[900],
    
    // Backgrounds
    background: colors.neutral[900],
    backgroundSecondary: colors.neutral[800],
    surface: colors.neutral[800],
    surfaceSecondary: colors.neutral[700],
    surfaceVariant: colors.neutral[700],
    
    // Textos
    textPrimary: colors.neutral[50],
    textSecondary: colors.neutral[300],
    textTertiary: colors.neutral[400],
    textDisabled: colors.neutral[500],
    textOnPrimary: colors.neutral[900],
    textOnSecondary: colors.neutral[900],
    
    // Bordas
    border: colors.neutral[600],
    borderLight: colors.neutral[700],
    borderStrong: colors.neutral[500],
    borderFocus: colors.primary[400],
    
    // Estados
    success: colors.success[400],
    successLight: colors.success[900],
    successDark: colors.success[300],
    
    warning: colors.warning[400],
    warningLight: colors.warning[900],
    warningDark: colors.warning[300],
    
    error: colors.error[400],
    errorLight: colors.error[900],
    errorDark: colors.error[300],
    
    info: colors.info[400],
    infoLight: colors.info[900],
    infoDark: colors.info[300],
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.4)',
    overlayStrong: 'rgba(0, 0, 0, 0.9)',
    
    // Estados interativos
    hover: 'rgba(156, 163, 175, 0.08)',
    pressed: 'rgba(156, 163, 175, 0.12)',
    focus: 'rgba(156, 163, 175, 0.12)',
    selected: 'rgba(156, 163, 175, 0.16)',
    disabled: 'rgba(75, 85, 99, 0.5)',
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

// Componentes Base do Sistema de Design Melhorados
export const components = {
  button: {
    base: {
      borderRadius: borderRadius.md,
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[6],
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: 48,
      flexDirection: 'row' as const,
    },
    
    variants: {
      primary: (theme: Theme) => ({
        backgroundColor: theme.colors.primary,
        ...shadows.sm,
      }),
      
      secondary: (theme: Theme) => ({
        backgroundColor: theme.colors.secondary,
        ...shadows.sm,
      }),
      
      outline: (theme: Theme) => ({
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
      }),
      
      ghost: (theme: Theme) => ({
        backgroundColor: 'transparent',
      }),
      
      destructive: (theme: Theme) => ({
        backgroundColor: theme.colors.error,
        ...shadows.sm,
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
    
    states: {
      hover: (theme: Theme) => ({
        opacity: 0.9,
      }),
      pressed: (theme: Theme) => ({
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
      }),
      disabled: (theme: Theme) => ({
        opacity: 0.5,
      }),
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
        color: theme.colors.textPrimary,
      }),
      
      focused: (theme: Theme) => ({
        borderColor: theme.colors.borderFocus,
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
        color: theme.colors.textDisabled,
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
    
    variants: {
      elevated: (theme: Theme) => ({
        backgroundColor: theme.colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing[6],
        ...shadows.lg,
      }),
      
      outlined: (theme: Theme) => ({
        backgroundColor: theme.colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing[6],
        borderWidth: 1,
        borderColor: theme.colors.border,
      }),
    },
  },
};

// Animações e Transições
export const animations = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
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
  animations,
};

