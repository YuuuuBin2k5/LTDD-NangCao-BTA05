/**
 * SkeletonCard Component
 * Loading skeleton for place cards
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

export default function SkeletonCard() {
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
      <Animated.View style={[styles.imageSkeleton, { opacity }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.titleSkeleton, { opacity }]} />
        <Animated.View style={[styles.subtitleSkeleton, { opacity }]} />
        <Animated.View style={[styles.infoSkeleton, { opacity }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 320,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.cardBackground.frostedBlue,
    borderWidth: 1,
    borderColor: colors.cardBorder.blue,
    overflow: 'hidden',
    marginRight: spacing[4],
    ...shadows.md,
  },
  imageSkeleton: {
    width: '100%',
    height: 180,
    backgroundColor: colors.gray[700],
  },
  content: {
    padding: spacing[4],
  },
  titleSkeleton: {
    width: '80%',
    height: 20,
    backgroundColor: colors.gray[700],
    borderRadius: borderRadius.sm,
    marginBottom: spacing[2],
  },
  subtitleSkeleton: {
    width: '60%',
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
  },
});
