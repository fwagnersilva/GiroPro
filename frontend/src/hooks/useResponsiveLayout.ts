import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { breakpoints } from '../theme/tokens';

interface ResponsiveLayout {
  width: number;
  height: number;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isXLarge: boolean;
  is2XLarge: boolean;
  orientation: 'portrait' | 'landscape';
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export const useResponsiveLayout = (): ResponsiveLayout => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;

  // Determinar breakpoints
  const isSmall = width < breakpoints.sm;
  const isMedium = width >= breakpoints.sm && width < breakpoints.md;
  const isLarge = width >= breakpoints.md && width < breakpoints.lg;
  const isXLarge = width >= breakpoints.lg && width < breakpoints.xl;
  const is2XLarge = width >= breakpoints.xl;

  // Determinar orientação
  const orientation = width > height ? 'landscape' : 'portrait';

  // Determinar tipo de dispositivo
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'mobile';
  if (width >= breakpoints.md) {
    deviceType = width >= breakpoints.lg ? 'desktop' : 'tablet';
  }

  return {
    width,
    height,
    isSmall,
    isMedium,
    isLarge,
    isXLarge,
    is2XLarge,
    orientation,
    deviceType,
  };
};

// Hook para obter estilos responsivos baseados no layout atual
export const useResponsiveStyles = () => {
  const layout = useResponsiveLayout();

  const getResponsiveValue = <T>(values: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
    default: T;
  }): T => {
    switch (layout.deviceType) {
      case 'desktop':
        return values.desktop ?? values.tablet ?? values.mobile ?? values.default;
      case 'tablet':
        return values.tablet ?? values.mobile ?? values.default;
      case 'mobile':
      default:
        return values.mobile ?? values.default;
    }
  };

  const getResponsivePadding = () => {
    return getResponsiveValue({
      mobile: 16,
      tablet: 24,
      desktop: 32,
      default: 16,
    });
  };

  const getResponsiveFontSize = (baseFontSize: number) => {
    const multiplier = getResponsiveValue({
      mobile: 1,
      tablet: 1.1,
      desktop: 1.2,
      default: 1,
    });
    return baseFontSize * multiplier;
  };

  const getResponsiveSpacing = (baseSpacing: number) => {
    const multiplier = getResponsiveValue({
      mobile: 1,
      tablet: 1.2,
      desktop: 1.4,
      default: 1,
    });
    return baseSpacing * multiplier;
  };

  const getMaxWidth = () => {
    return getResponsiveValue({
      mobile: '100%',
      tablet: 600,
      desktop: 400,
      default: '100%',
    });
  };

  return {
    layout,
    getResponsiveValue,
    getResponsivePadding,
    getResponsiveFontSize,
    getResponsiveSpacing,
    getMaxWidth,
  };
};

export default useResponsiveLayout;

