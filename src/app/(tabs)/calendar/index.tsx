import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { colors, typography, spacing } from '@/constants/theme';
import { Task } from '@/types/database';
import { DayObject } from '@/types/calendar';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Placeholder data - replace with your actual data fetching logic
  const tasks: Task[] = [];

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: colors.primary,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <TouchableOpacity style={styles.todayButton}>
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>

      <RNCalendar
        style={styles.calendar}
        theme={{
          backgroundColor: colors.background.default,
          calendarBackground: colors.background.default,
          textSectionTitleColor: colors.text.secondary,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: colors.primary,
          dayTextColor: colors.text.primary,
          textDisabledColor: colors.text.light,
          dotColor: colors.primary,
          monthTextColor: colors.text.primary,
          textMonthFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
        markedDates={markedDates}
        onDayPress={(day: DayObject) => setSelectedDate(day.dateString)}
        enableSwipeMonths
      />

      <View style={styles.taskSection}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <ScrollView style={styles.taskList}>
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons 
                name="event-available" 
                size={48} 
                color={colors.secondary}
              />
              <Text style={styles.emptyStateText}>No tasks scheduled</Text>
              <Text style={styles.emptyStateSubtext}>
                Tap + to add a new task
              </Text>
            </View>
          ) : (
            tasks.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskTime}>
                  <Text style={styles.timeText}>
                    {new Date(task.due_date!).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  {task.description && (
                    <Text style={styles.taskDescription} numberOfLines={1}>
                      {task.description}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
  },
  todayButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
  },
  todayButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  taskSection: {
    flex: 1,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  taskList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  taskItem: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  taskTime: {
    width: 60,
    marginRight: spacing.md,
  },
  timeText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  taskDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 