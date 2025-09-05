import React from 'react';

export default function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#F2F2F7',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          GiroPro - Gestão Financeira
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Sistema funcionando! Frontend conectado.
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <input 
            type="email" 
            placeholder="Email"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '10px',
              fontSize: '16px'
            }}
          />
          <input 
            type="password" 
            placeholder="Senha"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '16px'
            }}
          />
          <button 
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onClick={() => alert('Login funcionando!')}
          >
            Entrar
          </button>
        </div>
        
        <p style={{ color: '#999', fontSize: '14px' }}>
          Backend: http://localhost:3000 ✅<br/>
          Frontend: http://localhost:19006 ✅
        </p>
      </div>
    </div>
  );
}

