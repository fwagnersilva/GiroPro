import React from 'react';
import { cleanup, screen, setup, waitFor } from '@/lib/test-utils';
import type { LoginFormProps } from './login-form';
import { LoginForm } from './login-form';
import { useNavigation } from '@react-navigation/native'; // Assumindo que useNavigation é usado para navegação

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

afterEach(cleanup);

const onSubmitMock: jest.Mock<LoginFormProps['onSubmit']> = jest.fn();

describe('LoginForm Form - Extended Tests', () => {
  it('should navigate to forgot password screen when "Esqueceu sua senha?" is pressed', async () => {
    const navigateMock = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: navigateMock });

    const { user } = setup(<LoginForm onSubmit={onSubmitMock} />);

    const forgotPasswordLink = screen.getByText('Esqueceu sua senha?');
    await user.press(forgotPasswordLink);

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('ForgotPassword'); // Assumindo que a rota para esqueci a senha é 'ForgotPassword'
  });
});

