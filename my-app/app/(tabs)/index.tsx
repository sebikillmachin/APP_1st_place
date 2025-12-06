import { StyleSheet, View, Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomNav } from '@/components/bottom-nav';

const bubbles = [
  { label: 'Bar', hue: 195 },
  { label: 'Museum', hue: 265 },
  { label: 'Clubs', hue: 165 },
  { label: 'Restaurants', hue: 315 },
  { label: 'Concerts', hue: 230 },
  { label: 'Galleries', hue: 280 },
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

        <View style={styles.bubbleWrap}>
          <View style={styles.bubbleGrid}>
            {bubbles.map((bubble, index) => (
              <Pressable
                key={bubble.label}
                style={[
                  styles.bubble,
                  {
                    width: 150,
                    height: 130,
                    borderColor: `hsla(${bubble.hue}, 80%, 65%, 1)`,
                    shadowColor: `hsla(${bubble.hue}, 80%, 65%, 1)`,
                  },
                  index % 2 === 0 ? styles.bubbleOffsetA : styles.bubbleOffsetB,
                ]}
                android_ripple={{ color: 'rgba(255,255,255,0.1)', radius: bubble.size / 2 }}>
              <ThemedText type="title" style={styles.bubbleLabel}>
                {bubble.label}
              </ThemedText>
              </Pressable>
            ))}
          </View>
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
    paddingTop: 44,
    paddingBottom: 28,
    gap: 0,
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    gap: 18,
  },
  header: {
    gap: 8,
    alignItems: 'flex-start',
  },
  headerText: {
    color: '#e5e7eb',
    textAlign: 'left',
  },
  lightBar: {
    width: '45%',
    height: 3,
    borderRadius: 999,
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  bubbleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  bubbleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  bubbleOffsetA: {
    marginTop: 6,
  },
  bubbleOffsetB: {
    marginTop: 18,
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
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 10,
    maxWidth: '90%',
  },
});
