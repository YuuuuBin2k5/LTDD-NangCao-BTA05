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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthViewModel } from '@/viewmodels';
import { validateRequired } from '@/utils';

export default function ActivateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  const { activateAccount, resendActivationOtp, isLoading } = useAuthViewModel();
  const [otp, setOtp] = useState('');
  const [resending, setResending] = useState(false);
  const [errors, setErrors] = useState<{ otp?: string }>({});

  const handleActivate = async () => {
    // Validation
    const newErrors: { otp?: string } = {};
    
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
    const result = await activateAccount(email, otp);

    if (result.success) {
      Alert.alert(
        'Thành công',
        'Tài khoản đã được kích hoạt! Vui lòng đăng nhập.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } else {
      Alert.alert('Lỗi', result.error || 'Kích hoạt tài khoản thất bại');
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    const result = await resendActivationOtp(email);
    setResending(false);

    if (result.success) {
      Alert.alert('Thành công', 'Mã OTP mới đã được gửi đến email của bạn');
    } else {
      Alert.alert('Lỗi', result.error || 'Không thể gửi lại mã OTP');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Kích hoạt tài khoản</Text>
        <Text style={styles.subtitle}>
          Nhập mã OTP đã được gửi đến{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✉️</Text>
        </View>

        <TextInput
          style={[styles.input, errors.otp && styles.inputError]}
          placeholder="Mã OTP (6 chữ số)"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          editable={!isLoading && !resending}
        />
        {errors.otp && <Text style={styles.fieldError}>{errors.otp}</Text>}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleActivate}
          disabled={isLoading || resending}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Kích hoạt tài khoản</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Không nhận được mã? </Text>
          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={isLoading || resending}
          >
            {resending ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Text style={styles.resendLink}>Gửi lại</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.link}>← Quay lại đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  email: {
    fontWeight: '600',
    color: '#007AFF',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 80,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 5,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  fieldError: {
    color: '#ff3b30',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  resendLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  link: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
