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

export function TaskList() {
  const { tasks, toggleTask } = useTasks();
  const incompleteTasks = tasks.filter((task: Task) => !task.completed);

  if (incompleteTasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons 
          name="check-circle" 
          size={48} 
          color={colors.secondary} 
        />
        <Text style={styles.emptyText}>All caught up!</Text>
        <Text style={styles.emptySubtext}>
          Time to add more tasks to stay productive
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {incompleteTasks.map(task => (
        <TouchableOpacity
          key={task.id}
          style={styles.taskItem}
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
                task.completed && styles.completedText
              ]}
              numberOfLines={1}
            >
              {task.title}
            </Text>
            {task.description ? (
              <Text 
                style={styles.taskDescription}
                numberOfLines={1}
              >
                {task.description}
              </Text>
            ) : null}
            {task.due_date ? (
              <View style={styles.dueDate}>
                <MaterialIcons 
                  name="access-time" 
                  size={14} 
                  color={colors.text.secondary} 
                />
                <Text style={styles.dueDateText}>
                  {formatDate(new Date(task.due_date))}
                </Text>
              </View>
            ) : null}
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
    backgroundColor: colors.background.default,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.default,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.text.primary,
    marginBottom: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  taskDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dueDateText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
}); 