import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Task } from '@/types/database';

interface TaskSelectorProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (task: Task) => void;
}

export function TaskSelector({ tasks, selectedTaskId, onSelectTask }: TaskSelectorProps) {
  const incompleteTasks = tasks.filter(task => !task.completed);

  if (incompleteTasks.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No tasks available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a task to focus on</Text>
      <ScrollView style={styles.list}>
        {incompleteTasks.map(task => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskItem}
            onPress={() => onSelectTask(task)}
          >
            <MaterialIcons
              name={selectedTaskId === task.id ? 'check-circle' : 'radio-button-unchecked'}
              size={24}
              color={selectedTaskId === task.id ? '#2196F3' : '#757575'}
              style={styles.icon}
            />
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              {task.description ? (
                <Text style={styles.taskDescription}>{task.description}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  list: {
    maxHeight: 200,
  },
  empty: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#757575',
    fontSize: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  icon: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#757575',
  },
}); 