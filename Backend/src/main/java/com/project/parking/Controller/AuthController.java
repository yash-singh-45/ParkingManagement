package com.project.parking.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.parking.DTOs.LoginRequest;
import com.project.parking.DTOs.LoginResponse;
import com.project.parking.DTOs.RegisterRequest;
import com.project.parking.DTOs.RegisterResponse;
import com.project.parking.Entity.User;
import com.project.parking.Security.JwtService;
import com.project.parking.Service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    
    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        
        RegisterResponse response = userService.register(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        User user = userService.authenticate(request);

        String token = jwtService.generateToken(user);

        LoginResponse response = new LoginResponse(token,user.getUsername(), user.getRole());

        return ResponseEntity.ok(response);
    }
    
    
}
