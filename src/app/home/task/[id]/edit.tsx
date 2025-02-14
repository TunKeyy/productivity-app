import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, typography, spacing } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { useTasks } from '@/hooks/useTasks';

export default function EditTaskScreen() {
  const { colors, theme } = useTheme();
  const { id } = useLocalSearchParams();
  const { getTask, updateTask } = useTasks();
  const task = getTask(id as string);

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState<Date | null>(
    task?.due_date ? new Date(task.due_date) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !task) return;
    
    updateTask(task.id, {
      ...task,
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate?.toISOString(),
    });
    
    router.back();
  };

  if (!task) {
    router.back();
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text.primary }]}>Edit Task</Text>
        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={!title.trim()}
        >
          <MaterialIcons 
            name="check" 
            size={24} 
            color={title.trim() ? colors.primary : colors.text.light} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          style={[styles.titleInput, { 
            color: colors.text.primary,
            backgroundColor: colors.background.secondary 
          }]}
          placeholder="Task title"
          placeholderTextColor={colors.text.secondary}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.descriptionInput, { 
            color: colors.text.primary,
            backgroundColor: colors.background.secondary 
          }]}
          placeholder="Description (optional)"
          placeholderTextColor={colors.text.secondary}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity 
          style={[styles.dateButton, { backgroundColor: colors.background.secondary }]}
          onPress={() => setShowDatePicker(true)}
        >
          <MaterialIcons name="event" size={24} color={colors.text.primary} />
          <Text style={[styles.dateButtonText, { color: colors.text.primary }]}>
            {dueDate ? dueDate.toLocaleDateString() : 'Add due date'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
          />
        )}
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
  titleInput: {
    fontSize: typography.fontSize.lg,
    fontWeight: '500',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  descriptionInput: {
    fontSize: typography.fontSize.md,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    gap: spacing.sm,
  },
  dateButtonText: {
    fontSize: typography.fontSize.md,
  },
}); 