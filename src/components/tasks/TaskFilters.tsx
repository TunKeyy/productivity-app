import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Modal,
  TouchableWithoutFeedback 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TaskFiltersProps {
  priority: number | null;
  onPriorityChange: (priority: number | null) => void;
  sortBy: 'due_date' | 'priority' | 'created_at';
  onSortChange: (sort: 'due_date' | 'priority' | 'created_at') => void;
  showCompleted: boolean;
  onShowCompletedChange: (show: boolean) => void;
}

export function TaskFilters({
  priority,
  onPriorityChange,
  sortBy,
  onSortChange,
  showCompleted,
  onShowCompletedChange,
}: TaskFiltersProps) {
  const [showSortMenu, setShowSortMenu] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.priorities}>
        <TouchableOpacity
          style={[styles.chip, priority === null && styles.selectedChip]}
          onPress={() => onPriorityChange(null)}
        >
          <Text style={[styles.chipText, priority === null && styles.selectedChipText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, priority === 1 && styles.selectedChip]}
          onPress={() => onPriorityChange(1)}
        >
          <Text style={[styles.chipText, priority === 1 && styles.selectedChipText]}>
            Low
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, priority === 2 && styles.selectedChip]}
          onPress={() => onPriorityChange(2)}
        >
          <Text style={[styles.chipText, priority === 2 && styles.selectedChipText]}>
            Medium
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, priority === 3 && styles.selectedChip]}
          onPress={() => onPriorityChange(3)}
        >
          <Text style={[styles.chipText, priority === 3 && styles.selectedChipText]}>
            High
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setShowSortMenu(true)}
        >
          <Text style={styles.sortButtonText}>
            Sort by: {sortBy.replace('_', ' ')}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#2196F3" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, showCompleted && styles.selectedChip]}
          onPress={() => onShowCompletedChange(!showCompleted)}
        >
          <Text style={[styles.chipText, showCompleted && styles.selectedChipText]}>
            Show completed
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showSortMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowSortMenu(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onSortChange('due_date');
                  setShowSortMenu(false);
                }}
              >
                <Text style={styles.menuItemText}>Due date</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onSortChange('priority');
                  setShowSortMenu(false);
                }}
              >
                <Text style={styles.menuItemText}>Priority</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onSortChange('created_at');
                  setShowSortMenu(false);
                }}
              >
                <Text style={styles.menuItemText}>Created date</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  priorities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  selectedChip: {
    backgroundColor: '#2196F3',
  },
  chipText: {
    color: '#2196F3',
    fontSize: 14,
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  sortButtonText: {
    color: '#2196F3',
    fontSize: 14,
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    width: '80%',
    maxWidth: 300,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#000000',
  },
}); 