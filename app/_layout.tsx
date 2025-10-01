import { Stack } from 'expo-router';
import { NativeWindStyleSheet } from 'nativewind';
import { AuthProvider } from '../src/contexts/AuthContext';
import { ToastProvider } from '../src/components/ToastNotification';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

export default function Layout() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </ToastProvider>
  );
}
