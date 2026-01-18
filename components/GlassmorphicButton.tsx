import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { AppColors, BorderRadius, Spacing, Typography } from '@/constants/AppTheme';

interface GlassmorphicButtonProps {
  onPress: () => void;
  icon?: string;
  text: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const GlassmorphicButton: React.FC<GlassmorphicButtonProps> = ({
  onPress,
  icon,
  text,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const getBackgroundColor = () => {
    if (disabled) return 'rgba(107, 114, 128, 0.3)';
    switch (variant) {
      case 'primary':
        return AppColors.primary;
      case 'danger':
        return AppColors.error;
      case 'secondary':
      default:
        return 'rgba(255, 255, 255, 0.15)';
    }
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[animatedStyle, styles.button, { backgroundColor: getBackgroundColor() }, style]}
      activeOpacity={0.8}
    >
      {variant === 'secondary' && (
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      )}
      {loading ? (
        <ActivityIndicator color={AppColors.textDark} size="small" />
      ) : (
        <>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={[styles.text, disabled && styles.textDisabled]}>{text}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  icon: {
    fontSize: 20,
  },
  text: {
    ...Typography.bodyBold,
    color: AppColors.textDark,
  },
  textDisabled: {
    opacity: 0.5,
  },
});
