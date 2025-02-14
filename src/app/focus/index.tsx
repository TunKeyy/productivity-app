import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useKeepAwake } from 'expo-keep-awake';
import { typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

const FOCUS_DURATION = 15 * 60; // 15 minutes in seconds

export default function FocusScreen() {
  const { colors, theme } = useTheme();
  // Only use keep-awake on native platforms
  if (Platform.OS !== 'web') {
    useKeepAwake();
  }

  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);

  const formatTimeLeft = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft]);

  const handleAddMinute = () => {
    setTimeLeft(time => time + 60);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Focus Timer</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Stay focused and productive
        </Text>
      </View>

      <View style={styles.timerContainer}>
        <View style={[styles.progressRing, { 
          borderColor: colors.accent,
          backgroundColor: colors.background.default 
        }]}>
          <Text style={[styles.timerText, { color: colors.text.primary }]}>
            {formatTimeLeft()}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.background.secondary }]}
          onPress={handleAddMinute}
        >
          <Text style={[styles.addButtonText, { color: colors.text.primary }]}>
            +1 min
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.playButton, { backgroundColor: colors.background.secondary }]}
          onPress={() => setIsActive(!isActive)}
        >
          <MaterialIcons 
            name={isActive ? "pause" : "play-arrow"} 
            size={32} 
            color={colors.text.primary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRing: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    gap: 20,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 