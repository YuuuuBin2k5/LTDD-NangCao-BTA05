package com.mapic.backend.controllers;

import com.mapic.backend.dtos.ApiResponse;
import com.mapic.backend.dtos.LocationRequest;
import com.mapic.backend.dtos.LocationResponse;
import com.mapic.backend.services.LocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") // Allow all origins for development
public class LocationController {
    
    private final LocationService locationService;
    
    /**
     * POST /api/locations - Update user's location
     * Accepts userId in request body or uses default userId=1
     */
    @PostMapping
    public ResponseEntity<ApiResponse<LocationResponse>> updateLocation(
        @RequestBody LocationRequest request
    ) {
        try {
            // TODO: Extract userId from JWT token
            // For now, use userId from request or default to 1
            Long userId = request.getUserId() != null ? request.getUserId() : 1L;
            
            log.info("Updating location for user {}: lat={}, lng={}", 
                userId, request.getLatitude(), request.getLongitude());
            
            LocationResponse response = locationService.updateLocation(userId, request);
            
            return ResponseEntity.ok(ApiResponse.<LocationResponse>builder()
                .success(true)
                .message("Location updated successfully")
                .data(response)
                .build());
                
        } catch (Exception e) {
            log.error("Error updating location", e);
            return ResponseEntity.badRequest().body(ApiResponse.<LocationResponse>builder()
                .success(false)
                .message("Failed to update location: " + e.getMessage())
                .build());
        }
    }
    
    /**
     * GET /api/locations - Get friends' latest locations
     * For now, returns all users' locations except current user
     * TODO: Integrate with FriendService
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<LocationResponse>>> getFriendsLocations() {
        try {
            // TODO: Extract userId from JWT token
            Long currentUserId = 1L; // Hardcoded for testing
            
            log.info("Getting friends locations for user {}", currentUserId);
            
            List<LocationResponse> locations = locationService.getFriendsLocations(currentUserId);
            
            return ResponseEntity.ok(ApiResponse.<List<LocationResponse>>builder()
                .success(true)
                .message("Friends locations retrieved successfully")
                .data(locations)
                .build());
                
        } catch (Exception e) {
            log.error("Error getting friends locations", e);
            return ResponseEntity.badRequest().body(ApiResponse.<List<LocationResponse>>builder()
                .success(false)
                .message("Failed to get friends locations: " + e.getMessage())
                .build());
        }
    }
    
    /**
     * GET /api/locations/{userId} - Get specific user's latest location
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<LocationResponse>> getUserLocation(
        @PathVariable Long userId
    ) {
        try {
            log.info("Getting location for user {}", userId);
            
            LocationResponse location = locationService.getLatestLocation(userId);
            
            return ResponseEntity.ok(ApiResponse.<LocationResponse>builder()
                .success(true)
                .message("Location retrieved successfully")
                .data(location)
                .build());
                
        } catch (Exception e) {
            log.error("Error getting user location", e);
            return ResponseEntity.badRequest().body(ApiResponse.<LocationResponse>builder()
                .success(false)
                .message("Failed to get location: " + e.getMessage())
                .build());
        }
    }
    
    /**
     * GET /api/locations/{userId}/history - Get user's location history
     */
    @GetMapping("/{userId}/history")
    public ResponseEntity<ApiResponse<List<LocationResponse>>> getLocationHistory(
        @PathVariable Long userId,
        @RequestParam(required = false) String startTime,
        @RequestParam(required = false) String endTime
    ) {
        try {
            LocalDateTime start = startTime != null 
                ? LocalDateTime.parse(startTime) 
                : LocalDateTime.now().minusDays(1);
            LocalDateTime end = endTime != null 
                ? LocalDateTime.parse(endTime) 
                : LocalDateTime.now();
            
            log.info("Getting location history for user {} from {} to {}", userId, start, end);
            
            List<LocationResponse> history = locationService.getLocationHistory(userId, start, end);
            
            return ResponseEntity.ok(ApiResponse.<List<LocationResponse>>builder()
                .success(true)
                .message("Location history retrieved successfully")
                .data(history)
                .build());
                
        } catch (Exception e) {
            log.error("Error getting location history", e);
            return ResponseEntity.badRequest().body(ApiResponse.<List<LocationResponse>>builder()
                .success(false)
                .message("Failed to get location history: " + e.getMessage())
                .build());
        }
    }
}
