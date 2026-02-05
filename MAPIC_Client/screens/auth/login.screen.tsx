import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthViewModel } from '@/viewmodels';
import { validateEmail, validateRequired } from '@/utils';
import { useAuthStore } from '@/store/auth.store';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthViewModel();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    // Validation
    const newErrors: { email?: string; password?: string } = {};
    
    if (!validateRequired(email)) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!validateRequired(password)) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    const result = await login(email, password);
    
    if (result.success) {
      router.replace('/(tabs)');
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
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>👋</Text>
            </View>
          </View>
          <Text style={styles.title}>Chào mừng trở lại</Text>
          <Text style={styles.subtitle}>
            Đăng nhập để tiếp tục
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

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
            {errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
          </View>

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 80,
    paddingHorizontal: 32,
    marginBottom: 40,
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '300',
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '300',
  },
  registerLink: {
    color: '#2C2C2C',
    fontSize: 13,
    fontWeight: '500',
  },
  decorativeCircle: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#FFE5E5',
    opacity: 0.3,
  },
});
