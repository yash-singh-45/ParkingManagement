package com.project.parking.DTOs;

import java.time.LocalDateTime;
import lombok.Data;

@Data 
public class ExitRequestResponse {

    private Long id;

    private String ticketUid;
    private String vehicleNumber;
    private String vehicleType;

    private String slotNumber;
    private String floor;
    private String zone;

    private LocalDateTime entryTime;
    private LocalDateTime requestedAt;

    private String status;
}