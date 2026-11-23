package com.project.parking.Repository;

import com.project.parking.Entity.ParkingSlot;
import com.project.parking.Entity.SlotStatus;
import com.project.parking.Entity.VehicleType;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParkingSlotRepository
        extends JpaRepository<ParkingSlot, Long> {

    List<ParkingSlot> findByStatus(SlotStatus status);

    List<ParkingSlot> findBySlotType(VehicleType slotType);

    List<ParkingSlot> findByFloor(String floor);

    List<ParkingSlot> findByZone(String zone);

    List<ParkingSlot> findByStatusAndSlotType(SlotStatus status, VehicleType slotType);

    Optional<ParkingSlot> findFirstByStatusAndSlotType(SlotStatus status, VehicleType slotType);

}