import apiService from './api.service';
import { API_ENDPOINTS } from '../constants/api';
import type {
  FriendSearchRequest,
  FriendResponse,
  FriendProfileResponse,
  AddFriendRequest,
  PlaceSearchRequest,
  PlaceResponse,
} from '../types/friend.types';

class FriendService {
  /**
   * Search friends with filters
   */
  async searchFriends(
    request: FriendSearchRequest,
    token: string
  ): Promise<FriendResponse[]> {
    const response = await apiService.post<FriendResponse[]>(
      API_ENDPOINTS.SEARCH_FRIENDS,
      request,
      token
    );
    return response;
  }

  /**
   * Get friends list with optional filters
   */
  async getFriendsList(
    params: {
      status?: string;
      activityStatus?: string;
      maxDistance?: number;
      userLatitude?: number;
      userLongitude?: number;
    },
    token: string
  ): Promise<FriendResponse[]> {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.activityStatus) queryParams.append('activityStatus', params.activityStatus);
    if (params.maxDistance) queryParams.append('maxDistance', params.maxDistance.toString());
    if (params.userLatitude) queryParams.append('userLatitude', params.userLatitude.toString());
    if (params.userLongitude) queryParams.append('userLongitude', params.userLongitude.toString());
    
    const endpoint = `${API_ENDPOINTS.GET_FRIENDS_LIST}?${queryParams.toString()}`;
    const response = await apiService.get<FriendResponse[]>(endpoint, token);
    return response;
  }

  /**
   * Get friend profile with location history
   */
  async getFriendProfile(
    friendId: number,
    userLatitude?: number,
    userLongitude?: number,
    token?: string
  ): Promise<FriendProfileResponse> {
    const queryParams = new URLSearchParams();
    
    if (userLatitude) queryParams.append('userLatitude', userLatitude.toString());
    if (userLongitude) queryParams.append('userLongitude', userLongitude.toString());
    
    const endpoint = `${API_ENDPOINTS.GET_FRIEND_PROFILE(friendId)}?${queryParams.toString()}`;
    const response = await apiService.get<FriendProfileResponse>(endpoint, token);
    return response;
  }

  /**
   * Add friend by email
   */
  async addFriend(request: AddFriendRequest, token: string): Promise<any> {
    const response = await apiService.post<any>(
      API_ENDPOINTS.ADD_FRIEND,
      request,
      token
    );
    return response;
  }

  /**
   * Accept friend request
   */
  async acceptFriendRequest(friendshipId: number, token: string): Promise<any> {
    const response = await apiService.post<any>(
      API_ENDPOINTS.ACCEPT_FRIENDSHIP(friendshipId),
      {},
      token
    );
    return response;
  }

  /**
   * Remove friend
   */
  async removeFriend(friendId: number, token: string): Promise<any> {
    const response = await apiService.delete<any>(
      API_ENDPOINTS.REMOVE_FRIEND(friendId),
      token
    );
    return response;
  }

  /**
   * Search places
   */
  async searchPlaces(request: PlaceSearchRequest): Promise<PlaceResponse[]> {
    const response = await apiService.post<PlaceResponse[]>(
      API_ENDPOINTS.SEARCH_PLACES,
      request
    );
    return response;
  }

  /**
   * Get nearby places
   */
  async getNearbyPlaces(
    latitude: number,
    longitude: number,
    radius: number = 5000,
    category?: string
  ): Promise<PlaceResponse[]> {
    const queryParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
    });
    
    if (category) queryParams.append('category', category);
    
    const endpoint = `${API_ENDPOINTS.GET_NEARBY_PLACES}?${queryParams.toString()}`;
    const response = await apiService.get<PlaceResponse[]>(endpoint);
    return response;
  }

  /**
   * Get place detail
   */
  async getPlaceDetail(
    placeId: number,
    userLatitude?: number,
    userLongitude?: number
  ): Promise<PlaceResponse> {
    const queryParams = new URLSearchParams();
    
    if (userLatitude) queryParams.append('userLatitude', userLatitude.toString());
    if (userLongitude) queryParams.append('userLongitude', userLongitude.toString());
    
    const endpoint = `${API_ENDPOINTS.GET_PLACE_DETAIL(placeId)}?${queryParams.toString()}`;
    const response = await apiService.get<PlaceResponse>(endpoint);
    return response;
  }
}

export default new FriendService();
