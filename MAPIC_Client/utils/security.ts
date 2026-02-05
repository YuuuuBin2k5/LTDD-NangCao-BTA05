/**
 * 🔒 SECURITY UTILITIES
 * 4 lớp bảo mật API:
 * 1. Input Validation - Xác thực đầu vào
 * 2. Rate Limiting - Giới hạn tần suất
 * 3. Authentication - Xác thực người dùng
 * 4. Authorization - Phân quyền người dùng
 */

// ============================================
// 1️⃣ INPUT VALIDATION - XÁC THỰC ĐẦU VÀO
// ============================================

/**
 * Làm sạch input để ngăn XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Loại bỏ < >
    .replace(/javascript:/gi, '') // Loại bỏ javascript:
    .replace(/on\w+=/gi, ''); // Loại bỏ onclick=, onload=, etc.
};

/**
 * Validate email với regex mạnh
 */
export const validateEmailStrict = (email: string): {
  isValid: boolean;
  error?: string;
} => {
  const sanitized = sanitizeInput(email);
  
  // Check length
  if (sanitized.length === 0) {
    return { isValid: false, error: 'Email không được để trống' };
  }
  
  if (sanitized.length > 254) {
    return { isValid: false, error: 'Email quá dài' };
  }
  
  // Check format
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(sanitized)) {
    return { isValid: false, error: 'Email không hợp lệ' };
  }
  
  return { isValid: true };
};

/**
 * Validate password mạnh
 */
export const validatePasswordStrict = (password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
} => {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  // Check length
  if (password.length < 8) {
    errors.push('Mật khẩu phải có ít nhất 8 ký tự');
  }
  
  if (password.length > 128) {
    errors.push('Mật khẩu quá dài (tối đa 128 ký tự)');
  }
  
  // Check complexity
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ hoa');
  }
  
  if (!hasLowerCase) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ thường');
  }
  
  if (!hasNumber) {
    errors.push('Mật khẩu phải có ít nhất 1 số');
  }
  
  // Calculate strength
  const criteriaCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (password.length >= 12 && criteriaCount >= 4) {
    strength = 'strong';
  } else if (password.length >= 8 && criteriaCount >= 3) {
    strength = 'medium';
  }
  
  // Check common passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'abc123'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Mật khẩu quá phổ biến, vui lòng chọn mật khẩu khác');
    strength = 'weak';
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

/**
 * Validate tên người dùng
 */
export const validateName = (name: string): {
  isValid: boolean;
  error?: string;
} => {
  const sanitized = sanitizeInput(name);
  
  if (sanitized.length === 0) {
    return { isValid: false, error: 'Tên không được để trống' };
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, error: 'Tên phải có ít nhất 2 ký tự' };
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, error: 'Tên quá dài (tối đa 100 ký tự)' };
  }
  
  // Chỉ cho phép chữ cái, số, khoảng trắng, và một số ký tự đặc biệt
  const nameRegex = /^[a-zA-ZÀ-ỹ0-9\s'-]+$/;
  if (!nameRegex.test(sanitized)) {
    return { isValid: false, error: 'Tên chứa ký tự không hợp lệ' };
  }
  
  return { isValid: true };
};

/**
 * Validate OTP
 */
export const validateOTP = (otp: string): {
  isValid: boolean;
  error?: string;
} => {
  const sanitized = otp.trim();
  
  if (sanitized.length === 0) {
    return { isValid: false, error: 'Mã OTP không được để trống' };
  }
  
  if (!/^\d{6}$/.test(sanitized)) {
    return { isValid: false, error: 'Mã OTP phải là 6 chữ số' };
  }
  
  return { isValid: true };
};

// ============================================
// 2️⃣ RATE LIMITING - GIỚI HẠN TẦN SUẤT
// ============================================

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  blockedUntil?: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  
  /**
   * Kiểm tra rate limit
   * @param key - Unique key (email, IP, etc.)
   * @param maxAttempts - Số lần tối đa
   * @param windowMs - Thời gian window (ms)
   * @param blockDurationMs - Thời gian block (ms)
   */
  checkLimit(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 60000, // 1 phút
    blockDurationMs: number = 300000 // 5 phút
  ): {
    allowed: boolean;
    remainingAttempts: number;
    resetTime?: number;
    blockedUntil?: number;
  } {
    const now = Date.now();
    const entry = this.attempts.get(key);
    
    // Kiểm tra nếu đang bị block
    if (entry?.blockedUntil && entry.blockedUntil > now) {
      return {
        allowed: false,
        remainingAttempts: 0,
        blockedUntil: entry.blockedUntil,
      };
    }
    
    // Nếu chưa có entry hoặc đã hết window
    if (!entry || now - entry.firstAttempt > windowMs) {
      this.attempts.set(key, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
      return {
        allowed: true,
        remainingAttempts: maxAttempts - 1,
        resetTime: now + windowMs,
      };
    }
    
    // Tăng count
    entry.count++;
    entry.lastAttempt = now;
    
    // Kiểm tra vượt quá limit
    if (entry.count > maxAttempts) {
      entry.blockedUntil = now + blockDurationMs;
      this.attempts.set(key, entry);
      return {
        allowed: false,
        remainingAttempts: 0,
        blockedUntil: entry.blockedUntil,
      };
    }
    
    this.attempts.set(key, entry);
    return {
      allowed: true,
      remainingAttempts: maxAttempts - entry.count,
      resetTime: entry.firstAttempt + windowMs,
    };
  }
  
  /**
   * Reset rate limit cho một key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
  
  /**
   * Clear tất cả entries cũ
   */
  cleanup(): void {
    const now = Date.now();
    const maxAge = 3600000; // 1 giờ
    
    const keysToDelete: string[] = [];
    this.attempts.forEach((entry, key) => {
      if (now - entry.lastAttempt > maxAge) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.attempts.delete(key));
  }
}

export const rateLimiter = new RateLimiter();

// Cleanup mỗi 10 phút
setInterval(() => rateLimiter.cleanup(), 600000);

// ============================================
// 3️⃣ AUTHENTICATION - XÁC THỰC NGƯỜI DÙNG
// ============================================

/**
 * Validate JWT token format
 */
export const validateTokenFormat = (token: string): boolean => {
  if (!token) return false;
  
  // JWT có 3 phần: header.payload.signature
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Kiểm tra base64
  try {
    parts.forEach(part => {
      atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * Check token expiration (client-side)
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    
    if (!payload.exp) return true;
    
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

// ============================================
// 4️⃣ AUTHORIZATION - PHÂN QUYỀN NGƯỜI DÙNG
// ============================================

export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum Permission {
  // Auth
  AUTH_LOGIN = 'auth:login',
  AUTH_REGISTER = 'auth:register',
  AUTH_LOGOUT = 'auth:logout',
  
  // Profile
  PROFILE_VIEW = 'profile:view',
  PROFILE_EDIT = 'profile:edit',
  PROFILE_DELETE = 'profile:delete',
  
  // Admin
  ADMIN_VIEW_USERS = 'admin:view_users',
  ADMIN_EDIT_USERS = 'admin:edit_users',
  ADMIN_DELETE_USERS = 'admin:delete_users',
}

/**
 * Role-based permissions
 */
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.GUEST]: [
    Permission.AUTH_LOGIN,
    Permission.AUTH_REGISTER,
  ],
  [UserRole.USER]: [
    Permission.AUTH_LOGIN,
    Permission.AUTH_LOGOUT,
    Permission.PROFILE_VIEW,
    Permission.PROFILE_EDIT,
  ],
  [UserRole.ADMIN]: [
    Permission.AUTH_LOGIN,
    Permission.AUTH_LOGOUT,
    Permission.PROFILE_VIEW,
    Permission.PROFILE_EDIT,
    Permission.ADMIN_VIEW_USERS,
    Permission.ADMIN_EDIT_USERS,
  ],
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
};

/**
 * Kiểm tra quyền
 */
export const hasPermission = (
  userRole: UserRole,
  permission: Permission
): boolean => {
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
};

/**
 * Kiểm tra nhiều quyền
 */
export const hasAllPermissions = (
  userRole: UserRole,
  permissions: Permission[]
): boolean => {
  return permissions.every(p => hasPermission(userRole, p));
};

/**
 * Kiểm tra ít nhất một quyền
 */
export const hasAnyPermission = (
  userRole: UserRole,
  permissions: Permission[]
): boolean => {
  return permissions.some(p => hasPermission(userRole, p));
};
