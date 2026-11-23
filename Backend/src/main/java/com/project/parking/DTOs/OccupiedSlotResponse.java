package com.project.parking.DTOs;

import java.time.LocalDateTime;

import com.project.parking.Entity.VehicleType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OccupiedSlotResponse {

    private Long slotId;
    private String slotNumber;
    private String floor;
    private String zone;
    private VehicleType slotType;

    private String vehicleNumber;
    private VehicleType vehicleType;

    private String ticketUid;
    private LocalDateTime entryTime;
}