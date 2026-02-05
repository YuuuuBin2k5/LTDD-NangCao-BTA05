import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthViewModel } from '@/viewmodels';
import { validateEmail, validatePassword, validateRequired } from '@/utils';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthViewModel();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleRegister = async () => {
    const newErrors: typeof errors = {};
    
    // Validate name
    if (!validateRequired(name)) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
    
    // Validate email
    if (!validateRequired(email)) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    // Validate password
    if (!validateRequired(password)) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }
    
    // Validate confirm password
    if (!validateRequired(confirmPassword)) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    const result = await register(email, password, name);
    
    if (result.success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
                <Text style={styles.icon}>✨</Text>
              </View>
            </View>
            <Text style={styles.title}>Tạo tài khoản mới</Text>
            <Text style={styles.subtitle}>
              Điền thông tin để bắt đầu
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Họ và tên</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Nguyễn Văn A"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
              {errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}
            </View>

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
                placeholder="Tối thiểu 6 ký tự"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
              {errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
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
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Đăng ký</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 40,
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
    backgroundColor: '#FFF4E5',
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '300',
  },
  loginLink: {
    color: '#2C2C2C',
    fontSize: 13,
    fontWeight: '500',
  },
  decorativeCircle: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#E5FFE5',
    opacity: 0.3,
  },
});
