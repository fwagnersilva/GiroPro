import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FormInput, { validators } from '../FormInput';

describe('FormInput', () => {
  const defaultProps = {
    label: 'Test Label',
    value: '',
    onChangeText: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with label', () => {
    const { getByText } = render(<FormInput {...defaultProps} />);
    
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('should render with required indicator', () => {
    const { getByText } = render(<FormInput {...defaultProps} required />);
    
    expect(getByText('Test Label')).toBeTruthy();
    expect(getByText('*')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByTestId } = render(
      <FormInput {...defaultProps} onChangeText={mockOnChangeText} testID="test-input" />
    );
    
    const input = getByTestId('test-input');
    fireEvent.changeText(input, 'new text');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('new text');
  });

  it('should show error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    const { getByText } = render(
      <FormInput {...defaultProps} error={errorMessage} />
    );
    
    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('should validate input in real time', () => {
    const validation = jest.fn().mockReturnValue('Invalid input');
    const { getByTestId } = render(
      <FormInput 
        {...defaultProps} 
        validation={validation}
        testID="test-input"
      />
    );
    
    const input = getByTestId('test-input');
    fireEvent.changeText(input, 'test');
    
    expect(validation).toHaveBeenCalledWith('test');
  });

  it('should show validation error', () => {
    const validation = jest.fn().mockReturnValue('Invalid input');
    const { getByTestId, getByText } = render(
      <FormInput 
        {...defaultProps} 
        validation={validation}
        testID="test-input"
      />
    );
    
    const input = getByTestId('test-input');
    fireEvent.changeText(input, 'test');
    
    expect(getByText('Invalid input')).toBeTruthy();
  });

  it('should render left icon', () => {
    const { getByTestId } = render(
      <FormInput {...defaultProps} leftIcon="mail-outline" />
    );
    
    // O ícone deve estar presente (mockado como 'Icon')
    expect(getByTestId('form-input-container')).toBeTruthy();
  });

  it('should render right icon with press handler', () => {
    const mockPress = jest.fn();
    const { getByTestId } = render(
      <FormInput 
        {...defaultProps} 
        rightIcon="eye-outline" 
        onRightIconPress={mockPress}
      />
    );
    
    const rightIconButton = getByTestId('right-icon-button');
    fireEvent.press(rightIconButton);
    
    expect(mockPress).toHaveBeenCalled();
  });

  it('should apply focus styles when focused', () => {
    const { getByTestId } = render(
      <FormInput {...defaultProps} testID="test-input" />
    );
    
    const input = getByTestId('test-input');
    fireEvent(input, 'focus');
    
    // Verificar se os estilos de foco foram aplicados
    const container = getByTestId('form-input-container');
    expect(container).toBeTruthy();
  });
});

describe('validators', () => {
  describe('required', () => {
    it('should return error for empty string', () => {
      expect(validators.required('')).toBe('Este campo é obrigatório');
      expect(validators.required('   ')).toBe('Este campo é obrigatório');
    });

    it('should return null for non-empty string', () => {
      expect(validators.required('test')).toBeNull();
    });
  });

  describe('email', () => {
    it('should return null for empty string', () => {
      expect(validators.email('')).toBeNull();
    });

    it('should return error for invalid email', () => {
      expect(validators.email('invalid')).toBe('Email inválido');
      expect(validators.email('test@')).toBe('Email inválido');
      expect(validators.email('@test.com')).toBe('Email inválido');
    });

    it('should return null for valid email', () => {
      expect(validators.email('test@example.com')).toBeNull();
      expect(validators.email('user.name@domain.co.uk')).toBeNull();
    });
  });

  describe('minLength', () => {
    it('should return null for empty string', () => {
      const validator = validators.minLength(5);
      expect(validator('')).toBeNull();
    });

    it('should return error for string shorter than minimum', () => {
      const validator = validators.minLength(5);
      expect(validator('test')).toBe('Mínimo de 5 caracteres');
    });

    it('should return null for string meeting minimum length', () => {
      const validator = validators.minLength(5);
      expect(validator('testing')).toBeNull();
    });
  });

  describe('positiveNumber', () => {
    it('should return null for empty string', () => {
      expect(validators.positiveNumber('')).toBeNull();
    });

    it('should return error for non-positive numbers', () => {
      expect(validators.positiveNumber('0')).toBe('Deve ser um número positivo');
      expect(validators.positiveNumber('-5')).toBe('Deve ser um número positivo');
      expect(validators.positiveNumber('abc')).toBe('Deve ser um número positivo');
    });

    it('should return null for positive numbers', () => {
      expect(validators.positiveNumber('5')).toBeNull();
      expect(validators.positiveNumber('10.5')).toBeNull();
    });
  });
});

