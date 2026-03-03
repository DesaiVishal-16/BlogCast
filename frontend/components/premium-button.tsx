import React, { useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PremiumColors, Radius, Shadows, Animation, Typography } from '@/constants/premium-theme';
import * as Haptics from 'expo-haptics';

interface PremiumButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function PremiumButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
}: PremiumButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        ...Animation.spring,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim, glowAnim]);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        ...Animation.spring,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim, glowAnim]);

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress(event);
    },
    [onPress]
  );

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { height: 40, paddingHorizontal: 16, fontSize: 14 };
      case 'lg':
        return { height: 56, paddingHorizontal: 32, fontSize: 18 };
      default:
        return { height: 48, paddingHorizontal: 24, fontSize: 16 };
    }
  };

  const sizeStyles = getSizeStyles();

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color='#fff' size='small' />;
    }
    return (
      <>
        {icon && <Animated.View style={styles.icon}>{icon}</Animated.View>}
        <Text style={[styles.text, { fontSize: sizeStyles.fontSize }, textStyle]}>{title}</Text>
      </>
    );
  };

  if (variant === 'primary') {
    const glowOpacity = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.6],
    });

    return (
      <Animated.View
        style={[
          styles.container,
          fullWidth && styles.fullWidth,
          {
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.5 : opacityAnim,
          },
          style,
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={0.8}
          style={styles.touchable}
        >
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: glowOpacity,
                height: sizeStyles.height,
              },
            ]}
          />
          <LinearGradient
            colors={
              disabled
                ? [PremiumColors.gray[400], PremiumColors.gray[500]]
                : [PremiumColors.primary[600], PremiumColors.primary[700]]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.button,
              {
                height: sizeStyles.height,
                paddingHorizontal: sizeStyles.paddingHorizontal,
              },
            ]}
          >
            {renderContent()}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === 'secondary') {
    return (
      <Animated.View
        style={[
          styles.container,
          fullWidth && styles.fullWidth,
          {
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.5 : opacityAnim,
          },
          style,
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              disabled
                ? [PremiumColors.gray[200], PremiumColors.gray[300]]
                : ['rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.15)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.button,
              styles.secondaryButton,
              {
                height: sizeStyles.height,
                paddingHorizontal: sizeStyles.paddingHorizontal,
                borderColor: disabled ? PremiumColors.gray[300] : PremiumColors.primary[300],
              },
            ]}
          >
            {renderContent()}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === 'ghost') {
    return (
      <Animated.View
        style={[
          styles.container,
          fullWidth && styles.fullWidth,
          {
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.4 : opacityAnim,
          },
          style,
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={0.6}
        >
          <Animated.View
            style={[
              styles.button,
              styles.ghostButton,
              {
                height: sizeStyles.height,
                paddingHorizontal: sizeStyles.paddingHorizontal,
              },
            ]}
          >
            {renderContent()}
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // outline variant
  return (
    <Animated.View
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        {
          transform: [{ scale: scaleAnim }],
          opacity: disabled ? 0.5 : opacityAnim,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.button,
            styles.outlineButton,
            {
              height: sizeStyles.height,
              paddingHorizontal: sizeStyles.paddingHorizontal,
              borderColor: disabled ? PremiumColors.gray[300] : PremiumColors.primary[500],
            },
          ]}
        >
          {renderContent()}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  touchable: {
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    left: -4,
    right: -4,
    top: 4,
    borderRadius: Radius.xl,
    backgroundColor: PremiumColors.primary[500],
    ...Shadows.glow,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.xl,
    gap: 8,
    ...Shadows.md,
  },
  secondaryButton: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  text: {
    color: '#fff',
    fontWeight: Typography.button.fontWeight,
    letterSpacing: Typography.button.letterSpacing,
  },
  icon: {
    marginRight: 4,
  },
});
