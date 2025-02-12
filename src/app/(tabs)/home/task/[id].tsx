import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/services/supabase/client';
import { Task } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { formatDate, formatTime } from '@/utils/date';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { toggleTask, deleteTask } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (!id || !user) return;

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setTask(data as Task);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, user]);

  const handleDelete = async () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              if (!id) return;
              const { error } = await deleteTask(id);
              if (error) throw error;
              router.back();
            } catch (err) {
              setError((err as Error).message);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error || !task) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error || 'Task not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>

      {task.description && (
        <Text style={styles.description}>{task.description}</Text>
      )}

      {task.due_date && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Due Date</Text>
          <Text style={styles.infoText}>
            {formatDate(new Date(task.due_date))} at{' '}
            {formatTime(new Date(task.due_date))}
          </Text>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Status</Text>
        <Text style={[
          styles.statusText,
          task.completed ? styles.completedStatus : styles.pendingStatus
        ]}>
          {task.completed ? 'Completed' : 'In Progress'}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.toggleButton]}
          onPress={() => toggleTask(task.id)}
        >
          <Text style={styles.buttonText}>
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => router.push(`/home/edit/${task.id}`)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  completedStatus: {
    color: '#4CAF50',
  },
  pendingStatus: {
    color: '#FFA000',
  },
  error: {
    color: '#B00020',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f5f5f5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#B00020',
    fontSize: 14,
    fontWeight: '600',
  },
}); 