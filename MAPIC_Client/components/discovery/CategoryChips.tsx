/**
 * CategoryChips Component
 * Horizontal scrollable category chips with selection
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import type { Category } from '@/types/discovery';

interface CategoryChipsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  loading?: boolean;
}

export default function CategoryChips({
  categories,
  selectedCategory,
  onSelectCategory,
  loading = false,
}: CategoryChipsProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🌟</Text>
        <Text style={styles.emptyText}>Chưa có danh mục</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {categories.map((category) => {
        const isSelected = category.name === selectedCategory;
        return (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.chip,
              isSelected && styles.chipSelected,
            ]}
            onPress={() => onSelectCategory(category.name)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{category.icon}</Text>
            <Text style={[
              styles.name,
              isSelected && styles.nameSelected,
            ]}>
              {category.name}
            </Text>
            <Text style={[
              styles.count,
              isSelected && styles.countSelected,
            ]}>
              {category.count}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  loadingContainer: {
    padding: spacing[4],
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardBackground.frostedBlue,
    borderWidth: 1,
    borderColor: colors.cardBorder.white,
    marginRight: spacing[2],
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  icon: {
    fontSize: 18,
    marginRight: spacing[2],
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.light,
    marginRight: spacing[2],
  },
  nameSelected: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  count: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[400],
    fontWeight: typography.fontWeight.normal,
  },
  countSelected: {
    color: colors.white,
  },
  emptyContainer: {
    padding: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[400],
    textAlign: 'center',
  },
});
