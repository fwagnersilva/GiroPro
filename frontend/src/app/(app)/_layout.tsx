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
          headerLeft: ({ canGoBack }) => (
            <Pressable onPress={toggleSidebar} style={{ marginLeft: 15 }}>
              <Text style={{ fontSize: 24 }}>☰</Text>
            </Pressable>
          ),
          headerShown: true,
        }}
      >
        <Tabs.Screen
          name="trips"
          options={{
            title: 'Jornadas',
            tabBarIcon: ({ color }) => <FeedIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="fuelings"
          options={{
            title: 'Abastecimentos',
            tabBarIcon: ({ color }) => <FeedIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: 'Despesas',
            tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          }}
        />
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="activities" options={{ href: null }} />
        <Tabs.Screen name="dashboard" options={{ href: null }} />
        <Tabs.Screen name="dashboard-backup" options={{ href: null }} />
        <Tabs.Screen name="vehicles" options={{ href: null }} />
        <Tabs.Screen name="style" options={{ href: null }} />
        <Tabs.Screen name="profile" options={{ href: null }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="edit-expense" options={{ href: null }} />
        <Tabs.Screen name="edit-fueling" options={{ href: null }} />
        <Tabs.Screen name="edit-vehicle" options={{ href: null }} />
      </Tabs>
    </View>
  );
}
