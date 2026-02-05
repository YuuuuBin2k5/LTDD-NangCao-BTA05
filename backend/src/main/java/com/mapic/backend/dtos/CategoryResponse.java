package com.mapic.backend.dtos;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private String name;
    private String icon;
    private Long count;
}
