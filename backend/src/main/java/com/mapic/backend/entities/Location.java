package com.mapic.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "locations", indexes = {
    @Index(name = "idx_user_timestamp", columnList = "user_id,timestamp")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private Double speed;
    
    private Double heading;
    
    private Double accuracy;

    @Column(length = 50)
    private String status; // stationary, walking, biking, driving, etc.

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
