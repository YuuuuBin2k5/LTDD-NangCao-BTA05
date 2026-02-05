/**
 * VALIDATION UTILITIES
 * Sử dụng security utils cho validation mạnh hơn
 */

import { 
  validateEmailStrict, 
  validatePasswordStrict, 
  validateName as validateNameStrict,
  validateOTP as validateOTPStrict,
  sanitizeInput 
} from './security';

// Export các hàm validation mới
export { 
  validateEmailStrict, 
  validatePasswordStrict, 
  validateNameStrict as validateName,
  validateOTPStrict as validateOTP,
  sanitizeInput 
};

// Giữ lại các hàm cũ để backward compatible
export const validateEmail = (email: string): boolean => {
  const result = validateEmailStrict(email);
  return result.isValid;
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const result = validatePasswordStrict(password);
  return {
    isValid: result.isValid,
    errors: result.errors,
  };
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};
