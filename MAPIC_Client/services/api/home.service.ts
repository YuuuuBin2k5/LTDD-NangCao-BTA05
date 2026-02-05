import { API_CONFIG, API_ENDPOINTS } from "@/constants/api";
import { useAuthStore } from "@/store/auth.store";
import realmService from "@/services/realm.service";
import offlineQueueService from "@/services/offline-queue.service";
import { useAppStore } from "@/store/app.store";

interface RetryConfig {
  maxRetries: number;
  baseDelay: number; // milliseconds
  maxDelay: number; // milliseconds
}

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  retryConfig?: Partial<RetryConfig>;
}

interface LocationPayload {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: Date;
  status?: string; // User status (walking, biking, driving, etc.)
}

interface FriendLocation {
  userId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: Date;
  status: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class HomeApiService {
  private readonly defaultRetryConfig: RetryConfig = {
    maxRetries: 1,
    baseDelay: 500,
    maxDelay: 2000,
  };

  private addAuthHeaders(headers: HeadersInit = {}): HeadersInit {
    const token = useAuthStore.getState().token;

    const baseHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (token) {
      return {
        ...baseHeaders,
        Authorization: `Bearer ${token}`,
      };
    }

    return baseHeaders;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const text = await response.text();

    console.log(
      `[HomeAPI] Response ${response.status}:`,
      text.substring(0, 200),
    );

    let data: any;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("[HomeAPI] JSON Parse Error:", text);
      throw new Error(`Invalid server response: ${text.substring(0, 100)}`);
    }

    if (!response.ok) {
      const errorMessage =
        data.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error("[HomeAPI] Error:", errorMessage);
      throw new Error(errorMessage);
    }

    return data;
  }

  private calculateBackoffDelay(attempt: number, config: RetryConfig): number {
    const delay = Math.min(
      config.baseDelay * Math.pow(2, attempt),
      config.maxDelay,
    );
    const jitter = Math.random() * 0.3 * delay;
    return delay + jitter;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async requestWithRetry<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const { skipAuth, retryConfig, ...fetchConfig } = config;
    const retrySettings = { ...this.defaultRetryConfig, ...retryConfig };
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    // 1. Thêm Timeout Controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const headers = skipAuth
      ? { "Content-Type": "application/json", ...fetchConfig.headers }
      : this.addAuthHeaders(fetchConfig.headers);

    const requestConfig: RequestInit = {
      ...fetchConfig,
      headers,
      signal: controller.signal, // Gán signal vào fetch
    };

    let lastError: any = null;

    for (let attempt = 0; attempt <= retrySettings.maxRetries; attempt++) {
      try {
        console.log(`[HomeAPI] Request attempt ${attempt + 1}:`, url);

        const response = await fetch(url, requestConfig);
        clearTimeout(timeoutId); // Xóa timeout nếu có phản hồi
        return await this.handleResponse<T>(response);
      } catch (error: any) {
        lastError = error;

        // Kiểm tra nếu là lỗi do Timeout
        if (error.name === "AbortError") {
          console.error("[HomeAPI] Request timed out");
        }

        // Nếu là lỗi 4xx (không phải 408/429), không nên retry
        if (
          error.message?.includes("HTTP 4") &&
          !error.message?.includes("408") &&
          !error.message?.includes("429")
        ) {
          throw error;
        }

        if (attempt === retrySettings.maxRetries) {
          // Log chi tiết lỗi cuối cùng để debug
          console.error("[HomeAPI] Max retries reached. Final Error:", error);
          throw error;
        }

        const delay = this.calculateBackoffDelay(attempt, retrySettings);
        await this.sleep(delay);
      }
    }
    throw lastError;
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.requestWithRetry<T>(endpoint, {
      method: "GET",
      ...config,
    });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.requestWithRetry<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...config,
    });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.requestWithRetry<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...config,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.requestWithRetry<T>(endpoint, {
      method: "DELETE",
      ...config,
    });
  }

  async getFriendsLocations(): Promise<FriendLocation[]> {
    try {
      const response = await this.get<ApiResponse<FriendLocation[]>>(
        API_ENDPOINTS.GET_LOCATIONS,
      );

      const locations = response.data || [];

      this.cacheFriendsLocations(locations);

      return locations;
    } catch (error) {
      console.error("[HomeAPI] Failed to fetch friends locations:", error);

      console.log("[HomeAPI] Falling back to Realm cache");
      return this.getCachedFriendsLocations();
    }
  }

  private cacheFriendsLocations(locations: FriendLocation[]): void {
    try {
      locations.forEach((location) => {
        realmService.saveLocation({
          id: `${location.userId}_${Date.now()}`,
          userId: String(location.userId),
          latitude: location.latitude,
          longitude: location.longitude,
          speed: location.speed,
          heading: location.heading,
          accuracy: 0,
        });
      });
      console.log("[HomeAPI] Cached", locations.length, "friend locations");
    } catch (error) {
      console.error("[HomeAPI] Failed to cache locations:", error);
    }
  }

  private getCachedFriendsLocations(): FriendLocation[] {
    try {
      const realm = realmService.getRealm();
      const allLocations = realm.objects("Location").sorted("timestamp", true);

      // Group by userId and get latest location for each friend
      const latestByUser = new Map<string, FriendLocation>();

      for (const loc of allLocations) {
        const userId = (loc as any).userId;

        // Skip queued items and current user
        if (userId === "QUEUED" || !userId) continue;

        if (!latestByUser.has(userId)) {
          latestByUser.set(userId, {
            userId,
            latitude: (loc as any).latitude,
            longitude: (loc as any).longitude,
            speed: (loc as any).speed || 0,
            heading: (loc as any).heading || 0,
            timestamp: (loc as any).timestamp,
            status: "stationary",
          });
        }
      }

      const cached = Array.from(latestByUser.values());
      console.log(
        "[HomeAPI] Retrieved",
        cached.length,
        "cached friend locations",
      );
      return cached;
    } catch (error) {
      console.error("[HomeAPI] Failed to get cached locations:", error);
      return [];
    }
  }

  /**
   * Update own location
   * POST /api/locations
   * Queues update if offline
   */
  async updateLocation(location: LocationPayload): Promise<void> {
    try {
      // Check if online
      const isOnline = useAppStore.getState().isOnline;

      if (!isOnline) {
        console.log("[HomeAPI] Offline, queueing location update");
        await offlineQueueService.addToQueue(location);
        return;
      }

      await this.post<ApiResponse<void>>(API_ENDPOINTS.POST_LOCATION, location);

      console.log("[HomeAPI] Location update sent successfully");
    } catch (error) {
      console.error("[HomeAPI] Failed to update location:", error);

      // Queue for later if network error
      console.log("[HomeAPI] Queueing failed location update");
      await offlineQueueService.addToQueue(location);

      throw error;
    }
  }

  /**
   * Fetch friends list
   * GET /api/friends
   */
  async getFriendsList(): Promise<any[]> {
    try {
      const response = await this.get<ApiResponse<any[]>>("/friends");
      return response.data || [];
    } catch (error) {
      console.error("[HomeAPI] Failed to fetch friends list:", error);
      throw error;
    }
  }
}

export default new HomeApiService();
