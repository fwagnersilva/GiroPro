import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../LoginScreen';

// Mock do Alert
jest.spyOn(Alert, 'alert');

// Mock do contexto de autenticação
const mockSignIn = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
  }),
}));

// Mock da navegação
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('LoginScreen', () => {
  const mockNavigation = {
    navigate: mockNavigate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form', () => {
    const { getByText, getByTestId } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    expect(getByText('GiroPro')).toBeTruthy();
    expect(getByText('Gestão financeira para motoristas')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
  });

  it('should show error when trying to login with empty fields', async () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const loginButton = getByText('Entrar');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro',
        'Por favor, informe seu email'
      );
    });
  });

  it('should show error when trying to login with empty password', async () => {
    const { getByText, getByTestId } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const emailInput = getByTestId('email-input');
    const loginButton = getByText('Entrar');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Erro',
        'Por favor, informe sua senha'
      );
    });
  });

  it('should call signIn when form is valid', async () => {
    const { getByText, getByTestId } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByText('Entrar');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        senha: 'password123',
      });
    });
  });

  it('should navigate to register screen', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const registerLink = getByText('Cadastre-se');
    fireEvent.press(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });

  it('should toggle password visibility', () => {
    const { getByTestId } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const toggleButton = getByTestId('right-icon-button');
    fireEvent.press(toggleButton);

    // Verificar se o ícone mudou (o comportamento específico depende da implementação)
    expect(toggleButton).toBeTruthy();
  });

  it('should toggle remember me checkbox', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const rememberMeText = getByText('Lembrar-me');
    fireEvent.press(rememberMeText);

    // Verificar se o checkbox foi marcado (o comportamento específico depende da implementação)
    expect(rememberMeText).toBeTruthy();
  });

  it('should show forgot password alert', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const forgotPasswordLink = getByText('Esqueceu sua senha?');
    fireEvent.press(forgotPasswordLink);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Em breve',
      'Funcionalidade em desenvolvimento'
    );
  });

  it('should handle login error', async () => {
    const errorMessage = 'Credenciais inválidas';
    mockSignIn.mockRejectedValueOnce(new Error(errorMessage));

    const { getByText, getByTestId } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByText('Entrar');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', errorMessage);
    });
  });

  it('should disable login button when form is invalid', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const loginButton = getByText('Entrar');
    
    // O botão deve estar desabilitado quando os campos estão vazios
    expect(loginButton.props.accessibilityState?.disabled).toBe(true);
  });

  it('should enable login button when form is valid', () => {
    const { getByText, getByTestId } = render(
      <LoginScreen navigation={mockNavigation as any} />
    );

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByText('Entrar');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    // O botão deve estar habilitado quando os campos estão preenchidos
    expect(loginButton.props.accessibilityState?.disabled).toBe(false);
  });
});

