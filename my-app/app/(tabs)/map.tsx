import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Region } from 'react-native-maps';

import { BottomNav } from '@/components/bottom-nav';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const initialRegion: Region = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 60,
  longitudeDelta: 60,
};

export default function MapScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }).start();
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
        <View style={styles.headerRow}>
          <ThemedText type="title" style={styles.title}>
            World Map
          </ThemedText>
          <ThemedText style={styles.subtitle}>Pinch to zoom • drag to pan</ThemedText>
        </View>

        <View style={styles.mapArea}>
          <View style={styles.mapWrapper}>
            <MapView
              style={StyleSheet.absoluteFill}
              provider={PROVIDER_DEFAULT}
              initialRegion={initialRegion}
              showsCompass
              showsPointsOfInterest={false}
              showsBuildings={false}
              mapType="standard"
            />
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
    paddingTop: 28,
    paddingBottom: 12,
  },
  container: {
    flex: 1,
    gap: 16,
  },
  headerRow: {
    gap: 4,
    alignItems: 'flex-start',
  },
  title: {
    color: '#e5e7eb',
  },
  subtitle: {
    color: '#9ca3af',
  },
  mapArea: {
    flex: 1,
    justifyContent: 'center',
  },
  mapWrapper: {
    flex: 1,
    minHeight: 320,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2f3f72',
    backgroundColor: '#0f172a',
  },
});
