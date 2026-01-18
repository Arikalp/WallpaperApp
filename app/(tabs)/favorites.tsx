import { View, Text, FlatList, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';
import { WallpaperCard } from '@/components/WallpaperCard';
import { AppColors, Spacing, Typography } from '@/constants/AppTheme';
import { StatusBar } from 'expo-status-bar';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleCardPress = (item: any) => {
    router.push({
      pathname: '/modal',
      params: {
        wallpaper: JSON.stringify(item),
      },
    });
  };

  const renderItem = ({ item, index }: any) => (
    <WallpaperCard
      item={item}
      index={index}
      onPress={() => handleCardPress(item)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, isDark && styles.titleDark]}>Favorites</Text>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
        {favorites.length} {favorites.length === 1 ? 'wallpaper' : 'wallpapers'} saved
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>💜</Text>
      <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
        No favorites yet
      </Text>
      <Text style={[styles.emptySubtext, isDark && styles.emptySubtextDark]}>
        Tap the heart icon on wallpapers to save them here
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
      {favorites.length === 0 ? (
        <>
          {renderHeader()}
          {renderEmpty()}
        </>
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader}
          data={favorites}
          renderItem={renderItem}
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
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: AppColors.text,
    marginBottom: Spacing.xs,
  },
  titleDark: {
    color: AppColors.textDark,
  },
  subtitle: {
    ...Typography.caption,
    color: AppColors.textSecondary,
  },
  subtitleDark: {
    color: AppColors.textSecondaryDark,
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
    paddingHorizontal: Spacing.xxxl,
    paddingBottom: 100,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: Spacing.xl,
  },
  emptyText: {
    ...Typography.h2,
    color: AppColors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyTextDark: {
    color: AppColors.textDark,
  },
  emptySubtext: {
    ...Typography.body,
    color: AppColors.textSecondary,
    textAlign: 'center',
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
