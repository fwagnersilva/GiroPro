import { Dimensions, Platform } from 'react-native';
import { breakpoints, spacing, typography } from '../theme/enhancedTokens';

// Obter dimensões da tela
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Tipos para responsividade
export type BreakpointKey = keyof typeof breakpoints;
export type ResponsiveValue<T> = T | Partial<Record<BreakpointKey, T>>;

// Função para obter o breakpoint atual
export const getCurrentBreakpoint = (): BreakpointKey => {
  if (screenWidth >= breakpoints['2xl']) return '2xl';
  if (screenWidth >= breakpoints.xl) return 'xl';
  if (screenWidth >= breakpoints.lg) return 'lg';
  if (screenWidth >= breakpoints.md) return 'md';
  if (screenWidth >= breakpoints.sm) return 'sm';
  return 'xs';
};

// Função para resolver valores responsivos
export const resolveResponsiveValue = <T>(
  value: ResponsiveValue<T>,
  currentBreakpoint?: BreakpointKey
): T => {
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }

  const bp = currentBreakpoint || getCurrentBreakpoint();
  const responsiveValue = value as Partial<Record<BreakpointKey, T>>;

  // Ordem de prioridade dos breakpoints
  const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(bp);

  // Procurar o valor mais próximo (de baixo para cima)
  for (let i = currentIndex; i >= 0; i--) {
    const key = breakpointOrder[i];
    if (responsiveValue[key] !== undefined) {
      return responsiveValue[key] as T;
    }
  }

  // Se não encontrar, usar o primeiro valor disponível
  for (const key of breakpointOrder) {
    if (responsiveValue[key] !== undefined) {
      return responsiveValue[key] as T;
    }
  }

  // Fallback
  return Object.values(responsiveValue)[0] as T;
};

// Hook para usar valores responsivos
export const useResponsiveValue = <T>(value: ResponsiveValue<T>): T => {
  return resolveResponsiveValue(value);
};

// Utilitários para espaçamento responsivo
export const responsiveSpacing = {
  // Padding responsivo
  p: (value: ResponsiveValue<keyof typeof spacing>) => ({
    padding: resolveResponsiveValue(value, getCurrentBreakpoint()),
  }),
  
  px: (value: ResponsiveValue<keyof typeof spacing>) => ({
    paddingHorizontal: spacing[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  py: (value: ResponsiveValue<keyof typeof spacing>) => ({
    paddingVertical: spacing[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  pt: (value: ResponsiveValue<keyof typeof spacing>) => ({
    paddingTop: spacing[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  pb: (value: ResponsiveValue<keyof typeof spacing>) => ({
    paddingBottom: spacing[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  pl: (value: ResponsiveValue<keyof typeof spacing>) => ({
    paddingLeft: spacing[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  pr: (value: ResponsiveValue<keyof typeof spacing>) => ({
    paddingRight: spacing[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  // Margin responsivo
  m: (value: ResponsiveValue<keyof typeof spacing>) => ({
    margin: spacing[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  mx: (value: ResponsiveValue<keyof typeof spacing>) => ({
    marginHorizontal: spacing[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  my: (value: ResponsiveValue<keyof typeof spacing>) => ({
    marginVertical: spacing[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  mt: (value: ResponsiveValue<keyof typeof spacing>) => ({
    marginTop: spacing[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  mb: (value: ResponsiveValue<keyof typeof spacing>) => ({
    marginBottom: spacing[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  ml: (value: ResponsiveValue<keyof typeof spacing>) => ({
    marginLeft: spacing[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  mr: (value: ResponsiveValue<keyof typeof spacing>) => ({
    marginRight: spacing[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
};

// Utilitários para tipografia responsiva
export const responsiveTypography = {
  fontSize: (value: ResponsiveValue<keyof typeof typography.fontSize>) => ({
    fontSize: typography.fontSize[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  lineHeight: (value: ResponsiveValue<keyof typeof typography.lineHeight>) => ({
    lineHeight: typography.lineHeight[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
  
  fontWeight: (value: ResponsiveValue<keyof typeof typography.fontWeight>) => ({
    fontWeight: typography.fontWeight[resolveResponsiveValue(value, getCurrentBreakpoint())],
  }),
};

// Utilitários para layout responsivo
export const responsiveLayout = {
  // Flexbox responsivo
  flex: (value: ResponsiveValue<number>) => ({
    flex: resolveResponsiveValue(value, getCurrentBreakpoint()),
  }),
  
  flexDirection: (value: ResponsiveValue<'row' | 'column' | 'row-reverse' | 'column-reverse'>) => ({
    flexDirection: resolveResponsiveValue(value, getCurrentBreakpoint()),
  }),
  
  justifyContent: (value: ResponsiveValue<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'>) => ({
    justifyContent: resolveResponsiveValue(value, getCurrentBreakpoint()),
  }),
  
  alignItems: (value: ResponsiveValue<'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'>) => ({
    alignItems: resolveResponsiveValue(value, getCurrentBreakpoint()),
  }),
  
  // Dimensões responsivas
  width: (value: ResponsiveValue<number | string>) => ({
    width: resolveResponsiveValue(value, getCurrentBreakpoint()),
  }),
  
  height: (value: ResponsiveValue<number | string>) => ({
    height: resolveResponsiveValue(value, getCurrentBreakpoint()),
  }),
  
  maxWidth: (value: ResponsiveValue<number | string>) => ({
    maxWidth: resolveResponsiveValue(value, getCurrentBreakpoint()),
  }),
  
  maxHeight: (value: ResponsiveValue<number | string>) => ({
    maxHeight: resolveResponsiveValue(value, getCurrentBreakpoint()),
  }),
};

// Estilos base responsivos
export const responsiveBaseStyles = {
  container: {
    flex: 1,
    paddingHorizontal: getCurrentBreakpoint() === 'xs' ? spacing[4] : spacing[6],
  },
  
  card: {
    padding: getCurrentBreakpoint() === 'xs' ? spacing[4] : spacing[6],
    marginBottom: spacing[4],
  },
  
  section: {
    marginBottom: getCurrentBreakpoint() === 'xs' ? spacing[6] : spacing[8],
  },
  
  grid: {
    flexDirection: getCurrentBreakpoint() === 'xs' ? 'column' as const : 'row' as const,
    flexWrap: 'wrap' as const,
    gap: getCurrentBreakpoint() === 'xs' ? spacing[4] : spacing[6],
  },
  
  gridItem: {
    flex: getCurrentBreakpoint() === 'xs' ? 1 : 0,
    minWidth: getCurrentBreakpoint() === 'xs' ? '100%' : '300px',
  },
};

// Função para criar estilos condicionais baseados no breakpoint
export const createResponsiveStyles = <T extends Record<string, any>>(
  styles: Partial<Record<BreakpointKey, T>>
): T => {
  const currentBreakpoint = getCurrentBreakpoint();
  const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  // Procurar o estilo mais próximo (de baixo para cima)
  for (let i = currentIndex; i >= 0; i--) {
    const key = breakpointOrder[i];
    if (styles[key]) {
      return styles[key] as T;
    }
  }

  // Se não encontrar, usar o primeiro estilo disponível
  for (const key of breakpointOrder) {
    if (styles[key]) {
      return styles[key] as T;
    }
  }

  return {} as T;
};

// Função para verificar se está em um breakpoint específico
export const isBreakpoint = (breakpoint: BreakpointKey): boolean => {
  return getCurrentBreakpoint() === breakpoint;
};

// Função para verificar se está acima de um breakpoint
export const isAboveBreakpoint = (breakpoint: BreakpointKey): boolean => {
  const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(getCurrentBreakpoint());
  const targetIndex = breakpointOrder.indexOf(breakpoint);
  return currentIndex > targetIndex;
};

// Função para verificar se está abaixo de um breakpoint
export const isBelowBreakpoint = (breakpoint: BreakpointKey): boolean => {
  const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(getCurrentBreakpoint());
  const targetIndex = breakpointOrder.indexOf(breakpoint);
  return currentIndex < targetIndex;
};

// Constantes úteis
export const isMobile = isBreakpoint('xs') || isBreakpoint('sm');
export const isTablet = isBreakpoint('md');
export const isDesktop = isAboveBreakpoint('md');
export const isLargeScreen = isAboveBreakpoint('lg');

// Função para obter estilos específicos da plataforma
export const getPlatformStyles = <T>(styles: {
  ios?: T;
  android?: T;
  web?: T;
  default?: T;
}): T => {
  if (Platform.OS === 'ios' && styles.ios) return styles.ios;
  if (Platform.OS === 'android' && styles.android) return styles.android;
  if (Platform.OS === 'web' && styles.web) return styles.web;
  return styles.default || ({} as T);
};

export default {
  getCurrentBreakpoint,
  resolveResponsiveValue,
  useResponsiveValue,
  responsiveSpacing,
  responsiveTypography,
  responsiveLayout,
  responsiveBaseStyles,
  createResponsiveStyles,
  isBreakpoint,
  isAboveBreakpoint,
  isBelowBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
  isLargeScreen,
  getPlatformStyles,
};

