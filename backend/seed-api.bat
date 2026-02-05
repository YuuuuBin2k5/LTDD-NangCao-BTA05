@echo off
echo ========================================
echo MAPIC Backend - Seeding Data via API
echo ========================================
echo.

echo Calling seed API endpoint...
curl -X POST http://localhost:8080/api/seed/all

echo.
echo.
echo ========================================
echo Seed completed!
echo ========================================
pause
