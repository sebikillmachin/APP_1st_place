import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PreferencesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    locations?: string;
    start?: string;
    end?: string;
    budgetFrom?: string;
    budgetTo?: string;
  }>();

  const gallery = useMemo(
    () => [
      'Food',
      'Party',
      'History',
      'Unique',
      'Nature',
      'Adventure',
      'Culture',
      'Relax',
      'Shopping',
      'Art',
      'Architecture',
      'Landmarks',
      'Photography',
      'Music',
      'Festivals',
      'Wellness',
      'Sports',
      'Beach',
      'Mountains',
      'Science & Tech',
      'Spiritual',
      'Local Life',
      'Quiet Spots',
      'Lively',
      'Budget',
      'Luxury',
      'Family',
      'Romantic',
      'Solo Time',
      'Parks',
      'Viewpoints',
      'Museums',
      'Street Food',
      'Hidden Gems',
    ],
    [],
  );

  const parsedLocations = (() => {
    try {
      return params.locations ? (JSON.parse(params.locations) as string[]) : [];
    } catch (e) {
      return [];
    }
  })();

  const [selected, setSelected] = useState<{ name: string; weight: number }[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  const addItem = (name: string) => {
    if (selected.find((it) => it.name === name)) return;
    setSelected((prev) => [...prev, { name, weight: 3 }]);
  };

  const removeItem = (name: string) => {
    setSelected((prev) => prev.filter((it) => it.name !== name));
  };

  const adjustWeight = (name: string, delta: number) => {
    setSelected((prev) =>
      prev.map((it) =>
        it.name === name
          ? { ...it, weight: Math.min(5, Math.max(1, it.weight + delta)) }
          : it,
      ),
    );
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Any preferences?
        </ThemedText>
        <ThemedText style={styles.subtitle}>Select what matters most for this journey.</ThemedText>

        <View style={styles.card}>
          <ThemedText style={styles.sectionLabel}>Checklist:</ThemedText>
          <View style={styles.selectedList}>
            {selected.length ? (
              selected.map((item) => (
                <View key={item.name} style={styles.preferenceRow}>
                  <View style={styles.prefPill}>
                    <ThemedText style={styles.prefText}>{item.name}</ThemedText>
                  </View>
                  <View style={styles.weightBox}>
                    <Pressable
                      style={[styles.weightBtn, styles.weightBtnLeft]}
                      onPress={() => adjustWeight(item.name, -1)}>
                      <ThemedText style={styles.weightBtnText}>-</ThemedText>
                    </Pressable>
                    <ThemedText style={styles.weightValue}>{item.weight}</ThemedText>
                    <Pressable
                      style={[styles.weightBtn, styles.weightBtnRight]}
                      onPress={() => adjustWeight(item.name, 1)}>
                      <ThemedText style={styles.weightBtnText}>+</ThemedText>
                    </Pressable>
                  </View>
                  <Pressable style={styles.removeChip} onPress={() => removeItem(item.name)}>
                    <ThemedText style={styles.removeChipText}>✕</ThemedText>
                  </Pressable>
                </View>
              ))
            ) : (
              <ThemedText style={styles.hint}>Nothing selected yet.</ThemedText>
            )}
          </View>

          <Pressable style={styles.galleryButton} onPress={() => setShowGallery(true)}>
            <ThemedText style={styles.galleryButtonText}>Add from gallery</ThemedText>
          </Pressable>
        </View>

        <View style={styles.metaCard}>
          <ThemedText style={styles.metaLabel}>Dates</ThemedText>
          <ThemedText style={styles.metaValue}>
            {params.start || '?'} to {params.end || '?'}
          </ThemedText>
          <ThemedText style={[styles.metaLabel, { marginTop: 10 }]}>Budget</ThemedText>
          <ThemedText style={styles.metaValue}>
            {params.budgetFrom || '?'} - {params.budgetTo || '?'} RON
          </ThemedText>
          <ThemedText style={[styles.metaLabel, { marginTop: 10 }]}>Locations</ThemedText>
          {parsedLocations.length ? (
            parsedLocations.map((loc) => (
              <ThemedText key={loc} style={styles.metaValue}>
                • {loc}
              </ThemedText>
            ))
          ) : (
            <ThemedText style={styles.metaValue}>None yet</ThemedText>
          )}
        </View>
      </ScrollView>

      <Pressable
        disabled={!selected.length}
        onPress={() => router.push('/(tabs)')}
        style={[styles.nextFab, !selected.length && styles.nextFabDisabled]}>
        <Ionicons name="arrow-forward" size={22} color={selected.length ? '#0f172a' : '#94a3b8'} />
      </Pressable>

      <Modal visible={showGallery} transparent animationType="fade" onRequestClose={() => setShowGallery(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Choose interests</ThemedText>
              <Pressable style={styles.modalCloseIcon} onPress={() => setShowGallery(false)}>
                <ThemedText style={styles.modalCloseText}>✕</ThemedText>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.galleryScroll}>
              <View style={styles.galleryGrid}>
                {gallery.map((name) => {
                  const already = !!selected.find((s) => s.name === name);
                  return (
                    <Pressable
                      key={name}
                      disabled={already}
                      onPress={() => addItem(name)}
                      style={[styles.galleryItem, already && styles.galleryItemDisabled]}>
                      <ThemedText
                        style={[
                          styles.galleryText,
                          already && styles.galleryTextDisabled,
                        ]}>
                        {name}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
            <Pressable style={styles.modalClose} onPress={() => setShowGallery(false)}>
              <ThemedText style={styles.modalCloseText}>Done</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2a4e',
    backgroundColor: '#0f172a',
    gap: 10,
  },
  sectionLabel: {
    color: '#e5e7eb',
    fontWeight: '700',
    fontSize: 18,
  },
  selectedList: {
    gap: 8,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prefPill: {
    flex: 1,
    minHeight: 44,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139,92,246,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  prefText: {
    color: '#e5e7eb',
    fontWeight: '600',
  },
  weightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  weightBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#111827',
  },
  weightBtnLeft: {
    borderRightWidth: 1,
    borderRightColor: '#1f2937',
  },
  weightBtnRight: {
    borderLeftWidth: 1,
    borderLeftColor: '#1f2937',
  },
  weightBtnText: {
    color: '#cbd5e1',
    fontWeight: '700',
  },
  weightValue: {
    paddingHorizontal: 12,
    color: '#e5e7eb',
    fontWeight: '700',
  },
  removeChip: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeChipText: {
    color: '#f8fafc',
    fontWeight: '800',
  },
  hint: {
    color: '#94a3b8',
  },
  galleryButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  galleryButtonText: {
    color: '#c4b5fd',
    fontWeight: '700',
  },
  metaCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2a4e',
    backgroundColor: '#0b1020',
    gap: 4,
  },
  metaLabel: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  metaValue: {
    color: '#e5e7eb',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#0b1020',
    borderWidth: 1,
    borderColor: '#1f2a4e',
    gap: 12,
  },
  modalTitle: {
    color: '#e5e7eb',
    fontWeight: '700',
    fontSize: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalCloseIcon: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2a4e',
  },
  galleryScroll: {
    paddingVertical: 8,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  galleryItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139,92,246,0.08)',
  },
  galleryItemDisabled: {
    opacity: 0.4,
  },
  galleryText: {
    color: '#c4b5fd',
    fontWeight: '600',
  },
  galleryTextDisabled: {
    color: '#94a3b8',
  },
  modalClose: {
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalCloseText: {
    color: '#e5e7eb',
    fontWeight: '700',
  },
  nextFab: {
    position: 'absolute',
    right: 18,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },
  nextFabDisabled: {
    backgroundColor: '#1f2937',
    shadowOpacity: 0,
  },
});
