import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.web';

interface RegisterScreenWebProps {
  onNavigateToLogin?: () => void;
}

const RegisterScreenWeb: React.FC<RegisterScreenWebProps> = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { signUp } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!formData.confirmarSenha.trim()) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'Você deve aceitar os termos de uso';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await signUp({
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.senha
      });
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      onNavigateToLogin?.();
    } catch (error: any) {
      alert(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = 
    formData.nome.trim() !== '' && 
    formData.email.trim() !== '' && 
    formData.senha.trim() !== '' && 
    formData.confirmarSenha.trim() !== '' &&
    acceptTerms &&
    Object.keys(errors).length === 0;

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: hasError ? '2px solid #FF3B30' : '2px solid #E5E5EA',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const
  });

  const passwordInputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '12px 40px 12px 16px',
    fontSize: '16px',
    border: hasError ? '2px solid #FF3B30' : '2px solid #E5E5EA',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F2F2F7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        animation: 'fadeInUp 0.8s ease-out'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#007AFF',
            margin: '0 0 8px 0'
          }}>Criar Conta</h1>
          <p style={{
            fontSize: '16px',
            color: '#8E8E93',
            margin: '0'
          }}>Junte-se ao GiroPro e gerencie suas finanças</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} style={{ width: '100%' }}>
          {/* Nome Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Nome Completo *
            </label>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              style={inputStyle(!!errors.nome)}
            />
            {errors.nome && (
              <p style={{
                color: '#FF3B30',
                fontSize: '14px',
                margin: '4px 0 0 0'
              }}>{errors.nome}</p>
            )}
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Email *
            </label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={inputStyle(!!errors.email)}
            />
            {errors.email && (
              <p style={{
                color: '#FF3B30',
                fontSize: '14px',
                margin: '4px 0 0 0'
              }}>{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Senha *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha (mín. 6 caracteres)"
                value={formData.senha}
                onChange={(e) => handleInputChange('senha', e.target.value)}
                style={passwordInputStyle(!!errors.senha)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#8E8E93'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.senha && (
              <p style={{
                color: '#FF3B30',
                fontSize: '14px',
                margin: '4px 0 0 0'
              }}>{errors.senha}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Confirmar Senha *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirme sua senha"
                value={formData.confirmarSenha}
                onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                style={passwordInputStyle(!!errors.confirmarSenha)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#8E8E93'
                }}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmarSenha && (
              <p style={{
                color: '#FF3B30',
                fontSize: '14px',
                margin: '4px 0 0 0'
              }}>{errors.confirmarSenha}</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors(prev => ({ ...prev, terms: undefined }));
                  }
                }}
                style={{ marginRight: '8px', marginTop: '2px' }}
              />
              <span style={{ 
                fontSize: '14px', 
                color: '#333',
                lineHeight: '1.4'
              }}>
                Eu aceito os{' '}
                <button
                  type="button"
                  onClick={() => alert('Termos de uso em desenvolvimento')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#007AFF',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  termos de uso
                </button>
                {' '}e{' '}
                <button
                  type="button"
                  onClick={() => alert('Política de privacidade em desenvolvimento')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#007AFF',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  política de privacidade
                </button>
              </span>
            </label>
            {errors.terms && (
              <p style={{
                color: '#FF3B30',
                fontSize: '14px',
                margin: '4px 0 0 0'
              }}>{errors.terms}</p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            style={{
              width: '100%',
              backgroundColor: (!isFormValid || loading) ? '#A9D3FF' : '#007AFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: (!isFormValid || loading) ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          {/* Login Link */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '16px', color: '#333' }}>
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007AFF',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Faça login
              </button>
            </span>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 480px) {
          .register-container {
            padding: 16px;
          }
          
          .register-form {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterScreenWeb;

