/**
 * Chat Screen (Placeholder)
 * Will be implemented in future phase
 */

import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/constants/theme';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
    padding: spacing[6],
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.doraemonBlue,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.gray[600],
  },
});
