import { StyleSheet, Dimensions } from 'react-native';
import { 
  isWeb, 
  isDesktop, 
  isTablet, 
  getResponsiveFontSize, 
  getResponsiveSpacing,
  getCurrentPlatformConfig 
} from '../utils/platformUtils';

// Breakpoints para design responsivo
export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

// Obter breakpoint atual
export const getCurrentBreakpoint = () => {
  const { width } = Dimensions.get('window');
  
  if (width >= breakpoints.wide) return 'wide';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'mobile';
};

// Sistema de grid responsivo
export const grid = {
  container: {
    maxWidth: isDesktop() ? 1200 : '100%',
    marginHorizontal: 'auto' as const,
    paddingHorizontal: getResponsiveSpacing(20),
  },
  
  row: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginHorizontal: -getResponsiveSpacing(10),
  },
  
  col: (span: number = 12) => ({
    flexGrow: isWeb() ? 0 : 1,
    flexShrink: isWeb() ? 0 : 1,
    flexBasis: isWeb() ? `${(span / 12) * 100}%` : undefined,
    paddingHorizontal: getResponsiveSpacing(10),
    maxWidth: isWeb() ? `${(span / 12) * 100}%` : '100%',
  }),
};

// Tipografia responsiva
export const typography = {
  h1: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: 'bold' as const,
    lineHeight: getResponsiveFontSize(40),
    marginBottom: getResponsiveSpacing(16),
  },
  
  h2: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: 'bold' as const,
    lineHeight: getResponsiveFontSize(36),
    marginBottom: getResponsiveSpacing(14),
  },
  
  h3: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: '600' as const,
    lineHeight: getResponsiveFontSize(32),
    marginBottom: getResponsiveSpacing(12),
  },
  
  h4: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: '600' as const,
    lineHeight: getResponsiveFontSize(28),
    marginBottom: getResponsiveSpacing(10),
  },
  
  body: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '400' as const,
    lineHeight: getResponsiveFontSize(24),
    marginBottom: getResponsiveSpacing(8),
  },
  
  caption: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '400' as const,
    lineHeight: getResponsiveFontSize(20),
    marginBottom: getResponsiveSpacing(6),
  },
  
  small: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: '400' as const,
    lineHeight: getResponsiveFontSize(18),
    marginBottom: getResponsiveSpacing(4),
  },
};

// Espaçamentos responsivos
export const spacing = {
  xs: getResponsiveSpacing(4),
  sm: getResponsiveSpacing(8),
  md: getResponsiveSpacing(16),
  lg: getResponsiveSpacing(24),
  xl: getResponsiveSpacing(32),
  xxl: getResponsiveSpacing(48),
};

// Componentes base responsivos
export const components = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: getCurrentPlatformConfig().borderRadius,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...getCurrentPlatformConfig().shadowStyle,
    ...(isWeb() && {
      maxWidth: isDesktop() ? 800 : '100%',
      marginHorizontal: 'auto',
    }),
  },
  
  button: {
    borderRadius: getCurrentPlatformConfig().borderRadius,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: 48,
    ...getCurrentPlatformConfig().shadowStyle,
  },
  
  input: {
    borderRadius: getCurrentPlatformConfig().borderRadius,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: getResponsiveFontSize(16),
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    ...grid.container,
  },
  
  section: {
    marginBottom: spacing.lg,
    ...(isDesktop() && {
      marginBottom: spacing.xl,
    }),
  },
};

// Layout específico para diferentes telas
export const layouts = {
  // Layout para tela de login/registro
  auth: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
      ...(isDesktop() && {
        paddingHorizontal: spacing.xl,
      }),
    },
    
    content: {
      width: '100%',
      maxWidth: isDesktop() ? 400 : '100%',
      alignSelf: 'center',
    },
    
    header: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    
    form: {
      width: '100%',
    },
  }),
  
  // Layout para dashboard
  dashboard: StyleSheet.create({
    container: {
      ...components.container,
    },
    
    grid: {
      ...grid.row,
      ...(isDesktop() && {
        justifyContent: 'space-between',
      }),
    },
    
    card: {
      ...components.card,
      ...grid.col(isDesktop() ? 6 : 12),
      ...(isTablet() && grid.col(6)),
    },
    
    fullWidthCard: {
      ...components.card,
      ...grid.col(12),
    },
  }),
  
  // Layout para listas
  list: StyleSheet.create({
    container: {
      ...components.container,
    },
    
    item: {
      ...components.card,
      marginBottom: spacing.sm,
      ...(isDesktop() && {
        marginBottom: spacing.md,
      }),
    },
    
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: '#F8F9FA',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5EA',
    },
  }),
};

// Utilitários para media queries (principalmente para web)
export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.tablet - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.desktop}px)`,
  wide: `@media (min-width: ${breakpoints.wide}px)`,
};

// Hook para obter estilos responsivos baseados no tamanho da tela
export const useResponsiveStyles = () => {
  const breakpoint = getCurrentBreakpoint();
  
  return {
    breakpoint,
    isDesktop: breakpoint === 'desktop' || breakpoint === 'wide',
    isTablet: breakpoint === 'tablet',
    isMobile: breakpoint === 'mobile',
    spacing,
    typography,
    components,
    layouts,
  };
};

