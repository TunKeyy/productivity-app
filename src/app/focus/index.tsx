import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useKeepAwake } from 'expo-keep-awake';
import { colors, typography } from '@/constants/theme';
import { Button } from '@/components/common/Button';

const FOCUS_DURATION = 15 * 60; // 15 minutes in seconds

export default function FocusScreen() {
  useKeepAwake();
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>15 min activity</Text>
        <Text style={styles.timeRange}>5:30PM → 5:45PM</Text>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.progressRing}>
          <Text style={styles.timerText}>{formatTimeLeft()}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddMinute}
        >
          <Text style={styles.addButtonText}>+1 min</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => setIsActive(!isActive)}
        >
          <MaterialIcons 
            name={isActive ? "pause" : "play-arrow"} 
            size={32} 
            color="#000000" 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  timeRange: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
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
    borderColor: '#FFB5BA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.default,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '600',
    color: colors.text.primary,
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
    backgroundColor: colors.background.secondary,
  },
  addButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    fontWeight: '500',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 