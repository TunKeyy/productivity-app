import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { colors, typography, spacing } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { useTasks } from '@/hooks/useTasks';

export default function TaskDetailScreen() {
  const { colors, theme } = useTheme();
  const { id } = useLocalSearchParams();
  const { getTask, toggleTask, deleteTask } = useTasks();
  const task = getTask(id as string);

  if (!task) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
        <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
        <View style={styles.content}>
          <Text style={[styles.errorText, { color: colors.text.primary }]}>Task not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>Task Details</Text>
        <TouchableOpacity onPress={() => router.push(`/home/task/${id}/edit`)}>
          <MaterialIcons name="edit" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.taskHeader}>
            <TouchableOpacity onPress={() => toggleTask(task.id)}>
              <MaterialIcons 
                name={task.completed ? "check-circle" : "radio-button-unchecked"}
                size={24}
                color={task.completed ? colors.primary : colors.text.secondary}
              />
            </TouchableOpacity>
            <Text style={[
              styles.taskTitle,
              { color: colors.text.primary },
              task.completed && { textDecorationLine: 'line-through' }
            ]}>
              {task.title}
            </Text>
          </View>

          {task.description && (
            <Text style={[styles.description, { color: colors.text.secondary }]}>
              {task.description}
            </Text>
          )}

          {task.due_date && (
            <View style={styles.dueDate}>
              <MaterialIcons name="event" size={20} color={colors.text.secondary} />
              <Text style={[styles.dueDateText, { color: colors.text.secondary }]}>
                {new Date(task.due_date).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.deleteButton, { backgroundColor: colors.error }]}
          onPress={() => {
            deleteTask(task.id);
            router.back();
          }}
        >
          <MaterialIcons name="delete" size={24} color="#FFFFFF" />
          <Text style={styles.deleteButtonText}>Delete Task</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  card: {
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  taskTitle: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
  },
  description: {
    fontSize: typography.fontSize.md,
    marginTop: spacing.md,
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  dueDateText: {
    fontSize: typography.fontSize.md,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: '600',
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    textAlign: 'center',
  },
}); 