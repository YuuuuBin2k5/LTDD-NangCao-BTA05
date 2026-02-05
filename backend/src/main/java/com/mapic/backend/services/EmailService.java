package com.mapic.backend.services;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    public void sendEmail(String to, String subject, String body) {
        // Tạm thời log email thay vì gửi thật
        System.out.println("=== EMAIL SENT ===");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Body: " + body);
        System.out.println("==================");
    }

    /**
     * Send OTP email
     */
    public void sendOtp(String to, String otpCode, String purpose) {
        String subject = "MAPIC - Mã xác thực OTP";
        String body = String.format(
            "Xin chào,\n\n" +
            "Mã OTP của bạn cho %s là: %s\n\n" +
            "Mã này sẽ hết hạn sau 5 phút.\n\n" +
            "Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.\n\n" +
            "Trân trọng,\n" +
            "MAPIC Team",
            purpose,
            otpCode
        );
        
        sendEmail(to, subject, body);
    }
}
