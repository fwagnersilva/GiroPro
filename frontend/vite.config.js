import { defineConfig } from 'vite';
import { rnw } from 'vite-plugin-rnw';

// Módulos que precisam ser transpilados
const modulesToTranspile = [
  'react-native',
  '@react-native',
  'expo',
  '@expo',
  '@react-navigation',
  '@tanstack',
  'react-native-web'
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
    port: 19007,
    host: true,
    allowedHosts: ["19006-i7hahpvmfuj1sd6yj17bl-9f1fa913.manusvm.computer", "19007-ici93yk0xm713pjc67kgx-27a5c35b.manusvm.computer", "19007-iu2lvucya34juamgspm4w-f303e2dc.manusvm.computer", "19007-ioknwv3ijxjm4y4hf4j45-0e6da990.manusvm.computer", "19007-iv4csq17cc7cohunonba4-778f6f34.manusvm.computer"],
    hmr: {
      overlay: false
    }
  },
  define: {
    global: 'globalThis',
    __DEV__: JSON.stringify(true),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VITE_API_URL': JSON.stringify('http://localhost:3000'),
  },
});

