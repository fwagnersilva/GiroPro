import React from 'react';

export default function App() {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>GiroPro - Frontend Funcionando!</h1>
      <p>✅ React carregado com sucesso</p>
      <p>✅ Vite funcionando</p>
      <p>✅ Servidor rodando na porta 19006</p>
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e8f5e8',
        border: '1px solid #4caf50',
        borderRadius: '5px'
      }}>
        <strong>Status:</strong> Frontend básico operacional
      </div>
    </div>
  );
}

