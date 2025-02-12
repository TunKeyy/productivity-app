import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';
import { useDiary } from '@/hooks/useDiary';
import { DiaryEntry } from '@/components/diary/DiaryEntry';
import { DiaryEntry as DiaryEntryType } from '@/types/database';

export default function DiaryScreen() {
  const { entries, loading, error } = useDiary();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Your Diary</Text>

        {entries.length === 0 ? (
          <Text style={styles.empty}>
            No entries yet. Start writing your thoughts!
          </Text>
        ) : (
          entries.map((entry: DiaryEntryType) => (
            <DiaryEntry key={entry.id} entry={entry} />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/diary/new')}
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabLabel}>New Entry</Text>
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
    marginBottom: 16,
    color: '#000',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 32,
  },
  error: {
    color: '#B00020',
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 24,
    marginRight: 8,
  },
  fabLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 