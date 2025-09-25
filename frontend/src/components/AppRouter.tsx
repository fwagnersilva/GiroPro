import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { View, StyleSheet } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import Dashboard from '../screens/Dashboard';
import JourneysScreen from '../screens/JourneysScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import FuelingsScreen from '../screens/FuelingsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const DashboardLayout: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <View style={styles.dashboardContainer}>
      <Sidebar />
      <View style={styles.mainContent}>
        {children}
      </View>
    </View>
  );
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/journeys"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <JourneysScreen />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/vehicles"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <VehiclesScreen />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/expenses"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ExpensesScreen />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/fuelings"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <FuelingsScreen />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    marginLeft: 256, // Largura do sidebar
  },
});

export default AppRouter;

