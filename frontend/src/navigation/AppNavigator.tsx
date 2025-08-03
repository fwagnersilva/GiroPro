import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';

// Importar telas (serão criadas em seguida)
import LoginScreenOptimized from '../screens/LoginScreenOptimized';
import RegisterScreenOptimized from "../screens/RegisterScreenOptimized";
import DashboardScreenOptimized from '../screens/DashboardScreenOptimized';
import VehiclesScreenOptimized from '../screens/VehiclesScreenOptimized';
import JourneysScreenOptimized from '../screens/JourneysScreenOptimized';
import FuelingsScreenOptimized from '../screens/FuelingsScreenOptimized';
import ExpensesScreenOptimized from '../screens/ExpensesScreenOptimized';
import GoalsScreenOptimized from "../screens/GoalsScreenOptimized";
import AchievementsScreenOptimized from "../screens/AchievementsScreenOptimized";
import ProfileScreenOptimized from "../screens/ProfileScreenOptimized";
import LoadingScreen from '../screens/LoadingScreen';

import { RootStackParamList } from '../types';

import AddExpenseScreenOptimized from "../screens/AddExpenseScreenOptimized";

import AddFuelingScreenOptimized from "../screens/AddFuelingScreenOptimized";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreenOptimized} />
    <Stack.Screen name="Register" component={RegisterScreenOptimized} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: true,
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
      },
    }}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreenOptimized}
      options={{
        title: 'Dashboard',
        tabBarLabel: 'Início',
      }}
    />
    <Tab.Screen 
      name="Vehicles" 
      component={VehiclesScreenOptimized}
      options={{
        title: 'Veículos',
        tabBarLabel: 'Veículos',
      }}
    />
    <Tab.Screen 
      name="Journeys" 
      component={JourneysScreenOptimized}
      options={{
        title: 'Jornadas',
        tabBarLabel: 'Jornadas',
      }}
    />
    <Tab.Screen 
      name="Fuelings" 
      component={FuelingsScreenOptimized}
      options={{
        title: 'Abastecimentos',
        tabBarLabel: 'Combustível',
      }}
    />
    <Tab.Screen 
      name="Expenses" 
      component={ExpensesScreenOptimized}
      options={{
        title: 'Despesas',
        tabBarLabel: 'Despesas',
      }}
    />
    <Tab.Screen 
      name="Goals" 
      component={GoalsScreenOptimized}
      options={{
        title: 'Metas',
        tabBarLabel: 'Metas',
      }}
    />
    <Tab.Screen 
      name="Achievements" 
      component={AchievementsScreenOptimized}
      options={{
        title: 'Conquistas',
        tabBarLabel: 'Conquistas',
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreenOptimized}
      options={{
        title: 'Perfil',
        tabBarLabel: 'Perfil',
      }}
    />
  </Tab.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Auth" component={AuthStack} />
    <Stack.Screen name="Main" component={MainTabs} />
    <Stack.Screen name="AddFueling" component={AddFuelingScreenOptimized} />
    <Stack.Screen name="AddExpense" component={AddExpenseScreenOptimized} />
  </Stack.Navigator>
);

const AppNavigator: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;

