module.exports = {
  // Cores básicas
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  
  // Paleta de cinzas refinada
  charcoal: {
    50: '#F8F9FA',
    100: '#F1F3F4',
    200: '#E8EAED',
    300: '#DADCE0',
    400: '#BDC1C6',
    500: '#9AA0A6',
    600: '#80868B',
    700: '#5F6368',
    800: '#3C4043',
    850: '#2D2E30',
    900: '#202124',
    950: '#121212',
  },
  
  // Paleta neutra
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#F0EFEE',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Paleta de cinzas
  gray: {
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
  
  // Cores primárias - Azul GiroPro
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#359CF1', // Cor principal do design system (modo claro)
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
    // Variações para modo escuro
    'dark-50': '#0D47A1',
    'dark-100': '#1565C0',
    'dark-200': '#1976D2',
    'dark-300': '#1E88E5',
    'dark-400': '#42A5F5',
    'dark-500': '#64B5F6', // Cor principal do design system (modo escuro)
    'dark-600': '#90CAF9',
    'dark-700': '#BBDEFB',
    'dark-800': '#E3F2FD',
    'dark-900': '#F3F8FF',
  },
  
  // Cores secundárias - Roxo GiroPro
  secondary: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#B592FF', // Cor secundária do design system (modo claro)
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
    // Variações para modo escuro
    'dark-50': '#4A148C',
    'dark-100': '#6A1B9A',
    'dark-200': '#7B1FA2',
    'dark-300': '#8E24AA',
    'dark-400': '#AB47BC',
    'dark-500': '#CE93D8', // Cor secundária do design system (modo escuro)
    'dark-600': '#E1BEE7',
    'dark-700': '#F3E5F5',
    'dark-800': '#FAF5FB',
    'dark-900': '#FEFCFF',
  },
  
  // Cores de sucesso
  success: {
    50: '#E8F5E8',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#42C17A', // Cor de sucesso do design system (modo claro)
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
    // Variações para modo escuro
    'dark-50': '#1B5E20',
    'dark-100': '#2E7D32',
    'dark-200': '#388E3C',
    'dark-300': '#43A047',
    'dark-400': '#66BB6A',
    'dark-500': '#81C784', // Cor de sucesso do design system (modo escuro)
    'dark-600': '#A5D6A7',
    'dark-700': '#C8E6C9',
    'dark-800': '#E8F5E8',
    'dark-900': '#F1F8E9',
  },
  
  // Cores de aviso
  warning: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FFC72C', // Cor de aviso do design system (modo claro)
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
    // Variações para modo escuro
    'dark-50': '#FF6F00',
    'dark-100': '#FF8F00',
    'dark-200': '#FFA000',
    'dark-300': '#FFB300',
    'dark-400': '#FFCA28',
    'dark-500': '#FFE082', // Cor de aviso do design system (modo escuro)
    'dark-600': '#FFECB3',
    'dark-700': '#FFF8E1',
    'dark-800': '#FFFBF0',
    'dark-900': '#FFFEF7',
  },
  
  // Cores de erro
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#E53E3E', // Cor de erro do design system (modo claro)
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
    // Variações para modo escuro
    'dark-50': '#B71C1C',
    'dark-100': '#C62828',
    'dark-200': '#D32F2F',
    'dark-300': '#E53935',
    'dark-400': '#EF5350',
    'dark-500': '#EF9A9A', // Cor de erro do design system (modo escuro)
    'dark-600': '#FFCDD2',
    'dark-700': '#FFEBEE',
    'dark-800': '#FFF5F5',
    'dark-900': '#FFFAFA',
  },
  
  // Cores de perigo (alinhado com error)
  danger: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#E53E3E', // Alinhado com error (modo claro)
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
    // Variações para modo escuro
    'dark-50': '#B71C1C',
    'dark-100': '#C62828',
    'dark-200': '#D32F2F',
    'dark-300': '#E53935',
    'dark-400': '#EF5350',
    'dark-500': '#EF9A9A', // Alinhado com error (modo escuro)
    'dark-600': '#FFCDD2',
    'dark-700': '#FFEBEE',
    'dark-800': '#FFF5F5',
    'dark-900': '#FFFAFA',
  },
  
  // Cores semânticas para temas
  background: {
    light: '#FFFFFF',
    dark: '#121212',
  },
  
  surface: {
    light: '#FFFFFF',
    'light-secondary': '#F5F5F5',
    dark: '#1E1E1E',
    'dark-secondary': '#2D2E30',
  },
  
  text: {
    'light-primary': '#212121',
    'light-secondary': '#757575',
    'light-disabled': '#BDBDBD',
    'dark-primary': '#FFFFFF',
    'dark-secondary': '#B0B0B0',
    'dark-disabled': '#616161',
  },
  
  border: {
    light: '#E0E0E0',
    'light-focus': '#359CF1',
    dark: '#616161',
    'dark-focus': '#64B5F6',
  },
};
