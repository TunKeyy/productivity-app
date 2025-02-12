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
import { supabase } from '@/services/supabase/client';
import { DiaryEntry } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { useDiary } from '@/hooks/useDiary';

const MOODS = ['Happy', 'Sad', 'Excited', 'Tired', 'Anxious', 'Calm'];

export default function EditDiaryEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { updateEntry } = useDiary();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string | undefined>();
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        if (!id || !user) return;

        const { data, error } = await supabase
          .from('diary_entries')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        const entry = data as DiaryEntry;
        setEntry(entry);
        setContent(entry.content);
        setMood(entry.mood || undefined);
        setTags(entry.tags || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id, user]);

  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { error } = await updateEntry(id, {
        content: content.trim(),
        mood,
        tags,
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

  if (!entry) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Entry not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Edit Entry</Text>

        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.moodList}>
              {MOODS.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.moodChip,
                    mood === m && styles.selectedMoodChip
                  ]}
                  onPress={() => setMood(m)}
                >
                  <Text style={[
                    styles.moodText,
                    mood === m && styles.selectedMoodText
                  ]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <TextInput
          style={styles.contentInput}
          multiline
          placeholder="Write your thoughts..."
          value={content}
          onChangeText={setContent}
        />

        <View style={styles.tagSection}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagInput}>
            <TextInput
              style={styles.tagTextInput}
              placeholder="Add a tag..."
              value={tag}
              onChangeText={setTag}
              onSubmitEditing={handleAddTag}
            />
            <TouchableOpacity 
              style={styles.addTagButton}
              onPress={handleAddTag}
            >
              <Text style={styles.addTagButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagList}>
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

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}
      </ScrollView>

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
  moodSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  moodList: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  moodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  selectedMoodChip: {
    backgroundColor: '#2196F3',
  },
  moodText: {
    color: '#666',
  },
  selectedMoodText: {
    color: '#fff',
  },
  contentInput: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    textAlignVertical: 'top',
  },
  tagSection: {
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
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
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
    margin: 16,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 