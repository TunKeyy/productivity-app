import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TextInput,
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '@/services/supabase/client';
import { Task } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { formatDate, formatTime } from '@/utils/date';

const PRIORITIES = [
  { label: 'Low', value: 1 },
  { label: 'Medium', value: 2 },
  { label: 'High', value: 3 },
];

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { updateTask } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        
        const task = data as Task;
        setTask(task);
        setTitle(task.title);
        setDescription(task.description || '');
        setDueDate(task.due_date ? new Date(task.due_date) : null);
        setPriority(task.priority || 1);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, user]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { error } = await updateTask(id, {
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate?.toISOString(),
        priority,
      });
      if (error) throw error;
      router.back();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Task not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Edit Task</Text>

        <TextInput
          style={styles.input}
          placeholder="Task title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Due Date</Text>
          <View style={styles.dateButtons}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {dueDate ? formatDate(dueDate) : 'Select Date'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {dueDate ? formatTime(dueDate) : 'Select Time'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.prioritySection}>
          <Text style={styles.sectionTitle}>Priority</Text>
          <View style={styles.priorityButtons}>
            {PRIORITIES.map(p => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.priorityButton,
                  priority === p.value && styles.selectedPriority
                ]}
                onPress={() => setPriority(p.value)}
              >
                <Text style={[
                  styles.priorityButtonText,
                  priority === p.value && styles.selectedPriorityText
                ]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              const newDate = dueDate ? new Date(dueDate) : new Date();
              newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
              setDueDate(newDate);
            }
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="time"
          onChange={(event, date) => {
            setShowTimePicker(false);
            if (date) {
              const newDate = dueDate ? new Date(dueDate) : new Date();
              newDate.setHours(date.getHours(), date.getMinutes());
              setDueDate(newDate);
            }
          }}
        />
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  dateSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  dateButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  dateButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#666',
  },
  prioritySection: {
    marginBottom: 24,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  priorityButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPriority: {
    backgroundColor: '#2196F3',
  },
  priorityButtonText: {
    fontSize: 16,
    color: '#666',
  },
  selectedPriorityText: {
    color: '#fff',
  },
  error: {
    color: '#B00020',
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 