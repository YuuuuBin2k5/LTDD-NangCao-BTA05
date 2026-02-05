/**
 * Example usage of gadget selection functions
 * 
 * This file demonstrates how to use the gadget selection logic
 * in your components.
 */

import { getGadget, getGadgetForSpeed, getGadgetForStatus, getGadgetForWeather } from './gadget';
import { UserStatus, WeatherCondition, Gadget } from '../types/avatar.types';

// Example 1: Get gadget based on speed only
function exampleSpeedOnly() {
  const walkingSpeed = 5; // km/h
  const gadget = getGadgetForSpeed(walkingSpeed);
  console.log(`Walking at ${walkingSpeed} km/h -> ${gadget}`); // BACKPACK
}

// Example 2: Get gadget based on status only
function exampleStatusOnly() {
  const status = UserStatus.GHOST_MODE;
  const gadget = getGadgetForStatus(status);
  console.log(`Status ${status} -> ${gadget}`); // INVISIBLE_CLOAK
}

// Example 3: Get gadget based on weather only
function exampleWeatherOnly() {
  const weather = WeatherCondition.RAIN;
  const gadget = getGadgetForWeather(weather);
  console.log(`Weather ${weather} -> ${gadget}`); // UMBRELLA
}

// Example 4: Get gadget with all factors (recommended)
function exampleComplete() {
  const speed = 30; // km/h
  const status = UserStatus.BIKING;
  const weather = WeatherCondition.CLEAR;
  
  const gadget = getGadget(speed, status, weather);
  console.log(`Speed: ${speed}, Status: ${status}, Weather: ${weather} -> ${gadget}`);
  // Result: BAMBOO_COPTER (speed-based, no status/weather override)
}

// Example 5: Priority demonstration
function examplePriority() {
  // Status overrides everything
  const gadget1 = getGadget(100, UserStatus.GHOST_MODE, WeatherCondition.RAIN);
  console.log('Ghost mode overrides rain and speed:', gadget1); // INVISIBLE_CLOAK
  
  // Weather overrides speed
  const gadget2 = getGadget(100, UserStatus.DRIVING, WeatherCondition.RAIN);
  console.log('Rain overrides speed:', gadget2); // UMBRELLA
  
  // Speed is used when no overrides
  const gadget3 = getGadget(100, UserStatus.DRIVING, WeatherCondition.CLEAR);
  console.log('Speed-based when no overrides:', gadget3); // TIME_MACHINE
}

// Example 6: Usage in a React component
function exampleInComponent() {
  // In your Avatar component:
  /*
  import { getGadget } from '@/utils/gadget';
  
  function Avatar({ user, speed, status, weather }: AvatarProps) {
    const gadget = getGadget(speed, status, weather);
    
    return (
      <View>
        <GadgetIcon gadget={gadget} />
        <UserAvatar user={user} />
      </View>
    );
  }
  */
}

export {
  exampleSpeedOnly,
  exampleStatusOnly,
  exampleWeatherOnly,
  exampleComplete,
  examplePriority,
  exampleInComponent,
};
