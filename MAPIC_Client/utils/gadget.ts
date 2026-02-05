/**
 * Gadget Selection Logic
 * 
 * This module contains functions to determine which Doraemon gadget
 * should be displayed based on user speed, status, and weather conditions.
 */

import { Gadget, UserStatus, WeatherCondition } from '../types/avatar.types';

/**
 * Determines the appropriate gadget based on user speed
 * 
 * Speed ranges:
 * - < 10 km/h: BACKPACK (walking)
 * - 10-60 km/h: BAMBOO_COPTER (biking/driving)
 * - > 60 km/h: TIME_MACHINE (highway)
 * 
 * @param speed - User speed in km/h
 * @returns The appropriate gadget for the speed
 */
export function getGadgetForSpeed(speed: number): Gadget {
  if (speed < 10) {
    return Gadget.BACKPACK;
  } else if (speed <= 60) {
    return Gadget.BAMBOO_COPTER;
  } else {
    return Gadget.TIME_MACHINE;
  }
}

/**
 * Determines the appropriate gadget based on user status (privacy modes)
 * 
 * Status mappings:
 * - GHOST_MODE: INVISIBLE_CLOAK
 * - DND: TENT
 * - Other statuses: null (no status-specific gadget)
 * 
 * @param status - User status
 * @returns The appropriate gadget for the status, or null if no special gadget
 */
export function getGadgetForStatus(status: UserStatus): Gadget | null {
  switch (status) {
    case UserStatus.GHOST_MODE:
      return Gadget.INVISIBLE_CLOAK;
    case UserStatus.DND:
      return Gadget.TENT;
    default:
      return null;
  }
}

/**
 * Determines the appropriate gadget based on weather conditions
 * 
 * Weather mappings:
 * - RAIN: UMBRELLA
 * - Other conditions: null (no weather-specific gadget)
 * 
 * @param weather - Current weather condition
 * @returns The appropriate gadget for the weather, or null if no special gadget
 */
export function getGadgetForWeather(weather: WeatherCondition): Gadget | null {
  if (weather === WeatherCondition.RAIN) {
    return Gadget.UMBRELLA;
  }
  return null;
}

/**
 * Determines the final gadget to display based on priority:
 * 1. Status-based gadgets (privacy modes) - highest priority
 * 2. Weather-based gadgets
 * 3. Speed-based gadgets - default/fallback
 * 
 * @param speed - User speed in km/h
 * @param status - User status
 * @param weather - Current weather condition
 * @returns The gadget to display
 */
export function getGadget(
  speed: number,
  status: UserStatus,
  weather: WeatherCondition
): Gadget {
  // Priority 1: Status-based gadgets (privacy modes)
  const statusGadget = getGadgetForStatus(status);
  if (statusGadget !== null) {
    return statusGadget;
  }

  // Priority 2: Weather-based gadgets
  const weatherGadget = getGadgetForWeather(weather);
  if (weatherGadget !== null) {
    return weatherGadget;
  }

  // Priority 3: Speed-based gadgets (default)
  return getGadgetForSpeed(speed);
}
