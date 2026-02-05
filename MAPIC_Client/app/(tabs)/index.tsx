import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { useLocationStore } from "@/store/location.store";
import { useFriendsStore } from "@/store/friends.store";
import { useDiscoveryStore } from "@/store/discoveryStore";
import { colors, spacing } from "@/constants/theme";
import BottomBar from "@/components/ui/BottomBar";
import AppLogo from "@/components/branding/AppLogo";
import OpenStreetMapView from "@/components/map/OpenStreetMapView";
import DiscoveryPanel from "@/components/discovery/DiscoveryPanel";
import type { PopularPlace, NearbyFriend } from "@/types/discovery";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLat, setCurrentLat] = useState(10.762622);
  const [currentLng, setCurrentLng] = useState(106.660172);

  const userLocation = useLocationStore((state) => state.currentLocation);
  const startTracking = useLocationStore((state) => state.startTracking);
  const stopTracking = useLocationStore((state) => state.stopTracking);

  const fetchFriendsLocations = useFriendsStore(
    (state) => state.fetchFriendsLocations,
  );
  const friendsLocations = useFriendsStore((state) => state.friendsLocations);
  
  const selectedCategory = useDiscoveryStore((state) => state.selectedCategory);
  const popularPlaces = useDiscoveryStore((state) => state.popularPlaces);

  useEffect(() => {
    initializeLocation();

    return () => {
      stopTracking();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchFriendsLocations();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchFriendsLocations]);

  useEffect(() => {
    if (userLocation) {
      setCurrentLat(userLocation.latitude);
      setCurrentLng(userLocation.longitude);
    }
  }, [userLocation]);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Location permission denied");
        setIsLoading(false);
        return;
      }

      await startTracking();

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLat(location.coords.latitude);
      setCurrentLng(location.coords.longitude);
      setIsLoading(false);
    } catch (err) {
      console.error("Location initialization error:", err);
      setError("Failed to get location");
      setIsLoading(false);
    }
  };

  const handleCenterPress = () => {
    if (userLocation) {
      setCurrentLat(userLocation.latitude);
      setCurrentLng(userLocation.longitude);
    }
  };

  const handleChatPress = () => {
    console.log("Navigate to chat");
  };

  const handleFriendsPress = () => {
    console.log("Navigate to friends");
  };

  const handlePlacePress = (place: PopularPlace) => {
    console.log("Place pressed:", place.name);
    // Center map on place
    setCurrentLat(place.latitude);
    setCurrentLng(place.longitude);
  };

  const handleFriendPress = (friend: NearbyFriend) => {
    console.log("Friend pressed:", friend.fullName);
    // Center map on friend
    setCurrentLat(friend.latitude);
    setCurrentLng(friend.longitude);
  };

  // Filter places by selected category
  const getFilteredPlaces = () => {
    if (selectedCategory === 'All') {
      return popularPlaces;
    }
    return popularPlaces.filter(place => place.category === selectedCategory);
  };

  // Combine friend and place markers
  const getAllMarkers = () => {
    const filteredPlaces = getFilteredPlaces();
    
    // Friend markers
    const friendMarkers = friendsLocations.map((friend) => ({
      latitude: friend.latitude,
      longitude: friend.longitude,
      title: `User ${friend.userId}`,
      description: friend.status || 'Active',
      type: 'friend' as const,
    }));

    // Place markers
    const placeMarkers = filteredPlaces.map((place) => ({
      latitude: place.latitude,
      longitude: place.longitude,
      title: place.name,
      description: `${place.category} • ⭐ ${place.rating}`,
      type: 'place' as const,
    }));

    return [...friendMarkers, ...placeMarkers];
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.doraemonBlue} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>
          Please enable location permissions
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <OpenStreetMapView
          latitude={currentLat}
          longitude={currentLng}
          markers={getAllMarkers()}
          showUserLocation={true}
          style={styles.map}
        />

        <View style={styles.logoContainer}>
          <AppLogo variant="compact" size="large" showText={false} />
        </View>

        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>Friends: {friendsLocations.length}</Text>
          <Text style={styles.debugText}>Places: {getFilteredPlaces().length}</Text>
          <Text style={styles.debugText}>
            Location: {userLocation ? "✓" : "✗"}
          </Text>
          <Text style={styles.debugText}>
            Category: {selectedCategory}
          </Text>
        </View>
      </View>

      <View style={styles.discoveryContainer}>
        <DiscoveryPanel
          latitude={currentLat}
          longitude={currentLng}
          onPlacePress={handlePlacePress}
          onFriendPress={handleFriendPress}
        />
      </View>

      <BottomBar
        onCenterPress={handleCenterPress}
        onLeftPress={handleChatPress}
        onRightPress={handleFriendsPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  discoveryContainer: {
    height: 400,
    backgroundColor: colors.pageBackground.home,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cream,
  },
  loadingText: {
    marginTop: spacing[4],
    fontSize: 16,
    color: colors.gray[700],
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cream,
    padding: spacing[6],
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.error,
    marginBottom: spacing[2],
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: "center",
  },
  logoContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 50,
    left: 16,
    zIndex: 10,
  },
  debugInfo: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 50,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  debugText: {
    color: "white",
    fontSize: 12,
    marginBottom: 4,
  },
});
