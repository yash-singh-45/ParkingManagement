package com.project.parking.DTOs;


import lombok.Data;

@Data
public class RegisterRequest {

    private String username;
    private String password;
}