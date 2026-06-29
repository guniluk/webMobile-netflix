import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { API_URL } from '../store/api';

export default function Avatar() {
  const { user, logout } = useAuthStore();
  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  const handlePressAvatar = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/landing');
        },
      },
    ]);
  };

  if (!user) return null;

  // Build full image URL for static avatars served by backend
  const getAvatarUrl = () => {
    if (!user.image) return '';
    if (user.image.startsWith('http')) {
      return user.image;
    }
    return `${API_URL}${user.image}`;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePressAvatar} style={styles.container}>
      {!imgError && avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          onError={() => setImgError(true)}
          style={styles.avatarImage}
        />
      ) : (
        <View style={styles.fallbackAvatar}>
          <Text style={styles.fallbackText}>
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E50914',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fallbackAvatar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
