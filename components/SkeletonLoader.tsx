import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { AppColors, BorderRadius, Spacing } from '@/constants/AppTheme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 3) / 2;

export const SkeletonLoader = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6].map((item, index) => (
        <Animated.View
          key={item}
          style={[
            styles.skeletonCard,
            { 
              opacity,
              height: index % 2 === 0 ? 280 : 220,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  skeletonCard: {
    width: CARD_WIDTH,
    backgroundColor: AppColors.surfaceDark,
    borderRadius: BorderRadius.lg,
  },
});
