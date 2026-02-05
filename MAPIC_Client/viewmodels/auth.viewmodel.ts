import { useState } from 'react';
import { useAuthStore } from '@/store';
import authService from '@/services/auth.service';
import { ApiError } from '@/models';
import { rateLimiter, sanitizeInput } from '@/utils/security';

export const useAuthViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login: setAuthState, logout: clearAuthState, token } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 🔒 LAYER 1: Input Validation - Sanitize
      const sanitizedEmail = sanitizeInput(email);
      
      // 🔒 LAYER 2: Rate Limiting - Chống brute-force
      const rateLimit = rateLimiter.checkLimit(
        `login:${sanitizedEmail}`,
        5, // Max 5 lần
        60000, // Trong 1 phút
        300000 // Block 5 phút
      );
      
      if (!rateLimit.allowed) {
        const blockedMinutes = rateLimit.blockedUntil 
          ? Math.ceil((rateLimit.blockedUntil - Date.now()) / 60000)
          : 0;
        throw new ApiError(
          `Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau ${blockedMinutes} phút.`
        );
      }
      
      // 🔒 LAYER 3: Authentication - Gọi API
      const response = await authService.login({ 
        email: sanitizedEmail, 
        password 
      });
      
      if (response.status === 'success' && response.data) {
        // Reset rate limit khi thành công
        rateLimiter.reset(`login:${sanitizedEmail}`);
        
        // Map API response to store format
        const user = {
          id: response.data.user.id.toString(),
          email: sanitizedEmail,
          name: response.data.user.fullName,
          avatar: response.data.user.avatarUrl,
        };
        setAuthState(user, response.data.accessToken);
        return { success: true };
      }
      
      throw new ApiError('Đăng nhập thất bại');
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Có lỗi xảy ra khi đăng nhập';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 🔒 LAYER 1: Input Validation - Sanitize
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedName = sanitizeInput(name);
      
      // 🔒 LAYER 2: Rate Limiting - Chống spam registration
      const rateLimit = rateLimiter.checkLimit(
        `register:${sanitizedEmail}`,
        3, // Max 3 lần
        300000, // Trong 5 phút
        900000 // Block 15 phút
      );
      
      if (!rateLimit.allowed) {
        const blockedMinutes = rateLimit.blockedUntil 
          ? Math.ceil((rateLimit.blockedUntil - Date.now()) / 60000)
          : 0;
        throw new ApiError(
          `Quá nhiều lần đăng ký. Vui lòng thử lại sau ${blockedMinutes} phút.`
        );
      }
      
      // 🔒 LAYER 3: Authentication - Gọi API
      const response = await authService.register({ 
        email: sanitizedEmail, 
        password, 
        fullName: sanitizedName 
      });
      
      if (response.status === 'success') {
        // Reset rate limit khi thành công
        rateLimiter.reset(`register:${sanitizedEmail}`);
        return { success: true, message: response.message };
      }
      
      throw new ApiError(response.message || 'Đăng ký thất bại');
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Có lỗi xảy ra khi đăng ký';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Gửi token từ store để logout
      await authService.logout(token || undefined);
      clearAuthState();
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      // Clear state anyway - quan trọng để user vẫn logout được
      clearAuthState();
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 🔒 LAYER 1: Input Validation - Sanitize
      const sanitizedEmail = sanitizeInput(email);
      
      // 🔒 LAYER 2: Rate Limiting - Chống spam forgot password
      const rateLimit = rateLimiter.checkLimit(
        `forgot:${sanitizedEmail}`,
        3, // Max 3 lần
        600000, // Trong 10 phút
        1800000 // Block 30 phút
      );
      
      if (!rateLimit.allowed) {
        const blockedMinutes = rateLimit.blockedUntil 
          ? Math.ceil((rateLimit.blockedUntil - Date.now()) / 60000)
          : 0;
        throw new ApiError(
          `Quá nhiều yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau ${blockedMinutes} phút.`
        );
      }
      
      // 🔒 LAYER 3: Authentication - Gọi API
      const response = await authService.forgotPassword({ email: sanitizedEmail });
      
      if (response.status === 'success') {
        return { success: true, message: response.message };
      }
      
      throw new ApiError(response.message || 'Gửi email thất bại');
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Có lỗi xảy ra';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.verifyOtp({ email, otp });
      
      if (response.status === 'success') {
        return { success: true };
      }
      
      throw new ApiError(response.message || 'Mã OTP không hợp lệ');
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Có lỗi xảy ra khi xác thực OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.resetPassword({ email, otp, newPassword });
      
      if (response.status === 'success') {
        return { success: true, message: response.message };
      }
      
      throw new ApiError(response.message || 'Đặt lại mật khẩu thất bại');
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Có lỗi xảy ra khi đặt lại mật khẩu';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const activateAccount = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.activateAccount({ email, otp });
      
      if (response.status === 'success') {
        return { success: true, message: response.message };
      }
      
      throw new ApiError(response.message || 'Kích hoạt tài khoản thất bại');
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Có lỗi xảy ra khi kích hoạt tài khoản';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resendActivationOtp = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.resendActivationOtp({ email });
      
      if (response.status === 'success') {
        return { success: true, message: response.message };
      }
      
      throw new ApiError(response.message || 'Gửi lại mã OTP thất bại');
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Có lỗi xảy ra khi gửi lại mã OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    verifyOtp,
    resetPassword,
    activateAccount,
    resendActivationOtp,
  };
};
