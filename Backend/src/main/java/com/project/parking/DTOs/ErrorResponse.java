package com.project.parking.DTOs;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResponse {
    
    private LocalDateTime timeStamp;
    private int status;
    private String message;

}
