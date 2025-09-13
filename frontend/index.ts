import React from 'react';
import { createRoot } from 'react-dom/client';
import WebApp from './web-app';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(React.createElement(WebApp));
} else {
  console.error('Root container not found');
}
