#!/bin/bash

# Seed location data for testing
# Run this after backend is started

API_URL="http://localhost:8080/api/locations"

echo "Seeding location data..."

# User 1 (Dao) - Walking
echo "Creating location for User 1 (Dao - Walking)..."
curl -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"latitude":10.762622,"longitude":106.660172,"speed":5.5,"heading":45,"accuracy":10,"status":"walking"}'

echo ""

# User 2 (Minh) - Biking  
echo "Creating location for User 2 (Minh - Biking)..."
curl -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"latitude":10.763500,"longitude":106.661500,"speed":25.0,"heading":90,"accuracy":8,"status":"biking"}'

echo ""

# User 3 (Hoa) - Stationary
echo "Creating location for User 3 (Hoa - Stationary)..."
curl -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"latitude":10.764000,"longitude":106.662000,"speed":0.5,"heading":0,"accuracy":5,"status":"stationary"}'

echo ""

# User 4 (Nam) - Driving
echo "Creating location for User 4 (Nam - Driving)..."
curl -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"latitude":10.765000,"longitude":106.663500,"speed":65.0,"heading":180,"accuracy":12,"status":"driving"}'

echo ""
echo "Done! Check locations at: $API_URL"
