package com.project.parking.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.parking.Entity.Vehicle;
import java.util.Optional;


public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);

    boolean existsByVehicleNumber(String vehicleNumber);
}
