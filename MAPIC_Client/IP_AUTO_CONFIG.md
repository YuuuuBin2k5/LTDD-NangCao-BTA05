# 🌐 Auto IP Configuration

## Vấn đề
Khi develop React Native app với backend local, IP address thay đổi khi:
- Đổi mạng WiFi
- Kết nối/ngắt VPN
- Thay đổi network adapter

## ✅ Giải pháp: Auto-detect IP

### Cách 1: Sử dụng npm script (Khuyến nghị)

```bash
# Tự động detect IP và start Expo
npm run start:auto

# Hoặc chỉ update IP (không start Expo)
npm run update-ip
```

### Cách 2: Sử dụng batch file (Windows)

Double-click file:
```
update-ip.bat
```

### Cách 3: Chạy script trực tiếp

```bash
node scripts/get-ip.js
```

## 📝 Script hoạt động như thế nào?

1. **Detect IP**: Tự động tìm IPv4 address của máy
   - Ưu tiên: WiFi > Ethernet > Others
   - Bỏ qua internal IPs (127.0.0.1, localhost)

2. **Update .env**: Tự động cập nhật file `.env`
   ```
   EXPO_PUBLIC_API_BASE_URL=http://[YOUR_IP]:8080
   EXPO_PUBLIC_WS_URL=ws://[YOUR_IP]:8080/ws
   ```

3. **Ready**: Restart Expo để apply changes

## 🎯 Khi nào cần chạy?

- ✅ Lần đầu setup project
- ✅ Khi đổi mạng WiFi
- ✅ Khi backend timeout (không connect được)
- ✅ Khi IP máy thay đổi

## 🔧 Troubleshooting

### Script không tìm thấy IP đúng?

Edit `scripts/get-ip.js` và thêm tên network adapter của bạn:

```javascript
const priorityOrder = ['Wi-Fi', 'WiFi', 'WLAN', 'Ethernet', 'YOUR_ADAPTER_NAME'];
```

Để xem tên adapter:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

### Vẫn không connect được?

1. **Check Backend đang chạy:**
   ```bash
   curl http://localhost:8080/api/v1/test
   ```

2. **Check Firewall:**
   - Windows: Allow port 8080 in Windows Firewall
   - Mac: System Preferences > Security > Firewall

3. **Check cùng mạng:**
   - Phone và Computer phải cùng WiFi network

## 💡 Tips

### Development với Android Emulator
Android Emulator có IP đặc biệt:
```
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080
```

### Development với iOS Simulator
iOS Simulator dùng localhost:
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Development với Physical Device
Dùng script auto-detect (khuyến nghị) hoặc manual IP.

## 🚀 Quick Start

```bash
# 1. Update IP
npm run update-ip

# 2. Start Backend
cd ../backend
mvn spring-boot:run

# 3. Start Expo (new terminal)
cd ../MAPIC_Client
npm start -- --clear

# 4. Scan QR code trên phone
```

## 📱 Alternative: Expo Tunnel

Nếu không muốn config IP, dùng Expo tunnel:

```bash
npm start -- --tunnel
```

**Lưu ý:** Tunnel chậm hơn và cần internet.
