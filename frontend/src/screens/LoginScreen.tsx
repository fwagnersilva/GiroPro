import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RememberMeStorage } from '../utils/rememberMeStorage';
import { useDebounce } from '../hooks/useDebounce';

// Regex pré-compilado para melhor performance
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [nome, setNome] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { signIn } = useAuth();

  // Carregar dados salvos do Remember Me ao inicializar
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedData = await RememberMeStorage.loadRememberMe();
        
        if (savedData) {
          setEmail(savedData.email);
          setRememberMe(savedData.rememberMe);
        }
      } catch (error) {
        console.error('Erro ao carregar credenciais salvas:', error);
      }
    };

    loadSavedCredentials();
  }, []);

  // Memoizar função de validação de email
  const validateEmail = useCallback((email: string): boolean => {
    return EMAIL_REGEX.test(email);
  }, []);

  // Memoizar função para salvar Remember Me
  const handleRememberMe = useCallback(async (email: string, remember: boolean) => {
    try {
      await RememberMeStorage.saveRememberMe(email, remember);
    } catch (error) {
      console.error('Erro ao salvar/remover credenciais:', error);
    }
  }, []);

  // Função para limpar erros (memoizada)
  const clearErrors = useCallback(() => {
    setError('');
    setEmailError('');
  }, []);

  // Debounce para validação de email em tempo real
  const debouncedEmail = useDebounce(email, 300);

  // Validação em tempo real do email com debounce
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setEmailError(''); // Limpar erro imediatamente para melhor UX
  }, []);

  // Efeito para validar email quando o valor debounced muda
  useEffect(() => {
    if (debouncedEmail && !validateEmail(debouncedEmail)) {
      setEmailError('Por favor, insira um email válido');
    } else {
      setEmailError('');
    }
  }, [debouncedEmail, validateEmail]);

  // Memoizar handleSubmit para evitar re-criação desnecessária
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    // Validações antes do envio
    if (!validateEmail(email)) {
      setEmailError('Por favor, insira um email válido');
      return;
    }

    if (!senha.trim()) {
      setError('Por favor, insira sua senha');
      return;
    }

    if (isRegisterMode && !nome.trim()) {
      setError('Por favor, insira seu nome');
      return;
    }

    setLoading(true);

    try {
      if (isRegisterMode) {
        // Registro
        const response = await fetch('http://localhost:3000/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.toLowerCase().trim(), senha, nome: nome.trim() }),
        });

        const data = await response.json();

        if (data.success) {
          clearErrors();
          alert('Usuário cadastrado com sucesso! Faça login agora.');
          setIsRegisterMode(false);
          setNome('');
          setSenha(''); // Limpar senha após registro
        } else {
          // Mensagens de erro mais específicas para registro
          if (data.message?.includes('Email já está em uso') || data.message?.includes('já está em uso')) {
            setError('Este email já está cadastrado. Tente fazer login ou use outro email.');
          } else if (data.message?.includes('senha')) {
            setError('A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número.');
          } else {
            setError(data.message || 'Erro ao cadastrar usuário. Tente novamente.');
          }
        }
      } else {
        // Login
        try {
          await signIn({ email: email.toLowerCase().trim(), senha });
          
          // Salvar ou remover credenciais baseado no Remember Me
          await handleRememberMe(email.toLowerCase().trim(), rememberMe);
          
          navigate('/dashboard');
        } catch (loginError: any) {
          // Limpar senha após falha no login
          setSenha('');
          
          // Mensagens de erro mais específicas para login
          if (loginError.message?.includes('Credenciais inválidas') || 
              loginError.message?.includes('Email ou senha incorretos') ||
              loginError.message?.includes('inválidas')) {
            setError('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
          } else if (loginError.message?.includes('bloqueada') || loginError.message?.includes('tentativas')) {
            setError('Conta temporariamente bloqueada devido a muitas tentativas. Tente novamente em 15 minutos.');
          } else if (loginError.message?.includes('inativa') || loginError.message?.includes('suspensa')) {
            setError('Sua conta está inativa. Entre em contato com o suporte.');
          } else {
            setError('Erro ao fazer login. Verifique sua conexão e tente novamente.');
          }
        }
      }
    } catch (error: any) {
      // Limpar senha em caso de erro geral
      setSenha('');
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [email, senha, nome, isRegisterMode, rememberMe, validateEmail, clearErrors, handleRememberMe, signIn, navigate]);

  // Memoizar toggleMode
  const toggleMode = useCallback(() => {
    setIsRegisterMode(!isRegisterMode);
    clearErrors();
    setNome('');
    setSenha(''); // Limpar senha ao trocar de modo
    setRememberMe(false); // Limpar Remember Me ao trocar de modo
  }, [isRegisterMode, clearErrors]);

  // Memoizar estilos dinâmicos para evitar recriação
  const emailInputStyle = useMemo(() => ({
    ...styles.input,
    borderColor: emailError ? '#ff4444' : '#555',
  }), [emailError]);

  const submitButtonStyle = useMemo(() => ({
    ...styles.submitButton,
    backgroundColor: loading ? '#555' : '#00bcd4',
  }), [loading]);

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>
          {isRegisterMode ? 'CADASTRO' : 'LOGIN'} - GiroPro
        </h1>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegisterMode && (
            <>
              <label htmlFor="nome" style={styles.label}>NOME:</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required={isRegisterMode}
                style={styles.input}
                autoComplete="off"
              />
            </>
          )}

          <label htmlFor="email" style={styles.label}>EMAIL:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            required
            style={emailInputStyle}
            autoComplete="email"
          />
          {emailError && <div style={styles.fieldError}>{emailError}</div>}

          <label htmlFor="senha" style={styles.label}>SENHA:</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={styles.input}
            autoComplete="off"
          />

          {error && <div style={styles.error}>{error}</div>}

          {!isRegisterMode && (
            <div style={styles.rememberMeContainer}>
              <label style={styles.rememberMeLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.rememberMeCheckbox}
                />
                <span style={styles.rememberMeText}>Lembrar-me</span>
              </label>
            </div>
          )}

          <div style={styles.buttonContainer}>
            <button
              type="submit"
              disabled={loading}
              style={submitButtonStyle}
            >
              {loading ? 'PROCESSANDO...' : (isRegisterMode ? 'CADASTRAR' : 'LOGIN')}
            </button>
          </div>

          <div style={styles.toggleContainer}>
            <button
              type="button"
              onClick={toggleMode}
              style={styles.toggleButton}
            >
              {isRegisterMode 
                ? 'Já tem conta? Fazer LOGIN' 
                : 'Não tem conta? CADASTRAR'}
            </button>
          </div>

          {!isRegisterMode && (
            <div style={styles.forgotPasswordContainer}>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                style={styles.forgotPasswordButton}
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}
        </form>

        <div style={styles.credentialsInfo}>
          <p style={styles.credentialsTitle}>Credenciais de teste:</p>
          <p style={styles.credentialsText}>Email: teste@teste.com</p>
          <p style={styles.credentialsText}>Senha: Teste123@</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#212121',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  formContainer: {
    maxWidth: '400px',
    width: '100%',
    padding: '30px',
    backgroundColor: '#333',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00bcd4',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    border: '1px solid #555',
    backgroundColor: '#444',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box' as const,
  },
  error: {
    color: '#ff4444',
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#331111',
    borderRadius: '4px',
    fontSize: '14px',
  },
  fieldError: {
    color: '#ff4444',
    fontSize: '12px',
    marginTop: '5px',
    marginBottom: '10px',
  },
  buttonContainer: {
    marginBottom: '20px',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#00bcd4',
    color: '#fff',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  toggleContainer: {
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#00bcd4',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
  },
  forgotPasswordContainer: {
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  forgotPasswordButton: {
    background: 'none',
    border: 'none',
    color: '#00bcd4',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
  },
  rememberMeContainer: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  rememberMeLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#ccc',
  },
  rememberMeCheckbox: {
    marginRight: '8px',
    width: '16px',
    height: '16px',
    accentColor: '#00bcd4',
  },
  rememberMeText: {
    userSelect: 'none' as const,
  },
  credentialsInfo: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#2a2a2a',
    borderRadius: '4px',
    textAlign: 'center' as const,
  },
  credentialsTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#00bcd4',
  },
  credentialsText: {
    fontSize: '12px',
    margin: '4px 0',
    color: '#ccc',
  },
};

export default LoginScreen;
