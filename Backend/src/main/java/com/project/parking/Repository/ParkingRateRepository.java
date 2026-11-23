package com.project.parking.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.parking.Entity.ParkingRate;
import com.project.parking.Entity.VehicleType;

public interface ParkingRateRepository
        extends JpaRepository<ParkingRate, Long> {

    Optional<ParkingRate> findBySlotType(VehicleType vehicleType);
}