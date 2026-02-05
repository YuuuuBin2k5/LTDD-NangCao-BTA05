/**
 * Root Layout - App Entry Point
 * Sets up providers, navigation, and global configurations
 */

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import { useAppStore } from '@/store/app.store';
import realmService from '@/services/realm.service';
import offlineQueueService from '@/services/offline-queue.service';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const setNetworkStatus = useAppStore((state) => state.setNetworkStatus);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize Realm database first
      await realmService.initialize();
      console.log('[App] Realm initialized');

      // Initialize offline queue service
      offlineQueueService.initialize();
      console.log('[App] Offline queue initialized');

      // Listen to network status changes
      const unsubscribe = NetInfo.addEventListener((state) => {
        const isOnline = state.isConnected === true && state.isInternetReachable !== false;
        setNetworkStatus(isOnline);

        // Process offline queue when connection is restored
        if (isOnline) {
          offlineQueueService.processQueue();
        }
      });

      setIsReady(true);

      return () => {
        unsubscribe();
        offlineQueueService.cleanup();
      };
    } catch (error) {
      console.error('[App] Initialization error:', error);
      // Continue anyway, app can work without Realm
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.doraemonBlue} />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
      </Stack>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray[700],
  },
});
