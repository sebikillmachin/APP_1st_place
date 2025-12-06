import { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import MapView, { Marker, Region } from 'react-native-maps';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width } = Dimensions.get('window');

export default function LocationsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    start?: string;
    end?: string;
    budgetFrom?: string;
    budgetTo?: string;
  }>();

  const [currentLocation, setCurrentLocation] = useState('Locating...');
  const [locations, setLocations] = useState<string[]>([]);
  const [locError, setLocError] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickedCoord, setPickedCoord] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );
  const [searchText, setSearchText] = useState('');
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 45.9432,
    longitude: 24.9668,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });
  const [suggestions, setSuggestions] = useState<
    { label: string; latitude: number; longitude: number }[]
  >([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocError('Location permission denied');
          setCurrentLocation('Unknown');
          return;
        }
        const coords = await Location.getCurrentPositionAsync({});
        const places = await Location.reverseGeocodeAsync({
          latitude: coords.coords.latitude,
          longitude: coords.coords.longitude,
        });
        const place = places?.[0];
        const name = place
          ? [place.city || place.subregion || place.region, place.country].filter(Boolean).join(', ')
          : '';
        setCurrentLocation(name || 'Current location');
        setMapRegion((prev) => ({
          ...prev,
          latitude: coords.coords.latitude,
          longitude: coords.coords.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }));
        setLocError(null);
      } catch (e) {
        setLocError('Unable to fetch location');
        setCurrentLocation('Unknown');
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!searchText.trim()) {
        setSuggestions([]);
        setSearchError(null);
        return;
      }
      try {
        const geo = await Location.geocodeAsync(searchText.trim());
        if (!geo.length) {
          setSuggestions([]);
          setSearchError('No matches found');
          return;
        }
        setSearchError(null);
        const formatted = geo.slice(0, 5).map((g) => ({
          label: buildPlaceLabel(g),
          latitude: g.latitude,
          longitude: g.longitude,
        }));
        setSuggestions(formatted);
        const first = geo[0];
        setMapRegion((prev) => ({
          ...prev,
          latitude: first.latitude,
          longitude: first.longitude,
          latitudeDelta: 0.4,
          longitudeDelta: 0.4,
        }));
        setPickedCoord({ latitude: first.latitude, longitude: first.longitude });
      } catch (e) {
        setSuggestions([]);
        setSearchError('Search error');
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchText]);

  const addLocationFromPicker = async () => {
    const name = searchText.trim();
    let label = '';
    setSearchError(null);
    if (name) {
      try {
        const geo = await Location.geocodeAsync(name);
        if (geo.length) {
          label = buildPlaceLabel(geo[0]);
          setPickedCoord({ latitude: geo[0].latitude, longitude: geo[0].longitude });
        }
      } catch (e) {
        label = '';
      }
    }
    if (!label && pickedCoord) {
      label = await resolveLabelFromCoord(pickedCoord);
    }
    if (!label) {
      setSearchError('Please select a real place from suggestions or the map.');
      return;
    }
    setLocations((prev) => [...prev, label]);
    setSearchText('');
    setPickedCoord(null);
    setShowPicker(false);
    setSearchError(null);
  };

  const removeLocation = (loc: string) => {
    setLocations((prev) => prev.filter((item) => item !== loc));
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>
          What location are you looking to experience?
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>
            Current location:
          </ThemedText>
          <View style={styles.currentRow}>
            <TextInput
              style={styles.pillInput}
              value={currentLocation}
              onChangeText={setCurrentLocation}
              placeholder="Enter location"
              placeholderTextColor="#8b5cf6"
            />
            <Ionicons name="location-sharp" size={24} color="#0ea5e9" />
          </View>
          {locError ? <ThemedText style={styles.locError}>{locError}</ThemedText> : null}
        </View>

        <View style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>
            Locations to visit:
          </ThemedText>
          <View style={styles.pillList}>
            {locations.map((loc) => (
              <View key={loc} style={styles.pillRow}>
                <View style={styles.pill}>
                  <ThemedText style={styles.pillText}>{loc}</ThemedText>
                </View>
                <Pressable style={styles.removeButton} onPress={() => removeLocation(loc)}>
                  <Ionicons name="remove" size={18} color="#f8fafc" />
                </Pressable>
              </View>
            ))}
          </View>
          <View style={styles.addRow}>
            <Pressable style={styles.addButtonOnly} onPress={() => setShowPicker(true)}>
              <Ionicons name="add" size={22} color="#0f172a" />
            </Pressable>
          </View>
          <Pressable style={styles.mapLink} onPress={() => setShowPicker(true)}>
            <Ionicons name="map" size={18} color="#8b5cf6" />
            <ThemedText style={styles.mapLinkText}>Choose on map</ThemedText>
          </Pressable>
        </View>

        <View style={styles.meta}>
          <ThemedText style={styles.metaText}>
            Dates: {params.start || '?'} to {params.end || '?'}
          </ThemedText>
          <ThemedText style={styles.metaText}>
            Budget: {params.budgetFrom || '?'} - {params.budgetTo || '?'} RON
          </ThemedText>
        </View>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backText}>Back</ThemedText>
        </Pressable>
      </ScrollView>

      <Pressable
        disabled={!locations.length}
        onPress={() =>
          router.push({
            pathname: '/preferences',
            params: {
              locations: JSON.stringify(locations),
              start: params.start,
              end: params.end,
              budgetFrom: params.budgetFrom,
              budgetTo: params.budgetTo,
            },
          })
        }
        style={[
          styles.nextFab,
          !locations.length && styles.nextFabDisabled,
        ]}>
        <Ionicons name="arrow-forward" size={22} color={locations.length ? '#0f172a' : '#94a3b8'} />
      </Pressable>

      {showPicker && (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerCard}>
            <ThemedText style={styles.pickerTitle}>Pick a location</ThemedText>
            <TextInput
              style={styles.searchInput}
              placeholder="Search or name this place"
              placeholderTextColor="#94a3b8"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchError ? <ThemedText style={styles.locError}>{searchError}</ThemedText> : null}
            {!!suggestions.length && (
              <View style={styles.suggestionList}>
                {suggestions.map((sug) => (
                  <Pressable
                    key={sug.label}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setSearchText(sug.label);
                      setPickedCoord({ latitude: sug.latitude, longitude: sug.longitude });
                      setMapRegion((prev) => ({
                        ...prev,
                        latitude: sug.latitude,
                        longitude: sug.longitude,
                        latitudeDelta: 0.4,
                        longitudeDelta: 0.4,
                      }));
                      setSuggestions([]);
                    }}>
                    <ThemedText style={styles.suggestionText}>{sug.label}</ThemedText>
                  </Pressable>
                ))}
              </View>
            )}
            <MapView style={styles.map} region={mapRegion} onRegionChangeComplete={setMapRegion}>
              {pickedCoord && <Marker coordinate={pickedCoord} />}
            </MapView>
            <Pressable
              style={styles.mapTapHint}
              android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
              onPress={() => setPickedCoord(mapRegion)}>
              <ThemedText style={styles.mapTapHintText}>
                Tap here to set pin at map center
              </ThemedText>
            </Pressable>
            <View style={styles.pickerActions}>
              <Pressable style={styles.cancelBtn} onPress={() => setShowPicker(false)}>
                <ThemedText style={styles.cancelText}>Cancel</ThemedText>
              </Pressable>
              <Pressable style={styles.confirmBtn} onPress={addLocationFromPicker}>
                <ThemedText style={styles.confirmText}>Add</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

function buildPlaceLabel(g: Location.LocationGeocodedLocation) {
  const locality = g.city || g.subregion || g.region || g.district || g.name;
  const country = g.country;
  return [locality, country].filter(Boolean).join(', ');
}

async function resolveLabelFromCoord(coord: { latitude: number; longitude: number }) {
  try {
    const results = await Location.reverseGeocodeAsync(coord);
    if (results && results[0]) {
      return buildPlaceLabel(results[0]);
    }
  } catch (e) {
    // ignore
  }
  return '';
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
    gap: 18,
  },
  title: {
    color: '#e5e7eb',
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: '#e5e7eb',
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pillInput: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: '#8b5cf6',
    paddingHorizontal: 14,
    color: '#e5e7eb',
    backgroundColor: '#0f172a',
  },
  pillList: {
    gap: 8,
  },
  pill: {
    minHeight: 48,
    minWidth: 200,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    backgroundColor: 'rgba(139,92,246,0.08)',
  },
  pillText: {
    color: '#8b5cf6',
  },
  locError: {
    color: '#f87171',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    paddingHorizontal: 14,
    color: '#e5e7eb',
    backgroundColor: '#0f172a',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonOnly: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  meta: {
    gap: 4,
  },
  metaText: {
    color: '#cbd5e1',
  },
  backButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  backText: {
    color: '#e5e7eb',
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  pickerCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#0b1020',
    borderRadius: 16,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#1f2a4e',
  },
  pickerTitle: {
    color: '#e5e7eb',
    fontSize: 16,
  },
  searchInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 10,
    color: '#f8fafc',
    backgroundColor: '#0f172a',
  },
  map: {
    width: '100%',
    height: 240,
    borderRadius: 12,
  },
  mapTapHint: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  mapTapHintText: {
    color: '#cbd5e1',
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  cancelText: {
    color: '#e5e7eb',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
  },
  confirmText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  mapLinkText: {
    color: '#8b5cf6',
  },
  suggestionList: {
    maxHeight: 160,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#0b1020',
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  suggestionText: {
    color: '#e5e7eb',
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
