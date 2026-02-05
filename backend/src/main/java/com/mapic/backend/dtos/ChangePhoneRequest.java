package com.mapic.backend.dtos;

import lombok.Data;

@Data
public class ChangePhoneRequest {
    private String newPhone;
    private String otp;
}
