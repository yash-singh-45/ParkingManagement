package com.project.parking.Service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.project.parking.DTOs.ParkingAvailabilityResponse;
import com.project.parking.DTOs.ParkingSlotRequest;
import com.project.parking.DTOs.ParkingSlotResponse;
import com.project.parking.Entity.ParkingSlot;
import com.project.parking.Entity.SlotStatus;
import com.project.parking.Entity.VehicleType;
import com.project.parking.Repository.ParkingSlotRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParkingSlotService {

    private final ParkingSlotRepository parkingSlotRepository;
    private final ModelMapper modelMapper;

    public ParkingSlotResponse createSlot(ParkingSlotRequest request) {

        ParkingSlot slot = modelMapper.map(request, ParkingSlot.class);

        slot.setStatus(SlotStatus.AVAILABLE);

        ParkingSlot savedSlot = parkingSlotRepository.save(slot);

        return modelMapper.map(savedSlot, ParkingSlotResponse.class);
    }

    public List<ParkingSlotResponse> getAllSlots() {
        List<ParkingSlot> slots = parkingSlotRepository.findAll();

        return slots.stream().map(slot -> modelMapper.map(slot, ParkingSlotResponse.class)).toList();
    }

    public List<ParkingSlotResponse> getAvailableSlots() {
        List<ParkingSlot> slots = parkingSlotRepository.findByStatus(SlotStatus.AVAILABLE);

        return slots.stream().map(slot -> modelMapper.map(slot, ParkingSlotResponse.class)).toList();
    }

    public List<ParkingSlotResponse> getAvailableSlotsByType(VehicleType slotType) {
        List<ParkingSlot> slots = parkingSlotRepository.findByStatusAndSlotType(SlotStatus.AVAILABLE, slotType);

        return slots.stream().map(slot -> modelMapper.map(slot, ParkingSlotResponse.class)).toList();
    }

    public ParkingSlotResponse getSlotById(Long id) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking slot not found: " + id));

        return modelMapper.map(slot, ParkingSlotResponse.class);
    }

    public ParkingSlotResponse updateSlotStatus(
            Long id,
            SlotStatus status) {

        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking slot not found: " + id));

        slot.setStatus(status);

        ParkingSlot savedSlot = parkingSlotRepository.save(slot);

        return modelMapper.map(savedSlot, ParkingSlotResponse.class);
    }

    public ParkingAvailabilityResponse getParkingAvailability() {

        List<ParkingSlot> slots = parkingSlotRepository.findAll();

        long total = slots.size();

        long available = slots.stream()
                .filter(slot -> slot.getStatus() == SlotStatus.AVAILABLE)
                .count();

        long occupied = slots.stream()
                .filter(slot -> slot.getStatus() == SlotStatus.OCCUPIED)
                .count();

        double percentage = total == 0
                ? 0
                : (occupied * 100.0) / total;

        List<ParkingSlotResponse> slotDTOs = slots.stream()
                .map(this::convertToDTO)
                .toList();

        ParkingAvailabilityResponse response = new ParkingAvailabilityResponse();

        response.setTotalSlots(total);
        response.setAvailableSlots(available);
        response.setOccupiedSlots(occupied);
        response.setOccupancyPercentage(
                Math.round(percentage * 100.0) / 100.0);
        response.setSlots(slotDTOs);

        return response;
    }

    private ParkingSlotResponse convertToDTO(ParkingSlot slot) {

    ParkingSlotResponse dto = new ParkingSlotResponse();

    dto.setSlotNumber(slot.getSlotNumber());
    dto.setFloor(slot.getFloor());
    dto.setZone(slot.getZone());
    dto.setSlotType(slot.getSlotType());
    dto.setStatus(slot.getStatus());

    return dto;
}
}
