/**
 * Privacy Utilities Tests
 * 
 * Tests for location precision filtering and privacy-related functions
 */

import { roundLocationTo1km, applyLocationPrivacyFilter } from './privacy';

describe('Privacy Utilities', () => {
  describe('roundLocationTo1km', () => {
    it('should round coordinates to 2 decimal places', () => {
      const result = roundLocationTo1km(10.123456, 106.789012);
      expect(result.latitude).toBe(10.12);
      expect(result.longitude).toBe(106.79);
    });

    it('should handle negative coordinates', () => {
      const result = roundLocationTo1km(-33.867851, 151.207321);
      expect(result.latitude).toBe(-33.87);
      expect(result.longitude).toBe(151.21);
    });

    it('should handle coordinates near zero', () => {
      const result = roundLocationTo1km(0.004, -0.006);
      expect(result.latitude).toBe(0);
      expect(result.longitude).toBe(-0.01);
    });

    it('should handle already rounded coordinates', () => {
      const result = roundLocationTo1km(10.12, 106.79);
      expect(result.latitude).toBe(10.12);
      expect(result.longitude).toBe(106.79);
    });

    it('should reduce precision by approximately 1km', () => {
      // Test that precision is reduced
      const original = { lat: 10.123456, lng: 106.789012 };
      const rounded = roundLocationTo1km(original.lat, original.lng);
      
      // Verify precision is reduced (fewer decimal places)
      expect(rounded.latitude.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      expect(rounded.longitude.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });

  describe('applyLocationPrivacyFilter', () => {
    it('should round coordinates when Ghost Mode is enabled', () => {
      const result = applyLocationPrivacyFilter(10.123456, 106.789012, true);
      expect(result.latitude).toBe(10.12);
      expect(result.longitude).toBe(106.79);
    });

    it('should return original coordinates when Ghost Mode is disabled', () => {
      const result = applyLocationPrivacyFilter(10.123456, 106.789012, false);
      expect(result.latitude).toBe(10.123456);
      expect(result.longitude).toBe(106.789012);
    });

    it('should handle edge case with exact coordinates', () => {
      const result = applyLocationPrivacyFilter(0, 0, true);
      expect(result.latitude).toBe(0);
      expect(result.longitude).toBe(0);
    });

    it('should preserve precision when not in Ghost Mode', () => {
      const lat = 10.123456789;
      const lng = 106.987654321;
      const result = applyLocationPrivacyFilter(lat, lng, false);
      expect(result.latitude).toBe(lat);
      expect(result.longitude).toBe(lng);
    });
  });
});
