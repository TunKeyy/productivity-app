import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { colors, typography, spacing } from '@/constants/theme';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  // Modify data format for react-native-chart-kit
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [3, 5, 2, 8, 4, 6, 3]
    }]
  };

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [20, 45, 28, 50, 35, 43]
    }]
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCards}>
          <View style={[styles.card, { backgroundColor: colors.accent }]}>
            <MaterialIcons name="check-circle" size={24} color={colors.primary} />
            <Text style={styles.cardValue}>24</Text>
            <Text style={styles.cardLabel}>Tasks Completed</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#F8E4FF' }]}>
            <MaterialIcons name="timer" size={24} color="#9C27B0" />
            <Text style={styles.cardValue}>12h</Text>
            <Text style={styles.cardLabel}>Focus Time</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={weeklyData}
              width={screenWidth - spacing.lg * 2}
              height={220}
              chartConfig={{
                backgroundColor: colors.background.default,
                backgroundGradientFrom: colors.background.default,
                backgroundGradientTo: colors.background.default,
                decimalPlaces: 0,
                color: () => colors.primary,
                labelColor: () => colors.text.secondary,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: colors.primary
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Overview</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={monthlyData}
              width={screenWidth - spacing.lg * 2}
              height={220}
              chartConfig={{
                backgroundColor: colors.background.default,
                backgroundGradientFrom: colors.background.default,
                backgroundGradientTo: colors.background.default,
                decimalPlaces: 0,
                color: () => colors.primary,
                labelColor: () => colors.text.secondary,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: colors.primary
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          {['Work', 'Personal', 'Study', 'Health'].map((category, index) => (
            <View key={category} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryCount}>8 tasks</Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${80 - index * 15}%` }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  card: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
  },
  cardValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '600',
    color: colors.text.primary,
    marginVertical: spacing.xs,
  },
  cardLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chartContainer: {
    backgroundColor: colors.background.default,
    borderRadius: 16,
    padding: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  chart: {
    borderRadius: 16,
    marginVertical: spacing.sm,
  },
  categoryItem: {
    marginBottom: spacing.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  categoryCount: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
}); 