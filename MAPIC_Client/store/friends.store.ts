import { create } from 'zustand';
import homeApiService from '@/services/api/home.service';
import realmService from '@/services/realm.service';
import performanceService from '@/services/performance.service';

export interface FriendLocation {
  userId: string | number; // API returns number, but we convert to string
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: Date;
  status: string;
}

interface FriendsState {
  friendsLocations: FriendLocation[];
  isLoading: boolean;
  error: string | null;
  pollingInterval: ReturnType<typeof setInterval> | null;
  isPolling: boolean;
  currentPollingFrequency: number;
  
  // Actions
  setFriendsLocations: (locations: FriendLocation[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchFriendsLocations: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  loadFromCache: () => void;
  updatePollingFrequency: (interval: number) => void;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friendsLocations: [],
  isLoading: false,
  error: null,
  pollingInterval: null,
  isPolling: false,
  currentPollingFrequency: 5000, // Default 5 seconds
  
  setFriendsLocations: (locations) => set({ friendsLocations: locations }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  /**
   * Fetch friends locations from API
   * On success: update state and cache to Realm
   * On failure: fallback to Realm cache
   */
  fetchFriendsLocations: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Call API to get friends locations
      const locations = await homeApiService.getFriendsLocations();
      
      // Update state
      set({ 
        friendsLocations: locations.map(loc => ({
          ...loc,
          userId: String(loc.userId), // Ensure userId is string
        })),
        isLoading: false,
        error: null,
      });
      
      // Cache to Realm for offline access
      locations.forEach((location) => {
        try {
          realmService.saveLocation({
            id: `${location.userId}_${Date.now()}`,
            userId: String(location.userId), // Convert to string for Realm
            latitude: location.latitude,
            longitude: location.longitude,
            speed: location.speed,
            heading: location.heading,
            accuracy: 0, // Not provided by API
          });
        } catch (realmError) {
          console.error('[FriendsStore] Failed to cache location to Realm:', realmError);
        }
      });
      
    } catch (error: any) {
      console.error('[FriendsStore] Failed to fetch friends locations:', error);
      
      // Fallback to Realm cache
      get().loadFromCache();
      
      set({ 
        isLoading: false,
        error: error.message || 'Failed to fetch friends locations',
      });
    }
  },
  
  /**
   * Load friends locations from Realm cache
   * Used as fallback when API fails or for offline mode
   */
  loadFromCache: () => {
    try {
      const realm = realmService.getRealm();
      
      // Get all unique user IDs from locations
      const allLocations = realm.objects('Location');
      const userIds = new Set<string>();
      allLocations.forEach((loc: any) => {
        userIds.add(loc.userId);
      });
      
      // Get latest location for each user
      const cachedLocations: FriendLocation[] = [];
      userIds.forEach((userId) => {
        const latestLocation = realmService.getLatestLocation(userId);
        if (latestLocation) {
          cachedLocations.push({
            userId: latestLocation.userId,
            latitude: latestLocation.latitude,
            longitude: latestLocation.longitude,
            speed: latestLocation.speed,
            heading: latestLocation.heading,
            timestamp: latestLocation.timestamp,
            status: 'offline', // Mark as offline since from cache
          });
        }
      });
      
      set({ friendsLocations: cachedLocations });
      console.log('[FriendsStore] Loaded', cachedLocations.length, 'locations from cache');
      
    } catch (error) {
      console.error('[FriendsStore] Failed to load from cache:', error);
    }
  },
  
  /**
   * Start polling friends locations every 5 seconds (foreground) or 30 seconds (background)
   */
  startPolling: () => {
    const { pollingInterval, stopPolling, fetchFriendsLocations, currentPollingFrequency } = get();
    
    // Stop existing polling if any
    if (pollingInterval) {
      stopPolling();
    }
    
    console.log(`[FriendsStore] Starting polling (every ${currentPollingFrequency}ms)`);
    
    // Fetch immediately
    fetchFriendsLocations();
    
    // Set up polling interval
    const interval = setInterval(() => {
      fetchFriendsLocations();
    }, currentPollingFrequency);
    
    set({ 
      pollingInterval: interval,
      isPolling: true,
    });
  },
  
  /**
   * Stop polling friends locations
   */
  stopPolling: () => {
    const { pollingInterval } = get();
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
      console.log('[FriendsStore] Polling stopped');
    }
    
    set({ 
      pollingInterval: null,
      isPolling: false,
    });
  },

  /**
   * Update polling frequency and restart polling if active
   * Used to switch between foreground (5s) and background (30s) polling
   */
  updatePollingFrequency: (interval: number) => {
    const { isPolling, startPolling } = get();
    
    console.log(`[FriendsStore] Updating polling frequency to ${interval}ms`);
    
    set({ currentPollingFrequency: interval });
    
    // Restart polling with new frequency if currently polling
    if (isPolling) {
      startPolling();
    }
  },
}));
