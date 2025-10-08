// Polyfill para expo-system-ui no web
if (typeof window !== 'undefined') {
  if (!window.expo) {
    window.expo = {};
  }
  if (!window.expo.modules) {
    window.expo.modules = {};
  }
  if (!window.expo.modules.ExpoSystemUI) {
    window.expo.modules.ExpoSystemUI = {
      getEnforcing: () => false,
      setEnforcing: () => {},
    };
  }
}

import 'expo-router/entry';