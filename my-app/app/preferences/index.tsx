import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PreferencesScreen() {
  const params = useLocalSearchParams<{
    locations?: string;
    start?: string;
    end?: string;
    budgetFrom?: string;
    budgetTo?: string;
  }>();

  const parsedLocations = (() => {
    try {
      return params.locations ? (JSON.parse(params.locations) as string[]) : [];
    } catch (e) {
      return [];
    }
  })();

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Preferences (placeholder)
        </ThemedText>
        <ThemedText style={styles.subtitle}>Coming next in the flow.</ThemedText>

        <View style={styles.card}>
          <ThemedText style={styles.label}>Dates</ThemedText>
          <ThemedText style={styles.value}>
            {params.start || '?'} to {params.end || '?'}
          </ThemedText>
          <ThemedText style={[styles.label, { marginTop: 12 }]}>Budget</ThemedText>
          <ThemedText style={styles.value}>
            {params.budgetFrom || '?'} - {params.budgetTo || '?'} RON
          </ThemedText>
          <ThemedText style={[styles.label, { marginTop: 12 }]}>Locations</ThemedText>
          {parsedLocations.length ? (
            parsedLocations.map((loc) => (
              <ThemedText key={loc} style={styles.value}>
                • {loc}
              </ThemedText>
            ))
          ) : (
            <ThemedText style={styles.value}>None yet</ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#060712',
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 24,
  },
  content: {
    gap: 16,
  },
  title: {
    color: '#e5e7eb',
  },
  subtitle: {
    color: '#cbd5e1',
  },
  card: {
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2a4e',
    backgroundColor: '#0f172a',
    gap: 4,
  },
  label: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  value: {
    color: '#e5e7eb',
  },
});
