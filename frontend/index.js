// Polyfill para expo-system-ui no web
if (typeof window !== 'undefined') {
  if (!window.expo) {
    console.log("window.expo is undefined. Initializing.");
    window.expo = {};
  }
  if (!window.expo.modules) {
    console.log("window.expo.modules is undefined. Initializing.");
    window.expo.modules = {};
  }
    if (!window.expo.modules.ExpoSystemUI) {
    console.log("window.expo.modules.ExpoSystemUI is undefined. Initializing polyfill.");
    window.expo.modules.ExpoSystemUI = {
      getEnforcing: () => false,
      setEnforcing: () => {},
    };
  }
}

import 'expo-router/entry';

