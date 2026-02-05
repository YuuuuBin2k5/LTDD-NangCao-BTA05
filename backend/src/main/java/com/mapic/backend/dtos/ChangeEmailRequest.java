package com.mapic.backend.dtos;

import lombok.Data;

@Data
public class ChangeEmailRequest {
    private String newEmail;
    private String otp;
}
