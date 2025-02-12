import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { DailyStats } from '@/hooks/useStatistics';

interface ProductivityChartProps {
  stats: DailyStats[];
}

export function ProductivityChart({ stats }: ProductivityChartProps) {
  const data = {
    labels: stats.map(stat => stat.date.split('-')[2]),
    datasets: [{
      data: stats.map(stat => stat.productivity_score),
    }],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productivity Trend</Text>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
}); 