import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { useDiary } from '@/hooks/useDiary';
import { DiaryEntry as DiaryEntryType } from '@/types/database';
import { formatDate } from '@/utils/date';
import { useTheme } from '@/providers/ThemeProvider';

export default function DiaryScreen() {
  const { colors, theme } = useTheme();
  const { entries, loading, error } = useDiary();

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Your Diary</Text>

        {entries.length === 0 ? (
          <Text style={[styles.empty, { color: colors.text.secondary }]}>
            No entries yet. Start writing your thoughts!
          </Text>
        ) : (
          entries.map((entry: DiaryEntryType) => (
            <TouchableOpacity
              key={entry.id}
              style={[
                styles.entryCard,
                { 
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border 
                }
              ]}
              onPress={() => router.push(`/diary/entry/${entry.id}`)}
            >
              <Text style={[styles.entryDate, { color: colors.text.secondary }]}>
                {formatDate(new Date(entry.created_at))}
              </Text>
              <Text 
                style={[styles.entryContent, { color: colors.text.primary }]}
                numberOfLines={3}
              >
                {entry.content}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/diary/new')}
      >
        <Text style={[styles.fabIcon, { color: '#FFFFFF' }]}>+</Text>
        <Text style={[styles.fabLabel, { color: '#FFFFFF' }]}>New Entry</Text>
      </TouchableOpacity>
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
  entryCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 16,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  entryContent: {
    fontSize: 16,
  },
}); 