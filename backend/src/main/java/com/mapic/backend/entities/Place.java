package com.mapic.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "places", indexes = {
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_lat_lng", columnList = "latitude,longitude")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 50)
    private String category; // restaurant, cafe, park, hospital, gas_station, etc.

    @Column(length = 500)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 20)
    private String phone;

    @Column(length = 500)
    private String description;

    private String imageUrl;

    private Double rating;

    @Column(length = 200)
    private String openingHours;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
