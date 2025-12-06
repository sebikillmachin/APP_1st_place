import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { BottomNav } from '@/components/bottom-nav';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const tickets = [
  { title: 'Club 1', date: '2025-12-05', start: '03:00', end: '04:00' },
  { title: 'Museum 1', date: '2025-12-05', start: '13:00', end: '15:00' },
  { title: 'Club 2', date: '2025-12-05', start: '23:00', end: '01:00' },
];

function sortTicketsChronologically(items: typeof tickets) {
  return [...items].sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.start}:00Z`).getTime();
    const bDate = new Date(`${b.date}T${b.start}:00Z`).getTime();
    return aDate - bDate;
  });
}

function formatDate(dateISO: string) {
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return dateISO;
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TicketsScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
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
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.headerText}>
              Currently owned tickets
            </ThemedText>
            <ThemedText style={styles.subtitle}>Where you&apos;re headed and when</ThemedText>
          </View>

          <View style={styles.listWrap}>
            <View style={styles.list}>
              {sortTicketsChronologically(tickets).map((ticket) => (
                <View key={ticket.title + ticket.start} style={styles.ticketCard}>
                  <ThemedText type="title" style={styles.ticketTitle}>
                    {ticket.title}
                  </ThemedText>
                  <ThemedText style={styles.ticketDate}>{formatDate(ticket.date)}</ThemedText>
                  <ThemedText style={styles.ticketTime}>
                    {ticket.start} – {ticket.end}
                  </ThemedText>
                </View>
              ))}
            </View>
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
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 12,
  },
  header: {
    gap: 6,
    alignItems: 'flex-start',
  },
  headerText: {
    color: '#e5e7eb',
  },
  subtitle: {
    color: '#9ca3af',
  },
  listWrap: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  list: {
    gap: 12,
    width: '100%',
    paddingTop: 4,
  },
  ticketCard: {
    borderWidth: 2,
    borderColor: '#1e2a4e',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#0c1021',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    alignItems: 'flex-start',
    width: '100%',
  },
  ticketTitle: {
    color: '#f8fafc',
    marginBottom: 4,
  },
  ticketDate: {
    color: '#cbd5e1',
    marginBottom: 2,
  },
  ticketTime: {
    color: '#cbd5e1',
  },
});
