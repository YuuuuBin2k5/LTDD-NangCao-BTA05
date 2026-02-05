@echo off
echo.
echo ========================================
echo   MAPIC - Auto IP Configuration
echo ========================================
echo.

node scripts/get-ip.js

echo.
echo ========================================
echo   Done! Now restart Expo:
echo   npm start -- --clear
echo ========================================
echo.
pause
