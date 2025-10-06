import React from 'react';
import type { TextProps, TextStyle } from 'react-native';
import { I18nManager, StyleSheet, Text as NNText } from 'react-native';
import { twMerge } from 'tailwind-merge';

import type { TxKeyPath } from '@/lib/i18n';
import { translate } from '@/lib/i18n';

interface Props extends TextProps {
  className?: string;
  tx?: TxKeyPath;
  /**
   * Variante do texto para aplicar estilos semânticos
   */
  variant?: 'primary' | 'secondary' | 'disabled' | 'success' | 'warning' | 'error';
}

export const Text = ({
  className = '',
  style,
  tx,
  children,
  variant = 'primary',
  ...props
}: Props) => {
  // Mapeamento de variantes para classes de cor
  const variantClasses = {
    primary: 'text-theme-primary',
    secondary: 'text-theme-secondary',
    disabled: 'text-theme-disabled',
    success: 'text-success-500 dark:text-success-dark-500',
    warning: 'text-warning-500 dark:text-warning-dark-500',
    error: 'text-error-500 dark:text-error-dark-500',
  };

  const textStyle = React.useMemo(
    () =>
      twMerge(
        'text-base font-inter font-normal theme-transition',
        variantClasses[variant],
        className
      ),
    [className, variant]
  );

  const nStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        {
          writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
        },
        style,
      ]) as TextStyle,
    [style]
  );

  return (
    <NNText className={textStyle} style={nStyle} {...props}>
      {tx ? translate(tx) : children}
    </NNText>
  );
};

Text.displayName = 'Text';
