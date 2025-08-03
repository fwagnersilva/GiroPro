module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // O plugin do Reanimated DEVE ser o último da lista de plugins.
      'react-native-reanimated/plugin',
    ],
  };
};
