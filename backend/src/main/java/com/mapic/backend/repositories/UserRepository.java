/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mapic.backend.repositories;
import com.mapic.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
/**
 *
 * @author HP
 */
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // Để tìm user khi đăng nhập
    Optional<User> findByPhone(String phone); // Để tìm user theo số điện thoại
}
