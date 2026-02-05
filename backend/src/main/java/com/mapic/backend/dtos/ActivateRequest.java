package com.mapic.backend.dtos;

import lombok.Data;

@Data
public class ActivateRequest {
    private String email;
    private String otp;
}