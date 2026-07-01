import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../store/api';
import { useContentStore } from '../../store/contentStore';
import { useSearchStore } from '../../store/searchStore';
import Avatar from '../../components/Avatar';

interface SearchResultItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  profile_path?: string;
  known_for_department?: string;
}

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 3; // 3 columns grid with padding

export default function Search() {
  const { activeTab, setActiveTab, query, setQuery, results, setResults } =
    useSearchStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setContentType } = useContentStore();
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(
        `${API_URL}/api/v1/search/${activeTab}/${encodeURIComponent(query.trim())}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (res.status === 404) {
        setError('No results found. Try another query.');
      } else if (!res.ok || !data.success) {
        throw new Error(data.message || 'An error occurred while searching.');
      } else {
        setResults(data.content || []);
        setQuery('');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching.');
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item: SearchResultItem) => {
    if (activeTab === 'person') {
      const imagePath = item.profile_path;
      const imageUrl = imagePath
        ? `https://image.tmdb.org/t/p/w300${imagePath}`
        : '';
      setQuery('');
      router.push({
        pathname: '/person/[name]',
        params: { name: item.name || '', imageUrl: imageUrl },
      });
      return;
    }
    setContentType(activeTab);
    setQuery('');
    router.push({
      pathname: '/watch/[id]',
      params: { id: item.id.toString() },
    });
  };

  const renderResultItem = ({ item }: { item: SearchResultItem }) => {
    const imagePath =
      activeTab === 'person' ? item.profile_path : item.poster_path;
    const title = activeTab === 'person' ? item.name : item.title || item.name;
    const imageUrl = imagePath
      ? `https://image.tmdb.org/t/p/w300${imagePath}`
      : 'https://via.placeholder.com/300x450/1c1c1c/ffffff?text=No+Image';

    if (activeTab === 'person') {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleItemPress(item)}
          style={styles.personCard}
        >
          <Image source={{ uri: imageUrl }} style={styles.personImage} />
          <Text style={styles.personName} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.personDept} numberOfLines={1}>
            {item.known_for_department || 'Actor'}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleItemPress(item)}
        style={styles.mediaCard}
      >
        <Image source={{ uri: imageUrl }} style={styles.mediaImage} />
        <View style={styles.mediaOverlay}>
          <Text style={styles.mediaTitle} numberOfLines={2}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <Avatar />
      </View>

      {/* Tab Controls */}
      <View style={styles.tabBar}>
        {(['movie', 'tv', 'person'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              setActiveTab(tab);
              setResults([]);
              setQuery('');
              setError('');
            }}
            style={[
              styles.tabButton,
              activeTab === tab && styles.tabButtonActive,
            ]}
          >
            <Ionicons
              name={tab === 'movie' ? 'film' : tab === 'tv' ? 'tv' : 'person'}
              size={16}
              color={activeTab === tab ? '#ffffff' : '#a1a1aa'}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab && styles.tabButtonTextActive,
              ]}
            >
              {tab === 'person'
                ? 'People'
                : tab === 'tv'
                  ? 'TV Shows'
                  : 'Movies'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder={`Search for a ${
            activeTab === 'person'
              ? 'person'
              : activeTab === 'tv'
                ? 'TV show'
                : 'movie'
          }...`}
          placeholderTextColor="#7f7f7f"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="film-outline" size={60} color="#3f3f46" />
          <Text style={styles.emptyText}>
            Find your next favorite movies or shows
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderResultItem}
          numColumns={3}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#27272a',
    borderColor: '#3f3f46',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tabButtonActive: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },
  tabButtonText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#27272a',
    borderRadius: 6,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 14,
  },
  searchButton: {
    padding: 12,
    backgroundColor: '#E50914',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyText: {
    color: '#71717a',
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: '#a1a1aa',
    fontSize: 15,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  mediaCard: {
    width: COLUMN_WIDTH,
    aspectRatio: 2 / 3,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#27272a',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mediaOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 6,
  },
  mediaTitle: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  personCard: {
    width: COLUMN_WIDTH,
    alignItems: 'center',
    backgroundColor: 'rgba(39, 39, 42, 0.4)',
    borderColor: '#27272a',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
  },
  personImage: {
    width: COLUMN_WIDTH - 24,
    height: COLUMN_WIDTH - 24,
    borderRadius: (COLUMN_WIDTH - 24) / 2,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  personName: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  personDept: {
    color: '#71717a',
    fontSize: 9,
    marginTop: 2,
  },
});
