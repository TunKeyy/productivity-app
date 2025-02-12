import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks } from '@/hooks/useTasks';
import { formatDate, formatTime } from '@/utils/date';
import { RecurringPatternConfig } from '@/components/tasks/RecurringPatternConfig';
import { RecurringPattern } from '@/types/database';

const PRIORITIES = [
  { label: 'Low', value: 1 },
  { label: 'Medium', value: 2 },
  { label: 'High', value: 3 },
];

interface DateTimePickerEvent {
  type: string;
  nativeEvent: {
    timestamp?: number;
  };
}

export default function NewTaskScreen() {
  const { date: preSelectedDate } = useLocalSearchParams<{ date?: string }>();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState<Date | null>(
    preSelectedDate ? new Date(preSelectedDate) : null
  );
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [priority, setPriority] = React.useState(1);
  const [tag, setTag] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [recurringPattern, setRecurringPattern] = React.useState<RecurringPattern>();

  const { addTask } = useTasks();

  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t: string) => t !== tagToRemove));
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = dueDate ? new Date(dueDate) : new Date();
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDueDate(newDate);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = dueDate ? new Date(dueDate) : new Date();
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDueDate(newDate);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await addTask({
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate?.toISOString(),
        priority,
        tags,
        recurring_pattern: recurringPattern,
      });

      if (error) throw error;
      router.back();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>New Task</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
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

      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="time"
          onChange={handleTimeChange}
        />
      )}

      <View style={styles.prioritySection}>
        <Text style={styles.sectionTitle}>Priority</Text>
        <View style={styles.priorities}>
          {PRIORITIES.map(p => (
            <TouchableOpacity
              key={p.value}
              style={[
                styles.priorityChip,
                priority === p.value && styles.selectedPriorityChip
              ]}
              onPress={() => setPriority(p.value)}
            >
              <Text style={[
                styles.priorityText,
                priority === p.value && styles.selectedPriorityText
              ]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.tagsSection}>
        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagInput}>
          <TextInput
            style={styles.tagTextInput}
            placeholder="Add a tag..."
            value={tag}
            onChangeText={setTag}
          />
          <TouchableOpacity 
            style={styles.addTagButton}
            onPress={handleAddTag}
          >
            <Text style={styles.addTagButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tags}>
          {tags.map(t => (
            <TouchableOpacity
              key={t}
              style={styles.tag}
              onPress={() => handleRemoveTag(t)}
            >
              <Text style={styles.tagText}>{t}</Text>
              <Text style={styles.removeTag}>×</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.recurringSection}>
        <Text style={styles.sectionTitle}>Recurring</Text>
        <RecurringPatternConfig
          value={recurringPattern}
          onChange={setRecurringPattern}
        />
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Create Task</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
  priorities: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedPriorityChip: {
    backgroundColor: '#2196F3',
  },
  priorityText: {
    color: '#666',
    fontSize: 16,
  },
  selectedPriorityText: {
    color: '#fff',
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagInput: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tagTextInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addTagButtonText: {
    color: '#fff',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#666',
    marginRight: 4,
  },
  removeTag: {
    color: '#666',
    fontSize: 18,
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
    marginVertical: 16,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recurringSection: {
    marginBottom: 24,
  },
}); 