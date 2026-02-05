import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';
import { useLocationStore } from '@/store/location.store';
import friendService from '@/services/friend.service';
import { colors, spacing, borderRadius, shadows, typography, iconSize } from '@/constants/theme';
import type { PlaceResponse } from '@/types/friend.types';

export default function PlaceDetailScreen() {
  const params = useLocalSearchParams();
  const placeId = parseInt(params.id as string);
  
  const { currentLocation } = useLocationStore();
  const [place, setPlace] = useState<PlaceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlaceDetail();
  }, [placeId]);

  const loadPlaceDetail = async () => {
    try {
      setIsLoading(true);
      const data = await friendService.getPlaceDetail(
        placeId,
        currentLocation?.latitude,
        currentLocation?.longitude
      );
      setPlace(data);
    } catch (error: any) {
      console.error('Failed to load place detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = () => {
    if (!place) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.openURL(url);
  };

  const handleCall = () => {
    if (!place?.phone) return;
    Linking.openURL(`tel:${place.phone}`);
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return 'Unknown';
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
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

  if (!place) {
    return (
      <LinearGradient
        colors={colors.gradient.space as any}
        style={styles.loadingContainer}
      >
        <Text style={styles.errorText}>Place not found</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={colors.gradient.space as any}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Image */}
        {place.imageUrl ? (
          <Image
            source={{ uri: place.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons
              name={getCategoryIcon(place.category) as any}
              size={iconSize['2xl']}
              color={colors.gray[400]}
            />
          </View>
        )}

        {/* Info */}
        <View style={styles.infoContainer}>
          {/* Name & Category */}
          <View style={styles.headerRow}>
            <View style={styles.headerInfo}>
              <Text style={styles.placeName}>
                {place.name}
              </Text>
              <Text style={styles.category}>
                {place.category.replace('_', ' ')}
              </Text>
            </View>
            {place.rating && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={20} color={colors.warning} />
                <Text style={styles.ratingText}>
                  {place.rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          {/* Distance */}
          <View style={styles.detailRow}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <Text style={styles.detailText}>
              {formatDistance(place.distance)}
            </Text>
          </View>

          {/* Address */}
          <View style={styles.detailRow}>
            <Ionicons name="map" size={20} color={colors.gray[400]} />
            <Text style={styles.detailTextFlex}>
              {place.address}
            </Text>
          </View>

          {/* Phone */}
          {place.phone && (
            <TouchableOpacity
              onPress={handleCall}
              style={styles.detailRow}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={20} color={colors.primary} />
              <Text style={styles.phoneText}>{place.phone}</Text>
            </TouchableOpacity>
          )}

          {/* Opening Hours */}
          {place.openingHours && (
            <View style={styles.detailRow}>
              <Ionicons name="time" size={20} color={colors.gray[400]} />
              <Text style={styles.detailTextFlex}>
                {place.openingHours}
              </Text>
            </View>
          )}

          {/* Description */}
          {place.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>About</Text>
              <Text style={styles.descriptionText}>
                {place.description}
              </Text>
            </View>
          )}
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: place.latitude,
              longitude: place.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title={place.name}
              description={place.address}
            />
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
          </MapView>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.navigateButton}
            onPress={handleNavigate}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="navigate" size={20} color={colors.light} />
              <Text style={styles.navigateButtonText}>
                Navigate
              </Text>
            </View>
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
  image: {
    width: '100%',
    height: 256,
  } as any,
  imagePlaceholder: {
    width: '100%',
    height: 256,
    backgroundColor: colors.cardBackground.deepSpace,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.light,
  },
  category: {
    fontSize: typography.fontSize.base,
    color: colors.gray[300],
    marginTop: spacing[1],
    textTransform: 'capitalize',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground.auroraGlow,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder.gold,
  },
  ratingText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    marginLeft: spacing[1],
    color: colors.light,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[3],
  },
  detailText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[300],
    marginLeft: spacing[2],
  },
  detailTextFlex: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.gray[300],
    marginLeft: spacing[2],
  },
  phoneText: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    marginLeft: spacing[2],
  },
  descriptionSection: {
    marginTop: spacing[4],
  },
  descriptionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold as any,
    marginBottom: spacing[2],
    color: colors.light,
  },
  descriptionText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[300],
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
  mapContainer: {
    height: 256,
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder.blue,
  },
  map: {
    flex: 1,
  },
  actionsContainer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  navigateButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[4],
    alignItems: 'center',
    ...shadows.md,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigateButtonText: {
    color: colors.light,
    fontWeight: typography.fontWeight.semibold as any,
    fontSize: typography.fontSize.base,
    marginLeft: spacing[2],
  },
});
