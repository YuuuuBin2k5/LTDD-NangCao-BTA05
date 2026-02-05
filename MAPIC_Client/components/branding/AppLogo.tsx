import { View, Image, Text, StyleSheet, Platform } from 'react-native';
import { colors, spacing } from '@/constants/theme';

interface AppLogoProps {
  variant?: 'full' | 'icon-only' | 'compact';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  style?: any;
}

export default function AppLogo({ 
  variant = 'compact',
  size = 'medium',
  showText = true,
  style 
}: AppLogoProps) {
  
  // Size configurations - Fixed width for landscape logos
  const sizeConfig = {
    small: { height: 32, width: 20, text: 13, paddingH: 10, paddingV: 7 },
    medium: { height: 38, width: 50, text: 16, paddingH: 12, paddingV: 8 },
    large: { height: 44, width: 80, text: 18, paddingH: 14, paddingV: 10 },
  };
  
  const config = sizeConfig[size];
  
  if (variant === 'icon-only') {
    return (
      <View style={[styles.iconOnlyContainer, style]}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: config.width, height: config.height }}
          resizeMode="contain"
        />
      </View>
    );
  }
  
  if (variant === 'full') {
    return (
      <View style={[styles.fullContainer, style]}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: config.width * 1.5, height: config.height * 1.8 }}
          resizeMode="contain"
        />
        <Text style={[styles.brandText, { fontSize: config.text * 1.5, marginTop: 12 }]}>
          MAPIC
        </Text>
        <Text style={styles.tagline}>
          Share Your Journey
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[
      styles.compactContainer, 
      { 
        paddingHorizontal: config.paddingH, 
        paddingVertical: config.paddingV 
      }, 
      style
    ]}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={{ width: config.width, height: config.height }}
        resizeMode="contain"
      />
      {showText && (
        <Text style={[styles.brandText, { fontSize: config.text, marginLeft: 10 }]}>
          MAPIC
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  iconOnlyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(74, 144, 226, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: colors.doraemonBlue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  
  fullContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  
  brandText: {
    fontWeight: '800',
    color: colors.doraemonBlue,
    letterSpacing: 0.8,
    textShadowColor: 'rgba(74, 144, 226, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  tagline: {
    fontSize: 12,
    color: colors.gray[600],
    marginTop: 4,
    fontWeight: '500',
  },
});
