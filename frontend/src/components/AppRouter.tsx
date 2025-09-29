
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import Dashboard from '../screens/Dashboard';
import JourneysScreen from '../screens/JourneysScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import FuelingsScreen from '../screens/FuelingsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import Sidebar from './Sidebar'; // Importa o Sidebar existente
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const DashboardLayout: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const windowWidth = Dimensions.get('window').width;
  const isWeb = Platform.OS === 'web';

  // Lógica para fechar/abrir sidebar em telas menores ou mobile
  React.useEffect(() => {
    if (!isWeb) {
      setIsSidebarOpen(false); // Sidebar fechado por padrão em mobile
    } else if (windowWidth < 768) {
      setIsSidebarOpen(false); // Sidebar fechado por padrão em web para telas pequenas
    }
  }, [windowWidth, isWeb]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <View style={styles.dashboardContainer}>
      {/* Botão para abrir/fechar sidebar em mobile/telas pequenas */}
      {!isWeb && (
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Text>Menu</Text> {/* Substituir por ícone real */}
        </TouchableOpacity>
      )}

      {/* Renderiza o Sidebar. Ele gerencia sua própria visibilidade em web/mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      <View style={[styles.mainContent, isSidebarOpen && isWeb && styles.mainContentShifted]}>
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
        <Route path="/reset-password" element={<ResetPasswordScreen />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/journeys" element={<JourneysScreen />} />
                  <Route path="/vehicles" element={<VehiclesScreen />} />
                  <Route path="/expenses" element={<ExpensesScreen />} />
                  <Route path="/fuelings" element={<FuelingsScreen />} />
                  {/* Adicione outras rotas protegidas aqui */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    flexDirection: 'row',
    // No web, o sidebar é fixo, então o conteúdo principal se ajusta.
    // No mobile, o sidebar é um overlay, então o conteúdo principal ocupa a tela toda.
  },
  mainContent: {
    flex: 1,
    // Ajuste para web quando o sidebar está aberto
    ...(Platform.OS === 'web' && { marginLeft: 0 }), // Inicialmente sem margem, o Sidebar gerencia seu próprio posicionamento
  },
  mainContentShifted: {
    ...(Platform.OS === 'web' && { marginLeft: 256 }), // Largura do sidebar
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1001,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
});

export default AppRouter;

