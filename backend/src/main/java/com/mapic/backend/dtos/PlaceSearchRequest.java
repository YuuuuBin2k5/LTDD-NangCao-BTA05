package com.mapic.backend.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceSearchRequest {
    private String query;
    private String category; // restaurant, cafe, park, hospital, gas_station
    private Double latitude;
    private Double longitude;
    private Double radius; // in meters (default 5000)
}
