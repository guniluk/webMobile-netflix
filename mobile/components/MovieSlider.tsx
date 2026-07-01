import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../store/api';
import { useContentStore } from '../store/contentStore';

interface MovieItem {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  poster_path?: string;
  vote_average?: number;
}

interface MovieSliderProps {
  title: string;
  category: string;
}

export default function MovieSlider({ title, category }: MovieSliderProps) {
  const { contentType, refreshTrigger } = useContentStore();
  const [list, setList] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(
          `${API_URL}/api/v1/${contentType}/${category}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        if (data.success) {
          setList(data.content || []);
        }
      } catch (error) {
        console.error('Error fetching slider data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contentType, category, refreshTrigger]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sliderTitle}>{title}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#E50914" />
        </View>
      </View>
    );
  }

  if (list.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sliderTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {list.map((item) => {
          const imagePath = item.backdrop_path || item.poster_path;
          const imageUrl = imagePath
            ? `https://image.tmdb.org/t/p/w300${imagePath}`
            : 'https://via.placeholder.com/300x169/1c1c1c/ffffff?text=No+Image';

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => router.push(`/watch/${item.id}`)}
              style={styles.card}
            >
              <Image source={{ uri: imageUrl }} style={styles.image} />
              <View style={styles.infoOverlay}>
                <Text style={styles.titleText} numberOfLines={1}>
                  {item.title || item.name}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.hdBadge}>HD</Text>
                  <Text style={styles.ratingText}>
                    ★ {item.vote_average?.toFixed(1) || '0.0'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingLeft: 16,
  },
  sliderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  loadingContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingRight: 16,
    gap: 12,
  },
  card: {
    width: 160,
    aspectRatio: 16 / 9,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#1c1c1c',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 6,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
  hdBadge: {
    fontSize: 8,
    backgroundColor: '#E50914',
    color: '#ffffff',
    fontWeight: 'bold',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 2,
  },
  ratingText: {
    fontSize: 10,
    color: '#2bb673',
    fontWeight: '600',
  },
});
