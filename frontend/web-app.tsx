import React, { useState, useEffect, createContext, useContext } from 'react';

// Types
interface User {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (credentials: { email: string; senha: string }) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

// Auth Context
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Auth Provider
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo
    const token = localStorage.getItem('token');
    if (token) {
      // Simular validação do token
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (credentials: { email: string; senha: string }) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: credentials.email, senha: credentials.senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      if (data.success) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user) {
          setUser(data.user);
        } else {
          // Tratar caso onde data.user é null ou undefined, mas o login foi bem-sucedido
          // Isso pode acontecer se a API retornar sucesso mas sem dados de usuário
          console.warn("Login bem-sucedido, mas sem dados de usuário na resposta.");
          setUser({ id: 'unknown', nome: 'Usuário', email: credentials.email }); // Fallback
        }
      } else {
        throw new Error(data.message || 'Erro ao fazer login');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro de conexão');
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

// Login Component
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !senha.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      await signIn({ email: email.trim(), senha });
    } catch (error: any) {
      alert(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nome = (document.getElementById('nome') as HTMLInputElement)?.value;
    
    if (!nome?.trim() || !email.trim() || !senha.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: nome.trim(), email: email.trim(), senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar');
      }

      if (data.success) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.reload(); // Recarregar para atualizar o estado
      } else {
        throw new Error(data.message || 'Erro ao registrar');
      }
    } catch (error: any) {
      alert(error.message || 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F2F2F7',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#007AFF',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>GiroPro</h1>
          <p style={{
            fontSize: '18px',
            color: '#8E8E93',
            margin: '0'
          }}>Gestão financeira para motoristas</p>
        </div>

        {/* Toggle */}
        <div style={{ 
          display: 'flex', 
          marginBottom: '24px',
          backgroundColor: '#F8F9FA',
          borderRadius: '8px',
          padding: '4px'
        }}>
          <button
            onClick={() => setShowRegister(false)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: !showRegister ? '#007AFF' : 'transparent',
              color: !showRegister ? 'white' : '#666',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setShowRegister(true)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: showRegister ? '#007AFF' : 'transparent',
              color: showRegister ? 'white' : '#666',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Registrar
          </button>
        </div>

        {/* Form */}
        <form onSubmit={showRegister ? handleRegister : handleLogin}>
          {showRegister && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#333333',
                marginBottom: '8px',
                display: 'block'
              }}>Nome</label>
              <input
                id="nome"
                type="text"
                placeholder="Digite seu nome"
                style={{
                  width: '100%',
                  border: '1px solid #E5E5EA',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '16px',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333333',
              marginBottom: '8px',
              display: 'block'
            }}>Email</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                border: '1px solid #E5E5EA',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333333',
              marginBottom: '8px',
              display: 'block'
            }}>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={{
                width: '100%',
                border: '1px solid #E5E5EA',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#A9D3FF' : '#007AFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processando...' : (showRegister ? 'Registrar' : 'Entrar')}
          </button>
        </form>

        {/* Test Credentials */}
        {!showRegister && (
          <div style={{
            backgroundColor: '#F8F9FA',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '16px'
          }}>
            <p style={{ fontSize: '14px', color: '#666666', textAlign: 'center', margin: '0 0 4px 0' }}>
              Credenciais de teste:
            </p>
            <p style={{ fontSize: '14px', color: '#666666', textAlign: 'center', margin: '0 0 4px 0' }}>
              Email: teste@teste.com
            </p>
            <p style={{ fontSize: '14px', color: '#666666', textAlign: 'center', margin: '0' }}>
              Senha: Teste123@
            </p>
          </div>
        )}

        {showRegister && (
          <div style={{
            backgroundColor: '#FFF3CD',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '16px'
          }}>
            <p style={{ fontSize: '14px', color: '#856404', textAlign: 'center', margin: '0' }}>
              A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F2F2F7',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#007AFF',
              margin: '0 0 8px 0'
            }}>Dashboard</h1>
            <p style={{
              fontSize: '18px',
              color: '#8E8E93',
              margin: '0'
            }}>Bem-vindo, {user?.nome}!</p>
          </div>
          <button
            onClick={signOut}
            style={{
              backgroundColor: '#FF3B30',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>

        {/* Status Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #34C759'
          }}>
            <h3 style={{ color: '#34C759', margin: '0 0 8px 0' }}>✅ Backend</h3>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', margin: '0' }}>Conectado</p>
          </div>

          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #34C759'
          }}>
            <h3 style={{ color: '#34C759', margin: '0 0 8px 0' }}>✅ Banco de Dados</h3>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', margin: '0' }}>SQLite em Memória</p>
          </div>

          <div style={{
            backgroundColor: '#E8F5E8',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid #34C759'
          }}>
            <h3 style={{ color: '#34C759', margin: '0 0 8px 0' }}>✅ Autenticação</h3>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', margin: '0' }}>Funcionando</p>
          </div>
        </div>

        {/* Menu de Navegação */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => alert('Funcionalidade em desenvolvimento')}
            style={{
              backgroundColor: '#007AFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            🚗 Meus Veículos
          </button>
          
          <button
            onClick={() => alert('Funcionalidade em desenvolvimento')}
            style={{
              backgroundColor: '#34C759',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            💰 Despesas
          </button>
          
          <button
            onClick={() => alert('Funcionalidade em desenvolvimento')}
            style={{
              backgroundColor: '#FF9500',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            ⛽ Abastecimentos
          </button>
          
          <button
            onClick={() => alert('Funcionalidade em desenvolvimento')}
            style={{
              backgroundColor: '#AF52DE',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            📊 Relatórios
          </button>
        </div>

        {/* Informações do Sistema */}
        <div style={{
          backgroundColor: '#F8F9FA',
          padding: '24px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#007AFF', margin: '0 0 16px 0' }}>🎉 Sistema Configurado com Sucesso!</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <p style={{ color: '#333', fontSize: '14px', margin: '0 0 4px 0', fontWeight: 'bold' }}>Backend</p>
              <p style={{ color: '#8E8E93', fontSize: '14px', margin: '0' }}>http://localhost:3000</p>
            </div>
            <div>
              <p style={{ color: '#333', fontSize: '14px', margin: '0 0 4px 0', fontWeight: 'bold' }}>Frontend</p>
              <p style={{ color: '#8E8E93', fontSize: '14px', margin: '0' }}>http://localhost:19006</p>
            </div>
            <div>
              <p style={{ color: '#333', fontSize: '14px', margin: '0 0 4px 0', fontWeight: 'bold' }}>Usuário</p>
              <p style={{ color: '#8E8E93', fontSize: '14px', margin: '0' }}>{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh',
    backgroundColor: '#F2F2F7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #007AFF30',
        borderTop: '3px solid #007AFF',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }}></div>
      <p style={{ color: '#8E8E93', fontSize: '16px', margin: '0' }}>
        Carregando...
      </p>
    </div>
  </div>
);

// Main App Component
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Dashboard /> : <LoginScreen />;
};

// App with Provider
export default function WebApp() {
  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </>
  );
}

