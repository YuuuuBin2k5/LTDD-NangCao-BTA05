package com.mapic.backend.dtos;

import lombok.Data;

@Data
public class VerifyOtpRequest {
    private String email;
    private String otp;
}
