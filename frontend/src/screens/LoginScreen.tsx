import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RememberMeStorage } from '../utils/rememberMeStorage';
import { useDebounce } from '../hooks/useDebounce';

import AuthInput from '../components/Auth/AuthInput';
import AuthButton from '../components/Auth/AuthButton';
import AuthForm from '../components/Auth/AuthForm';
import ToastNotification, { ToastType } from '../components/ToastNotification.web';
import styles from './LoginScreen.styles';

// Regex pré-compilado para melhor performance na validação de e-mail.
const EMAIL_REGEX = /^[^
@]+@[^
@]+\.[^
@]+$/;

const LoginScreen: React.FC = () => {
  // Estados para gerenciar os campos do formulário e o modo (login/cadastro).
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [nome, setNome] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Estados para gerenciar as notificações Toast.
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('error');

  const navigate = useNavigate();
  const { signIn } = useAuth();

  // Função para exibir notificações Toast de forma centralizada.
  const showToast = useCallback((message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  }, []);

  // Função para esconder notificações Toast.
  const hideToast = useCallback(() => {
    setToastVisible(false);
    setToastMessage('');
  }, []);

  // Efeito para carregar credenciais salvas do 


Remember Me ao inicializar a tela.
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedData = await RememberMeStorage.loadRememberMe();
        
        if (savedData) {
          setEmail(savedData.email);
          setRememberMe(savedData.rememberMe);
        }
      } catch (error) {
        console.error("Erro ao carregar credenciais salvas:", error);
        showToast("Erro ao carregar credenciais salvas.", "error");
      }
    };

    loadSavedCredentials();
  }, [showToast]);

  // Memoiza a função de validação de e-mail para evitar recriações desnecessárias.
  const validateEmail = useCallback((email: string): boolean => {
    return EMAIL_REGEX.test(email);
  }, []);

  // Memoiza a função para salvar ou remover as credenciais do Remember Me.
  const handleRememberMe = useCallback(async (email: string, remember: boolean) => {
    try {
      await RememberMeStorage.saveRememberMe(email, remember);
    } catch (error) {
      console.error("Erro ao salvar/remover credenciais:", error);
      showToast("Erro ao salvar credenciais.", "error");
    }
  }, [showToast]);

  // Função para limpar mensagens de erro do formulário.
  const clearErrors = useCallback(() => {
    setEmailError("");
  }, []);

  // Hook de debounce para atrasar a validação do e-mail, melhorando a experiência do usuário.
  const debouncedEmail = useDebounce(email, 300);

  // Lida com a mudança do campo de e-mail, limpando o erro imediatamente para melhor UX.
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setEmailError("");
  }, []);

  // Efeito que dispara a validação do e-mail quando o valor debounced muda.
  useEffect(() => {
    if (debouncedEmail && !validateEmail(debouncedEmail)) {
      setEmailError("Por favor, insira um email válido");
    } else {
      setEmailError("");
    }
  }, [debouncedEmail, validateEmail]);

  // Lida com o envio do formulário (login ou cadastro).
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    // Validações iniciais antes de tentar a requisição.
    if (!validateEmail(email)) {
      setEmailError("Por favor, insira um email válido");
      return;
    }

    if (!senha.trim()) {
      showToast("Por favor, insira sua senha", "error");
      return;
    }

    if (isRegisterMode && !nome.trim()) {
      showToast("Por favor, insira seu nome", "error");
      return;
    }

    setLoading(true);

    try {
      if (isRegisterMode) {
        // Lógica para o modo de cadastro.
        const response = await fetch("http://localhost:3000/api/v1/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.toLowerCase().trim(), senha, nome: nome.trim() }),
        });

        const data = await response.json();

        if (data.success) {
          clearErrors();
          showToast("Usuário cadastrado com sucesso! Faça login agora.", "success");
          setIsRegisterMode(false);
          setNome("");
          setSenha(""); // Limpar senha após registro.
        } else {
          // Tratamento de erros específicos para o cadastro.
          if (data.message?.includes("Email já está em uso") || data.message?.includes("já está em uso")) {
            showToast("Este email já está cadastrado. Tente fazer login ou use outro email.", "error");
          } else if (data.message?.includes("senha")) {
            showToast("A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número.", "error");
          } else {
            showToast(data.message || "Erro ao cadastrar usuário. Tente novamente.", "error");
          }
        }
      } else {
        // Lógica para o modo de login.
        try {
          await signIn({ email: email.toLowerCase().trim(), senha });
          
          // Salva ou remove credenciais com base na opção "Lembrar-me".
          await handleRememberMe(email.toLowerCase().trim(), rememberMe);
          
          navigate("/dashboard"); // Redireciona para o dashboard após login bem-sucedido.
        } catch (loginError: any) {
          setSenha(""); // Limpa a senha após falha no login por segurança.
          
          // Tratamento de erros específicos para o login.
          if (loginError.message?.includes("Credenciais inválidas") || 
              loginError.message?.includes("Email ou senha incorretos") ||
              loginError.message?.includes("inválidas")) {
            showToast("Email ou senha incorretos. Verifique suas credenciais e tente novamente.", "error");
          } else if (loginError.message?.includes("bloqueada") || loginError.message?.includes("tentativas")) {
            showToast("Conta temporariamente bloqueada devido a muitas tentativas. Tente novamente em 15 minutos.", "error");
          } else if (loginError.message?.includes("inativa") || loginError.message?.includes("suspensa")) {
            showToast("Sua conta está inativa. Entre em contato com o suporte.", "error");
          } else {
            showToast("Erro ao fazer login. Verifique sua conexão e tente novamente.", "error");
          }
        }
      }
    } catch (error: any) {
      setSenha(""); // Limpa a senha em caso de erro geral de conexão.
      showToast("Erro de conexão. Verifique sua internet e tente novamente.", "error");
    } finally {
      setLoading(false); // Finaliza o estado de carregamento.
    }
  }, [email, senha, nome, isRegisterMode, rememberMe, validateEmail, clearErrors, handleRememberMe, signIn, navigate, showToast]);

  // Função para alternar entre os modos de login e cadastro.
  const toggleMode = useCallback(() => {
    setIsRegisterMode(!isRegisterMode);
    clearErrors();
    setNome("");
    setSenha(""); // Limpa a senha ao trocar de modo.
    setRememberMe(false); // Limpa a opção "Lembrar-me" ao trocar de modo.
  }, [isRegisterMode, clearErrors]);

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>
          {isRegisterMode ? "CADASTRO" : "LOGIN"} - GiroPro
        </h1>
        
        <AuthForm onSubmit={handleSubmit}>
          {isRegisterMode && (
            <AuthInput
              id="nome"
              label="NOME"
              type="text"
              value={nome}
              onChange={setNome}
              required={isRegisterMode}
              autoComplete="off"
            />
          )}

          <AuthInput
            id="email"
            label="EMAIL"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            autoComplete="email"
            error={emailError}
          />

          <AuthInput
            id="senha"
            label="SENHA"
            type="password"
            value={senha}
            onChange={setSenha}
            required
            autoComplete="off"
          />

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

          <AuthButton
            type="submit"
            text={loading ? "PROCESSANDO..." : (isRegisterMode ? "CADASTRAR" : "LOGIN")}
            disabled={loading}
            variant="primary"
          />

          <AuthButton
            type="button"
            text={isRegisterMode ? "Já tem conta? Fazer LOGIN" : "Não tem conta? CADASTRAR"}
            onClick={toggleMode}
            variant="text"
          />

          {!isRegisterMode && (
            <div style={styles.forgotPasswordContainer}>
              <AuthButton
                type="button"
                text="Esqueceu sua senha?"
                onClick={() => navigate("/forgot-password")}
                variant="text"
              />
            </div>
          )}
        </AuthForm>

        <div style={styles.credentialsInfo}>
          <p style={styles.credentialsTitle}>Credenciais de teste:</p>
          <p style={styles.credentialsText}>Email: teste@teste.com</p>
          <p style={styles.credentialsText}>Senha: Teste123@</p>
        </div>
      </div>
      <ToastNotification
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={hideToast}
      />
    </div>
  );
};

export default LoginScreen;


