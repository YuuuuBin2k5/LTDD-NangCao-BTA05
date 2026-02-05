package com.mapic.backend.dtos;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PopularPlaceResponse {
    private Long id;
    private String name;
    private String category;
    private String description;
    private String photoUrl;
    private Double latitude;
    private Double longitude;
    private String address;
    private Double rating;
    private Double distance; // in meters
    private Long checkInCount;
    private Double popularityScore;
}
