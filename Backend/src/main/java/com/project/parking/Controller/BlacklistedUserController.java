package com.project.parking.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.parking.DTOs.BlacklistUserRequest;
import com.project.parking.DTOs.BlacklistUserResponse;
import com.project.parking.Service.BlacklistedUserService;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping ("/api/admin/blacklisted-users")
@RequiredArgsConstructor 
public class BlacklistedUserController {

    private final BlacklistedUserService blacklistService;

    @PostMapping 
    public ResponseEntity<BlacklistUserResponse> blacklistUser(
             @RequestBody BlacklistUserRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(blacklistService.blacklistUser(request));
    }

    @GetMapping 
    public ResponseEntity<List<BlacklistUserResponse>> getAll() {

        return ResponseEntity.ok(
                blacklistService.getAllBlacklistedUsers());
    }

    @DeleteMapping ("/{userId}")
    public ResponseEntity<String> removeFromBlacklist(
            @PathVariable Long userId) {

        blacklistService.removeFromBlacklist(userId);

        return ResponseEntity.ok(
                "User removed from blacklist successfully");
    }
}