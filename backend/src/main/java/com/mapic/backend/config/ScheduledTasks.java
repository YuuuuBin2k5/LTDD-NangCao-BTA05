package com.mapic.backend.config;

import com.mapic.backend.services.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {
    
    @Autowired
    private OtpService otpService;
    
    // Tạm thời comment scheduled task để tránh lỗi
    // @Scheduled(fixedRate = 3600000) // 1 hour = 3600000 milliseconds
    public void cleanupExpiredOtps() {
        System.out.println("Running scheduled OTP cleanup...");
        otpService.cleanupExpiredOtps();
        System.out.println("OTP cleanup completed.");
    }
}