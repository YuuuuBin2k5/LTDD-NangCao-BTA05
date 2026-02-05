import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, avatarSize, typography } from '@/constants/theme';
import type { FriendResponse } from '@/types/friend.types';

interface FriendCardProps {
  friend: FriendResponse;
  onPress: () => void;
}

export default function FriendCard({ friend, onPress }: FriendCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return colors.success;
      case 'AWAY':
        return colors.warning;
      case 'OFFLINE':
        return colors.gray[400];
      default:
        return colors.gray[400];
    }
  };

  const getActivityIcon = (activity?: string) => {
    switch (activity) {
      case 'walking':
        return 'walk';
      case 'biking':
        return 'bicycle';
      case 'driving':
        return 'car';
      case 'stationary':
        return 'location';
      default:
        return 'location';
    }
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.7}
    >
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
        {/* Status Indicator */}
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(friend.status) }
          ]}
        />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {friend.fullName}
        </Text>
        <View style={styles.detailsRow}>
          <Ionicons
            name={getActivityIcon(friend.activityStatus) as any}
            size={14}
            color={colors.gray[500]}
          />
          <Text style={styles.distance}>
            {formatDistance(friend.distance)}
          </Text>
          {friend.activityStatus && (
            <Text style={styles.activity}>
              • {friend.activityStatus}
            </Text>
          )}
        </View>
      </View>

      {/* Arrow */}
      <Ionicons name="chevron-forward" size={20} color={colors.cardBorder.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground.frostedBlue,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
    borderWidth: 1,
    borderColor: colors.cardBorder.blue,
    ...shadows.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: avatarSize.lg,
    height: avatarSize.lg,
    borderRadius: avatarSize.lg / 2,
    borderWidth: 2,
    borderColor: colors.primary,
  } as any,
  avatarPlaceholder: {
    width: avatarSize.lg,
    height: avatarSize.lg,
    borderRadius: avatarSize.lg / 2,
    backgroundColor: colors.cardBackground.starlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: {
    color: colors.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.light,
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing[3],
  },
  name: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.light,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  distance: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[300],
    marginLeft: spacing[1],
  },
  activity: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
    marginLeft: spacing[2],
  },
});
