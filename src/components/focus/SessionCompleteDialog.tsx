import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  TouchableWithoutFeedback 
} from 'react-native';

interface SessionCompleteDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onComplete: () => void;
}

export function SessionCompleteDialog({
  visible,
  onDismiss,
  onComplete,
}: SessionCompleteDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <Text style={styles.title}>Focus Session Complete!</Text>
              <Text style={styles.message}>
                Great job! You've completed your focus session.
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={onDismiss}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.completeButton]} 
                  onPress={onComplete}
                >
                  <Text style={styles.completeButtonText}>Complete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    width: '80%',
    maxWidth: 340,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  completeButton: {
    backgroundColor: '#2196F3',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
}); 