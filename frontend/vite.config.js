import { defineConfig } from 'vite';
import { rnw } from 'vite-plugin-rnw';

// Módulos que precisam ser transpilados
const modulesToTranspile = [
  'react-native',
  '@react-native',
  'expo',
  '@expo',
  '@react-navigation',
  '@tanstack'
];

const exclude = new RegExp(`/node_modules/(?!${modulesToTranspile.join('|')})`);

export default defineConfig({
  plugins: [
    rnw({ 
      exclude,
      // Configurações específicas para o projeto
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
          '.ts': 'tsx',
          '.tsx': 'tsx'
        }
      }
    })
  ],
  server: {
    port: 19006,
    host: true,
    allowedHosts: ["19006-i7hahpvmfuj1sd6yj17bl-9f1fa913.manusvm.computer"],
    hmr: {
      overlay: false
    }
  },
  define: {
    global: 'globalThis',
    __DEV__: JSON.stringify(true),
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
});

