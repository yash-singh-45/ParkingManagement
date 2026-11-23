package com.project.parking.DTOs;

import com.project.parking.Entity.SlotStatus;
import com.project.parking.Entity.VehicleType;

import lombok.Data;

@Data
public class ParkingSlotResponse {

    private String slotNumber;
    private String floor;
    private String zone;
    private VehicleType slotType;
    private SlotStatus status;
}