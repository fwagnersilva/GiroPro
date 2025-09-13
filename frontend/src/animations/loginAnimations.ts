import { Animated, Easing } from 'react-native';

// Animações específicas para a tela de login

// Configurações de timing padrão
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  entrance: 800,
};

// Configurações de easing
export const EASING = {
  easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
  easeOut: Easing.bezier(0, 0, 0.2, 1),
  easeIn: Easing.bezier(0.4, 0, 1, 1),
  spring: Easing.elastic(1.2),
};

// Animação de entrada da tela
export const createEntranceAnimation = (
  fadeValue: Animated.Value,
  slideValue: Animated.Value,
  scaleValue?: Animated.Value
) => {
  const animations = [
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: ANIMATION_DURATION.entrance,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
    Animated.timing(slideValue, {
      toValue: 0,
      duration: ANIMATION_DURATION.entrance,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
  ];

  if (scaleValue) {
    animations.push(
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    );
  }

  return Animated.parallel(animations);
};

// Animação de foco do input
export const createFocusAnimation = (
  focusValue: Animated.Value,
  scaleValue?: Animated.Value
) => {
  const animations = [
    Animated.timing(focusValue, {
      toValue: 1,
      duration: ANIMATION_DURATION.fast,
      easing: EASING.easeOut,
      useNativeDriver: false, // Precisa ser false para borderColor
    }),
  ];

  if (scaleValue) {
    animations.push(
      Animated.spring(scaleValue, {
        toValue: 1.02,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    );
  }

  return Animated.parallel(animations);
};

// Animação de desfoco do input
export const createBlurAnimation = (
  focusValue: Animated.Value,
  scaleValue?: Animated.Value
) => {
  const animations = [
    Animated.timing(focusValue, {
      toValue: 0,
      duration: ANIMATION_DURATION.fast,
      easing: EASING.easeOut,
      useNativeDriver: false,
    }),
  ];

  if (scaleValue) {
    animations.push(
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    );
  }

  return Animated.parallel(animations);
};

// Animação de erro (shake)
export const createErrorAnimation = (shakeValue: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(shakeValue, {
      toValue: 10,
      duration: 100,
      easing: EASING.easeInOut,
      useNativeDriver: true,
    }),
    Animated.timing(shakeValue, {
      toValue: -10,
      duration: 100,
      easing: EASING.easeInOut,
      useNativeDriver: true,
    }),
    Animated.timing(shakeValue, {
      toValue: 5,
      duration: 100,
      easing: EASING.easeInOut,
      useNativeDriver: true,
    }),
    Animated.timing(shakeValue, {
      toValue: 0,
      duration: 100,
      easing: EASING.easeInOut,
      useNativeDriver: true,
    }),
  ]);
};

// Animação de sucesso (pulse)
export const createSuccessAnimation = (pulseValue: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(pulseValue, {
      toValue: 1.1,
      duration: 150,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
    Animated.timing(pulseValue, {
      toValue: 1,
      duration: 150,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
  ]);
};

// Animação de botão pressionado
export const createButtonPressAnimation = (scaleValue: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 100,
      easing: EASING.easeInOut,
      useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 100,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
  ]);
};

// Animação de loading (rotação)
export const createLoadingAnimation = (rotateValue: Animated.Value) => {
  return Animated.loop(
    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  );
};

// Animação de fade in/out
export const createFadeAnimation = (
  fadeValue: Animated.Value,
  toValue: number,
  duration: number = ANIMATION_DURATION.normal
) => {
  return Animated.timing(fadeValue, {
    toValue,
    duration,
    easing: EASING.easeInOut,
    useNativeDriver: true,
  });
};

// Animação de slide
export const createSlideAnimation = (
  slideValue: Animated.Value,
  toValue: number,
  duration: number = ANIMATION_DURATION.normal
) => {
  return Animated.timing(slideValue, {
    toValue,
    duration,
    easing: EASING.easeOut,
    useNativeDriver: true,
  });
};

// Animação de escala
export const createScaleAnimation = (
  scaleValue: Animated.Value,
  toValue: number,
  duration: number = ANIMATION_DURATION.normal,
  useSpring: boolean = false
) => {
  if (useSpring) {
    return Animated.spring(scaleValue, {
      toValue,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    });
  }

  return Animated.timing(scaleValue, {
    toValue,
    duration,
    easing: EASING.easeOut,
    useNativeDriver: true,
  });
};

// Animação de transição entre telas
export const createScreenTransition = (
  fadeOutValue: Animated.Value,
  fadeInValue: Animated.Value,
  slideOutValue: Animated.Value,
  slideInValue: Animated.Value
) => {
  return Animated.parallel([
    // Fade out da tela atual
    Animated.timing(fadeOutValue, {
      toValue: 0,
      duration: ANIMATION_DURATION.normal,
      easing: EASING.easeIn,
      useNativeDriver: true,
    }),
    // Slide out da tela atual
    Animated.timing(slideOutValue, {
      toValue: -50,
      duration: ANIMATION_DURATION.normal,
      easing: EASING.easeIn,
      useNativeDriver: true,
    }),
    // Fade in da nova tela (com delay)
    Animated.timing(fadeInValue, {
      toValue: 1,
      duration: ANIMATION_DURATION.normal,
      delay: ANIMATION_DURATION.fast,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
    // Slide in da nova tela (com delay)
    Animated.timing(slideInValue, {
      toValue: 0,
      duration: ANIMATION_DURATION.normal,
      delay: ANIMATION_DURATION.fast,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
  ]);
};

// Animação de validação em tempo real
export const createValidationAnimation = (
  scaleValue: Animated.Value,
  isValid: boolean
) => {
  const targetScale = isValid ? 1.05 : 0.98;
  
  return Animated.sequence([
    Animated.timing(scaleValue, {
      toValue: targetScale,
      duration: 100,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 100,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
  ]);
};

// Animação de hover (para web)
export const createHoverAnimation = (
  scaleValue: Animated.Value,
  isHovered: boolean
) => {
  return Animated.timing(scaleValue, {
    toValue: isHovered ? 1.02 : 1,
    duration: ANIMATION_DURATION.fast,
    easing: EASING.easeOut,
    useNativeDriver: true,
  });
};

// Animação de ripple effect (para Android)
export const createRippleAnimation = (
  scaleValue: Animated.Value,
  opacityValue: Animated.Value
) => {
  return Animated.parallel([
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
    Animated.timing(opacityValue, {
      toValue: 0,
      duration: 300,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
  ]);
};

// Função utilitária para criar valores animados
export const createAnimatedValues = () => ({
  fade: new Animated.Value(0),
  slide: new Animated.Value(50),
  scale: new Animated.Value(1),
  rotate: new Animated.Value(0),
  shake: new Animated.Value(0),
  focus: new Animated.Value(0),
});

// Função para resetar valores animados
export const resetAnimatedValues = (values: ReturnType<typeof createAnimatedValues>) => {
  values.fade.setValue(0);
  values.slide.setValue(50);
  values.scale.setValue(1);
  values.rotate.setValue(0);
  values.shake.setValue(0);
  values.focus.setValue(0);
};

// Interpolações comuns
export const interpolations = {
  // Interpolação de rotação
  rotation: (rotateValue: Animated.Value) =>
    rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    }),

  // Interpolação de cor (exemplo)
  borderColor: (focusValue: Animated.Value, defaultColor: string, focusColor: string) =>
    focusValue.interpolate({
      inputRange: [0, 1],
      outputRange: [defaultColor, focusColor],
    }),

  // Interpolação de opacidade
  opacity: (fadeValue: Animated.Value) =>
    fadeValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),

  // Interpolação de escala
  scale: (scaleValue: Animated.Value) =>
    scaleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    }),
};

export default {
  ANIMATION_DURATION,
  EASING,
  createEntranceAnimation,
  createFocusAnimation,
  createBlurAnimation,
  createErrorAnimation,
  createSuccessAnimation,
  createButtonPressAnimation,
  createLoadingAnimation,
  createFadeAnimation,
  createSlideAnimation,
  createScaleAnimation,
  createScreenTransition,
  createValidationAnimation,
  createHoverAnimation,
  createRippleAnimation,
  createAnimatedValues,
  resetAnimatedValues,
  interpolations,
};

