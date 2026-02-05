import { create } from 'zustand';
import * as Location from 'expo-location';
import locationService from '@/services/location.service';
import { UserStatus } from '@/types/avatar.types';

export interface UserLocation {
  latitude: number;
  longitude: number;
  speed: number | null;
  heading: number | null;
  timestamp: number;
  status?: string; // User status (walking, biking, driving, etc.)
}

/**
 * Calculate user status based on speed
 */
function calculateStatus(speed: number | null): string {
  if (!speed || speed < 1) {
    return UserStatus.STATIONARY;
  } else if (speed < 10) {
    return UserStatus.WALKING;
  } else if (speed < 60) {
    return UserStatus.BIKING;
  } else {
    return UserStatus.DRIVING;
  }
}

interface LocationState {
  currentLocation: UserLocation | null;
  isTracking: boolean;
  hasPermission: boolean;
  hasBackgroundPermission: boolean;
  isLoading: boolean;
  error: string | null;
  locationSubscription: Location.LocationSubscription | null;
  backgroundLocationTask: Location.LocationSubscription | null;
  
  // Actions
  setCurrentLocation: (location: UserLocation) => void;
  setTracking: (tracking: boolean) => void;
  setPermission: (hasPermission: boolean) => void;
  setBackgroundPermission: (hasPermission: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLocationSubscription: (subscription: Location.LocationSubscription | null) => void;
  setBackgroundLocationTask: (task: Location.LocationSubscription | null) => void;
  requestPermission: () => Promise<boolean>;
  requestBackgroundPermission: () => Promise<boolean>;
  startTracking: () => Promise<void>;
  startBackgroundTracking: () => Promise<void>;
  stopTracking: () => void;
  stopBackgroundTracking: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  currentLocation: null,
  isTracking: false,
  hasPermission: false,
  hasBackgroundPermission: false,
  isLoading: false,
  error: null,
  locationSubscription: null,
  backgroundLocationTask: null,
  
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setTracking: (tracking) => set({ isTracking: tracking }),
  setPermission: (hasPermission) => set({ hasPermission }),
  setBackgroundPermission: (hasBackgroundPermission) => set({ hasBackgroundPermission }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setLocationSubscription: (subscription) => set({ locationSubscription: subscription }),
  setBackgroundLocationTask: (task) => set({ backgroundLocationTask: task }),
  
  requestPermission: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const hasPermission = status === 'granted';
      set({ hasPermission, error: hasPermission ? null : 'Location permission denied' });
      return hasPermission;
    } catch (error) {
      set({ hasPermission: false, error: 'Failed to request location permission' });
      return false;
    }
  },
  
  requestBackgroundPermission: async () => {
    try {
      // First check if we have foreground permission
      const { hasPermission, requestPermission } = get();
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) return false;
      }
      
      // Request background permission
      const { status } = await Location.requestBackgroundPermissionsAsync();
      const hasBackgroundPermission = status === 'granted';
      set({ 
        hasBackgroundPermission, 
        error: hasBackgroundPermission ? null : 'Background location permission denied' 
      });
      return hasBackgroundPermission;
    } catch (error) {
      set({ hasBackgroundPermission: false, error: 'Failed to request background location permission' });
      return false;
    }
  },
  
  startTracking: async () => {
    const { hasPermission, requestPermission, locationSubscription } = get();
    
    // Stop existing subscription if any
    if (locationSubscription) {
      locationSubscription.remove();
    }
    
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      // Get initial location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const userLocation: UserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        speed: location.coords.speed,
        heading: location.coords.heading,
        timestamp: location.timestamp,
        status: calculateStatus(location.coords.speed),
      };
      
      set({
        currentLocation: userLocation,
        isLoading: false,
      });
      
      // Start watching location
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every 1 second
          distanceInterval: 10, // Or when moved 10 meters
        },
        (newLocation) => {
          const updatedLocation: UserLocation = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            speed: newLocation.coords.speed,
            heading: newLocation.coords.heading,
            timestamp: newLocation.timestamp,
            status: calculateStatus(newLocation.coords.speed),
          };
          set({ currentLocation: updatedLocation });
        }
      );
      
      set({ 
        locationSubscription: subscription,
        isTracking: true,
      });
      
      // Start periodic API updates (every 10 seconds)
      locationService.startPeriodicUpdates(() => get().currentLocation);
      
    } catch (error) {
      set({ 
        error: 'Failed to get location', 
        isLoading: false,
        isTracking: false,
      });
    }
  },
  
  startBackgroundTracking: async () => {
    const { hasBackgroundPermission, requestBackgroundPermission, backgroundLocationTask } = get();
    
    // Stop existing background task if any
    if (backgroundLocationTask) {
      backgroundLocationTask.remove();
    }
    
    if (!hasBackgroundPermission) {
      const granted = await requestBackgroundPermission();
      if (!granted) {
        console.log('Background permission not granted');
        return;
      }
    }
    
    try {
      console.log('Starting background location tracking');
      
      // Start background location updates
      const task = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // Update every 10 seconds in background
          distanceInterval: 50, // Or when moved 50 meters
          mayShowUserSettingsDialog: true,
        },
        (newLocation) => {
          const updatedLocation: UserLocation = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            speed: newLocation.coords.speed,
            heading: newLocation.coords.heading,
            timestamp: newLocation.timestamp,
            status: calculateStatus(newLocation.coords.speed),
          };
          
          set({ currentLocation: updatedLocation });
          
          // Send location update to server (will queue if offline)
          locationService.sendLocationUpdate(updatedLocation).catch((error) => {
            console.error('Failed to send background location update:', error);
            // Error already handled by locationService (queued if offline)
          });
        }
      );
      
      set({ backgroundLocationTask: task });
      console.log('Background location tracking started');
      
    } catch (error) {
      console.error('Failed to start background tracking:', error);
      set({ error: 'Failed to start background location tracking' });
    }
  },
  
  stopTracking: () => {
    const { locationSubscription } = get();
    if (locationSubscription) {
      locationSubscription.remove();
    }
    
    // Stop periodic API updates
    locationService.stopPeriodicUpdates();
    
    set({ 
      isTracking: false,
      locationSubscription: null,
    });
  },
  
  stopBackgroundTracking: () => {
    const { backgroundLocationTask } = get();
    if (backgroundLocationTask) {
      backgroundLocationTask.remove();
      console.log('Background location tracking stopped');
    }
    set({ backgroundLocationTask: null });
  },
}));
