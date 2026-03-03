import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { PremiumCard } from '@/components/premium-card';
import { PodcastWaveform } from '@/components/podcast-animations';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  PremiumColors,
  Spacing,
  Radius,
  Shadows,
  Typography,
  Animation,
} from '@/constants/premium-theme';

const { width } = Dimensions.get('window');

export default function ResultScreen() {
  const params = useLocalSearchParams<{
    translatedText: string;
    audioUrl: string;
    title: string;
    processingTime: string;
  }>();

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  // Animation refs
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const isDark = backgroundColor === '#151718';

  const { translatedText, audioUrl, title, processingTime } = params;

  useEffect(() => {
    const staggerDelay = 80;

    Animated.stagger(staggerDelay, [
      Animated.parallel([
        Animated.timing(headerFade, {
          toValue: 1,
          duration: Animation.slow.duration,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(headerSlide, {
          toValue: 0,
          duration: Animation.slow.duration,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      Animated.parallel([
        Animated.timing(contentFade, {
          toValue: 1,
          duration: Animation.slow.duration,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(contentSlide, {
          toValue: 0,
          duration: Animation.slow.duration,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAndPlayAudio = useCallback(async () => {
    try {
      setIsLoading(true);

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setIsPlaying(true);

      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      Alert.alert('Audio Error', 'Unable to load audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [audioUrl]);

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      const progress = status.durationMillis ? status.positionMillis / status.durationMillis : 0;
      progressAnim.setValue(progress);

      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    }
  }, []);

  const togglePlayback = useCallback(async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (!sound) {
      await loadAndPlayAudio();
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  }, [sound, isPlaying, loadAndPlayAudio]);

  const stopAudio = useCallback(async () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  }, [sound]);

  const formatTime = useCallback((milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const progressPercentage = playbackDuration > 0 ? (playbackPosition / playbackDuration) * 100 : 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? PremiumColors.dark.background : PremiumColors.light.background,
        },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Background Mesh Gradient */}
      <View style={styles.meshContainer}>
        <View style={styles.gradientOrb1}>
          <LinearGradient
            colors={['rgba(99, 102, 241, 0.15)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>
        <View style={styles.gradientOrb2}>
          <LinearGradient
            colors={['rgba(236, 72, 153, 0.1)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </View>
      </View>

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerFade,
            transform: [{ translateX: headerSlide }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            router.back();
          }}
        >
          <View style={styles.backButtonIcon}>
            <IconSymbol size={20} name='arrow.left' color={PremiumColors.primary[600]} />
          </View>
          <ThemedText style={styles.backButtonText}>Back</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            router.push('/history');
          }}
        >
          <View style={styles.historyButtonIcon}>
            <IconSymbol size={20} name='clock' color={PremiumColors.primary[600]} />
          </View>
          <ThemedText style={styles.historyButtonText}>History</ThemedText>
        </TouchableOpacity>
      </Animated.View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            {
              opacity: contentFade,
              transform: [{ translateY: contentSlide }],
            },
          ]}
        >
          {/* Audio Player Card */}
          <PremiumCard elevated gradient>
            <View style={styles.playerHeader}>
              <View style={styles.waveformContainer}>
                <PodcastWaveform
                  isPlaying={isPlaying}
                  size={56}
                  barCount={6}
                  color={PremiumColors.primary[500]}
                />
              </View>
              <View style={styles.playerInfo}>
                <ThemedText style={styles.audioTitle}>Your Podcast Episode</ThemedText>
                <ThemedText style={styles.audioSubtitle}>
                  {isPlaying ? 'Listening Now' : 'Ready to Listen'}
                </ThemedText>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: `${progressPercentage}%`,
                      },
                    ]}
                  />
                </View>
                <View style={styles.timeContainer}>
                  <ThemedText style={styles.timeText}>{formatTime(playbackPosition)}</ThemedText>
                  <ThemedText style={styles.timeText}>{formatTime(playbackDuration)}</ThemedText>
                </View>
              </View>
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={togglePlayback}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color='#fff' size='small' />
                  ) : (
                    <IconSymbol
                      size={32}
                      name={isPlaying ? 'pause.fill' : 'play.fill'}
                      color='#fff'
                    />
                  )}
                </TouchableOpacity>
              </Animated.View>

              {sound && (
                <TouchableOpacity style={styles.stopButton} onPress={stopAudio}>
                  <IconSymbol size={22} name='stop.fill' color={PremiumColors.primary[600]} />
                </TouchableOpacity>
              )}
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Translated Text Card */}
        <Animated.View
          style={[
            {
              opacity: contentFade,
              transform: [{ translateY: contentSlide }],
            },
            { marginTop: Spacing[4] },
          ]}
        >
          <PremiumCard>
            <View style={styles.textHeader}>
              <View style={[styles.textIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
                <IconSymbol size={22} name='doc.text.fill' color={PremiumColors.primary[600]} />
              </View>
              <View>
                <ThemedText style={styles.textTitle}>Episode Transcript</ThemedText>
                <ThemedText style={styles.textSubtitle}>{title || 'Translated Content'}</ThemedText>
              </View>
            </View>

            <View
              style={[
                styles.textContainer,
                {
                  backgroundColor: isDark
                    ? PremiumColors.dark.surface
                    : PremiumColors.light.surfaceElevated,
                  borderColor: isDark
                    ? PremiumColors.dark.borderStrong
                    : PremiumColors.light.borderStrong,
                },
              ]}
            >
              <ThemedText style={styles.translatedText}>{translatedText}</ThemedText>
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Info Card */}
        <Animated.View
          style={[
            {
              opacity: contentFade,
              transform: [{ translateY: contentSlide }],
            },
            { marginTop: Spacing[4] },
          ]}
        >
          <PremiumCard>
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: 'rgba(100, 116, 139, 0.1)' }]}>
                <IconSymbol size={16} name='clock' color={PremiumColors.gray[500]} />
              </View>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Processing Time</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {processingTime ? `${processingTime}ms` : 'N/A'}
                </ThemedText>
              </View>
            </View>
          </PremiumCard>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  meshContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientOrb1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    top: -width * 0.4,
    left: -width * 0.2,
    borderRadius: width * 0.6,
  },
  gradientOrb2: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    bottom: -width * 0.2,
    right: -width * 0.1,
    borderRadius: width * 0.4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingTop: Platform.OS === 'ios' ? Spacing[16] : Spacing[12],
    paddingBottom: Spacing[4],
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  backButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.12)',
  },
  backButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    lineHeight: Typography.body.lineHeight,
    opacity: 0.8,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  historyButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.12)',
  },
  historyButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    lineHeight: Typography.body.lineHeight,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[10],
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
    marginBottom: Spacing[6],
  },
  waveformContainer: {
    position: 'relative',
  },
  waveformGradient: {
    width: 60,
    height: 60,
    borderRadius: Radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  playerInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    letterSpacing: Typography.h3.letterSpacing,
    lineHeight: Typography.h3.lineHeight,
    marginBottom: Spacing[1],
  },
  audioSubtitle: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    opacity: 0.5,
  },
  progressSection: {
    marginBottom: Spacing[6],
  },
  progressBarContainer: {
    gap: Spacing[2],
  },
  progressBar: {
    height: 6,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PremiumColors.primary[500],
    borderRadius: Radius.full,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: '500',
    lineHeight: Typography.bodySmall.lineHeight,
    opacity: 0.5,
    fontVariant: ['tabular-nums'],
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing[4],
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: PremiumColors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  stopButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: PremiumColors.primary[300],
  },
  textHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[5],
  },
  textIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    letterSpacing: Typography.h3.letterSpacing,
    lineHeight: Typography.h3.lineHeight,
    marginBottom: Spacing[0],
  },
  textSubtitle: {
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: Typography.bodySmall.fontWeight,
    lineHeight: Typography.bodySmall.lineHeight,
    opacity: 0.6,
    letterSpacing: 0.1,
  },
  textContainer: {
    borderRadius: Radius.xl,
    padding: Spacing[5],
    minHeight: 200,
    borderWidth: 1.5,
    ...Shadows.sm,
  },
  translatedText: {
    fontSize: Typography.bodyLarge.fontSize,
    lineHeight: Typography.bodyLarge.lineHeight,
    letterSpacing: 0.2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: '600',
    lineHeight: Typography.bodySmall.lineHeight,
    opacity: 0.5,
    marginBottom: Spacing[0],
  },
  infoValue: {
    fontSize: Typography.body.fontSize,
    fontWeight: '400',
    lineHeight: Typography.body.lineHeight,
    opacity: 0.9,
  },
});
