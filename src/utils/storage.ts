import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKENS_KEY = 'auth_tokens';
const USER_KEY = 'user';

export const setAuthTokens = async (tokens: any) => {
  try {
    await AsyncStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error('Error saving auth tokens:', error);
  }
};

export const getAuthTokens = async () => {
  try {
    const tokens = await AsyncStorage.getItem(AUTH_TOKENS_KEY);
    return tokens ? JSON.parse(tokens) : null;
  } catch (error) {
    console.error('Error getting auth tokens:', error);
    return null;
  }
};

export const removeAuthTokens = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKENS_KEY);
  } catch (error) {
    console.error('Error removing auth tokens:', error);
  }
};

export const setUser = async (user: any) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

