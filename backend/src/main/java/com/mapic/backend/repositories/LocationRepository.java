package com.mapic.backend.repositories;

import com.mapic.backend.entities.Location;
import com.mapic.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    
    // Get latest location for a user
    Optional<Location> findFirstByUserOrderByTimestampDesc(User user);
    
    // Alternative method name for latest location
    Optional<Location> findTopByUserOrderByTimestampDesc(User user);
    
    // Get latest location for user by ID
    @Query("SELECT l FROM Location l WHERE l.user.id = :userId ORDER BY l.timestamp DESC LIMIT 1")
    Optional<Location> findLatestByUserId(@Param("userId") Long userId);
    
    // Get location history after a certain time
    List<Location> findByUserAndTimestampAfterOrderByTimestampDesc(User user, LocalDateTime since);
    
    // Get all locations for a user within time range
    List<Location> findByUserAndTimestampBetweenOrderByTimestampDesc(
        User user, 
        LocalDateTime startTime, 
        LocalDateTime endTime
    );
    
    // Get latest locations for multiple users (for friends list)
    @Query("SELECT l FROM Location l WHERE l.user.id IN :userIds " +
           "AND l.timestamp = (SELECT MAX(l2.timestamp) FROM Location l2 WHERE l2.user.id = l.user.id)")
    List<Location> findLatestLocationsByUserIds(@Param("userIds") List<Long> userIds);
    
    // Delete old locations (cleanup)
    void deleteByTimestampBefore(LocalDateTime cutoffTime);
}
