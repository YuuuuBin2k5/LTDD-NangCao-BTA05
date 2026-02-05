const os = require('os');
const fs = require('fs');
const path = require('path');

/**
 * Get local IP address automatically
 */
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  
  // Priority order: WiFi > Ethernet > Others
  const priorityOrder = ['Wi-Fi', 'WiFi', 'WLAN', 'Ethernet', 'en0', 'eth0'];
  
  // Try priority interfaces first
  for (const name of priorityOrder) {
    const iface = interfaces[name];
    if (iface) {
      for (const details of iface) {
        if (details.family === 'IPv4' && !details.internal) {
          return details.address;
        }
      }
    }
  }
  
  // Fallback: find any non-internal IPv4
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    for (const details of iface) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
  
  return 'localhost';
}

/**
 * Update .env file with detected IP
 */
function updateEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  const ip = getLocalIpAddress();
  const port = 8080;
  
  console.log('🔍 Detected IP Address:', ip);
  
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Update or add API URL
  const apiUrl = `http://${ip}:${port}`;
  const wsUrl = `ws://${ip}:${port}/ws`;
  
  if (envContent.includes('EXPO_PUBLIC_API_BASE_URL=')) {
    envContent = envContent.replace(
      /EXPO_PUBLIC_API_BASE_URL=.*/,
      `EXPO_PUBLIC_API_BASE_URL=${apiUrl}`
    );
  } else {
    envContent += `\nEXPO_PUBLIC_API_BASE_URL=${apiUrl}`;
  }
  
  if (envContent.includes('EXPO_PUBLIC_WS_URL=')) {
    envContent = envContent.replace(
      /EXPO_PUBLIC_WS_URL=.*/,
      `EXPO_PUBLIC_WS_URL=${wsUrl}`
    );
  } else {
    envContent += `\nEXPO_PUBLIC_WS_URL=${wsUrl}`;
  }
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Updated .env file:');
  console.log(`   API: ${apiUrl}`);
  console.log(`   WS:  ${wsUrl}`);
  console.log('');
  console.log('💡 Restart Expo to apply changes: npm start -- --clear');
}

// Run
updateEnvFile();
