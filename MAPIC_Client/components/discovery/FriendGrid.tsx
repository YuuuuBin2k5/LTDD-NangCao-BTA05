/**
 * FriendGrid Component
 * 2-column grid of nearby friends
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import FriendGridCard from './FriendGridCard';
import SkeletonFriendCard from './SkeletonFriendCard';
import type { NearbyFriend } from '@/types/discovery';

interface FriendGridProps {
  friends: NearbyFriend[];
  loading?: boolean;
  onFriendPress: (friend: NearbyFriend) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function FriendGrid({
  friends,
  loading = false,
  onFriendPress,
  onRefresh,
  refreshing = false,
}: FriendGridProps) {
  if (loading) {
    return (
      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={() => (
          <View style={styles.cardWrapper}>
            <SkeletonFriendCard />
          </View>
        )}
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    );
  }

  if (friends.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>👥</Text>
        <Text style={styles.emptyText}>Không có bạn bè gần đây</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={friends}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <FriendGridCard friend={item} onPress={onFriendPress} />
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: spacing[1],
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing[2],
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing[3],
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[400],
    textAlign: 'center',
  },
});
