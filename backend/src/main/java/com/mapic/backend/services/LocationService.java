package com.mapic.backend.services;

import com.mapic.backend.dtos.LocationRequest;
import com.mapic.backend.dtos.LocationResponse;
import com.mapic.backend.entities.Location;
import com.mapic.backend.entities.User;
import com.mapic.backend.repositories.LocationRepository;
import com.mapic.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationService {
    
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    
    /**
     * Update user's location
     */
    @Transactional
    public LocationResponse updateLocation(Long userId, LocationRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Location location = Location.builder()
            .user(user)
            .latitude(request.getLatitude())
            .longitude(request.getLongitude())
            .speed(request.getSpeed())
            .heading(request.getHeading())
            .accuracy(request.getAccuracy())
            .status(request.getStatus() != null ? request.getStatus() : "stationary")
            .timestamp(request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now())
            .build();
        
        location = locationRepository.save(location);
        log.info("Updated location for user {}: lat={}, lng={}", userId, location.getLatitude(), location.getLongitude());
        
        return mapToResponse(location);
    }
    
    /**
     * Get latest location for a user
     */
    public LocationResponse getLatestLocation(Long userId) {
        Location location = locationRepository.findLatestByUserId(userId)
            .orElseThrow(() -> new RuntimeException("No location found for user"));
        
        return mapToResponse(location);
    }
    
    /**
     * Get latest locations for all friends (mock - will integrate with friends service later)
     * For now, returns latest locations for all active users
     */
    public List<LocationResponse> getFriendsLocations(Long currentUserId) {
        // TODO: Integrate with FriendService to get actual friends list
        // For now, get all users except current user
        List<User> allUsers = userRepository.findAll().stream()
            .filter(u -> !u.getId().equals(currentUserId) && u.getActive())
            .collect(Collectors.toList());
        
        List<Long> userIds = allUsers.stream()
            .map(User::getId)
            .collect(Collectors.toList());
        
        if (userIds.isEmpty()) {
            return List.of();
        }
        
        List<Location> locations = locationRepository.findLatestLocationsByUserIds(userIds);
        
        return locations.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * Get location history for a user
     */
    public List<LocationResponse> getLocationHistory(Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Location> locations = locationRepository.findByUserAndTimestampBetweenOrderByTimestampDesc(
            user, startTime, endTime
        );
        
        return locations.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * Cleanup old locations (older than 30 days)
     */
    @Transactional
    public void cleanupOldLocations() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusDays(30);
        locationRepository.deleteByTimestampBefore(cutoffTime);
        log.info("Cleaned up locations older than {}", cutoffTime);
    }
    
    /**
     * Map Location entity to LocationResponse DTO
     */
    private LocationResponse mapToResponse(Location location) {
        return LocationResponse.builder()
            .userId(location.getUser().getId())
            .userName(location.getUser().getFullName())
            .userAvatar(location.getUser().getAvatarUrl())
            .latitude(location.getLatitude())
            .longitude(location.getLongitude())
            .speed(location.getSpeed())
            .heading(location.getHeading())
            .accuracy(location.getAccuracy())
            .status(location.getStatus())
            .timestamp(location.getTimestamp())
            .build();
    }
}
