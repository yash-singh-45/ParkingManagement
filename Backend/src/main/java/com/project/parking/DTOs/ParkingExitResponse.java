package com.project.parking.DTOs;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.project.parking.Entity.VehicleType;

import lombok.Data;

@Data
public class ParkingExitResponse {
    
    private String ticketUid;
    private String vehicleNumber;
    private String slotNumber;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private BigDecimal amount;
    private VehicleType vehicleType;

}
