import apiService from './api.service';
import { API_ENDPOINTS } from '../constants/api';
import { useAuthStore } from '@/store/auth.store';

interface UpdateProfileRequest {
  fullName?: string;
  avatarUrl?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface SendOtpRequest {
  email?: string;
  phone?: string;
  type: 'email' | 'phone';
}

interface ChangeEmailRequest {
  newEmail: string;
  otp: string;
}

interface ChangePhoneRequest {
  newPhone: string;
  otp: string;
}

class UserService {
  /**
   * Get current user profile
   */
  async getCurrentUser(token: string): Promise<any> {
    const response = await apiService.get<any>(
      API_ENDPOINTS.GET_CURRENT_USER,
      token
    );
    return response;
  }

  /**
   * Update profile (name, avatar)
   */
  async updateProfile(data: UpdateProfileRequest, token: string): Promise<any> {
    const response = await apiService.put<any>(
      API_ENDPOINTS.UPDATE_PROFILE,
      data,
      token
    );
    return response;
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest, token: string): Promise<any> {
    const response = await apiService.put<any>(
      API_ENDPOINTS.CHANGE_PASSWORD,
      data,
      token
    );
    return response;
  }

  /**
   * Send OTP for email/phone change
   */
  async sendChangeOtp(data: SendOtpRequest, token: string): Promise<any> {
    const response = await apiService.post<any>(
      API_ENDPOINTS.SEND_CHANGE_OTP,
      data,
      token
    );
    return response;
  }

  /**
   * Change email with OTP
   */
  async changeEmail(data: ChangeEmailRequest, token: string): Promise<any> {
    const response = await apiService.put<any>(
      API_ENDPOINTS.CHANGE_EMAIL,
      data,
      token
    );
    return response;
  }

  /**
   * Change phone with OTP
   */
  async changePhone(data: ChangePhoneRequest, token: string): Promise<any> {
    const response = await apiService.put<any>(
      API_ENDPOINTS.CHANGE_PHONE,
      data,
      token
    );
    return response;
  }
}

export default new UserService();
