/**
 * Example: How to use Friends Location API in Home Screen
 * 
 * This example demonstrates:
 * 1. Polling friends locations every 5 seconds
 * 2. Rendering friends avatars on map
 * 3. Handling loading and error states
 * 4. Offline fallback to Realm cache
 */

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useFriendsStore } from '@/store';
import { Avatar } from '@/components/map';
import { WeatherCondition } from '@/types/avatar.types';

export function HomeScreenExample() {
  const { 
    friendsLocations, 
    isLoading, 
    error, 
    startPolling, 
    stopPolling 
  } = useFriendsStore();

  // Start polling on mount, stop on unmount
  useEffect(() => {
    console.log('[HomeScreen] Starting friends location polling');
    startPolling();
    
    return () => {
      console.log('[HomeScreen] Stopping friends location polling');
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 10.762622,
          longitude: 106.660172,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Render friends avatars */}
        {friendsLocations.map((friend) => (
          <Marker
            key={friend.userId}
            coordinate={{
              latitude: friend.latitude,
              longitude: friend.longitude,
            }}
          >
            <Avatar
              user={{ id: friend.userId, name: 'Friend' }}
              speed={friend.speed}
              status={friend.status as any}
              weather={WeatherCondition.CLEAR}
            />
          </Marker>
        ))}
      </MapView>

      {/* Loading indicator */}
      {isLoading && friendsLocations.length === 0 && (
        <View style={{ 
          position: 'absolute', 
          top: 50, 
          alignSelf: 'center',
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 8,
        }}>
          <ActivityIndicator />
          <Text>Loading friends...</Text>
        </View>
      )}

      {/* Error indicator */}
      {error && (
        <View style={{ 
          position: 'absolute', 
          top: 50, 
          alignSelf: 'center',
          backgroundColor: '#ffebee',
          padding: 10,
          borderRadius: 8,
        }}>
          <Text style={{ color: '#c62828' }}>
            {error}
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            Using cached data
          </Text>
        </View>
      )}

      {/* Friends count */}
      <View style={{ 
        position: 'absolute', 
        bottom: 100, 
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
      }}>
        <Text>
          {friendsLocations.length} friends online
        </Text>
      </View>
    </View>
  );
}

/**
 * Example: Manual fetch without polling
 */
export function ManualFetchExample() {
  const { friendsLocations, fetchFriendsLocations, isLoading } = useFriendsStore();

  const handleRefresh = async () => {
    await fetchFriendsLocations();
  };

  return (
    <View>
      <button onClick={handleRefresh} disabled={isLoading}>
        {isLoading ? 'Refreshing...' : 'Refresh Locations'}
      </button>
      
      <Text>Found {friendsLocations.length} friends</Text>
      
      {friendsLocations.map((friend) => (
        <View key={friend.userId}>
          <Text>User: {friend.userId}</Text>
          <Text>Location: {friend.latitude}, {friend.longitude}</Text>
          <Text>Speed: {friend.speed} km/h</Text>
          <Text>Status: {friend.status}</Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Example: Load from cache only (offline mode)
 */
export function OfflineModeExample() {
  const { friendsLocations, loadFromCache } = useFriendsStore();

  useEffect(() => {
    // Load cached locations on mount
    loadFromCache();
  }, [loadFromCache]);

  return (
    <View>
      <Text>Offline Mode - Cached Locations</Text>
      <Text>{friendsLocations.length} friends (from cache)</Text>
    </View>
  );
}
