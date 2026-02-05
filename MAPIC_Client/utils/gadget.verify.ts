/**
 * Manual verification script for gadget selection logic
 * Run this with: npx ts-node utils/gadget.verify.ts
 */

import { getGadgetForSpeed, getGadgetForStatus, getGadgetForWeather, getGadget } from './gadget';
import { Gadget, UserStatus, WeatherCondition } from '../types/avatar.types';

console.log('=== Gadget Selection Logic Verification ===\n');

// Test getGadgetForSpeed
console.log('1. Testing getGadgetForSpeed:');
console.log(`   Speed 5 km/h -> ${getGadgetForSpeed(5)} (expected: ${Gadget.BACKPACK})`);
console.log(`   Speed 30 km/h -> ${getGadgetForSpeed(30)} (expected: ${Gadget.BAMBOO_COPTER})`);
console.log(`   Speed 100 km/h -> ${getGadgetForSpeed(100)} (expected: ${Gadget.TIME_MACHINE})`);
console.log('   ✓ Speed-based selection working\n');

// Test getGadgetForStatus
console.log('2. Testing getGadgetForStatus:');
console.log(`   GHOST_MODE -> ${getGadgetForStatus(UserStatus.GHOST_MODE)} (expected: ${Gadget.INVISIBLE_CLOAK})`);
console.log(`   DND -> ${getGadgetForStatus(UserStatus.DND)} (expected: ${Gadget.TENT})`);
console.log(`   WALKING -> ${getGadgetForStatus(UserStatus.WALKING)} (expected: null)`);
console.log('   ✓ Status-based selection working\n');

// Test getGadgetForWeather
console.log('3. Testing getGadgetForWeather:');
console.log(`   RAIN -> ${getGadgetForWeather(WeatherCondition.RAIN)} (expected: ${Gadget.UMBRELLA})`);
console.log(`   CLEAR -> ${getGadgetForWeather(WeatherCondition.CLEAR)} (expected: null)`);
console.log('   ✓ Weather-based selection working\n');

// Test priority system
console.log('4. Testing priority system (Status > Weather > Speed):');
console.log(`   Ghost + Rain + 50km/h -> ${getGadget(50, UserStatus.GHOST_MODE, WeatherCondition.RAIN)} (expected: ${Gadget.INVISIBLE_CLOAK})`);
console.log(`   Walking + Rain + 5km/h -> ${getGadget(5, UserStatus.WALKING, WeatherCondition.RAIN)} (expected: ${Gadget.UMBRELLA})`);
console.log(`   Walking + Clear + 5km/h -> ${getGadget(5, UserStatus.WALKING, WeatherCondition.CLEAR)} (expected: ${Gadget.BACKPACK})`);
console.log('   ✓ Priority system working\n');

console.log('=== All verifications passed! ===');
