package com.project.parking.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.parking.DTOs.ParkingAvailabilityResponse;
import com.project.parking.DTOs.ParkingSlotRequest;
import com.project.parking.DTOs.ParkingSlotResponse;
import com.project.parking.Entity.SlotStatus;
import com.project.parking.Entity.VehicleType;
import com.project.parking.Service.ParkingSlotService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class ParkingSlotController {

    private final ParkingSlotService parkingSlotService;

    @PostMapping
    public ResponseEntity<ParkingSlotResponse> createSlot(@RequestBody ParkingSlotRequest request) {

        ParkingSlotResponse response = parkingSlotService.createSlot(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ParkingSlotResponse>> getAllSlots() {
        return ResponseEntity.ok(parkingSlotService.getAllSlots());
    }

    @GetMapping("/available")
    public ResponseEntity<List<ParkingSlotResponse>> getAvailableSlots() {
        return ResponseEntity.ok(parkingSlotService.getAvailableSlots());
    }

    @GetMapping("/available/{slotType}")
    public ResponseEntity<List<ParkingSlotResponse>> getAvailableSlotsByType(@PathVariable VehicleType slotType) {

        return ResponseEntity.ok(parkingSlotService.getAvailableSlotsByType(slotType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingSlotResponse> getSlotById(@PathVariable Long id) {

        return ResponseEntity.ok(parkingSlotService.getSlotById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ParkingSlotResponse> updateSlotStatus(
            @PathVariable Long id,
            @RequestParam SlotStatus status) {

        return ResponseEntity.ok(
                parkingSlotService.updateSlotStatus(id, status));
    }

    @GetMapping("/availability")
    public ResponseEntity<ParkingAvailabilityResponse> getParkingAvailability() {

        return ResponseEntity.ok(
                parkingSlotService.getParkingAvailability());
    }

}
