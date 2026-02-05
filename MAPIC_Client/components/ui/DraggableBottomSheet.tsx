/**
 * DraggableBottomSheet Component
 * Simple bottom sheet that can be dragged up/down
 */

import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { colors } from '@/constants/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MIN_HEIGHT = SCREEN_HEIGHT * 0.15; // 15%
const MID_HEIGHT = SCREEN_HEIGHT * 0.5;  // 50%
const MAX_HEIGHT = SCREEN_HEIGHT * 0.9;  // 90%

interface DraggableBottomSheetProps {
  children: React.ReactNode;
}

export default function DraggableBottomSheet({ children }: DraggableBottomSheetProps) {
  const [currentHeight, setCurrentHeight] = useState(MID_HEIGHT);
  const animatedHeight = useRef(new Animated.Value(MID_HEIGHT)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical drags
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const newHeight = currentHeight - gestureState.dy;
        if (newHeight >= MIN_HEIGHT && newHeight <= MAX_HEIGHT) {
          animatedHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const newHeight = currentHeight - gestureState.dy;
        let targetHeight = MID_HEIGHT;

        // Snap to nearest position
        if (newHeight < (MIN_HEIGHT + MID_HEIGHT) / 2) {
          targetHeight = MIN_HEIGHT;
        } else if (newHeight < (MID_HEIGHT + MAX_HEIGHT) / 2) {
          targetHeight = MID_HEIGHT;
        } else {
          targetHeight = MAX_HEIGHT;
        }

        setCurrentHeight(targetHeight);
        Animated.spring(animatedHeight, {
          toValue: targetHeight,
          useNativeDriver: false,
          tension: 50,
          friction: 8,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: animatedHeight,
        },
      ]}
    >
      <View style={styles.handleContainer} {...panResponder.panHandlers}>
        <View style={styles.handle} />
      </View>
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground.deepSpace,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray[400],
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
});
