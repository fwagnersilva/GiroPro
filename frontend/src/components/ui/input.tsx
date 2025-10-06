import React from 'react';
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useController } from 'react-hook-form';
import type { TextInputProps } from 'react-native';
import { I18nManager, StyleSheet, View } from 'react-native';
import { TextInput as NTextInput } from 'react-native';
import { tv } from 'tailwind-variants';

import colors from './colors';
import { Text } from './text';

const inputTv = tv({
  slots: {
    container: 'mb-2',
    label: 'text-theme-primary mb-1 text-lg',
    input:
      'mt-0 rounded-xl border-[0.5px] border-theme bg-theme-surface px-4 py-3 font-inter text-base font-medium leading-5 text-theme-primary theme-transition',
  },

  variants: {
    focused: {
      true: {
        input: 'border-theme-focus',
      },
    },
    error: {
      true: {
        input: 'border-error-500 dark:border-error-dark-500',
        label: 'text-error-500 dark:text-error-dark-500',
      },
    },
    disabled: {
      true: {
        input: 'bg-neutral-200 dark:bg-neutral-700 opacity-50',
        label: 'text-theme-disabled',
      },
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
});

export interface NInputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  error?: string;
}

type TRule<T extends FieldValues> =
  | Omit<
      RegisterOptions<T>,
      'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
    >
  | undefined;

export type RuleType<T extends FieldValues> = { [name in keyof T]: TRule<T> };
export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: RuleType<T>;
};

interface ControlledInputProps<T extends FieldValues>
  extends NInputProps,
    InputControllerType<T> {}

export const Input = React.forwardRef<NTextInput, NInputProps>((props, ref) => {
  const { label, error, testID, ...inputProps } = props;
  const [isFocussed, setIsFocussed] = React.useState(false);
  const onBlur = React.useCallback(() => setIsFocussed(false), []);
  const onFocus = React.useCallback(() => setIsFocussed(true), []);

  const styles = React.useMemo(
    () =>
      inputTv({
        error: Boolean(error),
        focused: isFocussed,
        disabled: Boolean(props.disabled),
      }),
    [error, isFocussed, props.disabled]
  );

  // Cor do placeholder baseada no tema
  const placeholderColor = React.useMemo(() => {
    if (props.disabled) {
      return colors.text['light-disabled']; // Será sobrescrito pelas variáveis CSS
    }
    return colors.neutral[400];
  }, [props.disabled]);

  return (
    <View className={styles.container()}>
      {label && (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          className={styles.label()}
        >
          {label}
        </Text>
      )}
      <NTextInput
        testID={testID}
        ref={ref}
        placeholderTextColor={placeholderColor}
        className={styles.input()}
        onBlur={onBlur}
        onFocus={onFocus}
        {...inputProps}
        style={StyleSheet.flatten([
          { writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' },
          { textAlign: I18nManager.isRTL ? 'right' : 'left' },
          inputProps.style,
        ])}
        accessibilityLabel={label}
        accessibilityState={{ disabled: Boolean(props.disabled) }}
      />
      {error && (
        <Text
          testID={testID ? `${testID}-error` : undefined}
          variant="error"
          className="text-sm mt-1"
        >
          {error}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

// only used with react-hook-form
export function ControlledInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { name, control, rules, ...inputProps } = props;

  const { field, fieldState } = useController({ control, name, rules });
  return (
    <Input
      ref={field.ref}
      autoCapitalize="none"
      onChangeText={field.onChange}
      value={(field.value as string) || ''}
      {...inputProps}
      error={fieldState.error?.message}
    />
  );
}
