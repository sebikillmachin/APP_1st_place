import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { BottomNav } from '@/components/bottom-nav';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const stats = [
  { label: 'Reviews', value: '820' },
  { label: 'Friends', value: '142' },
];

const tabs = ['Reviews', 'About', 'Friends'] as const;

const reviewCards = [
  { title: 'Neon Lounge', subtitle: '“Great vibe, fast entry.”', color: '#1d4ed8' },
  { title: 'Skyline Rooftop', subtitle: '“Music on point, views wow.”', color: '#7c3aed' },
  { title: 'Underground Lab', subtitle: '“Raw energy, loved it.”', color: '#0ea5e9' },
];

const aboutText =
  'Nightlife curator. Love late sets, rooftop sunsets, and hidden speakeasies. Based in Berlin.';

const friends = [
  { name: 'Mara', role: 'DJ', color: '#22d3ee' },
  { name: 'Jonas', role: 'Host', color: '#a855f7' },
  { name: 'Lena', role: 'Promoter', color: '#fb7185' },
  { name: 'Rafi', role: 'Photographer', color: '#f59e0b' },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Reviews');

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroWave} />
          <View style={styles.avatarWrap}>
            <View style={styles.avatarRing}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={styles.avatar}
                resizeMode="contain"
              />
            </View>
          </View>
          <ThemedText type="title" style={styles.name}>
            Tima Bouzid
          </ThemedText>
          <ThemedText style={styles.title}>Nightlife curator · Berlin</ThemedText>
        </View>

        <View style={styles.statsRow}>
          {stats.map((item) => (
            <View key={item.label} style={styles.stat}>
              <ThemedText type="title" style={styles.statValue}>
                {item.value}
              </ThemedText>
              <ThemedText style={styles.statLabel}>{item.label}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.actionButton}>
            <ThemedText type="defaultSemiBold" style={styles.actionText}>
              Edit profile
            </ThemedText>
          </View>
          <View style={styles.iconButton}>
            <ThemedText style={styles.actionIcon}>⇪</ThemedText>
          </View>
        </View>

        <View style={styles.tabRow}>
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={active ? styles.tabActive : styles.tabInactive}
                android_ripple={{ color: 'rgba(255,255,255,0.08)', radius: 24 }}>
                <ThemedText
                  type="defaultSemiBold"
                  style={active ? styles.tabTextActive : styles.tabText}>
                  {tab}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {activeTab === 'Reviews' && (
          <View style={styles.cardGrid}>
            {reviewCards.map((card) => (
              <View key={card.title} style={[styles.card, { backgroundColor: card.color }]}>
                <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                  {card.title}
                </ThemedText>
                <ThemedText style={styles.cardSubtitle}>{card.subtitle}</ThemedText>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'About' && (
          <View style={styles.about}>
            <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>
              About
            </ThemedText>
            <ThemedText style={styles.aboutText}>{aboutText}</ThemedText>
          </View>
        )}

        {activeTab === 'Friends' && (
          <View style={styles.friends}>
            <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>
              Friends
            </ThemedText>
            <View style={styles.friendGrid}>
              {friends.map((friend) => (
                <View
                  key={friend.name}
                  style={[styles.friendBadge, { borderColor: friend.color }]}>
                  <View style={[styles.friendDot, { backgroundColor: friend.color }]} />
                  <ThemedText type="defaultSemiBold" style={styles.friendName}>
                    {friend.name}
                  </ThemedText>
                  <ThemedText style={styles.friendRole}>{friend.role}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNav />
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
    gap: 0,
  },
  content: {
    gap: 22,
    paddingBottom: 32,
  },
  hero: {
    alignItems: 'center',
    overflow: 'hidden',
    paddingTop: 18,
  },
  heroWave: {
    position: 'absolute',
    top: 0,
    left: -60,
    right: -60,
    height: 160,
    backgroundColor: '#8b5cf6',
    borderBottomLeftRadius: 140,
    borderBottomRightRadius: 140,
    opacity: 0.92,
  },
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: '#0b1020',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarRing: {
    width: 110,
    height: 110,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: '#c084fc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b1020',
  },
  avatar: {
    width: 70,
    height: 70,
  },
  name: {
    color: '#f9fafb',
  },
  title: {
    color: '#d1d5db',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    color: '#f9fafb',
  },
  statLabel: {
    color: '#c4c6d8',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  actionText: {
    color: '#f8fafc',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#c084fc',
    backgroundColor: '#0b1020',
  },
  actionIcon: {
    color: '#c084fc',
    fontSize: 16,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 8,
  },
  tabActive: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(139,92,246,0.15)',
  },
  tabInactive: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  tabTextActive: {
    color: '#e5d9ff',
  },
  tabText: {
    color: '#9ca3af',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 14,
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  cardTitle: {
    color: '#f8fafc',
  },
  cardSubtitle: {
    color: '#e5e7eb',
  },
  about: {
    gap: 6,
    paddingVertical: 4,
  },
  sectionLabel: {
    color: '#e5e7eb',
  },
  aboutText: {
    color: '#cbd5e1',
    lineHeight: 20,
  },
  friends: {
    gap: 10,
  },
  friendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  friendBadge: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#0b1020',
    width: '47%',
    gap: 4,
  },
  friendDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginBottom: 2,
  },
  friendName: {
    color: '#f8fafc',
  },
  friendRole: {
    color: '#cbd5e1',
  },
});
