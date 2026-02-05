package com.mapic.backend.entities;

import com.mapic.backend.enums.FriendshipStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "friendships", 
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "friend_id"}),
    indexes = {
        @Index(name = "idx_user_status", columnList = "user_id,status"),
        @Index(name = "idx_friend_status", columnList = "friend_id,status")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "friend_id", nullable = false)
    private User friend;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private FriendshipStatus status = FriendshipStatus.PENDING;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
