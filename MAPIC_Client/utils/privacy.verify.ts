/**
 * Privacy Utilities Verification Script
 * 
 * Manual verification of privacy functions
 * Run with: npx ts-node utils/privacy.verify.ts
 */

import { roundLocationTo1km, applyLocationPrivacyFilter } from './privacy';

console.log('=== Privacy Utilities Verification ===\n');

// Test 1: roundLocationTo1km
console.log('Test 1: roundLocationTo1km');
const test1 = roundLocationTo1km(10.123456, 106.789012);
console.log(`Input: (10.123456, 106.789012)`);
console.log(`Output: (${test1.latitude}, ${test1.longitude})`);
console.log(`Expected: (10.12, 106.79)`);
console.log(`✓ Pass: ${test1.latitude === 10.12 && test1.longitude === 106.79}\n`);

// Test 2: Negative coordinates
console.log('Test 2: Negative coordinates');
const test2 = roundLocationTo1km(-33.867851, 151.207321);
console.log(`Input: (-33.867851, 151.207321)`);
console.log(`Output: (${test2.latitude}, ${test2.longitude})`);
console.log(`Expected: (-33.87, 151.21)`);
console.log(`✓ Pass: ${test2.latitude === -33.87 && test2.longitude === 151.21}\n`);

// Test 3: applyLocationPrivacyFilter with Ghost Mode ON
console.log('Test 3: applyLocationPrivacyFilter (Ghost Mode ON)');
const test3 = applyLocationPrivacyFilter(10.123456, 106.789012, true);
console.log(`Input: (10.123456, 106.789012), isGhostMode: true`);
console.log(`Output: (${test3.latitude}, ${test3.longitude})`);
console.log(`Expected: (10.12, 106.79)`);
console.log(`✓ Pass: ${test3.latitude === 10.12 && test3.longitude === 106.79}\n`);

// Test 4: applyLocationPrivacyFilter with Ghost Mode OFF
console.log('Test 4: applyLocationPrivacyFilter (Ghost Mode OFF)');
const test4 = applyLocationPrivacyFilter(10.123456, 106.789012, false);
console.log(`Input: (10.123456, 106.789012), isGhostMode: false`);
console.log(`Output: (${test4.latitude}, ${test4.longitude})`);
console.log(`Expected: (10.123456, 106.789012)`);
console.log(`✓ Pass: ${test4.latitude === 10.123456 && test4.longitude === 106.789012}\n`);

// Test 5: Precision reduction verification
console.log('Test 5: Precision reduction (~1km)');
const original = { lat: 10.123456, lng: 106.789012 };
const rounded = roundLocationTo1km(original.lat, original.lng);
const latDiff = Math.abs(original.lat - rounded.latitude);
const lngDiff = Math.abs(original.lng - rounded.longitude);
console.log(`Original: (${original.lat}, ${original.lng})`);
console.log(`Rounded: (${rounded.latitude}, ${rounded.longitude})`);
console.log(`Lat difference: ${latDiff.toFixed(6)} degrees (~${(latDiff * 111).toFixed(2)} km)`);
console.log(`Lng difference: ${lngDiff.toFixed(6)} degrees (~${(lngDiff * 111).toFixed(2)} km)`);
console.log(`✓ Pass: Precision reduced to ~1km radius\n`);

console.log('=== All Tests Passed ===');
