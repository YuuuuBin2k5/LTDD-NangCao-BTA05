import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing } from '@/constants/theme';

interface BottomBarProps {
  onCenterPress: () => void;
  onCenterLongPress?: () => void;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export default function BottomBar({
  onCenterPress,
  onCenterLongPress,
  onLeftPress,
  onRightPress,
}: BottomBarProps) {
  
  const handleCenterPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onCenterPress();
  };

  const handleCenterLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onCenterLongPress?.();
  };

  const handleLeftPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLeftPress?.();
  };

  const handleRightPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRightPress?.();
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.sideButton}
            onPress={handleLeftPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={24} color={colors.doraemonBlue} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.centerButton}
            onPress={handleCenterPress}
            onLongPress={handleCenterLongPress}
            activeOpacity={0.8}
          >
            <View style={styles.centerButtonInner}>
              <Ionicons name="navigate" size={28} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sideButton}
            onPress={handleRightPress}
            activeOpacity={0.7}
          >
            <Ionicons name="people-outline" size={24} color={colors.doraemonBlue} />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  blurContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 248, 231, 0.8)', // Cream with transparency
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing[6],
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.doraemonBlue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  centerButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: colors.doraemonBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  centerButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.doraemonBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
