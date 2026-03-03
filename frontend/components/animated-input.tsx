import React, { useRef, useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Animated,
  TextInputProps,
  ViewStyle,
  Platform,
} from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface AnimatedInputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
}

export function AnimatedInput({
  label,
  containerStyle,
  icon,
  onFocus,
  onBlur,
  ...textInputProps
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const isDark = backgroundColor === '#151718';

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.(e);
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', '#d97706'],
  });

  const shadowOpacity = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.05, 0.15],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Animated.Text
          style={[
            styles.label,
            {
              color: isFocused ? '#d97706' : isDark ? '#94a3b8' : '#64748b',
              transform: [
                {
                  translateY: borderAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -2],
                  }),
                },
              ],
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
            backgroundColor: isDark ? 'rgba(30, 30, 40, 0.5)' : 'rgba(255, 255, 255, 0.9)',
            shadowOpacity,
          },
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          {...textInputProps}
          style={[styles.input, { color: textColor }, textInputProps.style]}
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    height: 56,
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  iconContainer: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});
