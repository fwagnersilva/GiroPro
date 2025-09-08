import React from 'react';

const LoadingScreenWeb: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#F2F2F7',
      color: '#007AFF',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      <div style={{
        border: '8px solid #f3f3f3',
        borderTop: '8px solid #007AFF',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }}></div>
      <p>Carregando...</p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreenWeb;

