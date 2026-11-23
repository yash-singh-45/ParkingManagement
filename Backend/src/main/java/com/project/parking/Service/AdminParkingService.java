package com.project.parking.Service;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.parking.DTOs.OccupiedSlotResponse;
import com.project.parking.Entity.ParkingSlot;
import com.project.parking.Entity.TicketStatus;
import com.project.parking.Entity.Vehicle;
import com.project.parking.Repository.TicketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class AdminParkingService {

    private final TicketRepository ticketRepository;

    public List<OccupiedSlotResponse> getOccupiedSlots() {

        return ticketRepository.findByStatus(TicketStatus.ACTIVE)
                .stream()
                .map(ticket -> {
                    ParkingSlot slot = ticket.getSlot();
                    Vehicle vehicle = ticket.getVehicle();

                    OccupiedSlotResponse response =
                            new OccupiedSlotResponse();

                    response.setSlotId(slot.getId());
                    response.setSlotNumber(slot.getSlotNumber());
                    response.setFloor(slot.getFloor());
                    response.setZone(slot.getZone());
                    response.setSlotType(slot.getSlotType());

                    response.setVehicleNumber(vehicle.getVehicleNumber());
                    response.setVehicleType(vehicle.getVehicleType());

                    response.setTicketUid(ticket.getUid());
                    response.setEntryTime(ticket.getEntryTime());

                    return response;
                })
                .toList();
    }
}