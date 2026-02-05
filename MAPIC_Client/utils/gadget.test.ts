/**
 * Unit tests for gadget selection logic
 */

import { getGadgetForSpeed, getGadgetForStatus, getGadgetForWeather, getGadget } from './gadget';
import { Gadget, UserStatus, WeatherCondition } from '../types/avatar.types';

describe('Gadget Selection Logic', () => {
  describe('getGadgetForSpeed', () => {
    it('should return BACKPACK for speed < 10 km/h', () => {
      expect(getGadgetForSpeed(0)).toBe(Gadget.BACKPACK);
      expect(getGadgetForSpeed(5)).toBe(Gadget.BACKPACK);
      expect(getGadgetForSpeed(9.9)).toBe(Gadget.BACKPACK);
    });

    it('should return BAMBOO_COPTER for speed 10-60 km/h', () => {
      expect(getGadgetForSpeed(10)).toBe(Gadget.BAMBOO_COPTER);
      expect(getGadgetForSpeed(30)).toBe(Gadget.BAMBOO_COPTER);
      expect(getGadgetForSpeed(60)).toBe(Gadget.BAMBOO_COPTER);
    });

    it('should return TIME_MACHINE for speed > 60 km/h', () => {
      expect(getGadgetForSpeed(60.1)).toBe(Gadget.TIME_MACHINE);
      expect(getGadgetForSpeed(100)).toBe(Gadget.TIME_MACHINE);
      expect(getGadgetForSpeed(200)).toBe(Gadget.TIME_MACHINE);
    });
  });

  describe('getGadgetForStatus', () => {
    it('should return INVISIBLE_CLOAK for GHOST_MODE', () => {
      expect(getGadgetForStatus(UserStatus.GHOST_MODE)).toBe(Gadget.INVISIBLE_CLOAK);
    });

    it('should return TENT for DND', () => {
      expect(getGadgetForStatus(UserStatus.DND)).toBe(Gadget.TENT);
    });

    it('should return null for other statuses', () => {
      expect(getGadgetForStatus(UserStatus.WALKING)).toBeNull();
      expect(getGadgetForStatus(UserStatus.BIKING)).toBeNull();
      expect(getGadgetForStatus(UserStatus.DRIVING)).toBeNull();
      expect(getGadgetForStatus(UserStatus.STATIONARY)).toBeNull();
    });
  });

  describe('getGadgetForWeather', () => {
    it('should return UMBRELLA for RAIN', () => {
      expect(getGadgetForWeather(WeatherCondition.RAIN)).toBe(Gadget.UMBRELLA);
    });

    it('should return null for other weather conditions', () => {
      expect(getGadgetForWeather(WeatherCondition.CLEAR)).toBeNull();
      expect(getGadgetForWeather(WeatherCondition.CLOUDY)).toBeNull();
      expect(getGadgetForWeather(WeatherCondition.SNOW)).toBeNull();
      expect(getGadgetForWeather(WeatherCondition.STORM)).toBeNull();
    });
  });

  describe('getGadget - Priority System', () => {
    it('should prioritize status gadgets over weather and speed', () => {
      // Ghost mode should override rain and speed
      expect(getGadget(50, UserStatus.GHOST_MODE, WeatherCondition.RAIN)).toBe(Gadget.INVISIBLE_CLOAK);
      
      // DND should override rain and speed
      expect(getGadget(100, UserStatus.DND, WeatherCondition.RAIN)).toBe(Gadget.TENT);
    });

    it('should prioritize weather gadgets over speed', () => {
      // Rain should override speed-based gadget
      expect(getGadget(5, UserStatus.WALKING, WeatherCondition.RAIN)).toBe(Gadget.UMBRELLA);
      expect(getGadget(50, UserStatus.BIKING, WeatherCondition.RAIN)).toBe(Gadget.UMBRELLA);
      expect(getGadget(100, UserStatus.DRIVING, WeatherCondition.RAIN)).toBe(Gadget.UMBRELLA);
    });

    it('should use speed-based gadget when no status or weather override', () => {
      // Walking speed
      expect(getGadget(5, UserStatus.WALKING, WeatherCondition.CLEAR)).toBe(Gadget.BACKPACK);
      
      // Biking speed
      expect(getGadget(30, UserStatus.BIKING, WeatherCondition.CLEAR)).toBe(Gadget.BAMBOO_COPTER);
      
      // Highway speed
      expect(getGadget(100, UserStatus.DRIVING, WeatherCondition.CLEAR)).toBe(Gadget.TIME_MACHINE);
    });
  });
});
