// Avatar Types and Enums

/**
 * User status representing different movement and privacy states
 */
export enum UserStatus {
  WALKING = 'walking',
  BIKING = 'biking',
  DRIVING = 'driving',
  STATIONARY = 'stationary',
  GHOST_MODE = 'ghost',
  DND = 'dnd',
}

/**
 * Doraemon gadgets that represent different user states
 */
export enum Gadget {
  BACKPACK = 'backpack',              // Walking (< 10 km/h)
  BAMBOO_COPTER = 'bamboo_copter',    // Biking/Driving (10-60 km/h)
  TIME_MACHINE = 'time_machine',      // Highway (> 60 km/h)
  CLOUD_BED = 'cloud_bed',            // Stationary at home
  FLASHLIGHT = 'flashlight',          // Low battery
  INVISIBLE_CLOAK = 'invisible_cloak', // Ghost mode
  TENT = 'tent',                      // DND mode
  UMBRELLA = 'umbrella',              // Rainy weather
}

/**
 * Weather conditions that affect avatar appearance
 */
export enum WeatherCondition {
  CLEAR = 'clear',
  CLOUDY = 'cloudy',
  RAIN = 'rain',
  SNOW = 'snow',
  STORM = 'storm',
}

/**
 * User information for avatar display
 */
export interface AvatarUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

/**
 * Avatar component props
 */
export interface AvatarProps {
  user: AvatarUser;
  speed: number; // km/h
  status: UserStatus;
  weather: WeatherCondition;
  latitude?: number;
  longitude?: number;
  heading?: number;
  onPress?: () => void; // Optional tap handler
  disableAnimations?: boolean; // Disable animations for battery saving
}

/**
 * Avatar state for rendering
 */
export interface AvatarState {
  gadget: Gadget;
  opacity: number;
  rotation: number;
  isVisible: boolean;
}
