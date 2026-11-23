package com.project.parking.DTOs;

import com.project.parking.Entity.VehicleType;

import lombok.Data;

@Data
public class ParkingSlotRequest {

    private String slotNumber;

    private String floor;

    private String zone;

    private VehicleType slotType;
}
