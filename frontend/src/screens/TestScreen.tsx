import React from 'react';

const TestScreen: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F2F2F7',
      padding: '24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#34C759', marginBottom: '16px' }}>
          Teste de Componente
        </h1>
        <p style={{ color: '#333' }}>
          Se você está vendo esta mensagem, o componente está funcionando!
        </p>
      </div>
    </div>
  );
};

export default TestScreen;

