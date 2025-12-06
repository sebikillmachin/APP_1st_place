import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '../context/auth-context';

export default function SignUpScreen() {
  const { signUp, error, clearError, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (submitting) return;
    setSubmitting(true);
    const ok = await signUp(email, password, username);
    if (ok) {
      router.replace('/(tabs)');
    }
    setSubmitting(false);
  };

  if (loading) return null;

  return (
    <ThemedView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          Create account
        </ThemedText>
        <ThemedText style={styles.subtitle}>Join CityZen to continue</ThemedText>

        <View style={styles.field}>
          <ThemedText style={styles.label}>Username</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
            value={username}
            onChangeText={(text) => {
              if (error) clearError();
              setUsername(text);
            }}
          />
        </View>

        <View style={styles.field}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              if (error) clearError();
              setEmail(text);
            }}
          />
        </View>

        <View style={styles.field}>
          <ThemedText style={styles.label}>Password</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              if (error) clearError();
              setPassword(text);
            }}
          />
        </View>

        {error ? (
          <ThemedText style={styles.error} numberOfLines={2}>
            {error}
          </ThemedText>
        ) : null}

        <Pressable onPress={handleSignUp} style={styles.primary} disabled={submitting}>
          <ThemedText type="title" style={styles.primaryText}>
            {submitting ? 'Signing up…' : 'Sign up'}
          </ThemedText>
        </Pressable>

        <View style={styles.footerRow}>
          <ThemedText>Already have an account?</ThemedText>
          <Link href="/auth/sign-in" style={styles.link}>
            Sign in
          </Link>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#060712',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    gap: 14,
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#0b1020',
    borderWidth: 1,
    borderColor: '#1f2a4e',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
  },
  title: {
    color: '#f8fafc',
    textAlign: 'center',
  },
  subtitle: {
    color: '#cbd5e1',
    textAlign: 'center',
  },
  field: {
    gap: 6,
  },
  label: {
    color: '#e5e7eb',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
    paddingHorizontal: 12,
    color: '#f8fafc',
    backgroundColor: '#0f172a',
  },
  error: {
    color: '#f87171',
  },
  primary: {
    marginTop: 4,
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: {
    color: '#f8fafc',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  link: {
    color: '#60a5fa',
  },
});
