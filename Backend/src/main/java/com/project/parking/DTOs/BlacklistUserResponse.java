package com.project.parking.DTOs;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class BlacklistUserResponse  {

    private Long id;
    private Long userId;
    private String username;
    private String reason;
    private LocalDateTime blacklistedAt;
}