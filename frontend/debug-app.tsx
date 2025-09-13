import React from 'react';

export default function DebugApp() {
  console.log('DebugApp rendering...');
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#007AFF' }}>GiroPro Debug</h1>
      <p>Se você está vendo isso, o React está funcionando!</p>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Status do Sistema</h2>
        <ul>
          <li>✅ React carregado</li>
          <li>✅ Componente renderizado</li>
          <li>✅ Estilos aplicados</li>
        </ul>
      </div>
    </div>
  );
}

