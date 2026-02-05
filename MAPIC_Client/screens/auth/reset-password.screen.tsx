import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthViewModel } from '@/viewmodels';
import { validateRequired, validatePassword } from '@/utils';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  const { verifyOtp, resetPassword, forgotPassword, isLoading } = useAuthViewModel();
  
  const [step, setStep] = useState(1); // 1: Verify OTP, 2: Reset Password
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resending, setResending] = useState(false);
  const [errors, setErrors] = useState<{
    otp?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleVerifyOtp = async () => {
    // Validation
    const newErrors: typeof errors = {};
    
    if (!validateRequired(otp)) {
      newErrors.otp = 'Vui lòng nhập mã OTP';
      setErrors(newErrors);
      return;
    }

    if (otp.length !== 6) {
      newErrors.otp = 'Mã OTP phải có 6 chữ số';
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const result = await verifyOtp(email, otp);

    if (result.success) {
      Alert.alert(
        '✓ Xác thực thành công',
        'Mã OTP hợp lệ! Vui lòng nhập mật khẩu mới.',
        [
          {
            text: 'Tiếp tục',
            onPress: () => setStep(2),
          },
        ]
      );
    } else {
      Alert.alert(
        '✕ Xác thực thất bại',
        result.error || 'Mã OTP không hợp lệ',
        [{ text: 'Thử lại', style: 'default' }]
      );
      setOtp('');
    }
  };

  const handleResetPassword = async () => {
    // Validation
    const newErrors: typeof errors = {};
    
    if (!validateRequired(newPassword)) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else {
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        newErrors.newPassword = passwordValidation.errors[0];
      }
    }

    if (!validateRequired(confirmPassword)) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const result = await resetPassword(email, otp, newPassword);

    if (result.success) {
      Alert.alert(
        '✓ Hoàn tất',
        'Đặt lại mật khẩu thành công!\nVui lòng đăng nhập lại.',
        [
          {
            text: 'Đăng nhập',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } else {
      Alert.alert(
        '✕ Thất bại',
        result.error || 'Đặt lại mật khẩu thất bại'
      );
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    const result = await forgotPassword(email);
    setResending(false);

    if (result.success) {
      Alert.alert(
        '✓ Đã gửi',
        'Mã OTP mới đã được gửi đến email của bạn',
        [
          {
            text: 'OK',
            onPress: () => {
              setOtp('');
              setStep(1);
            },
          },
        ]
      );
    } else {
      Alert.alert(
        '✕ Thất bại',
        result.error || 'Không thể gửi lại mã OTP'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Text style={styles.icon}>{step === 1 ? '🔑' : '🔒'}</Text>
              </View>
            </View>
            <Text style={styles.title}>
              {step === 1 ? 'Xác thực OTP' : 'Đặt lại mật khẩu'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1 
                ? `Nhập mã OTP đã được gửi đến\n${email}`
                : 'Nhập mật khẩu mới cho tài khoản của bạn'
              }
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {step === 1 ? (
              // Bước 1: Nhập OTP
              <>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Mã xác thực</Text>
                  <TextInput
                    style={[styles.input, styles.otpInput, errors.otp && styles.inputError]}
                    placeholder="000000"
                    placeholderTextColor="#999"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!isLoading && !resending}
                  />
                  {errors.otp && <Text style={styles.fieldError}>{errors.otp}</Text>}
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={isLoading || resending}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Xác thực</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                  <Text style={styles.resendText}>Không nhận được mã?</Text>
                  <TouchableOpacity
                    onPress={handleResendOtp}
                    disabled={isLoading || resending}
                  >
                    {resending ? (
                      <ActivityIndicator size="small" color="#E63946" />
                    ) : (
                      <Text style={styles.resendLink}>Gửi lại</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              // Bước 2: Nhập mật khẩu mới
              <>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Mật khẩu mới</Text>
                  <TextInput
                    style={[styles.input, errors.newPassword && styles.inputError]}
                    placeholder="Tối thiểu 6 ký tự"
                    placeholderTextColor="#999"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    editable={!isLoading}
                  />
                  {errors.newPassword && <Text style={styles.fieldError}>{errors.newPassword}</Text>}
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Xác nhận mật khẩu</Text>
                  <TextInput
                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                    placeholder="Nhập lại mật khẩu"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    editable={!isLoading}
                  />
                  {errors.confirmPassword && <Text style={styles.fieldError}>{errors.confirmPassword}</Text>}
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleResetPassword}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backToOtpButton}
                  onPress={() => setStep(1)}
                >
                  <Text style={styles.backToOtpText}>← Quay lại nhập OTP</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Decorative */}
          <View style={styles.decorativeCircle} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 32,
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 28,
    color: '#2C2C2C',
    fontWeight: '300',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#2C2C2C',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '300',
  },
  formContainer: {
    paddingHorizontal: 32,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    fontSize: 16,
    color: '#2C2C2C',
    paddingHorizontal: 0,
  },
  inputError: {
    borderBottomColor: '#ff3b30',
  },
  fieldError: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  otpInput: {
    textAlign: 'center',
    letterSpacing: 8,
    fontSize: 24,
    fontWeight: '500',
  },
  button: {
    height: 54,
    backgroundColor: '#2C2C2C',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 2,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  resendText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '300',
  },
  resendLink: {
    color: '#E63946',
    fontSize: 13,
    fontWeight: '500',
  },
  backToOtpButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  backToOtpText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '300',
  },
  decorativeCircle: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#FFE5E5',
    opacity: 0.3,
  },
});
