import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { PremiumColors } from '@/constants/premium-theme';

interface PodcastWaveformProps {
  isPlaying?: boolean;
  size?: number;
  barCount?: number;
  color?: string;
}

export function PodcastWaveform({
  isPlaying = true,
  size = 60,
  barCount = 5,
  color = PremiumColors.primary[500],
}: PodcastWaveformProps) {
  const animations = useRef<Animated.Value[]>([]).current;

  // Initialize animation values
  for (let i = 0; i < barCount; i++) {
    if (!animations[i]) {
      animations[i] = new Animated.Value(0.3);
    }
  }

  useEffect(() => {
    if (isPlaying) {
      // Start animations for each bar
      animations.forEach((anim, index) => {
        const duration = 400 + Math.random() * 300;
        const delay = index * 80;

        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: duration,
              useNativeDriver: true,
              delay: delay,
            }),
            Animated.timing(anim, {
              toValue: 0.3,
              duration: duration,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    } else {
      // Reset to idle state
      animations.forEach(anim => {
        Animated.timing(anim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }

    return () => {
      animations.forEach(anim => {
        anim.stopAnimation();
      });
    };
  }, [isPlaying, animations]);

  const barWidth = size / (barCount * 2.5);
  const gap = barWidth * 0.5;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              width: barWidth,
              backgroundColor: color,
              transform: [
                {
                  scaleY: anim,
                },
              ],
              marginHorizontal: gap / 2,
            },
          ]}
        />
      ))}
    </View>
  );
}

// Animated podcast mic icon with ring animation
interface PodcastMicProps {
  size?: number;
  isRecording?: boolean;
  color?: string;
}

export function PodcastMic({
  size = 80,
  isRecording = true,
  color = PremiumColors.primary[500],
}: PodcastMicProps) {
  const ringScale = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      // Ring expansion animation
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(ringScale, {
              toValue: 1.6,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(ringScale, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(ringOpacity, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(ringOpacity, {
              toValue: 0.6,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();

      // Subtle pulse on the mic itself
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    return () => {
      ringScale.stopAnimation();
      ringOpacity.stopAnimation();
      pulseScale.stopAnimation();
    };
  }, [isRecording]);

  return (
    <View style={[styles.micContainer, { width: size, height: size }]}>
      {/* Expanding rings */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: size * 0.4,
            borderColor: color,
            transform: [{ scale: ringScale }],
            opacity: ringOpacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: size * 0.4,
            borderColor: color,
            transform: [{ scale: Animated.multiply(ringScale, 0.7) }],
            opacity: Animated.multiply(ringOpacity, 0.5),
          },
        ]}
      />

      {/* Central mic circle */}
      <Animated.View
        style={[
          styles.micCircle,
          {
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: size * 0.3,
            backgroundColor: color,
            transform: [{ scale: pulseScale }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    height: '100%',
    borderRadius: 100,
    opacity: 0.9,
  },
  micContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
  },
  micCircle: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
