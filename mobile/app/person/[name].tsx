import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../store/api';

interface RelatedLink {
  title: string;
  url: string;
  snippet: string;
}

interface PersonProfileData {
  name: string;
  abstract: string;
  source: string;
  sourceUrl: string;
  imageUrl: string | null;
  relatedLinks: RelatedLink[];
  googleSearchUrl: string;
}

export default function PersonProfile() {
  const { name, imageUrl } = useLocalSearchParams<{ name: string; imageUrl?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<PersonProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!name) return;
      setLoading(true);
      setError('');
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(
          `${API_URL}/api/v1/search/person/profile/${name}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch profile.');
        }
        setProfile(data.profile);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [name]);

  const handleOpenURL = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn(`Don't know how to open this URL: ${url}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Profile not found.'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* StatusBar Spacer to prevent content from overlaying status bar on scroll */}
      <View
        style={{
          height: insets.top,
          backgroundColor: '#141414',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
      {/* Back Button */}
      <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
        <Text style={styles.backRowText}>Back</Text>
      </TouchableOpacity>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        {imageUrl || profile.imageUrl ? (
          <Image source={{ uri: imageUrl || profile.imageUrl }} style={styles.profileImage} />
        ) : (
          <View style={styles.noImage}>
            <Ionicons name="person" size={50} color="#71717a" />
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}

        <Text style={styles.profileName}>{profile.name}</Text>

        <TouchableOpacity
          style={styles.googleSearchBtn}
          onPress={() => handleOpenURL(profile.googleSearchUrl)}
        >
          <Ionicons name="logo-google" size={16} color="#ffffff" style={styles.googleIcon} />
          <Text style={styles.googleSearchText}>Search on Google</Text>
        </TouchableOpacity>

        <Text style={styles.abstractText}>{profile.abstract}</Text>

        <View style={styles.sourceRow}>
          <Text style={styles.sourceLabel}>Source: </Text>
          <TouchableOpacity onPress={() => handleOpenURL(profile.sourceUrl)}>
            <Text style={styles.sourceLink}>
              {profile.source} <Ionicons name="open-outline" size={10} color="#E50914" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Google Search Results */}
      {profile.relatedLinks && profile.relatedLinks.length > 0 && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Ionicons name="search" size={20} color="#4285F4" />
            <Text style={styles.resultsTitle}>Google Search Results</Text>
          </View>

          {profile.relatedLinks.map((link, idx) => (
            <View key={idx} style={styles.resultItem}>
              <TouchableOpacity onPress={() => handleOpenURL(link.url)}>
                <Text style={styles.resultTitle}>{link.title}</Text>
              </TouchableOpacity>
              <Text style={styles.resultUrl} numberOfLines={1}>{link.url}</Text>
              <Text style={styles.resultSnippet}>{link.snippet}</Text>
            </View>
          ))}
        </View>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#a1a1aa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#E50914',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  backRowText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: 'rgba(39, 39, 42, 0.4)',
    borderColor: '#27272a',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#27272a',
    marginBottom: 16,
  },
  noImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#27272a',
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  noImageText: {
    color: '#71717a',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  googleSearchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    borderColor: '#3f3f46',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  googleIcon: {
    marginRight: 6,
  },
  googleSearchText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  abstractText: {
    color: '#d4d4d8',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceLabel: {
    color: '#71717a',
    fontSize: 12,
  },
  sourceLink: {
    color: '#E50914',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultsContainer: {
    backgroundColor: 'rgba(39, 39, 42, 0.2)',
    borderRadius: 16,
    padding: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  resultsTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    paddingBottom: 16,
    marginBottom: 16,
  },
  resultTitle: {
    color: '#60a5fa',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultUrl: {
    color: '#10b981',
    fontSize: 11,
    marginBottom: 6,
  },
  resultSnippet: {
    color: '#a1a1aa',
    fontSize: 13,
    lineHeight: 18,
  },
});
