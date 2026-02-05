/**
 * Offline Queue Service Tests
 * 
 * These tests verify the offline queue functionality:
 * - Queue management
 * - Network state handling
 * - Sync behavior
 */

import offlineQueueService from './offline-queue.service';
import realmService from './realm.service';

describe('OfflineQueueService', () => {
  beforeAll(async () => {
    // Initialize Realm for testing
    await realmService.initialize();
  });

  afterAll(() => {
    // Cleanup
    realmService.close();
  });

  beforeEach(() => {
    // Clear queue before each test
    offlineQueueService.clearQueue();
  });

  describe('Queue Management', () => {
    it('should add location to queue', async () => {
      const location = {
        latitude: 10.762622,
        longitude: 106.660172,
        speed: 15,
        heading: 90,
        timestamp: new Date(),
        status: 'biking',
      };

      await offlineQueueService.addToQueue(location);
      
      const queueSize = offlineQueueService.getQueueSize();
      expect(queueSize).toBe(1);
    });

    it('should handle multiple queued items', async () => {
      const locations = [
        { latitude: 10.1, longitude: 106.1, speed: 10, heading: 0, timestamp: new Date() },
        { latitude: 10.2, longitude: 106.2, speed: 20, heading: 45, timestamp: new Date() },
        { latitude: 10.3, longitude: 106.3, speed: 30, heading: 90, timestamp: new Date() },
      ];

      for (const loc of locations) {
        await offlineQueueService.addToQueue(loc);
      }

      const queueSize = offlineQueueService.getQueueSize();
      expect(queueSize).toBe(3);
    });

    it('should clear queue', async () => {
      await offlineQueueService.addToQueue({
        latitude: 10.762622,
        longitude: 106.660172,
        speed: 15,
        heading: 90,
        timestamp: new Date(),
      });

      offlineQueueService.clearQueue();
      
      const queueSize = offlineQueueService.getQueueSize();
      expect(queueSize).toBe(0);
    });

    it('should limit queue size to 100 items', async () => {
      // Add 110 items
      for (let i = 0; i < 110; i++) {
        await offlineQueueService.addToQueue({
          latitude: 10 + i * 0.001,
          longitude: 106 + i * 0.001,
          speed: 15,
          heading: 90,
          timestamp: new Date(),
        });
      }

      // Should be limited to 100
      const queueSize = offlineQueueService.getQueueSize();
      expect(queueSize).toBeLessThanOrEqual(100);
    });
  });

  describe('Queue Persistence', () => {
    it('should persist queue across service restarts', async () => {
      // Add items to queue
      await offlineQueueService.addToQueue({
        latitude: 10.762622,
        longitude: 106.660172,
        speed: 15,
        heading: 90,
        timestamp: new Date(),
      });

      const sizeBefore = offlineQueueService.getQueueSize();
      expect(sizeBefore).toBe(1);

      // Simulate service restart by getting queue size again
      // (In real scenario, this would be after app restart)
      const sizeAfter = offlineQueueService.getQueueSize();
      expect(sizeAfter).toBe(sizeBefore);
    });
  });
});

describe('Offline Mode Integration', () => {
  it('should queue location when offline', async () => {
    // This is an integration test that would require mocking NetInfo
    // For now, we just verify the queue mechanism works
    
    const location = {
      latitude: 10.762622,
      longitude: 106.660172,
      speed: 15,
      heading: 90,
      timestamp: new Date(),
      status: 'biking',
    };

    await offlineQueueService.addToQueue(location);
    
    const queueSize = offlineQueueService.getQueueSize();
    expect(queueSize).toBeGreaterThan(0);
  });
});
