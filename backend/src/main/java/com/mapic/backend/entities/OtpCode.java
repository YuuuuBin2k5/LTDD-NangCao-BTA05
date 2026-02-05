package com.mapic.backend.entities;

import com.mapic.backend.enums.OtpType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_codes", indexes = {
    @Index(name = "idx_email_type", columnList = "userEmail, otpType"),
    @Index(name = "idx_expires_at", columnList = "expiresAt"),
    @Index(name = "idx_created_at", columnList = "createdAt")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtpCode {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_email", nullable = false)
    private String userEmail;
    
    @Column(name = "otp_code", length = 6, nullable = false)
    private String otpCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "otp_type", nullable = false)
    private OtpType otpType;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(name = "is_used")
    private Boolean isUsed = false;
    
    @Column(name = "used_at")
    private LocalDateTime usedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (expiresAt == null) {
            expiresAt = createdAt.plusMinutes(5); // Default 5 minutes expiry
        }
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
    
    public boolean isValid() {
        return !isUsed && !isExpired();
    }
    
    public void markAsUsed() {
        this.isUsed = true;
        this.usedAt = LocalDateTime.now();
    }
}