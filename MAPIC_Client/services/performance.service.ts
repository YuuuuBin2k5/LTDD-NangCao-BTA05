import { AppState, AppStateStatus } from 'react-native';
import * as Battery from 'expo-battery';

/**
 * Performance Service
 * Handles background performance optimization:
 * - Reduces polling frequency when app in background
 * - Implements battery-saving mode
 * - Monitors memory warnings
 * - Provides performance logging
 */

export interface PerformanceConfig {
  foregroundPollingInterval: number; // milliseconds
  backgroundPollingInterval: number; // milliseconds
  lowBatteryThreshold: number; // percentage (0-1)
  enableAnimations: boolean;
  enablePerformanceLogs: boolean;
}

export interface PerformanceMetrics {
  appState: AppStateStatus;
  batteryLevel: number;
  batteryState: Battery.BatteryState;
  isLowBattery: boolean;
  currentPollingInterval: number;
  animationsEnabled: boolean;
  memoryWarnings: number;
}

type AppStateListener = (state: AppStateStatus) => void;
type BatteryListener = (batteryLevel: number, batteryState: Battery.BatteryState) => void;
type MemoryWarningListener = () => void;

class PerformanceService {
  private config: PerformanceConfig = {
    foregroundPollingInterval: 5000, // 5 seconds
    backgroundPollingInterval: 30000, // 30 seconds
    lowBatteryThreshold: 0.20, // 20%
    enableAnimations: true,
    enablePerformanceLogs: true,
  };

  private metrics: PerformanceMetrics = {
    appState: AppState.currentState,
    batteryLevel: 1.0,
    batteryState: Battery.BatteryState.UNKNOWN,
    isLowBattery: false,
    currentPollingInterval: 5000,
    animationsEnabled: true,
    memoryWarnings: 0,
  };

  private appStateListeners: Set<AppStateListener> = new Set();
  private batteryListeners: Set<BatteryListener> = new Set();
  private memoryWarningListeners: Set<MemoryWarningListener> = new Set();
  
  private appStateSubscription: any = null;
  private batteryLevelSubscription: any = null;
  private batteryStateSubscription: any = null;

  /**
   * Initialize performance monitoring
   */
  async initialize(): Promise<void> {
    this.log('Initializing performance service');

    // Monitor app state changes
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);

    // Monitor battery level
    try {
      const batteryLevel = await Battery.getBatteryLevelAsync();
      const batteryState = await Battery.getBatteryStateAsync();
      
      this.updateBatteryMetrics(batteryLevel, batteryState);

      // Subscribe to battery updates
      this.batteryLevelSubscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
        this.handleBatteryLevelChange(batteryLevel);
      });

      this.batteryStateSubscription = Battery.addBatteryStateListener(({ batteryState }) => {
        this.handleBatteryStateChange(batteryState);
      });
    } catch (error) {
      console.error('[Performance] Failed to initialize battery monitoring:', error);
    }

    this.log('Performance service initialized', this.metrics);
  }

  /**
   * Cleanup and remove listeners
   */
  cleanup(): void {
    this.log('Cleaning up performance service');

    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }

    if (this.batteryLevelSubscription) {
      this.batteryLevelSubscription.remove();
    }

    if (this.batteryStateSubscription) {
      this.batteryStateSubscription.remove();
    }

    this.appStateListeners.clear();
    this.batteryListeners.clear();
    this.memoryWarningListeners.clear();
  }

  /**
   * Handle app state changes (foreground/background)
   */
  private handleAppStateChange = (nextAppState: AppStateStatus): void => {
    const previousState = this.metrics.appState;
    this.metrics.appState = nextAppState;

    this.log(`App state changed: ${previousState} -> ${nextAppState}`);

    // Update polling interval based on app state
    if (nextAppState === 'background') {
      this.metrics.currentPollingInterval = this.config.backgroundPollingInterval;
      this.log(`Reduced polling to ${this.config.backgroundPollingInterval}ms (background)`);
    } else if (nextAppState === 'active') {
      this.metrics.currentPollingInterval = this.config.foregroundPollingInterval;
      this.log(`Restored polling to ${this.config.foregroundPollingInterval}ms (foreground)`);
    }

    // Notify listeners
    this.appStateListeners.forEach((listener) => listener(nextAppState));
  };

  /**
   * Handle battery level changes
   */
  private handleBatteryLevelChange = (batteryLevel: number): void => {
    const previousLevel = this.metrics.batteryLevel;
    this.updateBatteryMetrics(batteryLevel, this.metrics.batteryState);

    if (Math.abs(previousLevel - batteryLevel) > 0.05) {
      this.log(`Battery level changed: ${(previousLevel * 100).toFixed(0)}% -> ${(batteryLevel * 100).toFixed(0)}%`);
    }

    // Notify listeners
    this.batteryListeners.forEach((listener) => 
      listener(batteryLevel, this.metrics.batteryState)
    );
  };

  /**
   * Handle battery state changes
   */
  private handleBatteryStateChange = (batteryState: Battery.BatteryState): void => {
    const previousState = this.metrics.batteryState;
    this.updateBatteryMetrics(this.metrics.batteryLevel, batteryState);

    this.log(`Battery state changed: ${previousState} -> ${batteryState}`);

    // Notify listeners
    this.batteryListeners.forEach((listener) => 
      listener(this.metrics.batteryLevel, batteryState)
    );
  };

  /**
   * Update battery metrics and check for low battery
   */
  private updateBatteryMetrics(batteryLevel: number, batteryState: Battery.BatteryState): void {
    this.metrics.batteryLevel = batteryLevel;
    this.metrics.batteryState = batteryState;

    const wasLowBattery = this.metrics.isLowBattery;
    this.metrics.isLowBattery = batteryLevel < this.config.lowBatteryThreshold;

    // Enable/disable animations based on battery
    if (this.metrics.isLowBattery && this.metrics.animationsEnabled) {
      this.metrics.animationsEnabled = false;
      this.log(`Low battery detected (${(batteryLevel * 100).toFixed(0)}%), disabling animations`);
    } else if (!this.metrics.isLowBattery && !this.metrics.animationsEnabled && wasLowBattery) {
      this.metrics.animationsEnabled = true;
      this.log(`Battery restored (${(batteryLevel * 100).toFixed(0)}%), enabling animations`);
    }
  }

  /**
   * Handle memory warnings
   */
  handleMemoryWarning(): void {
    this.metrics.memoryWarnings++;
    this.log(`Memory warning received (total: ${this.metrics.memoryWarnings})`);

    // Notify listeners to clear caches
    this.memoryWarningListeners.forEach((listener) => listener());
  }

  /**
   * Subscribe to app state changes
   */
  onAppStateChange(listener: AppStateListener): () => void {
    this.appStateListeners.add(listener);
    return () => this.appStateListeners.delete(listener);
  }

  /**
   * Subscribe to battery changes
   */
  onBatteryChange(listener: BatteryListener): () => void {
    this.batteryListeners.add(listener);
    return () => this.batteryListeners.delete(listener);
  }

  /**
   * Subscribe to memory warnings
   */
  onMemoryWarning(listener: MemoryWarningListener): () => void {
    this.memoryWarningListeners.add(listener);
    return () => this.memoryWarningListeners.delete(listener);
  }

  /**
   * Get current polling interval based on app state
   */
  getCurrentPollingInterval(): number {
    return this.metrics.currentPollingInterval;
  }

  /**
   * Check if app is in background
   */
  isInBackground(): boolean {
    return this.metrics.appState === 'background' || this.metrics.appState === 'inactive';
  }

  /**
   * Check if battery is low
   */
  isLowBattery(): boolean {
    return this.metrics.isLowBattery;
  }

  /**
   * Check if animations should be enabled
   */
  shouldEnableAnimations(): boolean {
    return this.metrics.animationsEnabled;
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...config };
    this.log('Configuration updated', this.config);
  }

  /**
   * Performance logging
   */
  private log(message: string, data?: any): void {
    if (this.config.enablePerformanceLogs) {
      const timestamp = new Date().toISOString();
      if (data) {
        console.log(`[Performance] ${timestamp} - ${message}`, data);
      } else {
        console.log(`[Performance] ${timestamp} - ${message}`);
      }
    }
  }

  /**
   * Log performance metrics
   */
  logMetrics(): void {
    this.log('Current metrics', {
      appState: this.metrics.appState,
      batteryLevel: `${(this.metrics.batteryLevel * 100).toFixed(0)}%`,
      batteryState: this.metrics.batteryState,
      isLowBattery: this.metrics.isLowBattery,
      currentPollingInterval: `${this.metrics.currentPollingInterval}ms`,
      animationsEnabled: this.metrics.animationsEnabled,
      memoryWarnings: this.metrics.memoryWarnings,
    });
  }
}

export default new PerformanceService();
