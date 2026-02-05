import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Image,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from "@/store/auth.store";
import { useAuthViewModel } from "@/viewmodels";
import { colors, spacing } from "@/constants/theme";

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuthViewModel();
  const user = useAuthStore((state) => state.user);

  // Force re-render when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // This will trigger a re-render with latest user data
      console.log('[Settings] Screen focused, user:', user);
    }, [user])
  );

  // Settings state
  const [locationSharing, setLocationSharing] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [ghostMode, setGhostMode] = useState(false);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightElement,
  }: any) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color={colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement ||
        (showArrow && (
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        ))}
    </TouchableOpacity>
  );

  const SettingSection = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );


  return (
    <View style={styles.container}>
      {/* Creative Blended Background */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.pageBackground.settings }]} />
      
      {/* Subtle Gradient Overlay for depth */}
      <LinearGradient
        colors={[
          'rgba(58, 134, 255, 0.1)',  // Primary blue hint
          'rgba(131, 56, 236, 0.15)', // Purple mystique
          'rgba(11, 37, 69, 0.2)',    // Deep space shadow
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cài đặt</Text>
        </View>

        {/* User Profile with Glassmorphism */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
            )}
          </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || "User"}</Text>
          <Text style={styles.profileEmail}>
            {user?.email || "email@example.com"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/profile/edit')}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Privacy Settings */}
      <SettingSection title="Quyền riêng tư">
        <SettingItem
          icon="location"
          title="Chia sẻ vị trí"
          subtitle="Cho phép bạn bè xem vị trí của bạn"
          showArrow={false}
          rightElement={
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{
                false: colors.gray[300],
                true: colors.doraemonBlue,
              }}
              thumbColor={colors.white}
            />
          }
        />
        <SettingItem
          icon="eye-off"
          title="Chế độ ẩn danh"
          subtitle="Ẩn vị trí của bạn khỏi tất cả mọi người"
          showArrow={false}
          rightElement={
            <Switch
              value={ghostMode}
              onValueChange={setGhostMode}
              trackColor={{
                false: colors.gray[300],
                true: colors.doraemonBlue,
              }}
              thumbColor={colors.white}
            />
          }
        />
      </SettingSection>

      {/* Notifications */}
      <SettingSection title="Thông báo">
        <SettingItem
          icon="notifications"
          title="Thông báo"
          subtitle="Nhận thông báo từ bạn bè"
          showArrow={false}
          rightElement={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: colors.gray[300],
                true: colors.doraemonBlue,
              }}
              thumbColor={colors.white}
            />
          }
        />
      </SettingSection>

      {/* Account */}
      <SettingSection title="Tài khoản">
        <SettingItem
          icon="key"
          title="Đổi mật khẩu"
          onPress={() =>
            Alert.alert("Đổi mật khẩu", "Chức năng đang phát triển")
          }
        />
        <SettingItem
          icon="shield-checkmark"
          title="Bảo mật"
          onPress={() => Alert.alert("Bảo mật", "Chức năng đang phát triển")}
        />
      </SettingSection>

      {/* About */}
      <SettingSection title="Về ứng dụng">
        <SettingItem
          icon="information-circle"
          title="Giới thiệu"
          onPress={() =>
            Alert.alert("MAPIC", "Location Sharing App\nVersion 1.0.0")
          }
        />
        <SettingItem
          icon="document-text"
          title="Điều khoản sử dụng"
          onPress={() => Alert.alert("Điều khoản", "Chức năng đang phát triển")}
        />
        <SettingItem
          icon="shield"
          title="Chính sách bảo mật"
          onPress={() => Alert.alert("Chính sách", "Chức năng đang phát triển")}
        />
      </SettingSection>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={colors.error} />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[6],
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground.cosmicBlend, // Cosmic blend glass
    marginHorizontal: spacing[4],
    marginTop: spacing[2],
    padding: spacing[4],
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.cardBorder.blue,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
    marginRight: spacing[3],
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.doraemonBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.light,
  },
  editButton: {
    padding: spacing[2],
    backgroundColor: colors.accent,
    borderRadius: 20,
  },
  section: {
    marginTop: spacing[6],
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.light,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[2],
    marginHorizontal: spacing[4],
  },
  sectionContent: {
    backgroundColor: colors.cardBackground.twilightMist, // Twilight mist glass
    marginHorizontal: spacing[4],
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.cardBorder.purple,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightLavender,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing[3],
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.light,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBackground.deepSpace, // Deep space glass
    marginHorizontal: spacing[4],
    marginTop: spacing[6],
    marginBottom: spacing[4],
    padding: spacing[4],
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.action,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.action,
    marginLeft: spacing[2],
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: colors.light,
    marginVertical: spacing[6],
  },
});
