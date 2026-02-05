/**
 * Integration tests for Friends Location API
 * Tests the complete flow: API -> Store -> Realm Cache
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useFriendsStore } from '@/store/friends.store';
import homeApiService from './home.service';
import realmService from '@/services/realm.service';

// Mock the services
vi.mock('./home.service');
vi.mock('@/services/realm.service');

describe('Friends Location API Integration', () => {
  beforeEach(() => {
    // Reset store state before each test
    useFriendsStore.setState({
      friendsLocations: [],
      isLoading: false,
      error: null,
      pollingInterval: null,
      isPolling: false,
    });
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Stop any polling
    const { stopPolling } = useFriendsStore.getState();
    stopPolling();
  });

  describe('fetchFriendsLocations', () => {
    it('should fetch locations from API and update state', async () => {
      // Arrange
      const mockLocations = [
        {
          userId: 'user1',
          latitude: 10.762622,
          longitude: 106.660172,
          speed: 25.5,
          heading: 180,
          timestamp: new Date(),
          status: 'online',
        },
        {
          userId: 'user2',
          latitude: 10.762700,
          longitude: 106.660200,
          speed: 0,
          heading: 0,
          timestamp: new Date(),
          status: 'online',
        },
      ];

      vi.mocked(homeApiService.getFriendsLocations).mockResolvedValue(mockLocations);
      vi.mocked(realmService.saveLocation).mockImplementation(() => {});

      // Act
      const { fetchFriendsLocations } = useFriendsStore.getState();
      await fetchFriendsLocations();

      // Assert
      const state = useFriendsStore.getState();
      expect(state.friendsLocations).toEqual(mockLocations);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
      expect(homeApiService.getFriendsLocations).toHaveBeenCalledTimes(1);
    });

    it('should cache locations to Realm on successful fetch', async () => {
      // Arrange
      const mockLocations = [
        {
          userId: 'user1',
          latitude: 10.762622,
          longitude: 106.660172,
          speed: 25.5,
          heading: 180,
          timestamp: new Date(),
          status: 'online',
        },
      ];

      vi.mocked(homeApiService.getFriendsLocations).mockResolvedValue(mockLocations);
      vi.mocked(realmService.saveLocation).mockImplementation(() => {});

      // Act
      const { fetchFriendsLocations } = useFriendsStore.getState();
      await fetchFriendsLocations();

      // Assert
      expect(realmService.saveLocation).toHaveBeenCalledTimes(1);
      expect(realmService.saveLocation).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user1',
          latitude: 10.762622,
          longitude: 106.660172,
          speed: 25.5,
          heading: 180,
        })
      );
    });

    it('should fallback to Realm cache when API fails', async () => {
      // Arrange
      const mockError = new Error('Network error');
      const mockCachedLocations = [
        {
          userId: 'user1',
          latitude: 10.762622,
          longitude: 106.660172,
          speed: 0,
          heading: 0,
          timestamp: new Date(),
          status: 'offline',
        },
      ];

      vi.mocked(homeApiService.getFriendsLocations).mockRejectedValue(mockError);
      vi.mocked(realmService.getRealm).mockReturnValue({
        objects: vi.fn().mockReturnValue([
          { userId: 'user1' },
        ]),
      } as any);
      vi.mocked(realmService.getLatestLocation).mockReturnValue({
        userId: 'user1',
        latitude: 10.762622,
        longitude: 106.660172,
        speed: 0,
        heading: 0,
        timestamp: new Date(),
        accuracy: 0,
      } as any);

      // Act
      const { fetchFriendsLocations } = useFriendsStore.getState();
      await fetchFriendsLocations();

      // Assert
      const state = useFriendsStore.getState();
      expect(state.error).toBe('Network error');
      expect(state.friendsLocations.length).toBeGreaterThan(0);
      expect(state.friendsLocations[0].status).toBe('offline');
    });
  });

  describe('Polling', () => {
    it('should start polling and fetch immediately', async () => {
      // Arrange
      vi.mocked(homeApiService.getFriendsLocations).mockResolvedValue([]);
      vi.mocked(realmService.saveLocation).mockImplementation(() => {});

      // Act
      const { startPolling } = useFriendsStore.getState();
      startPolling();

      // Assert
      const state = useFriendsStore.getState();
      expect(state.isPolling).toBe(true);
      expect(state.pollingInterval).not.toBe(null);
      expect(homeApiService.getFriendsLocations).toHaveBeenCalledTimes(1);
    });

    it('should stop polling and clear interval', () => {
      // Arrange
      vi.mocked(homeApiService.getFriendsLocations).mockResolvedValue([]);
      const { startPolling, stopPolling } = useFriendsStore.getState();
      startPolling();

      // Act
      stopPolling();

      // Assert
      const state = useFriendsStore.getState();
      expect(state.isPolling).toBe(false);
      expect(state.pollingInterval).toBe(null);
    });

    it('should poll every 5 seconds', async () => {
      // Arrange
      vi.useFakeTimers();
      vi.mocked(homeApiService.getFriendsLocations).mockResolvedValue([]);
      vi.mocked(realmService.saveLocation).mockImplementation(() => {});

      // Act
      const { startPolling } = useFriendsStore.getState();
      startPolling();

      // Initial call
      expect(homeApiService.getFriendsLocations).toHaveBeenCalledTimes(1);

      // Advance 5 seconds
      await vi.advanceTimersByTimeAsync(5000);
      expect(homeApiService.getFriendsLocations).toHaveBeenCalledTimes(2);

      // Advance another 5 seconds
      await vi.advanceTimersByTimeAsync(5000);
      expect(homeApiService.getFriendsLocations).toHaveBeenCalledTimes(3);

      // Cleanup
      const { stopPolling } = useFriendsStore.getState();
      stopPolling();
      vi.useRealTimers();
    });
  });

  describe('loadFromCache', () => {
    it('should load locations from Realm cache', () => {
      // Arrange
      const mockRealmLocations = [
        {
          userId: 'user1',
          latitude: 10.762622,
          longitude: 106.660172,
          speed: 25.5,
          heading: 180,
          timestamp: new Date(),
          accuracy: 10,
        },
      ];

      vi.mocked(realmService.getRealm).mockReturnValue({
        objects: vi.fn().mockReturnValue([
          { userId: 'user1' },
        ]),
      } as any);
      vi.mocked(realmService.getLatestLocation).mockReturnValue(mockRealmLocations[0] as any);

      // Act
      const { loadFromCache } = useFriendsStore.getState();
      loadFromCache();

      // Assert
      const state = useFriendsStore.getState();
      expect(state.friendsLocations.length).toBe(1);
      expect(state.friendsLocations[0].userId).toBe('user1');
      expect(state.friendsLocations[0].status).toBe('offline');
    });
  });
});
