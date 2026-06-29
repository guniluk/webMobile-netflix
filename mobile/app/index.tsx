import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const { user, isCheckingAuth, authCheck } = useAuthStore();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  useEffect(() => {
    if (isCheckingAuth) return;
    if (!navigationState?.key) return; // Wait until navigation is ready

    if (user) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/landing');
    }
  }, [user, isCheckingAuth, navigationState?.key, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E50914" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
