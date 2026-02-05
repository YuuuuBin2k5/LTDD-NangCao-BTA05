# MAPIC Backend API

Spring Boot backend cho ứng dụng MAPIC - Location sharing app.

## Yêu cầu

- Java 17+
- PostgreSQL 12+
- Maven 3.6+

## Quick Start

### 1. Start Backend
```bash
cd MAPIC_App/backend
mvn spring-boot:run
```

### 2. Setup Test Data
**Windows:**
```bash
cd MAPIC_App/backend
setup-test-data.bat
```

**Linux/Mac:**
```bash
cd MAPIC_App/backend
chmod +x seed-locations.sh
./seed-locations.sh
```

Or manually:
```bash
# Create users
curl -X POST http://localhost:8080/api/test/seed-users

# Create locations
curl -X POST http://localhost:8080/api/locations -H "Content-Type: application/json" -d "{\"latitude\":10.763,\"longitude\":106.661,\"speed\":25,\"heading\":90,\"accuracy\":8,\"status\":\"biking\"}"
```

### 3. Start Mobile App
```bash
cd MAPIC_App/MAPIC_Client
npx expo start --clear
```

Backend sẽ chạy tại: `http://localhost:8080`

## API Endpoints

### Location APIs

#### 1. Update Location
```http
POST /api/locations
Content-Type: application/json

{
  "latitude": 10.762622,
  "longitude": 106.660172,
  "speed": 0.0,
  "heading": 0.0,
  "accuracy": 10.0,
  "status": "stationary",
  "timestamp": "2024-01-29T10:00:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Location updated successfully",
  "data": {
    "userId": 1,
    "userName": "Test User 1",
    "userAvatar": "https://i.pravatar.cc/150?img=1",
    "latitude": 10.762622,
    "longitude": 106.660172,
    "speed": 0.0,
    "heading": 0.0,
    "accuracy": 10.0,
    "status": "stationary",
    "timestamp": "2024-01-29T10:00:00"
  }
}
```

#### 2. Get Friends Locations
```http
GET /api/locations
```

**Response:**
```json
{
  "success": true,
  "message": "Friends locations retrieved successfully",
  "data": [
    {
      "userId": 2,
      "userName": "Test User 2",
      "userAvatar": "https://i.pravatar.cc/150?img=2",
      "latitude": 10.762622,
      "longitude": 106.660172,
      "speed": 0.0,
      "heading": 0.0,
      "accuracy": 10.0,
      "status": "stationary",
      "timestamp": "2024-01-29T10:00:00"
    }
  ]
}
```

#### 3. Get User Location
```http
GET /api/locations/{userId}
```

#### 4. Get Location History
```http
GET /api/locations/{userId}/history?startTime=2024-01-28T00:00:00&endTime=2024-01-29T23:59:59
```

## Test Users

Backend tự động tạo 3 test users:

| Email | Password | Full Name |
|-------|----------|-----------|
| test1@mapic.app | password123 | Test User 1 |
| test2@mapic.app | password123 | Test User 2 |
| test3@mapic.app | password123 | Test User 3 |

## Cấu trúc Project

```
backend/
├── src/main/java/com/mapic/backend/
│   ├── config/          # Security, CORS configuration
│   ├── controllers/     # REST API endpoints
│   ├── dtos/           # Request/Response objects
│   ├── entities/       # JPA entities
│   ├── repositories/   # Database repositories
│   ├── services/       # Business logic
│   └── utils/          # Utility classes
└── src/main/resources/
    ├── application.properties
    └── data.sql        # Test data
```

## Kết nối với Mobile App

Cập nhật `.env` trong MAPIC_Client:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.5:8080
```

**Lưu ý:** Thay `192.168.1.5` bằng IP máy tính của bạn (không dùng localhost khi test trên điện thoại thật).

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra username/password trong application.properties
- Kiểm tra database `mapic_db` đã được tạo chưa

### Lỗi port 8080 đã được sử dụng
Thay đổi port trong `application.properties`:
```properties
server.port=8081
```

## TODO

- [ ] Implement JWT authentication cho Location APIs
- [ ] Tạo Friend Service và Friend APIs
- [ ] Implement WebSocket cho real-time location updates
- [ ] Add location privacy settings
- [ ] Add location sharing permissions
