package com.mapic.backend.repositories;

import com.mapic.backend.entities.Friendship;
import com.mapic.backend.entities.User;
import com.mapic.backend.enums.FriendshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    
    @Query("SELECT f FROM Friendship f WHERE " +
           "(f.user.id = :userId OR f.friend.id = :userId) " +
           "AND f.status = :status")
    List<Friendship> findByUserIdAndStatus(@Param("userId") Long userId, 
                                           @Param("status") FriendshipStatus status);
    
    @Query("SELECT f FROM Friendship f WHERE " +
           "((f.user.id = :userId AND f.friend.id = :friendId) OR " +
           "(f.user.id = :friendId AND f.friend.id = :userId))")
    Optional<Friendship> findByUserIdAndFriendId(@Param("userId") Long userId, 
                                                  @Param("friendId") Long friendId);
    
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Friendship f WHERE " +
           "((f.user.id = :userId AND f.friend.id = :friendId) OR " +
           "(f.user.id = :friendId AND f.friend.id = :userId)) " +
           "AND f.status = 'ACCEPTED'")
    boolean areFriends(@Param("userId") Long userId, @Param("friendId") Long friendId);
}
