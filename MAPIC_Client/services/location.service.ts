import apiService from './api.service';
import { useAuthStore } from '@/store/auth.store';
import offlineQueueService from './offline-queue.service';
import homeApiService from './api/home.service';
import performanceService from './performance.service';

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  speed: number | null;
  heading: number | null;
  timestamp: number;
  status?: string; // User status (walking, biking, driving, etc.)
}

export interface QueuedLocationUpdate extends LocationUpdate {
  id: string;
  retryCount: number;
}

class LocationService {
  private updateInterval: ReturnType<typeof setInterval> | null = null;
  private currentUpdateFrequency: number = 10000; // Default 10 seconds

  /**
   * Send location update to server
   * Uses homeApiService which handles offline queueing automatically
   */
  async sendLocationUpdate(location: LocationUpdate): Promise<void> {
    const token = useAuthStore.getState().token;
    
    if (!token) {
      throw new Error('User not authenticated');
    }

    try {
      await homeApiService.updateLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        speed: location.speed || 0,
        heading: location.heading || 0,
        timestamp: new Date(location.timestamp),
        status: location.status || 'stationary',
      });
    } catch (error) {
      console.error('[LocationService] Failed to send location update:', error);
      // Error is already handled by homeApiService (queued if offline)
      throw error;
    }
  }

  /**
   * Add location update to offline queue
   * @deprecated Use homeApiService.updateLocation instead
   */
  addToQueue(location: LocationUpdate): void {
    console.warn('[LocationService] addToQueue is deprecated, use homeApiService.updateLocation');
    offlineQueueService.addToQueue({
      latitude: location.latitude,
      longitude: location.longitude,
      speed: location.speed || 0,
      heading: location.heading || 0,
      timestamp: new Date(location.timestamp),
      status: location.status,
    });
  }

  /**
   * Process offline queue and send pending updates
   * @deprecated Queue is now processed automatically by offlineQueueService
   */
  async processQueue(): Promise<void> {
    console.warn('[LocationService] processQueue is deprecated, queue is processed automatically');
    await offlineQueueService.processQueue();
  }

  /**
   * Start periodic location updates (every 10 seconds in foreground, 30 seconds in background)
   */
  startPeriodicUpdates(getCurrentLocation: () => LocationUpdate | null): void {
    if (this.updateInterval) {
      console.log('[LocationService] Periodic updates already running');
      return;
    }

    // Get initial update frequency from performance service
    this.currentUpdateFrequency = performanceService.isInBackground() ? 30000 : 10000;

    console.log(`[LocationService] Starting periodic location updates (every ${this.currentUpdateFrequency}ms)`);

    this.updateInterval = setInterval(async () => {
      const location = getCurrentLocation();
      
      if (!location) {
        console.log('[LocationService] No location available for update');
        return;
      }

      try {
        await this.sendLocationUpdate(location);
        console.log('[LocationService] Location update sent successfully');
      } catch (error) {
        // Error already handled by homeApiService (queued if offline)
        console.log('[LocationService] Location update failed, queued for later');
      }
    }, this.currentUpdateFrequency);
  }

  /**
   * Update location update frequency and restart updates if active
   * Used to switch between foreground (10s) and background (30s) updates
   */
  updateLocationFrequency(interval: number, getCurrentLocation: () => LocationUpdate | null): void {
    console.log(`[LocationService] Updating location update frequency to ${interval}ms`);
    
    this.currentUpdateFrequency = interval;
    
    // Restart updates with new frequency if currently running
    if (this.updateInterval) {
      this.stopPeriodicUpdates();
      this.startPeriodicUpdates(getCurrentLocation);
    }
  }

  /**
   * Stop periodic location updates
   */
  stopPeriodicUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('[LocationService] Stopped periodic location updates');
    }
  }

  /**
   * Get queue size (for debugging/monitoring)
   */
  getQueueSize(): number {
    return offlineQueueService.getQueueSize();
  }

  /**
   * Clear the queue (useful for logout or reset)
   */
  clearQueue(): void {
    offlineQueueService.clearQueue();
    console.log('[LocationService] Location update queue cleared');
  }
}

export default new LocationService();
