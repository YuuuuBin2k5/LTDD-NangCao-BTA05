package com.mapic.backend.services;

import com.mapic.backend.dtos.*;
import com.mapic.backend.entities.User;
import com.mapic.backend.enums.OtpType;
import com.mapic.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final EmailService emailService;
    
    /**
     * Get user profile by ID
     */
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    /**
     * Get user by email
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    /**
     * Update user profile (name, avatar)
     */
    @Transactional
    public User updateProfile(Long userId, UpdateProfileRequest request) {
        User user = getUserById(userId);
        
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }
        
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        
        return userRepository.save(user);
    }

    /**
     * Change password
     */
    @Transactional
    public String changePassword(Long userId, ChangePasswordRequest request) {
        User user = getUserById(userId);
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng");
        }
        
        // Validate new password
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new RuntimeException("Mật khẩu mới phải có ít nhất 6 ký tự");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        return "Đổi mật khẩu thành công";
    }
    
    /**
     * Send OTP for email/phone change
     */
    public String sendChangeOtp(Long userId, SendOtpRequest request) {
        User user = getUserById(userId);
        
        if ("email".equals(request.getType())) {
            // Check if email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email đã được sử dụng");
            }
            
            // Generate and send OTP
            String otp = otpService.generateOtp(request.getEmail(), OtpType.CHANGE_EMAIL);
            emailService.sendOtp(request.getEmail(), otp, "Xác thực thay đổi email");
            
            return "Mã OTP đã được gửi đến email: " + request.getEmail();
            
        } else if ("phone".equals(request.getType())) {
            // Check if phone already exists
            if (request.getPhone() != null && userRepository.findByPhone(request.getPhone()).isPresent()) {
                throw new RuntimeException("Số điện thoại đã được sử dụng");
            }
            
            // Generate OTP (SMS sending would be implemented here)
            String otp = otpService.generateOtp(request.getPhone(), OtpType.CHANGE_PHONE);
            log.info("OTP for phone {}: {}", request.getPhone(), otp);
            
            // TODO: Integrate SMS service (Twilio, AWS SNS, etc.)
            return "Mã OTP đã được gửi đến số điện thoại: " + request.getPhone();
            
        } else {
            throw new RuntimeException("Loại OTP không hợp lệ");
        }
    }
    
    /**
     * Change email with OTP verification
     */
    @Transactional
    public String changeEmail(Long userId, ChangeEmailRequest request) {
        User user = getUserById(userId);
        
        // Verify OTP
        if (!otpService.verifyOtp(request.getNewEmail(), request.getOtp(), OtpType.CHANGE_EMAIL)) {
            throw new RuntimeException("Mã OTP không hợp lệ hoặc đã hết hạn");
        }
        
        // Check if email already exists
        if (userRepository.findByEmail(request.getNewEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        
        // Update email
        user.setEmail(request.getNewEmail());
        userRepository.save(user);
        
        // Delete used OTP
        otpService.deleteOtp(request.getNewEmail(), OtpType.CHANGE_EMAIL);
        
        return "Thay đổi email thành công";
    }
    
    /**
     * Change phone with OTP verification
     */
    @Transactional
    public String changePhone(Long userId, ChangePhoneRequest request) {
        User user = getUserById(userId);
        
        // Verify OTP
        if (!otpService.verifyOtp(request.getNewPhone(), request.getOtp(), OtpType.CHANGE_PHONE)) {
            throw new RuntimeException("Mã OTP không hợp lệ hoặc đã hết hạn");
        }
        
        // Check if phone already exists
        if (userRepository.findByPhone(request.getNewPhone()).isPresent()) {
            throw new RuntimeException("Số điện thoại đã được sử dụng");
        }
        
        // Update phone
        user.setPhone(request.getNewPhone());
        userRepository.save(user);
        
        // Delete used OTP
        otpService.deleteOtp(request.getNewPhone(), OtpType.CHANGE_PHONE);
        
        return "Thay đổi số điện thoại thành công";
    }
}
