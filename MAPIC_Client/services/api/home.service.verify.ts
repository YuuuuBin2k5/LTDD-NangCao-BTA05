/**
 * Verification script for Friends Location API
 * Run this to manually verify the implementation
 * 
 * Usage:
 * 1. Start the backend server
 * 2. Import this in your app and call verifyFriendsLocationAPI()
 * 3. Check console logs for results
 */

import { useFriendsStore } from '@/store/friends.store';
import homeApiService from './home.service';

/**
 * Verify Friends Location API implementation
 */
export async function verifyFriendsLocationAPI() {
  console.log('=== Friends Location API Verification ===\n');

  // Test 1: Direct API call
  console.log('Test 1: Direct API call to getFriendsLocations()');
  try {
    const locations = await homeApiService.getFriendsLocations();
    console.log('✅ Success! Fetched', locations.length, 'locations');
    console.log('Sample location:', locations[0]);
  } catch (error: any) {
    console.log('❌ Failed:', error.message);
  }

  // Test 2: Store fetch
  console.log('\nTest 2: Fetch via friends store');
  const { fetchFriendsLocations, friendsLocations, error } = useFriendsStore.getState();
  await fetchFriendsLocations();
  
  if (error) {
    console.log('❌ Error:', error);
    console.log('Locations from cache:', friendsLocations.length);
  } else {
    console.log('✅ Success! Store has', friendsLocations.length, 'locations');
  }

  // Test 3: Polling
  console.log('\nTest 3: Start polling (will fetch every 5 seconds)');
  const { startPolling, isPolling } = useFriendsStore.getState();
  startPolling();
  console.log('Polling started:', isPolling);
  
  // Wait 6 seconds to see second fetch
  await new Promise(resolve => setTimeout(resolve, 6000));
  
  const { friendsLocations: updatedLocations } = useFriendsStore.getState();
  console.log('After 6 seconds, locations:', updatedLocations.length);
  
  // Stop polling
  const { stopPolling } = useFriendsStore.getState();
  stopPolling();
  console.log('Polling stopped');

  // Test 4: Cache loading
  console.log('\nTest 4: Load from Realm cache');
  const { loadFromCache } = useFriendsStore.getState();
  loadFromCache();
  const { friendsLocations: cachedLocations } = useFriendsStore.getState();
  console.log('Loaded', cachedLocations.length, 'locations from cache');

  console.log('\n=== Verification Complete ===');
}

/**
 * Quick test for API connectivity
 */
export async function quickAPITest() {
  console.log('Testing API connectivity...');
  try {
    const locations = await homeApiService.getFriendsLocations();
    console.log('✅ API is working! Fetched', locations.length, 'locations');
    return true;
  } catch (error: any) {
    console.log('❌ API failed:', error.message);
    return false;
  }
}

/**
 * Test polling behavior
 */
export function testPolling(durationSeconds: number = 15) {
  console.log(`Testing polling for ${durationSeconds} seconds...`);
  
  const { startPolling, stopPolling, friendsLocations } = useFriendsStore.getState();
  
  let fetchCount = 0;
  const unsubscribe = useFriendsStore.subscribe((state) => {
    if (state.friendsLocations !== friendsLocations) {
      fetchCount++;
      console.log(`Fetch #${fetchCount}: ${state.friendsLocations.length} locations`);
    }
  });
  
  startPolling();
  
  setTimeout(() => {
    stopPolling();
    unsubscribe();
    console.log(`Polling test complete. Total fetches: ${fetchCount}`);
    console.log(`Expected: ~${Math.floor(durationSeconds / 5)} fetches`);
  }, durationSeconds * 1000);
}

/**
 * Checklist for manual verification
 */
export function printVerificationChecklist() {
  console.log(`
=== Friends Location API - Verification Checklist ===

Task 15 Requirements:
✓ Create GET /api/locations endpoint call
  - Implemented in homeApiService.getFriendsLocations()
  
✓ Implement polling every 5 seconds using setInterval
  - Implemented in useFriendsStore.startPolling()
  - Uses setInterval with 5000ms delay
  
✓ Parse response and update friends locations on map
  - Response parsed in homeApiService
  - State updated in useFriendsStore.setFriendsLocations()
  
✓ Store locations in Realm as cache
  - Implemented in fetchFriendsLocations()
  - Calls realmService.saveLocation() for each friend
  
✓ Fallback to cache on API failure
  - Implemented in fetchFriendsLocations() catch block
  - Calls loadFromCache() on error

Manual Testing Steps:
1. Start backend server
2. Call verifyFriendsLocationAPI() in your app
3. Check console logs for success/failure
4. Verify locations appear on map
5. Test offline mode (airplane mode)
6. Verify cache fallback works

Files Created/Modified:
- store/friends.store.ts (NEW)
- store/index.ts (MODIFIED - added export)
- services/api/home.service.README.md (UPDATED)
- services/api/home.service.example.tsx (NEW)
- services/api/home.service.test.ts (NEW)
- services/api/home.service.verify.ts (NEW - this file)
  `);
}
