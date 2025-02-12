import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  TextInput,
  ScrollView 
} from 'react-native';
import { RecurringPattern } from '@/types/database';

interface RecurringPatternConfigProps {
  value: RecurringPattern | undefined;
  onChange: (pattern: RecurringPattern | undefined) => void;
}

const FREQUENCIES = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
] as const;

const WEEKDAYS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

export function RecurringPatternConfig({ value, onChange }: RecurringPatternConfigProps) {
  const [showConfig, setShowConfig] = React.useState(!!value);

  const handleFrequencyChange = (frequency: RecurringPattern['frequency']) => {
    onChange({
      frequency,
      interval: 1,
    });
  };

  const handleIntervalChange = (text: string) => {
    const interval = parseInt(text, 10);
    if (!isNaN(interval) && interval > 0) {
      onChange({
        ...value!,
        interval,
      });
    }
  };

  const handleWeekdayToggle = (day: number) => {
    if (!value) return;

    const weekdays = value.weekdays || [];
    const newWeekdays = weekdays.includes(day)
      ? weekdays.filter(d => d !== day)
      : [...weekdays, day].sort();

    onChange({
      ...value,
      weekdays: newWeekdays,
    });
  };

  const handleMonthDayChange = (text: string) => {
    const day = parseInt(text, 10);
    if (!isNaN(day) && day >= 1 && day <= 31) {
      onChange({
        ...value!,
        monthDay: day,
      });
    }
  };

  if (!showConfig) {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setShowConfig(true);
          onChange({ frequency: 'daily', interval: 1 });
        }}
      >
        <Text style={styles.buttonText}>Make Recurring</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recurring Pattern</Text>
        <TouchableOpacity
          onPress={() => {
            setShowConfig(false);
            onChange(undefined);
          }}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.frequencies}>
          {FREQUENCIES.map(freq => (
            <TouchableOpacity
              key={freq.value}
              style={[
                styles.chip,
                value?.frequency === freq.value && styles.selectedChip
              ]}
              onPress={() => handleFrequencyChange(freq.value)}
            >
              <Text style={[
                styles.chipText,
                value?.frequency === freq.value && styles.selectedChipText
              ]}>
                {freq.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {value && (
        <>
          <View style={styles.intervalSection}>
            <Text>Repeat every</Text>
            <TextInput
              value={value.interval?.toString() || '1'}
              onChangeText={handleIntervalChange}
              keyboardType="number-pad"
              style={styles.intervalInput}
            />
            <Text>
              {value.frequency === 'daily' && 'days'}
              {value.frequency === 'weekly' && 'weeks'}
              {value.frequency === 'monthly' && 'months'}
              {value.frequency === 'yearly' && 'years'}
            </Text>
          </View>

          {value.frequency === 'weekly' && (
            <View style={styles.weekdays}>
              {WEEKDAYS.map(day => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.weekdayChip,
                    value.weekdays?.includes(day.value) && styles.selectedChip
                  ]}
                  onPress={() => handleWeekdayToggle(day.value)}
                >
                  <Text style={[
                    styles.chipText,
                    value.weekdays?.includes(day.value) && styles.selectedChipText
                  ]}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {value.frequency === 'monthly' && (
            <View style={styles.monthDaySection}>
              <Text>Day of month:</Text>
              <TextInput
                value={value.monthDay?.toString() || ''}
                onChangeText={handleMonthDayChange}
                keyboardType="number-pad"
                placeholder="1-31"
                style={styles.monthDayInput}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  removeText: {
    color: '#FF0000',
    fontSize: 14,
  },
  frequencies: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
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
  intervalSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  intervalInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    textAlign: 'center',
  },
  weekdays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weekdayChip: {
    minWidth: 45,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  monthDaySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthDayInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
}); 