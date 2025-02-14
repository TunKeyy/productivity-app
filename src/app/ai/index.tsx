import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

export default function AIScreen() {
  const { colors, theme } = useTheme();
  const [messages] = React.useState([
    { text: "Hello! How can I help you today?", isUser: false },
    { text: "I need help with my tasks", isUser: true },
    { text: "I'd be happy to help you manage your tasks. What specifically would you like help with?", isUser: false },
  ]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>AI Assistant</Text>
      </View>

      <ScrollView 
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((message, index) => (
          <View 
            key={index} 
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.assistantMessage,
              { 
                backgroundColor: message.isUser ? 
                  colors.primary : 
                  colors.background.secondary 
              }
            ]}
          >
            <Text style={[
              styles.messageText,
              { color: message.isUser ? '#FFFFFF' : colors.text.primary }
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.background.secondary,
            color: colors.text.primary 
          }]}
          placeholder="Type your message..."
          placeholderTextColor={colors.text.secondary}
        />
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
        >
          <MaterialIcons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    fontSize: typography.fontSize.md,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    padding: spacing.md,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: typography.fontSize.md,
  },
}); 