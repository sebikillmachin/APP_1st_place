import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { BottomNav } from '@/components/bottom-nav';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const slots = ['Early bird special', 'Mid day fun', 'Late night attractions'];

export default function ScheduleScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
    Animated.spring(slide, {
      toValue: 0,
      damping: 12,
      stiffness: 140,
      useNativeDriver: true,
    }).start();
  }, [fade, slide]);

  return (
    <ThemedView style={styles.screen}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fade,
            transform: [{ translateY: slide }],
          },
        ]}>
        <View style={styles.listWrapper}>
          <View style={styles.list}>
            {slots.map((label) => (
              <View key={label} style={styles.card}>
                <ThemedText type="title" style={styles.cardText}>
                  {label}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
        <BottomNav />
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#060712',
    paddingHorizontal: 18,
    paddingTop: 36,
    paddingBottom: 28,
  },
  container: {
    flex: 1,
    gap: 18,
  },
  listWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  list: {
    gap: 14,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2,
    borderColor: '#2f3f72',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#2f3f72',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  cardText: {
    color: '#e5e7eb',
    textAlign: 'center',
  },
});
