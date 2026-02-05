import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark' | 'auto';
  language: 'vi' | 'en';
  isOnline: boolean;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setLanguage: (language: 'vi' | 'en') => void;
  setOnlineStatus: (status: boolean) => void;
  setNetworkStatus: (status: boolean) => void; // Alias for setOnlineStatus
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'auto',
  language: 'vi',
  isOnline: true,
  
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  setOnlineStatus: (status) => set({ isOnline: status }),
  setNetworkStatus: (status) => set({ isOnline: status }), // Alias for setOnlineStatus
}));
