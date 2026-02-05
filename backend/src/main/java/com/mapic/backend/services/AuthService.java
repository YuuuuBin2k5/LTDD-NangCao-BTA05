package com.mapic.backend.services;

import com.mapic.backend.dtos.*;
import com.mapic.backend.entities.User;
import com.mapic.backend.enums.OtpType;
import com.mapic.backend.repositories.UserRepository;
import com.mapic.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired 
    private UserRepository userRepository;
    
    @Autowired
    private OtpService otpService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    // ĐĂNG KÝ VỚI OTP ACTIVATION
    public String register(RegisterRequest req) {
        // 1. Kiểm tra email tồn tại
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return "Email đã tồn tại!";
        }

        // 2. Tạo User mới (chưa kích hoạt)
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword())); // Mã hóa mật khẩu
        user.setFullName(req.getFullName());
        user.setActive(false); // Chưa kích hoạt
        
        userRepository.save(user);
        
        // 3. Gửi OTP kích hoạt
        try {
            otpService.generateAndSendOtp(req.getEmail(), OtpType.REGISTER);
            return "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.";
        } catch (Exception e) {
            return "Đăng ký thành công nhưng không thể gửi email kích hoạt: " + e.getMessage();
        }
    }
    
    // KÍCH HOẠT TÀI KHOẢN
    public String activateAccount(ActivateRequest req) {
        // 1. Kiểm tra user tồn tại
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail());
        if (!userOpt.isPresent()) {
            return "Email không tồn tại!";
        }
        
        User user = userOpt.get();
        if (user.getActive()) {
            return "Tài khoản đã được kích hoạt trước đó!";
        }
        
        // 2. Verify OTP
        boolean isValidOtp = otpService.verifyOtp(req.getEmail(), req.getOtp(), OtpType.REGISTER);
        if (!isValidOtp) {
            return "Mã OTP không hợp lệ hoặc đã hết hạn!";
        }
        
        // 3. Kích hoạt tài khoản
        user.setActive(true);
        userRepository.save(user);
        
        return "Tài khoản đã được kích hoạt thành công!";
    }
    
    // RESEND ACTIVATION OTP
    public String resendActivationOtp(EmailRequest req) {
        // 1. Kiểm tra user tồn tại
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail());
        if (!userOpt.isPresent()) {
            return "Email không tồn tại!";
        }
        
        User user = userOpt.get();
        if (user.getActive()) {
            return "Tài khoản đã được kích hoạt!";
        }
        
        // 2. Gửi OTP mới
        try {
            return otpService.generateAndSendOtp(req.getEmail(), OtpType.REGISTER);
        } catch (Exception e) {
            return "Không thể gửi mã OTP: " + e.getMessage();
        }
    }

    // ĐĂNG NHẬP VỚI JWT
    public LoginResponse login(LoginRequest req) {
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail());
        
        // Kiểm tra user tồn tại và mật khẩu đúng
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Kiểm tra mật khẩu
            if (passwordEncoder.matches(req.getPassword(), user.getPassword())) {
                // Kiểm tra tài khoản đã kích hoạt
                if (!user.getActive()) {
                    throw new RuntimeException("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email!");
                }
                
                // Generate JWT token
                String token = jwtUtil.generateToken(user.getEmail(), user.getFullName(), user.getId());
                
                return new LoginResponse(token, user);
            }
        }
        
        throw new RuntimeException("Sai email hoặc mật khẩu!");
    }
    
    // FORGOT PASSWORD
    public String forgotPassword(EmailRequest req) {
        // 1. Kiểm tra user tồn tại
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail());
        if (!userOpt.isPresent()) {
            return "Email không tồn tại!";
        }
        
        User user = userOpt.get();
        if (!user.getActive()) {
            return "Tài khoản chưa được kích hoạt!";
        }
        
        // 2. Gửi OTP reset password
        try {
            return otpService.generateAndSendOtp(req.getEmail(), OtpType.FORGOT_PASSWORD);
        } catch (Exception e) {
            return "Không thể gửi mã OTP: " + e.getMessage();
        }
    }
    
    // RESET PASSWORD
    public String resetPassword(ResetPasswordRequest req) {
        // 1. Kiểm tra user tồn tại
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail());
        if (!userOpt.isPresent()) {
            return "Email không tồn tại!";
        }
        
        User user = userOpt.get();
        if (!user.getActive()) {
            return "Tài khoản chưa được kích hoạt!";
        }
        
        // 2. Verify OTP
        boolean isValidOtp = otpService.verifyOtp(req.getEmail(), req.getOtp(), OtpType.FORGOT_PASSWORD);
        if (!isValidOtp) {
            return "Mã OTP không hợp lệ hoặc đã hết hạn!";
        }
        
        // 3. Đặt lại mật khẩu
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        
        return "Mật khẩu đã được đặt lại thành công!";
    }
    
    // VERIFY RESET OTP (Helper method - CHỈ CHECK, KHÔNG đánh dấu đã sử dụng)
    public boolean verifyResetOtp(String email, String otp) {
        return otpService.checkOtpValid(email, otp, OtpType.FORGOT_PASSWORD);
    }
}