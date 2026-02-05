import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './api.service';
import { API_ENDPOINTS } from '../constants/api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ApiResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  ActivateRequest,
  EmailRequest
} from '../types/auth.types';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'userData';

class AuthService {
  // Đăng ký
  async register(data: RegisterRequest): Promise<ApiResponse> {
    const response = await apiService.post<any>(
      API_ENDPOINTS.REGISTER,
      data
    );
    
    // Map backend response format to client format
    return {
      status: response.success ? 'success' : 'error',
      message: response.message,
      data: response.data
    };
  }

  // Đăng nhập
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<any>(
      API_ENDPOINTS.LOGIN,
      data
    );

    // Map backend response format to client format
    const mappedResponse: AuthResponse = {
      status: response.success ? 'success' : 'error',
      data: response.data ? {
        accessToken: response.data.accessToken,
        user: {
          id: response.data.user.id,
          fullName: response.data.user.fullName,
          avatarUrl: response.data.user.avatarUrl,
        }
      } : undefined as any
    };

    // Lưu token và user info
    if (mappedResponse.status === 'success' && mappedResponse.data) {
      await this.saveToken(mappedResponse.data.accessToken);
      await this.saveUser(mappedResponse.data.user);
    }

    return mappedResponse;
  }

  // Đăng xuất
  async logout(token?: string): Promise<void> {
    // Thử logout với API nếu có token
    if (token) {
      try {
        await apiService.post(API_ENDPOINTS.LOGOUT, {}, token);
      } catch (error) {
        console.error('Logout API error:', error);
        // Không throw error, vẫn clear local data
      }
    }
    // Luôn clear local data
    await this.clearAuth();
  }

  // Lưu token
  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  // Lấy token
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }

  // Lưu user info
  async saveUser(user: any): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Lấy user info
  async getUser(): Promise<any | null> {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Xóa auth data
  async clearAuth(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }

  // Kiểm tra đã đăng nhập chưa
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  // Quên mật khẩu - Gửi OTP
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    const response = await apiService.post<any>(
      API_ENDPOINTS.FORGOT_PASSWORD,
      data
    );
    return {
      status: response.success ? 'success' : 'error',
      message: response.message,
      data: response.data
    };
  }

  // Xác thực OTP
  async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse> {
    const response = await apiService.post<any>(
      API_ENDPOINTS.VERIFY_OTP,
      data
    );
    return {
      status: response.success ? 'success' : 'error',
      message: response.message,
      data: response.data
    };
  }

  // Đặt lại mật khẩu
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    const response = await apiService.post<any>(
      API_ENDPOINTS.RESET_PASSWORD,
      data
    );
    return {
      status: response.success ? 'success' : 'error',
      message: response.message,
      data: response.data
    };
  }

  // Kích hoạt tài khoản
  async activateAccount(data: ActivateRequest): Promise<ApiResponse> {
    const response = await apiService.post<any>(
      API_ENDPOINTS.ACTIVATE,
      data
    );
    return {
      status: response.success ? 'success' : 'error',
      message: response.message,
      data: response.data
    };
  }

  // Gửi lại OTP kích hoạt
  async resendActivationOtp(data: EmailRequest): Promise<ApiResponse> {
    const response = await apiService.post<any>(
      API_ENDPOINTS.RESEND_ACTIVATION,
      data
    );
    return {
      status: response.success ? 'success' : 'error',
      message: response.message,
      data: response.data
    };
  }
}

export default new AuthService();
