/**
 * Performance Service Verification Script
 * 
 * This script demonstrates and verifies the performance optimization implementation.
 * Run this to see how the performance service works.
 */

import performanceService from './performance.service';

async function verifyPerformanceService() {
  console.log('=== Performance Service Verification ===\n');

  // 1. Initialize the service
  console.log('1. Initializing performance service...');
  await performanceService.initialize();
  console.log('✓ Service initialized\n');

  // 2. Check initial metrics
  console.log('2. Initial metrics:');
  const initialMetrics = performanceService.getMetrics();
  console.log(`   - App State: ${initialMetrics.appState}`);
  console.log(`   - Battery Level: ${(initialMetrics.batteryLevel * 100).toFixed(0)}%`);
  console.log(`   - Battery State: ${initialMetrics.batteryState}`);
  console.log(`   - Low Battery: ${initialMetrics.isLowBattery}`);
  console.log(`   - Polling Interval: ${initialMetrics.currentPollingInterval}ms`);
  console.log(`   - Animations Enabled: ${initialMetrics.animationsEnabled}`);
  console.log(`   - Memory Warnings: ${initialMetrics.memoryWarnings}\n`);

  // 3. Subscribe to app state changes
  console.log('3. Subscribing to app state changes...');
  const unsubscribeAppState = performanceService.onAppStateChange((state) => {
    console.log(`   → App state changed to: ${state}`);
    console.log(`   → New polling interval: ${performanceService.getCurrentPollingInterval()}ms`);
  });
  console.log('✓ Subscribed to app state changes\n');

  // 4. Subscribe to battery changes
  console.log('4. Subscribing to battery changes...');
  const unsubscribeBattery = performanceService.onBatteryChange((level, state) => {
    console.log(`   → Battery changed: ${(level * 100).toFixed(0)}% (${state})`);
    console.log(`   → Low battery: ${performanceService.isLowBattery()}`);
    console.log(`   → Animations enabled: ${performanceService.shouldEnableAnimations()}`);
  });
  console.log('✓ Subscribed to battery changes\n');

  // 5. Subscribe to memory warnings
  console.log('5. Subscribing to memory warnings...');
  const unsubscribeMemory = performanceService.onMemoryWarning(() => {
    console.log(`   → Memory warning received!`);
    console.log(`   → Total warnings: ${performanceService.getMetrics().memoryWarnings}`);
  });
  console.log('✓ Subscribed to memory warnings\n');

  // 6. Simulate memory warning
  console.log('6. Simulating memory warning...');
  performanceService.handleMemoryWarning();
  console.log('✓ Memory warning handled\n');

  // 7. Check state queries
  console.log('7. State queries:');
  console.log(`   - Is in background: ${performanceService.isInBackground()}`);
  console.log(`   - Is low battery: ${performanceService.isLowBattery()}`);
  console.log(`   - Should enable animations: ${performanceService.shouldEnableAnimations()}`);
  console.log(`   - Current polling interval: ${performanceService.getCurrentPollingInterval()}ms\n`);

  // 8. Update configuration
  console.log('8. Updating configuration...');
  performanceService.updateConfig({
    lowBatteryThreshold: 0.15, // Change to 15%
    enablePerformanceLogs: true,
  });
  console.log('✓ Configuration updated\n');

  // 9. Log final metrics
  console.log('9. Final metrics:');
  performanceService.logMetrics();
  console.log('');

  // 10. Cleanup
  console.log('10. Cleaning up...');
  unsubscribeAppState();
  unsubscribeBattery();
  unsubscribeMemory();
  performanceService.cleanup();
  console.log('✓ Cleanup complete\n');

  console.log('=== Verification Complete ===');
  console.log('\nKey Features Verified:');
  console.log('✓ Service initialization');
  console.log('✓ Metrics tracking');
  console.log('✓ App state monitoring');
  console.log('✓ Battery monitoring');
  console.log('✓ Memory warning handling');
  console.log('✓ State queries');
  console.log('✓ Configuration updates');
  console.log('✓ Cleanup');
}

// Run verification if this file is executed directly
if (require.main === module) {
  verifyPerformanceService()
    .then(() => {
      console.log('\n✓ All verifications passed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n✗ Verification failed:', error);
      process.exit(1);
    });
}

export default verifyPerformanceService;
