import Constants from 'expo-constants';

const getBaseUrl = () => {
  // Constants.expoConfig?.hostUri contains the developer machine IP and port (e.g., "192.168.1.100:8081").
  // This allows the mobile app in Expo Go or emulators to dynamically connect to the backend running on the same PC.
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:3000`;
  }

  // Fallback for production or when hostUri is not available
  return 'http://localhost:3000';
};

export const API_URL = getBaseUrl();
