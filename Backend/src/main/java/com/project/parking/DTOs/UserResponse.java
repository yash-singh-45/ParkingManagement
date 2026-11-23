package com.project.parking.DTOs;

import com.project.parking.Entity.Roles;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class UserResponse {

    private Long id;
    private String username;
    private Roles role;
}