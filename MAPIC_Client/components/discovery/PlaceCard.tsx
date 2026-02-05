/**
 * PlaceCard Component
 * Card displaying place information with image, rating, distance
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
import type { PopularPlace } from '@/types/discovery';

interface PlaceCardProps {
  place: PopularPlace;
  onPress: (place: PopularPlace) => void;
}

export default function PlaceCard({ place, onPress }: PlaceCardProps) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    
    return stars.join('');
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(place)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {place.photoUrl ? (
          <Image
            source={{ uri: place.photoUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderIcon}>📍</Text>
          </View>
        )}
        <View style={styles.gradient} />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{place.category}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {place.name}
        </Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.stars}>{renderStars(place.rating)}</Text>
          <Text style={styles.rating}>{place.rating.toFixed(1)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={styles.infoText}>{formatDistance(place.distance)}</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.infoIcon}>✓</Text>
          <Text style={styles.infoText}>{place.checkInCount} check-ins</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: colors.cardBackground.deepSpace,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
  },
  categoryText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  content: {
    padding: spacing[4],
  },
  name: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.light,
    marginBottom: spacing[2],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  stars: {
    fontSize: typography.fontSize.sm,
    marginRight: spacing[1],
  },
  rating: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent,
  },
  infoIcon: {
    fontSize: typography.fontSize.sm,
    marginRight: spacing[1],
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[300],
  },
  separator: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginHorizontal: spacing[2],
  },
});
