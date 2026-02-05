package com.mapic.backend.controllers;

import com.mapic.backend.dtos.*;
import com.mapic.backend.entities.PlaceCheckIn;
import com.mapic.backend.services.PlaceService;
import com.mapic.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/places")
@RequiredArgsConstructor
public class PlaceController {
    
    private final PlaceService placeService;
    private final JwtUtil jwtUtil;

    @PostMapping("/search")
    public ResponseEntity<List<PlaceResponse>> searchPlaces(
            @RequestBody PlaceSearchRequest request) {
        List<PlaceResponse> places = placeService.searchPlaces(request);
        return ResponseEntity.ok(places);
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<PlaceResponse>> getNearbyPlaces(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "5000") Double radius,
            @RequestParam(required = false) String category) {
        
        PlaceSearchRequest request = new PlaceSearchRequest();
        request.setLatitude(latitude);
        request.setLongitude(longitude);
        request.setRadius(radius);
        request.setCategory(category);
        
        List<PlaceResponse> places = placeService.searchPlaces(request);
        return ResponseEntity.ok(places);
    }

    @GetMapping("/{placeId}")
    public ResponseEntity<PlaceResponse> getPlaceById(
            @PathVariable Long placeId,
            @RequestParam(required = false) Double userLatitude,
            @RequestParam(required = false) Double userLongitude) {
        
        PlaceResponse place = placeService.getPlaceById(placeId, userLatitude, userLongitude);
        return ResponseEntity.ok(place);
    }
    
    // Discovery Features
    
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories() {
        try {
            List<CategoryResponse> categories = placeService.getCategoriesWithCounts();
            return ResponseEntity.ok(ApiResponse.successWithData("Categories retrieved successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Error retrieving categories: " + e.getMessage()));
        }
    }
    
    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<PopularPlaceResponse>>> getPopularPlaces(
        @RequestParam Double lat,
        @RequestParam Double lng,
        @RequestParam(required = false) Integer limit,
        @RequestParam(required = false) Double radius
    ) {
        try {
            List<PopularPlaceResponse> places = placeService.getPopularPlaces(lat, lng, limit, radius);
            return ResponseEntity.ok(ApiResponse.successWithData("Popular places retrieved successfully", places));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Error retrieving popular places: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/checkin")
    public ResponseEntity<ApiResponse<PlaceCheckIn>> checkIn(
        @PathVariable Long id,
        @RequestBody Map<String, Double> location,
        @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Long userId = jwtUtil.extractUserId(token);
            
            Double lat = location.get("latitude");
            Double lng = location.get("longitude");
            
            PlaceCheckIn checkIn = placeService.checkInToPlace(id, userId, lat, lng);
            return ResponseEntity.ok(ApiResponse.successWithData("Check-in successful", checkIn));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Error: " + e.getMessage()));
        }
    }
}
