/* eslint-disable react/no-unstable-nested-components */
import { Link, Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';

import { Pressable, Text, View } from '@/components/ui';
import {
  Feed as FeedIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
} from '@/components/ui/icons';
import { useAuth, useIsFirstTime } from '@/lib';
import { Sidebar } from '@/components/Sidebar'; // Importar o componente Sidebar

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar a visibilidade do Sidebar

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

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === 'signOut') {
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
              <Text>☰</Text> {/* Ícone de hambúrguer */}
            </Pressable>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <FeedIcon color={color} />,
            headerRight: () => <CreateNewPostLink />,
            tabBarButtonTestID: 'dashboard-tab',
          }}
        />

        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <FeedIcon color={color} />,
            headerShown: false,
            tabBarButtonTestID: 'dashboard-tab-alt',
          }}
        />

        <Tabs.Screen
          name="vehicles"
          options={{
            title: 'Veículos',
            headerShown: false,
            tabBarIcon: ({ color }) => <FeedIcon color={color} />,
            tabBarButtonTestID: 'vehicles-tab',
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
            tabBarIcon: ({ color }) => <FeedIcon color={color} />,
            tabBarButtonTestID: 'expenses-tab',
          }}
        />
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
          name="style"
          options={{
            title: 'Style',
            headerShown: false,
            tabBarIcon: ({ color }) => <StyleIcon color={color} />,
            tabBarButtonTestID: 'style-tab',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            headerShown: false,
            tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
            tabBarButtonTestID: 'profile-tab',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            headerShown: false,
            tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
            tabBarButtonTestID: 'settings-tab',
          }}
        />
      </Tabs>
    </View>
  );
}

const CreateNewPostLink = () => {
  return (
    <Link href="/feed/add-post" asChild>
      <Pressable>
        <Text className="px-3 text-primary-300">Create</Text>
      </Pressable>
    </Link>
  );
};
