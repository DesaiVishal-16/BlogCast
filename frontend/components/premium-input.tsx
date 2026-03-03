import React, { useState, useRef, useCallback } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Animated,
  TextInputProps,
  ViewStyle,
  Platform,
} from 'react-native';
import {
  PremiumColors,
  Radius,
  Shadows,
  Animation,
  Typography,
  Spacing,
} from '@/constants/premium-theme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface PremiumInputProps extends TextInputProps {
  label?: string;
  helper?: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export function PremiumInput({
  label,
  helper,
  error,
  containerStyle,
  icon,
  rightElement,
  onFocus,
  onBlur,
  ...textInputProps
}: PremiumInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(textInputProps.value ? 1 : 0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const backgroundColor = useThemeColor({}, 'background');
  const isDark = backgroundColor === '#151718';
  const textColor = isDark ? PremiumColors.dark.text : PremiumColors.light.text;
  const secondaryTextColor = isDark
    ? PremiumColors.dark.textSecondary
    : PremiumColors.light.textSecondary;

  const handleFocus = useCallback(
    (e: any) => {
      setIsFocused(true);
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: Animation.normal.duration,
        useNativeDriver: false,
      }).start();
      Animated.timing(labelAnim, {
        toValue: 1,
        duration: Animation.normal.duration,
        useNativeDriver: false,
      }).start();
      onFocus?.(e);
    },
    [borderAnim, labelAnim, onFocus]
  );

  const handleBlur = useCallback(
    (e: any) => {
      setIsFocused(false);
      if (!textInputProps.value) {
        Animated.timing(labelAnim, {
          toValue: 0,
          duration: Animation.normal.duration,
          useNativeDriver: false,
        }).start();
      }
      Animated.timing(borderAnim, {
        toValue: error ? 1 : 0,
        duration: Animation.normal.duration,
        useNativeDriver: false,
      }).start();
      onBlur?.(e);
    },
    [borderAnim, labelAnim, error, textInputProps.value, onBlur]
  );

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      isDark ? PremiumColors.dark.border : PremiumColors.light.border,
      error ? '#ef4444' : PremiumColors.primary[500],
    ],
  });

  const backgroundColorAnim = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      isDark ? 'rgba(28, 25, 23, 0.5)' : 'rgba(255, 255, 255, 0.8)',
      isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.05)',
    ],
  });

  const labelTranslateY = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -28],
  });

  const labelScale = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.85],
  });

  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [secondaryTextColor, error ? '#ef4444' : PremiumColors.primary[600]],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Animated.Text
          style={[
            styles.label,
            {
              transform: [{ translateY: labelTranslateY }, { scale: labelScale }],
              color: labelColor,
            },
          ]}
        >
          {label}
        </Animated.Text>
      )}

      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: backgroundColorAnim,
            shadowOpacity: isFocused ? 0.15 : 0.05,
          },
          error && styles.errorContainer,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <TextInput
          {...textInputProps}
          style={[
            styles.input,
            {
              color: textColor,
              paddingLeft: icon ? Spacing[10] : Spacing[4],
              paddingRight: rightElement ? Spacing[10] : Spacing[4],
            },
            textInputProps.style,
          ]}
          placeholderTextColor={isDark ? PremiumColors.gray[500] : PremiumColors.gray[400]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={label ? '' : textInputProps.placeholder}
        />

        {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
      </Animated.View>

      {(helper || error) && (
        <Animated.Text style={[styles.helper, { color: error ? '#ef4444' : secondaryTextColor }]}>
          {error || helper}
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: Spacing[3],
    marginBottom: Spacing[2],
  },
  label: {
    fontSize: Typography.label.fontSize,
    fontWeight: Typography.label.fontWeight,
    letterSpacing: Typography.label.letterSpacing,
    marginBottom: Spacing[2],
    transformOrigin: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    height: 56,
    ...Shadows.sm,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  errorContainer: {
    borderColor: '#ef4444',
  },
  iconContainer: {
    position: 'absolute',
    left: Spacing[4],
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: Typography.body.fontSize,
    fontWeight: '500',
    letterSpacing: 0,
  },
  rightElement: {
    position: 'absolute',
    right: Spacing[4],
    zIndex: 1,
  },
  helper: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.caption.fontWeight,
    marginTop: Spacing[2],
    marginLeft: Spacing[1],
  },
});
