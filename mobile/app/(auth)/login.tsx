import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoggingIn } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    const res = await login(email.trim(), password);
    if (res.success) {
      router.replace('/(tabs)');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://assets.nflxext.com/ffe/siteui/vlv3/435e8bb8-7f1b-49cb-8da8-bff997124294/web/US-en-20260511-TRIFECTA-perspective_faa2ba65-d9fe-44bc-b4e0-f702a991adaa_large.jpg',
      }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.push('/(auth)/landing')}>
                <Text style={styles.logoText}>BYH Videos</Text>
              </TouchableOpacity>
            </View>

            {/* Login Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sign In</Text>

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.form}>
                <TextInput
                  placeholder="Email Address"
                  placeholderTextColor="#7f7f7f"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#7f7f7f"
                  style={styles.input}
                  secureTextEntry
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoggingIn}
                  style={[styles.signInBtn, isLoggingIn && styles.disabledBtn]}
                >
                  {isLoggingIn ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.signInText}>Sign In</Text>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/(auth)/signup')}
                style={styles.signupLink}
              >
                <Text style={styles.signupLinkText}>
                  New to Netflix? <Text style={styles.signupHighlight}>Sign up now</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  logoText: {
    color: '#E50914',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272a',
    marginHorizontal: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    borderColor: '#E50914',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 4,
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  signInBtn: {
    backgroundColor: '#E50914',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledBtn: {
    backgroundColor: '#7f1d1d',
  },
  signInText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  signupLinkText: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  signupHighlight: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
