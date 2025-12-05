import { useEffect, useMemo, useRef } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { GLView, type ExpoWebGLRenderingContext } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import countries from 'world-countries';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type CapitalPin = {
  city: string;
  country: string;
  lat: number;
  lon: number;
};

const GLOBE_RADIUS = 2.1;

export function EarthGlobe() {
  const { width } = useWindowDimensions();
  const rendererRef = useRef<Renderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number | null>(null);

  const pins = useMemo<CapitalPin[]>(() => {
    return countries.flatMap((country) => {
      const capital = country.capital?.[0];
      const coords = country.capitalInfo?.latlng ?? country.latlng;
      if (!capital || !coords || coords.length < 2) {
        return [];
      }
      const [lat, lon] = coords;
      return [
        {
          city: capital,
          country: country.name.common,
          lat,
          lon,
        },
      ];
    });
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, []);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth, drawingBufferHeight } = gl;

    const renderer = new Renderer({ gl });
    renderer.setSize(drawingBufferWidth, drawingBufferHeight);
    renderer.setClearColor('#020617');
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#020617', 6, 12);

    const camera = new THREE.PerspectiveCamera(
      60,
      drawingBufferWidth / drawingBufferHeight,
      0.1,
      1000,
    );
    camera.position.z = 6.5;
    cameraRef.current = camera;

    const ambientLight = new THREE.AmbientLight('#b8c3d9', 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#dbeafe', 0.8);
    dirLight.position.set(-5, 5, 8);
    scene.add(dirLight);

    const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: '#1b7fd4',
      emissive: '#0b2747',
      metalness: 0.2,
      roughness: 0.6,
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeMesh.rotation.y = Math.PI * 0.2;

    const pinsGroup = new THREE.Group();
    const pinGeometry = new THREE.SphereGeometry(0.045, 16, 16);
    const pinMaterial = new THREE.MeshStandardMaterial({
      color: '#f97316',
      emissive: '#7c2d12',
    });

    pins.forEach((pin) => {
      const mesh = new THREE.Mesh(pinGeometry, pinMaterial);
      mesh.position.copy(latLonToVector(pin.lat, pin.lon, GLOBE_RADIUS + 0.03));
      mesh.lookAt(new THREE.Vector3(0, 0, 0));
      pinsGroup.add(mesh);
    });

    const globeGroup = new THREE.Group();
    globeGroup.add(globeMesh);
    globeGroup.add(pinsGroup);
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      const globeGroup = globeGroupRef.current;
      if (globeGroup) {
        globeGroup.rotation.y += 0.0018;
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  const onLayout = () => {
    if (rendererRef.current && cameraRef.current) {
      const height = Math.min(width * 0.9, 480);
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  if (Platform.OS === 'web') {
    return (
      <ThemedView style={styles.fallback}>
        <ThemedText type="subtitle">3D globe best viewed on device</ThemedText>
        <ThemedText>
          The WebGL view for pins is optimized for iOS and Android. Run the app on a device or
          simulator to see the animated globe.
        </ThemedText>
      </ThemedView>
    );
  }

  const viewHeight = Math.min(width * 0.9, 480);

  return (
    <View style={styles.container}>
      <GLView
        key={Platform.OS}
        style={[styles.glView, { height: viewHeight, width }]}
        onLayout={onLayout}
        onContextCreate={onContextCreate}
      />
    </View>
  );
}

function latLonToVector(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0b1224',
  },
  glView: {
    width: '100%',
  },
  fallback: {
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
