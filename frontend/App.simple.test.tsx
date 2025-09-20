import React from 'react';

export default function SimpleApp() {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#007AFF', fontSize: '48px', marginBottom: '20px' }}>
        GiroPro
      </h1>
      <p style={{ fontSize: '24px', color: '#333' }}>
        Teste de Renderização React
      </p>
      <p style={{ fontSize: '18px', color: '#666', marginTop: '20px' }}>
        Se você está vendo esta mensagem, o React está funcionando!
      </p>
      <button 
        style={{
          backgroundColor: '#007AFF',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
        onClick={() => alert('Botão funcionando!')}
      >
        Testar Interação
      </button>
    </div>
  );
}

