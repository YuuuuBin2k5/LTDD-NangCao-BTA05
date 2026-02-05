package com.mapic.backend.repositories;

import com.mapic.backend.entities.PlaceCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlaceCheckInRepository extends JpaRepository<PlaceCheckIn, Long> {
    
    @Query("SELECT COUNT(c) FROM PlaceCheckIn c WHERE c.place.id = :placeId")
    Long countByPlaceId(@Param("placeId") Long placeId);
    
    @Query("SELECT c FROM PlaceCheckIn c WHERE c.user.id = :userId ORDER BY c.checkedInAt DESC")
    List<PlaceCheckIn> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT c FROM PlaceCheckIn c WHERE c.place.id = :placeId AND c.user.id = :userId " +
           "AND CAST(c.checkedInAt AS date) = CURRENT_DATE")
    Optional<PlaceCheckIn> findTodayCheckIn(@Param("placeId") Long placeId, @Param("userId") Long userId);
}
