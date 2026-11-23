package com.project.parking.Service;

import java.time.LocalDateTime;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.project.parking.DTOs.MyTicketResponse;
import com.project.parking.DTOs.ParkingEntryRequest;
import com.project.parking.DTOs.ParkingEntryResponse;
import com.project.parking.Entity.ParkingSlot;
import com.project.parking.Entity.SlotStatus;
import com.project.parking.Entity.Ticket;
import com.project.parking.Entity.TicketStatus;
import com.project.parking.Entity.User;
import com.project.parking.Entity.Vehicle;
import com.project.parking.Entity.VehicleType;
import com.project.parking.Repository.BlacklistedUserRepository;
import com.project.parking.Repository.ParkingSlotRepository;
import com.project.parking.Repository.TicketRepository;
import com.project.parking.Repository.UserRepository;
import com.project.parking.Repository.VehicleRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
@RequiredArgsConstructor
public class ParkingEntryService {

        private final VehicleRepository vehicleRepository;
        private final ParkingSlotRepository parkingSlotRepository;
        private final TicketRepository ticketRepository;
        private final TicketService ticketService;
        private final UserRepository userRepository;
        private final BlacklistedUserRepository blacklistedUserRepository;

        @Transactional
        public MyTicketResponse enterVehicle(ParkingEntryRequest request) {

                //  vehicle number confirmation
                String vehicleNumber = request.getVehicleNumber().toUpperCase();

                if (!vehicleNumber.matches(
                                "^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$")) {

                        throw new IllegalArgumentException(
                                        "Invalid vehicle registration number");
                }

                //  authenticated user
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                String username = authentication.getName();

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                if (blacklistedUserRepository.existsByUser_Id(user.getId())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Entry denied! You have been blacklisted.");
                }

                // Find existing vehicle or create a new one
                Vehicle vehicle = vehicleRepository
                                .findByVehicleNumber(vehicleNumber)
                                .orElseGet(() -> {
                                        Vehicle newVehicle = new Vehicle();

                                        newVehicle.setVehicleNumber(vehicleNumber);
                                        newVehicle.setVehicleType(request.getVehicleType());
                                        newVehicle.setUser(user);

                                        return vehicleRepository.save(newVehicle);
                                });

                //  Ensure the vehicle belongs to the logged-in user
                if (vehicle.getUser() == null
                                || !vehicle.getUser().getId().equals(user.getId())) {

                        throw new IllegalStateException(
                                        "This vehicle belongs to another user");
                }

                //  Check whether the vehicle is already parked
                if (ticketRepository.existsByVehicleAndStatus(
                                vehicle, TicketStatus.ACTIVE)) {

                        throw new IllegalStateException(
                                        "Vehicle is already parked!");
                }

                // Find an available slot matching the vehicle type
                ParkingSlot slot = parkingSlotRepository
                                .findFirstByStatusAndSlotType(
                                                SlotStatus.AVAILABLE,
                                                request.getVehicleType())
                                .orElseThrow(() -> new IllegalStateException(
                                                "No parking slot available"));

                //  Occupy the slot
                slot.setStatus(SlotStatus.OCCUPIED);
                parkingSlotRepository.save(slot);

                //  Create ticket
                Ticket ticket = new Ticket();

                ticket.setVehicle(vehicle);
                ticket.setSlot(slot);
                ticket.setEntryTime(LocalDateTime.now());
                ticket.setStatus(TicketStatus.ACTIVE);
                ticket.setUid(ticketService.getTicketUid(10));

                Ticket savedTicket = ticketRepository.save(ticket);

                //  Prepare response
                MyTicketResponse response = new MyTicketResponse();

                response.setTicketUid(savedTicket.getUid());
                response.setVehicleNumber(
                                savedTicket.getVehicle().getVehicleNumber());
                response.setVehicleType(request.getVehicleType());
                response.setEntryTime(savedTicket.getEntryTime());
                response.setSlotNumber(
                                savedTicket.getSlot().getSlotNumber());
                response.setFloor(savedTicket.getSlot().getFloor());
                response.setZone(savedTicket.getSlot().getZone());
                response.setStatus(savedTicket.getStatus());

                return response;
        }
}
