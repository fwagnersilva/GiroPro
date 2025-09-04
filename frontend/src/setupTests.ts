import React from 'react';
import { Alert } from 'react-native';

// Mock do __DEV__ globalmente para o ambiente de testes
(global as any).__DEV__ = true;

// Mock para expo-modules-core e expo-font
jest.mock('expo-modules-core', () => ({
  NativeModulesProxy: {},
  requireNativeViewManager: jest.fn(),
}));

jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true, null]),
  loadAsync: jest.fn(),
}));

// Mock para react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock para react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Icon',
  MaterialIcons: 'Icon',
  FontAwesome: 'Icon',
  AntDesign: 'Icon',
  Entypo: 'Icon',
  EvilIcons: 'Icon',
  Feather: 'Icon',
  Foundation: 'Icon',
  MaterialCommunityIcons: 'Icon',
  Octicons: 'Icon',
  SimpleLineIcons: 'Icon',
  Zocial: 'Icon',
}));

// Mock para react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: { UNDETERMINED: 0, FAILED: 1, BEGAN: 2, CANCELLED: 3, ACTIVE: 4, END: 5 },
    Directions: { RIGHT: 1, LEFT: 2, UP: 4, DOWN: 8 },
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    FlingGestureHandler: View,
    TapGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    TouchableWithoutFeedback: View,
    TouchableOpacity: View,
    TouchableHighlight: View,
    TouchableNativeFeedback: View,
    ContinousBaseGesture: View,
    GestureFeature: View,
    TapGesture: View,
    PanGesture: View,
    PinchGesture: View,
    RotationGesture: View,
    FlingGesture: View,
    LongPressGesture: View,
    ForceTouchGesture: View,
    NativeViewGesture: View,
    NativeGesture: View,
    GestureDetector: View,
    Gesture: View,
    default: {},
  };
});

// Mock para react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = (fn: any) => fn();
  return Reanimated;
});

// Mock para @react-native-community/checkbox
jest.mock('@react-native-community/checkbox', () => 'Checkbox');

// Mock para @react-native-masked-text/mask
jest.mock('@react-native-masked-text/mask', () => 'MaskedTextInput');

// Mock para @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// Mock para @react-native-picker/picker
jest.mock('@react-native-picker/picker', () => ({
  Picker: 'Picker',
  PickerIOS: 'PickerIOS',
}));

// Mock para expo-linking
jest.mock('expo-linking', () => ({
  getInitialURL: jest.fn(() => Promise.resolve(null)),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  openURL: jest.fn(),
}));

// Mock para expo-status-bar
jest.mock('expo-status-bar', () => 'StatusBar');

// Mock para react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  Screen: 'Screen',
  ScreenContainer: 'ScreenContainer',
  ScreenStack: 'ScreenStack',
  ScreenStackHeaderConfig: 'ScreenStackHeaderConfig',
  ScreenStackHeaderSubview: 'ScreenStackHeaderSubview',
  ScreenStackHeaderRightView: 'ScreenStackHeaderRightView',
  ScreenStackHeaderLeftView: 'ScreenStackHeaderLeftView',
  ScreenStackHeaderCenterView: 'ScreenStackHeaderCenterView',
  ScreenStackHeaderBackButtonImage: 'ScreenStackHeaderBackButtonImage',
  ScreenStackHeaderConfig: 'ScreenStackHeaderConfig',
  ScreenStackHeaderSearchBar: 'ScreenStackHeaderSearchBar',
  ScreenStackHeaderTitleView: 'ScreenStackHeaderTitleView',
  ScreenStackHeaderLeftView: 'ScreenStackHeaderLeftView',
  ScreenStackHeaderRightView: 'ScreenStackHeaderRightView',
  ScreenStackHeaderCenterView: 'ScreenStackHeaderCenterView',
  ScreenStackHeaderBackButtonImage: 'ScreenStackHeaderBackButtonImage',
  ScreenStackHeaderConfig: 'ScreenStackHeaderConfig',
  ScreenStackHeaderSearchBar: 'ScreenStackHeaderSearchBar',
  ScreenStackHeaderTitleView: 'ScreenStackHeaderTitleView',
}));

// Mock para @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
  };
});

// Mock para @react-navigation/stack
jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
  }),
}));

// Mock para @react-navigation/bottom-tabs
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
  }),
}));

// Mock para axios
jest.mock('axios');

// Mock para @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  QueryClient: jest.fn().mockImplementation(() => ({
    defaultOptions: { queries: { staleTime: Infinity } },
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock do Alert do React Native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
  };
});


