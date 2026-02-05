package com.mapic.backend.repositories;

import com.mapic.backend.entities.OtpCode;
import com.mapic.backend.enums.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpCode, Long> {
    
    // Tìm OTP hợp lệ (chưa sử dụng và chưa hết hạn)
    Optional<OtpCode> findByUserEmailAndOtpTypeAndIsUsedFalseAndExpiresAtAfter(
        String userEmail, 
        OtpType otpType, 
        LocalDateTime now
    );
    
    // Tìm OTP theo email, code và type
    Optional<OtpCode> findByUserEmailAndOtpCodeAndOtpTypeAndIsUsedFalseAndExpiresAtAfter(
        String userEmail,
        String otpCode,
        OtpType otpType,
        LocalDateTime now
    );
    
    // Xóa OTP đã hết hạn
    @Modifying
    @Transactional
    void deleteByExpiresAtBefore(LocalDateTime expiredTime);
    
    // Đếm số OTP được tạo trong khoảng thời gian (để rate limiting)
    int countByUserEmailAndCreatedAtAfter(String userEmail, LocalDateTime since);
    
    // Vô hiệu hóa tất cả OTP cũ của user cho type cụ thể
    @Modifying
    @Transactional
    @Query("UPDATE OtpCode o SET o.isUsed = true, o.usedAt = :now WHERE o.userEmail = :email AND o.otpType = :type AND o.isUsed = false")
    void invalidateOldOtps(@Param("email") String email, @Param("type") OtpType type, @Param("now") LocalDateTime now);

    // Delete OTP by email and type
    @Modifying
    @Transactional
    void deleteByUserEmailAndOtpType(String userEmail, OtpType otpType);
}
