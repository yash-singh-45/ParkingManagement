package com.project.parking.DTOs;


import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class BlacklistUserRequest {

    private Long userId;

    private String reason;
}