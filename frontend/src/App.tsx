import React from 'react';
import { Platform } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import AppNavigator from './navigation/AppNavigator'; // Para mobile
import AppRouter from './components/AppRouter'; // Para web

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;


