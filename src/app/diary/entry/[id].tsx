import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/services/supabase/client';
import { DiaryEntry } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { useDiary } from '@/hooks/useDiary';
import { formatDate } from '@/utils/date';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import { colors, typography, spacing } from '@/constants/theme';
import { PostgrestError } from '@supabase/supabase-js';

export default function DiaryEntryDetailScreen() {
  const { colors, theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { deleteEntry, updateEntry } = useDiary();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [content, setContent] = React.useState('');

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        if (!id || !user) {
          setError('Invalid entry ID or user not authenticated');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('diary_entries')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Entry not found');
        
        setEntry(data as DiaryEntry);
        setContent(data.content);
      } catch (err) {
        const error = err as Error | PostgrestError;
        setError('message' in error ? error.message : error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id, user]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await deleteEntry(id);
              if (error) throw error;
              router.back();
            } catch (err) {
              setError((err as Error).message);
              Alert.alert('Error', 'Failed to delete entry. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!content.trim() || !entry) return;
    
    try {
      const { error } = await updateEntry(entry.id, {
        ...entry,
        content: content.trim(),
      });
      if (error) throw error;
      setIsEditing(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
        <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
        <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
        <View style={styles.centered}>
          <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!entry) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Entry not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.date, { color: colors.text.secondary }]}>
          {formatDate(new Date(entry.created_at))}
        </Text>
        {isEditing ? (
          <TouchableOpacity onPress={handleSave}>
            <MaterialIcons name="check" size={24} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <MaterialIcons name="edit" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {isEditing ? (
            <TextInput
              style={[styles.input, { 
                color: colors.text.primary,
                backgroundColor: colors.background.secondary 
              }]}
              value={content}
              onChangeText={setContent}
              multiline
              autoFocus
              placeholder="Write your thoughts..."
              placeholderTextColor={colors.text.secondary}
            />
          ) : (
            <Text style={[styles.text, { color: colors.text.primary }]}>
              {entry.content}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {!isEditing && (
        <TouchableOpacity 
          style={[styles.deleteButton, { backgroundColor: colors.error }]}
          onPress={handleDelete}
        >
          <MaterialIcons name="delete" size={24} color="#FFFFFF" />
          <Text style={styles.deleteButtonText}>Delete Entry</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  date: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.md,
    padding: spacing.md,
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  text: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.relaxed,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.md,
    fontWeight: '600',
  },
  error: {
    color: '#B00020',
    textAlign: 'center',
    marginBottom: 16,
  },
}); 