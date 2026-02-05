package com.mapic.backend.services;

import com.mapic.backend.entities.OtpCode;
import com.mapic.backend.enums.OtpType;
import com.mapic.backend.repositories.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {
    
    @Autowired
    private OtpRepository otpRepository;
    
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_OTP_PER_HOUR = 5; // Rate limiting
    
    // Generate và gửi OTP
    public String generateAndSendOtp(String email, OtpType otpType) {
        // Rate limiting check
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        int otpCount = otpRepository.countByUserEmailAndCreatedAtAfter(email, oneHourAgo);
        
        if (otpCount >= MAX_OTP_PER_HOUR) {
            throw new RuntimeException("Đã vượt quá giới hạn gửi OTP. Vui lòng thử lại sau 1 giờ.");
        }
        
        // Vô hiệu hóa tất cả OTP cũ của user cho type này
        otpRepository.invalidateOldOtps(email, otpType, LocalDateTime.now());
        
        // Generate OTP code
        String otpCode = generateOtpCode();
        
        // Tạo OTP entity
        OtpCode otp = new OtpCode();
        otp.setUserEmail(email);
        otp.setOtpCode(otpCode);
        otp.setOtpType(otpType);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        
        // Lưu vào database
        otpRepository.save(otp);
        
        // Log OTP thay vì gửi email (để test)
        System.out.println("=== OTP GENERATED ===");
        System.out.println("Email: " + email);
        System.out.println("OTP Code: " + otpCode);
        System.out.println("Type: " + otpType);
        System.out.println("Expires: " + otp.getExpiresAt());
        System.out.println("====================");
        
        return "OTP đã được tạo và hiển thị trong console";
    }
    
    // Verify OTP (đánh dấu đã sử dụng)
    public boolean verifyOtp(String email, String otpCode, OtpType otpType) {
        Optional<OtpCode> otpOpt = otpRepository.findByUserEmailAndOtpCodeAndOtpTypeAndIsUsedFalseAndExpiresAtAfter(
            email, otpCode, otpType, LocalDateTime.now()
        );
        
        if (otpOpt.isPresent()) {
            OtpCode otp = otpOpt.get();
            otp.markAsUsed();
            otpRepository.save(otp);
            return true;
        }
        
        return false;
    }
    
    // Check OTP (KHÔNG đánh dấu đã sử dụng - dùng cho verify-otp endpoint)
    public boolean checkOtpValid(String email, String otpCode, OtpType otpType) {
        Optional<OtpCode> otpOpt = otpRepository.findByUserEmailAndOtpCodeAndOtpTypeAndIsUsedFalseAndExpiresAtAfter(
            email, otpCode, otpType, LocalDateTime.now()
        );
        
        return otpOpt.isPresent();
    }
    
    // Generate random OTP code
    private String generateOtpCode() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        
        return otp.toString();
    }
    
    // Cleanup expired OTPs (scheduled job)
    public void cleanupExpiredOtps() {
        otpRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }

    /**
     * Generate OTP (without sending email - for phone OTP)
     * Returns the OTP code for manual sending via SMS
     */
    public String generateOtp(String identifier, OtpType otpType) {
        // Rate limiting check
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        int otpCount = otpRepository.countByUserEmailAndCreatedAtAfter(identifier, oneHourAgo);
        
        if (otpCount >= MAX_OTP_PER_HOUR) {
            throw new RuntimeException("Đã vượt quá giới hạn gửi OTP. Vui lòng thử lại sau 1 giờ.");
        }
        
        // Invalidate old OTPs
        otpRepository.invalidateOldOtps(identifier, otpType, LocalDateTime.now());
        
        // Generate OTP code
        String otpCode = generateOtpCode();
        
        // Create OTP entity
        OtpCode otp = new OtpCode();
        otp.setUserEmail(identifier); // Can be email or phone
        otp.setOtpCode(otpCode);
        otp.setOtpType(otpType);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        
        // Save to database
        otpRepository.save(otp);
        
        // Log OTP for testing
        System.out.println("=== OTP GENERATED ===");
        System.out.println("Identifier: " + identifier);
        System.out.println("OTP Code: " + otpCode);
        System.out.println("Type: " + otpType);
        System.out.println("Expires: " + otp.getExpiresAt());
        System.out.println("====================");
        
        return otpCode;
    }
    
    /**
     * Delete OTP after successful verification
     */
    public void deleteOtp(String identifier, OtpType otpType) {
        otpRepository.deleteByUserEmailAndOtpType(identifier, otpType);
    }
}
