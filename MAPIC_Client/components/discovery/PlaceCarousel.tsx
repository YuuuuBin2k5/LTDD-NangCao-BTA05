/**
 * PlaceCarousel Component
 * Horizontal carousel of popular places with pagination
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import PlaceCard from './PlaceCard';
import SkeletonCard from './SkeletonCard';
import type { PopularPlace } from '@/types/discovery';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 280;
const CARD_SPACING = 16;

interface PlaceCarouselProps {
  places: PopularPlace[];
  loading?: boolean;
  onPlacePress: (place: PopularPlace) => void;
}

export default function PlaceCarousel({
  places,
  loading = false,
  onPlacePress,
}: PlaceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_SPACING));
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <FlatList
          data={[1, 2, 3]}
          renderItem={() => <SkeletonCard />}
          keyExtractor={(item) => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  }

  if (places.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔥</Text>
        <Text style={styles.emptyText}>Chưa có địa điểm phổ biến</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={places}
        renderItem={({ item }) => (
          <PlaceCard place={item} onPress={onPlacePress} />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />
      
      {places.length > 1 && (
        <View style={styles.pagination}>
          {places.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing[3],
  },
  listContent: {
    paddingHorizontal: spacing[4],
  },
  loadingContainer: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing[2],
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
  },
  emptyContainer: {
    height: 320,
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[3],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[600],
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
});
