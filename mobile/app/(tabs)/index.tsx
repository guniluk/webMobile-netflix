import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContentStore } from '../../store/contentStore';
import { API_URL } from '../../store/api';
import MovieSlider from '../../components/MovieSlider';
import Avatar from '../../components/Avatar';

interface TrendingItem {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  poster_path?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  adult?: boolean;
}

export default function Home() {
  const { contentType, setContentType, triggerRefresh } = useContentStore();
  const [trending, setTrending] = useState<TrendingItem | null>(null);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchTrending = useCallback(async (showLoader = true) => {
    if (showLoader) setLoadingTrending(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/${contentType}/trending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setTrending(data.content || null);
      }
    } catch (error) {
      console.error('Error fetching trending content:', error);
    } finally {
      if (showLoader) setLoadingTrending(false);
    }
  }, [contentType]);

  useEffect(() => {
    fetchTrending(true);
  }, [fetchTrending]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrending(false);
    triggerRefresh();
    setRefreshing(false);
  };



  return (
    <View style={styles.container}>
      {/* Upper Header (Two rows for clean spacing) */}
      <View style={styles.header}>
        {/* First row: Logo & Avatar */}
        <View style={styles.headerFirstRow}>
          <Text style={styles.logoText}>BYH VIDEOS</Text>
          <Avatar />
        </View>

        {/* Second row: Content Toggler */}
        <View style={styles.headerSecondRow}>
          <View style={styles.contentToggler}>
            <TouchableOpacity
              onPress={() => setContentType('movie')}
              style={[
                styles.toggleBtn,
                contentType === 'movie' && styles.toggleBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  contentType === 'movie' && styles.toggleTextActive,
                ]}
              >
                Movies
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setContentType('tv')}
              style={[
                styles.toggleBtn,
                contentType === 'tv' && styles.toggleBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  contentType === 'tv' && styles.toggleTextActive,
                ]}
              >
                TV Shows
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#E50914"
            colors={['#E50914']}
          />
        }
      >
        {/* Hero Banner Section */}
        {loadingTrending ? (
          <View style={styles.heroLoader}>
            <ActivityIndicator size="large" color="#E50914" />
          </View>
        ) : trending ? (
          <ImageBackground
            source={{
              uri: `https://image.tmdb.org/t/p/w780${trending.backdrop_path || trending.poster_path}`,
            }}
            style={styles.heroBanner}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.heroMeta}>
                <Text style={styles.heroTitle} numberOfLines={1}>
                  {trending.title || trending.name}
                </Text>

                {/* Hero Actions */}
                <View style={styles.heroActionRow}>
                  <TouchableOpacity
                    onPress={() => router.push(`/watch/${trending.id}`)}
                    style={styles.playBtn}
                  >
                    <Ionicons name="play" size={14} color="#000000" />
                    <Text style={styles.playBtnText}>Play</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push(`/watch/${trending.id}`)}
                    style={styles.infoBtn}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={14}
                      color="#ffffff"
                    />
                    <Text style={styles.infoBtnText}>Info</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        ) : (
          <View style={[styles.heroBanner, styles.heroEmpty]}>
            <Text style={styles.emptyText}>
              Failed to load trending content.
            </Text>
          </View>
        )}

        {/* Content Sliders Section */}
        <View style={styles.slidersContainer}>
          {contentType === 'movie' ? (
            <>
              <MovieSlider title="Now Playing" category="now_playing" />
              <MovieSlider title="Popular Movies" category="popular" />
              <MovieSlider title="Top Rated" category="top_rated" />
              <MovieSlider title="Upcoming" category="upcoming" />
            </>
          ) : (
            <>
              <MovieSlider title="Airing Today" category="airing_today" />
              <MovieSlider title="On The Air" category="on_the_air" />
              <MovieSlider title="Popular TV Shows" category="popular" />
              <MovieSlider title="Top Rated TV" category="top_rated" />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#141414',
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    zIndex: 10,
    gap: 12,
  },
  headerFirstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerSecondRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoText: {
    color: '#E50914',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  contentToggler: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  toggleBtnActive: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },
  toggleText: {
    color: '#d4d4d8',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroLoader: {
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
  },
  heroBanner: {
    height: 380,
    resizeMode: 'cover',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 20, 0.3)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  heroMeta: {
    backgroundColor: 'rgba(20, 20, 20, 0.5)',
    borderRadius: 8,
    padding: 10,
    gap: 6,
    width: '100%',
    alignSelf: 'center',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heroInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroYearText: {
    color: '#a1a1aa',
    fontSize: 12,
  },
  divider: {
    color: '#3f3f46',
    fontSize: 12,
  },
  heroAgeBadge: {
    color: '#fca5a5',
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    borderColor: '#E50914',
    borderWidth: 1,
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  heroOverview: {
    color: '#d4d4d8',
    fontSize: 13,
    lineHeight: 18,
  },
  heroActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    justifyContent: 'center',
  },
  playBtn: {
    flex: 1,
    maxWidth: 110,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  playBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoBtn: {
    flex: 1,
    maxWidth: 110,
    flexDirection: 'row',
    backgroundColor: 'rgba(115, 115, 115, 0.6)',
    borderRadius: 4,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  infoBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroEmpty: {
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#71717a',
    fontSize: 14,
  },
  slidersContainer: {
    marginTop: 8,
    gap: 8,
  },
});
