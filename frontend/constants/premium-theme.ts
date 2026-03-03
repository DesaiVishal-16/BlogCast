// Premium Design System - Inspired by Linear, Apple, and Notion
// Sophisticated color palette and spacing

export const PremiumColors = {
  // Primary brand colors - warm amber/orange (podcast microphone/ warmth)
  primary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  // Accent colors - warm earth tones
  accent: {
    cyan: '#06b6d4',
    coral: '#f97066',
    amber: '#f59e0b',
    emerald: '#10b981',
    rose: '#e11d48',
  },

  // Neutral grays - warm, sophisticated
  gray: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },

  // Semantic colors
  light: {
    background: '#fafaf9',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    text: '#1c1917',
    textSecondary: '#57534e',
    textTertiary: '#78716c',
    border: '#e7e5e4',
    borderStrong: '#d6d3d1',
  },

  dark: {
    background: '#0c0a09',
    surface: '#1c1917',
    surfaceElevated: '#292524',
    text: '#fafaf9',
    textSecondary: '#a8a29e',
    textTertiary: '#78716c',
    border: '#292524',
    borderStrong: '#44403c',
  },
};

// Premium spacing scale (8px base)
export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
};

// Font Families - Professional, modern fonts
export const FontFamily = {
  // Inter for body text - clean and professional
  sans: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    // Fallback to system fonts
    system: {
      ios: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      android: 'Roboto, "Noto Sans", sans-serif',
      default: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
  // SF Pro for display - native iOS feel
  display: {
    ios: 'SF Pro Display, -apple-system, BlinkMacSystemFont',
    android: 'Roboto, sans-serif',
    default: 'system-ui, -apple-system, sans-serif',
  },
  // Monospace for code/technical text
  mono: {
    ios: 'SF Mono, Menlo, Monaco, Consolas, monospace',
    android: 'Roboto Mono, monospace',
    default: 'ui-monospace, SF Mono, Menlo, Monaco, monospace',
  },
};

// Get font family for current platform
import { Platform } from 'react-native';

export const getFontFamily = (weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular') => {
  if (Platform.OS === 'ios') {
    // Use San Francisco (SF Pro) system font on iOS
    return '-apple-system';
  }
  return 'sans-serif';
};

// Typography scale - refined sizes based on major second (1.125) and perfect fourth (1.333)
export const Typography = {
  // Hero - for main app title
  hero: {
    fontSize: 56,
    lineHeight: 64,
    fontWeight: '800' as const,
    letterSpacing: -2,
  },
  // Display - for major headings
  display: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700' as const,
    letterSpacing: -1.2,
  },
  // Headlines
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
  },
  h2: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  h4: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  h5: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
  },
  // Body text
  bodyLarge: {
    fontSize: 18,
    lineHeight: 30,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  // UI elements
  label: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  buttonSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
  // Special
  stat: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  price: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700' as const,
    letterSpacing: -1,
  },
};

// Border radius scale
export const Radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Shadow scale
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 16,
  },
  glow: {
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
};

// Animation timing
export const Animation = {
  fast: { duration: 150 },
  normal: { duration: 250 },
  slow: { duration: 350 },
  spring: {
    tension: 300,
    friction: 30,
  },
  bounce: {
    tension: 400,
    friction: 10,
  },
};

// Z-index scale
export const ZIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
  tooltip: 1600,
};
