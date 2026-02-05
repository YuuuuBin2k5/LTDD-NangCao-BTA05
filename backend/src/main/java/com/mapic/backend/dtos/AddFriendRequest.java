package com.mapic.backend.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddFriendRequest {
    private String email; // or phone
}
