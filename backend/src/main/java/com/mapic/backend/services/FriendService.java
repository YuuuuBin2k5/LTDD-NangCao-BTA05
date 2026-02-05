package com.mapic.backend.services;

import com.mapic.backend.dtos.*;
import com.mapic.backend.entities.*;
import com.mapic.backend.enums.FriendshipStatus;
import com.mapic.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendService {
    
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional(readOnly = true)
    public List<FriendResponse> searchFriends(Long userId, FriendSearchRequest request) {
        try {
            System.out.println("[FriendService] Searching friends for user: " + userId);
            
            // Get all accepted friendships
            List<Friendship> friendships = friendshipRepository.findByUserIdAndStatus(userId, FriendshipStatus.ACCEPTED);
            
            System.out.println("[FriendService] Found " + friendships.size() + " friendships");
            
            if (friendships.isEmpty()) {
                // No friends yet, return empty list
                return new ArrayList<>();
            }
            
            List<FriendResponse> friends = new ArrayList<>();
            
            for (Friendship friendship : friendships) {
                try {
                    User friend = friendship.getUser().getId().equals(userId) 
                        ? friendship.getFriend() 
                        : friendship.getUser();
                    
                    System.out.println("[FriendService] Processing friend: " + friend.getId());
                    
                    // Get latest location
                    Optional<Location> latestLocation = locationRepository
                        .findTopByUserOrderByTimestampDesc(friend);
                    
                    if (!latestLocation.isPresent()) {
                        System.out.println("[FriendService] No location for friend: " + friend.getId());
                        // Skip friends without location data
                        continue;
                    }
                    
                    Location loc = latestLocation.get();
                    
                    System.out.println("[FriendService] Friend " + friend.getId() + " location: " + loc.getLatitude() + ", " + loc.getLongitude());
                    
                    // Apply filters
                    if (!matchesFilters(friend, loc, request)) {
                        continue;
                    }
                    
                    // Calculate distance if user location provided
                    Double distance = null;
                    if (request.getUserLatitude() != null && request.getUserLongitude() != null) {
                        distance = calculateDistance(
                            request.getUserLatitude(), request.getUserLongitude(),
                            loc.getLatitude(), loc.getLongitude()
                        );
                        
                        // Filter by max distance
                        if (request.getMaxDistance() != null && distance > request.getMaxDistance()) {
                            continue;
                        }
                    }
                    
                    FriendResponse response = FriendResponse.builder()
                        .id(friend.getId())
                        .fullName(friend.getFullName())
                        .email(friend.getEmail())
                        .phone(friend.getPhone())
                        .avatarUrl(friend.getAvatarUrl())
                        .status(determineUserStatus(loc.getTimestamp()))
                        .activityStatus(loc.getStatus())
                        .latitude(loc.getLatitude())
                        .longitude(loc.getLongitude())
                        .distance(distance)
                        .lastSeen(loc.getTimestamp().format(formatter))
                        .build();
                    
                    friends.add(response);
                } catch (Exception e) {
                    // Skip this friend if any error
                    System.err.println("Error processing friend: " + e.getMessage());
                    continue;
                }
            }
            
            // Sort by distance if available
            if (request.getUserLatitude() != null && request.getUserLongitude() != null) {
                friends.sort(Comparator.comparing(FriendResponse::getDistance, 
                    Comparator.nullsLast(Comparator.naturalOrder())));
            }
            
            return friends;
        } catch (Exception e) {
            System.err.println("Error in searchFriends: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>(); // Return empty list on error
        }
    }

    private boolean matchesFilters(User friend, Location location, FriendSearchRequest request) {
        // Query filter (name or email)
        if (request.getQuery() != null && !request.getQuery().isEmpty()) {
            String query = request.getQuery().toLowerCase();
            boolean matchesName = friend.getFullName() != null && 
                friend.getFullName().toLowerCase().contains(query);
            boolean matchesEmail = friend.getEmail().toLowerCase().contains(query);
            if (!matchesName && !matchesEmail) {
                return false;
            }
        }
        
        // Status filter (ONLINE/OFFLINE)
        if (request.getStatus() != null && !request.getStatus().equalsIgnoreCase("ALL")) {
            String userStatus = determineUserStatus(location.getTimestamp());
            if (!userStatus.equalsIgnoreCase(request.getStatus())) {
                return false;
            }
        }
        
        // Activity status filter
        if (request.getActivityStatus() != null && !request.getActivityStatus().isEmpty()) {
            if (location.getStatus() == null || 
                !location.getStatus().equalsIgnoreCase(request.getActivityStatus())) {
                return false;
            }
        }
        
        return true;
    }

    private String determineUserStatus(LocalDateTime lastSeen) {
        LocalDateTime now = LocalDateTime.now();
        long minutesSinceLastSeen = java.time.Duration.between(lastSeen, now).toMinutes();
        
        if (minutesSinceLastSeen <= 5) {
            return "ONLINE";
        } else if (minutesSinceLastSeen <= 30) {
            return "AWAY";
        } else {
            return "OFFLINE";
        }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine formula
        final int R = 6371000; // Earth radius in meters
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c; // returns distance in meters
    }

    @Transactional(readOnly = true)
    public FriendProfileResponse getFriendProfile(Long userId, Long friendId, 
                                                   Double userLat, Double userLon) {
        // Verify friendship
        if (!friendshipRepository.areFriends(userId, friendId)) {
            throw new RuntimeException("Not friends with this user");
        }
        
        User friend = userRepository.findById(friendId)
            .orElseThrow(() -> new RuntimeException("Friend not found"));
        
        // Get latest location
        Optional<Location> latestLocation = locationRepository
            .findTopByUserOrderByTimestampDesc(friend);
        
        if (!latestLocation.isPresent()) {
            throw new RuntimeException("Friend location not available");
        }
        
        Location loc = latestLocation.get();
        
        // Calculate distance
        Double distance = null;
        if (userLat != null && userLon != null) {
            distance = calculateDistance(userLat, userLon, loc.getLatitude(), loc.getLongitude());
        }
        
        // Get location history (last 24 hours)
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        List<Location> history = locationRepository.findByUserAndTimestampAfterOrderByTimestampDesc(
            friend, since);
        
        List<FriendProfileResponse.LocationHistoryItem> historyItems = history.stream()
            .map(l -> FriendProfileResponse.LocationHistoryItem.builder()
                .latitude(l.getLatitude())
                .longitude(l.getLongitude())
                .status(l.getStatus())
                .timestamp(l.getTimestamp().format(formatter))
                .build())
            .collect(Collectors.toList());
        
        return FriendProfileResponse.builder()
            .id(friend.getId())
            .fullName(friend.getFullName())
            .email(friend.getEmail())
            .phone(friend.getPhone())
            .avatarUrl(friend.getAvatarUrl())
            .status(determineUserStatus(loc.getTimestamp()))
            .activityStatus(loc.getStatus())
            .latitude(loc.getLatitude())
            .longitude(loc.getLongitude())
            .distance(distance)
            .lastSeen(loc.getTimestamp().format(formatter))
            .locationHistory(historyItems)
            .build();
    }

    @Transactional
    public ApiResponse<Void> addFriend(Long userId, AddFriendRequest request) {
        User friend = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (friend.getId().equals(userId)) {
            throw new RuntimeException("Cannot add yourself as friend");
        }
        
        // Check if already friends or pending
        Optional<Friendship> existing = friendshipRepository.findByUserIdAndFriendId(userId, friend.getId());
        if (existing.isPresent()) {
            throw new RuntimeException("Friend request already exists");
        }
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Friendship friendship = Friendship.builder()
            .user(user)
            .friend(friend)
            .status(FriendshipStatus.PENDING)
            .build();
        
        friendshipRepository.save(friendship);
        
        return ApiResponse.success("Friend request sent");
    }

    @Transactional
    public ApiResponse<Void> acceptFriendRequest(Long userId, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow(() -> new RuntimeException("Friend request not found"));
        
        if (!friendship.getFriend().getId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        
        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship);
        
        return ApiResponse.success("Friend request accepted");
    }

    @Transactional
    public ApiResponse<Void> removeFriend(Long userId, Long friendId) {
        Friendship friendship = friendshipRepository.findByUserIdAndFriendId(userId, friendId)
            .orElseThrow(() -> new RuntimeException("Friendship not found"));
        
        friendshipRepository.delete(friendship);
        
        return ApiResponse.success("Friend removed");
    }
    
    // Discovery Features
    
    @Transactional(readOnly = true)
    public List<FriendResponse> getNearbyFriends(
        Long userId,
        Double userLat,
        Double userLng,
        Integer limit
    ) {
        if (limit == null) limit = 20;
        
        // Get accepted friends using existing search method
        FriendSearchRequest request = new FriendSearchRequest();
        request.setStatus("ACCEPTED");
        request.setUserLatitude(userLat);
        request.setUserLongitude(userLng);
        
        List<FriendResponse> friends = searchFriends(userId, request);
        
        // Filter out friends without location
        List<FriendResponse> nearbyFriends = friends.stream()
            .filter(f -> f.getLatitude() != null && f.getLongitude() != null && f.getDistance() != null)
            .collect(Collectors.toList());
        
        // Already sorted by distance in searchFriends
        
        // Return top N
        return nearbyFriends.stream().limit(limit).collect(Collectors.toList());
    }
}
