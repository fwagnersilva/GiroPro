import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'GiroPro',
  slug: 'giropro',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro'
  },
  plugins: []  // Sem plugins para web
};

export default config;
