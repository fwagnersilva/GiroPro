import React from 'react';

export default function SimpleTest() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#007AFF' }}>GiroPro - Teste React</h1>
      <p>Se você está vendo isso, o React está funcionando!</p>
      <button 
        onClick={() => alert('React funcionando!')}
        style={{
          backgroundColor: '#007AFF',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Teste React
      </button>
    </div>
  );
}

