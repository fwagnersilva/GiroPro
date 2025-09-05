import { Platform, Dimensions } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isMobile = Platform.OS !== 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Utilitário para estilos condicionais
export const platformStyles = (styles: {
  web?: any;
  mobile?: any;
  ios?: any;
  android?: any;
  default?: any;
}) => {
  if (isWeb && styles.web) return styles.web;
  if (isIOS && styles.ios) return styles.ios;
  if (isAndroid && styles.android) return styles.android;
  if (isMobile && styles.mobile) return styles.mobile;
  return styles.default || {};
};

// Utilitário para valores condicionais
export const platformValue = <T>(values: {
  web?: T;
  mobile?: T;
  ios?: T;
  android?: T;
  default: T;
}): T => {
  if (isWeb && values.web !== undefined) return values.web;
  if (isIOS && values.ios !== undefined) return values.ios;
  if (isAndroid && values.android !== undefined) return values.android;
  if (isMobile && values.mobile !== undefined) return values.mobile;
  return values.default;
};

// Utilitário para detectar tamanho de tela
export const getScreenSize = () => {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height,
    isSmall: width < 768,
    isMedium: width >= 768 && width < 1024,
    isLarge: width >= 1024,
    isTablet: width >= 768,
    isDesktop: width >= 1024
  };
};

// Utilitário para padding seguro
export const getSafePadding = () => {
  return platformValue({
    web: { paddingTop: 0 },
    default: { paddingTop: Platform.select({ ios: 44, android: 24, default: 0 }) }
  });
};

// Utilitário para navegação
export const getNavigationConfig = () => {
  return platformValue({
    web: {
      headerMode: 'screen',
      cardStyle: { backgroundColor: '#F2F2F7' }
    },
    default: {
      headerMode: 'float',
      cardStyle: { backgroundColor: '#F2F2F7' }
    }
  });
};

