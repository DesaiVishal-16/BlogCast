import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';

interface ShimmerProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  colors?: string[];
  duration?: number;
  style?: ViewStyle;
}

export function Shimmer({
  width = '100%',
  height = 20,
  borderRadius = 8,
  colors = ['#e2e8f0', '#f1f5f9', '#e2e8f0'],
  duration = 1500,
  style,
}: ShimmerProps) {
  const translateX = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(translateX, {
        toValue: 300,
        duration,
        useNativeDriver: true,
      })
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, [duration, translateX]);

  return (
    <View
      style={[
        { width, height, borderRadius, overflow: 'hidden', backgroundColor: colors[0] },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View
          style={[
            styles.gradient,
            {
              width: 200,
              backgroundColor: colors[1],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  shimmer: {
    flex: 1,
    flexDirection: 'row',
  },
  gradient: {
    flex: 1,
    opacity: 0.8,
  },
});
