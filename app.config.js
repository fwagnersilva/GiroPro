// Detectar ambiente
const isDev = process.env.APP_ENV !== 'production';
const isStaging = process.env.APP_ENV === 'staging';

// Importar ClientEnv do arquivo de ambiente do frontend
const { ClientEnv } = require('./frontend/env.js');

// Escolher ícones baseado no ambiente
const getIcon = () => {
  if (isDev || isStaging) {
    return './assets/icon-badged.png';
  }
  return './assets/icon.png';
};

const getAdaptiveIcon = () => {
  if (isDev || isStaging) {
    return './assets/adaptive-icon-badged.png';
  }
  return './assets/adaptive-icon.png';
};

const getFavicon = () => {
  if (isDev || isStaging) {
    return './assets/favicon-badged.png';
  }
  return './assets/favicon.png';
};

export default {
  expo: {
    name: "GiroPro",
    slug: "giropro",
    version: "1.0.0",
    orientation: "portrait",
    icon: getIcon(),
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: getAdaptiveIcon(),
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: getFavicon(),
      bundler: "metro"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#ffffff"
        }
      ]
    ],
    scheme: "giropro",
    extra: ClientEnv, // Adicionar ClientEnv ao campo extra
  }
}

