import { useState } from 'react';
import { StyleSheet, View, Pressable, TextInput, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomNav } from '@/components/bottom-nav';

export default function HomeScreen() {
  const router = useRouter();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetFrom, setBudgetFrom] = useState('');
  const [budgetTo, setBudgetTo] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [error, setError] = useState('');

  const onChangeDate = (
    field: 'start' | 'end',
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (event.type === 'dismissed') {
      field === 'start' ? setShowStartPicker(false) : setShowEndPicker(false);
      return;
    }
    const selected = date || new Date();
    const formatted = formatDate(selected);
    if (field === 'start') {
      setStartDate(formatted);
      setShowStartPicker(Platform.OS === 'ios');
    } else {
      setEndDate(formatted);
      setShowEndPicker(Platform.OS === 'ios');
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.headerText}>
              TripBuddy
            </ThemedText>
          </View>

          <View style={styles.form}>
            <ThemedText type="title" style={styles.sectionTitle}>
              Time frame
            </ThemedText>
            <View style={styles.row}>
              <Pressable onPress={() => setShowStartPicker(true)} style={styles.input}>
                <ThemedText style={styles.inputText}>
                  {startDate || 'Start (DD/MM/YYYY)'}
                </ThemedText>
              </Pressable>
              <View style={styles.toWrapper}>
                <ThemedText style={styles.to}>to</ThemedText>
              </View>
              <Pressable onPress={() => setShowEndPicker(true)} style={styles.input}>
                <ThemedText style={styles.inputText}>{endDate || 'End (DD/MM/YYYY)'}</ThemedText>
              </Pressable>
            </View>

            <View style={styles.budgetRow}>
              <ThemedText style={styles.budgetLabel}>Budget</ThemedText>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.budgetInput]}
                  placeholder="From"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={budgetFrom}
                  onChangeText={setBudgetFrom}
                />
                <View style={styles.toWrapper}>
                  <ThemedText style={styles.to}>to</ThemedText>
                </View>
                <TextInput
                  style={[styles.input, styles.budgetInput]}
                  placeholder="To"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={budgetTo}
                  onChangeText={setBudgetTo}
                />
                <ThemedText style={styles.currency}>RON</ThemedText>
              </View>
            </View>
          </View>

          {error ? (
            <ThemedText style={styles.error}>{error}</ThemedText>
          ) : null}

          <Pressable
            style={styles.primary}
            android_ripple={{ color: 'rgba(255,255,255,0.12)' }}
            onPress={() => {
              const numericRegex = /^[0-9]+$/;
              const start = parseDate(startDate);
              const end = parseDate(endDate);
              if (!start || !end || !budgetFrom || !budgetTo) {
                setError('Please fill all fields.');
                return;
              }
              if (!numericRegex.test(budgetFrom) || !numericRegex.test(budgetTo)) {
                setError('Budget must be numbers only.');
                return;
              }
              if (end.getTime() < start.getTime()) {
                setError('End date must be after start date.');
                return;
              }
              const low = Math.min(parseInt(budgetFrom, 10), parseInt(budgetTo, 10));
              const high = Math.max(parseInt(budgetFrom, 10), parseInt(budgetTo, 10));
              setBudgetFrom(String(low));
              setBudgetTo(String(high));
              setError('');
              const query = new URLSearchParams({
                start: startDate,
                end: endDate,
                budgetFrom: String(low),
                budgetTo: String(high),
              }).toString();
              router.push(`/locations?${query}`);
            }}>
            <ThemedText type="title" style={styles.primaryText}>
              Create journey
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate ? parseDate(startDate) : new Date()}
          mode="date"
          display="default"
          onChange={(e, d) => onChangeDate('start', e, d)}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate ? parseDate(endDate) : new Date()}
          mode="date"
          display="default"
          onChange={(e, d) => onChangeDate('end', e, d)}
        />
      )}

      <BottomNav />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#060712',
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 28,
    gap: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '92%',
    maxWidth: 480,
    backgroundColor: 'transparent',
    gap: 22,
  },
  header: {
    gap: 8,
    alignItems: 'flex-start',
  },
  headerText: {
    color: '#e5e7eb',
    textAlign: 'left',
  },
  form: {
    gap: 14,
  },
  sectionTitle: {
    color: '#e5e7eb',
    marginBottom: 2,
  },
  row: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetRow: {
    gap: 6,
  },
  budgetLabel: {
    color: '#e5e7eb',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
    paddingHorizontal: 12,
    justifyContent: 'center',
    color: '#f8fafc',
    backgroundColor: '#0f172a',
    flex: 1,
  },
  inputText: {
    color: '#f8fafc',
  },
  budgetInput: {
    flex: 1,
  },
  toWrapper: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  to: {
    color: '#e5e7eb',
    paddingHorizontal: 6,
    lineHeight: 18,
  },
  currency: {
    color: '#e5e7eb',
    fontWeight: '600',
    marginLeft: 4,
  },
  primary: {
    marginTop: 18,
    alignSelf: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 50,
    shadowColor: '#6366f1',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
  },
  primaryText: {
    color: '#f8fafc',
  },
  error: {
    color: '#f87171',
    marginTop: 4,
  },
});

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseDate(value: string) {
  const [dayStr, monthStr, yearStr] = value.split('/');
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    day < 1 ||
    month < 1 ||
    month > 12 ||
    year < 1900
  ) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}
