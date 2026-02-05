package com.mapic.backend.dtos;

import lombok.Data;

@Data
public class SendOtpRequest {
    private String email;
    private String phone;
    private String type; // "email" or "phone"
}
