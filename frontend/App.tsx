import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import VehiclesScreen from './src/screens/VehiclesScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import FuelingsScreen from './src/screens/FuelingsScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import AddFuelingScreen from './src/screens/AddFuelingScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import JourneysScreen from './src/screens/JourneysScreen';
import JourneyHistoryScreen from './src/screens/JourneyHistoryScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import MultiVehicleScreen from './src/screens/MultiVehicleScreen';
import FuelPricesScreen from './src/screens/FuelPricesScreen';
import ExpenseHistoryScreen from './src/screens/ExpenseHistoryScreen';
import FuelingHistoryScreen from './src/screens/FuelingHistoryScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import InsightsScreen from './src/screens/InsightsScreen';


const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Vehicles" component={VehiclesScreen} />
        <Stack.Screen name="Expenses" component={ExpensesScreen} />
        <Stack.Screen name="Fuelings" component={FuelingsScreen} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen name="AddFueling" component={AddFuelingScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Journeys" component={JourneysScreen} />
        <Stack.Screen name="JourneyHistory" component={JourneyHistoryScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MultiVehicle" component={MultiVehicleScreen} />
        <Stack.Screen name="FuelPrices" component={FuelPricesScreen} />
        <Stack.Screen name="ExpenseHistory" component={ExpenseHistoryScreen} />
        <Stack.Screen name="FuelingHistory" component={FuelingHistoryScreen} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="Goals" component={GoalsScreen} />
        <Stack.Screen name="Insights" component={InsightsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

