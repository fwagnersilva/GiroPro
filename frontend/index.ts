import React from 'react';
import { createRoot } from 'react-dom/client';
import WebAppImproved from './web-app-improved';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(React.createElement(WebAppImproved));
} else {
  console.error('Root container not found');
}
