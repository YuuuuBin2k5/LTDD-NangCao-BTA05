/**
 * Privacy Utilities
 * 
 * Functions for handling privacy-related features like location precision filtering
 * for Ghost Mode and other privacy-preserving operations.
 */

/**
 * Rounds coordinates to approximately 1km radius for privacy
 * 
 * This function reduces location precision by rounding coordinates to 2 decimal places,
 * which corresponds to approximately 1.1km precision at the equator.
 * 
 * Used for Ghost Mode to hide exact user location while still showing general area.
 * 
 * @param latitude - Original latitude coordinate
 * @param longitude - Original longitude coordinate
 * @returns Object with rounded latitude and longitude
 */
export function roundLocationTo1km(
  latitude: number,
  longitude: number
): { latitude: number; longitude: number } {
  // Round to 2 decimal places (~1.1km precision)
  // 1 degree latitude ≈ 111km
  // 0.01 degrees ≈ 1.11km
  const roundedLatitude = Math.round(latitude * 100) / 100;
  const roundedLongitude = Math.round(longitude * 100) / 100;

  return {
    latitude: roundedLatitude,
    longitude: roundedLongitude,
  };
}

/**
 * Applies privacy filter to location based on privacy mode
 * 
 * @param latitude - Original latitude
 * @param longitude - Original longitude
 * @param isGhostMode - Whether Ghost Mode is enabled
 * @returns Filtered coordinates (rounded if Ghost Mode, original otherwise)
 */
export function applyLocationPrivacyFilter(
  latitude: number,
  longitude: number,
  isGhostMode: boolean
): { latitude: number; longitude: number } {
  if (isGhostMode) {
    return roundLocationTo1km(latitude, longitude);
  }
  
  return { latitude, longitude };
}
