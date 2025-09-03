  plugins: [
    react({
      jsxRuntime: 'automatic',
      include: '**/*.{jsx,tsx,js,ts}',
    }),
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native/Libraries/ReactNative/AppContainer': 'react-native-web/dist/exports/AppRegistry',
      'react-native/Libraries/Utilities/codegenNativeComponent': resolve(__dirname, 'src/utils/mockNativeComponent.js'),
      'react-native/Libraries/Utilities/codegenNativeCommands': resolve(__dirname, 'src/utils/mockNativeCommands.js'),
      '@': resolve(__dirname, './src'),
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
  define: {
    global: 'globalThis',
    __DEV__: JSON.stringify(true),
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
  server: {
    port: 19006,
    host: '0.0.0.0',
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-native-web',
      '@react-native-async-storage/async-storage',
      'axios'
    ],
    exclude: [
      '@expo/vector-icons',
      'react-native-screens',
      'react-native-safe-area-context'
    ],
  },
});