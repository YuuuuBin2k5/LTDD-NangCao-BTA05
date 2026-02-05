import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/auth.store';
import { colors, spacing } from '@/constants/theme';
import userService from '@/services/user.service';

export default function EditProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  
  // Form state
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP state
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần quyền truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      // TODO: Upload to Cloudinary
    }
  };

  const handleSendEmailOTP = async () => {
    if (!email || email === user?.email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email mới');
      return;
    }
    
    if (!token) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
      return;
    }
    
    setIsSendingOTP(true);
    try {
      const response = await userService.sendChangeOtp(
        { email, type: 'email' },
        token
      );
      
      if (response.success) {
        setShowEmailOTP(true);
        Alert.alert('Thành công', response.message || 'Mã OTP đã được gửi đến email của bạn');
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể gửi OTP');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể gửi OTP');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleSendPhoneOTP = async () => {
    if (!phone) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }
    
    if (!token) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
      return;
    }
    
    setIsSendingOTP(true);
    try {
      const response = await userService.sendChangeOtp(
        { phone, type: 'phone' },
        token
      );
      
      if (response.success) {
        setShowPhoneOTP(true);
        Alert.alert('Thành công', response.message || 'Mã OTP đã được gửi đến số điện thoại của bạn');
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể gửi OTP');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể gửi OTP');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword && !currentPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (email !== user?.email && !emailOTP) {
      Alert.alert('Lỗi', 'Vui lòng xác thực email bằng mã OTP');
      return;
    }

    if (phone && !phoneOTP) {
      Alert.alert('Lỗi', 'Vui lòng xác thực số điện thoại bằng mã OTP');
      return;
    }

    if (!token) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. Update profile (name, avatar)
      if (name !== user?.name || avatar !== user?.avatar) {
        const profileResponse = await userService.updateProfile(
          {
            fullName: name,
            avatarUrl: avatar,
          },
          token
        );
        
        if (profileResponse.success && profileResponse.data) {
          // Update local user state
          setUser({
            id: profileResponse.data.id.toString(),
            email: profileResponse.data.email,
            name: profileResponse.data.fullName,
            avatar: profileResponse.data.avatarUrl,
          });
        }
      }

      // 2. Change password if provided
      if (newPassword && currentPassword) {
        const passwordResponse = await userService.changePassword(
          {
            currentPassword,
            newPassword,
          },
          token
        );
        
        if (!passwordResponse.success) {
          throw new Error(passwordResponse.message || 'Đổi mật khẩu thất bại');
        }
      }

      // 3. Change email if provided and verified
      if (email !== user?.email && emailOTP) {
        const emailResponse = await userService.changeEmail(
          {
            newEmail: email,
            otp: emailOTP,
          },
          token
        );
        
        if (emailResponse.success) {
          // Update local user state
          setUser({
            ...user!,
            email: email,
          });
        } else {
          throw new Error(emailResponse.message || 'Đổi email thất bại');
        }
      }

      // 4. Change phone if provided and verified
      if (phone && phoneOTP) {
        const phoneResponse = await userService.changePhone(
          {
            newPhone: phone,
            otp: phoneOTP,
          },
          token
        );
        
        if (!phoneResponse.success) {
          throw new Error(phoneResponse.message || 'Đổi số điện thoại thất bại');
        }
      }

      setIsLoading(false);
      Alert.alert('Thành công', 'Cập nhật thông tin thành công', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  return (
    <View style={styles.container}>
      {/* Creative Blended Background - Profile Theme */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.pageBackground.profile }]} />
      
      {/* Subtle Gradient Overlay */}
      <LinearGradient
        colors={[
          'rgba(131, 56, 236, 0.15)', // Purple elegance
          'rgba(58, 134, 255, 0.1)',  // Blue sophistication
          'rgba(11, 37, 69, 0.2)',    // Deep shadow
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={20} color={colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Nhấn để thay đổi ảnh đại diện</Text>
        </View>

        {/* Name Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nhập họ tên"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        {/* Email Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, styles.inputFlex]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setShowEmailOTP(false);
                setEmailOTP('');
              }}
              placeholder="Nhập email"
              placeholderTextColor={colors.gray[400]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {email !== user?.email && (
              <TouchableOpacity 
                style={styles.otpButton}
                onPress={handleSendEmailOTP}
                disabled={isSendingOTP}
              >
                {isSendingOTP ? (
                  <ActivityIndicator size="small" color={colors.doraemonBlue} />
                ) : (
                  <Text style={styles.otpButtonText}>Gửi OTP</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          {showEmailOTP && (
            <View style={styles.otpContainer}>
              <TextInput
                style={styles.otpInput}
                value={emailOTP}
                onChangeText={setEmailOTP}
                placeholder="Nhập mã OTP"
                placeholderTextColor={colors.gray[400]}
                keyboardType="number-pad"
                maxLength={6}
              />
              <Ionicons 
                name={emailOTP.length === 6 ? "checkmark-circle" : "time-outline"} 
                size={24} 
                color={emailOTP.length === 6 ? colors.success : colors.gray[400]} 
              />
            </View>
          )}
        </View>

        {/* Phone Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Số điện thoại</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, styles.inputFlex]}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setShowPhoneOTP(false);
                setPhoneOTP('');
              }}
              placeholder="Nhập số điện thoại"
              placeholderTextColor={colors.gray[400]}
              keyboardType="phone-pad"
            />
            {phone && (
              <TouchableOpacity 
                style={styles.otpButton}
                onPress={handleSendPhoneOTP}
                disabled={isSendingOTP}
              >
                {isSendingOTP ? (
                  <ActivityIndicator size="small" color={colors.doraemonBlue} />
                ) : (
                  <Text style={styles.otpButtonText}>Gửi OTP</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          {showPhoneOTP && (
            <View style={styles.otpContainer}>
              <TextInput
                style={styles.otpInput}
                value={phoneOTP}
                onChangeText={setPhoneOTP}
                placeholder="Nhập mã OTP"
                placeholderTextColor={colors.gray[400]}
                keyboardType="number-pad"
                maxLength={6}
              />
              <Ionicons 
                name={phoneOTP.length === 6 ? "checkmark-circle" : "time-outline"} 
                size={24} 
                color={phoneOTP.length === 6 ? colors.success : colors.gray[400]} 
              />
            </View>
          )}
        </View>

        {/* Change Password Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đổi mật khẩu</Text>
          <Text style={styles.sectionSubtitle}>
            Để lại trống nếu không muốn đổi mật khẩu
          </Text>
          
          <Text style={styles.label}>Mật khẩu hiện tại</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Nhập mật khẩu hiện tại"
            placeholderTextColor={colors.gray[400]}
            secureTextEntry
          />

          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nhập mật khẩu mới"
            placeholderTextColor={colors.gray[400]}
            secureTextEntry
          />

          <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Nhập lại mật khẩu mới"
            placeholderTextColor={colors.gray[400]}
            secureTextEntry
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    padding: spacing[2],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    backgroundColor: colors.cardBackground.nebulaCloud, // Nebula cloud
    marginBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder.purple,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.doraemonBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.white,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.doraemonBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarHint: {
    marginTop: spacing[3],
    fontSize: 14,
    color: colors.gray[600],
  },
  section: {
    backgroundColor: colors.cardBackground.mysticPurple, // Mystic purple glass
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1.5,
    borderColor: colors.cardBorder.purple,
    marginHorizontal: spacing[2],
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white, // White text
    marginBottom: spacing[2],
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.light, // Light text
    marginBottom: spacing[4],
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.light, // Light text
    marginBottom: spacing[2],
    marginTop: spacing[3],
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.cardBorder.white,
    borderRadius: 12,
    paddingHorizontal: spacing[4],
    fontSize: 16,
    color: colors.white, // White text
    backgroundColor: colors.cardBackground.deepSpace, // Deep space input
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  inputFlex: {
    flex: 1,
  },
  otpButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.lightBlue,
    borderRadius: 12,
    minWidth: 90,
    alignItems: 'center',
  },
  otpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.doraemonBlue,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[3],
    gap: spacing[2],
  },
  otpInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: colors.doraemonBlue,
    borderRadius: 12,
    paddingHorizontal: spacing[4],
    fontSize: 16,
    color: colors.gray[900],
    backgroundColor: colors.lightBlue,
    letterSpacing: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.doraemonBlue,
    marginHorizontal: spacing[4],
    marginTop: spacing[6],
    paddingVertical: spacing[4],
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  bottomSpace: {
    height: spacing[8],
  },
});
