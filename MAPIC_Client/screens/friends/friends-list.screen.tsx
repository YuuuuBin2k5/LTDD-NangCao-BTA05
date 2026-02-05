import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/auth.store';
import { useLocationStore } from '@/store/location.store';
import friendService from '@/services/friend.service';
import type { FriendResponse } from '@/types/friend.types';
import FriendCard from '@/components/friends/FriendCard';
import FilterButtons from '@/components/friends/FilterButtons';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';

export default function FriendsListScreen() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { currentLocation } = useLocationStore();
  
  const [friends, setFriends] = useState<FriendResponse[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<FriendResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE'>('ALL');
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [activityFilter, setActivityFilter] = useState<string | null>(null);

  useEffect(() => {
    loadFriends();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [friends, searchQuery, statusFilter, distanceFilter, activityFilter]);

  const loadFriends = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const data = await friendService.getFriendsList(
        {
          userLatitude: currentLocation?.latitude,
          userLongitude: currentLocation?.longitude,
        },
        token
      );
      setFriends(data);
    } catch (error: any) {
      console.error('Failed to load friends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadFriends();
    setIsRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...friends];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (friend) =>
          friend.fullName.toLowerCase().includes(query) ||
          friend.email.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((friend) => friend.status === statusFilter);
    }

    // Distance filter
    if (distanceFilter && currentLocation) {
      filtered = filtered.filter(
        (friend) => friend.distance && friend.distance <= distanceFilter
      );
    }

    // Activity filter
    if (activityFilter) {
      filtered = filtered.filter(
        (friend) => friend.activityStatus === activityFilter
      );
    }

    setFilteredFriends(filtered);
  };

  const handleFriendPress = (friend: FriendResponse) => {
    router.push(`/friends/${friend.id}`);
  };

  return (
    <LinearGradient
      colors={[colors.pageBackground.friends, colors.background]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends</Text>
        <Text style={styles.headerSubtitle}>
          {filteredFriends.length} {filteredFriends.length === 1 ? 'friend' : 'friends'}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            placeholderTextColor={colors.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Buttons */}
      <FilterButtons
        statusFilter={statusFilter}
        distanceFilter={distanceFilter}
        activityFilter={activityFilter}
        onStatusChange={setStatusFilter}
        onDistanceChange={setDistanceFilter}
        onActivityChange={setActivityFilter}
      />

      {/* Friends List */}
      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading friends...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <FriendCard friend={item} onPress={() => handleFriendPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshing} 
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={80} color={colors.gray[600]} />
              <Text style={styles.emptyTitle}>
                {searchQuery || statusFilter !== 'ALL' || distanceFilter || activityFilter
                  ? 'No friends found'
                  : 'No friends yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || statusFilter !== 'ALL' || distanceFilter || activityFilter
                  ? 'Try adjusting your filters'
                  : 'Add friends to see them here'}
              </Text>
            </View>
          }
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[12],
    paddingBottom: spacing[4],
  },
  headerTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.light,
    marginBottom: spacing[1],
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
  },
  searchContainer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground.frostedBlue,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderWidth: 1,
    borderColor: colors.cardBorder.blue,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing[2],
    fontSize: typography.fontSize.base,
    color: colors.light,
  },
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing[3],
    fontSize: typography.fontSize.base,
    color: colors.gray[400],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[20],
  },
  emptyTitle: {
    marginTop: spacing[4],
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.light,
  },
  emptySubtitle: {
    marginTop: spacing[2],
    fontSize: typography.fontSize.base,
    color: colors.gray[400],
    textAlign: 'center',
  },
});
