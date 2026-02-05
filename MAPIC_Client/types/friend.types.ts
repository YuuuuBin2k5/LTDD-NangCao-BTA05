export interface FriendSearchRequest {
  query?: string;
  status?: 'ALL' | 'ONLINE' | 'OFFLINE';
  activityStatus?: 'walking' | 'biking' | 'driving' | 'stationary';
  maxDistance?: number;
  userLatitude?: number;
  userLongitude?: number;
}

export interface FriendResponse {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  status: 'ONLINE' | 'OFFLINE' | 'AWAY';
  activityStatus?: string;
  latitude: number;
  longitude: number;
  distance?: number;
  lastSeen: string;
}

export interface LocationHistoryItem {
  latitude: number;
  longitude: number;
  status?: string;
  timestamp: string;
}

export interface FriendProfileResponse extends FriendResponse {
  locationHistory: LocationHistoryItem[];
}

export interface AddFriendRequest {
  email: string;
}

export interface PlaceSearchRequest {
  query?: string;
  category?: 'restaurant' | 'cafe' | 'park' | 'hospital' | 'gas_station';
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface PlaceResponse {
  id: number;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  openingHours?: string;
  distance?: number;
}
