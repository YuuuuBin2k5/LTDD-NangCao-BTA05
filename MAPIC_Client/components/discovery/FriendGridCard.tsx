/**
 * FriendGridCard Component
 * Card displaying friend info with avatar, status, distance
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { formatDistance } from '@/utils/distance';
import { formatRelativeTime } from '@/utils/time';
import type { NearbyFriend } from '@/types/discovery';

interface FriendGridCardProps {
  friend: NearbyFriend;
  onPress: (friend: NearbyFriend) => void;
}

export default function FriendGridCard({ friend, onPress }: FriendGridCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return colors.success;
      case 'AWAY':
        return colors.warning;
      case 'OFFLINE':
      default:
        return colors.gray[500];
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(friend)}
      activeOpacity={0.8}
    >
      <View style={styles.avatarContainer}>
        {friend.avatarUrl ? (
          <Image
            source={{ uri: friend.avatarUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {friend.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.statusDot,
            { backgroundColor: getStatusColor(friend.status) },
          ]}
        />
      </View>
      
      <Text style={styles.name} numberOfLines={1}>
        {friend.fullName}
      </Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.distance}>{formatDistance(friend.distance)}</Text>
      </View>
      
      <Text style={styles.lastSeen} numberOfLines={1}>
        {formatRelativeTime(friend.lastSeen)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.cardBackground.frostedBlue,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder.blue,
    padding: spacing[4],
    alignItems: 'center',
    ...shadows.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing[3],
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.background,
  },
  name: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.light,
    marginBottom: spacing[1],
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  icon: {
    fontSize: typography.fontSize.sm,
    marginRight: spacing[1],
  },
  distance: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[300],
    fontWeight: typography.fontWeight.medium,
  },
  lastSeen: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    textAlign: 'center',
  },
});
