import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/constants/theme';

interface SearchOverlayProps {
  onSearch: (query: string, category?: string) => void;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'restaurant', label: 'Restaurant', icon: 'restaurant' },
  { id: 'cafe', label: 'Cafe', icon: 'cafe' },
  { id: 'park', label: 'Park', icon: 'leaf' },
  { id: 'hospital', label: 'Hospital', icon: 'medical' },
  { id: 'gas_station', label: 'Gas Station', icon: 'car' },
];

export default function SearchOverlay({ onSearch, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const handleSearch = () => {
    onSearch(query, selectedCategory);
  };

  const handleCategorySelect = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? undefined : categoryId;
    setSelectedCategory(newCategory);
    onSearch(query, newCategory);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.light} />
        </TouchableOpacity>
        
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search places..."
            placeholderTextColor={colors.gray[400]}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategorySelect(category.id)}
              style={[styles.categoryButton, isActive && styles.categoryButtonActive]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={isActive ? colors.light : colors.gray[400]}
              />
              <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground.cosmicBlend,
    borderBottomLeftRadius: borderRadius['2xl'],
    borderBottomRightRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.cardBorder.blue,
    ...shadows.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder.white,
  },
  backButton: {
    marginRight: spacing[2],
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground.deepSpace,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderWidth: 1,
    borderColor: colors.cardBorder.white,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing[2],
    fontSize: typography.fontSize.base,
    color: colors.light,
  },
  categoriesContent: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    marginRight: spacing[2],
    backgroundColor: colors.cardBackground.deepSpace,
    borderWidth: 1,
    borderColor: colors.cardBorder.white,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    marginLeft: spacing[2],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[300],
  },
  categoryTextActive: {
    color: colors.light,
  },
});
