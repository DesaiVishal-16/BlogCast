import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { PremiumColors, Radius, Shadows } from '@/constants/premium-theme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface PremiumCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  elevated?: boolean;
  gradient?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
}

export function PremiumCard({
  children,
  style,
  intensity = 80,
  elevated = false,
  gradient = false,
  gradientColors = ['rgba(99, 102, 241, 0.03)', 'rgba(139, 92, 246, 0.05)'] as const,
}: PremiumCardProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const isDark = backgroundColor === '#151718';

  if (gradient) {
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, styles.gradientContainer, elevated && styles.elevated, style]}
      >
        <View style={[styles.inner, styles.gradientInner]}>{children}</View>
      </LinearGradient>
    );
  }

  // For Android, use a solid background with transparency
  if (Platform.OS === 'android') {
    return (
      <View
        style={[
          styles.container,
          styles.androidContainer,
          {
            backgroundColor: isDark
              ? PremiumColors.dark.surfaceElevated
              : PremiumColors.light.surface,
            borderColor: isDark
              ? PremiumColors.dark.borderStrong
              : PremiumColors.light.borderStrong,
          },
          elevated && styles.elevated,
          elevated && styles.androidElevated,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        styles.iosContainer,
        {
          borderColor: isDark ? PremiumColors.dark.borderStrong : PremiumColors.light.borderStrong,
        },
        elevated && styles.elevated,
        elevated && styles.iosElevated,
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        style={[
          styles.blur,
          {
            backgroundColor: isDark ? 'rgba(41, 37, 36, 0.85)' : 'rgba(255, 255, 255, 0.9)',
          },
        ]}
      >
        <View style={styles.inner}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius['2xl'],
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  iosContainer: {
    ...Shadows.md,
  },
  androidContainer: {
    ...Shadows.lg,
    elevation: 6,
  },
  gradientContainer: {
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    ...Shadows.lg,
    elevation: 8,
  },
  gradientInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  blur: {
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
  },
  inner: {
    padding: 24,
  },
  elevated: {
    ...Shadows.xl,
  },
  iosElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  androidElevated: {
    elevation: 12,
    shadowOpacity: 0.2,
  },
});
