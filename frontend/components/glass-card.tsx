import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeColor } from '@/hooks/use-theme-color';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 60 }: GlassCardProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const isDark = backgroundColor === '#151718';

  // On Android, BlurView might not work as well, so we use a fallback
  if (Platform.OS === 'android') {
    return (
      <View style={[styles.container, style]}>
        <View
          style={[
            styles.card,
            styles.androidCard,
            {
              backgroundColor: isDark ? 'rgba(30, 30, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            },
          ]}
        >
          {children}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <BlurView
        intensity={intensity}
        style={[
          styles.card,
          {
            backgroundColor: isDark ? 'rgba(30, 30, 40, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          },
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  androidCard: {
    elevation: 8,
    shadowOpacity: 0.15,
  },
});
