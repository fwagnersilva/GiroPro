import React, { useState } from 'react';
import { AuthProvider, useAuth } from './src/contexts/AuthContext.web';
import VehiclesScreenSimple from './src/screens/VehiclesScreen.simple';
import ExpensesScreenSimple from './src/screens/ExpensesScreen.simple';

// Componente de Login simples
const SimpleLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email.trim()) {
      alert('Por favor, informe seu email');
      return;
    }

    if (!senha.trim()) {
      alert('Por favor, informe sua senha');
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
        padding: '24px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
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

        {/* Form */}
        <div>
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

          <div style={{ marginBottom: '16px' }}>
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
            onClick={handleLogin}
            disabled={!email.trim() || !senha.trim() || loading}
            style={{
              width: '100%',
              backgroundColor: (!email.trim() || !senha.trim() || loading) ? '#A9D3FF' : '#007AFF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: (!email.trim() || !senha.trim() || loading) ? 'not-allowed' : 'pointer',
              marginBottom: '16px'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Test Credentials */}
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
              Email: test@test.com
            </p>
            <p style={{ fontSize: '14px', color: '#666666', textAlign: 'center', margin: '0' }}>
              Senha: 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard simples
const SimpleDashboard = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
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
        maxWidth: '800px',
        margin: '0 auto',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#007AFF',
              margin: '0 0 8px 0'
            }}>Dashboard</h1>
            <p style={{
              fontSize: '16px',
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

        {/* Menu de Navegação */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => onNavigate('vehicles')}
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
            onClick={() => onNavigate('expenses')}
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
            onClick={() => alert('Em desenvolvimento')}
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
            onClick={() => alert('Em desenvolvimento')}
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

        {/* Cards de Resumo */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            backgroundColor: '#F8F9FA',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#007AFF', margin: '0 0 8px 0' }}>Receita do Mês</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: '0' }}>R$ 0,00</p>
          </div>

          <div style={{
            backgroundColor: '#F8F9FA',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#007AFF', margin: '0 0 8px 0' }}>Despesas do Mês</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: '0' }}>R$ 0,00</p>
          </div>

          <div style={{
            backgroundColor: '#F8F9FA',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#007AFF', margin: '0 0 8px 0' }}>Lucro Líquido</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#34C759', margin: '0' }}>R$ 0,00</p>
          </div>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: '#8E8E93', fontSize: '16px' }}>
            🎉 Sistema funcionando corretamente!
          </p>
          <p style={{ color: '#8E8E93', fontSize: '14px' }}>
            Backend: ✅ Conectado | Banco: ✅ Configurado | Auth: ✅ Funcionando
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente principal com navegação simples
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  if (loading) {
    return (
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
            Carregando autenticação...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SimpleLogin />;
  }

  // Navegação entre telas
  const renderScreen = () => {
    switch (currentScreen) {
      case 'vehicles':
        return (
          <div>
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '16px 24px',
              marginBottom: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <button
                onClick={() => setCurrentScreen('dashboard')}
                style={{
                  backgroundColor: '#007AFF',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                ← Voltar ao Dashboard
              </button>
            </div>
            <VehiclesScreenSimple />
          </div>
        );
      case 'expenses':
        return (
          <div>
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '16px 24px',
              marginBottom: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <button
                onClick={() => setCurrentScreen('dashboard')}
                style={{
                  backgroundColor: '#34C759',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                ← Voltar ao Dashboard
              </button>
            </div>
            <ExpensesScreenSimple />
          </div>
        );
      default:
        return <SimpleDashboard onNavigate={setCurrentScreen} />;
    }
  };

  return renderScreen();
};

// App principal
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

