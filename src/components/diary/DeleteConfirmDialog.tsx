import React from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  Text, 
  TouchableOpacity,
  TouchableWithoutFeedback 
} from 'react-native';

interface DeleteConfirmDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ visible, onDismiss, onConfirm }: DeleteConfirmDialogProps) {
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
              <Text style={styles.title}>Delete Entry</Text>
              <Text style={styles.message}>
                Are you sure you want to delete this entry? This action cannot be undone.
              </Text>
              <View style={styles.buttons}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={onDismiss}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.deleteButton]} 
                  onPress={onConfirm}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  deleteButton: {
    backgroundColor: '#B00020',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
}); 