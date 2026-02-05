package com.mapic.backend.services;

import com.mapic.backend.dtos.*;
import com.mapic.backend.entities.Place;
import com.mapic.backend.entities.PlaceCheckIn;
import com.mapic.backend.entities.User;
import com.mapic.backend.repositories.PlaceRepository;
import com.mapic.backend.repositories.PlaceCheckInRepository;
import com.mapic.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaceService {
    
    private final PlaceRepository placeRepository;
    private final PlaceCheckInRepository placeCheckInRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<PlaceResponse> searchPlaces(PlaceSearchRequest request) {
        List<Place> places;
        
        if (request.getQuery() != null && !request.getQuery().isEmpty()) {
            places = placeRepository.searchByQueryAndCategory(
                request.getQuery(), 
                request.getCategory()
            );
        } else if (request.getCategory() != null) {
            places = placeRepository.findByCategory(request.getCategory());
        } else {
            places = placeRepository.findAll();
        }
        
        // Calculate distances and filter by radius
        List<PlaceResponse> responses = places.stream()
            .map(place -> {
                PlaceResponse response = PlaceResponse.builder()
                    .id(place.getId())
                    .name(place.getName())
                    .category(place.getCategory())
                    .address(place.getAddress())
                    .latitude(place.getLatitude())
                    .longitude(place.getLongitude())
                    .phone(place.getPhone())
                    .description(place.getDescription())
                    .imageUrl(place.getImageUrl())
                    .rating(place.getRating())
                    .openingHours(place.getOpeningHours())
                    .build();
                
                // Calculate distance if user location provided
                if (request.getLatitude() != null && request.getLongitude() != null) {
                    double distance = calculateDistance(
                        request.getLatitude(), request.getLongitude(),
                        place.getLatitude(), place.getLongitude()
                    );
                    response.setDistance(distance);
                }
                
                return response;
            })
            .filter(response -> {
                // Filter by radius
                if (request.getRadius() != null && response.getDistance() != null) {
                    return response.getDistance() <= request.getRadius();
                }
                return true;
            })
            .sorted(Comparator.comparing(PlaceResponse::getDistance, 
                Comparator.nullsLast(Comparator.naturalOrder())))
            .collect(Collectors.toList());
        
        return responses;
    }

    @Transactional(readOnly = true)
    public PlaceResponse getPlaceById(Long placeId, Double userLat, Double userLon) {
        Place place = placeRepository.findById(placeId)
            .orElseThrow(() -> new RuntimeException("Place not found"));
        
        PlaceResponse response = PlaceResponse.builder()
            .id(place.getId())
            .name(place.getName())
            .category(place.getCategory())
            .address(place.getAddress())
            .latitude(place.getLatitude())
            .longitude(place.getLongitude())
            .phone(place.getPhone())
            .description(place.getDescription())
            .imageUrl(place.getImageUrl())
            .rating(place.getRating())
            .openingHours(place.getOpeningHours())
            .build();
        
        if (userLat != null && userLon != null) {
            double distance = calculateDistance(userLat, userLon, 
                place.getLatitude(), place.getLongitude());
            response.setDistance(distance);
        }
        
        return response;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Earth radius in meters
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
    
    // Discovery Features
    
    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoriesWithCounts() {
        List<CategoryResponse> categories = new ArrayList<>();
        
        // Add "All" category
        Long totalCount = placeRepository.count();
        categories.add(CategoryResponse.builder()
            .name("All")
            .icon("🌟")
            .count(totalCount)
            .build());
        
        // Get counts by category
        List<Object[]> results = placeRepository.countByCategory();
        
        Map<String, String> categoryIcons = Map.of(
            "CAFE", "☕",
            "RESTAURANT", "🍜",
            "PARK", "🏞️",
            "MUSEUM", "🏛️",
            "SHOPPING", "🛍️",
            "ENTERTAINMENT", "🎭",
            "OTHER", "📍"
        );
        
        for (Object[] result : results) {
            String category = (String) result[0];
            Long count = ((Number) result[1]).longValue();
            
            if (count > 0) {
                categories.add(CategoryResponse.builder()
                    .name(category)
                    .icon(categoryIcons.getOrDefault(category, "📍"))
                    .count(count)
                    .build());
            }
        }
        
        return categories;
    }
    
    @Transactional(readOnly = true)
    public List<PopularPlaceResponse> getPopularPlaces(
        Double userLat,
        Double userLng,
        Integer limit,
        Double radius
    ) {
        if (limit == null) limit = 10;
        if (radius == null) radius = 10.0; // 10km default
        
        List<Place> allPlaces = placeRepository.findAll();
        List<PopularPlaceResponse> popularPlaces = new ArrayList<>();
        
        for (Place place : allPlaces) {
            // Calculate distance
            Double distance = calculateDistance(
                userLat, userLng,
                place.getLatitude(), place.getLongitude()
            );
            
            // Filter by radius (convert km to meters)
            if (distance > radius * 1000) continue;
            
            // Get check-in count
            Long checkInCount = placeCheckInRepository.countByPlaceId(place.getId());
            
            // Calculate popularity score
            Double distanceFactor = getDistanceFactor(distance);
            Double popularityScore = checkInCount * place.getRating() * distanceFactor;
            
            popularPlaces.add(PopularPlaceResponse.builder()
                .id(place.getId())
                .name(place.getName())
                .category(place.getCategory())
                .description(place.getDescription())
                .photoUrl(place.getImageUrl())
                .latitude(place.getLatitude())
                .longitude(place.getLongitude())
                .address(place.getAddress())
                .rating(place.getRating())
                .distance(distance)
                .checkInCount(checkInCount)
                .popularityScore(popularityScore)
                .build());
        }
        
        // Sort by popularity score descending
        popularPlaces.sort((a, b) -> b.getPopularityScore().compareTo(a.getPopularityScore()));
        
        // Return top N
        return popularPlaces.stream().limit(limit).collect(Collectors.toList());
    }
    
    private Double getDistanceFactor(Double distance) {
        if (distance < 1000) return 1.0;      // < 1km
        if (distance < 3000) return 0.8;      // < 3km
        if (distance < 5000) return 0.5;      // < 5km
        if (distance < 10000) return 0.3;     // < 10km
        return 0.1;
    }
    
    @Transactional
    public PlaceCheckIn checkInToPlace(Long placeId, Long userId, Double userLat, Double userLng) {
        // Validate place exists
        Place place = placeRepository.findById(placeId)
            .orElseThrow(() -> new RuntimeException("Place not found"));
        
        // Check if already checked in today
        Optional<PlaceCheckIn> existingCheckIn = 
            placeCheckInRepository.findTodayCheckIn(placeId, userId);
        
        if (existingCheckIn.isPresent()) {
            throw new RuntimeException("Already checked in today");
        }
        
        // Validate user is within 100m
        Double distance = calculateDistance(
            userLat, userLng,
            place.getLatitude(), place.getLongitude()
        );
        
        if (distance > 100) {
            throw new RuntimeException("Too far from place (must be within 100m)");
        }
        
        // Create check-in
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        PlaceCheckIn checkIn = PlaceCheckIn.builder()
            .place(place)
            .user(user)
            .build();
        
        return placeCheckInRepository.save(checkIn);
    }
}
