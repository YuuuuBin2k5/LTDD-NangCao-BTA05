import NetInfo from '@react-native-community/netinfo';
import realmService from './realm.service';
import { useAppStore } from '@/store/app.store';

/**
 * Offline Queue Service
 * Manages queued location updates when offline and syncs when network restores
 */

export interface QueuedLocationUpdate {
  id: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: Date;
  status?: string;
  retryCount: number;
  createdAt: Date;
}

class OfflineQueueService {
  private isProcessing = false;
  private unsubscribeNetInfo: (() => void) | null = null;
  private syncInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Initialize network listener
   */
  initialize(): void {
    console.log('[OfflineQueue] Initializing network listener');
    
    // Listen to network state changes
    this.unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected && state.isInternetReachable !== false;
      console.log('[OfflineQueue] Network state changed:', {
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        isOnline,
      });
      
      // Update app store
      useAppStore.getState().setOnlineStatus(isOnline);
      
      // Process queue when network restores
      if (isOnline) {
        console.log('[OfflineQueue] Network restored, processing queue');
        this.processQueue();
      }
    });

    // Start periodic sync (every 30 seconds)
    this.startPeriodicSync();
  }

  /**
   * Cleanup listeners
   */
  cleanup(): void {
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
      this.unsubscribeNetInfo = null;
    }
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Add location update to offline queue (stored in Realm)
   */
  async addToQueue(location: {
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    timestamp: Date;
    status?: string;
  }): Promise<void> {
    try {
      const realm = realmService.getRealm();
      const queueId = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      realm.write(() => {
        // Check if QueuedLocation schema exists, if not we'll store in Location with a flag
        // For now, we'll use the Location schema with a special userId prefix
        realm.create('Location', {
          _id: queueId,
          userId: 'QUEUED', // Special marker for queued items
          latitude: location.latitude,
          longitude: location.longitude,
          speed: location.speed || 0,
          heading: location.heading || 0,
          accuracy: 0,
          timestamp: location.timestamp,
        });
      });
      
      console.log('[OfflineQueue] Added location to queue:', queueId);
      
      // Try to process queue immediately
      this.processQueue();
    } catch (error) {
      console.error('[OfflineQueue] Failed to add to queue:', error);
    }
  }

  /**
   * Get all queued location updates from Realm
   */
  private getQueuedUpdates(): any[] {
    try {
      const realm = realmService.getRealm();
      const queued = realm
        .objects('Location')
        .filtered('userId == "QUEUED"')
        .sorted('timestamp', false);
      
      // Convert to plain objects to avoid Realm invalidation issues
      return queued.map(item => ({
        _id: item._id,
        latitude: item.latitude,
        longitude: item.longitude,
        speed: item.speed,
        heading: item.heading,
        accuracy: item.accuracy,
        timestamp: item.timestamp,
      }));
    } catch (error) {
      // Realm not initialized yet, return empty array
      console.log('[OfflineQueue] Failed to get queued updates:', error);
      return [];
    }
  }

  /**
   * Remove location update from queue
   */
  private removeFromQueue(queueId: string): void {
    try {
      const realm = realmService.getRealm();
      const item = realm.objectForPrimaryKey('Location', queueId);
      
      if (item) {
        realm.write(() => {
          realm.delete(item);
        });
        console.log('[OfflineQueue] Removed from queue:', queueId);
      }
    } catch (error) {
      console.error('[OfflineQueue] Failed to remove from queue:', error);
    }
  }

  /**
   * Process offline queue and sync with server
   */
  async processQueue(): Promise<void> {
    // Check if already processing
    if (this.isProcessing) {
      console.log('[OfflineQueue] Already processing queue');
      return;
    }

    // Check network status
    const netState = await NetInfo.fetch();
    const isOnline = netState.isConnected && netState.isInternetReachable !== false;
    
    if (!isOnline) {
      console.log('[OfflineQueue] Offline, skipping queue processing');
      return;
    }

    const queuedUpdates = this.getQueuedUpdates();
    
    if (queuedUpdates.length === 0) {
      return;
    }

    this.isProcessing = true;
    console.log(`[OfflineQueue] Processing ${queuedUpdates.length} queued updates`);

    let successCount = 0;
    let failCount = 0;

    for (const update of queuedUpdates) {
      try {
        // Lazy import to avoid circular dependency
        const { default: homeApiService } = await import('./api/home.service');
        
        // Send to server
        await homeApiService.updateLocation({
          latitude: update.latitude,
          longitude: update.longitude,
          speed: update.speed,
          heading: update.heading,
          timestamp: update.timestamp,
          status: 'stationary', // Default status
        });

        // Remove from queue on success
        this.removeFromQueue(update._id);
        successCount++;
        
      } catch (error) {
        console.error('[OfflineQueue] Failed to sync update:', error);
        failCount++;
        
        // If too many items in queue, remove oldest ones
        if (queuedUpdates.length > 100) {
          this.removeFromQueue(update._id);
          console.log('[OfflineQueue] Queue too large, removing old update');
        }
      }
    }

    this.isProcessing = false;
    console.log(`[OfflineQueue] Processing complete. Success: ${successCount}, Failed: ${failCount}`);
  }

  /**
   * Start periodic sync (every 30 seconds)
   */
  private startPeriodicSync(): void {
    if (this.syncInterval) {
      return;
    }

    this.syncInterval = setInterval(() => {
      this.processQueue();
    }, 30000); // 30 seconds
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.getQueuedUpdates().length;
  }

  /**
   * Clear all queued updates
   */
  clearQueue(): void {
    try {
      const realm = realmService.getRealm();
      const queued = realm.objects('Location').filtered('userId == "QUEUED"');
      
      realm.write(() => {
        realm.delete(queued);
      });
      
      console.log('[OfflineQueue] Queue cleared');
    } catch (error) {
      console.error('[OfflineQueue] Failed to clear queue:', error);
    }
  }
}

export default new OfflineQueueService();
