import { StyleSheet, View, Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomNav } from '@/components/bottom-nav';

const bubbles = [
  { label: 'Bar', size: 110, hue: 195 },
  { label: 'Museum', size: 180, hue: 265 },
  { label: 'Clubs', size: 140, hue: 165 },
  { label: 'etc', size: 120, hue: 315 },
];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerText}>
            What are you searching for?
          </ThemedText>
          <View style={styles.lightBar} />
        </View>

        <View style={styles.bubbleGrid}>
          {bubbles.map((bubble) => (
            <Pressable
              key={bubble.label}
              style={[
                styles.bubble,
                {
                  width: bubble.size,
                  height: bubble.size * 0.85,
                  borderColor: `hsla(${bubble.hue}, 80%, 65%, 1)`,
                  shadowColor: `hsla(${bubble.hue}, 80%, 65%, 1)`,
                },
              ]}
              android_ripple={{ color: 'rgba(255,255,255,0.1)', radius: bubble.size / 2 }}>
              <ThemedText type="title" style={styles.bubbleLabel}>
                {bubble.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

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
    paddingBottom: 12,
    gap: 0,
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    gap: 28,
  },
  header: {
    gap: 8,
    alignItems: 'center',
  },
  headerText: {
    color: '#e5e7eb',
    textAlign: 'center',
  },
  lightBar: {
    width: '40%',
    height: 3,
    borderRadius: 999,
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  bubbleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: 16,
    paddingVertical: 4,
  },
  bubble: {
    borderWidth: 2,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  bubbleLabel: {
    color: '#e5e7eb',
  },
});
