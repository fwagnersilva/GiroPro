// Design Tokens - Sistema de Design GiroPro

export const colors = {
  // Cores primárias
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#007AFF', // Cor principal
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  // Cores secundárias
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

  // Cores semânticas
  success: {
    50: '#E8F5E8',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#34C759', // Verde sucesso
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#FF3B30', // Vermelho erro
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },

  warning: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FF9500', // Laranja aviso
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },

  // Cores neutras
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

  // Cores específicas por tipo de despesa
  expense: {
    maintenance: '#FF9500', // Laranja para manutenção
    tires: '#34C759',       // Verde para pneus
    insurance: '#007AFF',   // Azul para seguro
    others: '#8E8E93',      // Cinza para outros
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  xxxxxl: 48,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    xxxxl: 32,
    xxxxxl: 36,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const animations = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  
  easing: {
    easeInOut: 'ease-in-out',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    linear: 'linear',
  },
};

// Breakpoints para responsividade
export const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

// Utilitários para acessibilidade
export const accessibility = {
  minTouchTarget: 44, // Tamanho mínimo recomendado para touch targets
  focusOutlineWidth: 2,
  focusOutlineColor: colors.primary[500],
};

