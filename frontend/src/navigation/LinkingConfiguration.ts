import * as Linking from 'expo-linking';

const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
      Main: {
        screens: {
          Dashboard: 'dashboard',
          Vehicles: 'vehicles',
          Journeys: 'journeys',
          Fuelings: 'fuelings',
          Expenses: 'expenses',
          Goals: 'goals',
          Achievements: 'achievements',
          Profile: 'profile',
        },
      },
      AddFueling: 'add-fueling',
      AddExpense: 'add-expense',
    },
  },
};

export default linking;


