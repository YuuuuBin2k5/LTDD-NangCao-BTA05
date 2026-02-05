package com.mapic.backend.controllers;

import com.mapic.backend.dtos.*;
import com.mapic.backend.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired 
    private AuthService authService;

    // ĐĂNG KÝ VỚI OTP
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody RegisterRequest req) {
        try {
            String result = authService.register(req);
            if (result.contains("thành công")) {
                return ResponseEntity.ok(ApiResponse.success(result));
            }
            return ResponseEntity.badRequest().body(ApiResponse.error(result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Lỗi server: " + e.getMessage()));
        }
    }
    
    // KÍCH HOẠT TÀI KHOẢN
    @PostMapping("/activate")
    public ResponseEntity<ApiResponse<Void>> activateAccount(@RequestBody ActivateRequest req) {
        try {
            String result = authService.activateAccount(req);
            if (result.contains("thành công")) {
                return ResponseEntity.ok(ApiResponse.success(result));
            }
            return ResponseEntity.badRequest().body(ApiResponse.error(result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Lỗi server: " + e.getMessage()));
        }
    }
    
    // RESEND ACTIVATION OTP
    @PostMapping("/resend-activation")
    public ResponseEntity<ApiResponse<Void>> resendActivationOtp(@RequestBody EmailRequest req) {
        try {
            String result = authService.resendActivationOtp(req);
            // Check lỗi trước (rate limit, không thể gửi)
            if (result.contains("Không thể") || result.contains("vượt quá") || result.contains("giới hạn")) {
                return ResponseEntity.badRequest().body(ApiResponse.error(result));
            }
            // Check thành công: "đã được gửi" hoặc "đã được tạo"
            if (result.contains("đã được gửi") || result.contains("đã được tạo")) {
                return ResponseEntity.ok(ApiResponse.success(result));
            }
            return ResponseEntity.badRequest().body(ApiResponse.error(result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Lỗi server: " + e.getMessage()));
        }
    }

    // ĐĂNG NHẬP VỚI JWT
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginData>> login(@RequestBody LoginRequest req) {
        try {
            LoginResponse response = authService.login(req);
            LoginData loginData = new LoginData(response.getToken(), response.getUser());
            return ResponseEntity.ok(ApiResponse.successWithData("Đăng nhập thành công", loginData));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody EmailRequest req) {
        try {
            String result = authService.forgotPassword(req);
            // Check lỗi trước (rate limit, không thể gửi)
            if (result.contains("Không thể") || result.contains("vượt quá") || result.contains("giới hạn")) {
                return ResponseEntity.badRequest().body(ApiResponse.error(result));
            }
            // Check thành công: "đã được gửi" hoặc "đã được tạo"
            if (result.contains("đã được gửi") || result.contains("đã được tạo")) {
                return ResponseEntity.ok(ApiResponse.success(result));
            }
            return ResponseEntity.badRequest().body(ApiResponse.error(result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Lỗi server: " + e.getMessage()));
        }
    }
    
    // RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody ResetPasswordRequest req) {
        try {
            String result = authService.resetPassword(req);
            if (result.contains("thành công")) {
                return ResponseEntity.ok(ApiResponse.success(result));
            }
            return ResponseEntity.badRequest().body(ApiResponse.error(result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Lỗi server: " + e.getMessage()));
        }
    }
    
    // VERIFY OTP (Optional - để kiểm tra OTP trước khi reset)
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@RequestBody VerifyOtpRequest req) {
        try {
            // Sử dụng lại logic verify OTP
            boolean isValid = authService.verifyResetOtp(req.getEmail(), req.getOtp());
            if (isValid) {
                return ResponseEntity.ok(ApiResponse.success("Mã OTP hợp lệ"));
            }
            return ResponseEntity.badRequest().body(ApiResponse.error("Mã OTP không hợp lệ hoặc đã hết hạn"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Lỗi server: " + e.getMessage()));
        }
    }
    
    // Inner class for login data
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class LoginData {
        private String accessToken;
        private com.mapic.backend.entities.User user;
    }
}