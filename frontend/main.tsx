import React from 'react';
import { createRoot } from 'react-dom/client';
import WebAppSimple from './web-app-simple';

console.log('main.tsx loading...');

const container = document.getElementById('root');
if (container) {
  console.log('Root container found, creating React root...');
  const root = createRoot(container);
  root.render(React.createElement(WebAppSimple));
  console.log('React app rendered');
} else {
  console.error('Root container not found');
}


