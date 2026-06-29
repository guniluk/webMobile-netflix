import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  signup: async (username, email, password) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post('/api/v1/auth/signup', {
        username,
        email,
        password,
      });
      set({ user: response.data.user, isSigningUp: false });
      return { success: true };
    } catch (error) {
      set({ isSigningUp: false });
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
      };
    }
  },

  login: async (email, password) => {
    set({ isLoggingIn: true });
    try {
      const response = await axios.post('/api/v1/auth/login', {
        email,
        password,
      });
      set({ user: response.data.user, isLoggingIn: false });
      return { success: true };
    } catch (error) {
      set({ isLoggingIn: false });
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/v1/auth/logout');
      set({ user: null });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed',
      };
    }
  },

  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get('/api/v1/auth/authCheck');
      set({ user: response.data.user, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isCheckingAuth: false });
      return {
        success: false,
        message: error.response?.data?.message || 'AuthCheck error',
      };
    }
  },
}));
