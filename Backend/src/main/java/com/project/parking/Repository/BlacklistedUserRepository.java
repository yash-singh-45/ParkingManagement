package com.project.parking.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.parking.Entity.BlacklistedUser;
import com.project.parking.Entity.User;

public interface BlacklistedUserRepository
        extends JpaRepository<BlacklistedUser, Long> {

    Optional<BlacklistedUser> findByUser(User user);

    Optional<BlacklistedUser> findByUser_Id(Long userId);

    boolean existsByUser_Id(Long userId);
}