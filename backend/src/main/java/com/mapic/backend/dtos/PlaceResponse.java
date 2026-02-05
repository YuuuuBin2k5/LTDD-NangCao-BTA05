package com.mapic.backend.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceResponse {
    private Long id;
    private String name;
    private String category;
    private String address;
    private Double latitude;
    private Double longitude;
    private String phone;
    private String description;
    private String imageUrl;
    private Double rating;
    private String openingHours;
    private Double distance; // distance from user in meters
}
