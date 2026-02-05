package com.mapic.backend.controllers;

import com.mapic.backend.entities.*;
import com.mapic.backend.enums.FriendshipStatus;
import com.mapic.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/seed")
@RequiredArgsConstructor
public class SeedDataController {
    
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final LocationRepository locationRepository;
    private final PlaceRepository placeRepository;
    private final PlaceCheckInRepository placeCheckInRepository;
    private final PasswordEncoder passwordEncoder;
    
    @PostMapping("/all")
    public ResponseEntity<Map<String, Object>> seedAllData() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Seed users
            int usersCreated = seedUsers();
            result.put("usersCreated", usersCreated);
            
            // Seed friendships
            int friendshipsCreated = seedFriendships();
            result.put("friendshipsCreated", friendshipsCreated);
            
            // Seed locations
            int locationsCreated = seedLocations();
            result.put("locationsCreated", locationsCreated);
            
            // Seed places
            int placesCreated = seedPlaces();
            result.put("placesCreated", placesCreated);
            
            // Seed check-ins
            int checkInsCreated = seedCheckIns();
            result.put("checkInsCreated", checkInsCreated);
            
            result.put("success", true);
            result.put("message", "Seed data completed successfully!");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }
    
    private int seedUsers() {
        String password = passwordEncoder.encode("091005aE@");
        int count = 0;
        
        String[][] users = {
            {"user2@gmail.com", "Nguyễn Văn An", "0912345679", "4285F4"},
            {"user3@gmail.com", "Trần Thị Bình", "0912345680", "34A853"},
            {"user4@gmail.com", "Lê Minh Cường", "0912345681", "FBBC04"},
            {"user5@gmail.com", "Phạm Thu Dung", "0912345682", "EA4335"},
            {"user6@gmail.com", "Hoàng Văn Em", "0912345683", "9C27B0"},
            {"user7@gmail.com", "Đỗ Thị Phương", "0912345684", "FF5722"},
            {"user8@gmail.com", "Vũ Minh Giang", "0912345685", "00BCD4"},
            {"user9@gmail.com", "Bùi Thu Hà", "0912345686", "8BC34A"},
            {"user10@gmail.com", "Ngô Văn Ích", "0912345687", "FF9800"},
            {"user11@gmail.com", "Đinh Thị Kim", "0912345688", "E91E63"}
        };
        
        for (String[] userData : users) {
            if (!userRepository.findByEmail(userData[0]).isPresent()) {
                User user = new User();
                user.setEmail(userData[0]);
                user.setPassword(password);
                user.setFullName(userData[1]);
                user.setPhone(userData[2]);
                user.setAvatarUrl("https://ui-avatars.com/api/?name=" + 
                    userData[1].replace(" ", "+") + 
                    "&size=200&background=" + userData[3] + 
                    "&color=fff&bold=true");
                user.setActive(true);
                
                userRepository.save(user);
                count++;
            }
        }
        
        return count;
    }
    
    private int seedFriendships() {
        int count = 0;
        
        // Get user 1 by email
        User user1 = userRepository.findByEmail("daonguyennhatanh0910@gmail.com").orElse(null);
        if (user1 == null) {
            System.out.println("[SEED] User 1 not found, skipping friendships");
            return 0;
        }
        
        // User 1's friends (ACCEPTED)
        count += createFriendshipByEmail("daonguyennhatanh0910@gmail.com", "user2@gmail.com", FriendshipStatus.ACCEPTED);
        count += createFriendshipByEmail("daonguyennhatanh0910@gmail.com", "user3@gmail.com", FriendshipStatus.ACCEPTED);
        count += createFriendshipByEmail("daonguyennhatanh0910@gmail.com", "user4@gmail.com", FriendshipStatus.ACCEPTED);
        count += createFriendshipByEmail("daonguyennhatanh0910@gmail.com", "user5@gmail.com", FriendshipStatus.ACCEPTED);
        count += createFriendshipByEmail("daonguyennhatanh0910@gmail.com", "user6@gmail.com", FriendshipStatus.ACCEPTED);
        
        // Pending requests
        count += createFriendshipByEmail("daonguyennhatanh0910@gmail.com", "user7@gmail.com", FriendshipStatus.PENDING);
        count += createFriendshipByEmail("user8@gmail.com", "daonguyennhatanh0910@gmail.com", FriendshipStatus.PENDING);
        
        // Other friendships
        count += createFriendshipByEmail("user2@gmail.com", "user3@gmail.com", FriendshipStatus.ACCEPTED);
        count += createFriendshipByEmail("user2@gmail.com", "user4@gmail.com", FriendshipStatus.ACCEPTED);
        count += createFriendshipByEmail("user3@gmail.com", "user5@gmail.com", FriendshipStatus.ACCEPTED);
        
        return count;
    }
    
    private int createFriendshipByEmail(String userEmail, String friendEmail, FriendshipStatus status) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            User friend = userRepository.findByEmail(friendEmail).orElse(null);
            
            if (user == null || friend == null) {
                System.out.println("[SEED] User not found: " + userEmail + " or " + friendEmail);
                return 0;
            }
            
            // Check if friendship already exists
            if (friendshipRepository.findByUserIdAndFriendId(user.getId(), friend.getId()).isPresent()) {
                System.out.println("[SEED] Friendship already exists: " + userEmail + " -> " + friendEmail);
                return 0;
            }
            
            Friendship friendship = Friendship.builder()
                .user(user)
                .friend(friend)
                .status(status)
                .build();
            
            friendshipRepository.save(friendship);
            System.out.println("[SEED] Created friendship: " + userEmail + " -> " + friendEmail + " (" + status + ")");
            return 1;
        } catch (Exception e) {
            System.out.println("[SEED] Error creating friendship: " + e.getMessage());
            return 0;
        }
    }
    
    private int seedLocations() {
        int count = 0;
        
        // User 2: Quận 1
        count += createLocationByEmail("user2@gmail.com", 10.7797, 106.6991, "ACTIVE", 2);
        count += createLocationByEmail("user2@gmail.com", 10.7795, 106.6989, "MOVING", 5);
        
        // User 3: Quận 3
        count += createLocationByEmail("user3@gmail.com", 10.7825, 106.6920, "ACTIVE", 1);
        count += createLocationByEmail("user3@gmail.com", 10.7823, 106.6918, "MOVING", 8);
        
        // User 4: Quận 5
        count += createLocationByEmail("user4@gmail.com", 10.7550, 106.6650, "IDLE", 30);
        
        // User 5: Quận 7
        count += createLocationByEmail("user5@gmail.com", 10.7300, 106.7200, "ACTIVE", 5);
        
        // User 6: Quận 10
        count += createLocationByEmail("user6@gmail.com", 10.7700, 106.6700, "ACTIVE", 3);
        
        return count;
    }
    
    private int createLocationByEmail(String userEmail, double lat, double lng, String status, int minutesAgo) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                System.out.println("[SEED] User not found for location: " + userEmail);
                return 0;
            }
            
            Location location = Location.builder()
                .user(user)
                .latitude(lat)
                .longitude(lng)
                .accuracy(10.0)
                .speed(0.0)
                .heading(0.0)
                .status(status)
                .timestamp(LocalDateTime.now().minusMinutes(minutesAgo))
                .build();
            
            locationRepository.save(location);
            System.out.println("[SEED] Created location for: " + userEmail);
            return 1;
        } catch (Exception e) {
            System.out.println("[SEED] Error creating location: " + e.getMessage());
            return 0;
        }
    }
    
    private int seedPlaces() {
        int count = 0;
        
        String[][] places = {
            {"The Coffee House", "Chuỗi cà phê nổi tiếng", "CAFE", "10.7769", "106.7009", "86-88 Cao Thắng, Q3", "4.5"},
            {"Highlands Coffee", "Cà phê Việt Nam", "CAFE", "10.7797", "106.6991", "2 Công xã Paris, Q1", "4.3"},
            {"Phở 24", "Phở Hà Nội chính gốc", "RESTAURANT", "10.7625", "106.6820", "5 Nguyễn Trường Tộ, Q4", "4.8"},
            {"Quán Ăn Ngon", "Món ăn Việt Nam", "RESTAURANT", "10.7769", "106.7000", "138 Nam Kỳ Khởi Nghĩa, Q1", "4.7"},
            {"Công viên Tao Đàn", "Công viên lớn", "PARK", "10.7825", "106.6920", "Trương Định, Q3", "4.5"}
        };
        
        for (String[] placeData : places) {
            count += createPlace(placeData);
        }
        
        return count;
    }
    
    private int createPlace(String[] data) {
        try {
            Place place = Place.builder()
                .name(data[0])
                .description(data[1])
                .category(data[2])
                .latitude(Double.parseDouble(data[3]))
                .longitude(Double.parseDouble(data[4]))
                .address(data[5])
                .rating(Double.parseDouble(data[6]))
                .build();
            
            placeRepository.save(place);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }
    
    private int seedCheckIns() {
        int count = 0;
        
        // Get all places
        java.util.List<Place> places = placeRepository.findAll();
        if (places.isEmpty()) {
            System.out.println("[SEED] No places found for check-ins");
            return 0;
        }
        
        // Get users 1-6
        String[] userEmails = {
            "daonguyennhatanh0910@gmail.com",
            "user2@gmail.com",
            "user3@gmail.com",
            "user4@gmail.com",
            "user5@gmail.com",
            "user6@gmail.com"
        };
        
        for (String email : userEmails) {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) continue;
            
            // Each user checks in to 3-5 random places
            int checkInsPerUser = 3 + (int)(Math.random() * 3);
            
            for (int i = 0; i < checkInsPerUser; i++) {
                Place randomPlace = places.get((int)(Math.random() * places.size()));
                
                try {
                    PlaceCheckIn checkIn = PlaceCheckIn.builder()
                        .place(randomPlace)
                        .user(user)
                        .checkedInAt(LocalDateTime.now().minusDays((int)(Math.random() * 30)))
                        .build();
                    
                    placeCheckInRepository.save(checkIn);
                    count++;
                    System.out.println("[SEED] Created check-in: " + user.getEmail() + " -> " + randomPlace.getName());
                } catch (Exception e) {
                    // Skip duplicates
                    System.out.println("[SEED] Skipped duplicate check-in");
                }
            }
        }
        
        return count;
    }
}
