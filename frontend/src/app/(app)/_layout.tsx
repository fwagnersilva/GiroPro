/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';

import { Pressable, Text, View } from '@/components/ui';
import {
  Feed as FeedIcon,
  Settings as SettingsIcon,
} from '@/components/ui/icons';
import { useAuth, useIsFirstTime } from '@/lib';
import { Sidebar } from '@/components/Sidebar';

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  // if (isFirstTime) {
  //   return <Redirect href="/onboarding" />;
  // }

  if (status === 'signOut' || status === 'idle') {
    return <Redirect href="/login" />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <View style={{ flex: 1 }}>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <Tabs
        screenOptions={{
          headerLeft: () => (
            <Pressable onPress={toggleSidebar} style={{ marginLeft: 15 }}>
              <Text style={{ fontSize: 24 }}>☰</Text>
            </Pressable>
          ),
        }}
      >
        {/* Apenas 3 tabs principais no menu inferior */}
        <Tabs.Screen
          name="trips"
          options={{
            title: 'Jornadas',
            headerShown: false,
            tabBarIcon: ({ color }) => <FeedIcon color={color} />,
            tabBarButtonTestID: 'trips-tab',
          }}
        />
        <Tabs.Screen
          name="fuelings"
          options={{
            title: 'Abastecimentos',
            headerShown: false,
            tabBarIcon: ({ color }) => <FeedIcon color={color} />,
            tabBarButtonTestID: 'fuelings-tab',
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: 'Despesas',
            headerShown: false,
            tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
            tabBarButtonTestID: 'expenses-tab',
          }}
        />

        {/* Ocultar outras telas da tab bar, mas manter acessíveis via navegação */}
        <Tabs.Screen
          name="index"
          options={{
            href: null, // Remove da tab bar
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="vehicles"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="style"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}