import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/constants/theme';
import type { PlaceResponse } from '@/types/friend.types';

interface PlaceBottomSheetProps {
  places: PlaceResponse[];
  onPlaceSelect: (place: PlaceResponse) => void;
  onClose: () => void;
}

export default function PlaceBottomSheet({
  places,
  onPlaceSelect,
  onClose,
}: PlaceBottomSheetProps) {
  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'restaurant':
        return 'restaurant';
      case 'cafe':
        return 'cafe';
      case 'park':
        return 'leaf';
      case 'hospital':
        return 'medical';
      case 'gas_station':
        return 'car';
      default:
        return 'location';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {places.length} {places.length === 1 ? 'Place' : 'Places'} Found
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.gray[400]} />
        </TouchableOpacity>
      </View>

      {/* Places List */}
      <ScrollView style={styles.scrollView}>
        {places.map((place) => (
          <TouchableOpacity
            key={place.id}
            onPress={() => onPlaceSelect(place)}
            style={styles.placeItem}
            activeOpacity={0.7}
          >
            {/* Icon/Image */}
            {place.imageUrl ? (
              <Image
                source={{ uri: place.imageUrl }}
                style={styles.placeImage}
              />
            ) : (
              <View style={styles.placeIconContainer}>
                <Ionicons
                  name={getCategoryIcon(place.category) as any}
                  size={24}
                  color={colors.primary}
                />
              </View>
            )}

            {/* Info */}
            <View style={styles.placeInfo}>
              <Text style={styles.placeName} numberOfLines={1}>
                {place.name}
              </Text>
              <Text style={styles.placeDetails}>
                {place.category} • {formatDistance(place.distance)}
              </Text>
              {place.rating && (
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color={colors.warning} />
                  <Text style={styles.ratingText}>
                    {place.rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>

            <Ionicons name="chevron-forward" size={20} color={colors.cardBorder.white} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground.cosmicBlend,
    borderTopLeftRadius: borderRadius['3xl'],
    borderTopRightRadius: borderRadius['3xl'],
    maxHeight: 384,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.cardBorder.blue,
    ...shadows.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder.white,
  },
  headerText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.light,
  },
  scrollView: {
    flex: 1,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder.white,
  },
  placeImage: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder.blue,
  },
  placeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardBackground.starlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder.blue,
  },
  placeInfo: {
    flex: 1,
    marginLeft: spacing[3],
  },
  placeName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.light,
  },
  placeDetails: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[300],
    marginTop: spacing[1],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[300],
    marginLeft: spacing[1],
  },
});
