/* eslint-disable max-lines-per-function */
import type { ConfigContext, ExpoConfig } from '@expo/config';

import { ClientEnv, Env } from './env';

// Função para escolher ícones com badge baseado no ambiente
const getIcon = () => {
  return Env.APP_ENV !== 'production' 
    ? './assets/icon-badged.png' 
    : './assets/icon.png';
};

const getAdaptiveIcon = () => {
  return Env.APP_ENV !== 'production' 
    ? './assets/adaptive-icon-badged.png' 
    : './assets/adaptive-icon.png';
};

const getFavicon = () => {
  return Env.APP_ENV !== 'production' 
    ? './assets/favicon-badged.png' 
    : './assets/favicon.png';
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.NAME,
  description: `${Env.NAME} Mobile App`,
  owner: Env.EXPO_ACCOUNT_OWNER,
  scheme: Env.SCHEME,
  slug: 'obytesapp',
  version: Env.VERSION.toString(),
  orientation: 'portrait',
  icon: getIcon(),
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: Env.BUNDLE_ID,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: getAdaptiveIcon(),
      backgroundColor: '#2E3C4B',
    },
    package: Env.PACKAGE,
  },
  web: {
    favicon: getFavicon(),
    bundler: 'metro',
  },
  plugins: [
    'expo-font',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#2E3C4B',
        image: './assets/splash-icon.png',
        imageWidth: 150,
      },
    ],
    'expo-localization',
    'expo-router',
    ['react-native-edge-to-edge'],
  ],
  extra: {
    ...ClientEnv,
    eas: {
      projectId: Env.EAS_PROJECT_ID,
    },
  },
});