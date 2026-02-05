package com.mapic.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/setup")
@RequiredArgsConstructor
public class DatabaseSetupController {
    
    private final JdbcTemplate jdbcTemplate;
    
    @PostMapping("/create-checkins-table")
    public ResponseEntity<Map<String, Object>> createCheckInsTable() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Create table
            jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS place_checkins (" +
                "id BIGSERIAL PRIMARY KEY, " +
                "place_id BIGINT NOT NULL REFERENCES places(id) ON DELETE CASCADE, " +
                "user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, " +
                "checked_in_at TIMESTAMP DEFAULT NOW(), " +
                "created_at TIMESTAMP DEFAULT NOW())"
            );
            
            // Create indexes
            jdbcTemplate.execute(
                "CREATE INDEX IF NOT EXISTS idx_place_checkins_place ON place_checkins(place_id)"
            );
            jdbcTemplate.execute(
                "CREATE INDEX IF NOT EXISTS idx_place_checkins_user ON place_checkins(user_id)"
            );
            jdbcTemplate.execute(
                "CREATE INDEX IF NOT EXISTS idx_place_checkins_date ON place_checkins(checked_in_at)"
            );
            
            result.put("success", true);
            result.put("message", "place_checkins table created successfully!");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }
}
