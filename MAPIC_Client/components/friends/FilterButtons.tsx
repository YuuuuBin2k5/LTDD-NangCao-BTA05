import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

interface FilterButtonsProps {
  statusFilter: 'ALL' | 'ONLINE' | 'OFFLINE';
  distanceFilter: number | null;
  activityFilter: string | null;
  onStatusChange: (status: 'ALL' | 'ONLINE' | 'OFFLINE') => void;
  onDistanceChange: (distance: number | null) => void;
  onActivityChange: (activity: string | null) => void;
}

export default function FilterButtons({
  statusFilter,
  distanceFilter,
  activityFilter,
  onStatusChange,
  onDistanceChange,
  onActivityChange,
}: FilterButtonsProps) {
  const FilterButton = ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.filterButton, active && styles.filterButtonActive]}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterText, active && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Status Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FilterButton
          label="All"
          active={statusFilter === 'ALL'}
          onPress={() => onStatusChange('ALL')}
        />
        <FilterButton
          label="Online"
          active={statusFilter === 'ONLINE'}
          onPress={() => onStatusChange('ONLINE')}
        />
        <FilterButton
          label="Offline"
          active={statusFilter === 'OFFLINE'}
          onPress={() => onStatusChange('OFFLINE')}
        />
      </ScrollView>

      {/* Distance Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FilterButton
          label="Nearby"
          active={distanceFilter === 1000}
          onPress={() => onDistanceChange(distanceFilter === 1000 ? null : 1000)}
        />
        <FilterButton
          label="< 5km"
          active={distanceFilter === 5000}
          onPress={() => onDistanceChange(distanceFilter === 5000 ? null : 5000)}
        />
        <FilterButton
          label="< 10km"
          active={distanceFilter === 10000}
          onPress={() => onDistanceChange(distanceFilter === 10000 ? null : 10000)}
        />
      </ScrollView>

      {/* Activity Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentLast}
      >
        <FilterButton
          label="🚶 Walking"
          active={activityFilter === 'walking'}
          onPress={() =>
            onActivityChange(activityFilter === 'walking' ? null : 'walking')
          }
        />
        <FilterButton
          label="🚴 Biking"
          active={activityFilter === 'biking'}
          onPress={() =>
            onActivityChange(activityFilter === 'biking' ? null : 'biking')
          }
        />
        <FilterButton
          label="🚗 Driving"
          active={activityFilter === 'driving'}
          onPress={() =>
            onActivityChange(activityFilter === 'driving' ? null : 'driving')
          }
        />
        <FilterButton
          label="📍 Stationary"
          active={activityFilter === 'stationary'}
          onPress={() =>
            onActivityChange(activityFilter === 'stationary' ? null : 'stationary')
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing[3],
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  scrollContentLast: {
    paddingHorizontal: spacing[4],
  },
  filterButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    marginRight: spacing[2],
    backgroundColor: colors.cardBackground.deepSpace,
    borderWidth: 1,
    borderColor: colors.cardBorder.white,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.gray[300],
  },
  filterTextActive: {
    color: colors.light,
  },
});
