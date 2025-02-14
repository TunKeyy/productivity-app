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
import { useTheme } from '@/providers/ThemeProvider';

export default function CalendarScreen() {
  const { colors, theme } = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      <View style={[styles.header, { 
        backgroundColor: colors.background.default,
        borderBottomColor: colors.border 
      }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Calendar</Text>
        <TouchableOpacity 
          style={[styles.todayButton, { backgroundColor: colors.background.secondary }]}
        >
          <Text style={[styles.todayButtonText, { color: colors.primary }]}>
            Today
          </Text>
        </TouchableOpacity>
      </View>

      <RNCalendar
        style={[styles.calendar, { borderBottomColor: colors.border }]}
        theme={{
          backgroundColor: colors.background.default,
          calendarBackground: colors.background.default,
          textSectionTitleColor: colors.text.secondary,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: '#FFFFFF',
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

      <View style={[styles.taskSection, { borderTopColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Schedule</Text>
        <ScrollView style={styles.taskList}>
          {tasks.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.background.secondary }]}>
              <MaterialIcons 
                name="event-available" 
                size={48} 
                color={colors.secondary}
              />
              <Text style={[styles.emptyStateText, { color: colors.text.primary }]}>
                No tasks scheduled
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.text.secondary }]}>
                Tap + to add a new task
              </Text>
            </View>
          ) : (
            tasks.map(task => (
              <View 
                key={task.id} 
                style={[styles.taskItem, { backgroundColor: colors.background.secondary }]}
              >
                <View style={styles.taskTime}>
                  <Text style={[styles.timeText, { color: colors.text.secondary }]}>
                    {new Date(task.due_date!).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, { color: colors.text.primary }]}>
                    {task.title}
                  </Text>
                  {task.description && (
                    <Text 
                      style={[styles.taskDescription, { color: colors.text.secondary }]} 
                      numberOfLines={1}
                    >
                      {task.description}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]}>
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
  },
  todayButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  todayButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
  },
  calendar: {
    borderBottomWidth: 1,
  },
  taskSection: {
    flex: 1,
    padding: spacing.lg,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
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
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    fontSize: typography.fontSize.md,
    marginTop: spacing.xs,
  },
  taskItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  taskTime: {
    width: 60,
    marginRight: spacing.md,
  },
  timeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    marginBottom: 2,
  },
  taskDescription: {
    fontSize: typography.fontSize.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 