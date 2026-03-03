import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { LiquidColors, GlassEffects, LiquidSpacing } from '@/constants/liquid-theme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  blur?: 'light' | 'medium' | 'heavy' | 'ultra';
  depth?: 'flat' | 'resting' | 'elevated' | 'floating';
  tint?: 'light' | 'dark' | 'accent';
  gradient?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function LiquidGlassCard({
  children,
  style,
  blur = 'heavy',
  depth = 'elevated',
  tint = 'light',
  gradient = false,
  gradientColors = LiquidColors.gradients.sunset,
  padding = 'medium',
}: LiquidGlassCardProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const isDark = backgroundColor === '#151718';

  const blurIntensity = GlassEffects.blur[blur];
  const depthStyle = GlassEffects.depth[depth];
  const paddingValue = {
    none: 0,
    small: LiquidSpacing[3],
    medium: LiquidSpacing[5],
    large: LiquidSpacing[6],
  }[padding];

  // Get tint color based on theme
  const tintColor = isDark ? 'rgba(255, 255, 255, 0.1)' : GlassEffects.tint[tint];

  if (gradient) {
    return (
      <View style={[styles.container, depthStyle, style]}>
        {/* Background gradient layer */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        />

        {/* Glass overlay */}
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={blurIntensity}
            tint={isDark ? 'dark' : 'light'}
            style={[styles.blurView, { backgroundColor: tintColor }]}
          >
            <View style={[styles.content, { padding: paddingValue }]}>{children}</View>
          </BlurView>
        ) : (
          <View
            style={[
              styles.androidGlass,
              {
                backgroundColor: isDark ? LiquidColors.glassDark.medium : LiquidColors.glass.medium,
              },
            ]}
          >
            <View style={[styles.content, { padding: paddingValue }]}>{children}</View>
          </View>
        )}
      </View>
    );
  }

  // Standard glass card without gradient background
  return (
    <View style={[styles.container, depthStyle, style]}>
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={blurIntensity}
          tint={isDark ? 'dark' : 'light'}
          style={[styles.blurView, { backgroundColor: tintColor }]}
        >
          <View style={[styles.content, { padding: paddingValue }]}>{children}</View>
        </BlurView>
      ) : (
        <View
          style={[
            styles.androidGlass,
            {
              backgroundColor: isDark ? LiquidColors.glassDark.light : LiquidColors.glass.light,
            },
          ]}
        >
          <View style={[styles.content, { padding: paddingValue }]}>{children}</View>
        </View>
      )}
    </View>
  );
}

// Specialized glass components
export function LiquidGlassButton({
  children,
  style,
  variant = 'filled',
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'filled' | 'glass' | 'outline';
}) {
  const backgroundColor = useThemeColor({}, 'background');
  const isDark = backgroundColor === '#151718';

  if (variant === 'glass') {
    return (
      <View style={[styles.buttonGlass, GlassEffects.depth.resting, style]}>
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={GlassEffects.blur.heavy}
            tint={isDark ? 'dark' : 'light'}
            style={styles.buttonBlur}
          >
            {children}
          </BlurView>
        ) : (
          <View
            style={[
              styles.buttonAndroid,
              {
                backgroundColor: isDark ? LiquidColors.glassDark.medium : LiquidColors.glass.medium,
              },
            ]}
          >
            {children}
          </View>
        )}
      </View>
    );
  }

  return <View style={[styles.buttonStandard, style]}>{children}</View>;
}

// Glass input field
export function LiquidGlassInput({
  children,
  style,
  isFocused = false,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  isFocused?: boolean;
}) {
  const backgroundColor = useThemeColor({}, 'background');
  const isDark = backgroundColor === '#151718';

  return (
    <View
      style={[
        styles.inputContainer,
        isFocused && styles.inputFocused,
        GlassEffects.depth.resting,
        style,
      ]}
    >
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={isFocused ? GlassEffects.blur.ultra : GlassEffects.blur.heavy}
          tint={isDark ? 'dark' : 'light'}
          style={styles.inputBlur}
        >
          {children}
        </BlurView>
      ) : (
        <View
          style={[
            styles.inputAndroid,
            {
              backgroundColor: isDark ? LiquidColors.glassDark.light : LiquidColors.glass.light,
            },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: GlassEffects.radius.large,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  blurView: {
    flex: 1,
    borderRadius: GlassEffects.radius.large,
  },
  androidGlass: {
    flex: 1,
    borderRadius: GlassEffects.radius.large,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  content: {
    flex: 1,
  },
  // Button styles
  buttonGlass: {
    borderRadius: GlassEffects.radius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  buttonBlur: {
    flex: 1,
    paddingVertical: LiquidSpacing[3],
    paddingHorizontal: LiquidSpacing[5],
    borderRadius: GlassEffects.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAndroid: {
    flex: 1,
    paddingVertical: LiquidSpacing[3],
    paddingHorizontal: LiquidSpacing[5],
    borderRadius: GlassEffects.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonStandard: {
    borderRadius: GlassEffects.radius.pill,
    overflow: 'hidden',
  },
  // Input styles
  inputContainer: {
    borderRadius: GlassEffects.radius.medium,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  inputFocused: {
    borderColor: 'rgba(255, 255, 255, 0.35)',
    ...GlassEffects.depth.elevated,
  },
  inputBlur: {
    flex: 1,
    padding: LiquidSpacing[3],
    borderRadius: GlassEffects.radius.medium,
  },
  inputAndroid: {
    flex: 1,
    padding: LiquidSpacing[3],
    borderRadius: GlassEffects.radius.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});
