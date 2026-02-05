/**
 * Discovery Feature Types
 * Types for home discovery features (categories, popular places, nearby friends)
 */

export interface Category {
  name: string;
  icon: string;
  count: number;
}

export interface PopularPlace {
  id: number;
  name: string;
  category: string;
  description: string;
  photoUrl: string | null;
  latitude: number;
  longitude: number;
  address: string;
  rating: number;
  distance: number;
  checkInCount: number;
  popularityScore: number;
}

export interface NearbyFriend {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  status: 'ONLINE' | 'AWAY' | 'OFFLINE';
  activityStatus?: string;
  distance: number;
  latitude: number;
  longitude: number;
  lastSeen: string;
}
