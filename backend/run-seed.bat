@echo off
echo ========================================
echo MAPIC Backend - Running Seed Data
echo ========================================
echo.

echo Connecting to PostgreSQL database and running seed script...
echo Enter PostgreSQL password when prompted...
psql -U postgres -d mapic_db -f src/main/resources/data-seed.sql

echo.
echo ========================================
echo Seed data completed!
echo ========================================
echo.
echo You can now test the app with demo data:
echo - 10 users (user2@gmail.com to user11@gmail.com)
echo - User 1 has 5 friends
echo - 50+ locations around Ho Chi Minh City
echo - 30 places (cafes, restaurants, parks, etc.)
echo.
echo Password for all users: 091005aE@
echo ========================================
pause
