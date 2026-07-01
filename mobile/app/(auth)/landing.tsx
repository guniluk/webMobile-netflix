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
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Landing() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleGetStarted = () => {
    if (email.trim()) {
      router.push({
        pathname: '/(auth)/signup',
        params: { email: email.trim() },
      });
    } else {
      router.push('/(auth)/signup');
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
              <Text style={styles.logoText}>BYH Videos</Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                style={styles.signInButton}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Main Hero Section */}
            <View style={styles.heroSection}>
              <Text style={styles.mainTitle}>Unlimited movies, TV shows, and more</Text>
              <Text style={styles.subTitle}>Watch anywhere. Cancel anytime.</Text>
              <Text style={styles.description}>
                Ready to watch? Enter your email to create or restart your membership.
              </Text>

              {/* Form Input */}
              <View style={styles.form}>
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor="#7f7f7f"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <TouchableOpacity onPress={handleGetStarted} style={styles.getStartedBtn}>
                  <Text style={styles.getStartedText}>Get Started {'>'}</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  logoText: {
    color: '#E50914',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  signInButton: {
    backgroundColor: '#E50914',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  signInText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 60,
  },
  mainTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  subTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: '#d4d4d8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  form: {
    width: '100%',
    gap: 12,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: '#3f3f46',
    borderWidth: 1,
    borderRadius: 6,
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  getStartedBtn: {
    backgroundColor: '#E50914',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
