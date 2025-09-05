import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext.web';
import LoginScreenSimple from './src/screens/LoginScreen.simple';
import DashboardScreenClean from './src/screens/DashboardScreen.clean';
import AddExpenseScreenClean from './src/screens/AddExpenseScreen.clean';
import AddFuelingScreenClean from './src/screens/AddFuelingScreen.clean';
import ExpensesScreenClean from './src/screens/ExpensesScreen.clean';
import FuelingsScreenClean from './src/screens/FuelingsScreen.clean';

const Stack = createStackNavigator();

// Componente de loading simples
const LoadingSpinner = ({ size, color }: { size: string; color: string }) => (
  <div style={{ 
    width: '40px', 
    height: '40px', 
    border: `3px solid ${color}30`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }}>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Carregando autenticação...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isAuthenticated ? "Dashboard" : "Login"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreenSimple} />
        <Stack.Screen name="Dashboard" component={DashboardScreenClean} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreenClean} />
        <Stack.Screen name="AddFueling" component={AddFuelingScreenClean} />
        <Stack.Screen name="Expenses" component={ExpensesScreenClean} />
        <Stack.Screen name="Fuelings" component={FuelingsScreenClean} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}


