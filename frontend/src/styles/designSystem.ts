// Design System para GiroPro
// Centraliza cores, tipografia, espaçamentos e componentes reutilizáveis

export const colors = {
  // Cores primárias
  primary: {
    main: '#007AFF',
    light: '#A9D3FF',
    dark: '#0056CC',
    contrast: '#FFFFFF'
  },
  
  // Cores secundárias
  secondary: {
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#AF52DE'
  },
  
  // Cores neutras
  neutral: {
    background: '#F2F2F7',
    surface: '#FFFFFF',
    border: '#E5E5EA',
    text: {
      primary: '#000000',
      secondary: '#8E8E93',
      disabled: '#C7C7CC'
    }
  },
  
  // Estados
  states: {
    hover: 'rgba(0, 122, 255, 0.1)',
    focus: 'rgba(0, 122, 255, 0.2)',
    disabled: '#F8F9FA'
  },
  
  // Cores específicas para o tema escuro da tela de login
  loginScreen: {
    background: '#212121',
    formBackground: '#333',
    inputBackground: '#444',
    inputBorder: '#555',
    errorBackground: '#331111',
    link: '#00bcd4', // Cor usada para botões de alternância e esqueceu senha
  }
};

export const typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  
  // Tamanhos de fonte
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '36px'
  },
  
  // Pesos de fonte
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  
  // Altura de linha
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75'
  }
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
  
  // Espaçamentos específicos para a tela de login
  loginScreen: {
    inputMarginBottom: '20px',
    buttonMarginBottom: '10px',
    errorMarginBottom: '15px',
    padding: '20px',
    formPadding: '30px',
    titleMarginBottom: '30px',
    credentialsMarginTop: '20px',
    credentialsPadding: '15px',
  }
};

export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '50%'
};

export const shadows = {
  sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 8px rgba(0, 0, 0, 0.15)',
  xl: '0 8px 16px rgba(0, 0, 0, 0.2)'
};

// Componentes base do sistema de design
export const components = {
  button: {
    base: {
      border: 'none',
      borderRadius: borderRadius.md,
      cursor: 'pointer',
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm
    },
    
    sizes: {
      sm: {
        padding: `${spacing.sm} ${spacing.md}`,
        fontSize: typography.fontSize.sm
      },
      md: {
        padding: `${spacing.md} ${spacing.lg}`,
        fontSize: typography.fontSize.base
      },
      lg: {
        padding: `${spacing.lg} ${spacing.xl}`,
        fontSize: typography.fontSize.lg
      }
    },
    
    variants: {
      primary: {
        backgroundColor: colors.primary.main,
        color: colors.primary.contrast,
        ':hover': {
          backgroundColor: colors.primary.dark
        },
        ':disabled': {
          backgroundColor: colors.primary.light,
          cursor: 'not-allowed'
        }
      },
      secondary: {
        backgroundColor: colors.neutral.surface,
        color: colors.neutral.text.primary,
        border: `1px solid ${colors.neutral.border}`,
        ':hover': {
          backgroundColor: colors.states.hover
        }
      },
      success: {
        backgroundColor: colors.secondary.success,
        color: colors.primary.contrast
      },
      warning: {
        backgroundColor: colors.secondary.warning,
        color: colors.primary.contrast
      },
      error: {
        backgroundColor: colors.secondary.error,
        color: colors.primary.contrast
      }
    }
  },
  
  card: {
    base: {
      backgroundColor: colors.neutral.surface,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.md,
      padding: spacing.xl
    }
  },
  
  input: {
    base: {
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.base,
      padding: `${spacing.md} ${spacing.lg}`,
      border: `1px solid ${colors.neutral.border}`,
      borderRadius: borderRadius.md,
      backgroundColor: colors.neutral.surface,
      color: colors.neutral.text.primary,
      outline: 'none',
      transition: 'all 0.2s ease',
      ':focus': {
        borderColor: colors.primary.main,
        boxShadow: `0 0 0 2px ${colors.states.focus}`
      },
      ':error': {
        borderColor: colors.secondary.error
      }
    }
  }
};

// Utilitários para aplicar estilos
export const createButtonStyle = (
  variant: keyof typeof components.button.variants = 'primary',
  size: keyof typeof components.button.sizes = 'md'
) => ({
  ...components.button.base,
  ...components.button.sizes[size],
  ...components.button.variants[variant]
});

export const createCardStyle = () => ({
  ...components.card.base
});

export const createInputStyle = (hasError: boolean = false) => ({
  ...components.input.base,
  ...(hasError && {
    borderColor: colors.secondary.error
  })
});

// Breakpoints para responsividade
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
};

// Animações
export const animations = {
  spin: {
    animation: 'spin 1s linear infinite'
  },
  fadeIn: {
    animation: 'fadeIn 0.3s ease-in-out'
  },
  slideUp: {
    animation: 'slideUp 0.3s ease-out'
  }
};

// CSS Global para animações
export const globalCSS = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @keyframes slideUp {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    font-family: ${typography.fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${colors.neutral.background};
    color: ${colors.neutral.text.primary};
  }
`;


