/**
 * Friends Store Tests
 * Validates the friends store functionality
 */

import { useFriendsStore, FriendLocation } from './friends.store';

describe('Friends Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useFriendsStore.getState();
    store.setFriendsLocations([]);
    store.setLoading(false);
    store.setError(null);
    if (store.pollingInterval) {
      store.stopPolling();
    }
  });

  afterEach(() => {
    // Clean up polling after each test
    const store = useFriendsStore.getState();
    if (store.pollingInterval) {
      store.stopPolling();
    }
  });

  describe('State Management', () => {
    it('should initialize with empty state', () => {
      const state = useFriendsStore.getState();
      
      expect(state.friendsLocations).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.pollingInterval).toBe(null);
      expect(state.isPolling).toBe(false);
    });

    it('should update friends locations', () => {
      const mockLocations: FriendLocation[] = [
        {
          userId: 'user1',
          latitude: 10.762622,
          longitude: 106.660172,
          speed: 15,
          heading: 90,
          timestamp: new Date(),
          status: 'biking',
        },
        {
          userId: 'user2',
          latitude: 10.762722,
          longitude: 106.660272,
          speed: 5,
          heading: 180,
          timestamp: new Date(),
          status: 'walking',
        },
      ];

      useFriendsStore.getState().setFriendsLocations(mockLocations);
      
      const state = useFriendsStore.getState();
      expect(state.friendsLocations).toEqual(mockLocations);
      expect(state.friendsLocations.length).toBe(2);
    });

    it('should update loading state', () => {
      useFriendsStore.getState().setLoading(true);
      expect(useFriendsStore.getState().isLoading).toBe(true);
      
      useFriendsStore.getState().setLoading(false);
      expect(useFriendsStore.getState().isLoading).toBe(false);
    });

    it('should update error state', () => {
      const errorMessage = 'Network error';
      
      useFriendsStore.getState().setError(errorMessage);
      expect(useFriendsStore.getState().error).toBe(errorMessage);
      
      useFriendsStore.getState().setError(null);
      expect(useFriendsStore.getState().error).toBe(null);
    });
  });

  describe('Polling Management', () => {
    it('should start polling', () => {
      const store = useFriendsStore.getState();
      
      // Mock fetchFriendsLocations to avoid actual API calls
      const originalFetch = store.fetchFriendsLocations;
      let fetchCallCount = 0;
      useFriendsStore.setState({
        fetchFriendsLocations: async () => {
          fetchCallCount++;
        },
      });

      store.startPolling();
      
      const state = useFriendsStore.getState();
      expect(state.isPolling).toBe(true);
      expect(state.pollingInterval).not.toBe(null);
      
      // Restore original function
      useFriendsStore.setState({ fetchFriendsLocations: originalFetch });
    });

    it('should stop polling', () => {
      const store = useFriendsStore.getState();
      
      // Mock fetchFriendsLocations
      useFriendsStore.setState({
        fetchFriendsLocations: async () => {},
      });

      store.startPolling();
      expect(useFriendsStore.getState().isPolling).toBe(true);
      
      store.stopPolling();
      
      const state = useFriendsStore.getState();
      expect(state.isPolling).toBe(false);
      expect(state.pollingInterval).toBe(null);
    });

    it('should stop existing polling before starting new one', () => {
      const store = useFriendsStore.getState();
      
      // Mock fetchFriendsLocations
      useFriendsStore.setState({
        fetchFriendsLocations: async () => {},
      });

      store.startPolling();
      const firstInterval = useFriendsStore.getState().pollingInterval;
      
      store.startPolling();
      const secondInterval = useFriendsStore.getState().pollingInterval;
      
      expect(firstInterval).not.toBe(secondInterval);
      expect(useFriendsStore.getState().isPolling).toBe(true);
      
      store.stopPolling();
    });
  });

  describe('Data Structure', () => {
    it('should handle FriendLocation interface correctly', () => {
      const location: FriendLocation = {
        userId: 'test-user',
        latitude: 10.762622,
        longitude: 106.660172,
        speed: 25,
        heading: 45,
        timestamp: new Date(),
        status: 'driving',
      };

      useFriendsStore.getState().setFriendsLocations([location]);
      
      const state = useFriendsStore.getState();
      expect(state.friendsLocations[0]).toMatchObject({
        userId: 'test-user',
        latitude: 10.762622,
        longitude: 106.660172,
        speed: 25,
        heading: 45,
        status: 'driving',
      });
    });

    it('should handle multiple friends locations', () => {
      const locations: FriendLocation[] = Array.from({ length: 10 }, (_, i) => ({
        userId: `user${i}`,
        latitude: 10.762622 + i * 0.001,
        longitude: 106.660172 + i * 0.001,
        speed: i * 5,
        heading: i * 30,
        timestamp: new Date(),
        status: 'walking',
      }));

      useFriendsStore.getState().setFriendsLocations(locations);
      
      const state = useFriendsStore.getState();
      expect(state.friendsLocations.length).toBe(10);
      expect(state.friendsLocations[0].userId).toBe('user0');
      expect(state.friendsLocations[9].userId).toBe('user9');
    });
  });
});
