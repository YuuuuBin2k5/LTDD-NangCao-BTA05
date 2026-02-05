import { API_CONFIG } from '../constants/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      console.log('API Request:', url, config);
      
      const response = await fetch(url, config);
      
      // Lấy text trước để debug
      const text = await response.text();
      console.log('API Response:', response.status, text);

      // Thử parse JSON
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('JSON Parse Error:', text);
        throw new Error(`Server trả về response không hợp lệ: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async post<T>(endpoint: string, body?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async put<T>(endpoint: string, body?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  // Discovery APIs
  async getCategories(): Promise<any> {
    const response = await this.get<any>('/api/v1/places/categories');
    return response.data || [];
  }

  async getPopularPlaces(lat: number, lng: number, limit = 10): Promise<any> {
    const response = await this.get<any>(
      `/api/v1/places/popular?lat=${lat}&lng=${lng}&limit=${limit}`
    );
    return response.data || [];
  }

  async getNearbyFriends(lat: number, lng: number, token: string, limit = 20): Promise<any> {
    const response = await this.get<any>(
      `/api/v1/friends/nearby?lat=${lat}&lng=${lng}&limit=${limit}`,
      token
    );
    return Array.isArray(response) ? response : [];
  }

  async checkInToPlace(placeId: number, lat: number, lng: number, token: string): Promise<any> {
    return this.post<any>(
      `/api/v1/places/${placeId}/checkin`,
      { latitude: lat, longitude: lng },
      token
    );
  }
}

export default new ApiService();
