import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginScreen from '../screens/LoginScreen';
import Dashboard from '../screens/Dashboard';
import RegisterScreen from '../screens/RegisterScreen'; // Importar RegisterScreen
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'; // Importar ForgotPasswordScreen
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} /> {/* Nova rota para registro */}
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} /> {/* Nova rota para esqueceu senha */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} /> {/* Redirecionar para dashboard se autenticado, caso contrário para login */}
      </Routes>
    </Router>
  );
};

export default AppRouter;


