import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { TaskList } from '@/components/tasks/TaskList';
import { colors, typography, spacing } from '@/constants/theme';
import { formatDate } from '@/utils/date';
import { useTheme } from '@/providers/ThemeProvider';
import { Navigation } from '@/navigation/Nagivation';

export default function HomeScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text.primary }]}>
            Hello, {user?.email?.split('@')[0]}
          </Text>
          <Text style={[styles.date, { color: colors.text.secondary }]}>
            {formatDate(new Date())}
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: colors.background.secondary }]}
            onPress={toggleTheme}
          >
            <MaterialIcons 
              name={theme === 'dark' ? "light-mode" : "dark-mode"} 
              size={24} 
              color={colors.text.primary} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: colors.background.secondary }]}
          >
            <MaterialIcons name="person" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/focus')}
          >
            <MaterialIcons name="timer" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>Focus Timer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: '#F8E4FF' }]}
            onPress={() => router.push('/calendar')}
          >
            <MaterialIcons name="event" size={24} color="#9C27B0" />
            <Text style={styles.quickActionText}>Calendar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <TouchableOpacity onPress={() => router.push('/home/new')}>
              <MaterialIcons name="add" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <TaskList />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <TouchableOpacity onPress={() => router.push('/statistics')}>
              <MaterialIcons name="arrow-forward" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {/* Add your statistics components here */}
        </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
  },
  date: {
    fontSize: typography.fontSize.md,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  quickAction: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickActionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
  },
}); 