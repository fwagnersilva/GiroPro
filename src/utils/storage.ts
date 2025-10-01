import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const AUTH_TOKENS_KEY = 'auth_tokens';
const USER_KEY = 'user';

// Wrapper para suportar tanto web (localStorage) quanto mobile (AsyncStorage)
const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
  clear: async () => {
    if (Platform.OS === 'web') {
      localStorage.clear();
    } else {
      await AsyncStorage.clear();
    }
  },
};

export const setAuthTokens = async (tokens: any) => {
  try {
    await storage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error('Error saving auth tokens:', error);
  }
};

export const getAuthTokens = async () => {
  try {
    const tokens = await storage.getItem(AUTH_TOKENS_KEY);
    return tokens ? JSON.parse(tokens) : null;
  } catch (error) {
    console.error('Error getting auth tokens:', error);
    return null;
  }
};

export const removeAuthTokens = async () => {
  try {
    await storage.removeItem(AUTH_TOKENS_KEY);
  } catch (error) {
    console.error('Error removing auth tokens:', error);
  }
};

export const setUser = async (user: any) => {
  try {
    await storage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUser = async () => {
  try {
    const user = await storage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await storage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

export const clearStorage = async () => {
  try {
    await storage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
