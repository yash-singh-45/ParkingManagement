package com.project.parking.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor 
@NoArgsConstructor 
public class FloorAnalyticsDTO {
    private String floor;
    private long totalSlots;
    private long availableSlots;
    private long occupiedSlots;
}