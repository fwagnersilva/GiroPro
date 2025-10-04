import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Temporariamente desabilitando a verificação de autenticação para acesso direto
  // const { isAuthenticated, isLoading } = useAuth();

  // if (isLoading) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <ActivityIndicator size="large" color="#2563EB" />
  //     </View>
  //   );
  // }

  // if (!isAuthenticated) {
  //   return <Redirect href="/login" />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;

