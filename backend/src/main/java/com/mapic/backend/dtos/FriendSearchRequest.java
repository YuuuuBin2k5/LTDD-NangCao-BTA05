package com.mapic.backend.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendSearchRequest {
    private String query; // search by name or email
    private String status; // ONLINE, OFFLINE, ALL
    private String activityStatus; // walking, biking, driving, stationary
    private Double maxDistance; // in meters (e.g., 1000, 5000, 10000)
    private Double userLatitude;
    private Double userLongitude;
}
