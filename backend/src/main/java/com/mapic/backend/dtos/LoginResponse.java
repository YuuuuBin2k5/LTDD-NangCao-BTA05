package com.mapic.backend.dtos;

import com.mapic.backend.entities.User;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private User user;
}