@echo off
REM Seed location data for testing
REM Run this after backend is started

set API_URL=http://localhost:8080/api

echo ========================================
echo MAPIC Backend - Setup Test Data
echo ========================================
echo.

echo Step 1: Creating test users...
curl -X POST %API_URL%/test/seed-users
echo.
echo.

echo Step 2: Creating location for User 2 (Minh - Biking)...
curl -X POST %API_URL%/locations -H "Content-Type: application/json" -d "{\"userId\":2,\"latitude\":10.763500,\"longitude\":106.661500,\"speed\":25.0,\"heading\":90,\"accuracy\":8,\"status\":\"biking\"}"
echo.
echo.

echo Step 3: Creating location for User 3 (Hoa - Stationary)...
curl -X POST %API_URL%/locations -H "Content-Type: application/json" -d "{\"userId\":3,\"latitude\":10.764000,\"longitude\":106.662000,\"speed\":0.5,\"heading\":0,\"accuracy\":5,\"status\":\"stationary\"}"
echo.
echo.

echo Step 4: Creating location for User 4 (Nam - Driving)...
curl -X POST %API_URL%/locations -H "Content-Type: application/json" -d "{\"userId\":4,\"latitude\":10.765000,\"longitude\":106.663500,\"speed\":65.0,\"heading\":180,\"accuracy\":12,\"status\":\"driving\"}"
echo.
echo.

echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Checking friends locations...
curl %API_URL%/locations
echo.
echo.
echo Now reload your mobile app to see friend avatars!
pause
