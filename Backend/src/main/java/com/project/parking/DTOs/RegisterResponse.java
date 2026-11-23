package com.project.parking.DTOs;

import com.project.parking.Entity.Roles;

import lombok.Data;

@Data
public class RegisterResponse {

    String username;
    Roles role;
}
