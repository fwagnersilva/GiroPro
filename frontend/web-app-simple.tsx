import React, { useState, useEffect, useContext, createContext } from 'react';

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
    console.log('AuthProvider useEffect running...');
    // Verificar se há token salvo
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('Token found:', !!token);
    console.log('User data found:', !!userData);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Setting user:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
    console.log('AuthProvider loading set to false');
  }, []);

  const signIn = async (credentials: { email: string; senha: string }) => {
    console.log('SignIn called with:', credentials.email);
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: credentials.email, senha: credentials.senha }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      if (data.success) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        console.log('User set after login:', data.user);
      } else {
        throw new Error(data.message || 'Erro ao fazer login');
      }
    } catch (error: any) {
      console.error('SignIn error:', error);
      throw new Error(error.message || 'Erro de conexão');
    }
  };

  const signOut = () => {
    console.log('SignOut called');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const contextValue = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  console.log('AuthProvider context value:', contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
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

// Simple Login Component
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  console.log('LoginScreen rendered');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleLogin called');
    
    if (!email.trim() || !senha.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      console.log('Calling signIn...');
      await signIn({ email: email.trim(), senha });
      console.log('SignIn completed successfully');
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#007AFF',
          textAlign: 'center',
          marginBottom: '8px'
        }}>GiroPro</h1>
        
        <p style={{
          fontSize: '16px',
          color: '#8E8E93',
          textAlign: 'center',
          marginBottom: '32px'
        }}>Gestão financeira para motoristas</p>

        <form onSubmit={handleLogin}>
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
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{
          backgroundColor: '#E3F2FD',
          padding: '16px',
          borderRadius: '8px',
          marginTop: '24px'
        }}>
          <p style={{ fontSize: '14px', color: '#1976D2', textAlign: 'center', margin: '0' }}>
            <strong>Credenciais de teste:</strong><br />
            Email: teste@teste.com<br />
            Senha: Teste123@
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple Dashboard Component
const Dashboard = () => {
  const { user, signOut } = useAuth();

  console.log('Dashboard rendered with user:', user);

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
        maxWidth: '800px',
        margin: '0 auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
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

        <div style={{
          backgroundColor: '#E8F5E8',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px solid #34C759'
        }}>
          <h3 style={{ color: '#34C759', margin: '0 0 8px 0' }}>✅ Sistema Funcionando</h3>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', margin: '0' }}>
            Dashboard carregado com sucesso!
          </p>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingScreen = () => {
  console.log('LoadingScreen rendered');
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F2F2F7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        textAlign: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #E5E5EA',
          borderTop: '4px solid #007AFF',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{
          fontSize: '16px',
          color: '#8E8E93'
        }}>Carregando...</p>
      </div>
    </div>
  );
};

// App Content
const AppContent = () => {
  const { loading, isAuthenticated } = useAuth();

  console.log('AppContent rendered - loading:', loading, 'isAuthenticated:', isAuthenticated);

  if (loading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Dashboard /> : <LoginScreen />;
};

// Main App Component
export default function WebAppSimple() {
  console.log('WebAppSimple rendered');
  
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

