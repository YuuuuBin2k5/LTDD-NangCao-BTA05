/**
 * DiscoveryPanel Component
 * Main discovery panel with categories, places, and friends
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { useDiscoveryStore } from '@/store/discoveryStore';
import { useAuthStore } from '@/store/auth.store';
import CategoryChips from './CategoryChips';
import PlaceCarousel from './PlaceCarousel';
import FriendGrid from './FriendGrid';
import ErrorState from './ErrorState';
import OfflineIndicator from './OfflineIndicator';
import type { PopularPlace, NearbyFriend } from '@/types/discovery';

interface DiscoveryPanelProps {
  latitude: number;
  longitude: number;
  onPlacePress: (place: PopularPlace) => void;
  onFriendPress: (friend: NearbyFriend) => void;
}

export default function DiscoveryPanel({
  latitude,
  longitude,
  onPlacePress,
  onFriendPress,
}: DiscoveryPanelProps) {
  const token = useAuthStore((state) => state.token);
  
  const {
    categories,
    selectedCategory,
    popularPlaces,
    nearbyFriends,
    categoriesLoading,
    placesLoading,
    friendsLoading,
    categoriesError,
    placesError,
    friendsError,
    fetchCategories,
    selectCategory,
    fetchPopularPlaces,
    fetchNearbyFriends,
    refreshAll,
  } = useDiscoveryStore();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadData();
  }, [latitude, longitude]);

  const loadData = async () => {
    if (token) {
      await refreshAll(latitude, longitude, token);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <OfflineIndicator />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={selectCategory}
            loading={categoriesLoading}
          />
        </View>

        {/* Popular Places Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa điểm phổ biến</Text>
          {placesError ? (
            <ErrorState 
              message={placesError}
              onRetry={() => fetchPopularPlaces(latitude, longitude)}
            />
          ) : (
            <PlaceCarousel
              places={popularPlaces}
              loading={placesLoading}
              onPlacePress={onPlacePress}
            />
          )}
        </View>

        {/* Nearby Friends Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bạn bè gần đây</Text>
          {friendsError ? (
            <ErrorState 
              message={friendsError}
              onRetry={() => token && fetchNearbyFriends(latitude, longitude, token)}
            />
          ) : (
            <FriendGrid
              friends={nearbyFriends}
              loading={friendsLoading}
              onFriendPress={onFriendPress}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700' as const,
    color: colors.light,
    paddingHorizontal: spacing[4],
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
});
