package com.mapic.backend.dtos;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String avatarUrl;
    private String status; // ONLINE, OFFLINE, AWAY
    private String activityStatus; // stationary, walking, biking, driving
    private Double latitude;
    private Double longitude;
    private Double distance; // distance from current user in meters
    private String lastSeen;
    private List<LocationHistoryItem> locationHistory;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LocationHistoryItem {
        private Double latitude;
        private Double longitude;
        private String status;
        private String timestamp;
    }
}
