import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTasks } from '@/hooks/useTasks';
import { colors, typography, spacing } from '@/constants/theme';
import { formatDate } from '@/utils/date';
import { Task } from '@/types/database';
import { useTheme } from '@/providers/ThemeProvider';

export function TaskList() {
  const { tasks, toggleTask } = useTasks();
  const { colors, theme } = useTheme();
  const incompleteTasks = tasks.filter((task: Task) => !task.completed);

  if (incompleteTasks.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background.secondary }]}>
        <MaterialIcons 
          name="check-circle" 
          size={48} 
          color={colors.secondary} 
        />
        <Text style={[styles.emptyText, { color: colors.text.primary }]}>
          All caught up!
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>
          Time to add more tasks to stay productive
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      {incompleteTasks.map((task: Task) => (
        <TouchableOpacity
          key={task.id}
          style={[
            styles.taskItem,
            { 
              backgroundColor: colors.background.secondary,
              borderColor: colors.border,
            }
          ]}
          onPress={() => router.push(`/home/task/${task.id}`)}
        >
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => toggleTask(task.id)}
          >
            <MaterialIcons 
              name={task.completed ? "check-circle" : "radio-button-unchecked"}
              size={24}
              color={task.completed ? colors.primary : colors.text.secondary}
            />
          </TouchableOpacity>

          <View style={styles.taskContent}>
            <Text 
              style={[
                styles.taskTitle,
                { color: colors.text.primary },
                task.completed && { color: colors.text.secondary }
              ]}
              numberOfLines={1}
            >
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
            {task.due_date && (
              <View style={styles.dueDate}>
                <MaterialIcons 
                  name="event" 
                  size={16} 
                  color={colors.text.secondary} 
                />
                <Text style={[styles.dueDateText, { color: colors.text.secondary }]}>
                  {formatDate(new Date(task.due_date))}
                </Text>
              </View>
            )}
          </View>

          <MaterialIcons 
            name="chevron-right" 
            size={24} 
            color={colors.text.secondary} 
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  checkbox: {
    marginRight: spacing.md,
  },
  taskContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  taskTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    marginBottom: 2,
  },
  taskDescription: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dueDateText: {
    fontSize: typography.fontSize.sm,
  },
}); 