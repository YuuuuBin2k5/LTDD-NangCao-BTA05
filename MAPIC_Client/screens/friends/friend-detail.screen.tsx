import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useAuthStore } from '@/store/auth.store';
import { useLocationStore } from '@/store/location.store';
import friendService from '@/services/friend.service';
import { colors, spacing, borderRadius, shadows, avatarSize, typography } from '@/constants/theme';
import type { FriendProfileResponse } from '@/types/friend.types';

export default function FriendDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const friendId = parseInt(params.id as string);
  
  const { token } = useAuthStore();
  const { currentLocation } = useLocationStore();
  
  const [friend, setFriend] = useState<FriendProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFriendProfile();
  }, [friendId]);

  const loadFriendProfile = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const data = await friendService.getFriendProfile(
        friendId,
        currentLocation?.latitude,
        currentLocation?.longitude,
        token
      );
      setFriend(data);
    } catch (error: any) {
      console.error('Failed to load friend profile:', error);
      Alert.alert('Error', 'Failed to load friend profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = () => {
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${friend?.fullName} from your friends?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await friendService.removeFriend(friendId, token!);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to remove friend');
            }
          },
        },
      ]
    );
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return 'Unknown';
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return '#10b981';
      case 'AWAY':
        return '#f59e0b';
      case 'OFFLINE':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={colors.gradient.space as any}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </LinearGradient>
    );
  }

  if (!friend) {
    return (
      <LinearGradient
        colors={colors.gradient.space as any}
        style={styles.loadingContainer}
      >
        <Text style={styles.errorText}>Friend not found</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={colors.gradient.space as any}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {friend.avatarUrl ? (
              <Image
                source={{ uri: friend.avatarUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {friend.fullName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor(friend.status) }
              ]}
            />
          </View>

          {/* Name & Status */}
          <Text style={styles.name}>
            {friend.fullName}
          </Text>
          <Text style={styles.email}>{friend.email}</Text>
          {friend.phone && (
            <Text style={styles.phone}>{friend.phone}</Text>
          )}
          <Text style={styles.statusText}>
            {friend.status} • {friend.activityStatus || 'Unknown'}
          </Text>
        </View>

        {/* Location Info */}
        <View style={styles.locationInfo}>
          <View style={styles.locationHeader}>
            <View style={styles.locationTitleRow}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={styles.locationTitle}>Current Location</Text>
            </View>
            <Text style={styles.distance}>
              {formatDistance(friend.distance)} away
            </Text>
          </View>
          <Text style={styles.lastSeen}>
            Last seen: {new Date(friend.lastSeen).toLocaleString()}
          </Text>
        </View>

        {/* Mini Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: friend.latitude,
              longitude: friend.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* Friend's current location */}
            <Marker
              coordinate={{
                latitude: friend.latitude,
                longitude: friend.longitude,
              }}
              title={friend.fullName}
              description={friend.activityStatus}
            >
              <View style={styles.markerContainer}>
                {friend.avatarUrl ? (
                  <Image
                    source={{ uri: friend.avatarUrl }}
                    style={styles.markerAvatar}
                  />
                ) : (
                  <View style={styles.markerAvatarPlaceholder}>
                    <Text style={styles.markerAvatarText}>
                      {friend.fullName.charAt(0)}
                    </Text>
                  </View>
                )}
              </View>
            </Marker>

            {/* Your location */}
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="You"
                pinColor={colors.success}
              />
            )}

            {/* Location history trail */}
            {friend.locationHistory && friend.locationHistory.length > 0 && (
              <Polyline
                coordinates={friend.locationHistory.map((loc) => ({
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                }))}
                strokeColor={colors.primary}
                strokeWidth={2}
                lineDashPattern={[5, 5]}
              />
            )}
          </MapView>
        </View>

        {/* Location History */}
        {friend.locationHistory && friend.locationHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>
              Location History (Last 24h)
            </Text>
            {friend.locationHistory.slice(0, 10).map((loc, index) => (
              <View
                key={index}
                style={styles.historyItem}
              >
                <Ionicons name="location-outline" size={16} color={colors.gray[400]} />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyCoords}>
                    {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                  </Text>
                  <Text style={styles.historyTime}>
                    {new Date(loc.timestamp).toLocaleString()}
                  </Text>
                </View>
                {loc.status && (
                  <Text style={styles.historyStatus}>{loc.status}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              router.push(`/(tabs)/home?focusUser=${friendId}`);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>View on Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleRemoveFriend}
            activeOpacity={0.7}
          >
            <Text style={styles.dangerButtonText}>Remove Friend</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.gray[400],
    fontSize: typography.fontSize.base,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
    backgroundColor: colors.cardBackground.cosmicBlend,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder.blue,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: avatarSize['2xl'],
    height: avatarSize['2xl'],
    borderRadius: avatarSize['2xl'] / 2,
    borderWidth: 3,
    borderColor: colors.primary,
  } as any,
  avatarPlaceholder: {
    width: avatarSize['2xl'],
    height: avatarSize['2xl'],
    borderRadius: avatarSize['2xl'] / 2,
    backgroundColor: colors.cardBackground.starlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarText: {
    color: colors.primary,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold as any,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: colors.light,
  },
  name: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.light,
    marginTop: spacing[4],
  },
  email: {
    fontSize: typography.fontSize.base,
    color: colors.gray[300],
    marginTop: spacing[1],
  },
  phone: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
    marginTop: spacing[1],
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
    marginTop: spacing[2],
  },
  locationInfo: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder.white,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
    marginLeft: spacing[2],
    color: colors.light,
  },
  distance: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[300],
  },
  lastSeen: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[300],
  },
  mapContainer: {
    height: 256,
    backgroundColor: colors.cardBackground.deepSpace,
    borderRadius: borderRadius.lg,
    margin: spacing[4],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder.blue,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  } as any,
  markerAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.light,
  },
  markerAvatarText: {
    color: colors.light,
    fontWeight: typography.fontWeight.bold as any,
  },
  historySection: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  historyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    marginBottom: spacing[3],
    color: colors.light,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder.white,
  },
  historyInfo: {
    flex: 1,
    marginLeft: spacing[2],
  },
  historyCoords: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[300],
  },
  historyTime: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },
  historyStatus: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
  },
  actionsContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[3],
    alignItems: 'center',
    ...shadows.md,
  },
  primaryButtonText: {
    color: colors.light,
    fontWeight: typography.fontWeight.semibold as any,
    fontSize: typography.fontSize.base,
  },
  dangerButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[3],
    alignItems: 'center',
    ...shadows.md,
  },
  dangerButtonText: {
    color: colors.light,
    fontWeight: typography.fontWeight.semibold as any,
    fontSize: typography.fontSize.base,
  },
});
