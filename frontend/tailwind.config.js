const colors = require('./src/components/ui/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter'],
      },
      colors: {
        ...colors,
        // Cores baseadas em variáveis CSS para temas dinâmicos
        'theme-primary': 'var(--color-primary)',
        'theme-secondary': 'var(--color-secondary)',
        'theme-success': 'var(--color-success)',
        'theme-warning': 'var(--color-warning)',
        'theme-error': 'var(--color-error)',
        'theme-danger': 'var(--color-danger)',
        'theme-background': 'var(--color-background)',
        'theme-surface': 'var(--color-surface)',
        'theme-surface-secondary': 'var(--color-surface-secondary)',
        'theme-text-primary': 'var(--color-text-primary)',
        'theme-text-secondary': 'var(--color-text-secondary)',
        'theme-text-disabled': 'var(--color-text-disabled)',
        'theme-text-on-primary': 'var(--color-text-on-primary)',
        'theme-text-on-secondary': 'var(--color-text-on-secondary)',
        'theme-border': 'var(--color-border)',
        'theme-border-focus': 'var(--color-border-focus)',
      },
      // Configurações adicionais para melhor suporte a temas
      backgroundColor: {
        'theme-background': 'var(--color-background)',
        'theme-surface': 'var(--color-surface)',
        'theme-surface-secondary': 'var(--color-surface-secondary)',
        'theme-primary': 'var(--color-primary)',
        'theme-secondary': 'var(--color-secondary)',
      },
      textColor: {
        'theme-primary': 'var(--color-text-primary)',
        'theme-secondary': 'var(--color-text-secondary)',
        'theme-disabled': 'var(--color-text-disabled)',
        'theme-on-primary': 'var(--color-text-on-primary)',
        'theme-on-secondary': 'var(--color-text-on-secondary)',
      },
      borderColor: {
        'theme': 'var(--color-border)',
        'theme-focus': 'var(--color-border-focus)',
      },
      // Configurações de transição para mudanças de tema
      transitionProperty: {
        'theme': 'background-color, color, border-color',
      },
      transitionDuration: {
        'theme': '300ms',
      },
      transitionTimingFunction: {
        'theme': 'ease',
      },
    },
  },
  plugins: [],
};
