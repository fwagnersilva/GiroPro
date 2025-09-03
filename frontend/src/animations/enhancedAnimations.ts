import { Animated, Easing } from 'react-native';

// Configurações de animação
export const animationConfig = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
    verySlow: 500,
  },
  
  easing: {
    linear: Easing.linear,
    ease: Easing.ease,
    easeIn: Easing.in(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeInOut: Easing.inOut(Easing.ease),
    bounce: Easing.bounce,
    elastic: Easing.elastic(1),
    back: Easing.back(1.5),
    bezier: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
};

// Classe para gerenciar animações
export class AnimationManager {
  private animatedValues: Map<string, Animated.Value> = new Map();
  private runningAnimations: Map<string, Animated.CompositeAnimation> = new Map();

  // Criar ou obter um valor animado
  getAnimatedValue(key: string, initialValue: number = 0): Animated.Value {
    if (!this.animatedValues.has(key)) {
      this.animatedValues.set(key, new Animated.Value(initialValue));
    }
    return this.animatedValues.get(key)!;
  }

  // Parar uma animação específica
  stopAnimation(key: string): void {
    const animation = this.runningAnimations.get(key);
    if (animation) {
      animation.stop();
      this.runningAnimations.delete(key);
    }
  }

  // Parar todas as animações
  stopAllAnimations(): void {
    this.runningAnimations.forEach((animation) => animation.stop());
    this.runningAnimations.clear();
  }

  // Animação de fade in
  fadeIn(
    key: string,
    duration: number = animationConfig.duration.normal,
    easing: any = animationConfig.easing.easeOut,
    callback?: () => void
  ): Animated.CompositeAnimation {
    const animatedValue = this.getAnimatedValue(key, 0);
    
    const animation = Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      easing,
      useNativeDriver: true,
    });

    this.runningAnimations.set(key, animation);
    
    animation.start((finished) => {
      if (finished) {
        this.runningAnimations.delete(key);
        callback?.();
      }
    });

    return animation;
  }

  // Animação de fade out
  fadeOut(
    key: string,
    duration: number = animationConfig.duration.normal,
    easing: any = animationConfig.easing.easeIn,
    callback?: () => void
  ): Animated.CompositeAnimation {
    const animatedValue = this.getAnimatedValue(key, 1);
    
    const animation = Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing,
      useNativeDriver: true,
    });

    this.runningAnimations.set(key, animation);
    
    animation.start((finished) => {
      if (finished) {
        this.runningAnimations.delete(key);
        callback?.();
      }
    });

    return animation;
  }

  // Animação de slide in (da direita)
  slideInRight(
    key: string,
    distance: number = 300,
    duration: number = animationConfig.duration.normal,
    easing: any = animationConfig.easing.easeOut,
    callback?: () => void
  ): Animated.CompositeAnimation {
    const animatedValue = this.getAnimatedValue(key, distance);
    
    const animation = Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing,
      useNativeDriver: true,
    });

    this.runningAnimations.set(key, animation);
    
    animation.start((finished) => {
      if (finished) {
        this.runningAnimations.delete(key);
        callback?.();
      }
    });

    return animation;
  }

  // Animação de slide in (da esquerda)
  slideInLeft(
    key: string,
    distance: number = 300,
    duration: number = animationConfig.duration.normal,
    easing: any = animationConfig.easing.easeOut,
    callback?: () => void
  ): Animated.CompositeAnimation {
    const animatedValue = this.getAnimatedValue(key, -distance);
    
    const animation = Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing,
      useNativeDriver: true,
    });

    this.runningAnimations.set(key, animation);
    
    animation.start((finished) => {
      if (finished) {
        this.runningAnimations.delete(key);
        callback?.();
      }
    });

    return animation;
  }

  // Animação de slide up
  slideUp(
    key: string,
    distance: number = 300,
    duration: number = animationConfig.duration.normal,
    easing: any = animationConfig.easing.easeOut,
    callback?: () => void
  ): Animated.CompositeAnimation {
    const animatedValue = this.getAnimatedValue(key, distance);
    
    const animation = Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing,
      useNativeDriver: true,
    });

    this.runningAnimations.set(key, animation);
    
    animation.start((finished) => {
      if (finished) {
        this.runningAnimations.delete(key);
        callback?.();
      }
    });

    return animation;
  }

  // Animação de scale in
  scaleIn(
    key: string,
    fromScale: number = 0,
    toScale: number = 1,
    duration: number = animationConfig.duration.normal,
    easing: any = animationConfig.easing.back,
    callback?: () => void
  ): Animated.CompositeAnimation {
    const animatedValue = this.getAnimatedValue(key, fromScale);
    
    const animation = Animated.timing(animatedValue, {
      toValue: toScale,
      duration,
      easing,
      useNativeDriver: true,
    });

    this.runningAnimations.set(key, animation);
    
    animation.start((finished) => {
      if (finished) {
        this.runningAnimations.delete(key);
        callback?.();
      }
    });

    return animation;
  }

  // Animação de bounce
  bounce(
    key: string,
    fromValue: number = 1,
    toValue: number = 1.1,
    duration: number = animationConfig.duration.fast,
    callback?: () => void
  ): Animated.CompositeAnimation {
    const animatedValue = this.getAnimatedValue(key, fromValue);
    
    const animation = Animated.sequence([
      Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: animationConfig.easing.easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: fromValue,
        duration,
        easing: animationConfig.easing.easeIn,
        useNativeDriver: true,
      }),
    ]);

    this.runningAnimations.set(key, animation);
    
    animation.start((finished) => {
      if (finished) {
        this.runningAnimations.delete(key);
        callback?.();
      }
    });

    return animation;
  }

  // Animação de shake
  shake(
    key: string,
    intensity: number = 10,
    duration: number = animationConfig.duration.normal,
    callback?: () => void
  ): Animated.CompositeAnimation {
    const animatedValue = this.getAnimatedValue(key, 0);
    
    const animation = Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: intensity,
        duration: duration / 8,
        easing: animationConfig.easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -intensity,
        duration: duration / 4,
        easing: animationConfig.easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: intensity,
        duration: duration / 4,
        easing: animationConfig.easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -intensity,
        duration: duration / 4,
        easing: animationConfig.easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: duration / 8,
        easing: animationConfig.easing.linear,
        useNativeDriver: true,
      }),
    ]);

    this.runningAnimations.set(key, animation);
    
    animation.start((finished) => {
      if (finished) {
        this.runningAnimations.delete(key);
        callback?.();
      }
    });

    return animation;
  }

  // Animação de rotação
  rotate(
    key: string,
    fromDegree: number = 0,
    toDegree: number = 360,
    duration: number = animationConfig.duration.slow,
    easing: any = animationConfig.easing.linear,
    loop: boolean = false,
    callback?: () => void
  ): Animated.CompositeAnimation {
    const animatedValue = this.getAnimatedValue(key, fromDegree);
    
    const animation = Animated.timing(animatedValue, {
      toValue: toDegree,
      duration,
      easing,
      useNativeDriver: true,
    });

    const finalAnimation = loop ? Animated.loop(animation) : animation;
    this.runningAnimations.set(key, finalAnimation);
    
    if (!loop) {
      finalAnimation.start((finished) => {
        if (finished) {
          this.runningAnimations.delete(key);
          callback?.();
        }
      });
    } else {
      finalAnimation.start();
    }

    return finalAnimation;
  }

  // Animação de pulse (respiração)
  pulse(
    key: string,
    fromScale: number = 1,
    toScale: number = 1.05,
    duration: number = animationConfig.duration.slow,
    loop: boolean = true
  ): Animated.CompositeAnimation {
    const animatedValue = this.getAnimatedValue(key, fromScale);
    
    const animation = Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: toScale,
        duration,
        easing: animationConfig.easing.easeInOut,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: fromScale,
        duration,
        easing: animationConfig.easing.easeInOut,
        useNativeDriver: true,
      }),
    ]);

    const finalAnimation = loop ? Animated.loop(animation) : animation;
    this.runningAnimations.set(key, finalAnimation);
    finalAnimation.start();

    return finalAnimation;
  }

  // Animação de stagger (sequencial)
  stagger(
    keys: string[],
    animationType: 'fadeIn' | 'slideUp' | 'scaleIn',
    staggerDelay: number = 100,
    animationDuration: number = animationConfig.duration.normal,
    callback?: () => void
  ): void {
    const animations = keys.map((key, index) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          switch (animationType) {
            case 'fadeIn':
              this.fadeIn(key, animationDuration, animationConfig.easing.easeOut, resolve);
              break;
            case 'slideUp':
              this.slideUp(key, 50, animationDuration, animationConfig.easing.easeOut, resolve);
              break;
            case 'scaleIn':
              this.scaleIn(key, 0, 1, animationDuration, animationConfig.easing.back, resolve);
              break;
          }
        }, index * staggerDelay);
      });
    });

    Promise.all(animations).then(() => {
      callback?.();
    });
  }
}

// Instância global do gerenciador de animações
export const animationManager = new AnimationManager();

// Funções utilitárias para animações comuns
export const createFadeAnimation = (
  initialValue: number = 0,
  finalValue: number = 1,
  duration: number = animationConfig.duration.normal
) => {
  const animatedValue = new Animated.Value(initialValue);
  
  const animate = (callback?: () => void) => {
    Animated.timing(animatedValue, {
      toValue: finalValue,
      duration,
      easing: animationConfig.easing.easeOut,
      useNativeDriver: true,
    }).start(callback);
  };

  return { animatedValue, animate };
};

export const createSlideAnimation = (
  initialValue: number = 300,
  finalValue: number = 0,
  duration: number = animationConfig.duration.normal
) => {
  const animatedValue = new Animated.Value(initialValue);
  
  const animate = (callback?: () => void) => {
    Animated.timing(animatedValue, {
      toValue: finalValue,
      duration,
      easing: animationConfig.easing.easeOut,
      useNativeDriver: true,
    }).start(callback);
  };

  return { animatedValue, animate };
};

export const createScaleAnimation = (
  initialValue: number = 0,
  finalValue: number = 1,
  duration: number = animationConfig.duration.normal
) => {
  const animatedValue = new Animated.Value(initialValue);
  
  const animate = (callback?: () => void) => {
    Animated.timing(animatedValue, {
      toValue: finalValue,
      duration,
      easing: animationConfig.easing.back,
      useNativeDriver: true,
    }).start(callback);
  };

  return { animatedValue, animate };
};

// Interpolações úteis
export const createRotationInterpolation = (animatedValue: Animated.Value) => {
  return animatedValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });
};

export const createOpacityInterpolation = (
  animatedValue: Animated.Value,
  inputRange: number[] = [0, 1],
  outputRange: number[] = [0, 1]
) => {
  return animatedValue.interpolate({
    inputRange,
    outputRange,
    extrapolate: 'clamp',
  });
};

export const createTranslateInterpolation = (
  animatedValue: Animated.Value,
  inputRange: number[] = [0, 1],
  outputRange: number[] = [0, 100]
) => {
  return animatedValue.interpolate({
    inputRange,
    outputRange,
    extrapolate: 'clamp',
  });
};

// Presets de animação
export const animationPresets = {
  // Entrada suave
  gentleEntrance: {
    opacity: createFadeAnimation(0, 1, animationConfig.duration.normal),
    transform: createSlideAnimation(30, 0, animationConfig.duration.normal),
  },
  
  // Entrada dramática
  dramaticEntrance: {
    opacity: createFadeAnimation(0, 1, animationConfig.duration.slow),
    scale: createScaleAnimation(0.8, 1, animationConfig.duration.slow),
  },
  
  // Bounce entrance
  bounceEntrance: {
    scale: createScaleAnimation(0, 1, animationConfig.duration.normal),
  },
};

export default {
  animationConfig,
  AnimationManager,
  animationManager,
  createFadeAnimation,
  createSlideAnimation,
  createScaleAnimation,
  createRotationInterpolation,
  createOpacityInterpolation,
  createTranslateInterpolation,
  animationPresets,
};

