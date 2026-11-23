package com.project.parking.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.parking.DTOs.BlacklistUserRequest;
import com.project.parking.DTOs.BlacklistUserResponse;
import com.project.parking.Entity.BlacklistedUser;
import com.project.parking.Entity.User;
import com.project.parking.Repository.BlacklistedUserRepository;
import com.project.parking.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class BlacklistedUserService {

    private final BlacklistedUserRepository blacklistRepository;
    private final UserRepository userRepository;

    public BlacklistUserResponse blacklistUser(
            BlacklistUserRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new IllegalStateException("User not found"));

        if (blacklistRepository.existsByUser_Id(user.getId())) {
            throw new IllegalStateException(
                    "User is already blacklisted");
        }

        BlacklistedUser blacklistedUser = new BlacklistedUser();

        blacklistedUser.setUser(user);
        blacklistedUser.setReason(request.getReason().trim());
        blacklistedUser.setBlacklistedAt(LocalDateTime.now());

        return convertToResponse(
                blacklistRepository.save(blacklistedUser));
    }

    public List<BlacklistUserResponse> getAllBlacklistedUsers() {

        return blacklistRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public void removeFromBlacklist(Long userId) {

        BlacklistedUser blacklistedUser = blacklistRepository
                .findByUser_Id(userId)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "User is not blacklisted"));

        blacklistRepository.delete(blacklistedUser);
    }

    private BlacklistUserResponse convertToResponse(
            BlacklistedUser blacklistedUser) {

        BlacklistUserResponse response =
                new BlacklistUserResponse();

        response.setId(blacklistedUser.getId());
        response.setUserId(blacklistedUser.getUser().getId());
        response.setUsername(
                blacklistedUser.getUser().getUsername());
        response.setReason(blacklistedUser.getReason());
        response.setBlacklistedAt(
                blacklistedUser.getBlacklistedAt());

        return response;
    }
}