/**
 * Offline Mode Usage Examples
 * 
 * This file demonstrates how to use the offline mode features
 */

import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAppStore } from '@/store/app.store';
import offlineQueueService from '@/services/offline-queue.service';
import homeApiService from '@/services/api/home.service';

/**
 * Example 1: Display Online/Offline Status
 */
export const OnlineStatusExample: React.FC = () => {
  const isOnline = useAppStore((state) => state.isOnline);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Status</Text>
      <Text style={[styles.status, isOnline ? styles.online : styles.offline]}>
        {isOnline ? '🟢 Online' : '🔴 Offline'}
      </Text>
    </View>
  );
};

/**
 * Example 2: Monitor Queue Size
 */
export const QueueMonitorExample: React.FC = () => {
  const [queueSize, setQueueSize] = React.useState(0);

  useEffect(() => {
    // Update queue size every 5 seconds
    const interval = setInterval(() => {
      const size = offlineQueueService.getQueueSize();
      setQueueSize(size);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Updates</Text>
      <Text style={styles.queueSize}>{queueSize}</Text>
      <Text style={styles.subtitle}>
        {queueSize > 0 
          ? 'Updates will sync when online' 
          : 'All updates synced'}
      </Text>
    </View>
  );
};

/**
 * Example 3: Manual Queue Management
 */
export const QueueManagementExample: React.FC = () => {
  const [queueSize, setQueueSize] = React.useState(0);

  const updateQueueSize = () => {
    setQueueSize(offlineQueueService.getQueueSize());
  };

  const handleProcessQueue = async () => {
    console.log('Processing queue manually...');
    await offlineQueueService.processQueue();
    updateQueueSize();
  };

  const handleClearQueue = () => {
    console.log('Clearing queue...');
    offlineQueueService.clearQueue();
    updateQueueSize();
  };

  useEffect(() => {
    updateQueueSize();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Queue Management</Text>
      <Text style={styles.queueSize}>Queue Size: {queueSize}</Text>
      
      <Button 
        title="Process Queue" 
        onPress={handleProcessQueue}
      />
      
      <Button 
        title="Clear Queue" 
        onPress={handleClearQueue}
        color="red"
      />
    </View>
  );
};

/**
 * Example 4: Fetch Data with Cache Fallback
 */
export const CacheFallbackExample: React.FC = () => {
  const [locations, setLocations] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [source, setSource] = React.useState<'api' | 'cache'>('api');
  const isOnline = useAppStore((state) => state.isOnline);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      // This will automatically fallback to cache if offline
      const data = await homeApiService.getFriendsLocations();
      setLocations(data);
      setSource(isOnline ? 'api' : 'cache');
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends Locations</Text>
      
      <Text style={styles.subtitle}>
        Source: {source === 'api' ? '🌐 API' : '💾 Cache'}
      </Text>
      
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <Text>{locations.length} friends found</Text>
      )}
      
      <Button 
        title="Refresh" 
        onPress={fetchLocations}
      />
    </View>
  );
};

/**
 * Example 5: Send Location with Auto-Queue
 */
export const SendLocationExample: React.FC = () => {
  const [lastSent, setLastSent] = React.useState<Date | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const isOnline = useAppStore((state) => state.isOnline);

  const sendLocation = async () => {
    try {
      setError(null);
      
      // This will automatically queue if offline
      await homeApiService.updateLocation({
        latitude: 10.762622,
        longitude: 106.660172,
        speed: 15,
        heading: 90,
        timestamp: new Date(),
        status: 'biking',
      });
      
      setLastSent(new Date());
      
      if (!isOnline) {
        console.log('Location queued for later sync');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Location</Text>
      
      {lastSent && (
        <Text style={styles.subtitle}>
          Last sent: {lastSent.toLocaleTimeString()}
        </Text>
      )}
      
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
      
      <Button 
        title={isOnline ? 'Send Now' : 'Queue for Later'}
        onPress={sendLocation}
      />
      
      {!isOnline && (
        <Text style={styles.warning}>
          ⚠️ Offline - Update will be queued
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2C2C2C',
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  status: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
  },
  online: {
    color: '#4CAF50',
  },
  offline: {
    color: '#F44336',
  },
  queueSize: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00A0E9',
    marginVertical: 8,
  },
  error: {
    color: '#F44336',
    fontSize: 12,
    marginVertical: 4,
  },
  warning: {
    color: '#FF9800',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});
