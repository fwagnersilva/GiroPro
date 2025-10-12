import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'GiroPro',
  description: 'GiroPro - Gestão Financeira para Motoristas',
  scheme: 'giropro',
  slug: 'giropro',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.giropro.app',
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.giropro.app',
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
    output: 'static',
  },
  plugins: [
    'expo-font',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#ffffff',
        image: './assets/splash-icon.png',
        imageWidth: 150,
      },
    ],
    'expo-localization',
    'expo-router',
  ],
  extra: {
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://giropro-backend.onrender.com/api/v1',
  },
});