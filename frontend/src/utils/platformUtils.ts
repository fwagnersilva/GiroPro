import { Platform, Dimensions } from 'react-native';

// Tipos de plataforma
export type PlatformType = 'ios' | 'android' | 'web' | 'native';

// Detectar plataforma atual
export const getCurrentPlatform = (): PlatformType => {
  if (Platform.OS === 'web') return 'web';
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  return 'native';
};

// Verificar se é plataforma web
export const isWeb = (): boolean => Platform.OS === 'web';

// Verificar se é plataforma mobile
export const isMobile = (): boolean => Platform.OS === 'ios' || Platform.OS === 'android';

// Verificar se é Android
export const isAndroid = (): boolean => Platform.OS === 'android';

// Verificar se é iOS
export const isIOS = (): boolean => Platform.OS === 'ios';

// Obter dimensões da tela
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

// Verificar se é tablet (baseado no tamanho da tela)
export const isTablet = (): boolean => {
  const { width, height } = getScreenDimensions();
  const aspectRatio = width / height;
  
  // Considera tablet se a menor dimensão for >= 600 e aspect ratio próximo de 4:3 ou 16:10
  const minDimension = Math.min(width, height);
  return minDimension >= 600 && (aspectRatio >= 0.6 && aspectRatio <= 1.67);
};

// Verificar se é desktop (web com tela grande)
export const isDesktop = (): boolean => {
  if (!isWeb()) return false;
  const { width } = getScreenDimensions();
  return width >= 1024;
};

// Obter padding seguro para diferentes plataformas
export const getSafePadding = () => {
  if (isWeb()) {
    return {
      paddingTop: 20,
      paddingBottom: 20,
      paddingHorizontal: isDesktop() ? 40 : 20,
    };
  }
  
  return {
    paddingTop: isIOS() ? 44 : 24, // Status bar height
    paddingBottom: isIOS() ? 34 : 24, // Home indicator height
    paddingHorizontal: 20,
  };
};

// Obter tamanhos de fonte responsivos
export const getResponsiveFontSize = (baseSize: number) => {
  const { width } = getScreenDimensions();
  
  if (isWeb()) {
    if (isDesktop()) return baseSize * 1.1;
    return baseSize;
  }
  
  // Para mobile, ajustar baseado na largura da tela
  const scale = width / 375; // iPhone 6/7/8 como referência
  return Math.round(baseSize * Math.max(0.8, Math.min(1.2, scale)));
};

// Obter espaçamentos responsivos
export const getResponsiveSpacing = (baseSpacing: number) => {
  if (isDesktop()) return baseSpacing * 1.5;
  if (isTablet()) return baseSpacing * 1.2;
  return baseSpacing;
};

// Configurações específicas por plataforma
export const platformConfig = {
  web: {
    maxWidth: 1200,
    containerPadding: 40,
    borderRadius: 8,
    shadowStyle: {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
  },
  mobile: {
    maxWidth: '100%',
    containerPadding: 20,
    borderRadius: 12,
    shadowStyle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },
};

// Obter configuração da plataforma atual
export const getCurrentPlatformConfig = () => {
  return isWeb() ? platformConfig.web : platformConfig.mobile;
};

// Utilitário para estilos condicionais por plataforma
export const platformStyles = {
  select: (styles: { [key in PlatformType]?: any }) => {
    const platform = getCurrentPlatform();
    return styles[platform] || styles.native || {};
  },
  
  web: (webStyles: any) => isWeb() ? webStyles : {},
  mobile: (mobileStyles: any) => isMobile() ? mobileStyles : {},
  android: (androidStyles: any) => isAndroid() ? androidStyles : {},
  ios: (iosStyles: any) => isIOS() ? iosStyles : {},
};

// Verificar se suporta hover (principalmente para web)
export const supportsHover = (): boolean => isWeb();

// Obter altura da barra de status
export const getStatusBarHeight = (): number => {
  if (isWeb()) return 0;
  if (isIOS()) return 44;
  return 24; // Android
};

// Obter altura da barra de navegação inferior
export const getBottomBarHeight = (): number => {
  if (isWeb()) return 0;
  if (isIOS()) return 34; // Home indicator
  return 0; // Android geralmente não tem
};

