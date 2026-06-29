import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../store/api';
import Avatar from '../../components/Avatar';

interface HistoryItem {
  id: number;
  title: string;
  image: string | null;
  searchType: 'movie' | 'tv' | 'person';
  createdAt: string;
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchHistory = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/search/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setHistory(data.content || []);
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Fetch history when tab screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHistory(true);
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/search/history/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting search history entry:', error);
    }
  };

  const getTabIconName = (type: string) => {
    if (type === 'movie') return 'film-outline';
    if (type === 'tv') return 'tv-outline';
    return 'person-outline';
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    const imageUrl = item.image
      ? `https://image.tmdb.org/t/p/w200${item.image}`
      : 'https://via.placeholder.com/100x150/1c1c1c/ffffff?text=No+Image';

    return (
      <View style={styles.historyCard}>
        <View style={styles.leftRow}>
          <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
          <View style={styles.infoCol}>
            <Text style={styles.titleText} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.typeRow}>
              <Ionicons
                name={getTabIconName(item.searchType)}
                size={12}
                color="#a1a1aa"
              />
              <Text style={styles.typeText}>{item.searchType}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search History</Text>
        <Avatar />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : history.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="time-outline" size={60} color="#3f3f46" />
          <Text style={styles.emptyText}>Your search history is empty</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#E50914"
              colors={['#E50914']}
            />
          }
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
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(39, 39, 42, 0.3)',
    borderColor: '#27272a',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  thumbnail: {
    width: 48,
    height: 64,
    borderRadius: 4,
    backgroundColor: '#1c1c1c',
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  typeText: {
    color: '#a1a1aa',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  deleteBtn: {
    padding: 8,
  },
});
