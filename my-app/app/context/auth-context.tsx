import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = { email: string; username: string };
type AccountRecord = Record<string, { password: string; username: string }>;

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, username: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ACCOUNTS_KEY = 'auth.accounts.v1';
const USER_KEY = 'auth.currentUser.v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<AccountRecord>({});
  const [usedPasswords, setUsedPasswords] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from storage on mount
  useEffect(() => {
    const hydrate = async () => {
      try {
        const [accountsRaw, userRaw] = await AsyncStorage.multiGet([ACCOUNTS_KEY, USER_KEY]);
        if (accountsRaw[1]) {
          const parsedAccounts = JSON.parse(accountsRaw[1]) as AccountRecord;
          setAccounts(parsedAccounts);
          setUsedPasswords(new Set(Object.values(parsedAccounts).map((a) => a.password)));
        }
        if (userRaw[1]) {
          const parsedUser = JSON.parse(userRaw[1]) as User;
          setUser(parsedUser);
        }
      } catch (e) {
        // ignore hydrate errors
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, []);

  // Persist accounts and user when they change (skip initial load)
  useEffect(() => {
    if (loading) return;
    const persist = async () => {
      try {
        await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
        if (user) {
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        }
      } catch (e) {
        // ignore persist errors
      }
    };
    persist();
  }, [accounts, user, loading]);

  const clearError = () => setError(null);

  const signIn = async (email: string, password: string) => {
    clearError();
    const normalizedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }
    const account = accounts[normalizedEmail];
    if (!account) {
      setError('Account not found. Please sign up.');
      return false;
    }
    if (account.password !== password) {
      setError('Incorrect password. Please try again.');
      return false;
    }
    setUser({ email: normalizedEmail, username: account.username });
    return true;
  };

  const signUp = async (email: string, password: string, username: string) => {
    clearError();
    const normalizedEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();
    if (!emailRegex.test(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (accounts[normalizedEmail]) {
      setError('Email already registered. Try signing in.');
      return false;
    }
    if (!cleanUsername) {
      setError('Please enter a username.');
      return false;
    }
    if (usedPasswords.has(password)) {
      setError('That password is already used. Choose a different one.');
      return false;
    }

    const nextAccounts = {
      ...accounts,
      [normalizedEmail]: { password, username: cleanUsername },
    };
    setAccounts(nextAccounts);
    setUsedPasswords(new Set([...usedPasswords, password]));
    setUser({ email: normalizedEmail, username: cleanUsername });
    return true;
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut,
      error,
      clearError,
    }),
    [user, loading, accounts, usedPasswords, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
