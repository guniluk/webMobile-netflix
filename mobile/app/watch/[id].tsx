import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_URL } from '../../store/api';
import { useContentStore } from '../../store/contentStore';

interface Genre {
  id: number;
  name: string;
}

interface Details {
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  adult?: boolean;
  genres?: Genre[];
  overview?: string;
}

interface Trailer {
  key: string;
  site: string;
  type: string;
}

interface SimilarItem {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  poster_path?: string;
}

const { width } = Dimensions.get('window');

export default function WatchDetail() {
  const { id } = useLocalSearchParams();
  const { contentType } = useContentStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [details, setDetails] = useState<Details | null>(null);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
  const [similar, setSimilar] = useState<SimilarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWatchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = await AsyncStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch details
        const detailsRes = await fetch(
          `${API_URL}/api/v1/${contentType}/${id}/details`,
          { headers },
        );
        const detailsData = await detailsRes.json();
        if (detailsData.success) {
          setDetails(detailsData.content);
        } else {
          throw new Error('Failed to fetch details');
        }

        // 2. Fetch trailers
        const trailersRes = await fetch(
          `${API_URL}/api/v1/${contentType}/${id}/trailers`,
          { headers },
        );
        const trailersData = await trailersRes.json();
        if (trailersData.success) {
          const ytTrailers = (trailersData.trailers || []).filter(
            (v: Trailer) =>
              v.site === 'YouTube' &&
              (v.type === 'Trailer' || v.type === 'Teaser'),
          );
          setTrailers(
            ytTrailers.length > 0 ? ytTrailers : trailersData.trailers || [],
          );
          setCurrentTrailerIdx(0);
        }

        // 3. Fetch similar items
        const similarRes = await fetch(
          `${API_URL}/api/v1/${contentType}/${id}/similar`,
          { headers },
        );
        const similarData = await similarRes.json();
        if (similarData.success) {
          setSimilar(similarData.similar || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch video details.');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchData();
  }, [id, contentType]);

  const handleNextTrailer = () => {
    if (currentTrailerIdx < trailers.length - 1) {
      setCurrentTrailerIdx((prev) => prev + 1);
    }
  };

  const handlePrevTrailer = () => {
    if (currentTrailerIdx > 0) {
      setCurrentTrailerIdx((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (error || !details) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Something went wrong.'}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasTrailer = trailers.length > 0 && trailers[currentTrailerIdx]?.key;
  const releaseYear =
    details.release_date?.split('-')[0] ||
    details.first_air_date?.split('-')[0];
  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : 'https://via.placeholder.com/500x750/1c1c1c/ffffff?text=No+Image';

  return (
    <View style={styles.container}>
      {/* Back floating button */}
      <TouchableOpacity
        style={[styles.floatingBack, { top: insets.top + 12 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trailer Video Player Section */}
        <View style={[styles.playerContainer, { marginTop: insets.top }]}>
          {hasTrailer ? (
            <YoutubePlayer
              height={width * (9 / 16)} // 16:9 Ratio
              play={false}
              videoId={trailers[currentTrailerIdx].key}
            />
          ) : (
            <View style={styles.noTrailer}>
              <Ionicons name="alert-circle-outline" size={40} color="#71717a" />
              <Text style={styles.noTrailerTitle}>No trailer available</Text>
              <Text style={styles.noTrailerSub}>
                We could not find a YouTube trailer.
              </Text>
            </View>
          )}

          {/* Trailer Pagination */}
          {trailers.length > 1 && (
            <View style={styles.trailerPageRow}>
              <TouchableOpacity
                onPress={handlePrevTrailer}
                disabled={currentTrailerIdx === 0}
                style={styles.pageArrow}
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={currentTrailerIdx === 0 ? '#3f3f46' : '#ffffff'}
                />
              </TouchableOpacity>
              <Text style={styles.pageIndicator}>
                {currentTrailerIdx + 1} / {trailers.length}
              </Text>
              <TouchableOpacity
                onPress={handleNextTrailer}
                disabled={currentTrailerIdx === trailers.length - 1}
                style={styles.pageArrow}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={
                    currentTrailerIdx === trailers.length - 1
                      ? '#3f3f46'
                      : '#ffffff'
                  }
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Content Info Area */}
        <View style={styles.infoSection}>
          <View style={styles.metaRow}>
            <Image source={{ uri: posterUrl }} style={styles.poster} />
            <View style={styles.titleCol}>
              <Text style={styles.mainTitle} numberOfLines={2}>
                {details.title || details.name}
              </Text>
              <View style={styles.inlineMeta}>
                <Ionicons name="calendar-outline" size={14} color="#a1a1aa" />
                <Text style={styles.metaText}>{releaseYear || 'N/A'}</Text>
                <Text style={styles.metaDivider}>|</Text>
                <Ionicons name="star" size={14} color="#eab308" />
                <Text style={styles.ratingText}>
                  {details.vote_average?.toFixed(1) || '0.0'}
                </Text>
                {details.adult && <Text style={styles.adultBadge}>18+</Text>}
              </View>
            </View>
          </View>

          {/* Genres */}
          <View style={styles.genreRow}>
            {details.genres?.map((genre) => (
              <View key={genre.id} style={styles.genreBadge}>
                <Text style={styles.genreBadgeText}>{genre.name}</Text>
              </View>
            ))}
          </View>

          {/* Overview */}
          <View style={styles.overviewBox}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overviewText}>
              {details.overview || 'No storyline summary available.'}
            </Text>
          </View>
        </View>

        {/* More Like This (Similar suggestions) */}
        {similar.length > 0 && (
          <View style={styles.similarSection}>
            <Text style={styles.sectionTitle}>More Like This</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarScroll}
            >
              {similar.map((item) => {
                const imgPath = item.backdrop_path || item.poster_path;
                const imgUrl = imgPath
                  ? `https://image.tmdb.org/t/p/w300${imgPath}`
                  : 'https://via.placeholder.com/300x169/1c1c1c/ffffff?text=No+Image';

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/watch/${item.id}`)}
                    style={styles.similarCard}
                  >
                    <Image
                      source={{ uri: imgUrl }}
                      style={styles.similarImage}
                    />
                    <View style={styles.similarOverlay}>
                      <Text style={styles.similarTitle} numberOfLines={1}>
                        {item.title || item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    color: '#a1a1aa',
    fontSize: 16,
    textAlign: 'center',
  },
  backBtn: {
    backgroundColor: '#E50914',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  floatingBack: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  playerContainer: {
    marginTop: 0,
    backgroundColor: '#000000',
    position: 'relative',
  },
  noTrailer: {
    height: width * (9 / 16),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    gap: 8,
  },
  noTrailerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noTrailerSub: {
    color: '#71717a',
    fontSize: 12,
  },
  trailerPageRow: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderColor: '#27272a',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pageArrow: {
    padding: 2,
  },
  pageIndicator: {
    color: '#d4d4d8',
    fontSize: 11,
    fontWeight: '600',
  },
  infoSection: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  poster: {
    width: 100,
    aspectRatio: 2 / 3,
    borderRadius: 6,
    backgroundColor: '#27272a',
  },
  titleCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  mainTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  inlineMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#a1a1aa',
    fontSize: 12,
  },
  metaDivider: {
    color: '#3f3f46',
    fontSize: 12,
  },
  ratingText: {
    color: '#eab308',
    fontSize: 12,
    fontWeight: 'bold',
  },
  adultBadge: {
    color: '#ffffff',
    backgroundColor: '#ef4444',
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 6,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  genreBadge: {
    borderColor: '#3f3f46',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  genreBadgeText: {
    color: '#d4d4d8',
    fontSize: 11,
  },
  overviewBox: {
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingTop: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overviewText: {
    color: '#d4d4d8',
    fontSize: 13,
    lineHeight: 18,
  },
  similarSection: {
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingTop: 16,
    marginTop: 8,
  },
  similarScroll: {
    gap: 12,
    paddingRight: 16,
  },
  similarCard: {
    width: 140,
    aspectRatio: 16 / 9,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#1c1c1c',
    position: 'relative',
  },
  similarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  similarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 6,
  },
  similarTitle: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
});
