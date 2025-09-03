const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configurações para resolver problemas de compatibilidade
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configurações de transformação mais permissivas
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

// Configurações de serialização simplificadas
config.serializer = {
  ...config.serializer,
  customSerializer: undefined,
};

module.exports = config;

