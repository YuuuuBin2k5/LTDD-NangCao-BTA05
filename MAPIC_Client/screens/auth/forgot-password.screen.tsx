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
import { useRouter } from 'expo-router';
import { useAuthViewModel } from '@/viewmodels';
import { validateEmail, validateRequired } from '@/utils';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, isLoading } = useAuthViewModel();
  
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});

  const handleSendOtp = async () => {
    // Validation
    const newErrors: { email?: string } = {};
    
    if (!validateRequired(email)) {
      newErrors.email = 'Vui lòng nhập email';
      setErrors(newErrors);
      return;
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Vui lòng kiểm tra lại định dạng email';
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const result = await forgotPassword(email.trim());

    if (result.success) {
      Alert.alert(
        '✓ Đã gửi mã OTP',
        'Vui lòng kiểm tra email và nhập mã xác thực',
        [
          {
            text: 'Tiếp tục',
            onPress: () => {
              router.push({
                pathname: '/(auth)/reset-password',
                params: { email: email.trim() }
              });
            },
          },
        ]
      );
    } else {
      Alert.alert(
        '✕ Gửi mã thất bại',
        result.error || 'Không thể gửi mã OTP',
        [{ text: 'Thử lại', style: 'default' }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
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
              <Text style={styles.icon}>🔒</Text>
            </View>
          </View>
          <Text style={styles.title}>Quên mật khẩu</Text>
          <Text style={styles.subtitle}>
            Nhập email để nhận mã xác thực{'\n'}
            đặt lại mật khẩu
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="example@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSendOtp}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Gửi mã xác thực</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Decorative */}
        <View style={styles.decorativeCircle} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
    backgroundColor: '#FFE5E5',
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
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '300',
  },
  formContainer: {
    paddingHorizontal: 32,
  },
  inputWrapper: {
    marginBottom: 32,
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
  button: {
    height: 54,
    backgroundColor: '#2C2C2C',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
  decorativeCircle: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#E5F3FF',
    opacity: 0.3,
  },
});
