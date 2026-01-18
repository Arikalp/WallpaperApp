import { View, Text, FlatList, StyleSheet, RefreshControl, useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getCuratedWallpapers } from '../../api/pexels';
import { WallpaperCard } from '@/components/WallpaperCard';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { AppColors, Spacing, Typography } from '@/constants/AppTheme';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const [wallpapers, setWallpapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const loadWallpapers = async (pageNum = 1, isRefresh = false) => {
    try {
      if (!isRefresh && pageNum === 1) setLoading(true);
      const data = await getCuratedWallpapers(pageNum);
      
      if (pageNum === 1) {
        setWallpapers(data || []);
      } else {
        setWallpapers(prev => [...prev, ...(data || [])]);
      }
    } catch (error) {
      console.error('Error loading wallpapers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWallpapers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadWallpapers(1, true);
  };

  const loadMore = () => {
    if (!loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadWallpapers(nextPage);
    }
  };

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
      <Text style={[styles.title, isDark && styles.titleDark]}>WallCraft</Text>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
        Trending & Popular
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

  if (loading && wallpapers.length === 0) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        {renderHeader()}
        <SkeletonLoader />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <FlatList
        ListHeaderComponent={renderHeader}
        data={wallpapers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={AppColors.primary}
            colors={[AppColors.primary]}
          />
        }
        ListFooterComponent={renderFooter}
      />
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
