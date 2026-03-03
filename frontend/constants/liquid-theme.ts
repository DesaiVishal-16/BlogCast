// Liquid Glass Design System - Inspired by Apple iOS 18 Liquid Glass UI
// Features frosted glass, high blur, organic shapes, and depth

import { Platform } from 'react-native';

export const LiquidColors = {
  // Vibrant accent colors that shine through glass
  accent: {
    blue: '#007AFF',
    cyan: '#00D4FF',
    purple: '#BF5AF2',
    pink: '#FF375F',
    orange: '#FF9F0A',
    yellow: '#FFD60A',
    green: '#30D158',
    mint: '#66D7D1',
    indigo: '#5E5CE6',
    teal: '#40C8E0',
  },

  // Glass layers - various opacities for depth
  glass: {
    ultraLight: 'rgba(255, 255, 255, 0.85)',
    light: 'rgba(255, 255, 255, 0.70)',
    medium: 'rgba(255, 255, 255, 0.50)',
    dark: 'rgba(255, 255, 255, 0.30)',
    ultraDark: 'rgba(255, 255, 255, 0.15)',
  },

  glassDark: {
    ultraLight: 'rgba(30, 30, 30, 0.85)',
    light: 'rgba(30, 30, 30, 0.70)',
    medium: 'rgba(30, 30, 30, 0.50)',
    dark: 'rgba(30, 30, 30, 0.30)',
    ultraDark: 'rgba(30, 30, 30, 0.15)',
  },

  // Vibrant gradients for backgrounds
  gradients: {
    sunset: ['#FF6B6B', '#FF8E53', '#FF6B9D'],
    ocean: ['#00D4FF', '#0099FF', '#5E5CE6'],
    aurora: ['#30D158', '#00D4FF', '#BF5AF2'],
    fire: ['#FF375F', '#FF6B35', '#FF9F0A'],
    twilight: ['#5E5CE6', '#BF5AF2', '#FF375F'],
    depth: ['#1a1a2e', '#16213e', '#0f3460'],
  },

  // Semantic colors
  light: {
    background: '#F5F5F7',
    surface: '#FFFFFF',
    text: '#1D1D1F',
    textSecondary: '#86868B',
    border: 'rgba(0, 0, 0, 0.1)',
  },

  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: 'rgba(255, 255, 255, 0.15)',
  },
};

// Liquid glass effects
export const GlassEffects = {
  // Blur intensities
  blur: {
    light: 20,
    medium: 50,
    heavy: 80,
    ultra: 100,
  },

  // Saturation for vibrant backgrounds
  saturation: {
    none: 0,
    low: 0.5,
    medium: 1.0,
    high: 1.5,
    ultra: 2.0,
  },

  // Organic border radius values
  radius: {
    small: 16,
    medium: 24,
    large: 32,
    xlarge: 40,
    pill: 100,
    full: 9999,
  },

  // Layer depths (shadows for glass floating effect)
  depth: {
    flat: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    resting: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    elevated: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    floating: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.2,
      shadowRadius: 32,
      elevation: 16,
    },
  },

  // Glass tint colors
  tint: {
    light: 'rgba(255, 255, 255, 0.4)',
    dark: 'rgba(0, 0, 0, 0.2)',
    accent: 'rgba(255, 255, 255, 0.15)',
  },
};

// Typography - SF Pro style
export const LiquidTypography = {
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.02,
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400' as const,
    letterSpacing: -0.02,
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400' as const,
    letterSpacing: -0.01,
  },
  subhead: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: -0.01,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
    letterSpacing: -0.01,
  },
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400' as const,
    letterSpacing: 0.01,
  },
};

// Spacing - Apple style 8pt grid
export const LiquidSpacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

// Animation - Liquid motion
export const LiquidAnimation = {
  // Spring configurations for liquid feel
  spring: {
    soft: {
      tension: 120,
      friction: 8,
    },
    medium: {
      tension: 200,
      friction: 12,
    },
    bouncy: {
      tension: 300,
      friction: 10,
    },
  },
  // Durations
  duration: {
    instant: 100,
    fast: 200,
    medium: 300,
    slow: 500,
    liquid: 800,
  },
};
