import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, useColorScheme } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { searchWallpapers } from '../../api/pexels';
import { WallpaperCard } from '@/components/WallpaperCard';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { AppColors, Spacing, Typography, BorderRadius } from '@/constants/AppTheme';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn } from 'react-native-reanimated';

const CATEGORIES = [
  { id: 1, name: 'Nature', emoji: '🌿' },
  { id: 2, name: 'Cars', emoji: '🚗' },
  { id: 3, name: 'Anime', emoji: '🎭' },
  { id: 4, name: 'Space', emoji: '🌌' },
  { id: 5, name: 'Gaming', emoji: '🎮' },
  { id: 6, name: 'Minimal', emoji: '⚪' },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      const data = await searchWallpapers(query);
      setWallpapers(data || []);
    } catch (error) {
      console.error('Error searching wallpapers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryName: string) => {
    setSearchQuery(categoryName);
    handleSearch(categoryName);
  };

  const handleCardPress = (item: any) => {
    router.push({
      pathname: '/modal',
      params: {
        wallpaper: JSON.stringify(item),
      },
    });
  };

  const renderCategoryItem = ({ item, index }: any) => (
    <Animated.View entering={FadeIn.delay(index * 80).duration(400)}>
      <TouchableOpacity
        style={[styles.categoryCard, isDark && styles.categoryCardDark]}
        onPress={() => handleCategoryPress(item.name)}
        activeOpacity={0.7}
      >
        <Text style={styles.categoryEmoji}>{item.emoji}</Text>
        <Text style={[styles.categoryName, isDark && styles.categoryNameDark]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderWallpaperItem = ({ item, index }: any) => (
    <WallpaperCard
      item={item}
      index={index}
      onPress={() => handleCardPress(item)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, isDark && styles.titleDark]}>Search</Text>
      <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder="Search wallpapers..."
          placeholderTextColor={isDark ? AppColors.textSecondaryDark : AppColors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => handleSearch(searchQuery)}
          returnKeyType="search"
        />
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>😕</Text>
      <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
        No wallpapers found
      </Text>
      <Text style={[styles.emptySubtext, isDark && styles.emptySubtextDark]}>
        Try a different search term
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
        Developed by Sankalp with ❤️
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {renderHeader()}

      {!searched ? (
        <View style={styles.categoriesContainer}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Browse Categories
          </Text>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.categoryRow}
            contentContainerStyle={styles.categoriesContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
          />
        </View>
      ) : loading ? (
        <SkeletonLoader />
      ) : wallpapers.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={wallpapers}
          renderItem={renderWallpaperItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  containerDark: {
    backgroundColor: AppColors.backgroundDark,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: AppColors.text,
    marginBottom: Spacing.lg,
  },
  titleDark: {
    color: AppColors.textDark,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  searchContainerDark: {
    backgroundColor: AppColors.surfaceDark,
    borderColor: AppColors.borderDark,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: AppColors.text,
    paddingVertical: Spacing.lg,
  },
  searchInputDark: {
    color: AppColors.textDark,
  },
  categoriesContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: AppColors.text,
    marginBottom: Spacing.lg,
  },
  sectionTitleDark: {
    color: AppColors.textDark,
  },
  categoriesContent: {
    paddingBottom: Spacing.xl,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  categoryCardDark: {
    backgroundColor: AppColors.surfaceDark,
    borderColor: AppColors.borderDark,
  },
  categoryEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  categoryName: {
    ...Typography.bodyBold,
    color: AppColors.text,
  },
  categoryNameDark: {
    color: AppColors.textDark,
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.huge,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyText: {
    ...Typography.h3,
    color: AppColors.text,
    marginBottom: Spacing.xs,
  },
  emptyTextDark: {
    color: AppColors.textDark,
  },
  emptySubtext: {
    ...Typography.caption,
    color: AppColors.textSecondary,
  },
  emptySubtextDark: {
    color: AppColors.textSecondaryDark,
  },
  footer: {
    paddingVertical: Spacing.xxxl,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.small,
    color: AppColors.textSecondary,
  },
  footerTextDark: {
    color: AppColors.textSecondaryDark,
  },
});
