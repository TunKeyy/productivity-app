import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DailyStats } from '@/hooks/useStatistics';

interface StatsOverviewProps {
  stats: DailyStats[];
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const totalTasks = stats.reduce((sum, day) => sum + day.tasks_completed, 0);
  const totalFocusTime = stats.reduce((sum, day) => sum + day.focus_time, 0);
  const avgProductivity = stats.reduce((sum, day) => sum + day.productivity_score, 0) / stats.length;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.value}>{totalTasks}</Text>
        <Text style={styles.label}>Tasks Completed</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.value}>{Math.round(totalFocusTime / 60)}</Text>
        <Text style={styles.label}>Focus Hours</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.value}>{Math.round(avgProductivity)}%</Text>
        <Text style={styles.label}>Avg. Productivity</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    elevation: 2,
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
}); 