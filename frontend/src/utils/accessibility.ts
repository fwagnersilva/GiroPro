import { Platform } from 'react-native';

// Utilitários de Acessibilidade para GiroPro

// Tipos de roles de acessibilidade
export type AccessibilityRole = 
  | 'button'
  | 'link'
  | 'text'
  | 'image'
  | 'textbox'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'tab'
  | 'tablist'
  | 'header'
  | 'navigation'
  | 'main'
  | 'complementary'
  | 'contentinfo';

// Tipos de traits de acessibilidade (iOS)
export type AccessibilityTrait = 
  | 'none'
  | 'button'
  | 'link'
  | 'header'
  | 'search'
  | 'image'
  | 'selected'
  | 'plays'
  | 'key'
  | 'text'
  | 'summary'
  | 'disabled'
  | 'frequentUpdates'
  | 'startsMedia'
  | 'adjustable'
  | 'allowsDirectInteraction'
  | 'pageTurn';

// Interface para propriedades de acessibilidade
export interface AccessibilityProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
  accessibilityActions?: Array<{
    name: string;
    label?: string;
  }>;
  onAccessibilityAction?: (event: { nativeEvent: { actionName: string } }) => void;
}

// Função para criar props de acessibilidade para botões
export const createButtonAccessibility = (
  label: string,
  hint?: string,
  disabled?: boolean
): AccessibilityProps => ({
  accessible: true,
  accessibilityLabel: label,
  accessibilityHint: hint,
  accessibilityRole: 'button',
  accessibilityState: {
    disabled: disabled || false,
  },
});

// Função para criar props de acessibilidade para inputs
export const createInputAccessibility = (
  label: string,
  hint?: string,
  required?: boolean,
  error?: string
): AccessibilityProps => {
  let accessibilityLabel = label;
  if (required) {
    accessibilityLabel += ', obrigatório';
  }
  if (error) {
    accessibilityLabel += `, erro: ${error}`;
  }

  return {
    accessible: true,
    accessibilityLabel,
    accessibilityHint: hint,
    accessibilityRole: 'textbox',
  };
};

// Função para criar props de acessibilidade para checkboxes
export const createCheckboxAccessibility = (
  label: string,
  checked: boolean,
  hint?: string
): AccessibilityProps => ({
  accessible: true,
  accessibilityLabel: label,
  accessibilityHint: hint,
  accessibilityRole: 'checkbox',
  accessibilityState: {
    checked,
  },
});

// Função para criar props de acessibilidade para links
export const createLinkAccessibility = (
  label: string,
  hint?: string
): AccessibilityProps => ({
  accessible: true,
  accessibilityLabel: label,
  accessibilityHint: hint,
  accessibilityRole: 'link',
});

// Função para criar props de acessibilidade para cabeçalhos
export const createHeaderAccessibility = (
  label: string,
  level?: number
): AccessibilityProps => ({
  accessible: true,
  accessibilityLabel: label,
  accessibilityRole: 'header',
  ...(Platform.OS === 'ios' && level && {
    accessibilityTraits: ['header'],
  }),
});

// Função para criar props de acessibilidade para imagens
export const createImageAccessibility = (
  description: string,
  decorative?: boolean
): AccessibilityProps => {
  if (decorative) {
    return {
      accessible: false,
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants',
    };
  }

  return {
    accessible: true,
    accessibilityLabel: description,
    accessibilityRole: 'image',
  };
};

// Função para anunciar mudanças para screen readers
export const announceForAccessibility = (message: string) => {
  if (Platform.OS === 'ios') {
    // iOS: usar AccessibilityInfo
    const AccessibilityInfo = require('react-native').AccessibilityInfo;
    AccessibilityInfo.announceForAccessibility(message);
  } else if (Platform.OS === 'android') {
    // Android: usar AccessibilityInfo
    const AccessibilityInfo = require('react-native').AccessibilityInfo;
    AccessibilityInfo.announceForAccessibility(message);
  }
};

// Função para verificar se o screen reader está ativo
export const isScreenReaderEnabled = async (): Promise<boolean> => {
  try {
    const AccessibilityInfo = require('react-native').AccessibilityInfo;
    return await AccessibilityInfo.isScreenReaderEnabled();
  } catch (error) {
    console.warn('Erro ao verificar screen reader:', error);
    return false;
  }
};

// Função para verificar se animações reduzidas estão habilitadas
export const isReduceMotionEnabled = async (): Promise<boolean> => {
  try {
    const AccessibilityInfo = require('react-native').AccessibilityInfo;
    if (Platform.OS === 'ios') {
      return await AccessibilityInfo.isReduceMotionEnabled();
    }
    // Android não tem API nativa para isso, retorna false
    return false;
  } catch (error) {
    console.warn('Erro ao verificar reduce motion:', error);
    return false;
  }
};

// Função para verificar se o modo de alto contraste está ativo
export const isHighContrastEnabled = async (): Promise<boolean> => {
  try {
    const AccessibilityInfo = require('react-native').AccessibilityInfo;
    if (Platform.OS === 'ios') {
      // iOS não tem API direta para isso
      return false;
    }
    // Android: verificar configurações de acessibilidade
    return false;
  } catch (error) {
    console.warn('Erro ao verificar alto contraste:', error);
    return false;
  }
};

// Constantes para tamanhos mínimos de toque (seguindo guidelines)
export const MINIMUM_TOUCH_SIZE = {
  width: 44,  // iOS Human Interface Guidelines
  height: 44,
};

export const ANDROID_MINIMUM_TOUCH_SIZE = {
  width: 48,  // Material Design Guidelines
  height: 48,
};

// Função para garantir tamanho mínimo de toque
export const ensureMinimumTouchSize = (width?: number, height?: number) => {
  const minSize = Platform.OS === 'ios' ? MINIMUM_TOUCH_SIZE : ANDROID_MINIMUM_TOUCH_SIZE;
  
  return {
    minWidth: Math.max(width || 0, minSize.width),
    minHeight: Math.max(height || 0, minSize.height),
  };
};

// Função para criar hitSlop apropriado
export const createHitSlop = (size: number = 10) => ({
  top: size,
  bottom: size,
  left: size,
  right: size,
});

// Cores com contraste adequado (WCAG AA)
export const accessibleColors = {
  // Contraste mínimo 4.5:1 para texto normal
  textOnLight: '#000000',
  textOnDark: '#FFFFFF',
  
  // Contraste mínimo 3:1 para texto grande (18pt+ ou 14pt+ bold)
  largeTextOnLight: '#333333',
  largeTextOnDark: '#CCCCCC',
  
  // Cores de foco com contraste adequado
  focusLight: '#005FCC',
  focusDark: '#66B3FF',
  
  // Cores de erro com contraste adequado
  errorLight: '#D32F2F',
  errorDark: '#FF6B6B',
  
  // Cores de sucesso com contraste adequado
  successLight: '#2E7D32',
  successDark: '#4CAF50',
};

// Função para validar contraste de cores
export const validateColorContrast = (
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean => {
  // Esta é uma implementação simplificada
  // Em produção, use uma biblioteca como 'color-contrast-checker'
  const minRatio = isLargeText ? 3 : 4.5;
  
  // Implementação básica - em produção, calcule o contraste real
  // Por enquanto, retorna true para cores conhecidas como acessíveis
  const accessibleCombinations = [
    { fg: '#000000', bg: '#FFFFFF' },
    { fg: '#FFFFFF', bg: '#000000' },
    { fg: '#333333', bg: '#FFFFFF' },
    { fg: '#FFFFFF', bg: '#333333' },
  ];
  
  return accessibleCombinations.some(
    combo => combo.fg === foreground && combo.bg === background
  );
};

// Hook personalizado para acessibilidade
export const useAccessibility = () => {
  const [screenReaderEnabled, setScreenReaderEnabled] = React.useState(false);
  const [reduceMotionEnabled, setReduceMotionEnabled] = React.useState(false);

  React.useEffect(() => {
    const checkAccessibilitySettings = async () => {
      const screenReader = await isScreenReaderEnabled();
      const reduceMotion = await isReduceMotionEnabled();
      
      setScreenReaderEnabled(screenReader);
      setReduceMotionEnabled(reduceMotion);
    };

    checkAccessibilitySettings();

    // Listener para mudanças nas configurações de acessibilidade
    const AccessibilityInfo = require('react-native').AccessibilityInfo;
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return {
    screenReaderEnabled,
    reduceMotionEnabled,
    announceForAccessibility,
    createButtonAccessibility,
    createInputAccessibility,
    createCheckboxAccessibility,
    createLinkAccessibility,
    createHeaderAccessibility,
    createImageAccessibility,
  };
};

export default {
  createButtonAccessibility,
  createInputAccessibility,
  createCheckboxAccessibility,
  createLinkAccessibility,
  createHeaderAccessibility,
  createImageAccessibility,
  announceForAccessibility,
  isScreenReaderEnabled,
  isReduceMotionEnabled,
  isHighContrastEnabled,
  ensureMinimumTouchSize,
  createHitSlop,
  accessibleColors,
  validateColorContrast,
  useAccessibility,
};

