package com.project.parking.DTOs;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.project.parking.Entity.ExitRequestStatus;
import com.project.parking.Entity.TicketStatus;
import com.project.parking.Entity.VehicleType;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class MyTicketResponse {

    private String ticketUid;

    private String vehicleNumber;
    private VehicleType vehicleType;

    private String slotNumber;
    private String floor;
    private String zone;

    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    private BigDecimal amount;

    private TicketStatus status;

    private ExitRequestStatus exitRequestStatus;
}