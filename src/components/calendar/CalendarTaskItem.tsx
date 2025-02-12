import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Task } from '@/types/database';
import { formatTime } from '@/utils/date';
import { useTasks } from '@/hooks/useTasks';

interface CalendarTaskItemProps {
  task: Task;
}

export function CalendarTaskItem({ task }: CalendarTaskItemProps) {
  const { toggleTask } = useTasks();

  return (
    <Link href={`/home/task/${task.id}`} asChild>
      <TouchableOpacity>
        <View style={[styles.container, task.completed && styles.completed]}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => toggleTask(task.id, !task.completed)}
          >
            <View style={[
              styles.checkboxInner,
              task.completed && styles.checkboxChecked
            ]} />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={[
              styles.title,
              task.completed && styles.completedText
            ]}>
              {task.title}
            </Text>
            {task.due_date && (
              <Text style={styles.time}>
                {formatTime(new Date(task.due_date))}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
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
    elevation: 1,
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
  time: {
    fontSize: 14,
    color: '#666',
  },
}); 