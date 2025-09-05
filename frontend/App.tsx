import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreenClean from './src/screens/LoginScreen.clean';
import DashboardScreenClean from './src/screens/DashboardScreen.clean';

const Stack = createStackNavigator();

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
        <Stack.Screen name="Login" component={LoginScreenClean} />
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


