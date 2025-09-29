import React from 'react';
import { Stack } from 'expo-router';
import ProtectedRoute from '../../src/components/ProtectedRoute';

export default function AuthLayout() {
  return (
    <ProtectedRoute>
      <Stack>
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      </Stack>
    </ProtectedRoute>
  );
}


