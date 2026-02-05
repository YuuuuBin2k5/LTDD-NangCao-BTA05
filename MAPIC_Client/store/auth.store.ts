import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import realmService from '@/services/realm.service';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        // Save to Realm
        try {
          realmService.saveUser(user);
        } catch (error) {
          console.error('Failed to save user to Realm:', error);
        }
        set({ user, isAuthenticated: true });
      },
      
      setToken: (token) => set({ token }),
      
      login: (user, token) => {
        // Save to Realm
        try {
          realmService.saveUser(user);
        } catch (error) {
          console.error('Failed to save user to Realm:', error);
        }
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        });
      },
      
      logout: () => {
        // Clear Realm data
        try {
          realmService.clearAllUsers();
        } catch (error) {
          console.error('Failed to clear Realm data:', error);
        }
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
