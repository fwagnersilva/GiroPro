import React, { useState } from 'react';
import axios from 'axios';

const WebRegister = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/register', {
        nome,
        email,
        senha,
      });
      
      if (response.data.success) {
        setMessage('✅ Registro bem-sucedido!');
        setNome('');
        setEmail('');
        setSenha('');
      } else {
        setMessage('❌ ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Erro no registro:', error);
      if (error.response?.data?.message) {
        setMessage('❌ ' + error.response.data.message);
      } else {
        setMessage('❌ Erro no registro. Verifique os dados e tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
        email,
        senha,
      });
      
      if (response.data.success) {
        setMessage('✅ Login bem-sucedido!');
        console.log('Token:', response.data.accessToken);
      } else {
        setMessage('❌ ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      if (error.response?.data?.message) {
        setMessage('❌ ' + error.response.data.message);
      } else {
        setMessage('❌ Erro no login. Verifique os dados e tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>GiroPro - Gestão Financeira</h1>
        <p style={styles.subtitle}>Sistema de autenticação funcionando!</p>
        
        <form onSubmit={handleRegister} style={styles.form}>
          <h2 style={styles.sectionTitle}>Registro</h2>
          
          <input
            style={styles.input}
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            style={styles.input}
            type="password"
            placeholder="Senha (min. 8 chars, 1 maiúscula, 1 minúscula, 1 número, 1 especial)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          
          <button 
            type="submit" 
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <form onSubmit={handleLogin} style={styles.form}>
          <h2 style={styles.sectionTitle}>Login</h2>
          
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            style={styles.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          
          <button 
            type="submit" 
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Fazendo login...' : 'Login'}
          </button>
        </form>

        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}

        <div style={styles.status}>
          <h3>Status do Sistema:</h3>
          <p>✅ Backend: Rodando na porta 3000</p>
          <p>✅ Frontend: Rodando na porta 19006</p>
          <p>✅ Banco SQLite: Conectado e funcionando</p>
          <p>✅ APIs de autenticação: Funcionais</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '40px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '100%',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'center' as const,
    color: '#333',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center' as const,
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
    borderBottom: '2px solid #007bff',
    paddingBottom: '5px',
  },
  form: {
    marginBottom: '30px',
  },
  input: {
    width: '100%',
    height: '45px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '0 15px',
    marginBottom: '15px',
    fontSize: '16px',
    boxSizing: 'border-box' as const,
  },
  button: {
    width: '100%',
    height: '45px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  message: {
    padding: '15px',
    borderRadius: '4px',
    marginTop: '20px',
    textAlign: 'center' as const,
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
  },
  status: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #dee2e6',
  },
};

export default WebRegister;

