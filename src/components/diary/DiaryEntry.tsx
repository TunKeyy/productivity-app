import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { DiaryEntry as DiaryEntryType } from '@/types/database';
import { formatDate } from '@/utils/date';

interface DiaryEntryProps {
  entry: DiaryEntryType;
}

export function DiaryEntry({ entry }: DiaryEntryProps) {
  return (
    <Link href={`/diary/entry/${entry.id}`} asChild>
      <TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.date}>{formatDate(new Date(entry.created_at))}</Text>
            {entry.mood && (
              <View style={styles.moodTag}>
                <Text style={styles.moodText}>{entry.mood}</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.content} numberOfLines={3}>
            {entry.content}
          </Text>
          
          {entry.tags && entry.tags.length > 0 && (
            <View style={styles.tags}>
              {entry.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  moodTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  moodText: {
    color: '#1976D2',
    fontSize: 12,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: '#666',
    fontSize: 12,
  },
}); 