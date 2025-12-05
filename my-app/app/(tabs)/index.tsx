import { StyleSheet, View } from 'react-native';

import { EarthGlobe } from '@/components/earth-globe';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.screen}>
      <View style={styles.header}>
        <ThemedText type="title">World Capitals</ThemedText>
        <ThemedText>
          A living globe with pins placed on every country&apos;s capital city. Watch it spin or tap
          and drag to look around.
        </ThemedText>
      </View>
      <EarthGlobe />
      <ThemedText style={styles.caption} type="defaultSemiBold">
        Data source: world-countries (capital locations)
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 16,
    padding: 16,
  },
  header: {
    gap: 8,
  },
  caption: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
