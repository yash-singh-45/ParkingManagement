package com.project.parking.DTOs;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class ParkingAvailabilityResponse {

    private long totalSlots;
    private long availableSlots;
    private long occupiedSlots;

    private double occupancyPercentage;

    private List<ParkingSlotResponse> slots;
}
