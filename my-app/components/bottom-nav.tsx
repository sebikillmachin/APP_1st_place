import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';

const NAV_ITEMS = [
  { label: 'Home', icon: 'home-outline' as const, href: '/' },
  { label: 'Schedule', icon: 'calendar-outline' as const, href: '/schedule' },
  { label: 'Map', icon: 'map-outline' as const, href: '/map' },
  { label: 'Tickets', icon: 'ticket-outline' as const },
  { label: 'Profile', icon: 'person-outline' as const },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.bottomNav}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.href ? pathname === item.href : false;
        return (
          <Pressable
            key={item.label}
            style={[styles.navItem, isActive && styles.navItemActive]}
            android_ripple={{ color: 'rgba(255,255,255,0.06)', radius: 28 }}
            onPress={() => {
              if (item.href && pathname !== item.href) {
                router.replace(item.href);
              }
            }}>
            <Ionicons
              name={item.icon}
              size={26}
              color={isActive ? '#ffffff' : '#6b7da8'}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1.5,
    borderColor: '#1b233f',
    paddingTop: 12,
    paddingHorizontal: 4,
    paddingBottom: 18,
    gap: 0,
  },
  navItem: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: 'transparent',
    transform: [{ scale: 1.08 }],
  },
});
