import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './screens/LoginScreen';
import Dashboard from './screens/Dashboard';

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? <Dashboard /> : <LoginScreen />;
};

const Root = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default Root;


