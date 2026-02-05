package com.mapic.backend.controllers;

import com.mapic.backend.dtos.*;
import com.mapic.backend.entities.User;
import com.mapic.backend.services.UserService;
import com.mapic.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    /**
     * Get current user profile
     * GET /api/v1/users/me
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(
        @RequestHeader("Authorization") String authHeader
    ) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            User user = userService.getUserById(userId);
            
            // Don't send password
            user.setPassword(null);
            
            return ResponseEntity.ok(
                ApiResponse.successWithData("Lấy thông tin thành công", user)
            );
        } catch (Exception e) {
            log.error("Get current user error:", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Update profile (name, avatar)
     * PUT /api/v1/users/profile
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody UpdateProfileRequest request
    ) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            User updatedUser = userService.updateProfile(userId, request);
            
            // Don't send password
            updatedUser.setPassword(null);
            
            return ResponseEntity.ok(
                ApiResponse.successWithData("Cập nhật thông tin thành công", updatedUser)
            );
        } catch (Exception e) {
            log.error("Update profile error:", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Change password
     * PUT /api/v1/users/password
     */
    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody ChangePasswordRequest request
    ) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            String message = userService.changePassword(userId, request);
            
            return ResponseEntity.ok(ApiResponse.success(message));
        } catch (Exception e) {
            log.error("Change password error:", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Send OTP for email/phone change
     * POST /api/v1/users/send-change-otp
     */
    @PostMapping("/send-change-otp")
    public ResponseEntity<ApiResponse<Void>> sendChangeOtp(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody SendOtpRequest request
    ) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            String message = userService.sendChangeOtp(userId, request);
            
            return ResponseEntity.ok(ApiResponse.success(message));
        } catch (Exception e) {
            log.error("Send change OTP error:", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Change email with OTP
     * PUT /api/v1/users/email
     */
    @PutMapping("/email")
    public ResponseEntity<ApiResponse<Void>> changeEmail(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody ChangeEmailRequest request
    ) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            String message = userService.changeEmail(userId, request);
            
            return ResponseEntity.ok(ApiResponse.success(message));
        } catch (Exception e) {
            log.error("Change email error:", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Change phone with OTP
     * PUT /api/v1/users/phone
     */
    @PutMapping("/phone")
    public ResponseEntity<ApiResponse<Void>> changePhone(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody ChangePhoneRequest request
    ) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            String message = userService.changePhone(userId, request);
            
            return ResponseEntity.ok(ApiResponse.success(message));
        } catch (Exception e) {
            log.error("Change phone error:", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Helper method to extract user ID from JWT token
     */
    private Long getUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token không hợp lệ");
        }
        
        String token = authHeader.substring(7);
        
        try {
            // Extract user ID directly from token
            Long userId = jwtUtil.extractUserId(token);
            if (userId == null) {
                throw new RuntimeException("Token không hợp lệ");
            }
            return userId;
        } catch (Exception e) {
            log.error("Extract user ID error:", e);
            throw new RuntimeException("Token không hợp lệ");
        }
    }
}
