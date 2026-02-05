import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { colors } from '@/constants/theme';

interface FriendAvatarProps {
  userId: string;
  userName?: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  status: string;
}

function getGadgetIcon(speed: number, status: string): string {
  if (status === 'ghost') return '👻';
  if (status === 'dnd') return '⛺';
  
  if (speed < 1) return '🎒';
  if (speed < 10) return '🚶';
  if (speed < 60) return '🚴';
  return '🚗';
}

export default function FriendAvatar({
  userId,
  userName,
  latitude,
  longitude,
  speed,
  heading,
  status,
}: FriendAvatarProps) {
  const gadget = getGadgetIcon(speed, status);
  const isGhostMode = status === 'ghost';
  const isDndMode = status === 'dnd';

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      rotation={heading}
      opacity={isGhostMode ? 0.5 : 1}
    >
      <View style={[
        styles.container,
        isDndMode && styles.dndContainer,
      ]}>
        <Text style={styles.gadget}>{gadget}</Text>
        {userName && (
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {userName}
            </Text>
          </View>
        )}
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dndContainer: {
    opacity: 0.7,
  },
  gadget: {
    fontSize: 32,
    textAlign: 'center',
  },
  nameContainer: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.doraemonBlue,
  },
  name: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.doraemonBlue,
    maxWidth: 80,
  },
});
