package com.mapic.backend.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LocationRequest {
    private Long userId; // Optional - for testing without JWT
    private Double latitude;
    private Double longitude;
    private Double speed;
    private Double heading;
    private Double accuracy;
    private String status;
    private LocalDateTime timestamp;
}
