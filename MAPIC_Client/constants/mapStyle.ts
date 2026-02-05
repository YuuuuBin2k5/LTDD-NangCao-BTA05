/**
 * OpenStreetMap Style Configuration
 * Using OpenStreetMap instead of Google Maps (no API key needed)
 */

import { colors } from './theme';

export const doraemonMapStyle = [];

// Camera configuration for 3D effect
export const cameraConfig = {
  pitch: 12, // 12 degrees tilt
  heading: 0,
  altitude: 1000,
};

// Default map region (can be overridden)
export const defaultRegion = {
  latitude: 21.0285, // Hanoi, Vietnam
  longitude: 105.8542,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default doraemonMapStyle;
