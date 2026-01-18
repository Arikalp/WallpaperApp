import { View, Text, StyleSheet, Dimensions, Alert, Share, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useState } from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import { GlassmorphicButton } from '@/components/GlassmorphicButton';
import { AppColors, Spacing, Typography, BorderRadius } from '@/constants/AppTheme';
import { StatusBar } from 'expo-status-bar';
import Animated, { 
  FadeIn, 
  ZoomIn, 
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function ModalScreen() {
  const router = useRouter();
  const { wallpaper: wallpaperString } = useLocalSearchParams();
  const wallpaper = wallpaperString ? JSON.parse(wallpaperString as string) : null;
  
  const [downloading, setDownloading] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const scale = useSharedValue(1);

  const isFav = wallpaper ? isFavorite(wallpaper.id) : false;

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePinchGesture = () => {
    scale.value = withSpring(scale.value === 1 ? 1.5 : 1);
  };

  const handleDownload = async () => {
    if (!wallpaper) return;

    try {
      setDownloading(true);
      
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied', 
          'WallCraft needs permission to save wallpapers to your gallery. Please enable it in Settings.'
        );
        setDownloading(false);
        return;
      }

      // Use a better download URL - prefer original, fallback to large2x
      const downloadUrl = wallpaper.src?.original || wallpaper.src?.large2x || wallpaper.src?.large;
      
      if (!downloadUrl) {
        Alert.alert('Error', 'Could not find a download URL for this wallpaper.');
        setDownloading(false);
        return;
      }

      // Create file URI with timestamp
      const timestamp = Date.now();
      const filename = `wallcraft_${wallpaper.id}_${timestamp}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      console.log('Downloading from:', downloadUrl);
      console.log('Saving to:', fileUri);
      
      // Download the file
      const downloadResult = await FileSystem.downloadAsync(downloadUrl, fileUri);
      
      if (!downloadResult.uri) {
        throw new Error('Download failed - no URI returned');
      }
      
      console.log('Download complete:', downloadResult.uri);

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      console.log('Saved to gallery:', asset.uri);
      
      Alert.alert('Success! 🎉', 'Wallpaper saved to your gallery in HD quality!');
    } catch (error: any) {
      console.error('Download error:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      Alert.alert(
        'Download Failed', 
        `Could not download the wallpaper.\n\nError: ${errorMessage}\n\nPlease check your internet connection and try again.`
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleFavorite = () => {
    if (!wallpaper) return;
    toggleFavorite(wallpaper);
  };

  const handleShare = async () => {
    if (!wallpaper) return;

    try {
      await Share.share({
        message: `Check out this amazing wallpaper by ${wallpaper.photographer}! ${wallpaper.url}`,
        url: wallpaper.url,
        title: 'Share Wallpaper',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (!wallpaper) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Wallpaper not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Full Screen Image with Zoom Animation */}
      <Animated.View 
        entering={ZoomIn.duration(400)}
        exiting={FadeOut.duration(200)}
        style={styles.imageWrapper}
      >
        <Pressable onPress={handlePinchGesture} style={styles.imageContainer}>
          <Animated.View style={animatedImageStyle}>
            <Image
              source={{ uri: wallpaper.src.large2x }}
              style={styles.image}
              contentFit="contain"
              transition={300}
            />
          </Animated.View>
        </Pressable>
      </Animated.View>

      {/* Close Button */}
      <Animated.View entering={FadeIn.delay(200).duration(300)} style={styles.closeButtonContainer}>
        <Pressable
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
      </Animated.View>

      {/* Bottom Action Bar with Glassmorphism */}
      <Animated.View entering={FadeIn.delay(300).duration(400)} style={styles.bottomBar}>
        <View style={styles.photographerContainer}>
          <Text style={styles.photographerLabel}>📸 Photo by</Text>
          <Text style={styles.photographerName} numberOfLines={1}>
            {wallpaper.photographer}
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <GlassmorphicButton
            onPress={handleFavorite}
            icon={isFav ? '💜' : '🤍'}
            text={isFav ? 'Saved' : 'Save'}
            variant="secondary"
            style={styles.actionButton}
          />
          
          <GlassmorphicButton
            onPress={handleShare}
            icon="📤"
            text="Share"
            variant="secondary"
            style={styles.actionButton}
          />
        </View>

        <GlassmorphicButton
          onPress={handleDownload}
          icon="⬇️"
          text="Download HD"
          variant="primary"
          loading={downloading}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundDark,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 50,
    right: Spacing.lg,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButtonText: {
    color: AppColors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  photographerContainer: {
    marginBottom: Spacing.lg,
  },
  photographerLabel: {
    ...Typography.small,
    color: AppColors.textSecondaryDark,
    marginBottom: Spacing.xs,
  },
  photographerName: {
    ...Typography.h3,
    color: AppColors.textDark,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  errorText: {
    ...Typography.body,
    color: AppColors.textDark,
    textAlign: 'center',
    marginTop: 100,
  },
});
