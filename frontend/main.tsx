import React from 'react';
import { createRoot } from 'react-dom/client';
import WebApp from './NewLoginScreen';

console.log('main.tsx loading...');

const container = document.getElementById('root');
if (container) {
  console.log('Root container found, creating React root...');
  const root = createRoot(container);
  root.render(React.createElement(WebApp));
  console.log('React app rendered');
} else {
  console.error('Root container not found');
}


