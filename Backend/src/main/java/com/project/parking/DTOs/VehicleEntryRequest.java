package com.project.parking.DTOs;

import com.project.parking.Entity.VehicleType;

import lombok.Data;

@Data
public class VehicleEntryRequest {

    private String vehicleNumber;

    private VehicleType vehicleType;
}