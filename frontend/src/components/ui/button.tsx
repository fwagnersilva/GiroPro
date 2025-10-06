import React from 'react';
import type { PressableProps, View } from 'react-native';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

const button = tv({
  slots: {
    container: 'my-2 flex flex-row items-center justify-center rounded-md px-4 theme-transition',
    label: 'font-inter text-base font-semibold',
    indicator: 'h-6',
  },

  variants: {
    variant: {
      default: {
        container: 'bg-theme-primary',
        label: 'text-theme-on-primary',
        indicator: 'text-theme-on-primary',
      },
      secondary: {
        container: 'bg-theme-secondary',
        label: 'text-theme-on-secondary',
        indicator: 'text-theme-on-secondary',
      },
      outline: {
        container: 'border border-theme bg-theme-surface',
        label: 'text-theme-primary',
        indicator: 'text-theme-primary',
      },
      destructive: {
        container: 'bg-error-500 dark:bg-error-dark-500',
        label: 'text-white dark:text-black',
        indicator: 'text-white dark:text-black',
      },
      success: {
        container: 'bg-success-500 dark:bg-success-dark-500',
        label: 'text-white dark:text-black',
        indicator: 'text-white dark:text-black',
      },
      warning: {
        container: 'bg-warning-500 dark:bg-warning-dark-500',
        label: 'text-black dark:text-black',
        indicator: 'text-black dark:text-black',
      },
      ghost: {
        container: 'bg-transparent',
        label: 'text-theme-primary underline',
        indicator: 'text-theme-primary',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-theme-primary',
        indicator: 'text-theme-primary',
      },
      surface: {
        container: 'bg-theme-surface border border-theme',
        label: 'text-theme-primary',
        indicator: 'text-theme-primary',
      },
    },
    size: {
      default: {
        container: 'h-10 px-4',
        label: 'text-base',
      },
      lg: {
        container: 'h-12 px-8',
        label: 'text-xl',
      },
      sm: {
        container: 'h-8 px-3',
        label: 'text-sm',
        indicator: 'h-2',
      },
      icon: { 
        container: 'size-9',
        label: 'text-sm',
      },
    },
    disabled: {
      true: {
        container: 'bg-neutral-300 dark:bg-neutral-700 opacity-50',
        label: 'text-theme-disabled',
        indicator: 'text-theme-disabled',
      },
    },
    fullWidth: {
      true: {
        container: '',
      },
      false: {
        container: 'self-center',
      },
    },
    loading: {
      true: {
        container: 'opacity-70',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
    fullWidth: true,
    size: 'default',
    loading: false,
  },
});

type ButtonVariants = VariantProps<typeof button>;
interface Props extends ButtonVariants, Omit<PressableProps, 'disabled'> {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

export const Button = React.forwardRef<View, Props>(
  (
    {
      label: text,
      loading = false,
      variant = 'default',
      disabled = false,
      size = 'default',
      className = '',
      testID,
      textClassName = '',
      fullWidth = true,
      ...props
    },
    ref
  ) => {
    const styles = React.useMemo(
      () => button({ variant, disabled, size, fullWidth, loading }),
      [variant, disabled, size, fullWidth, loading]
    );

    return (
      <Pressable
        disabled={disabled || loading}
        className={styles.container({ className })}
        {...props}
        ref={ref}
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
      >
        {props.children ? (
          props.children
        ) : (
          <>
            {loading ? (
              <ActivityIndicator
                size="small"
                className={styles.indicator()}
                testID={testID ? `${testID}-activity-indicator` : undefined}
              />
            ) : (
              <Text
                testID={testID ? `${testID}-label` : undefined}
                className={styles.label({ className: textClassName })}
              >
                {text}
              </Text>
            )}
          </>
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';
