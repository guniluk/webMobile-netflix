import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

interface User {
  _id: string;
  username: string;
  email: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<{ success: boolean; message?: string }>;
  authCheck: () => Promise<{ success: boolean; message?: string }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  signup: async (username, email, password) => {
    set({ isSigningUp: true });
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.succcess) {
        throw new Error(data.message || 'Signup failed');
      }

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      set({ user: data.user, token: data.token, isSigningUp: false });
      return { success: true };
    } catch (error: any) {
      set({ isSigningUp: false });
      return {
        success: false,
        message: error.message || 'Signup failed',
      };
    }
  },

  login: async (email, password) => {
    set({ isLoggingIn: true });
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.succcess) {
        throw new Error(data.message || 'Login failed');
      }

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      set({ user: data.user, token: data.token, isLoggingIn: false });
      return { success: true };
    } catch (error: any) {
      set({ isLoggingIn: false });
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  },

  logout: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      // Request backend logout (clears cookie on web side)
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log('Error during backend logout request:', error);
    } finally {
      // Always clear local session even if server request fails
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      set({ user: null, token: null });
    }
    return { success: true };
  },

  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const token = await AsyncStorage.getItem('token');
      const savedUserStr = await AsyncStorage.getItem('user');

      if (!token) {
        set({ user: null, token: null, isCheckingAuth: false });
        return { success: false, message: 'No token found' };
      }

      const response = await fetch(`${API_URL}/api/v1/auth/authCheck`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.succcess) {
        throw new Error(data.message || 'Authcheck failed');
      }

      set({ user: data.user, token: token, isCheckingAuth: false });
      return { success: true };
    } catch (error: any) {
      // Clear invalid credentials
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      set({ user: null, token: null, isCheckingAuth: false });
      return {
        success: false,
        message: error.message || 'Authcheck failed',
      };
    }
  },
}));
