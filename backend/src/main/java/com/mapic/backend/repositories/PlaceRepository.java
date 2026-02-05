package com.mapic.backend.repositories;

import com.mapic.backend.entities.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    
    List<Place> findByCategory(String category);
    
    @Query("SELECT p FROM Place p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Place> searchByNameOrAddress(@Param("query") String query);
    
    @Query("SELECT p FROM Place p WHERE " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.address) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:category IS NULL OR p.category = :category)")
    List<Place> searchByQueryAndCategory(@Param("query") String query, 
                                         @Param("category") String category);
    
    @Query("SELECT p.category, COUNT(p) FROM Place p GROUP BY p.category")
    List<Object[]> countByCategory();
}
