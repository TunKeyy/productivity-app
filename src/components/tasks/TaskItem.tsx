import React from 'react';
import { 
  View, 
  StyleSheet, 
  Pressable, 
  Text,
} from 'react-native';
import { Task } from '@/types/database';
import { formatTime } from '@/utils/date';
import { useTasks } from '@/hooks/useTasks';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTask } = useTasks();

  return (
    <Pressable 
      style={[styles.container, task.completed && styles.completed]}
      onPress={() => toggleTask(task.id, task.completed)}
    >
      <View style={styles.checkbox}>
        <View style={[
          styles.checkboxInner,
          task.completed && styles.checkboxChecked
        ]} />
      </View>
      
      <View style={styles.content}>
        <Text style={[
          styles.title,
          task.completed && styles.completedText
        ]}>
          {task.title}
        </Text>
        {task.due_date && (
          <Text style={styles.dueDate}>
            Due: {formatTime(new Date(task.due_date))}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  completed: {
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#2196F3',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
  },
}); 