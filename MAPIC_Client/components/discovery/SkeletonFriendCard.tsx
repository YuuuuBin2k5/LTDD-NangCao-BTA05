/**
 * SkeletonFriendCard Component
 * Loading skeleton for friend cards
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

export default function SkeletonFriendCard() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.avatarSkeleton, { opacity }]} />
      <Animated.View style={[styles.nameSkeleton, { opacity }]} />
      <Animated.View style={[styles.infoSkeleton, { opacity }]} />
      <Animated.View style={[styles.statusSkeleton, { opacity }]} />
    </View>
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
  avatarSkeleton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gray[700],
    marginBottom: spacing[3],
  },
  nameSkeleton: {
    width: '70%',
    height: 16,
    backgroundColor: colors.gray[700],
    borderRadius: borderRadius.sm,
    marginBottom: spacing[2],
  },
  infoSkeleton: {
    width: '50%',
    height: 14,
    backgroundColor: colors.gray[700],
    borderRadius: borderRadius.sm,
    marginBottom: spacing[1],
  },
  statusSkeleton: {
    width: '60%',
    height: 12,
    backgroundColor: colors.gray[700],
    borderRadius: borderRadius.sm,
  },
});
