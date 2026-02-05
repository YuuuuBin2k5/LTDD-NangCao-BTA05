/**
 * Discovery Store - Zustand State Management
 * Manages categories, popular places, and nearby friends
 */

import { create } from 'zustand';
import ApiService from '@/services/api.service';
import type { Category, PopularPlace, NearbyFriend } from '@/types/discovery';

interface DiscoveryState {
  // State
  categories: Category[];
  selectedCategory: string;
  popularPlaces: PopularPlace[];
  nearbyFriends: NearbyFriend[];
  
  // Loading states
  categoriesLoading: boolean;
  placesLoading: boolean;
  friendsLoading: boolean;
  
  // Error states
  categoriesError: string | null;
  placesError: string | null;
  friendsError: string | null;
  
  // Actions
  fetchCategories: () => Promise<void>;
  selectCategory: (category: string) => void;
  fetchPopularPlaces: (lat: number, lng: number) => Promise<void>;
  fetchNearbyFriends: (lat: number, lng: number, token: string) => Promise<void>;
  refreshAll: (lat: number, lng: number, token: string) => Promise<void>;
}

export const useDiscoveryStore = create<DiscoveryState>((set, get) => ({
  // Initial state
  categories: [],
  selectedCategory: 'All',
  popularPlaces: [],
  nearbyFriends: [],
  categoriesLoading: false,
  placesLoading: false,
  friendsLoading: false,
  categoriesError: null,
  placesError: null,
  friendsError: null,
  
  // Actions
  fetchCategories: async () => {
    set({ categoriesLoading: true, categoriesError: null });
    try {
      const categories = await ApiService.getCategories();
      set({ categories, categoriesLoading: false });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ 
        categoriesLoading: false, 
        categories: [],
        categoriesError: 'Không thể tải danh mục'
      });
    }
  },
  
  selectCategory: (category: string) => {
    set({ selectedCategory: category });
  },
  
  fetchPopularPlaces: async (lat: number, lng: number) => {
    set({ placesLoading: true, placesError: null });
    try {
      const places = await ApiService.getPopularPlaces(lat, lng);
      set({ popularPlaces: places, placesLoading: false });
    } catch (error) {
      console.error('Error fetching popular places:', error);
      set({ 
        placesLoading: false, 
        popularPlaces: [],
        placesError: 'Không thể tải địa điểm'
      });
    }
  },
  
  fetchNearbyFriends: async (lat: number, lng: number, token: string) => {
    set({ friendsLoading: true, friendsError: null });
    try {
      const friends = await ApiService.getNearbyFriends(lat, lng, token);
      set({ nearbyFriends: friends, friendsLoading: false });
    } catch (error) {
      console.error('Error fetching nearby friends:', error);
      set({ 
        friendsLoading: false, 
        nearbyFriends: [],
        friendsError: 'Không thể tải bạn bè'
      });
    }
  },
  
  refreshAll: async (lat: number, lng: number, token: string) => {
    await Promise.all([
      get().fetchCategories(),
      get().fetchPopularPlaces(lat, lng),
      get().fetchNearbyFriends(lat, lng, token),
    ]);
  },
}));
