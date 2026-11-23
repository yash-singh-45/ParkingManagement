package com.project.parking.DTOs;

import com.project.parking.Entity.Roles;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    
    private String token;
    private String username;
    private Roles role;
}
